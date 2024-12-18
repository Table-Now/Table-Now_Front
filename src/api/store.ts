import { Store, StoreListParams } from "../types/stores/list";
import { StoreDetailType } from "../types/stores/detail";
import { instance } from "./instance";

const getAuthHeader = () => {
  const token = sessionStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const storeApi = {
  getStoreList: async (params: StoreListParams) => {
    const apiParams = {
      ...(params.keyword && { keyword: params.keyword }),
      ...(params.sortType &&
        params.sortType !== "ALL" && { sortType: params.sortType }),
      ...(params.userLat && { userLat: params.userLat }),
      ...(params.userLon && { userLon: params.userLon }),
    };

    const response = await instance.get<Store[]>(`store/list`, {
      params: apiParams,
      headers: {
        "Cache-Control": "no-cache",
      },
    });
    return response.data;
  },

  registerStore: async (formData: FormData) => {
    const response = await instance.post(`store/stores`, formData, {
      headers: {
        ...getAuthHeader(),
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  getStoreDetail: async (id: number) => {
    const response = await instance.get(`store/stores/${id}`, {
      headers: getAuthHeader(),
    });

    return response.data;
  },

  updateStore: async (id: number, storeData: StoreDetailType) => {
    const response = await instance.put(`store/stores/${id}`, storeData, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  deleteStore: async (id: number) => {
    const response = await instance.delete(`store/stores/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },
};

export const managerStoreApi = {
  storeList: async (user: string) => {
    const response = await instance.get(`manager/managers/${user}/list`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },
};
