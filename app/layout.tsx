import { Inter } from 'next/font/google'
import { getServerSession } from 'next-auth'
import SessionProvider from './components/SessionProvider'
import './globals.css'


const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'AI ChatBot',
  description: 'Generated AI ChatBot',
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const session = await getServerSession()
  
  return (
    <html lang="en">
      <body className={inter.className}>
         <div className='pt-15  min-h-screen flex flex-col bg-black'>
        <SessionProvider session={session}>{children}</SessionProvider>

         </div>
      </body>
    </html>
  )
}
