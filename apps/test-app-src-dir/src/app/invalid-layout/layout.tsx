"use client"

export default function InvalidLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div style={{ border: '1px solid red' }}>
      <h2>Invalid Layout - Should Trigger Error</h2>
      {children}
    </div>
  )
}
