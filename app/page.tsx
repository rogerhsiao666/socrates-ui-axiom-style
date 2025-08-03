'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '../components/Navbar'
import PredictionCard from '../components/PredictionCard'
import MarketDetail from '../components/MarketDetail'
import ThreeColumnMarketCard from '../components/ThreeColumnMarketCard'
import { useLanguage } from '../contexts/LanguageContext'
import { mockMarkets } from '../mock/markets'

// 主标签页将在组件内部使用国际化

// Three Column Market View Component
function ThreeColumnMarketView({ markets, searchQuery, selectedCategory, sortBy, onCardClick }: {
  markets: any[]
  searchQuery: string
  selectedCategory: string
  sortBy: string
  onCardClick: (marketId: string) => void
}) {
  const { t } = useLanguage()
  const [displayedMarkets, setDisplayedMarkets] = useState<any[][]>([[], [], []])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const itemsPerPage = 10

  // Filter and sort markets
  const filteredMarkets = useMemo(() => {
    let filtered = markets

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(market => 
        market.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        market.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(market => market.category === selectedCategory)
    }

    // Apply sorting
    switch (sortBy) {
      case 'volume':
        filtered.sort((a, b) => (b.volume || 0) - (a.volume || 0))
        break
      case 'ending':
        filtered.sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime())
        break
      case 'popular':
        filtered.sort((a, b) => (b.participants || 0) - (a.participants || 0))
        break
      default: // newest
        filtered.sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime())
    }

    return filtered
  }, [markets, searchQuery, selectedCategory, sortBy])

  // Initialize markets on first load
  useEffect(() => {
    const initialMarkets = filteredMarkets.slice(0, itemsPerPage * 3)
    const columns: any[][] = [[], [], []]
    
    initialMarkets.forEach((market, index) => {
      columns[index % 3].push(market)
    })
    
    setDisplayedMarkets(columns)
    setPage(1)
    setHasMore(filteredMarkets.length > itemsPerPage * 3)
  }, [filteredMarkets])

  // Load more markets
  const loadMore = useCallback(() => {
    if (loading || !hasMore) return
    
    setLoading(true)
    
    setTimeout(() => {
      const startIndex = page * itemsPerPage * 3
      const endIndex = startIndex + itemsPerPage * 3
      const newMarkets = filteredMarkets.slice(startIndex, endIndex)
      
      if (newMarkets.length === 0) {
        setHasMore(false)
        setLoading(false)
        return
      }
      
      const newColumns: any[][] = [[], [], []]
      newMarkets.forEach((market, index) => {
        newColumns[index % 3].push(market)
      })
      
      setDisplayedMarkets(prev => [
        [...prev[0], ...newColumns[0]],
        [...prev[1], ...newColumns[1]],
        [...prev[2], ...newColumns[2]]
      ])
      
      setPage(prev => prev + 1)
      setHasMore(endIndex < filteredMarkets.length)
      setLoading(false)
    }, 500)
  }, [loading, hasMore, page, filteredMarkets])

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore()
        }
      },
      { threshold: 0.1 }
    )

    const sentinel = document.getElementById('scroll-sentinel')
    if (sentinel) {
      observer.observe(sentinel)
    }

    return () => {
      if (sentinel) {
        observer.unobserve(sentinel)
      }
    }
  }, [hasMore, loading, loadMore])

  return (
    <div className="min-h-screen bg-black text-white font-['Space_Grotesk']">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayedMarkets.map((column, columnIndex) => (
            <div key={columnIndex} className="space-y-6">
              {column.map((market, index) => (
                <div 
                  key={market.id} 
                  className="animate-fade-in"
                  style={{ animationDelay: `${(columnIndex * 100) + (index * 50)}ms` }}
                >
                  <ThreeColumnMarketCard {...market} onCardClick={onCardClick} />
                </div>
              ))}
            </div>
          ))}
        </div>
        
        {/* Loading indicator */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00FFAE]"></div>
            <span className="ml-3 text-gray-400">{t('button.loadMore')}</span>
          </div>
        )}
        
        {/* Load more button */}
        {!loading && hasMore && (
          <div className="text-center mt-8">
            <button 
              onClick={loadMore}
              className="bg-[#00FFAE] hover:bg-[#00D4AA] text-black font-bold py-3 px-8 rounded-lg transition-all duration-200 hover:scale-105"
            >
              {t('button.loadMore')}
            </button>
          </div>
        )}
        
        {/* No more data */}
        {!hasMore && displayedMarkets[0].length > 0 && (
          <div className="text-center py-8 text-gray-400">
            {t('search.noResults')}
          </div>
        )}
        
        {/* Empty state */}
        {!loading && displayedMarkets[0].length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-4">{t('search.noResults')}</div>
            <p className="text-gray-500">{t('search.clearFilters')}</p>
          </div>
        )}
        
        {/* Scroll sentinel for infinite scroll */}
        <div id="scroll-sentinel" className="h-4"></div>
      </div>
    </div>
  )
}

const timeFilters = [
  { key: '1m', label: '1分钟', active: false },
  { key: '5m', label: '5分钟', active: false },
  { key: '1h', label: '1小时', active: true },
  { key: '6h', label: '6小时', active: false },
  { key: '24h', label: '24小时', active: false }
]

const smartWallets = [
  {
    id: '1',
    address: 'gmgM...dra',
    avatar: '🔥',
    pnl1d: '+12.4%',
    pnl7d: '+108.3%',
    pnl30d: '+10.3%',
    winRate7d: '90%',
    trades7d: 148,
    followers: 473,
    balance: '$18.8K',
    status: 'online'
  },
  {
    id: '2', 
    address: 'ret3...7u3',
    avatar: '💎',
    pnl1d: '+308%',
    pnl7d: '+145.5%',
    pnl30d: '+145.5%',
    winRate7d: '100%',
    trades7d: 106,
    followers: 277,
    balance: '$9.839.2',
    status: 'online'
  },
  {
    id: '3',
    address: 'Cupsey',
    avatar: '🎯',
    pnl1d: '+18.8%',
    pnl7d: '+11.8%',
    pnl30d: '+17%',
    winRate7d: '63.6%',
    trades7d: 10237,
    followers: 24372,
    balance: '$1,446.3',
    status: 'online'
  },
  {
    id: '4',
    address: 'Alpha...9x2',
    avatar: '🚀',
    pnl1d: '+45.2%',
    pnl7d: '+234.7%',
    pnl30d: '+189.4%',
    winRate7d: '85%',
    trades7d: 89,
    followers: 1247,
    balance: '$45.2K',
    status: 'online'
  },
  {
    id: '5',
    address: 'Whale...k8m',
    avatar: '🐋',
    pnl1d: '+89.1%',
    pnl7d: '+67.3%',
    pnl30d: '+156.8%',
    winRate7d: '78%',
    trades7d: 234,
    followers: 3456,
    balance: '$127.5K',
    status: 'online'
  },
  {
    id: '6',
    address: 'Degen...5f7',
    avatar: '⚡',
    pnl1d: '+156.3%',
    pnl7d: '+89.2%',
    pnl30d: '+234.1%',
    winRate7d: '92%',
    trades7d: 67,
    followers: 892,
    balance: '$78.9K',
    status: 'online'
  },
  {
    id: '7',
    address: 'Smart...3a1',
    avatar: '🧠',
    pnl1d: '+23.7%',
    pnl7d: '+178.4%',
    pnl30d: '+267.9%',
    winRate7d: '88%',
    trades7d: 156,
    followers: 2134,
    balance: '$89.3K',
    status: 'online'
  },
  {
    id: '8',
    address: 'Profit...7k9',
    avatar: '💰',
    pnl1d: '+67.8%',
    pnl7d: '+123.6%',
    pnl30d: '+198.2%',
    winRate7d: '81%',
    trades7d: 298,
    followers: 1789,
    balance: '$156.7K',
    status: 'online'
  },
  {
    id: '9',
    address: 'Ninja...2b4',
    avatar: '🥷',
    pnl1d: '+34.5%',
    pnl7d: '+89.7%',
    pnl30d: '+145.3%',
    winRate7d: '76%',
    trades7d: 445,
    followers: 567,
    balance: '$34.8K',
    status: 'offline'
  },
  {
    id: '10',
    address: 'Titan...8x5',
    avatar: '⭐',
    pnl1d: '+78.9%',
    pnl7d: '+156.2%',
    pnl30d: '+289.6%',
    winRate7d: '94%',
    trades7d: 78,
    followers: 4567,
    balance: '$234.5K',
    status: 'online'
  },
  {
    id: '11',
    address: 'Crypto...9m3',
    avatar: '🎲',
    pnl1d: '+12.3%',
    pnl7d: '+45.8%',
    pnl30d: '+78.4%',
    winRate7d: '69%',
    trades7d: 567,
    followers: 234,
    balance: '$23.4K',
    status: 'offline'
  },
  {
    id: '12',
    address: 'Moon...4r7',
    avatar: '🌙',
    pnl1d: '+234.7%',
    pnl7d: '+345.2%',
    pnl30d: '+567.8%',
    winRate7d: '96%',
    trades7d: 45,
    followers: 6789,
    balance: '$456.7K',
    status: 'online'
  }
]

export default function Home() {
  const { t } = useLanguage()
  const router = useRouter()
  
  // 使用国际化的主标签页
  const mainTabs = [
    { key: 'Markets', label: t('tab.markets'), icon: '📊' },
    { key: 'Following', label: t('tab.following'), icon: '👥' },
    { key: 'Live', label: t('tab.live'), icon: '📺' }
  ]
  
  // 处理市场卡片点击事件
  const handleCardClick = (marketId: string) => {
    router.push(`/market/${marketId}`)
  }
  
  const [activeTab, setActiveTab] = useState('Markets')
  const [selectedTimeFilter, setSelectedTimeFilter] = useState('1h')
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMarketId, setSelectedMarketId] = useState<string | null>(null)
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null)
  const [marketView, setMarketView] = useState<'waterfall' | 'three-column'>('waterfall')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [lastRefreshTime, setLastRefreshTime] = useState(Date.now())
  const [scrollPosition, setScrollPosition] = useState(0)
  const [launchingRefreshTime, setLaunchingRefreshTime] = useState(Date.now())
  const [launchedRefreshTime, setLaunchedRefreshTime] = useState(Date.now())
  const [waterfallItems, setWaterfallItems] = useState<string[]>([])
  const [isWaterfallActive, setIsWaterfallActive] = useState(false)
  const [launchingWaterfallItems, setLaunchingWaterfallItems] = useState<string[]>([])
  const [isLaunchingWaterfallActive, setIsLaunchingWaterfallActive] = useState(false)
  
  // 新增状态：三列数据管理
  const [newCreatedMarkets, setNewCreatedMarkets] = useState<any[]>([])
  const [aboutToLaunchMarkets, setAboutToLaunchMarkets] = useState<any[]>([])
  const [launchedMarkets, setLaunchedMarkets] = useState<any[]>([])

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // 初始化三列数据 - 一开始就显示大量话题
  useEffect(() => {
    // 初始化最新创建话题（参与人数较少的新话题）- 显示更多初始数据
    const initialNewCreated = []
    for (let i = 0; i < 15; i++) {
      const randomMarket = mockMarkets[Math.floor(Math.random() * mockMarkets.length)]
      initialNewCreated.push({
        ...randomMarket,
        id: randomMarket.id + '_new_' + Date.now() + '_' + i,
        title: `${randomMarket.title} (${Math.floor(Math.random() * 30) + 1}分钟前创建)`,
        participants: Math.floor(Math.random() * 80) + 5,
        status: 'active'
      })
    }
    setNewCreatedMarkets(initialNewCreated)

    // 初始化即将发射话题（参与人数适中的话题）- 显示更多初始数据
    const initialAboutToLaunch = []
    for (let i = 0; i < 15; i++) {
      const randomMarket = mockMarkets[Math.floor(Math.random() * mockMarkets.length)]
      initialAboutToLaunch.push({
        ...randomMarket,
        id: randomMarket.id + '_launching_' + Date.now() + '_' + i,
        title: `${randomMarket.title} (热度上升中)`,
        participants: Math.floor(Math.random() * 800) + 100,
        status: 'active'
      })
    }
    setAboutToLaunchMarkets(initialAboutToLaunch)

    // 初始化已发射话题（参与人数较多的成熟话题）- 显示更多初始数据
    const initialLaunched = []
    for (let i = 0; i < 15; i++) {
      const randomMarket = mockMarkets[Math.floor(Math.random() * mockMarkets.length)]
      initialLaunched.push({
        ...randomMarket,
        id: randomMarket.id + '_launched_' + Date.now() + '_' + i,
        title: `${randomMarket.title} (已成功发射)`,
        participants: Math.floor(Math.random() * 2000) + 1000,
        status: 'active'
      })
    }
    setLaunchedMarkets(initialLaunched)
  }, [])

  // 最新创建话题：每10秒追加一个新卡片到顶部
  useEffect(() => {
    const interval = setInterval(() => {
      const randomMarket = mockMarkets[Math.floor(Math.random() * mockMarkets.length)]
      const newMarket = {
        ...randomMarket,
        id: randomMarket.id + '_new_' + Date.now() + '_refresh',
        title: `${randomMarket.title} (刚刚创建)`,
        participants: Math.floor(Math.random() * 50) + 1,
        status: 'active'
      }
      
      setNewCreatedMarkets(prev => [newMarket, ...prev].slice(0, 20)) // 保持最多20个，新的在顶部
    }, 10000) // 每10秒

    return () => clearInterval(interval)
  }, [])

  // 即将发射话题：每15秒追加一个新卡片到顶部
  useEffect(() => {
    const interval = setInterval(() => {
      const randomMarket = mockMarkets[Math.floor(Math.random() * mockMarkets.length)]
      const newMarket = {
        ...randomMarket,
        id: randomMarket.id + '_launching_' + Date.now() + '_refresh',
        title: `${randomMarket.title} (热度飙升)`,
        participants: Math.floor(Math.random() * 500) + 100,
        status: 'active'
      }
      
      setAboutToLaunchMarkets(prev => [newMarket, ...prev].slice(0, 20)) // 保持最多20个，新的在顶部
    }, 15000) // 每15秒

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // 持续瀑布流刷新逻辑 - 模拟Polymarket官网效果
    // 主要刷新间隔 - 每15秒一次大批量刷新
    const mainInterval = setInterval(() => {
      setLastRefreshTime(Date.now())
      setIsWaterfallActive(true)
      
      // 大批量瀑布流：显示12-15个新项目
      const newItems = mockMarkets.slice(0, 15).map(m => m.id)
      setWaterfallItems([])
      
      newItems.forEach((itemId, index) => {
        setTimeout(() => {
          setWaterfallItems(prev => [...prev, itemId])
        }, index * 150) // 每150ms显示一个新项目
      })
      
      setTimeout(() => {
        setIsWaterfallActive(false)
        setWaterfallItems([])
      }, 4000)
    }, 15000) // 每15秒主要刷新

    // 小批量持续刷新 - 每5秒添加2-3个新话题
    const continuousInterval = setInterval(() => {
      if (!isWaterfallActive) {
        setIsWaterfallActive(true)
        
        // 随机选择2-3个话题进行小批量刷新
        const randomItems = mockMarkets
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map(m => m.id)
        
        setWaterfallItems([])
        randomItems.forEach((itemId, index) => {
          setTimeout(() => {
            setWaterfallItems(prev => [...prev, itemId])
          }, index * 300)
        })
        
        setTimeout(() => {
          setIsWaterfallActive(false)
          setWaterfallItems([])
        }, 1500)
      }
    }, 5000) // 每5秒小批量刷新

    return () => {
      clearInterval(mainInterval)
      clearInterval(continuousInterval)
    }
  }, [isWaterfallActive])

  useEffect(() => {
    // 即将发射话题的持续瀑布流刷新
    // 主要刷新 - 每20秒一次
    const launchingMainInterval = setInterval(() => {
      setLaunchingRefreshTime(Date.now())
      setIsLaunchingWaterfallActive(true)
      
      // 获取即将发射的话题（参与人数适中的活跃话题）
      const launchingItems = mockMarkets
        .filter(market => market.status === 'active' || market.status === 'ending_soon')
        .sort(() => Math.random() - 0.5)
        .slice(0, 10)
        .map(m => m.id)
      
      setLaunchingWaterfallItems([])
      
      launchingItems.forEach((itemId, index) => {
        setTimeout(() => {
          setLaunchingWaterfallItems(prev => [...prev, itemId])
        }, index * 200) // 每200ms显示一个新项目
      })
      
      setTimeout(() => {
        setIsLaunchingWaterfallActive(false)
        setLaunchingWaterfallItems([])
      }, 3000)
    }, 20000) // 每20秒主要刷新

    // 小批量持续刷新 - 每7秒添加1-2个话题
    const launchingContinuousInterval = setInterval(() => {
      if (!isLaunchingWaterfallActive) {
        setIsLaunchingWaterfallActive(true)
        
        const randomItems = mockMarkets
          .filter(market => market.status === 'active')
          .sort(() => Math.random() - 0.5)
          .slice(0, 2)
          .map(m => m.id)
        
        setLaunchingWaterfallItems([])
        randomItems.forEach((itemId, index) => {
          setTimeout(() => {
            setLaunchingWaterfallItems(prev => [...prev, itemId])
          }, index * 400)
        })
        
        setTimeout(() => {
          setIsLaunchingWaterfallActive(false)
          setLaunchingWaterfallItems([])
        }, 1200)
      }
    }, 7000) // 每7秒小批量刷新

    return () => {
      clearInterval(launchingMainInterval)
      clearInterval(launchingContinuousInterval)
    }
  }, [isLaunchingWaterfallActive])

  useEffect(() => {
    // Auto-refresh every 3 minutes for "已发射" section
    const launchedRefreshInterval = setInterval(() => {
      setLaunchedRefreshTime(Date.now())
    }, 180000) // 180 seconds

    return () => clearInterval(launchedRefreshInterval)
  }, [])

  useEffect(() => {
    // Auto-scroll effect for new markets - smooth continuous scroll
    const scrollInterval = setInterval(() => {
      setScrollPosition(prev => (prev + 1) % 100)
    }, 100) // Smooth scroll every 100ms

    return () => clearInterval(scrollInterval)
  }, [])

  // 按状态分组市场数据 - GMGN风格三列布局
  const marketGroups = useMemo(() => {
    let filtered = mockMarkets
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(market => 
        market.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        market.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }
    
    // Filter by time - simulate different data based on time filter
    const timeMultiplier = {
      '1m': 0.1,
      '5m': 0.3, 
      '1h': 1.0,
      '6h': 1.5,
      '24h': 2.0
    }[selectedTimeFilter] || 1.0
    
    // Apply time-based filtering to simulate different market activity
    filtered = filtered.map(market => ({
      ...market,
      participants: Math.floor(market.participants * timeMultiplier),
      volume: `$${(parseFloat(market.volume.replace('$', '').replace('M', '')) * timeMultiplier).toFixed(1)}M`,
      yesPercentage: Math.max(5, Math.min(95, market.yesPercentage + (timeMultiplier - 1) * 10))
    }))
    
    // Add time-based randomization for all sections to simulate real-time updates
    const newTimeOffset = Math.floor(lastRefreshTime / 60000) % 10
    const launchingTimeOffset = Math.floor(launchingRefreshTime / 120000) % 8
    const launchedTimeOffset = Math.floor(launchedRefreshTime / 180000) % 6
    
    // 按状态分组 - 增加更多话题数量
    const newMarkets = filtered.filter(market => market.status === 'active' && market.participants < 100)
      .map((market, index) => ({
        ...market,
        id: market.id + newTimeOffset * 100, // Simulate new IDs
        title: `${market.title} (${new Date().getMinutes()}分钟前创建)`,
        participants: Math.floor(Math.random() * 50) + 1
      })).slice(0, 20) // Increased from 12 to 20
    
    const launchingMarkets = filtered.filter(market => market.status === 'active' && market.participants >= 100 && market.participants < 1000)
      .map((market, index) => ({
        ...market,
        id: market.id + launchingTimeOffset * 200, // Simulate refreshed data
        participants: market.participants + Math.floor(Math.random() * 100),
        yesPercentage: Math.max(5, Math.min(95, market.yesPercentage + (Math.random() - 0.5) * 10))
      })).slice(0, 25) // Increased from 15 to 25
    
    const launchedMarkets = filtered.filter(market => market.status === 'active' && market.participants >= 1000)
      .map((market, index) => ({
        ...market,
        id: market.id + launchedTimeOffset * 300, // Simulate refreshed data
        participants: market.participants + Math.floor(Math.random() * 500),
        volume: `$${(parseFloat(market.volume.replace('$', '').replace('M', '')) + Math.random() * 2).toFixed(1)}M`
      })).slice(0, 20) // Increased from 10 to 20
    
    return {
      new: newMarkets,
      launching: launchingMarkets,
      launched: launchedMarkets
    }
  }, [searchQuery, selectedTimeFilter, lastRefreshTime, launchingRefreshTime, launchedRefreshTime])

  const LoadingSkeleton = () => (
    <div className="bg-tertiary rounded-2xl p-4 animate-pulse">
      <div className="h-32 bg-secondary rounded-xl mb-4"></div>
      <div className="flex items-center space-x-3 mb-3">
        <div className="w-10 h-10 bg-secondary rounded-full"></div>
        <div className="flex-1">
          <div className="h-4 bg-secondary rounded mb-2"></div>
          <div className="h-3 bg-secondary rounded w-3/4"></div>
        </div>
      </div>
      <div className="h-2 bg-secondary rounded mb-4"></div>
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="h-8 bg-secondary rounded"></div>
        <div className="h-8 bg-secondary rounded"></div>
        <div className="h-8 bg-secondary rounded"></div>
      </div>
      <div className="flex space-x-2">
        <div className="flex-1 h-10 bg-secondary rounded-xl"></div>
        <div className="flex-1 h-10 bg-secondary rounded-xl"></div>
      </div>
    </div>
  )



  return (
    <div className="min-h-screen bg-primary text-primary language-transition">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 glass-effect border-b border-primary">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Navigation Group */}
            <div className="flex items-center space-x-4">
              {/* Logo */}
              <button 
                onClick={() => setActiveTab('Markets')}
                className="transition-opacity hover:opacity-80"
              >
                <svg width="140" height="28" viewBox="0 0 140 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="0.311111" y="0.311111" width="27.3778" height="27.3778" rx="7.15556" stroke="white" strokeWidth="0.622222"/>
                  <path d="M12.6514 20.123C13.0828 20.123 13.4497 20.2277 13.749 20.4033C13.8279 20.4371 14.5784 20.8121 14.6533 20.8555H14.6543C15.4491 21.191 15.8613 21.9825 15.8613 22.7666C15.8613 23.2552 15.6719 23.7486 15.3438 24.1191C15.072 24.4252 14.5813 24.79 13.7822 24.79C13.3259 24.79 12.9699 24.671 12.6982 24.5117C12.6175 24.4773 11.8639 24.0995 11.7939 24.0586C11.4759 23.9247 11.2458 23.73 11.0898 23.5537C10.7617 23.1832 10.5743 22.6898 10.5742 22.2012C10.5742 21.6798 10.7613 21.166 11.0889 20.792C11.356 20.4864 11.8449 20.1231 12.6514 20.123ZM12.6514 20.4619C11.4827 20.4621 10.9121 21.3589 10.9121 22.2012C10.9122 22.962 11.4828 23.8856 12.6514 23.8857C13.8201 23.8857 14.3905 22.9621 14.3906 22.2012C14.3906 21.3589 13.8202 20.4619 12.6514 20.4619ZM13.1143 3.20996C14.3474 3.20996 15.4874 3.49911 16.4482 4.00293C16.5245 4.03908 16.6002 4.07723 16.6748 4.11621C16.751 4.15232 16.8259 4.19057 16.9004 4.22949C16.9765 4.26556 17.0516 4.30292 17.126 4.3418L17.3525 4.45508C19.2659 5.36573 20.5332 7.10572 20.5332 9.14453C20.5332 11.716 18.9335 13.1118 17.3867 14.4619C16.6337 15.1189 15.9216 15.7404 15.3984 16.4844C14.8635 17.2458 14.8174 17.6075 14.8174 19.1084V19.4473H12.5098L11.3789 18.8818V17.2373C11.3789 15.2561 12.5284 13.96 13.6396 12.707C14.8078 11.3903 15.9111 10.1462 15.9111 8.09961C15.9111 7.12188 15.5981 6.36359 15.0146 5.86426C14.6899 5.78125 14.3301 5.7383 13.9365 5.73828C13.0909 5.73828 12.4051 5.99816 11.9023 6.28906C12.4382 6.70083 12.7187 7.27574 12.7188 7.97656C12.7188 9.12562 11.7999 9.99219 10.583 9.99219C10.2216 9.99211 9.87972 9.90033 9.58496 9.72754C9.50708 9.6948 9.43218 9.65659 9.35938 9.61426C9.28161 9.58214 9.20649 9.5442 9.13379 9.50195C9.05583 9.46919 8.9801 9.43104 8.90723 9.38867C8.82933 9.35593 8.75446 9.31772 8.68164 9.27539C8.4472 9.17709 8.23377 9.03336 8.05469 8.84863C7.67019 8.45211 7.46682 7.90325 7.4668 7.26172C7.4668 6.22791 8.05433 5.19722 9.0791 4.43457C10.1406 3.64486 11.5738 3.20997 13.1143 3.20996ZM13.1133 3.54883C9.97087 3.54901 7.80566 5.39926 7.80566 7.26172C7.80573 8.42932 8.57019 9.08789 9.45312 9.08789C10.501 9.08785 11.249 8.36922 11.249 7.41113C11.249 6.66278 10.8899 6.09365 10.1416 5.73438C10.7404 5.28539 11.6383 4.83404 12.8057 4.83398C15.111 4.83398 16.2499 6.18355 16.25 8.09961C16.25 12.3365 11.7178 13.4309 11.7178 17.2373V18.543H13.3467C13.3467 17.0454 13.3884 16.5806 13.9912 15.7236C15.6335 13.388 19.0634 12.2028 19.0635 8.5791C19.0635 5.69743 16.3802 3.54883 13.1133 3.54883Z" fill="white"/>
                  <path d="M70.2769 20.7279C67.8892 20.7279 66.0207 18.6249 66.0207 14.4168C66.0207 10.2087 67.61 8.16817 69.962 8.16817C71.0546 8.16817 71.6581 8.67215 71.9486 9.53802C72.3291 10.671 72.2485 12.183 73.7927 12.183C74.5949 12.183 75.129 11.5142 75.129 10.6483C75.129 9.19508 72.9194 7.37052 69.8365 7.37052C66.1013 7.37052 63.0259 9.76917 63.0259 14.7578C63.0259 19.7465 67.0046 21.6203 69.8683 21.6203C72.732 21.6203 74.5743 20.313 75.5132 18.1777L74.6923 17.9219C73.9558 19.4737 72.3272 20.7279 70.2788 20.7279H70.2769ZM58.6235 8.58121C57.4466 7.77408 56.1122 7.37052 54.6185 7.37052C52.4951 7.37052 50.7503 8.10375 49.3841 9.57023C48.2071 10.8662 47.6187 12.4596 47.6187 14.3524C47.6187 16.9462 48.5426 18.9223 50.3942 20.2808C51.6124 21.1732 52.9805 21.6203 54.493 21.6203C56.5732 21.6203 58.2881 20.8776 59.6318 19.3884C60.85 18.0489 61.461 16.4024 61.461 14.4471C61.461 11.8552 60.5145 9.8999 58.6235 8.58121ZM54.5867 20.8227C51.9591 20.781 50.6341 18.6665 50.6135 14.4793C50.6341 10.2921 51.9385 8.18901 54.5229 8.16817C57.1092 8.21175 58.4118 10.2713 58.4324 14.3524C58.4118 18.6457 57.128 20.8018 54.5848 20.8227H54.5867ZM121.401 7.36862C117.784 7.36862 114.403 9.76727 114.403 14.7578C114.403 19.7484 118.607 21.6184 121.433 21.6184C124.812 21.6184 126.336 19.9019 127.078 18.1758L126.257 17.92C125.521 19.4718 124.089 20.726 121.844 20.726C119.598 20.726 117.505 18.2857 117.419 14.8886H127.503V14.2482C127.503 10.7601 125.389 7.36862 121.401 7.36862ZM124.494 14L117.402 14.0038V13.7953C117.402 10.1898 119.104 8.17386 121.3 8.17386C123.497 8.17386 124.494 10.4096 124.494 13.7953V14ZM42.03 13.4145C40.2983 12.6945 37.519 11.8476 37.519 10.1784C37.519 8.6911 39.29 8.16817 40.9617 8.16817C42.7197 8.16817 44.7962 9.19129 44.7962 11.0784V11.1655H45.5759V7.18105H44.785L44.6613 8.2648C43.6717 7.66987 42.1724 7.37241 40.7406 7.37241C37.8188 7.37241 35.4668 8.56984 35.4668 11.0045C35.4668 13.4391 37.474 14.4774 39.5205 15.3831C41.5671 16.2887 44.3708 17.0712 44.3708 18.5187C44.3708 20.1008 42.864 20.8227 41.0348 20.8227C38.293 20.8227 36.3195 19.3448 36.3195 16.9026V16.6468H35.4668V21.6184H36.2577L36.3814 20.5404C37.5246 21.2395 39.3481 21.6184 40.898 21.6184C43.2894 21.6184 46.4567 20.8227 46.4567 17.7609C46.4567 14.8867 43.7636 14.1326 42.0319 13.4126L42.03 13.4145ZM101.873 20.601C101.133 20.601 100.57 19.9587 100.57 18.5794V12.2493C100.565 8.9772 98.2689 7.37241 94.9723 7.37241C91.8875 7.37241 89.4905 9.11361 89.4905 10.7203C89.4905 11.6923 90.1352 12.1849 90.8286 12.1849C92.371 12.1849 92.2904 10.6729 92.6709 9.53991C92.9632 8.67215 93.7522 8.16817 94.8448 8.16817C96.5803 8.16817 97.8809 9.29361 97.8584 11.4838V13.1133C92.624 13.1341 89.0931 15.0363 89.0931 17.9807V18.3369C89.0931 20.4021 90.6412 21.6203 93.1169 21.6203C95.4633 21.6203 97.2062 20.2031 97.8903 18.7196C98.162 20.6332 99.5452 21.6203 101.059 21.6203C102.714 21.6203 103.507 20.7677 104.011 20.224L103.605 19.7048C103.232 20.1141 102.525 20.601 101.873 20.601ZM97.8584 16.8552C97.5005 18.3217 96.2055 20.313 94.3894 20.313C93.0644 20.313 91.9006 19.5646 91.9006 17.8897V17.4407C91.9006 16.0178 92.8658 14.7067 94.4213 14.324C95.2403 14.1326 96.3854 14.0265 97.8584 14.0056V16.8552ZM111.35 20.601C110.111 20.601 108.816 19.7977 108.816 17.3497V8.41448H113.579V7.61682H108.816V3.26666H108.027C108.027 5.6691 106.101 7.61682 103.724 7.61682H102.802V8.41448H106.103C106.103 9.82032 106.097 16.8249 106.103 16.8135C106.103 19.9038 107.908 21.6222 110.231 21.6222C112.409 21.6222 113.487 20.5802 113.991 20.0364L113.584 19.5172C113.211 19.9265 112.43 20.6029 111.348 20.6029L111.35 20.601ZM85.8977 7.53156C83.0397 7.53156 81.4729 9.79001 81.0456 10.8037L80.9444 7.72482H75.9705V8.71005H78.3975V20.3168H75.9705V21.3039H84.5427V20.3168H81.1093V14.197C81.1093 11.4346 83.3658 8.93551 84.226 8.93551C85.2062 8.93551 85.0094 10.8472 86.5912 10.8472C87.2846 10.8472 88.0099 10.2163 88.0099 9.38076C88.0099 8.54521 87.339 7.53346 85.8977 7.53346V7.53156ZM135.577 13.4145C133.845 12.6945 131.066 11.8476 131.066 10.1784C131.066 8.6911 132.837 8.16817 134.509 8.16817C136.267 8.16817 138.343 9.19129 138.343 11.0784V11.1655H139.123V7.18105H138.332L138.208 8.2648C137.219 7.66987 135.72 7.37241 134.288 7.37241C131.364 7.37241 129.012 8.56984 129.012 11.0045C129.012 13.4391 131.019 14.4774 133.066 15.3831C135.112 16.2887 137.916 17.0712 137.916 18.5187C137.916 20.1008 136.409 20.8227 134.58 20.8227C131.838 20.8227 129.865 19.3448 129.865 16.9026V16.6468H129.01V21.6184H129.801L129.925 20.5404C131.068 21.2395 132.892 21.6184 134.441 21.6184C136.833 21.6184 140 20.8227 140 17.7609C140 14.8867 137.307 14.1326 135.575 13.4126L135.577 13.4145Z" fill="white"/>
                </svg>
              </button>

              {/* Main Tabs Group with 16px spacing from logo */}
              <div className="hidden md:flex items-center space-x-1" style={{ marginLeft: '16px' }}>
                {mainTabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-4 py-2 font-medium transition-all duration-200 ${
                      activeTab === tab.key
                        ? 'text-[#00FFAE]'
                        : 'text-secondary hover:text-primary'
                    }`}
                  >
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Side Controls */}
            <div className="flex items-center space-x-4">
              {/* Search Box */}
              <div className="relative hidden sm:block">
                <input
                    type="text"
                    placeholder="搜索代币..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64 bg-tertiary border border-secondary rounded-lg px-4 py-2 text-primary placeholder-gray-400 focus:outline-none focus:border-[#00FFAE] transition-colors"
                  />
                  <svg className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
              </div>

              {/* Balance Display - Hidden by default */}
              <div className="hidden items-center space-x-4">
                <div className="bg-tertiary border border-secondary rounded-lg px-4 py-2">
                  <div className="text-xs text-secondary">文件夹余额</div>
                  <div className="text-primary font-semibold">$3,247.89</div>
                </div>
                <div className="bg-tertiary border border-secondary rounded-lg px-4 py-2">
                  <div className="text-xs text-secondary">现金余额</div>
                  <div className="text-primary font-semibold">$3,156.42</div>
                </div>
              </div>


              {/* Theme & Language Controls */}
              <Navbar />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 md:hidden overflow-x-auto">
          {mainTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 hover:scale-105 flex items-center space-x-2 whitespace-nowrap ${
                activeTab === tab.key
                  ? 'bg-[#00FFAE] text-black'
                  : 'bg-tertiary text-secondary hover:bg-secondary'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Axiom Trade Style Filter Bar - Only show for Markets tab */}
        {activeTab === 'Markets' && (
          <div className="bg-tertiary rounded-xl p-4 border border-secondary mb-8">
            {/* Desktop Layout (1024px+) */}
            <div className="hidden lg:flex items-center justify-between gap-6">
              {/* Time Filters Group */}
              <div className="flex items-center gap-3">
                <span className="text-secondary text-sm font-medium whitespace-nowrap">热门板块:</span>
                <div className="flex items-center gap-2">
                  {timeFilters.map((filter) => (
                    <button
                      key={filter.key}
                      onClick={() => setSelectedTimeFilter(filter.key)}
                      className={`h-10 px-4 rounded-lg font-medium text-sm transition-all duration-200 hover:scale-105 whitespace-nowrap ${
                        selectedTimeFilter === filter.key
                          ? 'bg-[#00FFAE] text-black'
                          : 'bg-primary text-secondary hover:bg-secondary'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search and Controls Group */}
              <div className="flex items-center gap-3 pr-2">
                {/* Search Box */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="搜索市场..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-10 w-64 pl-10 pr-4 bg-primary border border-secondary rounded-lg text-primary placeholder-secondary focus:outline-none focus:border-[#00FFAE] transition-colors text-sm"
                  />
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                
                {/* Category Select */}
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="h-10 bg-primary border border-secondary rounded-lg px-4 text-primary focus:outline-none focus:border-[#00FFAE] transition-colors text-sm min-w-[120px]"
                >
                  <option value="all">所有分类</option>
                  <option value="crypto">加密货币</option>
                  <option value="politics">政治</option>
                  <option value="sports">体育</option>
                  <option value="tech">科技</option>
                  <option value="entertainment">娱乐</option>
                </select>
                
                {/* Sort Select */}
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="h-10 bg-primary border border-secondary rounded-lg px-4 text-primary focus:outline-none focus:border-[#00FFAE] transition-colors text-sm min-w-[100px]"
                >
                  <option value="newest">最新</option>
                  <option value="volume">交易量</option>
                  <option value="ending">即将结束</option>
                  <option value="popular">最受欢迎</option>
                </select>
              </div>
            </div>

            {/* Tablet Layout (768px - 1023px) */}
            <div className="hidden md:flex lg:hidden flex-col gap-4">
              {/* Time Filters */}
              <div className="flex items-center gap-3">
                <span className="text-secondary text-sm font-medium whitespace-nowrap">热门板块:</span>
                <div className="flex items-center gap-2 flex-wrap">
                  {timeFilters.map((filter) => (
                    <button
                      key={filter.key}
                      onClick={() => setSelectedTimeFilter(filter.key)}
                      className={`h-10 px-3 rounded-lg font-medium text-sm transition-all duration-200 hover:scale-105 whitespace-nowrap ${
                        selectedTimeFilter === filter.key
                          ? 'bg-[#00FFAE] text-black'
                          : 'bg-primary text-secondary hover:bg-secondary'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search and Controls */}
              <div className="flex items-center gap-3">
                {/* Search Box */}
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="搜索市场..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-10 w-full pl-10 pr-4 bg-primary border border-secondary rounded-lg text-primary placeholder-secondary focus:outline-none focus:border-[#00FFAE] transition-colors text-sm"
                  />
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                
                {/* Category Select */}
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="h-10 bg-primary border border-secondary rounded-lg px-4 text-primary focus:outline-none focus:border-[#00FFAE] transition-colors text-sm min-w-[120px]"
                >
                  <option value="all">所有分类</option>
                  <option value="crypto">加密货币</option>
                  <option value="politics">政治</option>
                  <option value="sports">体育</option>
                  <option value="tech">科技</option>
                  <option value="entertainment">娱乐</option>
                </select>
                
                {/* Sort Select */}
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="h-10 bg-primary border border-secondary rounded-lg px-4 text-primary focus:outline-none focus:border-[#00FFAE] transition-colors text-sm min-w-[100px]"
                >
                  <option value="newest">最新</option>
                  <option value="volume">交易量</option>
                  <option value="ending">即将结束</option>
                  <option value="popular">最受欢迎</option>
                </select>
              </div>
            </div>

            {/* Mobile Layout (< 768px) */}
            <div className="flex md:hidden flex-col gap-4">
              {/* Time Filters - Horizontal Scroll */}
              <div className="flex flex-col gap-2">
                <span className="text-secondary text-sm font-medium">热门板块:</span>
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {timeFilters.map((filter) => (
                    <button
                      key={filter.key}
                      onClick={() => setSelectedTimeFilter(filter.key)}
                      className={`h-11 px-4 rounded-lg font-medium text-sm transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                        selectedTimeFilter === filter.key
                          ? 'bg-[#00FFAE] text-black'
                          : 'bg-primary text-secondary'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search Box - Full Width */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="搜索市场..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-11 w-full pl-10 pr-4 bg-primary border border-secondary rounded-lg text-primary placeholder-secondary focus:outline-none focus:border-[#00FFAE] transition-colors text-sm"
                />
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Controls - Side by Side */}
              <div className="grid grid-cols-2 gap-3">
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="h-11 bg-primary border border-secondary rounded-lg px-4 text-primary focus:outline-none focus:border-[#00FFAE] transition-colors text-sm"
                >
                  <option value="all">所有分类</option>
                  <option value="crypto">加密货币</option>
                  <option value="politics">政治</option>
                  <option value="sports">体育</option>
                  <option value="tech">科技</option>
                  <option value="entertainment">娱乐</option>
                </select>
                
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="h-11 bg-primary border border-secondary rounded-lg px-4 text-primary focus:outline-none focus:border-[#00FFAE] transition-colors text-sm"
                >
                  <option value="newest">最新</option>
                  <option value="volume">交易量</option>
                  <option value="ending">即将结束</option>
                  <option value="popular">最受欢迎</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Content based on active tab */}
        {activeTab === 'Markets' && (
          <div className="space-y-8">
            
            {/* 统一滚动三列布局 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 最新创建话题 */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-primary">{t('section.newCreated')}</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-green-400">{t('section.updateEvery10s')}</span>
                    </div>
                  </div>
                  <span className="text-sm text-secondary bg-tertiary px-2 py-1 rounded">{newCreatedMarkets.length}</span>
                </div>
                <div className="space-y-4">
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <LoadingSkeleton key={index} />
                    ))
                  ) : (
                    newCreatedMarkets.map((market, index) => {
                      const isNewlyAdded = market.id.includes('_refresh')
                      return (
                        <div 
                          key={market.id} 
                          className={`transition-all duration-500 animate-fade-in ${
                            isNewlyAdded && index < 3 
                              ? 'border-2 border-green-500 shadow-lg shadow-green-500/20 animate-pulse rounded-lg' 
                              : 'border-2 border-green-500 rounded-lg'
                          }`}
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <PredictionCard 
                            {...market} 
                            onCardClick={handleCardClick}
                          />
                        </div>
                      )
                    })
                  )}
                </div>
              </div>

              {/* 即将发射话题 */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-primary">{t('section.aboutToLaunch')}</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-orange-400">{t('section.updateEvery15s')}</span>
                    </div>
                  </div>
                  <span className="text-sm text-secondary bg-tertiary px-2 py-1 rounded">{aboutToLaunchMarkets.length}</span>
                </div>
                <div className="space-y-4">
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <LoadingSkeleton key={index} />
                    ))
                  ) : (
                    aboutToLaunchMarkets.map((market, index) => {
                      const isNewlyAdded = market.id.includes('_refresh')
                      return (
                        <div 
                          key={market.id} 
                          className={`transition-all duration-500 animate-fade-in ${
                            isNewlyAdded && index < 3 
                              ? 'border-2 border-orange-500 shadow-lg shadow-orange-500/20 animate-pulse rounded-lg' 
                              : 'border-2 border-orange-500 rounded-lg'
                          }`}
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <PredictionCard 
                            {...market} 
                            onCardClick={handleCardClick}
                          />
                        </div>
                      )
                    })
                  )}
                </div>
              </div>

              {/* 已经发射话题 */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-primary">{t('section.launched')}</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-blue-400">{t('section.keepOriginal')}</span>
                    </div>
                  </div>
                  <span className="text-sm text-secondary bg-tertiary px-2 py-1 rounded">{launchedMarkets.length}</span>
                </div>
                <div className="space-y-4">
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <LoadingSkeleton key={index} />
                    ))
                  ) : (
                    launchedMarkets.map((market, index) => (
                      <div 
                        key={market.id} 
                        className="transition-all duration-300 animate-fade-in" 
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <PredictionCard 
                          {...market} 
                          onCardClick={handleCardClick}
                        />
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
          </div>
        )}

        {/* Following Tab - 跟单板块 */}
        {activeTab === 'Following' && (
          <div className="space-y-6">
            {/* 聪明钱包排行榜 */}
            <div className="bg-tertiary rounded-2xl p-6 border border-secondary">
              <h2 className="text-xl font-bold text-primary mb-6">{t('following.smartWallets')}</h2>
              
              {/* 表头 */}
              <div className="grid grid-cols-12 gap-4 text-sm text-secondary font-medium mb-4 px-4">
                <div className="col-span-2">{t('following.wallet')}</div>
                <div className="col-span-1 text-center">{t('following.1dPnl')}</div>
                <div className="col-span-1 text-center">{t('following.7dPnl')}</div>
                <div className="col-span-1 text-center">{t('following.30dPnl')}</div>
                <div className="col-span-1 text-center">{t('following.7dWinRate')}</div>
                <div className="col-span-1 text-center">{t('following.7dTrades')}</div>
                <div className="col-span-1 text-center">{t('following.followers')}</div>
                <div className="col-span-2 text-center">{t('following.balance')}</div>
                <div className="col-span-2 text-center">{t('following.actions')}</div>
              </div>
              
              {/* 钱包列表 */}
              <div className="space-y-3">
                {smartWallets.map((wallet, index) => (
                  <div key={wallet.id} className="grid grid-cols-12 gap-4 items-center p-4 hover:bg-primary transition-colors border-b border-gray-700 last:border-b-0">
                    {/* 钱包信息 */}
                    <div className="col-span-2 flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-lg">
                          {wallet.avatar}
                        </div>
                        {wallet.status === 'online' && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-secondary"></div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-primary">{wallet.address}</div>
                        <div className="text-xs text-secondary">#{index + 1}</div>
                      </div>
                    </div>
                    
                    {/* 1D盈亏 */}
                    <div className="col-span-1 text-center">
                      <span className={`font-medium ${
                        wallet.pnl1d.startsWith('+') ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {wallet.pnl1d}
                      </span>
                    </div>
                    
                    {/* 7D盈亏 */}
                    <div className="col-span-1 text-center">
                      <span className={`font-medium ${
                        wallet.pnl7d.startsWith('+') ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {wallet.pnl7d}
                      </span>
                    </div>
                    
                    {/* 30D盈亏 */}
                    <div className="col-span-1 text-center">
                      <span className={`font-medium ${
                        wallet.pnl30d.startsWith('+') ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {wallet.pnl30d}
                      </span>
                    </div>
                    
                    {/* 7D胜率 */}
                    <div className="col-span-1 text-center">
                      <span className="font-medium text-primary">{wallet.winRate7d}</span>
                    </div>
                    
                    {/* 7D交易数 */}
                    <div className="col-span-1 text-center">
                      <span className="font-medium text-primary">{wallet.trades7d}</span>
                    </div>
                    
                    {/* 跟单人数 */}
                    <div className="col-span-1 text-center">
                      <span className="font-medium text-primary">{wallet.followers}</span>
                    </div>
                    
                    {/* 钱包余额 */}
                    <div className="col-span-2 text-center">
                      <span className="font-medium text-primary">{wallet.balance}</span>
                    </div>
                    
                    {/* 操作按钮 */}
                    <div className="col-span-2 flex space-x-2 justify-center">
                      <button 
                        onClick={() => setSelectedWallet(wallet.id)}
                        className="bg-[#00FFAE] hover:bg-[#00D4AA] text-black px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                      >
                        跟单
                      </button>
                      <button className="bg-tertiary hover:bg-secondary text-secondary hover:text-primary px-4 py-2 rounded-lg font-medium transition-colors text-sm">
                        详情
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* 跟单历史 */}
            <div className="bg-tertiary rounded-2xl p-6 border border-secondary">
              <h3 className="text-lg font-bold text-primary mb-4">📈 我的跟单历史</h3>
              <div className="text-center py-8 text-secondary">
                <div className="text-4xl mb-4">📊</div>
                <p>暂无跟单记录</p>
                <p className="text-sm mt-2">选择聪明钱包开始跟单投资</p>
              </div>
            </div>
          </div>
        )}

        {/* Live Tab Content */}
        {activeTab === 'Live' && (
          <div className="space-y-6">
            {/* Featured Live Streams */}
            <div className="bg-[#1A1A1A] rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">🔴 热门直播</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { id: 1, title: 'CryptoKing - BTC突破分析', topic: '比特币即将突破12万美元？技术分析详解', viewers: 2847, avatar: '👑', bgType: 'chart', web3Visual: 'btc-chart' },
                  { id: 2, title: 'MarketGuru - 实时交易', topic: '跟着我一起抓住市场机会', viewers: 1923, avatar: '📈', bgType: 'defi', web3Visual: 'uniswap-logo' },
                  { id: 3, title: 'PredictionMaster - 预测解析', topic: '今日热门预测市场深度分析', viewers: 3456, avatar: '🔮', bgType: 'nft', web3Visual: 'opensea-activity' },
                  { id: 4, title: 'TechAnalyst - 技术指标', topic: 'RSI与MACD双重信号确认', viewers: 1567, avatar: '📊', bgType: 'dao', web3Visual: 'governance-vote' },
                  { id: 5, title: 'WhaleWatcher - 巨鲸动向', topic: '监控大户资金流向', viewers: 2134, avatar: '🐋', bgType: 'metaverse', web3Visual: 'metamask-connect' },
                  { id: 6, title: 'NewsTrader - 消息面分析', topic: '重大新闻对市场的影响', viewers: 987, avatar: '📰', bgType: 'ethereum', web3Visual: 'eth-staking' }
                ].map((stream) => (
                  <div key={stream.id} className="bg-[#0F0F0F] rounded-lg overflow-hidden hover:bg-[#1F1F1F] transition-colors cursor-pointer group">
                    <div className="aspect-video bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 relative overflow-hidden">
                      {/* Web3 相关视频内容 */}
                      <div className="absolute inset-0 bg-black bg-opacity-20">
                        {/* 根据类型显示不同的Web3视觉元素 */}
                        {stream.bgType === 'chart' && (
                          <>
                            {/* BTC 价格图表 */}
                            <div className="absolute top-4 left-4 right-4">
                              <div className="flex items-end space-x-1 h-16">
                                {Array.from({ length: 20 }).map((_, i) => (
                                  <div 
                                    key={i} 
                                    className={`w-2 bg-gradient-to-t ${
                                      Math.random() > 0.5 ? 'from-green-400 to-green-600' : 'from-red-400 to-red-600'
                                    } opacity-70`}
                                    style={{ height: `${Math.random() * 60 + 20}%` }}
                                  />
                                ))}
                              </div>
                            </div>
                            {/* Bitcoin 图标 */}
                            <div className="absolute top-4 left-4 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">₿</div>
                          </>
                        )}
                        
                        {stream.bgType === 'defi' && (
                          <>
                            {/* DeFi 流动性池视觉 */}
                            <div className="absolute inset-4 flex items-center justify-center">
                              <div className="relative">
                                <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full opacity-60 animate-pulse"></div>
                                <div className="absolute top-2 left-2 w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full opacity-70"></div>
                                <div className="absolute top-4 left-4 w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-xs">🦄</div>
                              </div>
                            </div>
                            {/* Uniswap 风格的 swap 箭头 */}
                            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white">
                              <svg className="w-6 h-6 animate-bounce" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M7 14l5-5 5 5H7z"/>
                              </svg>
                            </div>
                          </>
                        )}
                        
                        {stream.bgType === 'nft' && (
                          <>
                            {/* NFT 收藏展示 */}
                            <div className="absolute inset-4 grid grid-cols-3 gap-2">
                              {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className={`aspect-square rounded-lg ${
                                  ['bg-gradient-to-br from-purple-400 to-pink-600', 
                                   'bg-gradient-to-br from-blue-400 to-purple-600',
                                   'bg-gradient-to-br from-green-400 to-blue-600',
                                   'bg-gradient-to-br from-yellow-400 to-orange-600',
                                   'bg-gradient-to-br from-red-400 to-pink-600',
                                   'bg-gradient-to-br from-indigo-400 to-purple-600'][i]
                                } opacity-80 flex items-center justify-center text-white text-lg`}>
                                  {['🎨', '👾', '🚀', '💎', '🔥', '⚡'][i]}
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                        
                        {stream.bgType === 'dao' && (
                          <>
                            {/* DAO 治理投票界面 */}
                            <div className="absolute inset-4 flex flex-col justify-center space-y-2">
                              <div className="bg-black bg-opacity-50 rounded p-2">
                                <div className="text-white text-xs mb-1">提案 #42: 增加流动性奖励</div>
                                <div className="flex space-x-2">
                                  <div className="flex-1 bg-green-500 h-2 rounded-full"></div>
                                  <div className="w-8 bg-red-500 h-2 rounded-full"></div>
                                </div>
                                <div className="text-green-400 text-xs mt-1">赞成: 87.5%</div>
                              </div>
                              <div className="text-center">
                                <div className="inline-flex items-center space-x-1 bg-blue-500 px-2 py-1 rounded text-white text-xs">
                                  <span>🗳️</span>
                                  <span>投票中</span>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                        
                        {stream.bgType === 'metaverse' && (
                          <>
                            {/* Metaverse/Web3 钱包连接 */}
                            <div className="absolute inset-4 flex items-center justify-center">
                              <div className="bg-black bg-opacity-60 rounded-lg p-4 text-center">
                                <div className="w-12 h-12 bg-orange-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                                  🦊
                                </div>
                                <div className="text-white text-xs">MetaMask</div>
                                <div className="text-green-400 text-xs">已连接</div>
                                <div className="text-gray-400 text-xs font-mono">0x7a...8f2c</div>
                              </div>
                            </div>
                          </>
                        )}
                        
                        {stream.bgType === 'ethereum' && (
                          <>
                            {/* Ethereum Staking 界面 */}
                            <div className="absolute inset-4 flex items-center justify-center">
                              <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full mx-auto mb-2 flex items-center justify-center text-white text-2xl animate-pulse">
                                  Ξ
                                </div>
                                <div className="bg-black bg-opacity-60 rounded px-2 py-1">
                                  <div className="text-blue-400 text-xs">ETH Staking</div>
                                  <div className="text-green-400 text-xs">APR: 4.2%</div>
                                  <div className="text-white text-xs">32.0 ETH</div>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                        
                        {/* 主播头像 */}
                        <div className="absolute bottom-16 left-4">
                          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-2xl border-2 border-white">
                            {stream.avatar}
                          </div>
                        </div>
                        
                        {/* 实时数据根据类型显示 */}
                        <div className="absolute top-4 right-4 bg-black bg-opacity-60 rounded px-2 py-1">
                          {stream.bgType === 'chart' && (
                            <div className="text-green-400 text-xs font-mono">
                              BTC: ${(Math.random() * 10000 + 90000).toFixed(0)}
                            </div>
                          )}
                          {stream.bgType === 'defi' && (
                            <div className="text-purple-400 text-xs font-mono">
                              TVL: ${(Math.random() * 100 + 400).toFixed(1)}M
                            </div>
                          )}
                          {stream.bgType === 'nft' && (
                            <div className="text-pink-400 text-xs font-mono">
                              Floor: {(Math.random() * 5 + 1).toFixed(1)} ETH
                            </div>
                          )}
                          {stream.bgType === 'dao' && (
                            <div className="text-blue-400 text-xs font-mono">
                              Voters: {Math.floor(Math.random() * 1000 + 2000)}
                            </div>
                          )}
                          {stream.bgType === 'metaverse' && (
                            <div className="text-orange-400 text-xs font-mono">
                              Gas: {Math.floor(Math.random() * 50 + 20)} gwei
                            </div>
                          )}
                          {stream.bgType === 'ethereum' && (
                            <div className="text-blue-400 text-xs font-mono">
                              ETH: ${(Math.random() * 1000 + 3000).toFixed(0)}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* LIVE标签 */}
                      <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold animate-pulse">
                        🔴 LIVE
                      </div>
                      
                      {/* 观看人数 */}
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs flex items-center space-x-1">
                        <span>👁</span>
                        <span>{stream.viewers.toLocaleString()}</span>
                      </div>
                      
                      {/* 悬停播放按钮 */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
                          <div className="w-0 h-0 border-l-8 border-r-0 border-t-6 border-b-6 border-l-white border-t-transparent border-b-transparent ml-1"></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="text-white font-medium mb-1 line-clamp-1">{stream.title}</h3>
                      <p className="text-gray-400 text-sm line-clamp-2">{stream.topic}</p>
                      <div className="flex items-center justify-between mt-3 text-xs">
                        <span className="text-green-400 flex items-center space-x-1">
                          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                          <span>直播中</span>
                        </span>
                        <span className="text-gray-500">{stream.viewers.toLocaleString()} 观看</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Chat */}
            <div className="bg-[#1A1A1A] rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">💬 实时聊天</h2>
              <div className="bg-[#0F0F0F] rounded-lg p-4 h-64 overflow-y-auto mb-4">
                {[...Array(20)].map((_, i) => (
                  <div key={i} className="mb-2 text-sm">
                    <span className="text-[#00FFAE] font-medium">用户{i + 1}:</span>
                    <span className="text-gray-300 ml-2">这个项目看起来很有潜力！</span>
                  </div>
                ))}
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="输入消息..."
                  className="flex-1 bg-[#0F0F0F] border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-[#00FFAE]"
                />
                <button className="bg-[#00FFAE] hover:bg-[#00D4AA] text-black px-6 py-2 rounded-lg font-medium transition-colors">
                  发送
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Video Tab Content */}
        {activeTab === 'Video' && (
          <div className="space-y-6">
            <div className="bg-[#1A1A1A] rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">🎥 热门视频</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                  <div key={i} className="bg-[#0F0F0F] rounded-lg overflow-hidden hover:bg-[#1F1F1F] transition-colors cursor-pointer">
                    <div className="aspect-video bg-gradient-to-br from-green-600 to-teal-600 relative">
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                        {Math.floor(Math.random() * 60) + 1}:{String(Math.floor(Math.random() * 60)).padStart(2, '0')}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                          <div className="w-0 h-0 border-l-4 border-r-0 border-t-2 border-b-2 border-l-white border-t-transparent border-b-transparent ml-1"></div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-white font-medium mb-2">市场分析第{i}期</h3>
                      <p className="text-gray-400 text-sm mb-2">深度解析当前市场趋势和投资机会</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{Math.floor(Math.random() * 10000) + 1000} 观看</span>
                        <span>{Math.floor(Math.random() * 7) + 1}天前</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Audio Tab Content */}
        {activeTab === 'Audio' && (
          <div className="space-y-6">
            <div className="bg-[#1A1A1A] rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">🎙️ 语音直播</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-[#0F0F0F] rounded-lg p-6 hover:bg-[#1F1F1F] transition-colors cursor-pointer">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">主{i}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-medium mb-1">语音房间 {i}</h3>
                        <p className="text-gray-400 text-sm">正在讨论: DeFi协议分析</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                          <span className="text-red-400 text-xs">直播中</span>
                          <span className="text-gray-500 text-xs">• {Math.floor(Math.random() * 500) + 50} 听众</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        {[1, 2, 3, 4].map((j) => (
                          <div key={j} className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">U{j}</span>
                          </div>
                        ))}
                        <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                          <span className="text-gray-400 text-xs">+{Math.floor(Math.random() * 20) + 5}</span>
                        </div>
                      </div>
                      <button className="bg-[#00FFAE] hover:bg-[#00D4AA] text-black px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                        加入
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Audio Podcasts */}
            <div className="bg-[#1A1A1A] rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">🎧 热门播客</h2>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="bg-[#0F0F0F] rounded-lg p-4 hover:bg-[#1F1F1F] transition-colors cursor-pointer">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold">P{i}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-medium mb-1">加密货币深度访谈 第{i}期</h3>
                        <p className="text-gray-400 text-sm">与行业专家探讨最新趋势</p>
                      </div>
                      <div className="text-right">
                        <div className="text-gray-500 text-xs">{Math.floor(Math.random() * 60) + 10}分钟</div>
                        <div className="text-gray-500 text-xs">{Math.floor(Math.random() * 5000) + 1000} 播放</div>
                      </div>
                      <button className="w-10 h-10 bg-[#00FFAE] hover:bg-[#00D4AA] rounded-full flex items-center justify-center transition-colors">
                        <div className="w-0 h-0 border-l-3 border-r-0 border-t-2 border-b-2 border-l-black border-t-transparent border-b-transparent ml-1"></div>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Load More Button - Only for Markets */}
        {activeTab === 'Markets' && !isLoading && (marketGroups.new.length > 0 || marketGroups.launching.length > 0 || marketGroups.launched.length > 0) && (
          <div className="text-center mt-12">
            <button className="bg-[#00FFAE] hover:bg-[#00D4AA] text-black font-bold py-3 px-8 rounded-lg transition-all duration-200 hover:scale-105 animate-bounce-in">
              加载更多
            </button>
          </div>
        )}

        {/* No Results - Only for Markets */}
        {activeTab === 'Markets' && !isLoading && marketGroups.new.length === 0 && marketGroups.launching.length === 0 && marketGroups.launched.length === 0 && (
          <div className="text-center py-12 animate-fade-in">
            <div className="text-gray-400 text-lg mb-4">暂无搜索结果</div>
            <button 
              onClick={() => {
                setSearchQuery('')
              }}
              className="text-[#00FFAE] hover:text-[#00D4AA] transition-colors hover:scale-105"
            >
              清除搜索条件
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-dark-700 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-accent-green to-primary-400 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">P</span>
                </div>
                <span className="text-xl font-bold text-gradient">PredictMarket</span>
              </div>
              <p className="text-gray-400">
                {t('footer.description')}
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">{t('footer.markets')}</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">{t('category.crypto')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t('category.politics')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t('category.sports')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t('category.tech')}</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">{t('footer.support')}</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">{t('footer.helpCenter')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t('footer.documentation')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t('footer.api')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t('footer.contact')}</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">{t('footer.community')}</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Discord</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Telegram</a></li>
                <li><a href="#" className="hover:text-white transition-colors">GitHub</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-dark-700 mt-8 pt-8 text-center text-gray-400">
            <p>{t('footer.copyright')}</p>
          </div>
        </div>
      </footer>

      {/* Market Detail Modal */}
      {selectedMarketId && (
        <MarketDetail
          marketId={selectedMarketId}
          onClose={() => setSelectedMarketId(null)}
        />
      )}
    </div>
  )
}