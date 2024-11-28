import axios from "axios";
import {
  ReservationRequest,
  ReservationResponse,
} from "../types/reservation/register";
import { ReservationCheck } from "../types/reservation/check";
import { myReservationListTypes } from "../types/reservation/myList";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const getAuthHeader = () => {
  const token = sessionStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const reservationApi = {
  register: async (data: ReservationRequest): Promise<ReservationResponse> => {
    const response = await axios.post<ReservationResponse>(
      `/reservation/request`,
      data,
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  reservationCheck: async (data: ReservationCheck): Promise<boolean> => {
    const response = await axios.get<boolean>(
      `/reservation/myrelist?user=${data.user}&id=${data.id}`,
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  myReservationList: async (
    user: string | null
  ): Promise<myReservationListTypes> => {
    const response = await axios.get<myReservationListTypes>(
      `/reservation/reserlist?user=${user}`,
      { headers: getAuthHeader() }
    );
    return response.data;
  },
};
