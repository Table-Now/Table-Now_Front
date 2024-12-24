import { instance } from "./instance";
import { CartDto } from "../types/cart/Cart";

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

  createOrder: async (payload: OrderType): Promise<any> => {
    const response = await instance.post("/api/v1/order/create", payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  },

  payment: async (paymentId: number) => {
    const response = await instance.get(`/v1/api/payment/${paymentId}`);
    return response.data;
  },
};
export interface OrderType {
  user: string | null;
  totalAmount: number;
  payMethod: string;
}
