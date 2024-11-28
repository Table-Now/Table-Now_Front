import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const getAuthHeader = () => {
  const token = sessionStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const wishlistApi = {
  toggleLike: async (storeId: number): Promise<boolean> => {
    try {
      const response = await axios.post(`${API_BASE_URL}wishlist/like`, null, {
        params: { id: storeId },
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  isLiked: async (storeId: number): Promise<boolean> => {
    try {
      const response = await axios.get(`${API_BASE_URL}wishlist/isLiked`, {
        params: { id: storeId },
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
