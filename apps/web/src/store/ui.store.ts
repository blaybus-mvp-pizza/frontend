import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { toast } from 'sonner'

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


interface UIState {
  // Modal state
  modals: Modal[]
  openModal: (modal: Omit<Modal, 'id'>) => string
  closeModal: (id: string) => void
  closeAllModals: () => void

  // Toast notifications (using sonner)
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

      showError: (message) => {
        toast.error(message)
      },

      showSuccess: (message) => {
        toast.success(message)
      },

      showWarning: (message) => {
        toast(message, {
          icon: '⚠️',
          style: {
            background: '#FEF3C7',
            color: '#92400E',
            border: '1px solid #FDE68A',
          },
        })
      },

      showInfo: (message) => {
        toast.info(message)
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
