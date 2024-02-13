'use client'
import { createContext, useState, useEffect } from 'react'
import {
  LensClient, production
} from "@lens-protocol/client";

export const Context = createContext<any>(null)

export function ContextProvider({ children }) {
  const [client, setClient] = useState<any>(null)
  const [wallet, setWallet] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    _setClient()
  }, [])

  function _setClient() {
    const lensClient = new LensClient({
      environment: production
    })
    setClient(lensClient)
  }

  return (
    <Context.Provider value={{
        client,
        setClient,
        wallet,
        setWallet,
        profile,
        setProfile
      }}>
      {children}
    </Context.Provider>
  )
}