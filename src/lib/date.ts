import { format, formatInTimeZone } from 'date-fns-tz';

const SINGAPORE_TZ = 'Asia/Singapore';

export function formatSGT(date: Date | string, formatStr: string = 'dd MMM yyyy, HH:mm'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return formatInTimeZone(dateObj, SINGAPORE_TZ, formatStr);
}

export function nowSGT(): string {
  return formatInTimeZone(new Date(), SINGAPORE_TZ, "yyyy-MM-dd'T'HH:mm:ssXXX");
}

export function formatDateOnly(date: Date | string): string {
  return formatSGT(date, 'dd MMMM yyyy');
}

export function formatTimeOnly(date: Date | string): string {
  return formatSGT(date, 'HH:mm');
}

export function formatDateTime(date: Date | string): string {
  return formatSGT(date, 'dd MMM yyyy, HH:mm');
}

export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return formatSGT(dateObj, 'dd MMM');
}
