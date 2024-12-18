import { ReviewPassword, ReviewRegister } from "../types/review/Review";
import { instance } from "./instance";

const getAuthHeader = () => {
  const token = sessionStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const reviewApi = {
  registerReview: async (formData: ReviewRegister) => {
    const response = await instance.post(`reviews/register`, formData, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  getReview: async (store: string) => {
    const response = await instance.get(`reviews/review/${store}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  deleteReview: async (reviewId: number, user: string | null) => {
    const response = await instance.delete(`reviews/${reviewId}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  securityReviewCheck: async (data: ReviewPassword) => {
    const response = await instance.post(`reviews/passwordrequest`, data, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  // updateReview: async (updateData: {
  //   id: number;
  //   user: string;
  //   store: string;
  //   contents: string;
  // }) => {
  //   const response = await axios.put(
  //     `${API_BASE_URL}review/update`,
  //     updateData,
  //     { headers: getAuthHeader() }
  //   );
  //   return response.data;
  // },
};
