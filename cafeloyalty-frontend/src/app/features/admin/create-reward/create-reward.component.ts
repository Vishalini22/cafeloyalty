import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RewardService } from '../../../core/services/reward.service';
import { Reward } from '../../../core/models/reward.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-create-reward',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './create-reward.component.html',
  styleUrls: ['./create-reward.component.scss']
})
export class CreateRewardComponent implements OnInit {
  name: string = '';
  description: string = '';
  pointsCost: number | null = null;

  submitting = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  lastRewardName = signal<string>('');
  showToast = signal(false);
  private toastTimeout?: ReturnType<typeof setTimeout>;

  recentRewards = signal<Reward[]>([]);
  loadingRewards = signal(true);

  constructor(
    private rewardService: RewardService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.rewardService.getAllRewards().subscribe({
      next: (data) => {
        this.recentRewards.set(data);
        this.loadingRewards.set(false);
      },
      error: () => this.loadingRewards.set(false)
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  submit(): void {
    if (!this.name || !this.description || !this.pointsCost || this.pointsCost <= 0) {
      this.errorMessage.set('Fill in all fields with a valid points cost.');
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const payload = {
      name: this.name,
      description: this.description,
      pointsCost: this.pointsCost
    };

    this.rewardService.createReward(payload).subscribe({
      next: (created: Reward) => {
        this.submitting.set(false);
        this.successMessage.set(`"${created.name}" was created successfully.`);
        this.lastRewardName.set(created.name);

        this.recentRewards.update(list => [created, ...list].slice(0, 10));

        this.name = '';
        this.description = '';
        this.pointsCost = null;

        this.showToast.set(true);
        if (this.toastTimeout) {
          clearTimeout(this.toastTimeout);
        }
        this.toastTimeout = setTimeout(() => this.showToast.set(false), 3500);
      },
      error: (err) => {
        this.submitting.set(false);
        this.errorMessage.set(
          typeof err.error === 'string' && err.error
            ? err.error
            : 'Could not create reward. Please try again.'
        );
      }
    });
  }
}