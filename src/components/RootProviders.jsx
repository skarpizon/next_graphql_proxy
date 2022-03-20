import React from 'react'
import { ConfirmationModalProvider } from './core/ConfirmationModal'

export default function RootProviders ({children}) {
  return (
    <ConfirmationModalProvider>
      {children}
    </ConfirmationModalProvider>
  )
}
