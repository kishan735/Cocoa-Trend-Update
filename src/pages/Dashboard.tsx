import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, TrendingUp, Newspaper, BarChart3, Info, Wifi, WifiOff } from 'lucide-react';
import { PriceCard } from '../components/PriceCard';
import { PriceChart } from '../components/PriceChart';
import { NewsCard } from '../components/NewsCard';
import { FactorCard } from '../components/FactorCard';
import { StatCard } from '../components/StatCard';
import { useAppStore } from '../store';
import { priceHistory, marketOverview, newsItems, marketFactors } from '../services/mockData';
import { fetchCocoaPrice, getCachedPrice, shouldFetchNewPrice } from '../services/priceApi';
import { format } from 'date-fns';

// API key from environment variable
const API_KEY = import.meta.env.VITE_COMMODITIES_API_KEY;

export function Dashboard() {
  const navigate = useNavigate();
  const { selectedTimeRange, setTimeRange, lastUpdated, setLastUpdated } = useAppStore();
  const [currentPrice, setCurrentPrice] = useState(marketOverview.currentPrice);
  const [dayHigh, setDayHigh] = useState(marketOverview.dayHigh);
  const [dayLow, setDayLow] = useState(marketOverview.dayLow);
  const [dayChange, setDayChange] = useState(marketOverview.dayChange);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [dataSource, setDataSource] = useState<'live' | 'cached' | 'demo'>('demo');

  // Fetch live price from API
  const fetchLivePrice = useCallback(async (force: boolean = false) => {
    if (!API_KEY) {
      setDataSource('demo');
      setIsLive(false);
      return;
    }

    // Check cache first (unless forced refresh)
    if (!force) {
      const cached = getCachedPrice();
      if (cached && !shouldFetchNewPrice()) {
        setCurrentPrice(cached.price);
        setDayHigh(cached.dayHigh);
        setDayLow(cached.dayLow);
        setDayChange({
          value: cached.change,
          percentage: cached.changePercent,
          direction: cached.change > 0 ? 'up' : cached.change < 0 ? 'down' : 'neutral'
        });
        setLastUpdated(new Date(cached.timestamp).toISOString());
        setDataSource('cached');
        setIsLive(true);
        return;
      }
    }

    try {
      const data = await fetchCocoaPrice(API_KEY);
      if (data) {
        setCurrentPrice(data.price);
        setDayHigh(data.dayHigh);
        setDayLow(data.dayLow);
        setDayChange({
          value: data.change,
          percentage: data.changePercent,
          direction: data.change > 0 ? 'up' : data.change < 0 ? 'down' : 'neutral'
        });
        setLastUpdated(new Date(data.timestamp).toISOString());
        setDataSource('live');
        setIsLive(true);
      }
    } catch (error) {
      console.error('Failed to fetch live price:', error);
      // Fall back to cached or demo data
      const cached = getCachedPrice();
      if (cached) {
        setCurrentPrice(cached.price);
        setDataSource('cached');
        setIsLive(true);
      } else {
        setDataSource('demo');
        setIsLive(false);
      }
    }
  }, [setLastUpdated]);

  // Initial fetch and periodic updates
  useEffect(() => {
    // Fetch on mount
    fetchLivePrice();

    // Set up periodic fetching (every 90 minutes if API key exists)
    if (API_KEY) {
      const interval = setInterval(() => {
        if (shouldFetchNewPrice()) {
          fetchLivePrice();
        }
      }, 5 * 60 * 1000); // Check every 5 minutes

      return () => clearInterval(interval);
    }
  }, [fetchLivePrice]);

  const handleRefresh = async () => {
    setIsRefreshing(true);

    if (API_KEY && shouldFetchNewPrice()) {
      await fetchLivePrice(true);
    } else {
      // Just update the timestamp for demo mode
      setLastUpdated(new Date().toISOString());
    }

    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  const bullishCount = marketFactors.filter(f => f.impact === 'bullish').length;
  const bearishCount = marketFactors.filter(f => f.impact === 'bearish').length;

  // Calculate price position for range indicator
  const pricePosition = dayHigh !== dayLow
    ? ((currentPrice - dayLow) / (dayHigh - dayLow)) * 100
    : 50;

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-title">
            <h1>Cocoa Tracker</h1>
            <span className={`live-badge ${isLive ? '' : 'demo'}`}>
              {isLive ? (
                <><Wifi size={10} /> LIVE</>
              ) : (
                <><WifiOff size={10} /> DEMO</>
              )}
            </span>
          </div>
          <button className={`refresh-btn ${isRefreshing ? 'refreshing' : ''}`} onClick={handleRefresh}>
            <RefreshCw size={18} />
          </button>
        </div>
        <p className="last-updated">
          {dataSource === 'live' ? 'Live' : dataSource === 'cached' ? 'Cached' : 'Demo'} • Updated {format(new Date(lastUpdated), 'HH:mm:ss')}
        </p>
      </header>

      {/* Main Price Display */}
      <section className="price-hero" onClick={() => navigate('/detail/overview')}>
        <div className="price-main">
          <span className="price-label">Cocoa Futures</span>
          <div className="price-value-container">
            <span className="price-value">${currentPrice.toLocaleString()}</span>
            <span className="price-unit">USD/MT</span>
          </div>
          <div className={`price-change-hero ${dayChange.direction}`}>
            <span>{dayChange.direction === 'up' ? '+' : ''}{dayChange.value}</span>
            <span>({dayChange.direction === 'up' ? '+' : ''}{dayChange.percentage}%)</span>
            <span className="change-period">today</span>
          </div>
        </div>
        <div className="price-range">
          <div className="range-item">
            <span className="range-label">Day Low</span>
            <span className="range-value">${dayLow.toLocaleString()}</span>
          </div>
          <div className="range-bar">
            <div
              className="range-indicator"
              style={{ left: `${Math.min(100, Math.max(0, pricePosition))}%` }}
            />
          </div>
          <div className="range-item">
            <span className="range-label">Day High</span>
            <span className="range-value">${dayHigh.toLocaleString()}</span>
          </div>
        </div>
      </section>

      {/* Price Changes Grid */}
      <section className="price-changes-section">
        <div className="section-header">
          <TrendingUp size={18} />
          <h2>Price Performance</h2>
        </div>
        <div className="price-cards-grid">
          <PriceCard
            title="This Week"
            price={currentPrice}
            change={marketOverview.weekChange}
          />
          <PriceCard
            title="This Month"
            price={currentPrice}
            change={marketOverview.monthChange}
          />
          <PriceCard
            title="This Year"
            price={currentPrice}
            change={marketOverview.yearChange}
          />
        </div>
      </section>

      {/* Price Chart */}
      <section className="chart-section">
        <PriceChart
          data={priceHistory}
          timeRange={selectedTimeRange}
          onTimeRangeChange={setTimeRange}
        />
      </section>

      {/* Key Statistics */}
      <section className="stats-section">
        <div className="section-header">
          <Info size={18} />
          <h2>Key Statistics</h2>
        </div>
        <div className="stats-grid">
          <StatCard label="52-Week High" value={marketOverview.yearHigh} />
          <StatCard label="52-Week Low" value={marketOverview.yearLow} />
          <StatCard label="Week High" value={marketOverview.weekHigh} />
          <StatCard label="Week Low" value={marketOverview.weekLow} />
        </div>
      </section>

      {/* Market Factors Summary */}
      <section className="factors-summary">
        <div className="section-header">
          <BarChart3 size={18} />
          <h2>Market Sentiment</h2>
        </div>
        <div className="sentiment-bar-container">
          <div className="sentiment-labels">
            <span className="bullish-label">{bullishCount} Bullish</span>
            <span className="bearish-label">{bearishCount} Bearish</span>
          </div>
          <div className="sentiment-bar">
            <div
              className="sentiment-fill bullish"
              style={{ width: `${(bullishCount / marketFactors.length) * 100}%` }}
            />
          </div>
        </div>
      </section>

      {/* Market Factors */}
      <section className="factors-section">
        <div className="section-header">
          <BarChart3 size={18} />
          <h2>Market Factors</h2>
          <span className="section-count">{marketFactors.length}</span>
        </div>
        <div className="factors-list">
          {marketFactors.slice(0, 4).map(factor => (
            <FactorCard
              key={factor.id}
              factor={factor}
              onClick={() => navigate(`/detail/factor/${factor.id}`)}
            />
          ))}
        </div>
        {marketFactors.length > 4 && (
          <button className="see-all-btn" onClick={() => navigate('/factors')}>
            See all factors
          </button>
        )}
      </section>

      {/* Latest News */}
      <section className="news-section">
        <div className="section-header">
          <Newspaper size={18} />
          <h2>Latest News</h2>
          <span className="section-count">{newsItems.length}</span>
        </div>
        <div className="news-list">
          {newsItems.slice(0, 3).map(news => (
            <NewsCard
              key={news.id}
              news={news}
              onClick={() => navigate(`/detail/news/${news.id}`)}
            />
          ))}
        </div>
        {newsItems.length > 3 && (
          <button className="see-all-btn" onClick={() => navigate('/news')}>
            See all news
          </button>
        )}
      </section>

      {/* Footer */}
      <footer className="dashboard-footer">
        <p>{isLive ? 'Live data from Commodities-API' : 'Demo data for educational purposes'}</p>
        <p>Not financial advice</p>
      </footer>
    </div>
  );
}
