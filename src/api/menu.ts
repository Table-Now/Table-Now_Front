import { instance } from "./instance";

const getAuthHeader = () => {
  const token = sessionStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const menuApi = {
  getMenuList: async (store: number | undefined) => {
    const response = await instance.get(`menus/list`, {
      params: { store },
      headers: getAuthHeader(),
    });
    return response.data;
  },
};
