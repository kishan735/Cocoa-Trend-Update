import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, TrendingDown, Minus, Clock, Tag, AlertCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ChatInterface } from '../components/ChatInterface';
import { newsItems, marketFactors, marketOverview } from '../services/mockData';
import type { NewsItem, MarketFactor } from '../types';

export function DetailView() {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();

  const getContent = () => {
    switch (type) {
      case 'news': {
        const news = newsItems.find(n => n.id === id);
        if (!news) return null;
        return { type: 'news' as const, data: news };
      }
      case 'factor': {
        const factor = marketFactors.find(f => f.id === id);
        if (!factor) return null;
        return { type: 'factor' as const, data: factor };
      }
      case 'overview':
        return { type: 'overview' as const, data: marketOverview };
      default:
        return null;
    }
  };

  const content = getContent();

  if (!content) {
    return (
      <div className="detail-view">
        <header className="detail-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
          </button>
          <h1>Not Found</h1>
        </header>
        <div className="detail-content">
          <p>The requested content was not found.</p>
        </div>
      </div>
    );
  }

  const renderNewsDetail = (news: NewsItem) => {
    const ImpactIcon = news.impact === 'positive' ? TrendingUp : news.impact === 'negative' ? TrendingDown : Minus;
    const impactColor = news.impact === 'positive' ? 'var(--color-success)' : news.impact === 'negative' ? 'var(--color-danger)' : 'var(--color-muted)';

    return (
      <>
        <div className="detail-meta">
          <div className="meta-item">
            <Tag size={14} />
            <span className="category-badge">{news.category}</span>
          </div>
          <div className="meta-item" style={{ color: impactColor }}>
            <ImpactIcon size={14} />
            <span>{news.impact} for prices</span>
          </div>
          <div className="meta-item">
            <Clock size={14} />
            <span>{format(parseISO(news.publishedAt), 'MMM d, yyyy HH:mm')}</span>
          </div>
        </div>

        <h1 className="detail-title">{news.title}</h1>
        <p className="detail-source">Source: {news.source}</p>

        <div className="detail-body">
          {news.content.split('\n\n').map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </>
    );
  };

  const renderFactorDetail = (factor: MarketFactor) => {
    const ImpactIcon = factor.impact === 'bullish' ? TrendingUp : factor.impact === 'bearish' ? TrendingDown : Minus;
    const impactColor = factor.impact === 'bullish' ? 'var(--color-success)' : factor.impact === 'bearish' ? 'var(--color-danger)' : 'var(--color-muted)';

    return (
      <>
        <div className="detail-meta">
          <div className="meta-item">
            <Tag size={14} />
            <span className="category-badge">{factor.category}</span>
          </div>
          <div className="meta-item" style={{ color: impactColor }}>
            <ImpactIcon size={14} />
            <span>{factor.impact}</span>
          </div>
          <div className="meta-item">
            <AlertCircle size={14} />
            <span className={`importance-badge ${factor.importance}`}>{factor.importance} importance</span>
          </div>
        </div>

        <h1 className="detail-title">{factor.name}</h1>

        <div className="factor-impact-card" style={{ borderColor: impactColor }}>
          <ImpactIcon size={24} color={impactColor} />
          <div>
            <span className="impact-label">Market Impact</span>
            <span className="impact-value" style={{ color: impactColor }}>
              {factor.impact === 'bullish' ? 'Price Supportive' : factor.impact === 'bearish' ? 'Price Negative' : 'Neutral'}
            </span>
          </div>
        </div>

        <div className="detail-body">
          <p>{factor.description}</p>
        </div>

        <div className="factor-updated">
          <Clock size={14} />
          <span>Last updated: {format(parseISO(factor.lastUpdated), 'MMM d, yyyy HH:mm')}</span>
        </div>
      </>
    );
  };

  const renderOverviewDetail = () => {
    return (
      <>
        <h1 className="detail-title">Cocoa Market Overview</h1>

        <div className="overview-price-card">
          <span className="overview-label">Current Price</span>
          <span className="overview-price">${marketOverview.currentPrice.toLocaleString()}</span>
          <span className="overview-unit">USD per Metric Ton</span>
        </div>

        <div className="overview-stats">
          <div className="overview-stat">
            <span className="stat-label">Today</span>
            <span className={`stat-value ${marketOverview.dayChange.direction}`}>
              {marketOverview.dayChange.direction === 'up' ? '+' : ''}{marketOverview.dayChange.percentage}%
            </span>
          </div>
          <div className="overview-stat">
            <span className="stat-label">Week</span>
            <span className={`stat-value ${marketOverview.weekChange.direction}`}>
              {marketOverview.weekChange.direction === 'up' ? '+' : ''}{marketOverview.weekChange.percentage}%
            </span>
          </div>
          <div className="overview-stat">
            <span className="stat-label">Month</span>
            <span className={`stat-value ${marketOverview.monthChange.direction}`}>
              {marketOverview.monthChange.direction === 'up' ? '+' : ''}{marketOverview.monthChange.percentage}%
            </span>
          </div>
          <div className="overview-stat">
            <span className="stat-label">Year</span>
            <span className={`stat-value ${marketOverview.yearChange.direction}`}>
              {marketOverview.yearChange.direction === 'up' ? '+' : ''}{marketOverview.yearChange.percentage}%
            </span>
          </div>
        </div>

        <div className="overview-ranges">
          <div className="range-card">
            <span className="range-title">52-Week Range</span>
            <div className="range-values">
              <span>${marketOverview.yearLow.toLocaleString()}</span>
              <span>-</span>
              <span>${marketOverview.yearHigh.toLocaleString()}</span>
            </div>
          </div>
          <div className="range-card">
            <span className="range-title">Today's Range</span>
            <div className="range-values">
              <span>${marketOverview.dayLow.toLocaleString()}</span>
              <span>-</span>
              <span>${marketOverview.dayHigh.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </>
    );
  };

  const getInitialContext = () => {
    switch (content.type) {
      case 'news':
        return `I can help you understand this news article: "${(content.data as NewsItem).title}"\n\nThis is a ${(content.data as NewsItem).category} development with a ${(content.data as NewsItem).impact} impact on cocoa prices.\n\nFeel free to ask me about:\n- How this affects prices\n- What traders should consider\n- Related market factors`;
      case 'factor':
        return `I can explain this market factor: "${(content.data as MarketFactor).name}"\n\nThis is a ${(content.data as MarketFactor).importance} importance ${(content.data as MarketFactor).impact} factor in the ${(content.data as MarketFactor).category} category.\n\nAsk me about:\n- Price impact\n- Why this matters\n- Related developments`;
      case 'overview':
        return `I can help you understand the cocoa market.\n\nCurrent price: $${marketOverview.currentPrice.toLocaleString()}/MT\nToday: ${marketOverview.dayChange.direction === 'up' ? '+' : ''}${marketOverview.dayChange.percentage}%\n\nAsk me about:\n- Current trends\n- Key factors to watch\n- Market outlook`;
      default:
        return 'How can I help you understand this information?';
    }
  };

  const itemId = type === 'overview' ? 'overview' : id || '';
  const itemData = content.type === 'news' ? content.data as NewsItem :
    content.type === 'factor' ? content.data as MarketFactor : null;

  return (
    <div className="detail-view">
      <header className="detail-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <span className="header-type">
          {type === 'news' ? 'News' : type === 'factor' ? 'Market Factor' : 'Overview'}
        </span>
      </header>

      <div className="detail-content">
        {content.type === 'news' && renderNewsDetail(content.data as NewsItem)}
        {content.type === 'factor' && renderFactorDetail(content.data as MarketFactor)}
        {content.type === 'overview' && renderOverviewDetail()}
      </div>

      <div className="chat-section">
        <h3 className="chat-title">Ask Questions</h3>
        <ChatInterface
          itemId={itemId}
          itemType={content.type}
          itemData={itemData}
          initialContext={getInitialContext()}
        />
      </div>
    </div>
  );
}
