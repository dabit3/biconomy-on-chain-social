'use client'

import { useContext } from 'react'
import { Context } from '../context'

export default function ProfileWrapper() {
  const { wallet, profile } = useContext(Context)

  if (!wallet) return null

  return (
    <Profile
      profile={profile}
      address={wallet.address}
    />
  )
}

function Profile({ profile, address }) {

  if (!profile && !address) return null

  if (!profile && address) return (
    <p className='p-10 text-sm text-muted-foreground'>{address}</p>
  )

  return (
    <main className="px-10 py-14">
      <div>
        <a
          rel='no-opener'
          target='_blank'
        href={`https://hey.xyz/u/${profile.handle?.localName}`}>
          <div className='border rounded-lg p-10'>
            <div>
              {
                profile.metadata?.picture?.__typename === 'ImageSet' && (
                  <img
                    src={profile?.metadata?.picture?.optimized?.uri}
                    className='rounded w-[200px]'
                  />
                )
              }
            </div>
            <div className='mt-4'>
              <p className='text-lg'>
                {profile?.metadata?.displayName}
              </p>
              <p className='text-muted-foreground font-medium'>
                {profile?.handle?.localName}.{profile?.handle?.namespace}
              </p>
              <p className='mt-2 text-sm text-muted-foreground'>{address}</p>
            </div>
          </div>
        </a>
     </div>
    </main>
  )
}