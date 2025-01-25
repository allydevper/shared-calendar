import axios from 'axios';
import type { ParticipantModel } from '../models/participant.model';

const API_URL = `${import.meta.env.VITE_API_URL}/participants/`;

export const createParticipant = async (participant: ParticipantModel): Promise<ParticipantModel> => {
    const response = await axios.post<ParticipantModel>(API_URL, participant);
    return response.data;
};

export const getParticipants = async (): Promise<ParticipantModel[]> => {
    const response = await axios.get<ParticipantModel[]>(API_URL);
    return response.data;
};

export const getParticipantById = async (participantId: string): Promise<ParticipantModel> => {
    const response = await axios.get<ParticipantModel>(`${API_URL}${participantId}`);
    return response.data;
};

export const updateParticipant = async (participantId: string, participant: ParticipantModel): Promise<ParticipantModel> => {
    const response = await axios.put<ParticipantModel>(`${API_URL}${participantId}`, participant);
    return response.data;
};

export const deleteParticipant = async (participantId: string): Promise<void> => {
    await axios.delete(`${API_URL}${participantId}`);
}; 