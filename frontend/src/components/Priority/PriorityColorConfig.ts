export const PRIORITY_COLORS: Record<string, { bg: string; color: string; dot: string }> = {
  high: { bg: '#fef2f2', color: '#b91c1c', dot: '#ef4444' },
  medium: { bg: '#fffbeb', color: '#92400e', dot: '#f59e0b' },
  low: { bg: '#f0fdf4', color: '#166534', dot: '#22c55e' },
};

export const getPriorityColor = (name: string) =>
  PRIORITY_COLORS[name.toLowerCase()] ?? { bg: '#f3f4f6', color: '#374151', dot: '#9ca3af' };

export const PRIORITY_TAILWIND: Record<string, { bg: string; text: string; badge: string; dot: string }> = {
  high: { bg: 'bg-red-50', text: 'text-red-700', badge: 'bg-red-100 text-red-700', dot: 'bg-red-500' },
  medium: { bg: 'bg-amber-50', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
  low: { bg: 'bg-green-50', text: 'text-green-700', badge: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
};

export const getPriorityTailwind = (name: string) =>
  PRIORITY_TAILWIND[name.toLowerCase()] ?? { bg: 'bg-gray-50', text: 'text-gray-600', badge: 'bg-gray-100 text-gray-600', dot: 'bg-gray-400' };
