import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TransactionService } from '../../core/services/transaction.service';
import { CustomerService } from '../../core/services/customer.service';
import { AuthService } from '../../core/services/auth.service';
import { Transaction } from '../../core/models/transaction.model';

@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {
  transactions = signal<Transaction[]>([]);
  loading = signal(true);
  errorMessage = signal<string | null>(null);

  constructor(
    private transactionService: TransactionService,
    private customerService: CustomerService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.customerService.getMe().subscribe({
      next: (customer) => {
        this.transactionService.getCustomerTransactions(customer.id).subscribe({
          next: (data) => {
            // Most recent first
            const sorted = [...data].sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            );
            this.transactions.set(sorted);
            this.loading.set(false);
          },
          error: (err) => this.handleError(err)
        });
      },
      error: (err) => this.handleError(err)
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  private handleError(err: any): void {
    this.loading.set(false);

    if (err.status === 401) {
      this.authService.logout();
      this.router.navigate(['/login']);
      return;
    }

    this.errorMessage.set(
      typeof err.error === 'string' && err.error
        ? err.error
        : 'Could not load your transaction history. Please try again.'
    );
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}