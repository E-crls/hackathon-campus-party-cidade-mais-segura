export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

export function formatPercentage(num: number): string {
  const sign = num > 0 ? '+' : '';
  return `${sign}${num}%`;
}

export function getPriorityColor(priority: 'high' | 'medium' | 'low'): string {
  const colors = {
    high: 'text-red-500',
    medium: 'text-brand-500',
    low: 'text-green-500',
  };
  return colors[priority];
}

export function getOccurrenceTitle(type: string): string {
  const titles = {
    lighting: 'Iluminação Precária',
    waste: 'Lixo Acumulado',
    construction: 'Construções Irregulares',
    degraded: 'Áreas Degradadas',
  };
  return titles[type as keyof typeof titles] || type;
}

export function getRegionStatus(occurrences: number): 'critical' | 'warning' | 'normal' {
  if (occurrences > 40) return 'critical';
  if (occurrences > 25) return 'warning';
  return 'normal';
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
} 