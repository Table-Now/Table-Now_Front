export interface ReservationRequest {
  userId: string;
  phone: string;
  store: string;
  reserDateTime: string;
  peopleNb: number;
}

export interface ReservationResponse {
  userId?: string;
  phone: string;
  store: string;
  reserDateTime: string;
  peopleNb: number;
  reservationStatus: string;
}
