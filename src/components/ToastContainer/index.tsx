'use client';

import { useState, useCallback, useEffect } from 'react';
import Toast, { ToastType } from '../Toast';

export interface ToastData {
  id: string;
  mensagem: string;
  tipo: ToastType;
  duracao?: number;
}

let toasts: ToastData[] = [];
let listeners: Array<(toasts: ToastData[]) => void> = [];

const notify = (toast: ToastData) => {
  toasts = [...toasts, toast];
  listeners.forEach((listener) => listener(toasts));
  return toast.id;
};

export const toast = {
  success: (mensagem: string, duracao?: number) => {
    const id = `${Date.now()}-${Math.random()}`;
    return notify({ id, mensagem, tipo: 'success', duracao });
  },
  error: (mensagem: string, duracao?: number) => {
    const id = `${Date.now()}-${Math.random()}`;
    return notify({ id, mensagem, tipo: 'error', duracao });
  },
  info: (mensagem: string, duracao?: number) => {
    const id = `${Date.now()}-${Math.random()}`;
    return notify({ id, mensagem, tipo: 'info', duracao });
  },
  warning: (mensagem: string, duracao?: number) => {
    const id = `${Date.now()}-${Math.random()}`;
    return notify({ id, mensagem, tipo: 'warning', duracao });
  },
};

const ToastContainer = () => {
  const [toastsList, setToastsList] = useState<ToastData[]>([]);

  useEffect(() => {
    const listener = (newToasts: ToastData[]) => {
      setToastsList(newToasts);
    };
    listeners.push(listener);
    setToastsList(toasts);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  const handleClose = useCallback((id: string) => {
    toasts = toasts.filter((t) => t.id !== id);
    listeners.forEach((listener) => listener(toasts));
  }, []);

  return (
    <>
      {toastsList.map((toastItem) => (
        <Toast key={toastItem.id} {...toastItem} onClose={handleClose} />
      ))}
    </>
  );
};

export default ToastContainer;

