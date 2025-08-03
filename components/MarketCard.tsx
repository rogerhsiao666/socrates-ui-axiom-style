'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useLanguage } from '../contexts/LanguageContext'
import { useWallet } from '../contexts/WalletContext'
import PredictionModal from './PredictionModal'

interface MarketCardProps {
  id: string
  title: string
  imageUrl?: string
  coverImage?: string
  yesPercentage: number
  noPercentage: number
  category: string
  volume: string
  endDate: string
}

const MarketCard = ({
  id,
  title,
  imageUrl,
  coverImage,
  yesPercentage,
  noPercentage,
  category,
  volume,
  endDate
}: MarketCardProps) => {
  const { t } = useLanguage()
  const { isConnected, connectWallet } = useWallet()
  const [isHovered, setIsHovered] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [predictionType, setPredictionType] = useState<'yes' | 'no'>('yes')
  const [currentYesPercentage, setCurrentYesPercentage] = useState(yesPercentage)
  const [currentNoPercentage, setCurrentNoPercentage] = useState(noPercentage)
  const [totalVolume, setTotalVolume] = useState(parseFloat(volume.replace(/[^0-9.]/g, '')))

  const handlePrediction = (type: 'yes' | 'no') => {
    if (!isConnected) {
      connectWallet()
      return
    }
    setPredictionType(type)
    setShowModal(true)
  }

  const handleConfirmPrediction = (amount: number) => {
    // Simulate market update
    const newVolume = totalVolume + amount
    const volumeIncrease = amount / newVolume
    
    if (predictionType === 'yes') {
      const newYesPercentage = Math.min(95, currentYesPercentage + (volumeIncrease * 100 * 0.1))
      const newNoPercentage = 100 - newYesPercentage
      setCurrentYesPercentage(Math.round(newYesPercentage))
      setCurrentNoPercentage(Math.round(newNoPercentage))
    } else {
      const newNoPercentage = Math.min(95, currentNoPercentage + (volumeIncrease * 100 * 0.1))
      const newYesPercentage = 100 - newNoPercentage
      setCurrentYesPercentage(Math.round(newYesPercentage))
      setCurrentNoPercentage(Math.round(newNoPercentage))
    }
    
    setTotalVolume(newVolume)
  }

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'crypto':
        return 'bg-accent-blue text-blue-100'
      case 'politics':
        return 'bg-accent-red text-red-100'
      case 'sports':
        return 'bg-accent-yellow text-yellow-100'
      case 'tech':
        return 'bg-accent-green text-green-100'
      default:
        return 'bg-secondary text-secondary'
    }
  }

  return (
    <div 
      className="card group cursor-pointer transform animate-fade-in"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Cover Image Background */}
      <div className="relative h-48 mb-4 rounded-md overflow-hidden" style={{ aspectRatio: '16/9' }}>
        <Image
          src={coverImage || imageUrl || '/default-cover.png'}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent dark:from-black/80 light:from-white/20" />
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(category)}`}>
            {category}
          </span>
        </div>
        
        {/* Volume Badge */}
        <div className="absolute top-3 right-3">
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-tertiary/80 text-secondary backdrop-blur-sm">
            ${totalVolume >= 1000 ? `${(totalVolume/1000).toFixed(1)}K` : totalVolume.toFixed(0)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {/* Title */}
        <h3 className="text-lg font-semibold text-primary line-clamp-2 group-hover:text-accent-green transition-colors">
          {title}
        </h3>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-green-400 font-medium">{currentYesPercentage}% YES</span>
            <span className="text-red-400 font-medium">{currentNoPercentage}% NO</span>
          </div>
          
          <div className="progress-bar">
            <div className="flex h-full">
              <div 
                className="progress-fill bg-gradient-to-r from-green-500 to-green-400 transition-all duration-500"
                style={{ width: `${currentYesPercentage}%` }}
              />
              <div 
                className="progress-fill bg-gradient-to-r from-red-500 to-red-400 transition-all duration-500"
                style={{ width: `${currentNoPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button 
            onClick={() => handlePrediction('yes')}
            className="flex-1 bg-green-600 hover:bg-green-500 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200 hover:scale-105 flex items-center justify-center space-x-1"
          >
            {!isConnected && (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            )}
            <span>{t('market.buyYes')}</span>
          </button>
          <button 
            onClick={() => handlePrediction('no')}
            className="flex-1 bg-red-600 hover:bg-red-500 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200 hover:scale-105 flex items-center justify-center space-x-1"
          >
            {!isConnected && (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            )}
            <span>{t('market.buyNo')}</span>
          </button>
        </div>

        {/* End Date */}
        <div className="text-xs text-secondary text-center">
          {t('market.ends')} {endDate}
        </div>
      </div>

      {/* Prediction Modal */}
      <PredictionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        marketTitle={title}
        predictionType={predictionType}
        currentPercentage={predictionType === 'yes' ? currentYesPercentage : currentNoPercentage}
        onConfirm={handleConfirmPrediction}
      />
    </div>
  )
}

export default MarketCard