import { instance } from "./instance";
import { ChatMessage } from "../types/chat/Chat";

const getAuthHeader = () => {
  const token = sessionStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const chatApi = {
  getAllMessages: async () => {
    try {
      const response = await instance.get<ChatMessage[]>(`chat/messages`, {
        headers: {
          ...getAuthHeader(),
        },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch chat messages", error);
      throw error;
    }
  },
};
