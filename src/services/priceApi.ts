// Commodities-API Integration
// Free tier: 100 requests/month
// Strategy: ~4 requests/day on trading days (every 1.5-2 hours during market hours)

const API_BASE = 'https://commodities-api.com/api';
const COCOA_SYMBOL = 'COCOA';

// Cache to minimize API calls
interface PriceCache {
  price: number;
  timestamp: number;
  dayHigh: number;
  dayLow: number;
  change: number;
  changePercent: number;
}

const CACHE_KEY = 'cocoa_price_cache';
const CACHE_DURATION = 90 * 60 * 1000; // 90 minutes in milliseconds

// Get cached price data
export const getCachedPrice = (): PriceCache | null => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const data: PriceCache = JSON.parse(cached);
    const now = Date.now();

    // Return cached data if still fresh
    if (now - data.timestamp < CACHE_DURATION) {
      return data;
    }
    return null;
  } catch {
    return null;
  }
};

// Save price to cache
const setCachedPrice = (data: PriceCache): void => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    // localStorage might be full or unavailable
  }
};

// Check if market is open (ICE Cocoa futures: ~4:45 AM - 1:30 PM ET, Mon-Fri)
const isMarketOpen = (): boolean => {
  const now = new Date();

  // Convert to ET (UTC-5 or UTC-4 during DST)
  // Using a simple approach - get hours in ET timezone
  const etTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
  const hour = etTime.getHours();
  const minute = etTime.getMinutes();
  const dayOfWeek = etTime.getDay();

  // Weekend check (0 = Sunday, 6 = Saturday)
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return false;
  }

  // Market hours: 4:45 AM - 1:30 PM ET
  const marketOpenMinutes = 4 * 60 + 45;  // 4:45 AM = 285 minutes
  const marketCloseMinutes = 13 * 60 + 30; // 1:30 PM = 810 minutes
  const currentMinutes = hour * 60 + minute;

  return currentMinutes >= marketOpenMinutes && currentMinutes <= marketCloseMinutes;
};

// Check if we should fetch new data
export const shouldFetchNewPrice = (): boolean => {
  const cached = getCachedPrice();

  // If no cache, fetch once (even if market is closed, to get latest available)
  if (!cached) return true;

  const now = Date.now();
  const timeSinceCache = now - cached.timestamp;

  // Don't fetch if cache is less than 90 minutes old
  if (timeSinceCache < CACHE_DURATION) {
    return false;
  }

  // Check if market is open
  if (isMarketOpen()) {
    // Market is open - allow fetching every 90 minutes
    return true;
  }

  // Market is closed - only fetch once per day to save API calls
  const cachedDate = new Date(cached.timestamp).toDateString();
  const todayDate = new Date().toDateString();

  // If we already fetched today, don't fetch again
  if (cachedDate === todayDate) {
    return false;
  }

  // New day but market closed - allow one fetch to get latest closing price
  return true;
};

// Fetch latest cocoa price from API
export const fetchCocoaPrice = async (apiKey: string): Promise<PriceCache | null> => {
  // Check cache first
  if (!shouldFetchNewPrice()) {
    return getCachedPrice();
  }

  try {
    const response = await fetch(
      `${API_BASE}/latest?access_key=${apiKey}&base=USD&symbols=${COCOA_SYMBOL}`
    );

    if (!response.ok) {
      console.error('API request failed:', response.status);
      return getCachedPrice(); // Fall back to cache
    }

    const data = await response.json();

    if (!data.success) {
      console.error('API error:', data.error);
      return getCachedPrice();
    }

    // Commodities-API returns rates as 1 USD = X units of commodity
    // We need to invert it to get price per metric ton
    const rate = data.rates?.[COCOA_SYMBOL];
    if (!rate) {
      console.error('No cocoa rate in response');
      return getCachedPrice();
    }

    // The API returns the rate as 1 USD = X MT of cocoa
    // So price per MT = 1 / rate
    const pricePerMT = Math.round(1 / rate);

    // Get previous cached data to calculate change
    const previousCache = getCachedPrice();
    const previousPrice = previousCache?.price || pricePerMT;
    const change = pricePerMT - previousPrice;
    const changePercent = previousPrice > 0
      ? Math.round((change / previousPrice) * 10000) / 100
      : 0;

    const newCache: PriceCache = {
      price: pricePerMT,
      timestamp: Date.now(),
      dayHigh: Math.max(pricePerMT, previousCache?.dayHigh || pricePerMT),
      dayLow: Math.min(pricePerMT, previousCache?.dayLow || pricePerMT),
      change,
      changePercent
    };

    setCachedPrice(newCache);
    return newCache;

  } catch (error) {
    console.error('Failed to fetch cocoa price:', error);
    return getCachedPrice();
  }
};

// Fetch historical data (uses more API calls - use sparingly)
export const fetchCocoaHistory = async (
  apiKey: string,
  days: number = 30
): Promise<Array<{ date: string; price: number }> | null> => {
  try {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    const response = await fetch(
      `${API_BASE}/timeseries?access_key=${apiKey}&base=USD&symbols=${COCOA_SYMBOL}&start_date=${startDate}&end_date=${endDate}`
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (!data.success || !data.rates) {
      return null;
    }

    // Convert rates object to array
    const history = Object.entries(data.rates).map(([date, rates]) => ({
      date,
      price: Math.round(1 / ((rates as Record<string, number>)[COCOA_SYMBOL] || 1))
    }));

    // Sort by date
    history.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return history;

  } catch (error) {
    console.error('Failed to fetch cocoa history:', error);
    return null;
  }
};

// Get time until next recommended fetch
export const getTimeUntilNextFetch = (): number => {
  const cached = getCachedPrice();
  if (!cached) return 0;

  const elapsed = Date.now() - cached.timestamp;
  const remaining = CACHE_DURATION - elapsed;

  return Math.max(0, remaining);
};

// Format the last updated time
export const formatLastUpdated = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;

  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} hr ago`;
  return new Date(timestamp).toLocaleDateString();
};
