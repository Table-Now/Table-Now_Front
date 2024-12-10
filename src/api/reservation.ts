import {
  ReservationRequest,
  ReservationResponse,
} from "../types/reservation/register";
import { ReservationCheck } from "../types/reservation/check";
import { myReservationListTypes } from "../types/reservation/myList";
import { instance } from "./instance";
import { ReservationRosterType } from "../types/reservation/reservationRoster";

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
    console.log(response);
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

  myReservationCancel: async (store: string | undefined) => {
    await instance.delete(`reservation/delete?store=${store}`, {
      headers: getAuthHeader(),
    });
  },

  myReservationApproval: async (phone: string | undefined) => {
    try {
      const response = await instance.post(
        `reservation/approval?phone=${phone}`,
        null, // POST 요청에서 body를 전달하지 않는 경우 `null`을 사용할 수 있습니다
        { headers: getAuthHeader() } // headers는 세 번째 인자로 전달
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export const reservationListApi = {
  reservationList: async (store: string | null) => {
    try {
      const response = await instance.get<ReservationRosterType[]>(
        `manager/confirm?store=${store}`,
        {
          headers: getAuthHeader(),
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
