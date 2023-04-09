import RootStyleRegistry from './emotion'
import "../styles/globals.scss"
import Bar from './(navigation)/Bar'
import { ClerkProvider } from '@clerk/nextjs/app-beta'

export const metadata = {
  title: 'DND Helper',
  description: 'Lets get rid of those stupid character sheets',
  icons: {
    icon: "/favicon.ico",
  },
  manifest: "/manifest.json"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <ClerkProvider>
        <body>
          <RootStyleRegistry>
            <Bar />
            {children}
          </RootStyleRegistry>
        </body>
      </ClerkProvider>
    </html>
  )
}
