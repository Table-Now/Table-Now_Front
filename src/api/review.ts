import axios from "axios";
import { ReviewRegister } from "../types/review/Review";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const getAuthHeader = () => {
  const token = sessionStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const reviewApi = {
  registerReview: async (formData: ReviewRegister) => {
    const response = await axios.post(`/review/register`, formData, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  getReview: async (store: string) => {
    const response = await axios.get(`/review/list?store=${store}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  deleteReview: async (id: number, user: string | null) => {
    const response = await axios.delete(
      `/review/delete?user=${user}&id=${id}`,
      { headers: getAuthHeader() }
    );
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
