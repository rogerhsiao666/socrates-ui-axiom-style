'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

type Language = 'en' | 'zh'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  en: {
    // Navbar
    'nav.createMarket': 'Create Market',
    'nav.myMarkets': 'My Markets',
    'nav.connectWallet': 'Connect Wallet',
    'nav.wallet.connected': 'Connected',
    'nav.wallet.address': 'Address',
    'nav.wallet.disconnect': 'Disconnect',
    'nav.wallet.connecting': 'Connecting...',
    
    // Hero Section
    'hero.title': 'Trade on the Future with',
    'hero.subtitle': 'Decentralized prediction markets where you can bet on real-world events and earn rewards for accurate predictions.',
    
    // Stats
    'stats.totalVolume': 'Total Volume',
    'stats.activeMarkets': 'Active Markets',
    'stats.traders': 'Traders',
    
    // Navigation
    'nav.markets': 'Markets',
    'nav.live': 'Live Stream',
    'nav.video': 'Video',
    'nav.audio': 'Audio',
    
    // Categories
    'category.all': 'All',
    'category.news': 'News',
    'category.tech': 'Tech',
    'category.politics': 'Politics',
    'category.sports': 'Sports',
    'category.crypto': 'Crypto',
    
    // Market Card
    'market.buyYes': 'Buy YES',
    'market.buyNo': 'Buy NO',
    'market.buy': 'Buy',
    'market.ends': 'Ends',
    'market.volume': 'Volume',
    'market.trading': 'Trading',
    'market.endingSoon': 'Ending Soon',
    'market.ended': 'Ended',
    'market.yesProb': 'YES Probability',
    'market.currentPrice': 'Current Price',
    'market.traders': 'Traders',
    'market.liquidity': 'Liquidity',
    'market.timeRemaining': 'Time Remaining',
    'market.connectWallet': 'Connect wallet to trade',
    'market.createdBy': 'Created by',
    
    // Buttons
    'button.loadMore': 'Load More Markets',
    'button.confirm': 'Confirm',
    'button.cancel': 'Cancel',
    'button.hot': 'Hot',
    
    // Search
    'search.placeholder': 'Search markets...',
    'search.noResults': 'No prediction markets found',
    'search.clearFilters': 'Clear filters',
    
    // Modal
    'modal.prediction.title': 'Make Prediction',
    'modal.prediction.amount': 'Amount',
    'modal.prediction.enterAmount': 'Enter amount',
    'modal.prediction.balance': 'Balance',
    'modal.prediction.fee': 'Transaction Fee',
    'modal.prediction.total': 'Total',
    
    // Theme
    'theme.light': 'Light Mode',
    'theme.dark': 'Dark Mode',
    'theme.toggle': 'Toggle Theme',
    
    // Footer
    'footer.description': 'The future of decentralized prediction markets.',
    'footer.markets': 'Markets',
    'footer.support': 'Support',
    'footer.community': 'Community',
    'footer.helpCenter': 'Help Center',
    'footer.documentation': 'Documentation',
    'footer.api': 'API',
    'footer.contact': 'Contact',
    'footer.copyright': '© 2024 PredictMarket. All rights reserved.',
    
    // Main Tabs
    'tab.markets': 'Markets',
    'tab.following': 'Following',
    'tab.live': 'Live',
    
    // Market Sections
    'section.newCreated': '🆕 Latest Created Topics',
    'section.aboutToLaunch': '🚀 About to Launch Topics',
    'section.launched': '✅ Launched Topics',
    'section.updateEvery10s': 'Updates every 10s',
    'section.updateEvery15s': 'Updates every 15s',
    'section.keepOriginal': 'Keep original features',
    
    // Following Section
    'following.smartWallets': '🧠 Smart Wallet Leaderboard',
    'following.myHistory': '📊 My Copy Trading History',
    'following.wallet': 'Wallet',
    'following.1dPnl': '1D P&L',
    'following.7dPnl': '7D P&L',
    'following.30dPnl': '30D P&L',
    'following.7dWinRate': '7D Win Rate',
    'following.7dTrades': '7D Trades',
    'following.followers': 'Followers',
    'following.balance': 'Wallet Balance',
    'following.actions': 'Actions',
    'following.follow': 'Follow',
    'following.unfollow': 'Unfollow',
    'following.copy': 'Copy',
    'following.online': 'Online',
    'following.offline': 'Offline',
    
    // Live Section
    'live.hotStreams': '🔥 Hot Live Streams',
    'live.realTimeChat': '💬 Real-time Chat',
    'live.viewers': 'viewers',
    'live.watching': 'Watching',
    'live.chatPlaceholder': 'Type your message...',
    'live.send': 'Send'
  },
  zh: {
    // Navbar
    'nav.createMarket': '创建市场',
    'nav.myMarkets': '我的市场',
    'nav.connectWallet': '连接钱包',
    'nav.wallet.connected': '已连接',
    'nav.wallet.address': '地址',
    'nav.wallet.disconnect': '断开连接',
    'nav.wallet.connecting': '连接中...',
    
    // Hero Section
    'hero.title': '用 PredictMarket 交易未来',
    'hero.subtitle': '去中心化预测市场，您可以对现实世界事件下注并因准确预测获得奖励。',
    
    // Stats
    'stats.totalVolume': '总交易量',
    'stats.activeMarkets': '活跃市场',
    'stats.traders': '交易者',
    
    // Navigation
    'nav.markets': '市场',
    'nav.live': '直播',
    'nav.video': '视频',
    'nav.audio': '音频',
    
    // Categories
    'category.all': '全部',
    'category.news': '新闻',
    'category.tech': '科技',
    'category.politics': '政治',
    'category.sports': '体育',
    'category.crypto': '加密货币',
    
    // Market Card
    'market.buyYes': '买入 YES',
    'market.buyNo': '买入 NO',
    'market.buy': '买入',
    'market.ends': '结束时间',
    'market.volume': '交易量',
    'market.trading': '交易中',
    'market.endingSoon': '即将结束',
    'market.ended': '已结束',
    'market.yesProb': 'YES 概率',
    'market.currentPrice': '当前价格',
    'market.traders': '交易者',
    'market.liquidity': '流动性',
    'market.timeRemaining': '剩余时间',
    'market.connectWallet': '连接钱包以交易',
    'market.createdBy': '创建者',
    
    // Buttons
    'button.loadMore': '加载更多市场',
    'button.confirm': '确认',
    'button.cancel': '取消',
    'button.hot': '热门',
    
    // Search
    'search.placeholder': '搜索市场...',
    'search.noResults': '未找到预测市场',
    'search.clearFilters': '清除过滤器',
    
    // Modal
    'modal.prediction.title': '进行预测',
    'modal.prediction.amount': '金额',
    'modal.prediction.enterAmount': '输入金额',
    'modal.prediction.balance': '余额',
    'modal.prediction.fee': '交易费用',
    'modal.prediction.total': '总计',
    
    // Theme
    'theme.light': '浅色模式',
    'theme.dark': '深色模式',
    'theme.toggle': '切换主题',
    
    // Footer
    'footer.description': '去中心化预测市场的未来。',
    'footer.markets': '市场',
    'footer.support': '支持',
    'footer.community': '社区',
    'footer.helpCenter': '帮助中心',
    'footer.documentation': '文档',
    'footer.api': 'API',
    'footer.contact': '联系我们',
    'footer.copyright': '© 2024 PredictMarket. 保留所有权利。',
    
    // Main Tabs
    'tab.markets': '市场',
    'tab.following': '跟单',
    'tab.live': '直播',
    
    // Market Sections
    'section.newCreated': '🆕 最新创建话题',
    'section.aboutToLaunch': '🚀 即将发射话题',
    'section.launched': '已发射话题',
    'section.updateEvery10s': '每10秒更新',
    'section.updateEvery15s': '每15秒更新',
    'section.keepOriginal': '保持原有功能',
    
    // Following Section
    'following.smartWallets': '🧠 聪明钱包排行榜',
    'following.myHistory': '📊 我的跟单历史',
    'following.wallet': '钱包',
    'following.1dPnl': '1D盈亏',
    'following.7dPnl': '7D盈亏',
    'following.30dPnl': '30D盈亏',
    'following.7dWinRate': '7D胜率',
    'following.7dTrades': '7D交易数',
    'following.followers': '跟单人数',
    'following.balance': '钱包余额',
    'following.actions': '操作',
    'following.follow': '跟单',
    'following.unfollow': '取消跟单',
    'following.copy': '复制',
    'following.online': '在线',
    'following.offline': '离线',
    
    // Live Section
    'live.hotStreams': '🔥 热门直播',
    'live.realTimeChat': '💬 实时聊天',
    'live.viewers': '观看者',
    'live.watching': '正在观看',
    'live.chatPlaceholder': '输入您的消息...',
    'live.send': '发送'
  }
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('zh')

  // Load saved language from localStorage on mount
  React.useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'zh')) {
      setLanguage(savedLanguage)
    }
  }, [])

  // Save language to localStorage when it changes
  React.useEffect(() => {
    localStorage.setItem('language', language)
  }, [language])

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}