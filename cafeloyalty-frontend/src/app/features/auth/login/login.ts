import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginPage {
  loading = signal(false);
  errorMessage = signal<string | null>(null);
  showConfirmPassword = signal(false);
  showPassword = signal(false);
  form: FormGroup;
  successMessage = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  togglePassword() {
    this.showPassword.update(v => !v);
  }

  toggleConfirmPassword() {
    this.showConfirmPassword.update(v => !v);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const { email, password } = this.form.value;

    this.authService.login({ email, password }).subscribe({
      next: () => {
        this.loading.set(false);
        this.successMessage.set('Welcome back!');

        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1000); // shorter than register's 1.5s — login should feel snappy
      },
      error: (err) => {
        this.loading.set(false);

        if (typeof err.error === 'string' && err.error) {
          this.errorMessage.set(err.error);
        } else {
          this.errorMessage.set(err?.error?.message ?? 'Login failed. Please try again.');
        }
      }
    });
  }
}