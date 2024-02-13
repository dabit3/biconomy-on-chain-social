'use client'

import {PrivyProvider} from '@privy-io/react-auth';

export default function Provider({ children }) {
  return (
    <PrivyProvider
        appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ''}
        config={{
            loginMethods: ['email', 'wallet', 'google'],
            appearance: {
                theme: 'light',
                accentColor: '#676FFF',
                logo: '/logo.svg'
            },
            embeddedWallets: {
                createOnLogin: 'users-without-wallets',
                noPromptOnSignature: true
            }
        }}
    >
      { children }
    </PrivyProvider>

  )
}