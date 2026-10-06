import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RewardService } from '../../core/services/reward.service';
import { CustomerService } from '../../core/services/customer.service';
import { AuthService } from '../../core/services/auth.service';
import { Reward } from '../../core/models/reward.model';
import { Customer } from '../../core/models/customer.model';

@Component({
  selector: 'app-reward',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reward.component.html',
  styleUrls: ['./reward.component.scss']
})
export class RewardComponent implements OnInit {
  rewards = signal<Reward[]>([]);
  customer = signal<Customer | null>(null);
  loading = signal(true);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  // Confirmation modal state
  pendingReward = signal<Reward | null>(null);
  redeeming = signal(false);

  currentPoints = computed(() => this.customer()?.pointsBalance ?? 0);

  constructor(
    private rewardService: RewardService,
    private customerService: CustomerService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  loadData(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    // Load customer (for points balance) and rewards in parallel
    this.customerService.getMe().subscribe({
      next: (c) => this.customer.set(c),
      error: (err) => this.handleError(err)
    });

    this.rewardService.getActiveRewards().subscribe({
      next: (data) => {
        this.rewards.set(data);
        this.loading.set(false);
      },
      error: (err) => this.handleError(err)
    });
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
        : 'Could not load rewards. Please try again.'
    );
  }

  canAfford(reward: Reward): boolean {
    return this.currentPoints() >= reward.pointsCost;
  }

  // Step 1 — user clicks "Redeem", opens confirmation
  openConfirm(reward: Reward): void {
    this.pendingReward.set(reward);
  }

  cancelConfirm(): void {
    this.pendingReward.set(null);
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  // Step 2 — user confirms in the modal
  confirmRedeem(): void {
    const reward = this.pendingReward();
    const customer = this.customer();
    if (!reward || !customer) return;

    this.redeeming.set(true);
    this.errorMessage.set(null);

    this.rewardService.redeem({ customerId: customer.id, rewardId: reward.id }).subscribe({
      next: (res) => {
        this.redeeming.set(false);
        this.pendingReward.set(null);
        this.successMessage.set(`Redeemed: ${res.rewardName}!`);

        // Update local points balance immediately without a full reload
        this.customer.update((c) =>
          c ? { ...c, pointsBalance: res.remainingPointsBalance } : c
        );

        setTimeout(() => this.successMessage.set(null), 3000);
      },
      error: (err) => {
        this.redeeming.set(false);
        this.pendingReward.set(null);

        this.errorMessage.set(
          typeof err.error === 'string' && err.error
            ? err.error
            : 'Redemption failed. Please try again.'
        );
      }
    });
  }
}