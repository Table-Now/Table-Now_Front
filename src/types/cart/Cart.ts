export interface CartDto {
  userId: string | null;
  menuId: number;
  storeId: number;
  totalCount: number;
}

export interface OrderDetailType {
  menuId: number;
  menu: string;
  menuCount: number;
  totalPrice: number;
}

export interface OrderType {
  takeoutName: string;
  takeoutPhone: string;
  totalAmount: number;
  payMethod: string;
  orderDetails: OrderDetailType[];
}

export interface OrderCheckDetail {
  menuId: number;
  menu: string;
  menuCount: number;
  totalPrice: number;
}

export interface OrderCheck {
  takeoutName: string;
  takeoutPhone: string;
  totalAmount: number;
  payMethod: string;
  orderDetails: OrderCheckDetail[];
}
