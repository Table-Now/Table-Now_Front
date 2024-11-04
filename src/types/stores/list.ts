export interface Store {
  id: number;
  user: string;
  title: string;
  location: string;
  imageUrl: string;
  description: string;
  rating: number | null;
  openDate: string;
  closeDate: string;
  weekOff?: string | null;
  createAt: string;
  updateAt: string | null;
  latitude: number;
  longitude: number;
  distance?: number | null;
}

export type SortType =
  | "ALL"
  | "DISTANCE"
  | "RATING_HIGH"
  | "RATING_LOW"
  | "NAME_ASC"
  | "NAME_DESC";
export interface StoreListParams {
  keyword?: string;
  sortType?: SortType;
  userLat?: number;
  userLon?: number;
}

export interface StoreRegisterParams {
  user: string;
  store: string;
  storeLocation: string;
  storeImg: string;
  storeContents: string;
  storeOpen: string;
  storeClose: string;
}
