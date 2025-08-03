import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from '../contexts/LanguageContext'
import { WalletProvider } from '../contexts/WalletContext'
import { ThemeProvider } from '../contexts/ThemeContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PredictMarket - Decentralized Prediction Markets',
  description: 'Trade on the outcomes of future events with our decentralized prediction market platform.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <LanguageProvider>
            <WalletProvider>
              {children}
            </WalletProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}