export interface PriceData {
  date: string;
  price: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface PriceChange {
  value: number;
  percentage: number;
  direction: 'up' | 'down' | 'neutral';
}

export interface MarketOverview {
  currentPrice: number;
  currency: string;
  lastUpdated: string;
  dayChange: PriceChange;
  weekChange: PriceChange;
  monthChange: PriceChange;
  yearChange: PriceChange;
  dayHigh: number;
  dayLow: number;
  weekHigh: number;
  weekLow: number;
  yearHigh: number;
  yearLow: number;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  source: string;
  publishedAt: string;
  category: 'price' | 'supply' | 'demand' | 'weather' | 'geopolitics' | 'market';
  impact: 'positive' | 'negative' | 'neutral';
  imageUrl?: string;
}

export interface MarketFactor {
  id: string;
  name: string;
  description: string;
  impact: 'bullish' | 'bearish' | 'neutral';
  importance: 'high' | 'medium' | 'low';
  category: 'supply' | 'demand' | 'weather' | 'geopolitics' | 'currency' | 'speculation';
  lastUpdated: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface DetailItem {
  type: 'news' | 'factor' | 'price' | 'overview';
  data: NewsItem | MarketFactor | PriceData | MarketOverview;
}

export type TimeRange = '1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | 'ALL';
