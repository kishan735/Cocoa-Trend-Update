import { formatDistanceToNow, parseISO } from 'date-fns';
import { TrendingUp, TrendingDown, Minus, ChevronRight, Cloud, Globe, DollarSign, BarChart3, Truck, Users } from 'lucide-react';
import type { MarketFactor } from '../types';

interface FactorCardProps {
  factor: MarketFactor;
  onClick: () => void;
}

const categoryIcons = {
  supply: Truck,
  demand: Users,
  weather: Cloud,
  geopolitics: Globe,
  currency: DollarSign,
  speculation: BarChart3
};

export function FactorCard({ factor, onClick }: FactorCardProps) {
  const CategoryIcon = categoryIcons[factor.category] || BarChart3;

  const getImpactColor = () => {
    switch (factor.impact) {
      case 'bullish': return 'var(--color-success)';
      case 'bearish': return 'var(--color-danger)';
      default: return 'var(--color-muted)';
    }
  };

  const getImportanceClass = () => {
    switch (factor.importance) {
      case 'high': return 'importance-high';
      case 'medium': return 'importance-medium';
      default: return 'importance-low';
    }
  };

  const ImpactIcon = factor.impact === 'bullish' ? TrendingUp : factor.impact === 'bearish' ? TrendingDown : Minus;

  return (
    <div className="factor-card" onClick={onClick}>
      <div className="factor-header">
        <div className="factor-category">
          <CategoryIcon size={14} />
          <span>{factor.category}</span>
        </div>
        <span className={`factor-importance ${getImportanceClass()}`}>
          {factor.importance}
        </span>
      </div>

      <div className="factor-content">
        <div className="factor-title-row">
          <h4 className="factor-name">{factor.name}</h4>
          <div className="factor-impact" style={{ color: getImpactColor() }}>
            <ImpactIcon size={16} />
            <span>{factor.impact}</span>
          </div>
        </div>
        <p className="factor-description">{factor.description}</p>
      </div>

      <div className="factor-footer">
        <span className="factor-updated">
          Updated {formatDistanceToNow(parseISO(factor.lastUpdated), { addSuffix: true })}
        </span>
        <ChevronRight size={18} className="factor-arrow" />
      </div>
    </div>
  );
}
