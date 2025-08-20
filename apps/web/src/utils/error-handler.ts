import { AxiosError } from 'axios';
import { useUIStore } from '@/store/ui.store';
import { useAuthStore } from '@/store/auth.store';

export interface AppError {
  code: string;
  message: string;
  statusCode?: number;
  details?: any;
}

export class ErrorHandler {
  private static errorMessages: Record<string, string> = {
    // Authentication errors
    'AUTH_REQUIRED': '로그인이 필요합니다.',
    'TOKEN_EXPIRED': '세션이 만료되었습니다. 다시 로그인해주세요.',
    'INVALID_CREDENTIALS': '이메일 또는 비밀번호가 올바르지 않습니다.',
    
    // Auction errors
    'AUCTION_NOT_FOUND': '경매를 찾을 수 없습니다.',
    'AUCTION_ENDED': '이미 종료된 경매입니다.',
    'BID_TOO_LOW': '입찰 금액이 너무 낮습니다.',
    'BID_NOT_ALLOWED': '입찰할 수 없는 상태입니다.',
    'OWN_AUCTION_BID': '본인의 경매에는 입찰할 수 없습니다.',
    'AUCTION_NOT_RUNNING': '진행 중인 경매가 아닙니다.',
    'BID_ALREADY_EXISTS': '이미 동일한 금액으로 입찰하셨습니다.',
    'BUY_NOT_ALLOWED': '즉시 구매가 허용되지 않습니다.',
    
    // Payment errors
    'INSUFFICIENT_BALANCE': '잔액이 부족합니다.',
    'PAYMENT_FAILED': '결제 처리에 실패했습니다.',
    'INVALID_PAYMENT_METHOD': '유효하지 않은 결제 수단입니다.',
    
    // Validation errors
    'VALIDATION_ERROR': '입력값을 확인해주세요.',
    'PHONE_VERIFICATION_REQUIRED': '휴대폰 인증이 필요합니다.',
    
    // Network errors
    'NETWORK_ERROR': '네트워크 연결을 확인해주세요.',
    'TIMEOUT': '요청 시간이 초과되었습니다.',
    'SERVER_ERROR': '서버 오류가 발생했습니다.',
    'INTERNAL_SERVER_ERROR': '서버 내부 오류가 발생했습니다.',
  };

  static handle(error: unknown): AppError {
    if (error instanceof AxiosError) {
      return this.handleAxiosError(error);
    }
    
    if (error instanceof Error) {
      return this.handleGenericError(error);
    }
    
    return {
      code: 'UNKNOWN_ERROR',
      message: '알 수 없는 오류가 발생했습니다.',
    };
  }

  private static handleAxiosError(error: AxiosError): AppError {
    const { showError, openModal } = useUIStore.getState();
    const { logout } = useAuthStore.getState();
    
    // Handle network errors
    if (!error.response) {
      const appError: AppError = {
        code: 'NETWORK_ERROR',
        message: this.errorMessages['NETWORK_ERROR'],
      };
      showError(appError.message);
      return appError;
    }
    
    const { status, data } = error.response;
    const errorCode = (data as any)?.code || 'UNKNOWN_ERROR';
    const errorMessage = this.errorMessages[errorCode] || 
                        (data as any)?.message || 
                        '오류가 발생했습니다.';
    
    // Handle authentication errors
    if (status === 401) {
      logout();
      openModal({
        type: 'confirm',
        props: {
          title: '로그인 필요',
          message: '세션이 만료되었습니다. 다시 로그인해주세요.',
          confirmText: '로그인',
          onConfirm: () => {
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
          },
        },
      });
    }
    
    // Handle other errors
    const appError: AppError = {
      code: errorCode,
      message: errorMessage,
      statusCode: status,
      details: data,
    };
    
    // Show error based on severity
    if (status >= 500) {
      openModal({
        type: 'error',
        props: {
          title: '서버 오류',
          message: errorMessage,
          details: process.env.NODE_ENV === 'development' ? data : undefined,
        },
      });
    } else if (status !== 401) {
      showError(errorMessage);
    }
    
    return appError;
  }

  private static handleGenericError(error: Error): AppError {
    const { showError } = useUIStore.getState();
    
    const appError: AppError = {
      code: 'CLIENT_ERROR',
      message: error.message || '오류가 발생했습니다.',
      details: error.stack,
    };
    
    showError(appError.message);
    
    return appError;
  }

  static async withErrorHandling<T>(
    fn: () => Promise<T>,
    options?: {
      showError?: boolean;
      fallback?: T;
      retries?: number;
      retryDelay?: number;
    }
  ): Promise<T> {
    const { showError = true, fallback, retries = 0, retryDelay = 1000 } = options || {};
    
    let lastError: AppError | undefined;
    
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = this.handle(error);
        
        if (attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
        }
      }
    }
    
    if (!showError && lastError) {
      console.error('Suppressed error:', lastError);
    }
    
    if (fallback !== undefined) {
      return fallback;
    }
    
    throw lastError;
  }
}

// React Query global error handler
export const queryErrorHandler = (error: unknown) => {
  ErrorHandler.handle(error);
};