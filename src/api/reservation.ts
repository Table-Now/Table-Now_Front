import axios from "axios";
import {
  ReservationRequest,
  ReservationResponse,
} from "../types/reservation/register";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const getAuthHeader = () => {
  const token = sessionStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export interface ReservationDto {
  id: number;
  user: string;
  reservationDate: string;
  status: string;
}

export const reservationApi = {
  register: async (data: ReservationRequest): Promise<ReservationResponse> => {
    const response = await axios.post<ReservationResponse>(
      `${API_BASE_URL}reservation/request`,
      data,
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  getReservations: async (user: string | null): Promise<ReservationDto[]> => {
    console.log(user);
    const response = await axios.get<ReservationDto[]>(
      `${API_BASE_URL}reservation/check?user=${user}`,
      { headers: getAuthHeader() }
    );
    return response.data;
  },
};
