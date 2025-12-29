import Constants from 'expo-constants';
import type {
  ChatResponse,
  ChatHistoryEntry,
  ChatHistoryListItem,
  ChatMessage,
  UserPreferences,
} from '@/types';

const getApiBaseUrl = (): string => {
  // Check for environment variable first
  const envUrl = Constants.expoConfig?.extra?.apiBaseUrl;
  if (envUrl) return envUrl;

  // Default to localhost for development
  // Note: On Android emulator, use 10.0.2.2 instead of localhost
  return 'http://localhost:8000/api';
};

const API_BASE_URL = getApiBaseUrl();

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Chat
  async sendMessage(message: string, userId: string): Promise<ChatResponse> {
    return this.request<ChatResponse>('/chat', {
      method: 'POST',
      body: JSON.stringify({ message, user_id: userId }),
    });
  }

  // Chat History
  async getChatHistories(): Promise<ChatHistoryListItem[]> {
    return this.request<ChatHistoryListItem[]>('/chat-history');
  }

  async getChatHistory(id: string): Promise<ChatHistoryEntry> {
    return this.request<ChatHistoryEntry>(`/chat-history/${id}`);
  }

  async saveChatHistory(
    id: string | null,
    messages: ChatMessage[]
  ): Promise<ChatHistoryEntry> {
    return this.request<ChatHistoryEntry>('/chat-history', {
      method: 'POST',
      body: JSON.stringify({ id, messages }),
    });
  }

  async deleteChatHistory(id: string): Promise<void> {
    await this.request(`/chat-history/${id}`, { method: 'DELETE' });
  }

  async clearAllChatHistory(): Promise<void> {
    await this.request('/chat-history', { method: 'DELETE' });
  }

  // Users & Preferences
  async getAllUsers(): Promise<string[]> {
    const response = await this.request<{ users: string[] }>('/users');
    return response.users || [];
  }

  async getPreferences(userId: string): Promise<UserPreferences> {
    return this.request<UserPreferences>(`/preferences/${userId}`);
  }

  async updatePreferences(
    userId: string,
    preferences: Partial<UserPreferences>
  ): Promise<UserPreferences> {
    return this.request<UserPreferences>(`/preferences/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(preferences),
    });
  }
}

export const api = new ApiClient(API_BASE_URL);

