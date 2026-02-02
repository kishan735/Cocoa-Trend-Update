import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Filter } from 'lucide-react';
import { useState } from 'react';
import { NewsCard } from '../components/NewsCard';
import { newsItems } from '../services/mockData';
import type { NewsItem } from '../types';

type FilterCategory = 'all' | NewsItem['category'];

export function NewsList() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<FilterCategory>('all');

  const categories: FilterCategory[] = ['all', 'price', 'supply', 'demand', 'weather', 'geopolitics', 'market'];

  const filteredNews = filter === 'all'
    ? newsItems
    : newsItems.filter(n => n.category === filter);

  return (
    <div className="list-view">
      <header className="list-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <h1>All News</h1>
      </header>

      <div className="filter-bar">
        <Filter size={16} />
        <div className="filter-chips">
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-chip ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="list-content">
        {filteredNews.map(news => (
          <NewsCard
            key={news.id}
            news={news}
            onClick={() => navigate(`/detail/news/${news.id}`)}
          />
        ))}
      </div>

      {filteredNews.length === 0 && (
        <div className="empty-state">
          <p>No news found for this category</p>
        </div>
      )}
    </div>
  );
}
