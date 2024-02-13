'use client'

import { Button } from '@/components/ui/button'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { ModeToggle } from '@/components/dropdown'
import { ChevronRight } from "lucide-react"
import { useEffect, useState, useContext} from 'react'
import Icon from './icon'
import {useWallets, usePrivy} from '@privy-io/react-auth'
import { createSmartAccountClient, LightSigner } from "@biconomy/account";

import { Context } from '../app/context'

export function Nav() {
  const { login, logout, signMessage } = usePrivy()
  const pathname = usePathname()
  const {wallets} = useWallets()
  const [embedded, setEmbedded] = useState<any>(null)
  const [address, setAddress] = useState<string | null>(null)
  const [signedInWithLens, setSignedInWithLens] = useState(false)
  const { client, setWallet, setProfile } = useContext(Context)

  useEffect(() => {
    checkWallets()
  }, [wallets])


  async function checkWallets() {
    const embeddedWallet = wallets.find((wallet) => (wallet.walletClientType === 'privy'));
    if (!embeddedWallet) return
    await embeddedWallet.switchChain(80001)
    setWallet(embeddedWallet)
    setEmbedded(embeddedWallet)
    const provider = await embeddedWallet.getEthersProvider();
    const signer = provider.getSigner();

    const smartAccount = await createSmartAccountClient({
      signer: signer as LightSigner,
      bundlerUrl: "https://bundler.biconomy.io/api/v2/{chain-id-here}/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44",
      biconomyPaymasterApiKey: process.env.NEXT_PUBLIC_PAYMASTER_KEY,
    })
    signInWithLens(embeddedWallet)

    const address = await smartAccount.getAccountAddress()
    setAddress(address)
  }

  async function signInWithLens(_wallet = embedded) {
    const profiles = await client.wallet.profilesManaged({
      for: _wallet.address,
      includeOwned: true
    })   
    if (profiles.items.length === 0) {
      return
    }
    setProfile(profiles.items[0])

    const challenge = await client.authentication.generateChallenge({
      signedBy: _wallet.address,
      for: profiles.items[0]?.id,
    })
    const signature = await signMessage(challenge.text);
    await client.authentication.authenticate({ id: challenge.id, signature })
    setSignedInWithLens(true)
  }

  return (
    <nav className='
    border-b flex
    flex-col sm:flex-row
    items-start sm:items-center
    sm:pr-10
    '>
      <div
        className='py-5 px-8 flex flex-1 items-center p'
      >
        <Link href="/" className='mr-5 flex items-center'>
          <Icon
            width={22}
            height={22}
          />
          {/* <p className={`ml-2 mr-4 text-lg font-semibold`}>_social</p> */}
        </Link>
        <Link href="/" className={`mr-5 text-sm ${pathname !== '/' && 'opacity-50'}`}>
          <p>Home</p>
        </Link>
        <Link href="/search" className={`mr-5 text-sm ${pathname !== '/search' && 'opacity-60'}`}>
          <p>Search</p>
        </Link>
        {
          embedded && (
            <Link href="/profile" className={`mr-5 text-sm ${pathname !== '/profile' && 'opacity-60'}`}>
              <p>Profile</p>
            </Link>
          )
        }
      </div>
     
      <div className='
        flex
        sm:items-center
        pl-8 pb-3 sm:p-0
      '>
       {
        !address && (
          <Button
            onClick={login}
            variant="secondary" className="mr-4">
              {embedded ? 'Sign In' : 'Connect'}
              <ChevronRight className="h-4 w-4" />
            </Button>
          )
       }
       {
        address && !signedInWithLens && (
          <Button
            onClick={signInWithLens}
            variant="secondary" className="mr-4">
              Sign In With Lens
              <ChevronRight className="h-4 w-4" />
            </Button>
        )
       }
        {
          address && signedInWithLens && (
            <Button
            onClick={() => {
              logout()
              setAddress(null)
              setEmbedded(null)
              setProfile(null)
              setWallet(null)
            }}
            variant="secondary" className="mr-4">
              Logout
              <ChevronRight className="h-4 w-4" />
            </Button>
            )
        }        
        <ModeToggle />
      </div>
    </nav>
  )
}