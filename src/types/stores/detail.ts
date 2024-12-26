export interface StoreDetailType {
  id?: number;
  user?: string;
  store?: string;
  storeLocation?: string;
  storeImg?: string;
  storeContents?: string;
  rating?: number;
  storeOpen?: string;
  storeClose?: string;
  storeWeekOff?: string;
  createAt?: string;
  updateAt?: string;
  latitude?: number;
  longitude?: number;
  distance?: number;
  phone?: string;
}

interface StoreDetailData {
  storeContents?: string;
  latitude?: number;
  longitude?: number;
  store?: string;
}

export interface HomeProps {
  storeDetail: StoreDetailData;
}
