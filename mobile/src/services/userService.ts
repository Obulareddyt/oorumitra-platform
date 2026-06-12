import api from './api';
import {User, Language, PagedResponse, Notification, Booking} from '../types';

export const userService = {
  async getProfile(): Promise<User> {
    const {data} = await api.get<{data: User}>('/users/profile');
    return data.data!;
  },

  async updateProfile(payload: Partial<User>): Promise<User> {
    const {data} = await api.put<{data: User}>('/users/profile', payload);
    return data.data!;
  },

  async updateFcmToken(fcmToken: string): Promise<void> {
    await api.patch('/users/fcm-token', {fcmToken});
  },

  async updateLanguage(language: Language): Promise<User> {
    const {data} = await api.patch<{data: User}>('/users/language', {language});
    return data.data!;
  },
};

export const notificationService = {
  async getAll(params: {page?: number; size?: number} = {}): Promise<PagedResponse<Notification>> {
    const {data} = await api.get<{data: PagedResponse<Notification>}>('/notifications', {params});
    return data.data!;
  },

  async getUnreadCount(): Promise<number> {
    const {data} = await api.get('/notifications/unread-count');
    return data.data?.count ?? 0;
  },

  async markRead(id: number): Promise<void> {
    await api.patch(`/notifications/${id}/read`);
  },

  async markAllRead(): Promise<void> {
    await api.patch('/notifications/read-all');
  },
};

export const favouriteService = {
  async getAll(params: {page?: number; size?: number} = {}): Promise<PagedResponse<any>> {
    const {data} = await api.get('/favourites', {params});
    return data.data!;
  },

  async add(payload: {listingType: string; listingId: number}): Promise<any> {
    const {data} = await api.post('/favourites', payload);
    return data.data;
  },

  async remove(listingType: string, listingId: number): Promise<void> {
    await api.delete('/favourites', {params: {listingType, listingId}});
  },

  async check(listingType: string, listingId: number): Promise<boolean> {
    const {data} = await api.get('/favourites/check', {params: {listingType, listingId}});
    return data.data ?? false;
  },
};

export const ratingService = {
  async getRatings(listingType: string, listingId: number, params: {page?: number; size?: number} = {}): Promise<PagedResponse<any>> {
    const {data} = await api.get(`/ratings/${listingType}/${listingId}`, {params});
    return data.data!;
  },

  async submit(payload: {listingType: string; listingId: number; stars: number; comment?: string; tags?: string[]}): Promise<any> {
    const {data} = await api.post('/ratings', payload);
    return data.data;
  },
};

export const emergencyService = {
  async getAll(): Promise<any[]> {
    const {data} = await api.get('/emergency/services');
    return data.data ?? [];
  },
};

export const ticketService = {
  async getAll(params: {status?: string; page?: number; size?: number} = {}): Promise<PagedResponse<any>> {
    const {data} = await api.get('/tickets', {params});
    return data.data!;
  },

  async getById(id: number): Promise<any> {
    const {data} = await api.get(`/tickets/${id}`);
    return data.data!;
  },

  async create(payload: object): Promise<any> {
    const {data} = await api.post('/tickets', payload);
    return data.data;
  },

  async getMyTickets(params: {status?: string; page?: number; size?: number} = {}): Promise<PagedResponse<any>> {
    const {data} = await api.get('/tickets/my', {params});
    return data.data!;
  },

  async updateStatus(id: number, status: string): Promise<any> {
    const {data} = await api.patch(`/tickets/${id}/status`, null, {params: {status}});
    return data.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/tickets/${id}`);
  },
};
