import api from './api';
import {ChatConversation, ChatMessage, PagedResponse, ListingType} from '../types';

export const chatService = {
  async getConversations(): Promise<ChatConversation[]> {
    const {data} = await api.get<{data: ChatConversation[]}>('/chats');
    return data.data ?? [];
  },

  async startConversation(payload: {sellerId: number; listingType?: ListingType; listingId?: number}): Promise<ChatConversation> {
    const {data} = await api.post<{data: ChatConversation}>('/chats/start', payload);
    return data.data!;
  },

  async getMessages(conversationId: number, params: {page?: number; size?: number} = {}): Promise<PagedResponse<ChatMessage>> {
    const {data} = await api.get<{data: PagedResponse<ChatMessage>}>(
      `/chats/${conversationId}/messages`,
      {params},
    );
    return data.data!;
  },

  async sendMessage(conversationId: number, payload: {content: string; messageType?: string; mediaUrl?: string}): Promise<ChatMessage> {
    const {data} = await api.post<{data: ChatMessage}>(
      `/chats/${conversationId}/messages`,
      payload,
    );
    return data.data!;
  },
};
