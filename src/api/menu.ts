import { instance } from "./instance";

const getAuthHeader = () => {
  const token = sessionStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const menuApi = {
  getMenuList: async (storeId: number | undefined) => {
    const response = await instance.get(`menus/menu/${storeId}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },
};
