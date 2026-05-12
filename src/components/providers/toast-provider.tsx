'use client'

import { ToastContainer } from 'react-toastify'

export function ToastProvider() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={4200}
      newestOnTop
      closeOnClick
      pauseOnHover
      draggable={false}
      theme="light"
      toastStyle={{
        borderRadius: '14px',
        border: '1px solid rgba(9, 175, 223, 0.14)',
        boxShadow: '0 18px 36px rgba(15, 23, 42, 0.12)',
      }}
    />
  )
}
