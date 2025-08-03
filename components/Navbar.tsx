'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '../contexts/LanguageContext'
import { useWallet } from '../contexts/WalletContext'
import { useTheme } from '../contexts/ThemeContext'

const Navbar = () => {
  const { language, setLanguage, t } = useLanguage()
  const { isConnected, address, connectWallet, disconnectWallet, isConnecting } = useWallet()
  const { theme, toggleTheme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showWalletMenu, setShowWalletMenu] = useState(false)

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'zh' : 'en')
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return (
    <nav className="sticky top-0 z-50 glass-effect border-b border-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Empty space for logo area */}
          <div className="flex-1"></div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              href="/create" 
              className="text-secondary hover:text-primary transition-colors font-medium"
            >
              {t('nav.createMarket')}
            </Link>
            
            <Link 
              href="/my-markets" 
              className="text-secondary hover:text-primary transition-colors font-medium"
            >
              {t('nav.myMarkets')}
            </Link>
            
            {/* Control Group: Wallet, Theme, Language with 16px spacing */}
            <div className="flex items-center space-x-4">
              {/* Wallet Connection */}
              {isConnected ? (
                <div className="relative">
                  <button
                    onClick={() => setShowWalletMenu(!showWalletMenu)}
                    className="flex items-center space-x-2 bg-brand-500/20 border border-brand-500/30 text-brand-500 px-4 py-2 rounded-xl hover:bg-brand-500/30 transition-all duration-300 animate-glow-soft"
                  >
                    <div className="w-2 h-2 bg-brand-500 rounded-full animate-pulse" />
                    <span className="font-medium web3-number">{formatAddress(address!)}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {showWalletMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-tertiary border border-secondary rounded-lg shadow-xl z-50">
                      <div className="p-3 border-b border-secondary">
                        <p className="text-xs text-secondary">{t('nav.wallet.address')}</p>
                        <p className="text-sm text-primary web3-number">{formatAddress(address!)}</p>
                      </div>
                      <button
                        onClick={() => {
                          disconnectWallet()
                          setShowWalletMenu(false)
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-secondary transition-colors"
                      >
                        {t('nav.wallet.disconnect')}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={connectWallet}
                  disabled={isConnecting}
                  className="btn-primary"
                >
                  {isConnecting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>{t('nav.wallet.connecting')}</span>
                    </>
                  ) : (
                    <span>{t('nav.connectWallet')}</span>
                  )}
                </button>
              )}
              
              {/* Theme Toggle - Icon only, larger */}
              <button 
                onClick={toggleTheme}
                className="bg-tertiary hover:bg-secondary text-primary px-3 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 text-sm border border-secondary flex items-center justify-center"
                title={t('theme.toggle')}
              >
                {theme === 'dark' ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
              
              {/* Language Toggle */}
              <button 
                onClick={toggleLanguage}
                className="bg-tertiary hover:bg-secondary text-primary px-3 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 text-sm border border-secondary flex items-center space-x-1"
              >
                <span>{language === 'en' ? '🇺🇸' : '🇨🇳'}</span>
                <span>{language.toUpperCase()}</span>
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-secondary hover:text-primary transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-secondary py-4 space-y-4">
            <Link 
              href="/create" 
              className="block btn-primary text-center"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('nav.createMarket')}
            </Link>
            
            <Link 
              href="/my-markets" 
              className="block text-secondary hover:text-primary transition-colors font-medium text-center"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('nav.myMarkets')}
            </Link>
            
            {/* Mobile Wallet */}
            {isConnected ? (
              <div className="space-y-2">
                <div className="text-center p-3 bg-accent-green/20 border border-accent-green/30 rounded-lg animate-wallet-pulse">
                  <div className="flex items-center justify-center space-x-2 text-accent-green">
                    <div className="w-2 h-2 bg-accent-green rounded-full animate-pulse" />
                    <span className="font-medium web3-number">{formatAddress(address!)}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    disconnectWallet()
                    setIsMenuOpen(false)
                  }}
                  className="w-full text-red-400 font-medium py-2 px-4 border border-red-600/30 rounded-lg hover:bg-red-600/20 transition-colors"
                >
                  {t('nav.wallet.disconnect')}
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  connectWallet()
                  setIsMenuOpen(false)
                }}
                disabled={isConnecting}
                className="w-full btn-primary flex items-center justify-center space-x-2"
              >
                {isConnecting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{t('nav.wallet.connecting')}</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>{t('nav.connectWallet')}</span>
                  </>
                )}
              </button>
            )}
            
            {/* Mobile Theme Toggle */}
            <button 
              onClick={() => {
                toggleTheme()
                setIsMenuOpen(false)
              }}
              className="btn-secondary text-sm w-full flex items-center justify-center space-x-1"
            >
              {theme === 'dark' ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
              <span>{theme === 'dark' ? t('theme.light') : t('theme.dark')}</span>
            </button>
            
            {/* Mobile Language Toggle */}
            <button 
              onClick={() => {
                toggleLanguage()
                setIsMenuOpen(false)
              }}
              className="btn-secondary text-sm w-full flex items-center justify-center space-x-1"
            >
              <span>{language === 'en' ? '🇺🇸' : '🇨🇳'}</span>
              <span>{language.toUpperCase()}</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar