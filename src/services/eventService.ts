import axios from 'axios';
import type { EventModel } from '../models/event.model';

const API_URL = `${import.meta.env.VITE_API_URL}/events/`;

export const createEvent = async (event: EventModel): Promise<EventModel> => {
    const response = await axios.post<EventModel>(API_URL, event);
    return response.data;
};

export const getEvents = async (): Promise<EventModel[]> => {
    const response = await axios.get<EventModel[]>(API_URL);
    return response.data;
};

export const getEventById = async (eventId: string): Promise<EventModel> => {
    const response = await axios.get<EventModel>(`${API_URL}${eventId}`);
    return response.data;
};

export const updateEvent = async (eventId: string, event: EventModel): Promise<EventModel> => {
    const response = await axios.put<EventModel>(`${API_URL}${eventId}`, event);
    return response.data;
};

export const deleteEvent = async (eventId: string): Promise<void> => {
    await axios.delete(`${API_URL}${eventId}`);
}; 