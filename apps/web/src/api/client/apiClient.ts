import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.nafalmvp.com/users/v1'
const TIMEOUT = Number(process.env.NEXT_PUBLIC_API_TIMEOUT) || 30000

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage or Zustand store
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Add request timestamp for performance monitoring
    ;(config as any).metadata = { startTime: new Date() }

    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  },
)

// Response interceptor for error handling and performance monitoring
apiClient.interceptors.response.use(
  (response) => {
    // Log response time in development
    if (process.env.NODE_ENV === 'development') {
      const endTime = new Date()
      const startTime = (response.config as any).metadata?.startTime
      if (startTime) {
        const duration = endTime.getTime() - startTime.getTime()
        console.log(
          `API Call: ${response.config.method?.toUpperCase()} ${response.config.url} - ${duration}ms`,
        )
      }
    }

    return response
  },
  async (error: AxiosError) => {
    // Handle specific error cases
    if (error.response) {
      const status = error.response.status
      const data = error.response.data as any

      switch (status) {
        case 401:
          // Token expired or invalid - handle in auth store
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth-token')
            // Redirect will be handled by auth store
          }
          break

        case 403:
          console.error('Permission denied:', data?.message || 'Forbidden')
          break

        case 404:
          console.error('Resource not found:', data?.message || 'Not Found')
          break

        case 429:
          console.error('Rate limit exceeded:', data?.message || 'Too Many Requests')
          break

        case 500:
        case 502:
        case 503:
        case 504:
          console.error('Server error:', data?.message || 'Internal Server Error')
          break
      }
    } else if (error.request) {
      console.error('Network error: No response received')
    } else {
      console.error('Request error:', error.message)
    }

    return Promise.reject(error)
  },
)

export default apiClient
