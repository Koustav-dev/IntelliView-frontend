import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  }).format(new Date(date));
}

export function formatTime(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(date));
}

export function timeAgo(date: string | Date): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
  ];
  for (const { label, seconds: s } of intervals) {
    const count = Math.floor(seconds / s);
    if (count >= 1) return `${count} ${label}${count > 1 ? 's' : ''} ago`;
  }
  return 'just now';
}

export function getDifficultyColor(difficulty: string) {
  switch (difficulty?.toUpperCase()) {
    case 'EASY': return 'text-emerald-500';
    case 'MEDIUM': return 'text-amber-500';
    case 'HARD': return 'text-rose-500';
    default: return 'text-zinc-500';
  }
}

export function getDifficultyBadge(difficulty: string) {
  switch (difficulty?.toUpperCase()) {
    case 'EASY': return 'badge-easy';
    case 'MEDIUM': return 'badge-medium';
    case 'HARD': return 'badge-hard';
    default: return '';
  }
}

export function getStatusColor(status: string) {
  switch (status) {
    case 'ACCEPTED': return 'text-emerald-500';
    case 'WRONG_ANSWER': return 'text-rose-500';
    case 'TIME_LIMIT_EXCEEDED': return 'text-amber-500';
    case 'RUNTIME_ERROR': return 'text-orange-500';
    case 'COMPILE_ERROR': return 'text-red-500';
    case 'RUNNING': return 'text-blue-500';
    default: return 'text-zinc-500';
  }
}

export function truncate(str: string, len: number): string {
  if (!str) return '';
  return str.length > len ? str.slice(0, len) + '...' : str;
}

export const LANGUAGES = [
  { value: 'java', label: 'Java', icon: '☕' },
  { value: 'python', label: 'Python', icon: '🐍' },
  { value: 'javascript', label: 'JavaScript', icon: '🟨' },
  { value: 'cpp', label: 'C++', icon: '⚡' },
  { value: 'typescript', label: 'TypeScript', icon: '🔷' },
  { value: 'go', label: 'Go', icon: '🐹' },
  { value: 'rust', label: 'Rust', icon: '🦀' },
  { value: 'c', label: 'C', icon: '🔧' },
];
