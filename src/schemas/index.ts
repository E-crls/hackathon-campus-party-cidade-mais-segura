import { z } from 'zod';

// 📊 KPI Schema
export const kpiSchema = z.object({
  critical: z.object({
    value: z.number().int().positive(),
    trend: z.number(),
  }),
  monitoring: z.object({
    value: z.number().int().positive(),
    trend: z.number(),
  }),
  resolved: z.object({
    value: z.number().int().positive(),
    trend: z.number(),
  }),
  predictions: z.object({
    value: z.number().int().positive(),
    accuracy: z.number().min(0).max(100),
  }),
});

// 🎯 Occurrence Schema
export const occurrenceSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(['lighting', 'waste', 'construction', 'degraded']),
  count: z.number().int().positive(),
  priority: z.enum(['high', 'medium', 'low']),
  region: z.string().min(1),
  description: z.string().min(1),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  status: z.enum(['pending', 'in_progress', 'resolved']),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// 🗺️ Region Schema
export const regionSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  occurrences: z.number().int().nonnegative(),
  status: z.enum(['critical', 'warning', 'normal']),
  polygon: z.array(z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  })).optional(),
});

// 💬 Chat Message Schema
export const chatMessageSchema = z.object({
  id: z.string().uuid(),
  content: z.string().min(1),
  sender: z.enum(['user', 'ai']),
  timestamp: z.date(),
  suggestions: z.array(z.string()).optional(),
});

// 👤 User Schema
export const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Nome é obrigatório'),
  role: z.string().min(1, 'Função é obrigatória'),
  avatar: z.string().url().optional(),
});

// 📝 Chat Input Schema
export const chatInputSchema = z.object({
  message: z.string().min(1, 'Mensagem não pode estar vazia').max(1000, 'Mensagem muito longa'),
});

// 🔍 Map Filter Schema
export const mapFilterSchema = z.object({
  type: z.enum(['all', 'critical', 'lighting', 'waste', 'construction']),
  region: z.string().optional(),
  dateRange: z.object({
    start: z.date(),
    end: z.date(),
  }).optional(),
});

// 🎨 Theme Schema
export const themeSchema = z.object({
  mode: z.enum(['light', 'dark']),
});

// Type exports
export type KPIData = z.infer<typeof kpiSchema>;
export type Occurrence = z.infer<typeof occurrenceSchema>;
export type Region = z.infer<typeof regionSchema>;
export type ChatMessage = z.infer<typeof chatMessageSchema>;
export type User = z.infer<typeof userSchema>;
export type ChatInput = z.infer<typeof chatInputSchema>;
export type MapFilter = z.infer<typeof mapFilterSchema>;
export type Theme = z.infer<typeof themeSchema>; 