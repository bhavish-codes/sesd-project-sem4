export const metadata = {
  title: 'Git Analyser',
  description: 'Analyse Git Profiles effectively',
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
