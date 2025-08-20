// User Related Types

export interface UserRead {
  id: number;
  email: string;
  nickname: string;
  phone_number?: string;
  profile_image_url?: string;
  is_phone_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserUpdate {
  nickname?: string;
  phone_number?: string;
  profile_image_url?: string;
}

export interface PhoneVerificationRequest {
  phone_number: string;
}

export interface PhoneVerificationConfirm {
  phone_number: string;
  verification_code: string;
}

export interface SendSMSResult {
  success: boolean;
  message: string;
  expires_at?: string;
}

export interface PhoneVerificationResult {
  success: boolean;
  message: string;
  is_verified?: boolean;
}