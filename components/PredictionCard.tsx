'use client'

import { useState } from 'react'
import { useWallet } from '../contexts/WalletContext'
import { useLanguage } from '../contexts/LanguageContext'
import PredictionModal from './PredictionModal'
import { User } from 'lucide-react'

interface MarketOption {
  id: string
  label: string
  percentage: number
  price: number
  priceChange: number
  color: string
  avatar: string
}

interface PredictionCardProps {
  id: string
  title: string
  icon: string
  imageUrl?: string
  creatorAvatar?: string
  creatorName?: string
  tags: string[]
  options?: MarketOption[]
  yesPercentage: number
  currentPrice: number
  priceChange: number
  participants: number
  liquidity: string
  volume: string
  endDate: string
  status: 'active' | 'ended' | 'ending_soon'
  isHot?: boolean
  category: string
  onCardClick?: (marketId: string) => void
}

export default function PredictionCard({
  id,
  title,
  icon,
  imageUrl,
  creatorAvatar,
  creatorName,
  tags,
  options,
  yesPercentage,
  currentPrice,
  priceChange,
  participants,
  liquidity,
  volume,
  endDate,
  status,
  isHot = false,
  category,
  onCardClick
}: PredictionCardProps) {
  const { isConnected } = useWallet()
  const { t } = useLanguage()
  const [showModal, setShowModal] = useState(false)
  
  // 处理options的默认值
  const marketOptions = options || [
    {
      id: 'yes',
      label: 'Yes',
      percentage: yesPercentage,
      price: currentPrice,
      priceChange: priceChange,
      color: '#00FFAE',
      avatar: '📈'
    },
    {
      id: 'no',
      label: 'No',
      percentage: 100 - yesPercentage,
      price: 1 - currentPrice,
      priceChange: -priceChange,
      color: '#FF3D5A',
      avatar: '📉'
    }
  ]
  
  const [selectedOption, setSelectedOption] = useState<string>(marketOptions[0]?.id || '')

  const handleBuyClick = (optionId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedOption(optionId)
    setShowModal(true)
  }

  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick(id)
    }
  }

  const getTimeRemaining = (endDate: string) => {
    const end = new Date(endDate)
    const now = new Date()
    const diff = end.getTime() - now.getTime()
    
    if (diff <= 0) return 'Ended'
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    
    if (days > 0) return `${days}d ${hours}h`
    return `${hours}h`
  }

  const getStatusBadge = () => {
    switch (status) {
      case 'active':
        return (
          <span className="absolute top-3 right-3 bg-[#00FFAE] text-black text-xs font-bold px-2 py-1 rounded-full">
            {t('market.trading')}
          </span>
        )
      case 'ending_soon':
        return (
          <span className="absolute top-3 right-3 bg-[#FF3D5A] text-white text-xs font-bold px-2 py-1 rounded-full">
            {t('market.endingSoon')}
          </span>
        )
      case 'ended':
        return (
          <span className="absolute top-3 right-3 bg-gray-600 text-white text-xs font-bold px-2 py-1 rounded-full">
            {t('market.ended')}
          </span>
        )
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  return (
    <>
      <div 
        onClick={handleCardClick}
        className="group bg-tertiary rounded-lg p-2 hover:bg-secondary transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-[#00FFAE]/10 cursor-pointer relative overflow-hidden border border-gray-700"
      >
        {/* Hot Badge */}
        {isHot && (
          <div className="absolute top-2 left-2 bg-gradient-to-r from-[#FF3D5A] to-[#FF6B7A] text-white text-xs font-bold px-2 py-1 rounded-full z-10">
            🔥 HOT
          </div>
        )}

        {/* Status Badge */}
        {getStatusBadge()}

        {/* Cover Image (Optional) */}
        {imageUrl && (
          <div className="relative h-20 mb-2 rounded-lg overflow-hidden">
            <img 
              src={imageUrl} 
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        {/* Event Icon & Title */}
        <div className="flex items-start space-x-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-lg flex-shrink-0">
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="text-primary font-semibold text-sm leading-tight mb-1 group-hover:text-[#00FFAE] transition-colors line-clamp-2">
              {title}
            </h3>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-1 mb-1">
              {tags.slice(0, 2).map((tag, index) => (
                <span 
                  key={index}
                  className="text-xs bg-secondary text-secondary px-1.5 py-0.5 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Options Progress Bar */}
         <div className="mb-2">
           <div className="w-full bg-secondary rounded-full h-2 flex overflow-hidden">
             {marketOptions.map((option, index) => (
               <div 
                 key={option.id}
                 className="h-2 transition-all duration-500"
                 style={{ 
                   width: `${option.percentage}%`,
                   backgroundColor: option.color
                 }}
               />
             ))}
           </div>
         </div>

        {/* Options inline */}
         <div className="flex items-center justify-between mb-2">
           {marketOptions.map((option, index) => (
             <div key={option.id} className="flex items-center space-x-1">
               <div className="w-2 h-2 rounded-full" style={{ backgroundColor: option.color }}></div>
               <span className="text-primary text-xs font-medium">{option.label}</span>
               <span className="text-primary font-bold text-xs">{option.percentage}%</span>
             </div>
           ))}
         </div>

        {/* Stats Row - All in one line */}
        <div className="flex items-center justify-between mb-2 text-xs">
          <div className="flex items-center space-x-1">
            <svg className="w-3 h-3 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-primary font-medium">{formatNumber(participants)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <svg className="w-3 h-3 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span className="text-primary font-medium">{liquidity}</span>
          </div>
          <div className="flex items-center space-x-1">
            <svg className="w-3 h-3 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="text-primary font-medium">{volume}</span>
          </div>
          <div className="flex items-center space-x-1">
            <svg className="w-3 h-3 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-primary font-medium">{getTimeRemaining(endDate)}</span>
          </div>
          <div className={`flex items-center space-x-1 ${
            priceChange >= 0 ? 'text-[#00FFAE]' : 'text-[#FF3D5A]'
          }`}>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={priceChange >= 0 ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" : "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"} />
            </svg>
            <span className="font-medium text-xs">
              {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Action Buttons */}
         {status !== 'ended' && (
           <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${Math.min(marketOptions.length, 2)}, 1fr)` }}>
             {marketOptions.slice(0, 2).map((option, index) => (
               <button
                 key={option.id}
                 onClick={(e) => handleBuyClick(option.id, e)}
                 disabled={!isConnected}
                 className="bg-secondary hover:bg-tertiary text-primary font-semibold py-1.5 px-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-xs border-2 border-transparent hover:border-opacity-50"
                 style={{ 
                   backgroundColor: option.color,
                   color: '#000'
                 }}
               >
                 {t('market.buy')} {option.label}
               </button>
             ))}
           </div>
         )}



      </div>

      {/* Prediction Modal */}
      {showModal && (
        <PredictionModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          marketTitle={title}
          predictionType={selectedOption as 'yes' | 'no'}
          currentPercentage={marketOptions.find(opt => opt.id === selectedOption)?.percentage || 0}
          onConfirm={(amount) => {
            console.log(`Confirmed ${selectedOption} with amount: ${amount}`);
            // Handle the confirmation logic here
          }}
        />
      )}
    </>
  )
}