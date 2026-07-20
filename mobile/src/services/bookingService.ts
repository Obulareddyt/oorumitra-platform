import api from './api';
import {Booking, BookingStatus, ListingType, PagedResponse} from '../types';

export const bookingService = {
  async create(payload: {
    listingId: number;
    listingType: ListingType;
    serviceDate?: string;
    serviceTime?: string;
    notes?: string;
  }): Promise<Booking> {
    const {data} = await api.post<{data: Booking}>('/bookings', payload);
    return data.data!;
  },

  async getMy(page = 0, size = 20, status?: BookingStatus): Promise<PagedResponse<Booking>> {
    const {data} = await api.get<{data: PagedResponse<Booking>}>('/bookings/my', {params: {page, size, status}});
    return data.data!;
  },

  async getOwner(page = 0, size = 20, status?: BookingStatus): Promise<PagedResponse<Booking>> {
    const {data} = await api.get<{data: PagedResponse<Booking>}>('/bookings/owner', {params: {page, size, status}});
    return data.data!;
  },

  async getById(id: number): Promise<Booking> {
    const {data} = await api.get<{data: Booking}>(`/bookings/${id}`);
    return data.data!;
  },

  async updateStatus(id: number, status: BookingStatus): Promise<Booking> {
    const {data} = await api.put<{data: Booking}>(`/bookings/${id}/status`, null, {params: {status}});
    return data.data!;
  },
};
