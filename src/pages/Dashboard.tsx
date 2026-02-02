import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, TrendingUp, Newspaper, BarChart3, Info } from 'lucide-react';
import { PriceCard } from '../components/PriceCard';
import { PriceChart } from '../components/PriceChart';
import { NewsCard } from '../components/NewsCard';
import { FactorCard } from '../components/FactorCard';
import { StatCard } from '../components/StatCard';
import { useAppStore } from '../store';
import { priceHistory, marketOverview, newsItems, marketFactors, getRealtimePrice } from '../services/mockData';
import { format } from 'date-fns';

export function Dashboard() {
  const navigate = useNavigate();
  const { selectedTimeRange, setTimeRange, lastUpdated, setLastUpdated } = useAppStore();
  const [currentPrice, setCurrentPrice] = useState(marketOverview.currentPrice);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPrice(getRealtimePrice());
      setLastUpdated(new Date().toISOString());
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setCurrentPrice(getRealtimePrice());
      setLastUpdated(new Date().toISOString());
      setIsRefreshing(false);
    }, 1000);
  };

  const bullishCount = marketFactors.filter(f => f.impact === 'bullish').length;
  const bearishCount = marketFactors.filter(f => f.impact === 'bearish').length;

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-title">
            <h1>Cocoa Tracker</h1>
            <span className="live-badge">LIVE</span>
          </div>
          <button className={`refresh-btn ${isRefreshing ? 'refreshing' : ''}`} onClick={handleRefresh}>
            <RefreshCw size={18} />
          </button>
        </div>
        <p className="last-updated">
          Updated {format(new Date(lastUpdated), 'HH:mm:ss')}
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
          <div className={`price-change-hero ${marketOverview.dayChange.direction}`}>
            <span>{marketOverview.dayChange.direction === 'up' ? '+' : ''}{marketOverview.dayChange.value}</span>
            <span>({marketOverview.dayChange.direction === 'up' ? '+' : ''}{marketOverview.dayChange.percentage}%)</span>
            <span className="change-period">today</span>
          </div>
        </div>
        <div className="price-range">
          <div className="range-item">
            <span className="range-label">Day Low</span>
            <span className="range-value">${marketOverview.dayLow.toLocaleString()}</span>
          </div>
          <div className="range-bar">
            <div
              className="range-indicator"
              style={{
                left: `${((currentPrice - marketOverview.dayLow) / (marketOverview.dayHigh - marketOverview.dayLow)) * 100}%`
              }}
            />
          </div>
          <div className="range-item">
            <span className="range-label">Day High</span>
            <span className="range-value">${marketOverview.dayHigh.toLocaleString()}</span>
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
        <p>Data for educational purposes only</p>
        <p>Not financial advice</p>
      </footer>
    </div>
  );
}
