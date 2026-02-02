interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  highlight?: boolean;
}

export function StatCard({ label, value, subValue, highlight }: StatCardProps) {
  return (
    <div className={`stat-card ${highlight ? 'highlight' : ''}`}>
      <span className="stat-label">{label}</span>
      <span className="stat-value">{typeof value === 'number' ? `$${value.toLocaleString()}` : value}</span>
      {subValue && <span className="stat-subvalue">{subValue}</span>}
    </div>
  );
}
