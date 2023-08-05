import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Acc Dict',
  description: 'Test Dict for accounts',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
