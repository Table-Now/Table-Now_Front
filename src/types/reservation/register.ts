export interface ReservationRequest {
  userId: string;
  phone: string;
  store: string;
  reservationDateTime: string;
  peopleNb: number;
}

export interface ReservationResponse {
  userId?: string;
  phone: string;
  store: string;
  reservationTime: string;
  peopleNb: number;
  reservationStatus: string;
}
