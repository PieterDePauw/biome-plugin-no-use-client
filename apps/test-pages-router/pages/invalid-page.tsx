'use client'

export default function InvalidPage() {
  return (
    <div>
      <h1>Invalid Page - Should Trigger Biome Error</h1>
      <p>This page has a 'use client' directive and should be flagged by the Biome plugin.</p>
    </div>
  )
}
