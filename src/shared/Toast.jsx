import React, { useState, useEffect } from 'react'

export function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} removeToast={removeToast} />
      ))}
    </div>
  )
}

function Toast({ toast, removeToast }) {
  const [isRemoving, setIsRemoving] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsRemoving(true)
      setTimeout(() => removeToast(toast.id), 300)
    }, 5000)

    return () => clearTimeout(timer)
  }, [toast.id, removeToast])

  return (
    <div className={`toast ${toast.type} ${isRemoving ? 'removing' : ''}`}>
      {toast.message}
    </div>
  )
}

export function useToast() {
  const [toasts, setToasts] = useState([])

  const addToast = (message, type = 'info') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
  }

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  return { toasts, addToast, removeToast }
} 