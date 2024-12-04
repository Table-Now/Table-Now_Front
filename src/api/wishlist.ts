import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const getAuthHeader = () => {
  const token = sessionStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const wishlistApi = {
  toggleLike: async (
    user: string | null,
    store: string | undefined
  ): Promise<boolean> => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}wishlist/toggle`, // 엔드포인트
        { user, store }, // 요청 바디에 user와 store 객체를 보냄
        {
          headers: getAuthHeader(),
        }
      );
      return response.data; // 서버에서 반환한 데이터 (성공/실패 여부)
    } catch (error) {
      console.error("Error toggling like:", error); // 오류 로그 출력
      throw error; // 오류 다시 던짐
    }
  },

  checkLike: async (
    user: string | null,
    store: string | undefined
  ): Promise<boolean> => {
    try {
      const response = await axios.get(`${API_BASE_URL}wishlist/check`, {
        params: { user, store },
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error("Error checking like status:", error);
      throw error;
    }
  },
};
