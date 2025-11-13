'use client'

import type { Metadata } from 'next'

// This layout intentionally contains 'use client' to trigger the plugin error
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <h1>Strict Validation Test - This Should Fail</h1>
        {children}
      </body>
    </html>
  )
}
