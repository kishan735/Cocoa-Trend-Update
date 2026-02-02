import { create } from 'zustand';
import type { ChatMessage, TimeRange, DetailItem } from '../types';

interface AppState {
  selectedTimeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;

  currentDetailItem: DetailItem | null;
  setDetailItem: (item: DetailItem | null) => void;

  chatMessages: Record<string, ChatMessage[]>;
  addChatMessage: (itemId: string, message: ChatMessage) => void;
  clearChatMessages: (itemId: string) => void;

  isLoading: boolean;
  setLoading: (loading: boolean) => void;

  lastUpdated: string;
  setLastUpdated: (time: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedTimeRange: '1M',
  setTimeRange: (range) => set({ selectedTimeRange: range }),

  currentDetailItem: null,
  setDetailItem: (item) => set({ currentDetailItem: item }),

  chatMessages: {},
  addChatMessage: (itemId, message) => set((state) => ({
    chatMessages: {
      ...state.chatMessages,
      [itemId]: [...(state.chatMessages[itemId] || []), message]
    }
  })),
  clearChatMessages: (itemId) => set((state) => ({
    chatMessages: {
      ...state.chatMessages,
      [itemId]: []
    }
  })),

  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),

  lastUpdated: new Date().toISOString(),
  setLastUpdated: (time) => set({ lastUpdated: time })
}));
