import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export type ModalType =
  | 'confirm'
  | 'bid'
  | 'buyNow'
  | 'error'
  | 'success'
  | 'phoneVerification'
  | 'custom'

export interface Modal {
  id: string
  type: ModalType
  props?: any
  onClose?: () => void
  onConfirm?: () => void
}

export interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  duration?: number
}

interface UIState {
  // Modal state
  modals: Modal[]
  openModal: (modal: Omit<Modal, 'id'>) => string
  closeModal: (id: string) => void
  closeAllModals: () => void

  // Toast notifications
  toasts: Toast[]
  showToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void

  // Convenience methods
  showError: (message: string) => void
  showSuccess: (message: string) => void
  showWarning: (message: string) => void
  showInfo: (message: string) => void

  // Loading states
  loadingStates: Map<string, boolean>
  setLoading: (key: string, isLoading: boolean) => void
  isLoading: (key: string) => boolean

  // Global error state
  globalError: Error | null
  setGlobalError: (error: Error | null) => void
}

export const useUIStore = create<UIState>()(
  devtools(
    (set, get) => ({
      modals: [],
      toasts: [],
      loadingStates: new Map(),
      globalError: null,

      openModal: (modal) => {
        const id = `modal-${Date.now()}-${Math.random()}`
        set(
          (state) => ({
            modals: [...state.modals, { ...modal, id }],
          }),
          false,
          'ui/openModal',
        )
        return id
      },

      closeModal: (id) => {
        set(
          (state) => ({
            modals: state.modals.filter((m) => m.id !== id),
          }),
          false,
          'ui/closeModal',
        )
      },

      closeAllModals: () => {
        set({ modals: [] }, false, 'ui/closeAllModals')
      },

      showToast: (toast) => {
        const id = `toast-${Date.now()}`
        const newToast = { ...toast, id }

        set(
          (state) => ({
            toasts: [...state.toasts, newToast],
          }),
          false,
          'ui/showToast',
        )

        // Auto remove after duration
        setTimeout(() => {
          get().removeToast(id)
        }, toast.duration || 5000)
      },

      removeToast: (id) => {
        set(
          (state) => ({
            toasts: state.toasts.filter((t) => t.id !== id),
          }),
          false,
          'ui/removeToast',
        )
      },

      showError: (message) => {
        get().showToast({ type: 'error', message })
      },

      showSuccess: (message) => {
        get().showToast({ type: 'success', message })
      },

      showWarning: (message) => {
        get().showToast({ type: 'warning', message })
      },

      showInfo: (message) => {
        get().showToast({ type: 'info', message })
      },

      setLoading: (key, isLoading) => {
        set(
          (state) => {
            const newLoadingStates = new Map(state.loadingStates)
            if (isLoading) {
              newLoadingStates.set(key, true)
            } else {
              newLoadingStates.delete(key)
            }
            return { loadingStates: newLoadingStates }
          },
          false,
          'ui/setLoading',
        )
      },

      isLoading: (key) => {
        return get().loadingStates.get(key) || false
      },

      setGlobalError: (error) => {
        set({ globalError: error }, false, 'ui/setGlobalError')
        if (error) {
          get().showError(error.message)
        }
      },
    }),
    {
      name: 'ui-store',
    },
  ),
)
