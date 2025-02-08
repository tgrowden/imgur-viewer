import { ErrorComponent, type ErrorComponentProps, Navigate } from '@tanstack/react-router'
import { AxiosError } from 'axios'
import { toast } from 'sonner'

type RedirectErrorHandlerProps = ErrorComponentProps & { toastMessage?: string | false }

/**
 * Used as an `errorComponent`--it displays a toast message and redirects if the error is a 404.
 */
export function RedirectErrorHandler({ toastMessage = 'Not found', error, ...props }: RedirectErrorHandlerProps) {
  if (error instanceof AxiosError) {
    if (error.status === 404) {
      if (toastMessage) {
        toast.error(toastMessage, { id: toastMessage, duration: 5000, dismissible: true, closeButton: true })
      }
      return <Navigate to="/" replace />
    }
  }

  return <ErrorComponent {...props} error={error} />
}
