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
  store: string;
  menu: string;
  menuCount: number;
  totalPrice: number;
}

export interface OrderCheck {
  takeoutName: string;
  takeoutPhone: string;
  totalAmount: number;
  payMethod: string;
  impUid: string;
  orderDetails: OrderCheckDetail[];
}

export interface SettlementRequest {
  settlementDetails: {
    storeName: string;
    menu: string;
    menuCount: number;
    totalPrice: number;
  }[];
  takeoutName: string;
  takeoutPhone: string;
  totalAmount: number;
  // paymentId: string;
  // payMethod: string;
}
