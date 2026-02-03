// =====================================================
// UTILITY FUNCTIONS
// Helper functions for formatting and data manipulation
// =====================================================

// =====================================================
// CURRENCY FORMATTING
// =====================================================

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCurrencyCompact(amount: number): string {
  if (amount >= 1000000000) {
    return `Rp ${(amount / 1000000000).toFixed(1)}M`;
  } else if (amount >= 1000000) {
    return `Rp ${(amount / 1000000).toFixed(1)}jt`;
  } else if (amount >= 1000) {
    return `Rp ${(amount / 1000).toFixed(1)}rb`;
  }
  return formatCurrency(amount);
}

// =====================================================
// DATE FORMATTING
// =====================================================

export function formatDate(dateString: string, format: 'short' | 'long' = 'short'): string {
  const date = new Date(dateString);
  
  if (format === 'short') {
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }
  
  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  
  return date.toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getMonthName(monthNumber: number): string {
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  return months[monthNumber - 1] || '';
}

export function getMonthNameShort(monthNumber: number): string {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
    'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'
  ];
  return months[monthNumber - 1] || '';
}

// =====================================================
// SLUG GENERATION
// =====================================================

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
}

// =====================================================
// PERCENTAGE CALCULATION
// =====================================================

export function calculatePercentage(part: number, whole: number): number {
  if (whole === 0) return 0;
  return Math.round((part / whole) * 100);
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(0)}%`;
}

// =====================================================
// NUMBER FORMATTING
// =====================================================

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('id-ID').format(value);
}

// =====================================================
// VALIDATION
// =====================================================

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPhoneNumber(phone: string): boolean {
  // Indonesian phone number format
  const phoneRegex = /^(\+62|62|0)[0-9]{9,12}$/;
  return phoneRegex.test(phone.replace(/\s|-/g, ''));
}

export function formatPhoneNumber(phone: string): string {
  // Format to +62 format
  const cleaned = phone.replace(/\s|-/g, '');
  
  if (cleaned.startsWith('0')) {
    return `+62${cleaned.substring(1)}`;
  } else if (cleaned.startsWith('62')) {
    return `+${cleaned}`;
  } else if (cleaned.startsWith('+62')) {
    return cleaned;
  }
  
  return phone;
}

// =====================================================
// CATEGORY HELPERS
// =====================================================

export function getCategoryColor(category: string): {
  bg: string;
  text: string;
  border: string;
} {
  const colors: Record<string, { bg: string; text: string; border: string }> = {
    'Sosial': {
      bg: 'bg-blue-100',
      text: 'text-blue-700',
      border: 'border-blue-300',
    },
    'Kesehatan': {
      bg: 'bg-green-100',
      text: 'text-green-700',
      border: 'border-green-300',
    },
    'Keagamaan': {
      bg: 'bg-purple-100',
      text: 'text-purple-700',
      border: 'border-purple-300',
    },
  };

  return colors[category] || {
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    border: 'border-gray-300',
  };
}

// =====================================================
// DUSUN HELPERS
// =====================================================

export const DUSUN_LIST = ['Pakutukan', 'Watugel', 'Paras', 'Ampelgading'] as const;

export type Dusun = typeof DUSUN_LIST[number];

export function getDusunColor(dusun: string): string {
  const colors: Record<string, string> = {
    'Pakutukan': '#10b981',
    'Watugel': '#3b82f6',
    'Paras': '#8b5cf6',
    'Ampelgading': '#f59e0b',
  };
  return colors[dusun] || '#6b7280';
}

// =====================================================
// FILE HELPERS
// =====================================================

export function getFileExtension(filename: string): string {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
}

export function getFileSizeInMB(bytes: number): number {
  return bytes / (1024 * 1024);
}

export function isImageFile(filename: string): boolean {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
  const extension = getFileExtension(filename).toLowerCase();
  return imageExtensions.includes(extension);
}

// =====================================================
// TEXT HELPERS
// =====================================================

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

export function getExcerpt(content: string, maxLength: number = 200): string {
  const plainText = stripHtml(content);
  return truncate(plainText, maxLength);
}

// =====================================================
// SORTING HELPERS
// =====================================================

export function sortByDate<T>(
  items: T[],
  dateKey: keyof T,
  order: 'asc' | 'desc' = 'desc'
): T[] {
  return [...items].sort((a, b) => {
    const dateA = new Date(a[dateKey] as string).getTime();
    const dateB = new Date(b[dateKey] as string).getTime();
    return order === 'desc' ? dateB - dateA : dateA - dateB;
  });
}

export function sortByNumber<T>(
  items: T[],
  numberKey: keyof T,
  order: 'asc' | 'desc' = 'asc'
): T[] {
  return [...items].sort((a, b) => {
    const numA = Number(a[numberKey]);
    const numB = Number(b[numberKey]);
    return order === 'desc' ? numB - numA : numA - numB;
  });
}

// =====================================================
// ARRAY HELPERS
// =====================================================

export function groupBy<T>(
  items: T[],
  key: keyof T
): Record<string, T[]> {
  return items.reduce((result, item) => {
    const groupKey = String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
}

export function sumBy<T>(
  items: T[],
  key: keyof T
): number {
  return items.reduce((sum, item) => sum + Number(item[key]), 0);
}

// =====================================================
// CHART HELPERS
// =====================================================

export function generateChartColors(count: number): string[] {
  const baseColors = [
    '#10b981', // emerald
    '#3b82f6', // blue
    '#8b5cf6', // purple
    '#f59e0b', // amber
    '#ef4444', // red
    '#06b6d4', // cyan
    '#ec4899', // pink
    '#14b8a6', // teal
  ];

  if (count <= baseColors.length) {
    return baseColors.slice(0, count);
  }

  // If we need more colors, generate variations
  const colors = [...baseColors];
  while (colors.length < count) {
    colors.push(...baseColors);
  }
  return colors.slice(0, count);
}

// =====================================================
// FINANCIAL HELPERS
// =====================================================

export function calculateNett(
  gross: number,
  wages: number,
  spb: number
): number {
  return gross - wages - spb;
}

export function calculate25Percent(nett: number): number {
  return nett * 0.25;
}

export function calculate75Percent(nett: number): number {
  return nett * 0.75;
}

export function calculateBalance(
  income: number,
  expense: number
): number {
  return income - expense;
}

export function calculateProgramProgress(
  realization: number,
  budget: number
): number {
  if (budget === 0) return 0;
  return Math.min(Math.round((realization / budget) * 100), 100);
}

// =====================================================
// PAGINATION HELPERS
// =====================================================

export function calculatePagination(
  totalItems: number,
  itemsPerPage: number,
  currentPage: number = 1
) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const offset = (currentPage - 1) * itemsPerPage;
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;

  return {
    totalPages,
    currentPage,
    offset,
    hasNextPage,
    hasPreviousPage,
    itemsPerPage,
    totalItems,
  };
}

// =====================================================
// DEBOUNCE
// =====================================================

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
