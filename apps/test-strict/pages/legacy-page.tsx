"use client"

// This legacy page also contains "use client" to test Pages Router detection
export default function LegacyPage() {
  return (
    <div>
      <h2>Legacy Page - Should Fail Too</h2>
      <p>Testing Pages Router detection in strict mode.</p>
    </div>
  )
}
