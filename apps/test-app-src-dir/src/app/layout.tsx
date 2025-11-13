import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Test App with src/ Directory',
  description: 'Testing Biome plugin with App Router in src/ directory',
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
