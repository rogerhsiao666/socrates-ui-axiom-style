'use client'

import { useState, useEffect, useMemo } from 'react'
import { useParams } from 'next/navigation'
// Removed lucide-react import - using text symbols instead
import { useLanguage } from '@/contexts/LanguageContext'
import { useWallet } from '@/contexts/WalletContext'
import Link from 'next/link'

// 预测选项接口
interface PredictionOption {
  id: string
  label: string
  price: number // 0-1 范围
  volume: number
  userPosition: number
  priceChange: number
  color: string
}

// 预测市场接口
interface PredictionMarket {
  id: string
  title: string
  description: string
  options: PredictionOption[]
  status: 'trading' | 'closed' | 'resolved'
  endTime: string
  totalVolume: number
  totalValue: number
  participants: number
  category: string
  imageUrl?: string
}

// 交易记录接口
interface Transaction {
  id: string
  user: string
  option: string
  type: 'buy' | 'sell'
  amount: number
  price: number
  timestamp: string
}

// 评论接口
interface Comment {
  id: string
  user: string
  userAvatar?: string
  content: string
  timestamp: string
  likes: number
  replies: Comment[]
  parentId?: string
}

// AMM 定价算法 (简化版 LMSR)
class MarketMaker {
  private b: number = 100 // 流动性参数

  // 计算选项价格
  calculatePrices(quantities: number[]): number[] {
    const total = quantities.reduce((sum, q) => sum + Math.exp(q / this.b), 0)
    return quantities.map(q => Math.exp(q / this.b) / total)
  }

  // 计算购买成本
  calculateCost(quantities: number[], optionIndex: number, shares: number): number {
    const newQuantities = [...quantities]
    newQuantities[optionIndex] += shares
    
    const oldCost = this.b * Math.log(quantities.reduce((sum, q) => sum + Math.exp(q / this.b), 0))
    const newCost = this.b * Math.log(newQuantities.reduce((sum, q) => sum + Math.exp(q / this.b), 0))
    
    return newCost - oldCost
  }
}

export default function MarketDetailPage() {
  const params = useParams()
  const { t } = useLanguage()
  const { isConnected } = useWallet()
  const [market, setMarket] = useState<PredictionMarket | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [selectedOption, setSelectedOption] = useState<string>('')
  const [tradeAmount, setTradeAmount] = useState<string>('')
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy')
  const [loading, setLoading] = useState(true)
  const [chartTimeframe, setChartTimeframe] = useState<'1H' | '6H' | '1D' | '1W' | '1M' | 'ALL'>('ALL')
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')

  // 生成模拟评论数据
  const generateMockComments = (): Comment[] => {
    return [
      {
        id: '1',
        user: '0x1234...5678',
        userAvatar: '/api/placeholder/32/32?text=U1',
        content: 'Based on recent polling data, I think Trump has a strong chance. The economic indicators are favoring the incumbent.',
        timestamp: '2024-01-15T10:30:00Z',
        likes: 12,
        replies: [
          {
            id: '1-1',
            user: '0x9876...5432',
            userAvatar: '/api/placeholder/32/32?text=U2',
            content: 'I disagree. The polling methodology has been questionable lately.',
            timestamp: '2024-01-15T10:35:00Z',
            likes: 5,
            replies: [],
            parentId: '1'
          }
        ]
      },
      {
        id: '2',
        user: '0xabcd...efgh',
        userAvatar: '/api/placeholder/32/32?text=U3',
        content: 'This market is way too volatile. I\'m staying on the sidelines until we get closer to the election.',
        timestamp: '2024-01-15T09:45:00Z',
        likes: 8,
        replies: []
      },
      {
        id: '3',
        user: '0xdef0...1234',
        userAvatar: '/api/placeholder/32/32?text=U4',
        content: 'The "Other Candidate" option seems undervalued. There could be a surprise third-party candidate.',
        timestamp: '2024-01-15T08:20:00Z',
        likes: 15,
        replies: [
          {
            id: '3-1',
            user: '0x5678...9abc',
            userAvatar: '/api/placeholder/32/32?text=U5',
            content: 'Historically, third-party candidates rarely win. It\'s a long shot.',
            timestamp: '2024-01-15T08:25:00Z',
            likes: 3,
            replies: [],
            parentId: '3'
          },
          {
            id: '3-2',
            user: '0x2468...ace0',
            userAvatar: '/api/placeholder/32/32?text=U6',
            content: 'True, but the odds are still attractive for a small bet.',
            timestamp: '2024-01-15T08:30:00Z',
            likes: 7,
            replies: [],
            parentId: '3'
          }
        ]
      }
    ]
  }

  const marketMaker = useMemo(() => new MarketMaker(), [])

  // 生成模拟价格历史数据
  const generatePriceHistory = (option: PredictionOption, timeframe: string) => {
    const data = []
    const now = new Date()
    let intervals: number, intervalMs: number, startPrice: number
    
    // 根据时间范围设置参数
    switch (timeframe) {
      case '1H':
        intervals = 60
        intervalMs = 60 * 1000 // 1分钟
        break
      case '6H':
        intervals = 72
        intervalMs = 5 * 60 * 1000 // 5分钟
        break
      case '1D':
        intervals = 96
        intervalMs = 15 * 60 * 1000 // 15分钟
        break
      case '1W':
        intervals = 168
        intervalMs = 60 * 60 * 1000 // 1小时
        break
      case '1M':
        intervals = 120
        intervalMs = 6 * 60 * 60 * 1000 // 6小时
        break
      default: // ALL
        intervals = 168
        intervalMs = 60 * 60 * 1000 // 1小时
    }
    
    startPrice = option.price - (Math.random() * 0.15 - 0.075) // 起始价格有些波动
    
    for (let i = intervals; i >= 0; i--) {
      const time = new Date(now.getTime() - i * intervalMs)
      const progress = (intervals - i) / intervals
      
      // 添加一些随机波动和趋势
      const randomFactor = 1 + (Math.random() * 0.08 - 0.04)
      const trendFactor = startPrice + (option.price - startPrice) * progress
      const price = Math.max(0.01, Math.min(0.99, trendFactor * randomFactor))
      
      data.push({
        time: time.toISOString(),
        price: price,
        percentage: price * 100
      })
    }
    
    return data
  }

  // 颜色映射
  const getOptionColor = (index: number) => {
    const colors = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981', '#8b5cf6']
    return colors[index % colors.length]
  }
  
  // 为每个选项生成价格历史
  const priceHistoryData = useMemo(() => {
    if (!market) return {}
    
    const data: { [key: string]: any[] } = {}
    market.options.forEach(option => {
      data[option.id] = generatePriceHistory(option, chartTimeframe)
    })
    return data
  }, [market, chartTimeframe])
  
  // 生成时间轴标签
  const getTimeAxisLabels = () => {
    const now = new Date()
    const labels = []
    
    switch (chartTimeframe) {
      case '1H':
        for (let i = 5; i >= 0; i--) {
          const time = new Date(now.getTime() - i * 10 * 60 * 1000)
          labels.push(time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }))
        }
        break
      case '6H':
        for (let i = 5; i >= 0; i--) {
          const time = new Date(now.getTime() - i * 60 * 60 * 1000)
          labels.push(time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }))
        }
        break
      case '1D':
        for (let i = 5; i >= 0; i--) {
          const time = new Date(now.getTime() - i * 4 * 60 * 60 * 1000)
          labels.push(time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }))
        }
        break
      case '1W':
        for (let i = 6; i >= 0; i--) {
          const time = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
          labels.push(time.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))
        }
        break
      case '1M':
        for (let i = 5; i >= 0; i--) {
          const time = new Date(now.getTime() - i * 6 * 24 * 60 * 60 * 1000)
          labels.push(time.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))
        }
        break
      default: // ALL
        for (let i = 6; i >= 0; i--) {
          const time = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
          labels.push(time.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))
        }
    }
    
    return labels
  }
  
  // 生成订单簿数据
  const generateOrderBookData = (option: PredictionOption) => {
    const currentPrice = option.price
    const spread = 0.02 // 2% 价差
    
    // 生成买单 (Bids) - 价格从高到低
    const bids = []
    for (let i = 0; i < 8; i++) {
      const price = currentPrice - (spread / 2) - (i * 0.005)
      const shares = Math.floor(Math.random() * 50000) + 5000
      const total = price * shares
      bids.push({ price: Math.max(0.01, price), shares, total })
    }
    
    // 生成卖单 (Asks) - 价格从低到高
    const asks = []
    for (let i = 0; i < 8; i++) {
      const price = currentPrice + (spread / 2) + (i * 0.005)
      const shares = Math.floor(Math.random() * 50000) + 5000
      const total = price * shares
      asks.push({ price: Math.min(0.99, price), shares, total })
    }
    
    return { bids, asks, spread: asks[0]?.price - bids[0]?.price || 0 }
  }
  
  // 为选中的选项生成订单簿数据
  const orderBookData = useMemo(() => {
    if (!market || !selectedOption) return null
    const option = market.options.find(opt => opt.id === selectedOption)
    return option ? generateOrderBookData(option) : null
  }, [market, selectedOption])

  // 模拟市场数据
  useEffect(() => {
    const loadMarketData = () => {
      // 模拟API调用
      const mockMarket: PredictionMarket = {
        id: params.id as string,
        title: 'Who will win the 2024 US Presidential Election?',
        description: 'This market will resolve to the candidate who wins the 2024 United States Presidential Election. The market will resolve based on the official results certified by the Electoral College.',
        status: 'trading',
        endTime: '2024-11-05T23:59:59Z',
        totalVolume: 15420000,
        totalValue: 8950000,
        participants: 28394,
        category: 'Politics',
        imageUrl: '/api/placeholder/600/300?text=2024+Election',
        options: [
          {
            id: 'trump',
            label: 'Donald Trump',
            price: 0.45,
            volume: 6500000,
            userPosition: 0,
            priceChange: -2.1,
            color: '#FF3D5A'
          },
          {
            id: 'biden',
            label: 'Joe Biden',
            price: 0.42,
            volume: 5800000,
            userPosition: 0,
            priceChange: 1.8,
            color: '#4285F4'
          },
          {
            id: 'other',
            label: 'Other Candidate',
            price: 0.13,
            volume: 3120000,
            userPosition: 0,
            priceChange: 0.3,
            color: '#9CA3AF'
          }
        ]
      }

      // 模拟交易记录
      const mockTransactions: Transaction[] = [
        {
          id: '1',
          user: '0x1234...5678',
          option: 'Donald Trump',
          type: 'buy',
          amount: 1000,
          price: 0.45,
          timestamp: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          user: '0x9876...5432',
          option: 'Joe Biden',
          type: 'sell',
          amount: 500,
          price: 0.42,
          timestamp: '2024-01-15T10:25:00Z'
        },
        {
          id: '3',
          user: '0xabcd...efgh',
          option: 'Other Candidate',
          type: 'buy',
          amount: 200,
          price: 0.13,
          timestamp: '2024-01-15T10:20:00Z'
        }
      ]

      setMarket(mockMarket)
      setTransactions(mockTransactions)
      setComments(generateMockComments())
      // 自动选择第一个选项以显示订单簿
      setSelectedOption(mockMarket.options[0].id)
      setLoading(false)
    }

    loadMarketData()
  }, [params.id])

  // 处理交易
  const handleTrade = () => {
    if (!market || !selectedOption || !tradeAmount || !isConnected) return

    const amount = parseFloat(tradeAmount)
    if (isNaN(amount) || amount <= 0) return

    const optionIndex = market.options.findIndex(opt => opt.id === selectedOption)
    if (optionIndex === -1) return

    // 模拟交易执行
    const newMarket = { ...market }
    const option = newMarket.options[optionIndex]

    if (tradeType === 'buy') {
      // 计算新价格 (简化版)
      const totalShares = amount / option.price
      option.userPosition += totalShares
      option.volume += amount
      
      // 简化的价格更新逻辑
      const priceIncrease = amount / 1000000 // 每100万美元影响1%
      option.price = Math.min(0.99, option.price + priceIncrease)
      
      // 调整其他选项价格以保持总和为1
      const otherOptions = newMarket.options.filter((_, i) => i !== optionIndex)
      const remainingPrice = 1 - option.price
      const currentOtherTotal = otherOptions.reduce((sum, opt) => sum + opt.price, 0)
      
      otherOptions.forEach(opt => {
        opt.price = (opt.price / currentOtherTotal) * remainingPrice
      })
    } else {
      // 卖出逻辑
      const sharesToSell = Math.min(amount / option.price, option.userPosition)
      option.userPosition -= sharesToSell
      option.volume += sharesToSell * option.price
      
      const priceDecrease = (sharesToSell * option.price) / 1000000
      option.price = Math.max(0.01, option.price - priceDecrease)
      
      // 调整其他选项价格
      const otherOptions = newMarket.options.filter((_, i) => i !== optionIndex)
      const remainingPrice = 1 - option.price
      const currentOtherTotal = otherOptions.reduce((sum, opt) => sum + opt.price, 0)
      
      otherOptions.forEach(opt => {
        opt.price = (opt.price / currentOtherTotal) * remainingPrice
      })
    }

    // 添加交易记录
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      user: '0x' + Math.random().toString(16).substr(2, 8) + '...' + Math.random().toString(16).substr(2, 4),
      option: option.label,
      type: tradeType,
      amount: amount,
      price: option.price,
      timestamp: new Date().toISOString()
    }

    setMarket(newMarket)
    setTransactions([newTransaction, ...transactions])
    setTradeAmount('')
  }

  // 评论处理函数
  const handleSubmitComment = () => {
    if (!newComment.trim()) return
    
    const comment: Comment = {
      id: Date.now().toString(),
      user: '0x' + Math.random().toString(16).substr(2, 8) + '...' + Math.random().toString(16).substr(2, 4),
      userAvatar: `/api/placeholder/32/32?text=U${Math.floor(Math.random() * 10)}`,
      content: newComment,
      timestamp: new Date().toISOString(),
      likes: 0,
      replies: []
    }
    
    setComments(prev => [comment, ...prev])
    setNewComment('')
  }

  const handleSubmitReply = (parentId: string) => {
    if (!replyText.trim()) return
    
    const reply: Comment = {
      id: Date.now().toString(),
      user: '0x' + Math.random().toString(16).substr(2, 8) + '...' + Math.random().toString(16).substr(2, 4),
      userAvatar: `/api/placeholder/32/32?text=U${Math.floor(Math.random() * 10)}`,
      content: replyText,
      timestamp: new Date().toISOString(),
      likes: 0,
      replies: [],
      parentId
    }
    
    setComments(prev => prev.map(comment => 
      comment.id === parentId 
        ? { ...comment, replies: [...comment.replies, reply] }
        : comment
    ))
    setReplyText('')
    setReplyingTo(null)
  }

  const handleLikeComment = (commentId: string, isReply: boolean = false, parentId?: string) => {
    if (isReply && parentId) {
      setComments(prev => prev.map(comment => 
        comment.id === parentId 
          ? {
              ...comment, 
              replies: comment.replies.map(reply => 
                reply.id === commentId 
                  ? { ...reply, likes: reply.likes + 1 }
                  : reply
              )
            }
          : comment
      ))
    } else {
      setComments(prev => prev.map(comment => 
        comment.id === commentId 
          ? { ...comment, likes: comment.likes + 1 }
          : comment
      ))
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  // 计算倒计时
  const timeRemaining = useMemo(() => {
    if (!market) return ''
    const now = new Date().getTime()
    const end = new Date(market.endTime).getTime()
    const diff = end - now
    
    if (diff <= 0) return 'Ended'
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    return `${days}d ${hours}h ${minutes}m`
  }, [market])

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-primary p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-secondary rounded w-1/3"></div>
            <div className="h-64 bg-secondary rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-48 bg-secondary rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!market) {
    return (
      <div className="min-h-screen bg-background text-primary p-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Market Not Found</h1>
          <Link href="/" className="text-blue-500 hover:underline">
            Return to Markets
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-primary">
      {/* Header */}
      <div className="border-b border-secondary">
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex items-center space-x-4 mb-6">
            <Link href="/" className="flex items-center space-x-2 text-secondary hover:text-primary transition-colors">
              <span className="text-lg">←</span>
              <span>Back to Markets</span>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <span className="px-2 py-1 bg-gray-800/50 text-gray-300 text-xs rounded border border-gray-700/50">{market.category}</span>
                <span className={`px-2 py-1 text-xs rounded ${
                  market.status === 'trading' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                }`}>
                  {market.status === 'trading' ? 'Trading' : market.status === 'closed' ? 'Closed' : 'Resolved'}
                </span>
              </div>
              
              <h1 className="text-3xl font-bold mb-4">{market.title}</h1>
              <p className="text-secondary text-lg leading-relaxed">{market.description}</p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-900/90 backdrop-blur-sm rounded-xl border border-gray-800/50 p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-sm">⏰</span>
                  <span className="text-sm text-gray-400">Time Remaining</span>
                </div>
                <div className="text-xl font-bold text-white">{timeRemaining}</div>
              </div>
              
              <div className="bg-gray-900/90 backdrop-blur-sm rounded-xl border border-gray-800/50 p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">💰 Total Volume</span>
                  <span className="font-medium text-white">${market.totalVolume.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">💵 Total Value</span>
                  <span className="font-medium text-white">${market.totalValue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">👥 Participants</span>
                  <span className="font-medium text-white">{market.participants.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Options */}
          <div className="lg:col-span-2 space-y-6">
            {/* Price Chart */}
            <div className="bg-gray-900/90 backdrop-blur-sm rounded-xl border border-gray-800/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Price History</h2>
                <div className="flex space-x-1 bg-gray-800/50 rounded-lg p-1">
                  {['1H', '6H', '1D', '1W', '1M', 'ALL'].map((timeframe) => (
                    <button
                      key={timeframe}
                      onClick={() => setChartTimeframe(timeframe as any)}
                      className={`px-3 py-1 text-xs rounded transition-colors ${
                        chartTimeframe === timeframe
                          ? 'bg-blue-500 text-white'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {timeframe}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Chart Container */}
              <div className="relative h-80 mb-4">
                <svg className="w-full h-full" viewBox="0 0 800 300">
                  {/* Grid Lines */}
                  <defs>
                    <pattern id="grid" width="40" height="30" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 30" fill="none" stroke="#374151" strokeWidth="0.5" opacity="0.3"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                  
                  {/* Y-axis labels */}
                  {[25, 20, 15, 10, 5].map((percentage, index) => (
                    <g key={percentage}>
                      <line x1="0" y1={60 * index} x2="800" y2={60 * index} stroke="#374151" strokeWidth="0.5" opacity="0.3" />
                      <text x="10" y={60 * index + 5} fill="#9CA3AF" fontSize="12">{percentage}%</text>
                    </g>
                  ))}
                  
                  {/* Price Lines */}
                  {market && market.options.map((option, optionIndex) => {
                    const data = priceHistoryData[option.id] || []
                    if (data.length === 0) return null
                    
                    const color = getOptionColor(optionIndex)
                    
                    const pathData = data.map((point, index) => {
                      const x = (index / Math.max(data.length - 1, 1)) * 780 + 10
                      const y = Math.max(10, Math.min(290, 300 - (point.percentage / 25) * 300)) // 25% max scale with bounds
                      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
                    }).join(' ')
                    
                    return (
                      <g key={option.id}>
                        <path
                          d={pathData}
                          fill="none"
                          stroke={color}
                          strokeWidth="2"
                          opacity="0.8"
                        />
                        {/* Price trend area */}
                        <path
                          d={pathData + ` L 790 300 L 10 300 Z`}
                          fill={color}
                          opacity="0.1"
                        />
                      </g>
                    )
                  })}
                  
                  {/* Current price dots */}
                  {market && market.options.map((option, optionIndex) => {
                    const data = priceHistoryData[option.id] || []
                    if (data.length === 0) return null
                    
                    const color = getOptionColor(optionIndex)
                    const lastPoint = data[data.length - 1]
                    const x = 790
                    const y = Math.max(10, Math.min(290, 300 - (lastPoint.percentage / 25) * 300))
                    
                    return (
                      <g key={`${option.id}-dot`}>
                        <circle
                          cx={x}
                          cy={y}
                          r="4"
                          fill={color}
                          stroke="white"
                          strokeWidth="2"
                        />
                        {/* Price label */}
                        <text
                          x={x - 30}
                          y={y - 8}
                          fontSize="11"
                          fill={color}
                          className="font-medium"
                          textAnchor="middle"
                        >
                          {lastPoint.percentage.toFixed(1)}%
                        </text>
                      </g>
                    )
                  })}
                </svg>
                
                {/* Time axis */}
                 <div className="flex justify-between text-xs text-gray-400 mt-2 px-2">
                   {getTimeAxisLabels().map((label, index) => (
                     <span key={index}>{label}</span>
                   ))}
                 </div>
              </div>
              
              {/* Chart Legend */}
              <div className="flex flex-wrap gap-4">
                {market && market.options.map((option, optionIndex) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getOptionColor(optionIndex) }}
                    />
                    <span className="text-sm text-gray-300">{option.label}</span>
                    <span className="text-sm font-medium text-white">{(option.price * 100).toFixed(1)}%</span>
                    <span className={`text-xs ${
                      option.priceChange >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {option.priceChange >= 0 ? '+' : ''}{option.priceChange.toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Order Book / Depth Chart */}
            {selectedOption && orderBookData && (
              <div className="bg-gray-900/90 backdrop-blur-sm rounded-xl border border-gray-800/50 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Order Book</h2>
                  <div className="text-sm text-gray-400">
                    Spread: {(orderBookData.spread * 100).toFixed(2)}%
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Order Book Table */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-xs text-gray-400 font-medium border-b border-gray-700 pb-2">
                      <div className="text-center">PRICE</div>
                      <div className="text-center">SHARES</div>
                      <div className="text-center">TOTAL</div>
                    </div>
                    
                    {/* Asks (Sell Orders) */}
                    <div className="space-y-1">
                      <div className="text-xs text-red-400 font-medium mb-2">ASKS</div>
                      {orderBookData.asks.slice(0, 5).reverse().map((ask, index) => (
                        <div key={`ask-${index}`} className="grid grid-cols-3 gap-4 text-sm py-1 hover:bg-red-500/10 rounded transition-colors">
                          <div className="text-red-400 font-medium text-center">{(ask.price * 100).toFixed(1)}¢</div>
                          <div className="text-gray-300 text-center">{ask.shares.toLocaleString()}</div>
                          <div className="text-gray-300 text-center">${ask.total.toFixed(0)}</div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Current Price */}
                    <div className="border-y border-gray-600 py-2 my-2">
                      <div className="text-center text-lg font-bold text-white">
                        {market.options.find(opt => opt.id === selectedOption) && 
                          `${(market.options.find(opt => opt.id === selectedOption)!.price * 100).toFixed(1)}¢`
                        }
                      </div>
                      <div className="text-center text-xs text-gray-400">Last Price</div>
                    </div>
                    
                    {/* Bids (Buy Orders) */}
                    <div className="space-y-1">
                      <div className="text-xs text-green-400 font-medium mb-2">BIDS</div>
                      {orderBookData.bids.slice(0, 5).map((bid, index) => (
                        <div key={`bid-${index}`} className="grid grid-cols-3 gap-4 text-sm py-1 hover:bg-green-500/10 rounded transition-colors">
                          <div className="text-green-400 font-medium text-center">{(bid.price * 100).toFixed(1)}¢</div>
                          <div className="text-gray-300 text-center">{bid.shares.toLocaleString()}</div>
                          <div className="text-gray-300 text-center">${bid.total.toFixed(0)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Depth Chart */}
                  <div className="space-y-4">
                    <div className="text-sm font-medium text-gray-300">Market Depth</div>
                    <div className="relative h-80">
                      <svg className="w-full h-full" viewBox="0 0 400 300">
                        {/* Grid */}
                        <defs>
                          <pattern id="depthGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#374151" strokeWidth="0.5" opacity="0.3"/>
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#depthGrid)" />
                        
                        {/* Y-axis labels */}
                        {[0, 25, 50, 75, 100].map((percentage, index) => (
                          <g key={percentage}>
                            <line x1="0" y1={60 * index} x2="400" y2={60 * index} stroke="#374151" strokeWidth="0.5" opacity="0.3" />
                            <text x="5" y={60 * index + 5} fill="#9CA3AF" fontSize="10">{100 - percentage}%</text>
                          </g>
                        ))}
                        
                        {/* Bids area (left side - green) */}
                        {(() => {
                          const maxVolume = Math.max(
                            ...orderBookData.bids.map(bid => bid.shares),
                            ...orderBookData.asks.map(ask => ask.shares)
                          )
                          
                          let cumulativeBids = 0
                          const bidPath = orderBookData.bids.slice(0, 8).map((bid, index) => {
                            cumulativeBids += bid.shares
                            const x = 200 - (index + 1) * 25
                            const y = 300 - (cumulativeBids / (maxVolume * 4)) * 300
                            return `${index === 0 ? 'M' : 'L'} ${x} ${Math.max(0, y)}`
                          }).join(' ')
                          
                          return (
                            <g>
                              <path
                                d={bidPath + ' L 0 300 L 200 300 Z'}
                                fill="#10b981"
                                opacity="0.3"
                              />
                              <path
                                d={bidPath}
                                stroke="#10b981"
                                strokeWidth="2"
                                fill="none"
                              />
                            </g>
                          )
                        })()}
                        
                        {/* Asks area (right side - red) */}
                        {(() => {
                          const maxVolume = Math.max(
                            ...orderBookData.bids.map(bid => bid.shares),
                            ...orderBookData.asks.map(ask => ask.shares)
                          )
                          
                          let cumulativeAsks = 0
                          const askPath = orderBookData.asks.slice(0, 8).map((ask, index) => {
                            cumulativeAsks += ask.shares
                            const x = 200 + (index + 1) * 25
                            const y = 300 - (cumulativeAsks / (maxVolume * 4)) * 300
                            return `${index === 0 ? 'M' : 'L'} ${x} ${Math.max(0, y)}`
                          }).join(' ')
                          
                          return (
                            <g>
                              <path
                                d={askPath + ' L 400 300 L 200 300 Z'}
                                fill="#ef4444"
                                opacity="0.3"
                              />
                              <path
                                d={askPath}
                                stroke="#ef4444"
                                strokeWidth="2"
                                fill="none"
                              />
                            </g>
                          )
                        })()}
                        
                        {/* Center line (current price) */}
                        <line x1="200" y1="0" x2="200" y2="300" stroke="#6b7280" strokeWidth="2" strokeDasharray="5,5" opacity="0.7" />
                        <text x="205" y="15" fill="#9CA3AF" fontSize="10">Current Price</text>
                      </svg>
                    </div>
                    
                    {/* Legend */}
                    <div className="flex justify-center space-x-6 text-xs">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded"></div>
                        <span className="text-gray-300">Bids</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded"></div>
                        <span className="text-gray-300">Asks</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <h2 className="text-2xl font-bold">Market Options</h2>
            
            <div className="grid gap-4">
              {market.options.map((option, optionIndex) => (
                <div 
                  key={option.id} 
                  className={`bg-gray-900/90 backdrop-blur-sm rounded-xl border border-gray-800/50 cursor-pointer transition-all duration-200 hover:shadow-lg p-6 ${
                    selectedOption === option.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedOption(option.id)}
                >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: getOptionColor(optionIndex) }}
                        />
                        <h3 className="text-xl font-semibold">{option.label}</h3>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-2xl font-bold">${option.price.toFixed(3)}</div>
                        <div className={`text-sm flex items-center ${
                          option.priceChange >= 0 ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {option.priceChange >= 0 ? (
                            <span className="mr-1">↗</span>
                          ) : (
                            <span className="mr-1">↘</span>
                          )}
                          {Math.abs(option.priceChange).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-gray-400">Volume</div>
                        <div className="font-medium text-white">${option.volume.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Your Position</div>
                        <div className="font-medium text-white">{option.userPosition.toFixed(2)} shares</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Probability</div>
                        <div className="font-medium text-white">{(option.price * 100).toFixed(1)}%</div>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all duration-500"
                          style={{ 
                            width: `${option.price * 100}%`,
                            backgroundColor: getOptionColor(optionIndex)
                          }}
                        />
                      </div>
                    </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Trading Panel */}
          <div className="space-y-6">
            <div className="bg-gray-900/90 backdrop-blur-sm rounded-xl border border-gray-800/50 p-6">
                <h3 className="text-xl font-bold mb-4">Trade</h3>
                
                {!isConnected ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400 mb-4">Connect your wallet to trade</p>
                    <button className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors">Connect Wallet</button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedOption && (
                      <div className="p-3 bg-gray-800/50 rounded-lg">
                      <div className="text-sm text-gray-400">Selected Option</div>
                        <div className="font-medium">
                          {market.options.find(opt => opt.id === selectedOption)?.label}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => setTradeType('buy')}
                        className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                          tradeType === 'buy' ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        Buy
                      </button>
                      <button 
                        onClick={() => setTradeType('sell')}
                        className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                          tradeType === 'sell' ? 'bg-red-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        Sell
                      </button>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">
                        Amount (USDC)
                      </label>
                      <input 
                        type="number"
                        value={tradeAmount}
                        onChange={(e) => setTradeAmount(e.target.value)}
                        placeholder="Enter amount"
                        className="w-full p-3 bg-gray-800/50 border border-gray-700/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <button 
                      onClick={handleTrade}
                      disabled={!selectedOption || !tradeAmount}
                      className="w-full py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-white font-medium rounded-lg transition-colors"
                    >
                      {tradeType === 'buy' ? 'Buy Shares' : 'Sell Shares'}
                    </button>
                  </div>
                )}
              </div>
            
            {/* Recent Transactions */}
            <div className="bg-gray-900/90 backdrop-blur-sm rounded-xl border border-gray-800/50 p-6">
                <h3 className="text-xl font-bold mb-4">Recent Transactions</h3>
                
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {transactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <div>
                        <div className="font-medium text-sm text-white">{tx.user}</div>
                        <div className="text-xs text-gray-400">
                          {tx.type === 'buy' ? 'Bought' : 'Sold'} {tx.option}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-medium text-sm ${
                          tx.type === 'buy' ? 'text-green-500' : 'text-red-500'
                        }`}>
                          ${tx.amount.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(tx.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
            </div>
          </div>
        </div>
        
        {/* Comments Section */}
        <div className="mt-8 bg-gray-900/90 backdrop-blur-sm rounded-xl border border-gray-800/50 p-6">
          <h2 className="text-2xl font-bold mb-6">Discussion</h2>
          
          {/* Comment Form */}
          {isConnected ? (
            <div className="mb-8">
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                  U
                </div>
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your thoughts on this market..."
                    className="w-full p-4 bg-gray-800/50 border border-gray-700/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={3}
                  />
                  <div className="flex justify-between items-center mt-3">
                    <div className="text-sm text-gray-400">
                      {newComment.length}/500 characters
                    </div>
                    <button
                      onClick={handleSubmitComment}
                      disabled={!newComment.trim()}
                      className="px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 text-white font-medium rounded-lg transition-colors"
                    >
                      Post Comment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-8 p-4 bg-gray-800/50 rounded-lg text-center">
              <p className="text-gray-400 mb-3">Connect your wallet to join the discussion</p>
              <button className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors">
                Connect Wallet
              </button>
            </div>
          )}
          
          {/* Comments List */}
          <div className="space-y-6">
            {comments.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-2">No comments yet</div>
                <div className="text-gray-500 text-sm">Be the first to share your thoughts!</div>
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="space-y-4">
                  {/* Main Comment */}
                  <div className="flex space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                      {comment.user.slice(2, 4).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-white">{comment.user}</span>
                            <span className="text-sm text-gray-400">{formatTimeAgo(comment.timestamp)}</span>
                          </div>
                        </div>
                        <p className="text-gray-200 leading-relaxed">{comment.content}</p>
                        <div className="flex items-center space-x-4 mt-3">
                          <button
                            onClick={() => handleLikeComment(comment.id)}
                            className="flex items-center space-x-1 text-gray-400 hover:text-red-400 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm">{comment.likes}</span>
                          </button>
                          {isConnected && (
                            <button
                              onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                              className="text-sm text-gray-400 hover:text-blue-400 transition-colors"
                            >
                              Reply
                            </button>
                          )}
                        </div>
                      </div>
                      
                      {/* Reply Form */}
                      {replyingTo === comment.id && (
                        <div className="mt-4 ml-4">
                          <div className="flex space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-medium text-xs">
                              U
                            </div>
                            <div className="flex-1">
                              <textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Write a reply..."
                                className="w-full p-3 bg-gray-800/50 border border-gray-700/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                rows={2}
                              />
                              <div className="flex justify-end space-x-2 mt-2">
                                <button
                                  onClick={() => {
                                    setReplyingTo(null)
                                    setReplyText('')
                                  }}
                                  className="px-4 py-1 text-sm text-gray-400 hover:text-white transition-colors"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleSubmitReply(comment.id)}
                                  disabled={!replyText.trim()}
                                  className="px-4 py-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 text-white text-sm font-medium rounded transition-colors"
                                >
                                  Reply
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Replies */}
                      {comment.replies.length > 0 && (
                        <div className="mt-4 ml-4 space-y-3">
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className="flex space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-medium text-xs">
                                {reply.user.slice(2, 4).toUpperCase()}
                              </div>
                              <div className="flex-1">
                                <div className="bg-gray-800/30 rounded-lg p-3">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <span className="font-medium text-white text-sm">{reply.user}</span>
                                    <span className="text-xs text-gray-400">{formatTimeAgo(reply.timestamp)}</span>
                                  </div>
                                  <p className="text-gray-200 text-sm leading-relaxed">{reply.content}</p>
                                  <div className="flex items-center space-x-3 mt-2">
                                    <button
                                      onClick={() => handleLikeComment(reply.id, true, comment.id)}
                                      className="flex items-center space-x-1 text-gray-400 hover:text-red-400 transition-colors"
                                    >
                                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                      </svg>
                                      <span className="text-xs">{reply.likes}</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}