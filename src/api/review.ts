import axios from "axios";
import { ReviewRegister } from "../types/review/Review";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const getAuthHeader = () => {
  const token = sessionStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const reviewApi = {
  registerReview: async (formData: ReviewRegister) => {
    const response = await axios.post(
      `${API_BASE_URL}review/register`,
      formData,
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  getReview: async (store: string) => {
    const response = await axios.get(
      `${API_BASE_URL}review/list?store=${store}`,
      { headers: getAuthHeader() }
    );
    return response.data;
  },
};
