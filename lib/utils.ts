import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

const CATEGORY_COLORS: Record<string, string> = {
  food: '#EF4444',
  transport: '#F97316',
  shopping: '#8B5CF6',
  utilities: '#3B82F6',
  health: '#EC4899',
  entertainment: '#F59E0B',
  education: '#10B981',
  religious: '#6366F1',
  transfer: '#6B7280',
  other: '#9CA3AF',
};

const CATEGORY_EMOJIS: Record<string, string> = {
  food: '🍔',
  transport: '🚗',
  shopping: '🛍️',
  utilities: '💡',
  health: '💊',
  entertainment: '🎮',
  education: '📚',
  religious: '🤲',
  transfer: '💸',
  other: '📦',
};

// Merge Tailwind class names safely
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format amount as Pakistani Rupees
export function formatPKR(amount: number) {
  return `Rs. ${amount.toLocaleString('en-PK')}`;
}

// Return emoji for a spending category
export function getCategoryEmoji(category: string) {
  return CATEGORY_EMOJIS[category] || '📦';
}

// Return hex color for a spending category
export function getCategoryColor(category: string) {
  return CATEGORY_COLORS[category] || '#9CA3AF';
}

// Format ISO date as readable string
export function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-PK', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

// Format large PKR amounts in Pakistani lakh/crore style for Urdu mode
export function formatPKRUrdu(amount: number) {
  if (amount >= 10000000) return `${(amount / 10000000).toFixed(1)} کروڑ`;
  if (amount >= 100000) return `${(amount / 100000).toFixed(1)} لاکھ`;
  return `Rs. ${amount.toLocaleString('en-PK')}`;
}

// Read preferred language from localStorage
export function getPreferredLanguage(): 'en' | 'ur' {
  if (typeof window === 'undefined') return 'en';
  return (localStorage.getItem('hisaab_lang') as 'en' | 'ur') || 'en';
}
