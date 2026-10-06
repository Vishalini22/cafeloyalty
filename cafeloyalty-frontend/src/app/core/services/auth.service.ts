import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, JwtPayload, LoginRequest, RegisterRequest } from '../models/auth.model';

const TOKEN_KEY = 'cafeloyalty_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenSignal = signal<string | null>(localStorage.getItem(TOKEN_KEY));

  // Anything reading auth state (guards, nav, dashboard) should use these,
  // not localStorage directly, so they stay in sync when the user logs out.
  readonly token = computed(() => this.tokenSignal());
  readonly isAuthenticated = computed(() => !!this.tokenSignal());
  readonly currentUser = computed<JwtPayload | null>(() => {
    const token = this.tokenSignal();
    return token ? this.decodeToken(token) : null;
  });
  readonly role = computed(() => this.currentUser()?.role ?? null);

  constructor(private http: HttpClient) { }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/login`, request)
      .pipe(tap((res) => this.setSession(res.token)));
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, data);
    // No setSession() call — registration no longer logs the user in automatically
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.tokenSignal.set(null);
  }

  private setSession(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
    this.tokenSignal.set(token);
  }

  // NOTE: if TokenService used ClaimTypes.Role instead of a plain "role" claim,
  // .NET serializes it as the long URI
  // "http://schemas.microsoft.com/ws/2008/06/identity/claims/role" instead of "role".
  // Paste a real token into jwt.io once to confirm the actual claim keys, and adjust
  // JwtPayload / the `role` computed above if they don't match.
  private decodeToken(token: string): JwtPayload | null {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      const raw = JSON.parse(decoded);

      return {
        sub: raw.sub,
        email: raw.email,
        name: raw['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
        role: raw['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
        exp: raw.exp
      } as JwtPayload;
    } catch {
      return null;
    }
  }
}
