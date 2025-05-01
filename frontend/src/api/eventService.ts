//events.Service.ts
import axiosInstance from './axios';

export const fetchEvents = async () => {
  const response = await axiosInstance.get('api/public/events');
  return response.data;
};

export const createEvent = async (eventData: any) => {
  const response = await axiosInstance.post('/api/events', eventData);
  return response.data;
};

export const updateEvent = async (id: string, eventData: any) => {
  const response = await axiosInstance.put(`/api/events/${id}`, eventData);
  return response.data;
};

export const deleteEvent = async (id: string) => {
  const response = await axiosInstance.delete(`/api/events/${id}`);
  return response.data;
};