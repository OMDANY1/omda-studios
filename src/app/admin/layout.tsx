export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div style={{ padding: 40 }}>
      <h1>ADMIN LAYOUT WORKING</h1>
      {children}
    </div>
  )
}