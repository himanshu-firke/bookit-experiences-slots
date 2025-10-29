import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export interface Experience {
  _id: string;
  title: string;
  location: string;
  image: string;
  price: number;
  description: string;
  dates?: string[];
  times?: TimeSlot[];
  about?: string;
  taxes: number;
}

export interface TimeSlot {
  time: string;
  available: number;
  status?: string;
}

export interface BookingData {
  experienceId: string;
  experienceTitle: string;
  fullName: string;
  email: string;
  date: string;
  time: string;
  location: string;
  quantity: number;
  price: number;
  taxes: number;
  total: number;
  promoCode?: string;
  discount?: number;
  agreedToTerms: boolean;
}

export const getExperiences = async () => {
  const response = await api.get('/experiences');
  return response.data.data || [];
};

export const getExperienceById = async (id: string) => {
  const response = await api.get(`/experiences/${id}`);
  return response.data.data;
};

export const createBooking = async (bookingData: BookingData) => {
  const response = await api.post('/bookings', bookingData);
  return response.data;
};

export const validatePromoCode = async (code: string, subtotal: number) => {
  const response = await api.post('/promo/validate', { code, subtotal });
  return response.data.data;
};

export default api;
