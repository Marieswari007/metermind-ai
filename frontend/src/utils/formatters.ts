export function formatCurrency(amount: number | string | undefined | null): string {
  if (amount === undefined || amount === null) return '$0.00';
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

export function formatNumber(num: number | string | undefined | null): string {
  if (num === undefined || num === null) return '0';
  const parsed = typeof num === 'string' ? parseInt(num, 10) : num;
  if (isNaN(parsed)) return '0';
  return new Intl.NumberFormat('en-US').format(parsed);
}

export function formatCompactNumber(num: number | undefined | null): string {
  if (num === undefined || num === null) return '0';
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 1,
  }).format(num);
}

export function formatDate(dateString?: string): string {
  if (!dateString) return 'Just now';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function truncateKey(key?: string, length = 12): string {
  if (!key) return '';
  if (key.length <= length) return key;
  return `${key.slice(0, 6)}...${key.slice(-4)}`;
}
