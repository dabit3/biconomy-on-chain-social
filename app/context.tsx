'use client'
import { createContext, useState, useEffect } from 'react'
import {
  LensClient, production
} from "@lens-protocol/client";

export const Context = createContext<any>(null)

export function ContextProvider({ children }) {
  const [client, setClient] = useState<any>(null)

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
        setClient
      }}>
      {children}
    </Context.Provider>
  )
}