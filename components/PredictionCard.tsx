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
        className="group bg-tertiary rounded-xl p-3 hover:bg-secondary transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-[#00FFAE]/10 cursor-pointer relative overflow-hidden"
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
          <div className="relative h-24 mb-3 rounded-lg overflow-hidden">
            <img 
              src={imageUrl} 
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
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
            <div className="flex flex-wrap gap-1 mb-2">
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

        {/* Creator Info */}
         {creatorName && (
           <div className="flex items-center space-x-2 mb-3 text-xs">
             <div className="w-4 h-4 flex items-center justify-center text-xs">
               {creatorAvatar || '👤'}
             </div>
             <span className="text-secondary">{t('market.createdBy')}</span>
             <span className="text-primary font-medium">{creatorName}</span>
           </div>
         )}

        {/* Options */}
         <div className="mb-3 space-y-2">
           {marketOptions.map((option, index) => (
             <div key={option.id} className="flex items-center justify-between">
               <div className="flex items-center space-x-2 flex-1">
                 <div className="w-3 h-3 flex items-center justify-center text-xs">
                   {option.avatar || '•'}
                 </div>
                 <span className="text-primary text-xs font-medium truncate">{option.label}</span>
               </div>
               <div className="flex items-center space-x-2">
                 <span className="text-primary font-bold text-sm">{option.percentage}%</span>
                 <span className="text-secondary text-xs">${option.price.toFixed(2)}</span>
               </div>
             </div>
           ))}
         </div>

        {/* Options Progress Bar */}
         <div className="mb-3">
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

        {/* Price & Change */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-secondary text-xs">{t('market.currentPrice')}</span>
            <div className="text-primary font-semibold text-sm">${currentPrice.toFixed(2)}</div>
          </div>
          <div className={`flex items-center space-x-1 ${
            priceChange >= 0 ? 'text-[#00FFAE]' : 'text-[#FF3D5A]'
          }`}>
            <span className="text-xs">
              {priceChange >= 0 ? '↗' : '↘'}
            </span>
            <span className="font-semibold text-xs">
              {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
          <div className="text-center">
            <div className="text-secondary mb-0.5 text-xs">👥</div>
            <div className="text-primary font-semibold text-xs">{formatNumber(participants)}</div>
          </div>
          <div className="text-center">
            <div className="text-secondary mb-0.5 text-xs">💧</div>
            <div className="text-primary font-semibold text-xs">{liquidity}</div>
          </div>
          <div className="text-center">
            <div className="text-secondary mb-0.5 text-xs">📊</div>
            <div className="text-primary font-semibold text-xs">{volume}</div>
          </div>
        </div>

        {/* Time Remaining */}
        <div className="text-center mb-3">
          <div className="text-secondary text-xs mb-0.5">⏰</div>
          <div className="text-primary font-semibold text-xs">{getTimeRemaining(endDate)}</div>
        </div>

        {/* Action Buttons */}
         {status !== 'ended' && (
           <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${Math.min(marketOptions.length, 2)}, 1fr)` }}>
             {marketOptions.slice(0, 2).map((option, index) => (
               <button
                 key={option.id}
                 onClick={(e) => handleBuyClick(option.id, e)}
                 disabled={!isConnected}
                 className="bg-secondary hover:bg-tertiary text-primary font-semibold py-2 px-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-xs border-2 border-transparent hover:border-opacity-50"
                 style={{ 
                   borderColor: option.color,
                   backgroundColor: index === 0 ? option.color : undefined,
                   color: index === 0 ? '#000' : undefined
                 }}
               >
                 {t('market.buy')} {option.label}
               </button>
             ))}
           </div>
         )}



        {/* Connect Wallet Prompt */}
        {!isConnected && status !== 'ended' && (
          <div className="text-center mt-2">
            <span className="text-secondary text-xs">{t('market.connectWallet')}</span>
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