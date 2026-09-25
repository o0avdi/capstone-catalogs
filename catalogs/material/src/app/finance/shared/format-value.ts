import { ValueFormat } from '../finance.types';

export function formatValue(
  value: number | string,
  format: ValueFormat = 'number',
  currency = 'USD',
  locale = 'en-US',
): string {
  if (typeof value === 'string') return value;
  if (!Number.isFinite(value)) return '—';
  return new Intl.NumberFormat(locale, {
    style: format === 'currency' ? 'currency' : format === 'percent' ? 'percent' : 'decimal',
    currency,
    notation: format === 'compact' ? 'compact' : 'standard',
    maximumFractionDigits:
      format === 'percent' || format === 'compact' ? 1 : format === 'currency' ? 2 : 0,
    minimumFractionDigits: 0,
  }).format(value);
}
