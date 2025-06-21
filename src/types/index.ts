
export interface KPIData {
  critical: { value: number; trend: number };
  monitoring: { value: number; trend: number };
  resolved: { value: number; trend: number };
  predictions: { value: number; accuracy: number };
}

export interface Occurrence {
  id: string;
  type: 'lighting' | 'waste' | 'construction' | 'degraded';
  count: number;
  priority: 'high' | 'medium' | 'low';
  region: string;
  description: string;
  lat: number;
  lng: number;
  status: 'pending' | 'in_progress' | 'resolved';
  createdAt: Date;
  updatedAt: Date;
}

export interface Region {
  id: string;
  name: string;
  lat: number;
  lng: number;
  occurrences: number;
  status: 'critical' | 'warning' | 'normal';
  polygon?: Array<{ lat: number; lng: number }>;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  suggestions?: string[];
}

export interface User {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

export interface Theme {
  mode: 'light' | 'dark';
}

export interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  section: string;
  active?: boolean;
}

export interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string;
    tension?: number;
    fill?: boolean;
  }>;
}

export interface APIResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> extends APIResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
export interface MapFilter {
  type: 'all' | 'critical' | 'lighting' | 'waste' | 'construction';
  region?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
} 