export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  response: string;
  tool_results?: Array<{
    tool: string;
    result: any;
  }>;
  skipped_tools_message?: string;
}

export interface ChatHistoryEntry {
  id: string;
  title: string;
  messages: ChatMessage[];
  created_at: string;
  updated_at: string;
}

export interface ChatHistoryListItem {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  message_count: number;
}

export interface UserPreferences {
  user_id: string;
  location?: string;
  interests?: string[];
  budget_min?: number;
  budget_max?: number;
}

export interface UsersResponse {
  users: string[];
}

