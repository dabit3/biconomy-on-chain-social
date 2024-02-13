'use client'

import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from "@/components/theme-provider"
import PrivyProvider from './privy-provider'
import { Nav } from "@/components/nav"
import { polygonMumbai, polygon } from '@wagmi/chains'
import { WagmiProvider } from 'wagmi' 
import { QueryClient, QueryClientProvider } from '@tanstack/react-query' 
import { http, createConfig } from 'wagmi'
import { ContextProvider } from './context'

const queryClient = new QueryClient() 
const config = createConfig({
  chains: [polygonMumbai, polygon],
  transports: {
    [polygonMumbai.id]: http(),
    [polygon.id]: http(),
  },
})

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* PWA config */}
      <link rel="manifest" href="/manifest.json" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" /> 
      <meta name="apple-mobile-web-app-title" content="Lens PWA" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/images/icons/iconmain-512x512.png" />
      <meta name="theme-color" content="#000000" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black" />
      <body className={inter.className}>
        <PrivyProvider>
          <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}> 
              <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                <ContextProvider>
                  <Nav />
                  {children}
                </ContextProvider>
              </ThemeProvider>
            </QueryClientProvider>
          </WagmiProvider>
        </PrivyProvider>
      </body>
    </html>
  )
}

