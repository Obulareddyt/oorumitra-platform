import { useEffect } from 'react'

export default function Toast({ toasts, remove }) {
  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} remove={remove} />
      ))}
    </div>
  )
}

function ToastItem({ toast, remove }) {
  useEffect(() => {
    const id = setTimeout(() => remove(toast.id), toast.duration ?? 4000)
    return () => clearTimeout(id)
  }, [toast, remove])

  const colours = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-blue-600',
    warning: 'bg-yellow-500',
  }

  return (
    <div className={`flex items-start gap-3 ${colours[toast.type] ?? 'bg-gray-700'} text-white px-4 py-3 rounded-xl shadow-lg animate-fadeIn`}>
      <span className="text-lg flex-shrink-0">
        {toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : 'ℹ'}
      </span>
      <p className="text-sm flex-1">{toast.message}</p>
      <button onClick={() => remove(toast.id)} className="text-white/60 hover:text-white text-xs ml-2">✕</button>
    </div>
  )
}

// Hook
import { useState, useCallback } from 'react'

export function useToast() {
  const [toasts, setToasts] = useState([])

  const add = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, message, type, duration }])
  }, [])

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return { toasts, add, remove }
}
