import type { NewsItem, MarketFactor } from '../types';
import { marketOverview, newsItems, marketFactors } from './mockData';

// This service simulates AI-powered chat responses
// In production, this would connect to an actual AI service

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const generateNewsResponse = async (news: NewsItem, question: string): Promise<string> => {
  await delay(800 + Math.random() * 1200);

  const lowercaseQ = question.toLowerCase();

  if (lowercaseQ.includes('price') || lowercaseQ.includes('impact')) {
    return `Based on this news about "${news.title}", the ${news.impact} impact on prices is driven by several factors:\n\n` +
      `1. **Supply Side**: ${news.category === 'supply' || news.category === 'weather' ? 'This directly affects cocoa production and availability.' : 'Indirect effects through market sentiment.'}\n\n` +
      `2. **Market Sentiment**: News of this nature typically causes traders to ${news.impact === 'positive' ? 'go long (buy)' : news.impact === 'negative' ? 'reduce positions or go short' : 'maintain current positions'}.\n\n` +
      `3. **Time Horizon**: The effects may be ${news.category === 'weather' ? 'medium-term (1-3 months)' : news.category === 'geopolitics' ? 'potentially long-lasting' : 'short to medium-term'}.\n\n` +
      `Current cocoa price is $${marketOverview.currentPrice}/MT, which is ${marketOverview.weekChange.direction === 'up' ? 'up' : 'down'} ${Math.abs(marketOverview.weekChange.percentage)}% this week.`;
  }

  if (lowercaseQ.includes('why') || lowercaseQ.includes('reason')) {
    return `The key reasons behind this development:\n\n` +
      `${news.content.split('.').slice(0, 3).join('.')}\n\n` +
      `**What this means for traders:**\n` +
      `- Short-term: ${news.impact === 'positive' ? 'Potential upward pressure on prices' : news.impact === 'negative' ? 'May see some price weakness' : 'Market likely to consolidate'}\n` +
      `- Risk factors to watch: ${news.category === 'weather' ? 'Weather forecasts' : news.category === 'geopolitics' ? 'Political developments' : 'Market data releases'}`;
  }

  if (lowercaseQ.includes('what') && lowercaseQ.includes('do')) {
    return `Based on this ${news.impact} news development:\n\n` +
      `**For traders:**\n` +
      `- Consider ${news.impact === 'positive' ? 'long positions with appropriate risk management' : news.impact === 'negative' ? 'reducing exposure or hedging' : 'waiting for clearer signals'}\n` +
      `- Watch for follow-up news in this space\n\n` +
      `**For industry participants:**\n` +
      `- ${news.category === 'supply' ? 'Review supply chain resilience' : news.category === 'demand' ? 'Assess demand forecasts' : 'Monitor developments closely'}\n\n` +
      `*Note: This is informational analysis, not financial advice.*`;
  }

  return `Here's my analysis of "${news.title}":\n\n` +
    `**Key Points:**\n` +
    `- Category: ${news.category.charAt(0).toUpperCase() + news.category.slice(1)} development\n` +
    `- Market Impact: ${news.impact.charAt(0).toUpperCase() + news.impact.slice(1)} for prices\n` +
    `- Source: ${news.source}\n\n` +
    `**Summary:**\n${news.summary}\n\n` +
    `**Market Context:**\n` +
    `Current cocoa prices are at $${marketOverview.currentPrice}/MT. The market has moved ${marketOverview.monthChange.direction === 'up' ? 'higher' : 'lower'} by ${Math.abs(marketOverview.monthChange.percentage)}% over the past month.\n\n` +
    `Feel free to ask more specific questions about price implications, trading strategies, or related factors.`;
};

const generateFactorResponse = async (factor: MarketFactor, question: string): Promise<string> => {
  await delay(800 + Math.random() * 1200);

  const lowercaseQ = question.toLowerCase();

  if (lowercaseQ.includes('price') || lowercaseQ.includes('impact')) {
    return `**${factor.name}** has a ${factor.impact} impact on cocoa prices:\n\n` +
      `**How it affects prices:**\n` +
      `${factor.description}\n\n` +
      `**Importance Level:** ${factor.importance.toUpperCase()}\n` +
      `This factor is considered ${factor.importance} importance because ${factor.importance === 'high' ? 'it directly affects supply/demand balance' : factor.importance === 'medium' ? 'it influences market sentiment significantly' : 'it has indirect or limited effects'}.\n\n` +
      `**Current Price Context:**\n` +
      `Cocoa is trading at $${marketOverview.currentPrice}/MT, with ${factor.impact === 'bullish' ? 'this factor supporting' : factor.impact === 'bearish' ? 'this factor weighing on' : 'mixed signals from this factor for'} prices.`;
  }

  if (lowercaseQ.includes('why') || lowercaseQ.includes('explain')) {
    const explanations: Record<string, string> = {
      weather: 'Weather directly impacts cocoa tree health and pod development. Cocoa trees require consistent rainfall and specific temperature ranges. Deviations from ideal conditions can significantly reduce yields.',
      supply: 'Supply factors determine how much cocoa is available in the market. Lower supply with steady demand leads to higher prices, while surplus supply can depress prices.',
      demand: 'Demand factors reflect consumption patterns. Strong demand from chocolate manufacturers and emerging markets supports prices, while weak demand can lead to inventory accumulation.',
      geopolitics: 'Political stability in producing countries is crucial for consistent exports. Unrest or policy changes can disrupt supply chains and affect market confidence.',
      currency: 'Cocoa is priced in USD. A stronger dollar makes cocoa more expensive for buyers using other currencies, potentially reducing demand.',
      speculation: 'Large traders and hedge funds can significantly influence short-term prices through their positioning. Net long positions suggest bullish sentiment.'
    };

    return `**Understanding ${factor.name}:**\n\n` +
      `${explanations[factor.category] || factor.description}\n\n` +
      `**Current Status:**\n${factor.description}\n\n` +
      `**Trading Implications:**\n` +
      `This ${factor.impact} factor suggests ${factor.impact === 'bullish' ? 'potential upward price movement' : factor.impact === 'bearish' ? 'possible downward pressure' : 'a neutral stance'} in the near term.`;
  }

  return `**${factor.name}** - ${factor.impact.toUpperCase()} Factor\n\n` +
    `**Category:** ${factor.category.charAt(0).toUpperCase() + factor.category.slice(1)}\n` +
    `**Importance:** ${factor.importance.charAt(0).toUpperCase() + factor.importance.slice(1)}\n\n` +
    `**Current Assessment:**\n${factor.description}\n\n` +
    `**Market Impact:**\n` +
    `This factor is currently ${factor.impact === 'bullish' ? 'supporting' : factor.impact === 'bearish' ? 'weighing on' : 'having mixed effects on'} cocoa prices.\n\n` +
    `Ask me about how this affects prices, why it matters, or related factors.`;
};

const generateOverviewResponse = async (question: string): Promise<string> => {
  await delay(800 + Math.random() * 1200);

  const lowercaseQ = question.toLowerCase();

  if (lowercaseQ.includes('trend') || lowercaseQ.includes('direction')) {
    const trend = marketOverview.monthChange.direction === 'up' ? 'uptrend' : marketOverview.monthChange.direction === 'down' ? 'downtrend' : 'sideways';
    return `**Current Trend Analysis:**\n\n` +
      `Cocoa is in a ${trend} over the past month.\n\n` +
      `**Performance:**\n` +
      `- Day: ${marketOverview.dayChange.direction === 'up' ? '+' : ''}${marketOverview.dayChange.percentage}%\n` +
      `- Week: ${marketOverview.weekChange.direction === 'up' ? '+' : ''}${marketOverview.weekChange.percentage}%\n` +
      `- Month: ${marketOverview.monthChange.direction === 'up' ? '+' : ''}${marketOverview.monthChange.percentage}%\n` +
      `- Year: ${marketOverview.yearChange.direction === 'up' ? '+' : ''}${marketOverview.yearChange.percentage}%\n\n` +
      `**Key Levels:**\n` +
      `- Year High: $${marketOverview.yearHigh}/MT\n` +
      `- Year Low: $${marketOverview.yearLow}/MT\n` +
      `- Current: $${marketOverview.currentPrice}/MT`;
  }

  if (lowercaseQ.includes('factor') || lowercaseQ.includes('driver')) {
    const bullishFactors = marketFactors.filter(f => f.impact === 'bullish').length;
    const bearishFactors = marketFactors.filter(f => f.impact === 'bearish').length;

    return `**Key Market Drivers:**\n\n` +
      `Currently tracking ${marketFactors.length} factors:\n` +
      `- ${bullishFactors} bullish (price supportive)\n` +
      `- ${bearishFactors} bearish (price negative)\n` +
      `- ${marketFactors.length - bullishFactors - bearishFactors} neutral\n\n` +
      `**Top Bullish Factors:**\n` +
      marketFactors.filter(f => f.impact === 'bullish' && f.importance === 'high').map(f => `- ${f.name}`).join('\n') +
      `\n\n**Top Bearish Factors:**\n` +
      marketFactors.filter(f => f.impact === 'bearish').map(f => `- ${f.name}`).join('\n');
  }

  return `**Cocoa Market Overview:**\n\n` +
    `**Current Price:** $${marketOverview.currentPrice}/MT\n` +
    `**Today's Range:** $${marketOverview.dayLow} - $${marketOverview.dayHigh}\n\n` +
    `**Recent Performance:**\n` +
    `- This week: ${marketOverview.weekChange.direction === 'up' ? '+' : ''}${marketOverview.weekChange.percentage}% ($${marketOverview.weekChange.value})\n` +
    `- This month: ${marketOverview.monthChange.direction === 'up' ? '+' : ''}${marketOverview.monthChange.percentage}% ($${marketOverview.monthChange.value})\n\n` +
    `**52-Week Range:** $${marketOverview.yearLow} - $${marketOverview.yearHigh}\n\n` +
    `**Latest News:**\n` +
    newsItems.slice(0, 2).map(n => `- ${n.title}`).join('\n') +
    `\n\nAsk me about trends, factors, or specific aspects of the market.`;
};

export const generateChatResponse = async (
  itemType: 'news' | 'factor' | 'overview',
  itemData: NewsItem | MarketFactor | null,
  question: string
): Promise<string> => {
  try {
    switch (itemType) {
      case 'news':
        return await generateNewsResponse(itemData as NewsItem, question);
      case 'factor':
        return await generateFactorResponse(itemData as MarketFactor, question);
      case 'overview':
        return await generateOverviewResponse(question);
      default:
        return 'I can help you understand cocoa market data. Please ask me about prices, trends, news, or market factors.';
    }
  } catch (error) {
    return 'I apologize, but I encountered an error processing your question. Please try again.';
  }
};
