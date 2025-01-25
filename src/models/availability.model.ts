export interface AvailabilityModel {
  id?: string;
  participantId: string;
  eventId: string;
  startDate: Date;
  endDate: Date;
  createdAt?: Date;
} 