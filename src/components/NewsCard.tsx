import { formatDistanceToNow, parseISO } from 'date-fns';
import { TrendingUp, TrendingDown, Minus, ChevronRight, Cloud, Globe, DollarSign, Users, Newspaper } from 'lucide-react';
import type { NewsItem } from '../types';

interface NewsCardProps {
  news: NewsItem;
  onClick: () => void;
}

const categoryIcons = {
  price: DollarSign,
  supply: Newspaper,
  demand: Users,
  weather: Cloud,
  geopolitics: Globe,
  market: TrendingUp
};

export function NewsCard({ news, onClick }: NewsCardProps) {
  const CategoryIcon = categoryIcons[news.category] || Newspaper;

  const getImpactColor = () => {
    switch (news.impact) {
      case 'positive': return 'var(--color-success)';
      case 'negative': return 'var(--color-danger)';
      default: return 'var(--color-muted)';
    }
  };

  const ImpactIcon = news.impact === 'positive' ? TrendingUp : news.impact === 'negative' ? TrendingDown : Minus;

  return (
    <div className="news-card" onClick={onClick}>
      <div className="news-card-header">
        <div className="news-category">
          <CategoryIcon size={14} />
          <span>{news.category}</span>
        </div>
        <div className="news-impact" style={{ color: getImpactColor() }}>
          <ImpactIcon size={14} />
          <span>{news.impact}</span>
        </div>
      </div>

      <h4 className="news-title">{news.title}</h4>
      <p className="news-summary">{news.summary}</p>

      <div className="news-footer">
        <div className="news-meta">
          <span className="news-source">{news.source}</span>
          <span className="news-time">{formatDistanceToNow(parseISO(news.publishedAt), { addSuffix: true })}</span>
        </div>
        <ChevronRight size={18} className="news-arrow" />
      </div>
    </div>
  );
}
