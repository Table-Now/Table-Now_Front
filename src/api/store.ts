import axios from "axios";
import {
  Store,
  StoreListParams,
  StoreRegisterParams,
} from "../types/stores/list";

const API_BASE_URL = "http://localhost:8080/";

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

    const response = await axios.get<Store[]>(`${API_BASE_URL}store/list`, {
      params: apiParams,
    });
    return response.data;
  },

  registerStore: async (params: StoreRegisterParams) => {
    const response = await axios.post<StoreRegisterParams>(
      `${API_BASE_URL}store/register`,
      params,
      { headers: getAuthHeader() }
    );
    return response.data;
  },
};
