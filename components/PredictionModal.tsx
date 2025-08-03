'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { useWallet } from '../contexts/WalletContext'

interface PredictionModalProps {
  isOpen: boolean
  onClose: () => void
  marketTitle: string
  predictionType: 'yes' | 'no'
  currentPercentage: number
  onConfirm: (amount: number) => void
}

const PredictionModal = ({
  isOpen,
  onClose,
  marketTitle,
  predictionType,
  currentPercentage,
  onConfirm
}: PredictionModalProps) => {
  const { t } = useLanguage()
  const { balance, isConnected } = useWallet()
  const [amount, setAmount] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fee = parseFloat(amount) * 0.02 || 0 // 2% fee
  const total = parseFloat(amount) + fee || 0

  useEffect(() => {
    if (!isOpen) {
      setAmount('')
      setIsSubmitting(false)
    }
  }, [isOpen])

  const handleSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0 || total > balance) return
    
    setIsSubmitting(true)
    
    // Simulate transaction delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    onConfirm(parseFloat(amount))
    setIsSubmitting(false)
    onClose()
  }

  const handleMaxClick = () => {
    const maxAmount = Math.max(0, balance - (balance * 0.02)) // Leave room for fee
    setAmount(maxAmount.toFixed(2))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-tertiary rounded-2xl p-6 w-full max-w-md mx-4 border border-secondary">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-primary">{t('modal.prediction.title')}</h2>
          <button 
            onClick={onClose}
            className="text-secondary hover:text-primary transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Market Info */}
        <div className="mb-6">
          <h3 className="text-sm text-secondary mb-2">Market</h3>
          <p className="text-primary font-medium line-clamp-2">{marketTitle}</p>
        </div>

        {/* Prediction Type */}
        <div className="mb-6">
          <div className={`inline-flex items-center px-4 py-2 rounded-lg font-medium ${
            predictionType === 'yes' 
              ? 'bg-green-600/20 text-green-400 border border-green-600/30'
              : 'bg-red-600/20 text-red-400 border border-red-600/30'
          }`}>
            <span className="mr-2">
              {predictionType === 'yes' ? '📈' : '📉'}
            </span>
            {predictionType === 'yes' ? `YES (${currentPercentage}%)` : `NO (${100 - currentPercentage}%)`}
          </div>
        </div>

        {/* Amount Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-secondary mb-2">
            {t('modal.prediction.amount')}
          </label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={t('modal.prediction.enterAmount')}
              className="w-full bg-secondary border border-tertiary rounded-lg px-4 py-3 text-primary placeholder-gray-400 focus:outline-none focus:border-accent-green transition-colors"
              min="0"
              step="0.01"
            />
            <button
              onClick={handleMaxClick}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-accent-green text-sm font-medium hover:text-accent-green/80 transition-colors"
            >
              MAX
            </button>
          </div>
        </div>

        {/* Balance */}
        <div className="mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-secondary">{t('modal.prediction.balance')}:</span>
            <span className="text-primary font-medium">${balance.toFixed(2)}</span>
          </div>
        </div>

        {/* Transaction Details */}
        {amount && parseFloat(amount) > 0 && (
          <div className="mb-6 p-4 bg-secondary/50 rounded-lg border border-tertiary">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-secondary">{t('modal.prediction.amount')}:</span>
                <span className="text-primary">${parseFloat(amount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">{t('modal.prediction.fee')} (2%):</span>
                <span className="text-primary">${fee.toFixed(2)}</span>
              </div>
              <div className="border-t border-tertiary pt-2">
                <div className="flex justify-between font-medium">
                  <span className="text-secondary">{t('modal.prediction.total')}:</span>
                  <span className="text-primary">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {total > balance && (
          <div className="mb-4 p-3 bg-red-600/20 border border-red-600/30 rounded-lg">
            <p className="text-red-400 text-sm">Insufficient balance</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-secondary hover:bg-tertiary text-primary font-medium py-3 px-4 rounded-lg transition-colors"
            disabled={isSubmitting}
          >
            {t('button.cancel')}
          </button>
          <button
            onClick={handleSubmit}
            disabled={!amount || parseFloat(amount) <= 0 || total > balance || !isConnected || isSubmitting}
            className={`flex-1 font-medium py-3 px-4 rounded-lg transition-all duration-200 ${
              predictionType === 'yes'
                ? 'bg-green-600 hover:bg-green-500 disabled:bg-green-600/50'
                : 'bg-red-600 hover:bg-red-500 disabled:bg-red-600/50'
            } text-white disabled:cursor-not-allowed`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Processing...
              </div>
            ) : (
              t('button.confirm')
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PredictionModal