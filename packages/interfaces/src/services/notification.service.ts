import { toast, ToastOptions } from 'react-toastify';

/**
 * Servicio de Notificaciones Premium Simplapp
 * Basado en react-toastify con estilos personalizados
 */
export const notify = {
  success: (message: string, options?: ToastOptions) => {
    toast.success(message, {
      ...options,
      className: 'simplapp-toast simplapp-toast-success',
    });
  },
  error: (message: string, options?: ToastOptions) => {
    toast.error(message, {
      ...options,
      className: 'simplapp-toast simplapp-toast-error',
    });
  },
  info: (message: string, options?: ToastOptions) => {
    toast.info(message, {
      ...options,
      className: 'simplapp-toast simplapp-toast-info',
    });
  },
  warn: (message: string, options?: ToastOptions) => {
    toast.warning(message, {
      ...options,
      className: 'simplapp-toast simplapp-toast-warn',
    });
  },
  loading: (message: string, options?: ToastOptions) => {
    return toast.loading(message, {
      ...options,
      className: 'simplapp-toast simplapp-toast-loading',
    });
  },
  promise: <T>(
    promise: Promise<T>,
    msgs: { loading: string; success: string; error: string },
    options?: ToastOptions
  ) => {
    return toast.promise(promise, msgs, {
      ...options,
      className: 'simplapp-toast',
    });
  },
};
