'use client'

import { Toaster } from 'react-hot-toast'

export default function AdminToaster() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        className: 'text-sm',
        duration: 3500,
      }}
    />
  )
}
