export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

// Adjust to match whatever your AuthController actually returns.
// If it only returns a token, drop the extra fields and decode the JWT instead.
export interface AuthResponse {
  token: string;
  name?: string;
  email?: string;
  role?: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  name: string;
  role: string;
  jti: string;
  exp: number;
  [key: string]: unknown;
}
