'use client'

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'

interface WalletContextType {
  isConnected: boolean
  address: string | null
  balance: number
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  isConnecting: boolean
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState(1000) // Mock balance
  const [isConnecting, setIsConnecting] = useState(false)

  // Mock wallet connection
  const connectWallet = async () => {
    setIsConnecting(true)
    
    try {
      // Simulate wallet connection delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mock wallet address
      const mockAddress = '0x' + Math.random().toString(16).substr(2, 40)
      setAddress(mockAddress)
      setIsConnected(true)
      setBalance(Math.floor(Math.random() * 5000) + 1000) // Random balance between 1000-6000
      
      // Store in localStorage for persistence
      localStorage.setItem('wallet_connected', 'true')
      localStorage.setItem('wallet_address', mockAddress)
    } catch (error) {
      console.error('Failed to connect wallet:', error)
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = () => {
    setIsConnected(false)
    setAddress(null)
    setBalance(0)
    localStorage.removeItem('wallet_connected')
    localStorage.removeItem('wallet_address')
  }

  // Check for existing connection on mount
  useEffect(() => {
    const wasConnected = localStorage.getItem('wallet_connected')
    const storedAddress = localStorage.getItem('wallet_address')
    
    if (wasConnected === 'true' && storedAddress) {
      setIsConnected(true)
      setAddress(storedAddress)
      setBalance(Math.floor(Math.random() * 5000) + 1000)
    }
  }, [])

  return (
    <WalletContext.Provider value={{
      isConnected,
      address,
      balance,
      connectWallet,
      disconnectWallet,
      isConnecting
    }}>
      {children}
    </WalletContext.Provider>
  )
}

export const useWallet = () => {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}