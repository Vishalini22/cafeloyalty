import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CustomerService } from '../../core/services/customer.service';
import { AuthService } from '../../core/services/auth.service';
import { Customer } from '../../core/models/customer.model';
import { Tier } from '../../core/models/customer.model';


interface TierInfo {
  label: string;
  min: number;
  max: number | null; // null = no upper bound (top tier)
}

const TIER_THRESHOLDS: Record<Tier, TierInfo> = {
  [Tier.Regular]: { label: 'Regular', min: 0, max: 499 },
  [Tier.CoffeeEnthusiast]: { label: 'Coffee Enthusiast', min: 500, max: 1499 },
  [Tier.CoffeeConnoisseur]: { label: 'Coffee Connoisseur', min: 1500, max: null }
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})


export class DashboardPage implements OnInit {
  customer = signal<Customer | null>(null);
  loading = signal(true);
  errorMessage = signal<string | null>(null);

  // Derived values for the tier progress bar
  tierInfo = computed<TierInfo | null>(() => {
    const c = this.customer();
    return c ? TIER_THRESHOLDS[c.tier] : null;
  });

  progressPercent = computed<number>(() => {
    const c = this.customer();
    const info = this.tierInfo();
    if (!c || !info) return 0;

    if (info.max === null) return 100; // top tier — bar is always full

    const range = info.max - info.min + 1;
    const progressInRange = c.lifetimePoints - info.min;
    return Math.min(100, Math.max(0, (progressInRange / range) * 100));
  });

  pointsToNextTier = computed<number | null>(() => {
    const c = this.customer();
    const info = this.tierInfo();
    if (!c || !info || info.max === null) return null;
    return Math.max(0, info.max + 1 - c.lifetimePoints);
  });

  nextTierLabel = computed<string | null>(() => {
    const c = this.customer();
    if (!c) return null;
    if (c.tier === Tier.Regular) return 'Coffee Enthusiast';
    if (c.tier === Tier.CoffeeEnthusiast) return 'Coffee Connoisseur';
    return null; // already top tier
  });

  constructor(
    private customerService: CustomerService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (this.isAdmin()) {
      this.loading.set(false);
      return;
    }
    this.loadCustomer();
  }

  loadCustomer(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.customerService.getMe().subscribe({
      next: (data) => {
        this.customer.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);

        if (err.status === 401) {
          // Token expired or invalid — send back to login
          this.authService.logout();
          this.router.navigate(['/login']);
          return;
        }

        this.errorMessage.set(
          typeof err.error === 'string' && err.error
            ? err.error
            : 'Could not load your account. Please try again.'
        );
      }
    });
  }

  isAdmin = computed<boolean>(() => {
    const role = this.authService.role();
    return role === 'Admin' ;
  });

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}