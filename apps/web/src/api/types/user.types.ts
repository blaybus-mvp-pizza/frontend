// User Related Types

export interface UserRead {
  id: number
  email: string
  nickname: string
  phone_number?: string
  profile_image_url?: string
  is_phone_verified: boolean
  created_at: string
  updated_at: string
}

export interface UserUpdate {
  nickname: string
  phone_number?: string | null
  profile_image_url?: string | null
  is_phone_verified?: boolean  // Backend has default False, so optional in request
}

// Backend SMS/Verification response types (from backend models.py)
export interface SendSMSResult {
  success: boolean
  expires_at?: string
}

export interface PhoneVerificationResult {
  success: boolean
}
