import { api } from './client';

export type ApiUser = { _id: string; name: string; email: string; status?: string };
export type ApiMessage = { _id: string; conversation: string; sender: string; receiver: string; content: string; status: 'sent' | 'delivered' | 'read'; createdAt: string };
export type ApiConversation = { _id: string; participants: ApiUser[]; lastMessage: null | { _id: string; content: string; sender: string; receiver: string; status: string; createdAt: string }; lastUnreadMessage?: { _id: string; content: string; sender: string; receiver: string; status: string; createdAt: string } | null; updatedAt: string; unreadCount?: number };

export const chatApi = {
  // Auth
  login(email: string, password: string) {
    return api.post<{ user: ApiUser; token: string }>('/auth/login', { email, password });
  },
  register(name: string, email: string, number: string, password: string) {
    return api.post<{ user: ApiUser; token: string }>('/auth/register', { name, email, number, password });
  },

  // Users
  listUsers() {
    return api.get<ApiUser[]>('/users');
  },

  // Conversations
  listConversations() {
    return api.get<ApiConversation[]>('/conversations');
  },
  getOrCreateWith(userId: string) {
    return api.get<{ _id: string }>(`/conversations/with/${userId}`);
  },
  listMessages(conversationId: string) {
    return api.get<ApiMessage[]>(`/conversations/${conversationId}/messages`);
  }
};


