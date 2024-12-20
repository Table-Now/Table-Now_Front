export interface MenuItem {
  id?: number;
  image?: string;
  name?: string;
  price?: string;
  status?: string;
  storeId?: number;
}

export interface MenuProps {
  store: number | undefined;
  detailUser: string | undefined;
}

export interface MenuUpdateProps {
  name?: string;
  price?: number | string;
  image?: string;
}
