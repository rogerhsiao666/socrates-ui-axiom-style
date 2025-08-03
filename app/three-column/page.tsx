'use client';

import { useState, useEffect, useCallback } from 'react';
import ThreeColumnMarketCard from '../../components/ThreeColumnMarketCard';
import { mockMarkets, Market } from '../../mock/markets';

export default function ThreeColumnPage() {
  const [column1Markets, setColumn1Markets] = useState<Market[]>([]);
  const [column2Markets, setColumn2Markets] = useState<Market[]>([]);
  const [column3Markets, setColumn3Markets] = useState<Market[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // 初始化数据 - 每列10个市场
  useEffect(() => {
    const initialMarkets = mockMarkets.slice(0, 30);
    setColumn1Markets(initialMarkets.filter((_, index) => index % 3 === 0));
    setColumn2Markets(initialMarkets.filter((_, index) => index % 3 === 1));
    setColumn3Markets(initialMarkets.filter((_, index) => index % 3 === 2));
    setCurrentIndex(30);
  }, []);

  // 加载更多数据
  const loadMoreMarkets = useCallback(() => {
    if (isLoading || currentIndex >= mockMarkets.length) return;
    
    setIsLoading(true);
    
    // 模拟网络延迟
    setTimeout(() => {
      const nextBatch = mockMarkets.slice(currentIndex, currentIndex + 9);
      
      if (nextBatch.length > 0) {
        const newColumn1 = nextBatch.filter((_, index) => index % 3 === 0);
        const newColumn2 = nextBatch.filter((_, index) => index % 3 === 1);
        const newColumn3 = nextBatch.filter((_, index) => index % 3 === 2);
        
        setColumn1Markets(prev => [...prev, ...newColumn1]);
        setColumn2Markets(prev => [...prev, ...newColumn2]);
        setColumn3Markets(prev => [...prev, ...newColumn3]);
        setCurrentIndex(prev => prev + 9);
      }
      
      setIsLoading(false);
    }, 800);
  }, [currentIndex, isLoading]);

  // 滚动监听 - 触底加载
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop 
          >= document.documentElement.offsetHeight - 1000) {
        loadMoreMarkets();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMoreMarkets]);

  return (
    <div className="min-h-screen bg-black text-white font-['Space_Grotesk']">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-black/90 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                Socrates Markets
              </h1>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live Markets</span>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              {column1Markets.length + column2Markets.length + column3Markets.length} Markets
            </div>
          </div>
        </div>
      </div>

      {/* Three Column Layout */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-3 gap-6">
          {/* Column 1 */}
          <div className="space-y-6">
            {column1Markets.map((market, index) => (
              <div 
                key={`col1-${market.id}`}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ThreeColumnMarketCard market={market} />
              </div>
            ))}
          </div>

          {/* Column 2 */}
          <div className="space-y-6">
            {column2Markets.map((market, index) => (
              <div 
                key={`col2-${market.id}`}
                className="animate-fade-in"
                style={{ animationDelay: `${(index * 100) + 50}ms` }}
              >
                <ThreeColumnMarketCard market={market} />
              </div>
            ))}
          </div>

          {/* Column 3 */}
          <div className="space-y-6">
            {column3Markets.map((market, index) => (
              <div 
                key={`col3-${market.id}`}
                className="animate-fade-in"
                style={{ animationDelay: `${(index * 100) + 100}ms` }}
              >
                <ThreeColumnMarketCard market={market} />
              </div>
            ))}
          </div>
        </div>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-400">Loading more markets...</span>
            </div>
          </div>
        )}

        {/* End of Data Indicator */}
        {currentIndex >= mockMarkets.length && !isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="text-4xl mb-4">🎯</div>
              <p className="text-gray-400">You've reached the end of all markets</p>
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="mt-4 px-6 py-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-200"
              >
                Back to Top
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}