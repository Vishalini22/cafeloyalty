import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TransactionService } from '../../../core/services/transaction.service';
import { TransactionResponse } from '../../../core/models/transaction.model';
import { CustomerService } from '../../../core/services/customer.service';
import { Customer, Tier } from '../../../core/models/customer.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-record-transaction',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './record-transaction.component.html',
  styleUrls: ['./record-transaction.component.scss']
})
export class RecordTransactionComponent implements OnInit {
  customers = signal<Customer[]>([]);
  customersError = signal<string | null>(null);

  customerId = signal<number | null>(null);
  amount: number | null = null;
  notes: string = '';

  submitting = signal(false);
  errorMessage = signal<string | null>(null);
  result = signal<TransactionResponse | null>(null);

  // Captured at submit time, since customerId is cleared after a successful submit
  lastCustomerName = signal<string>('');

  showToast = signal(false);
  private toastTimeout?: ReturnType<typeof setTimeout>;

  // Live customer snapshot — recomputes whenever customerId or customers() changes
  selectedCustomer = computed(() => {
    const id = this.customerId();
    return this.customers().find(c => c.id === id) ?? null;
  });

  constructor(
    private transactionService: TransactionService,
    private customerService: CustomerService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.customerService.getAllCustomers().subscribe({
      next: (data) => this.customers.set(data),
      error: () => this.customersError.set('Could not load customer list.')
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  submit(): void {
    const id = this.customerId();

    if (!id || !this.amount || this.amount <= 0) {
      this.errorMessage.set('Enter a valid customer ID and amount.');
      return;
    }

    const selected = this.customers().find(c => c.id === id);

    this.submitting.set(true);
    this.errorMessage.set(null);
    this.result.set(null);

    this.transactionService.recordTransaction({
      customerId: id,
      amount: this.amount,
      notes: this.notes || undefined
    }).subscribe({
      next: (res) => {
        this.submitting.set(false);
        this.result.set(res);
        this.lastCustomerName.set(selected ? selected.name : '');

        // Update this customer's record in place so their snapshot shows fresh data next time they're picked
        if (id !== null) {
          this.customers.update(list =>
            list.map(c =>
              c.id === id
                ? { ...c, pointsBalance: res.newPointsBalance, lifetimePoints: res.newLifetimePoints, tier: res.tier as Tier }
                : c
            )
          );
      }

        this.customerId.set(null);
      this.amount = null;
      this.notes = '';

      this.showToast.set(true);
      if(this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
    this.toastTimeout = setTimeout(() => this.showToast.set(false), 3500);
  },
  error: (err) => {
        this.submitting.set(false);
this.errorMessage.set(
  typeof err.error === 'string' && err.error
    ? err.error
    : 'Could not record transaction. Please try again.'
);
      }
    });
  }

tierEmoji(tier: string): string {
  switch (tier?.toLowerCase()) {
    case 'gold': return '🥇';
    case 'silver': return '🥈';
    case 'bronze': return '🥉';
    case 'platinum': return '💎';
    default: return '☕';
  }
}

tierClass(tier: string): string {
  switch (tier?.toLowerCase()) {
    case 'gold': return 'tier-gold';
    case 'silver': return 'tier-silver';
    case 'bronze': return 'tier-bronze';
    case 'platinum': return 'tier-platinum';
    default: return 'tier-regular';
  }
}
}