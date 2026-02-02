import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Filter } from 'lucide-react';
import { useState } from 'react';
import { FactorCard } from '../components/FactorCard';
import { marketFactors } from '../services/mockData';
import type { MarketFactor } from '../types';

type FilterImpact = 'all' | MarketFactor['impact'];

export function FactorsList() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<FilterImpact>('all');

  const impacts: FilterImpact[] = ['all', 'bullish', 'bearish', 'neutral'];

  const filteredFactors = filter === 'all'
    ? marketFactors
    : marketFactors.filter(f => f.impact === filter);

  // Sort by importance
  const sortedFactors = [...filteredFactors].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.importance] - order[b.importance];
  });

  return (
    <div className="list-view">
      <header className="list-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <h1>Market Factors</h1>
      </header>

      <div className="filter-bar">
        <Filter size={16} />
        <div className="filter-chips">
          {impacts.map(impact => (
            <button
              key={impact}
              className={`filter-chip ${filter === impact ? 'active' : ''} ${impact !== 'all' ? impact : ''}`}
              onClick={() => setFilter(impact)}
            >
              {impact === 'all' ? 'All' : impact.charAt(0).toUpperCase() + impact.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="factors-summary-bar">
        <span className="bullish">
          {marketFactors.filter(f => f.impact === 'bullish').length} Bullish
        </span>
        <span className="bearish">
          {marketFactors.filter(f => f.impact === 'bearish').length} Bearish
        </span>
        <span className="neutral">
          {marketFactors.filter(f => f.impact === 'neutral').length} Neutral
        </span>
      </div>

      <div className="list-content">
        {sortedFactors.map(factor => (
          <FactorCard
            key={factor.id}
            factor={factor}
            onClick={() => navigate(`/detail/factor/${factor.id}`)}
          />
        ))}
      </div>

      {filteredFactors.length === 0 && (
        <div className="empty-state">
          <p>No factors found for this filter</p>
        </div>
      )}
    </div>
  );
}
