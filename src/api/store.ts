import { Store, StoreListParams } from "../types/stores/list";
import { StoreDetailType } from "../types/stores/detail";
import { instance } from "./instance";
import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "https://backend.tablenow.org/";

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

    const response = await axios.get<Store[]>(
      `https://www.tablenow.org/store/list`,
      {
        params: apiParams,
      }
    );
    return response.data;
  },

  registerStore: async (formData: FormData) => {
    const response = await instance.post(
      `${API_BASE_URL}store/register`,
      formData,
      {
        headers: {
          ...getAuthHeader(),
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  getStoreDetail: async (id: number) => {
    const response = await instance.get(`${API_BASE_URL}store/detail`, {
      params: { id },
    });

    console.log(response);
    return response.data;
  },

  updateStore: async (id: number, storeData: StoreDetailType) => {
    const response = await instance.put(
      `${API_BASE_URL}store/update`,
      storeData,
      {
        params: { id },
        headers: getAuthHeader(),
      }
    );
    return response.data;
  },

  deleteStore: async (id: number) => {
    const response = await instance.delete(`${API_BASE_URL}store/delete`, {
      params: { id },
      headers: getAuthHeader(),
    });
    return response.data;
  },
};

export const managerStoreApi = {
  storeList: async (user: string) => {
    const response = await instance.get(`${API_BASE_URL}manager/list`, {
      params: { user },
      headers: getAuthHeader(),
    });
    return response.data;
  },
};
