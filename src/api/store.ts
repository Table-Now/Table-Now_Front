import axios from "axios";
import {
  Store,
  StoreListParams,
  StoreRegisterParams,
} from "../types/stores/list";
import { StoreDetailType } from "../types/stores/detail";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

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
    console.log(response.data);
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

  async getStoreDetail(id: number): Promise<StoreDetailType> {
    const response = await axios.get(`${API_BASE_URL}store/detail`, {
      params: { id },
    });
    return response.data;
  },
};
