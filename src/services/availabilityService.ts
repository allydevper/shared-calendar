import axios from 'axios';
import type { AvailabilityModel } from '../models/AvailabilityModel';

const API_URL = `${import.meta.env.VITE_API_URL}/availability/`;

export const createAvailability = async (availability: AvailabilityModel): Promise<AvailabilityModel> => {
    const response = await axios.post<AvailabilityModel>(API_URL, availability);
    return response.data;
};

export const getAvailability = async (): Promise<AvailabilityModel[]> => {
    const response = await axios.get<AvailabilityModel[]>(API_URL);
    return response.data;
};

export const getAvailabilityById = async (availabilityId: string): Promise<AvailabilityModel> => {
    const response = await axios.get<AvailabilityModel>(`${API_URL}${availabilityId}`);
    return response.data;
};

export const getEventByIdParticipant = async (participantId: string): Promise<AvailabilityModel[]> => {
    const response = await axios.get<AvailabilityModel[]>(`${API_URL}participant/${participantId}`);
    return response.data;
};

export const getAvailabilityByEventId = async (eventId: string): Promise<AvailabilityModel[]> => {
    const response = await axios.get<AvailabilityModel[]>(`${API_URL}event/${eventId}`);
    return response.data;
};

export const updateAvailability = async (availabilityId: string, availability: AvailabilityModel): Promise<AvailabilityModel> => {
    const response = await axios.put<AvailabilityModel>(`${API_URL}${availabilityId}`, availability);
    return response.data;
};

export const deleteAvailability = async (availabilityId: string): Promise<void> => {
    await axios.delete(`${API_URL}${availabilityId}`);
};