// Authentication Related Types

export interface LoginResponse {
  access_token: string;
  token_type: 'bearer';
  expires_in?: number;
  refresh_token?: string;
}

export interface GoogleLoginUrlResponse {
  login_url: string;
}

export interface TokenPayload {
  sub: string; // user_id as string
  exp: number; // expiration timestamp
  iat?: number; // issued at timestamp
  email?: string;
}