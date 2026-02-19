export const metadata = {
  title: 'Next.js 14 Mixed Test App',
  description: 'Testing YC-OpenNext deployment',
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