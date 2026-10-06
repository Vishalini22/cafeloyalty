import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
function passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  return password && confirmPassword && password !== confirmPassword
    ? { passwordMismatch: true }
    : null;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

export class RegisterPage {
  form: FormGroup;
  loading = signal(false);
  showConfirmPassword = signal(false);
  showPassword = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]]
      },
      { validators: passwordsMatchValidator }
    );
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

    const { name, email, password } = this.form.value;

    this.authService.register({ name, email, password }).subscribe({
      next: () => {
        this.loading.set(false);
        this.successMessage.set('Account created successfully!');

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (err) => {
        this.loading.set(false);

        if (typeof err.error === 'string' && err.error) {
          this.errorMessage.set(err.error);
        } else {
          this.errorMessage.set(err?.error?.message ?? 'Registration failed. Please try again.');
        }
      }
    });
  }
}