import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { PriceChange } from '../types';

interface PriceCardProps {
  title: string;
  price: number;
  change: PriceChange;
  currency?: string;
  onClick?: () => void;
}

export function PriceCard({ title, price, change, currency = 'USD', onClick }: PriceCardProps) {
  const getChangeColor = () => {
    switch (change.direction) {
      case 'up': return 'var(--color-success)';
      case 'down': return 'var(--color-danger)';
      default: return 'var(--color-muted)';
    }
  };

  const TrendIcon = change.direction === 'up' ? TrendingUp : change.direction === 'down' ? TrendingDown : Minus;

  return (
    <div className="price-card" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <div className="price-card-header">
        <span className="price-card-title">{title}</span>
        <TrendIcon size={16} color={getChangeColor()} />
      </div>
      <div className="price-card-value">
        <span className="price-card-price">${price.toLocaleString()}</span>
        <span className="price-card-currency">{currency}/MT</span>
      </div>
      <div className="price-card-change" style={{ color: getChangeColor() }}>
        <span>{change.direction === 'up' ? '+' : ''}{change.value.toLocaleString()}</span>
        <span>({change.direction === 'up' ? '+' : ''}{change.percentage}%)</span>
      </div>
    </div>
  );
}
