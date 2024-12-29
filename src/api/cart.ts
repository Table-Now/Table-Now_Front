import { instance } from "./instance";
import {
  CartDto,
  OrderCheck,
  OrderType,
  SettlementRequest,
} from "../types/cart/Cart";
import { SettlementData } from "../pages/settlement/Settlement";

const getAuthHeader = () => {
  const token = sessionStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const cartAPI = {
  addCart: async (storeId: number, cartDto: CartDto) => {
    try {
      const response = await instance.post(
        `/cart/addCart/${storeId}`,
        cartDto,
        {
          headers: {
            ...getAuthHeader(),
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("카트 추가 실패:", error);
      throw error;
    }
  },

  getCart: async (userId: string | null) => {
    try {
      const response = await instance.get(`/cart/use/${userId}`, {
        headers: {
          ...getAuthHeader(),
        },
      });
      return response.data;
    } catch (error) {
      console.error("카트 목록 가져오기 실패:", error);
      throw error;
    }
  },

  deleteCart: async (cartId: number) => {
    const response = await instance.delete(`/cart/use/${cartId}`, {
      headers: {
        ...getAuthHeader(),
      },
    });
    return response.data;
  },

  updateCart: async (userId: string | null, cartDto: CartDto) => {
    const response = await instance.patch(`/cart/cart/${userId}`, cartDto, {
      headers: {
        ...getAuthHeader(),
      },
    });
    return response.data;
  },

  createOrder: async (payload: OrderType): Promise<OrderType> => {
    const response = await instance.post<OrderType>("/orders/create", payload, {
      headers: {
        ...getAuthHeader(),
        "Content-Type": "application/json",
      },
    });
    return response.data;
  },

  getOrderCheck: async (user: string | null): Promise<OrderCheck> => {
    try {
      const response = await instance.get(`/orders/check/${user}`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error("주문 확인 데이터 가져오기 실패:", error);
      throw error;
    }
  },

  createSettle: async (settlementData: SettlementRequest) => {
    const response = await instance.post(
      "/api/settlement/process",
      settlementData,
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  },

  getTodaySettle: async (user: string | null): Promise<SettlementData[]> => {
    const response = await instance.get<SettlementData[]>(
      `/api/settlement/today/${user}`,
      {
        headers: getAuthHeader(),
      }
    );

    // 데이터를 반환
    return response.data;
  },
};
