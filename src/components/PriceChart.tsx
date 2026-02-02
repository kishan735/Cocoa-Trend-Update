import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { format, parseISO, subDays, subMonths, subYears } from 'date-fns';
import type { PriceData, TimeRange } from '../types';

interface PriceChartProps {
  data: PriceData[];
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
}

const timeRanges: TimeRange[] = ['1D', '1W', '1M', '3M', '6M', '1Y', 'ALL'];

export function PriceChart({ data, timeRange, onTimeRangeChange }: PriceChartProps) {
  const filteredData = useMemo(() => {
    const now = new Date();
    let startDate: Date;

    switch (timeRange) {
      case '1D':
        startDate = subDays(now, 1);
        break;
      case '1W':
        startDate = subDays(now, 7);
        break;
      case '1M':
        startDate = subMonths(now, 1);
        break;
      case '3M':
        startDate = subMonths(now, 3);
        break;
      case '6M':
        startDate = subMonths(now, 6);
        break;
      case '1Y':
        startDate = subYears(now, 1);
        break;
      case 'ALL':
      default:
        return data;
    }

    return data.filter(d => parseISO(d.date) >= startDate);
  }, [data, timeRange]);

  const priceChange = useMemo(() => {
    if (filteredData.length < 2) return { positive: true, percentage: 0 };
    const first = filteredData[0].close;
    const last = filteredData[filteredData.length - 1].close;
    const change = ((last - first) / first) * 100;
    return { positive: change >= 0, percentage: Math.abs(change).toFixed(2) };
  }, [filteredData]);

  const chartColor = priceChange.positive ? '#10b981' : '#ef4444';
  const gradientId = `priceGradient-${timeRange}`;

  const formatXAxis = (dateStr: string) => {
    const date = parseISO(dateStr);
    switch (timeRange) {
      case '1D':
        return format(date, 'HH:mm');
      case '1W':
        return format(date, 'EEE');
      case '1M':
        return format(date, 'MMM d');
      case '3M':
      case '6M':
        return format(date, 'MMM d');
      case '1Y':
      case 'ALL':
        return format(date, 'MMM yyyy');
      default:
        return format(date, 'MMM d');
    }
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="chart-tooltip">
          <p className="tooltip-date">{format(parseISO(data.date), 'MMM d, yyyy')}</p>
          <p className="tooltip-price">${data.close.toLocaleString()}</p>
          <div className="tooltip-details">
            <span>O: ${data.open.toLocaleString()}</span>
            <span>H: ${data.high.toLocaleString()}</span>
            <span>L: ${data.low.toLocaleString()}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  const minPrice = Math.min(...filteredData.map(d => d.low)) * 0.99;
  const maxPrice = Math.max(...filteredData.map(d => d.high)) * 1.01;
  const avgPrice = filteredData.reduce((acc, d) => acc + d.close, 0) / filteredData.length;

  return (
    <div className="price-chart-container">
      <div className="chart-header">
        <div className="chart-title">
          <h3>Price Trend</h3>
          <span className={`chart-change ${priceChange.positive ? 'positive' : 'negative'}`}>
            {priceChange.positive ? '+' : '-'}{priceChange.percentage}%
          </span>
        </div>
        <div className="time-range-selector">
          {timeRanges.map(range => (
            <button
              key={range}
              className={`time-range-btn ${timeRange === range ? 'active' : ''}`}
              onClick={() => onTimeRangeChange(range)}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={filteredData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={chartColor} stopOpacity={0.3} />
                <stop offset="100%" stopColor={chartColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              tickFormatter={formatXAxis}
              tick={{ fill: '#6b7280', fontSize: 11 }}
              axisLine={{ stroke: '#374151' }}
              tickLine={{ stroke: '#374151' }}
              interval="preserveStartEnd"
              minTickGap={50}
            />
            <YAxis
              domain={[minPrice, maxPrice]}
              tick={{ fill: '#6b7280', fontSize: 11 }}
              axisLine={{ stroke: '#374151' }}
              tickLine={{ stroke: '#374151' }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
              width={55}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              y={avgPrice}
              stroke="#6b7280"
              strokeDasharray="3 3"
              strokeOpacity={0.5}
            />
            <Area
              type="monotone"
              dataKey="close"
              stroke={chartColor}
              strokeWidth={2}
              fill={`url(#${gradientId})`}
              animationDuration={500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-legend">
        <span>Dashed line: Period average (${avgPrice.toLocaleString()})</span>
      </div>
    </div>
  );
}
