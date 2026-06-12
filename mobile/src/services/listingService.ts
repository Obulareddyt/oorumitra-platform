import api from './api';
import {
  WorkerListing, Product, VehicleWorkListing, TransportListing,
  PagedResponse, WorkType, ProductCategory, VehicleWorkType, TransportVehicleType
} from '../types';

export const workerService = {
  async getAll(params?: {
    workType?: WorkType; village?: string; minAmount?: number; maxAmount?: number;
    keyword?: string; sortBy?: string; page?: number; size?: number;
  }) {
    const {data} = await api.get<{data: PagedResponse<WorkerListing>}>('/workers', {params});
    return data.data!;
  },

  async getNearby(lat: number, lng: number, radiusKm?: number, limit = 20) {
    const {data} = await api.get<{data: WorkerListing[]}>('/workers/nearby', {
      params: {lat, lng, radiusKm, limit},
    });
    return data.data!;
  },

  async getById(id: number) {
    const {data} = await api.get<{data: WorkerListing}>(`/workers/${id}`);
    return data.data!;
  },

  async getMyListings(page = 0, size = 20) {
    const {data} = await api.get<{data: PagedResponse<WorkerListing>}>('/workers/my', {params: {page, size}});
    return data.data!;
  },

  async create(payload: object) {
    const {data} = await api.post<{data: WorkerListing}>('/workers', payload);
    return data.data!;
  },

  async update(id: number, payload: object) {
    const {data} = await api.put<{data: WorkerListing}>(`/workers/${id}`, payload);
    return data.data!;
  },

  async delete(id: number) {
    await api.delete(`/workers/${id}`);
  },
};

export const productService = {
  async getAll(params?: {
    category?: ProductCategory; negotiable?: boolean; keyword?: string; sortBy?: string; page?: number; size?: number;
  }) {
    const {data} = await api.get<{data: PagedResponse<Product>}>('/products', {params});
    return data.data!;
  },

  async getNearby(lat: number, lng: number, radiusKm?: number, limit = 20) {
    const {data} = await api.get<{data: Product[]}>('/products/nearby', {
      params: {lat, lng, radiusKm, limit},
    });
    return data.data!;
  },

  async getById(id: number) {
    const {data} = await api.get<{data: Product}>(`/products/${id}`);
    return data.data!;
  },

  async getMyProducts(page = 0, size = 20) {
    const {data} = await api.get<{data: PagedResponse<Product>}>('/products/my', {params: {page, size}});
    return data.data!;
  },

  async create(payload: object, images?: {uri: string; type: string; name: string}[]) {
    const formData = new FormData();
    formData.append('data', JSON.stringify(payload));
    images?.forEach(img => formData.append('images', img as unknown as Blob));
    const {data} = await api.post<{data: Product}>('/products', formData, {
      headers: {'Content-Type': 'multipart/form-data'},
    });
    return data.data!;
  },

  async delete(id: number) {
    await api.delete(`/products/${id}`);
  },
};

export const vehicleWorkService = {
  async getAll(params?: {vehicleWorkType?: VehicleWorkType; vehicleType?: VehicleWorkType; keyword?: string; sortBy?: string; page?: number; size?: number}) {
    const {data} = await api.get<{data: PagedResponse<VehicleWorkListing>}>('/vehicle-work', {params});
    return data.data!;
  },

  async getNearby(lat: number, lng: number, radiusKm?: number, limit = 20) {
    const {data} = await api.get<{data: VehicleWorkListing[]}>('/vehicle-work/nearby', {
      params: {lat, lng, radiusKm, limit},
    });
    return data.data!;
  },

  async getById(id: number) {
    const {data} = await api.get<{data: VehicleWorkListing}>(`/vehicle-work/${id}`);
    return data.data!;
  },

  async create(payload: object) {
    const {data} = await api.post<{data: VehicleWorkListing}>('/vehicle-work', payload);
    return data.data!;
  },

  async delete(id: number) {
    await api.delete(`/vehicle-work/${id}`);
  },
};

export const transportService = {
  async getAll(params?: {vehicleType?: TransportVehicleType; keyword?: string; sortBy?: string; page?: number; size?: number}) {
    const {data} = await api.get<{data: PagedResponse<TransportListing>}>('/transport', {params});
    return data.data!;
  },

  async getNearby(lat: number, lng: number, radiusKm?: number, limit = 20) {
    const {data} = await api.get<{data: TransportListing[]}>('/transport/nearby', {
      params: {lat, lng, radiusKm, limit},
    });
    return data.data!;
  },

  async getById(id: number) {
    const {data} = await api.get<{data: TransportListing}>(`/transport/${id}`);
    return data.data!;
  },

  async create(payload: object) {
    const {data} = await api.post<{data: TransportListing}>('/transport', payload);
    return data.data!;
  },

  async delete(id: number) {
    await api.delete(`/transport/${id}`);
  },
};
