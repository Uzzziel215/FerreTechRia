"use client";

import { AuthProvider } from '../context/AuthContext';
import './globals.css'
import { Toaster } from 'react-hot-toast';
import AppContent from './AppContent';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Toaster />
          <AppContent>
            {children}
          </AppContent>
        </AuthProvider>
      </body>
    </html>
  )
}
