import {
  ReservationRequest,
  ReservationResponse,
} from "../types/reservation/register";
import { ReservationCheck } from "../types/reservation/check";
import { myReservationListTypes } from "../types/reservation/myList";
import { instance } from "./instance";

const getAuthHeader = () => {
  const token = sessionStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const reservationApi = {
  register: async (data: ReservationRequest): Promise<ReservationResponse> => {
    const response = await instance.post<ReservationResponse>(
      `reservation/request`,
      data,
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  reservationCheck: async (data: ReservationCheck): Promise<boolean> => {
    const response = await instance.get<boolean>(
      `reservation/myrelist?user=${data.user}&id=${data.id}`,
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  myReservationList: async (
    user: string | null
  ): Promise<myReservationListTypes> => {
    const response = await instance.get<myReservationListTypes>(
      `reservation/reserlist?user=${user}`,
      { headers: getAuthHeader() }
    );
    return response.data;
  },
};
