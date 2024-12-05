export interface ReservationRequest {
  userId: string;
  phone: string;
  store: string;
  peopleNb: number;
}

export interface ReservationResponse {
  userId?: string;
  phone: string;
  store: string;
  peopleNb: number;
}
