import type { PriceData, MarketOverview, NewsItem, MarketFactor } from '../types';

// Generate realistic price data
const generatePriceHistory = (days: number): PriceData[] => {
  const data: PriceData[] = [];
  let basePrice = 8500; // Starting price in USD per metric ton
  const now = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    // Add some realistic volatility
    const volatility = (Math.random() - 0.5) * 300;
    const trend = Math.sin(i / 30) * 200; // Cyclical trend
    const noise = (Math.random() - 0.5) * 100;

    basePrice = Math.max(7000, Math.min(12000, basePrice + volatility * 0.1 + trend * 0.05 + noise));

    const open = basePrice + (Math.random() - 0.5) * 100;
    const close = basePrice;
    const high = Math.max(open, close) + Math.random() * 80;
    const low = Math.min(open, close) - Math.random() * 80;
    const volume = Math.floor(50000 + Math.random() * 30000);

    data.push({
      date: date.toISOString(),
      price: close,
      open: Math.round(open),
      high: Math.round(high),
      low: Math.round(low),
      close: Math.round(close),
      volume
    });
  }

  return data;
};

export const priceHistory = generatePriceHistory(365);

const latestPrice = priceHistory[priceHistory.length - 1];
const weekAgoPrice = priceHistory[priceHistory.length - 8] || priceHistory[0];
const monthAgoPrice = priceHistory[priceHistory.length - 31] || priceHistory[0];
const yearAgoPrice = priceHistory[0];

const calcChange = (current: number, previous: number) => {
  const value = current - previous;
  const percentage = ((value / previous) * 100);
  return {
    value: Math.round(value),
    percentage: Math.round(percentage * 100) / 100,
    direction: value > 0 ? 'up' : value < 0 ? 'down' : 'neutral'
  } as const;
};

export const marketOverview: MarketOverview = {
  currentPrice: latestPrice.close,
  currency: 'USD',
  lastUpdated: new Date().toISOString(),
  dayChange: calcChange(latestPrice.close, priceHistory[priceHistory.length - 2]?.close || latestPrice.close),
  weekChange: calcChange(latestPrice.close, weekAgoPrice.close),
  monthChange: calcChange(latestPrice.close, monthAgoPrice.close),
  yearChange: calcChange(latestPrice.close, yearAgoPrice.close),
  dayHigh: latestPrice.high,
  dayLow: latestPrice.low,
  weekHigh: Math.max(...priceHistory.slice(-7).map(p => p.high)),
  weekLow: Math.min(...priceHistory.slice(-7).map(p => p.low)),
  yearHigh: Math.max(...priceHistory.map(p => p.high)),
  yearLow: Math.min(...priceHistory.map(p => p.low))
};

export const newsItems: NewsItem[] = [
  {
    id: '1',
    title: 'Cocoa Prices Surge Amid West African Supply Concerns',
    summary: 'Persistent dry weather in Ivory Coast and Ghana raises concerns about next season\'s harvest, pushing prices higher.',
    content: `Cocoa futures have climbed to multi-year highs as adverse weather conditions continue to threaten production in West Africa, which accounts for approximately 70% of global cocoa supply.

The Ivory Coast, the world's largest cocoa producer, has experienced below-average rainfall during critical growing periods. Farmers report that cocoa trees are showing signs of stress, with some regions experiencing premature pod drop.

"The situation is concerning," said Jean-Marc Anga, former executive director of the International Cocoa Organization. "If these conditions persist, we could see a significant shortfall in the upcoming main crop season."

Ghana, the second-largest producer, is facing similar challenges. The Ghana Cocoa Board has revised its production forecast downward by 15%, citing both weather issues and aging tree stock.

Market analysts suggest that prices could remain elevated through the next harvest season as the supply deficit becomes more apparent. Major chocolate manufacturers are already adjusting their hedging strategies to account for higher raw material costs.

The current supply concerns come at a time when global demand for cocoa continues to grow, particularly in emerging markets across Asia. This demand-supply imbalance is expected to support prices in the medium term.`,
    source: 'Reuters Commodities',
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    category: 'supply',
    impact: 'positive',
    imageUrl: undefined
  },
  {
    id: '2',
    title: 'European Chocolate Demand Weakens on Economic Concerns',
    summary: 'Consumer spending on premium chocolate products declines as inflation pressures household budgets.',
    content: `European demand for chocolate products has softened in recent months as persistent inflation weighs on consumer purchasing power.

Data from Euromonitor International shows that premium chocolate sales in key European markets declined 8% year-over-year in the latest quarter. Value-conscious consumers are trading down to more affordable options or reducing overall chocolate consumption.

Major confectionery companies have reported volume declines despite price increases. Nestlé noted in its recent earnings call that its European confectionery division saw volumes drop 5%, though revenues remained stable due to price adjustments.

"Consumers are being more selective with their discretionary spending," said Sarah Williams, an analyst at Barclays. "Chocolate, particularly premium products, falls into that category of nice-to-have rather than must-have."

The demand weakness is providing some counterbalance to supply concerns, preventing prices from rising even further. However, analysts note that demand typically recovers as economic conditions stabilize, and the underlying supply deficit remains a concern.

Looking ahead to the holiday season, retailers are cautiously optimistic. "We expect a modest recovery in chocolate sales as consumers prioritize gifting occasions," said a spokesperson for a major European retailer.`,
    source: 'Financial Times',
    publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    category: 'demand',
    impact: 'negative',
    imageUrl: undefined
  },
  {
    id: '3',
    title: 'Ghana Announces New Cocoa Pricing Policy for Farmers',
    summary: 'Government increases farmgate prices by 20% to combat smuggling and encourage production.',
    content: `The Ghana Cocoa Board (COCOBOD) has announced a significant increase in the price paid to farmers for their cocoa beans, aiming to address chronic smuggling issues and incentivize production.

The new farmgate price of 1,308 Ghanaian cedis per 64-kilogram bag represents a 20% increase from the previous season. This makes Ghana's prices more competitive with neighboring countries, particularly Ivory Coast.

"This price adjustment reflects our commitment to supporting cocoa farmers and ensuring the sustainability of our industry," said Joseph Boahen Aidoo, CEO of COCOBOD.

The smuggling of Ghanaian cocoa to neighboring countries, where farmers could obtain better prices, has been a persistent problem. Estimates suggest that up to 100,000 tonnes of cocoa were smuggled out of Ghana in recent years.

The higher prices are expected to encourage farmers to sell through official channels and potentially increase planting and maintenance efforts. However, the increased costs will also put pressure on COCOBOD's finances, particularly if global prices decline.

Industry observers have welcomed the move. "This is a positive step for Ghanaian cocoa farmers," said a representative from the World Cocoa Foundation. "Fair prices are essential for the long-term sustainability of cocoa production."`,
    source: 'Bloomberg',
    publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    category: 'market',
    impact: 'neutral',
    imageUrl: undefined
  },
  {
    id: '4',
    title: 'El Niño Weather Pattern Threatens Cocoa Production',
    summary: 'Meteorologists predict strong El Niño conditions could disrupt cocoa growing regions through next year.',
    content: `Climate scientists are warning that a strengthening El Niño weather pattern could significantly impact cocoa production in key growing regions over the coming months.

The World Meteorological Organization has declared that El Niño conditions are now present in the Pacific Ocean and are expected to persist through the first quarter of next year. This climate phenomenon typically brings drier conditions to West Africa and wetter weather to parts of South America.

For cocoa production, the implications are concerning. West African cocoa regions, which have already experienced below-average rainfall, could see further moisture deficits. This would exacerbate existing stress on cocoa trees and potentially reduce yields.

"El Niño historically correlates with lower cocoa production in West Africa," explained Dr. Maria Santos, a climate scientist at the International Center for Tropical Agriculture. "The dry conditions can reduce flowering and pod development, leading to smaller harvests."

However, the picture is not entirely negative. Indonesia, the third-largest cocoa producer, sometimes benefits from El Niño conditions with more favorable weather patterns.

Traders are closely monitoring weather forecasts and adjusting positions accordingly. Options market activity suggests increased hedging activity as participants seek protection against potential supply disruptions.`,
    source: 'Associated Press',
    publishedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    category: 'weather',
    impact: 'positive',
    imageUrl: undefined
  },
  {
    id: '5',
    title: 'Political Tensions Rise in Ivory Coast Ahead of Elections',
    summary: 'Uncertainty over upcoming elections raises concerns about potential supply disruptions.',
    content: `Political tensions are rising in Ivory Coast as the country approaches national elections, raising concerns among commodity traders about potential disruptions to cocoa exports.

The Ivory Coast is the world's largest cocoa producer, accounting for approximately 45% of global supply. Any disruption to exports from the country would have significant implications for global cocoa markets.

Recent polling shows a tight race between incumbent and opposition candidates, with both sides making accusations of electoral irregularities. International observers have called for calm and a peaceful transition process.

"Political stability is crucial for the cocoa sector," said a trader at a major commodities house. "Any repeat of the 2010-2011 crisis would be catastrophic for supply chains."

During that previous crisis, cocoa exports were effectively halted for several months, sending prices to 30-year highs. While the current situation is not yet at that level, traders are building risk premiums into their positions.

The main harvest season is expected to begin in October, coinciding with the election period. Major exporters have reportedly increased inventories as a precautionary measure.

The European Union and United States have urged all parties to commit to a peaceful electoral process and respect for democratic institutions.`,
    source: 'Al Jazeera',
    publishedAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
    category: 'geopolitics',
    impact: 'positive',
    imageUrl: undefined
  },
  {
    id: '6',
    title: 'Major Chocolate Brands Commit to Sustainability Investments',
    summary: 'Industry leaders pledge $1 billion for sustainable cocoa farming initiatives.',
    content: `Leading chocolate manufacturers have announced a landmark $1 billion investment in sustainable cocoa farming initiatives, aimed at improving farmer livelihoods and ensuring long-term supply security.

The Cocoa & Forests Initiative, backed by companies including Mars, Nestlé, Hershey, and Mondelez, will fund programs focusing on farmer training, agroforestry, and traceability systems over the next five years.

"This investment represents our commitment to a sustainable cocoa future," said a joint statement from the participating companies. "By supporting farmers, we're securing both our supply chains and the environment."

Key programs include:
- Training for 500,000 farmers in good agricultural practices
- Distribution of 150 million shade trees to promote biodiversity
- Implementation of comprehensive traceability systems
- Development of farmer cooperatives and financial services

Environmental groups have cautiously welcomed the announcement while calling for more concrete accountability measures. "The commitment is significant, but implementation will be key," said a spokesperson for Rainforest Alliance.

The investment also aims to address child labor issues in cocoa farming, a persistent concern for the industry. Enhanced monitoring systems and community development programs are included in the initiative.

Market analysts view the investment positively for long-term supply stability, though short-term impacts on prices are expected to be limited.`,
    source: 'Wall Street Journal',
    publishedAt: new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString(),
    category: 'market',
    impact: 'neutral',
    imageUrl: undefined
  }
];

export const marketFactors: MarketFactor[] = [
  {
    id: '1',
    name: 'West African Weather',
    description: 'Dry conditions persist in Ivory Coast and Ghana, threatening main crop yields. Rainfall has been 20% below average in key growing regions.',
    impact: 'bullish',
    importance: 'high',
    category: 'weather',
    lastUpdated: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    name: 'Global Cocoa Stocks',
    description: 'Certified warehouse stocks at major exchanges are at 5-year lows, reducing buffer against supply disruptions.',
    impact: 'bullish',
    importance: 'high',
    category: 'supply',
    lastUpdated: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    name: 'European Demand',
    description: 'Consumer spending on chocolate products has softened due to inflation, reducing grinding demand by approximately 5%.',
    impact: 'bearish',
    importance: 'medium',
    category: 'demand',
    lastUpdated: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '4',
    name: 'USD Strength',
    description: 'Strong US dollar making cocoa more expensive for non-USD buyers, potentially dampening international demand.',
    impact: 'bearish',
    importance: 'medium',
    category: 'currency',
    lastUpdated: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '5',
    name: 'Speculative Positioning',
    description: 'Hedge funds and managed money have built significant net long positions, supporting current price levels.',
    impact: 'bullish',
    importance: 'medium',
    category: 'speculation',
    lastUpdated: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '6',
    name: 'Ivory Coast Elections',
    description: 'Upcoming elections creating uncertainty about export continuity. Markets pricing in risk premium.',
    impact: 'bullish',
    importance: 'high',
    category: 'geopolitics',
    lastUpdated: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '7',
    name: 'Asian Demand Growth',
    description: 'Emerging market demand, particularly in China and India, continues to grow at 8% annually, supporting long-term prices.',
    impact: 'bullish',
    importance: 'medium',
    category: 'demand',
    lastUpdated: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '8',
    name: 'Shipping Disruptions',
    description: 'Port congestion and container shortages causing delays in cocoa shipments from West Africa to major consuming regions.',
    impact: 'bullish',
    importance: 'low',
    category: 'supply',
    lastUpdated: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString()
  }
];

// Simulate real-time price updates
export const getRealtimePrice = (): number => {
  const lastPrice = marketOverview.currentPrice;
  const change = (Math.random() - 0.5) * 20;
  return Math.round(lastPrice + change);
};
