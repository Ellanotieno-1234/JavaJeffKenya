import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Suspense } from 'react'
import './globals.css'
import { Navigation } from '@/components/layout/Navigation'

// Loading components
function ChartLoader() {
  return <div className="w-full h-64 animate-pulse bg-slate-800/50 rounded-lg"></div>
}

function TableLoader() {
  return <div className="w-full h-96 animate-pulse bg-slate-800/50 rounded-lg"></div>
}

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Aviation Parts Tracking System',
  description: 'Advanced aviation parts management and tracking system for 2034',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <main className="min-h-screen relative overflow-hidden bg-slate-900">
          {/* Background Elements */}
          <div className="fixed inset-0 z-0">
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-[128px] animate-float"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-[128px] animate-float" style={{ animationDelay: '-3s' }}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/30 rounded-full mix-blend-multiply filter blur-[128px] animate-float" style={{ animationDelay: '-1.5s' }}></div>
          </div>

          {/* Navigation */}
          <Navigation />

          {/* Content with Suspense boundaries */}
          <div className="relative z-10">
            <Suspense fallback={
              <div className="container mx-auto p-4 space-y-4">
                <ChartLoader />
                <TableLoader />
              </div>
            }>
              {children}
            </Suspense>
          </div>
        </main>
      </body>
    </html>
  )
}
