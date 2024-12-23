import React from "react";
import { useUser } from "../../hooks/useUser";

const Cart = () => {
  const { user } = useUser();

  return <div>Cart</div>;
};

export default Cart;
