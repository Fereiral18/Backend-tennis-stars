export interface AuthUserResponse {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUserResponse;
}
