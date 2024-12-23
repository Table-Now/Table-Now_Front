import React, { useEffect, useState } from "react";
import { cartAPI } from "../../api/cart";
import styled from "styled-components";
import { useUser } from "../../hooks/useUser";
import Button from "../../components/Button";

interface CartItem {
  id: number;
  userId: string;
  menuId: number;
  storeId: number;
  totalCount: number;
  totalAmount: number;
}

const CartListContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f5f5f5;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const CartItemContainer = styled.div`
  background-color: #fff;
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 8px;
  width: 100%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
`;

const ItemTitle = styled.h3`
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 0.5rem;
`;

const ItemDetails = styled.p`
  font-size: 1rem;
  color: #555;
`;

const TotalAmount = styled.p`
  font-size: 1.2rem;
  font-weight: bold;
  color: #e74c3c;
  margin-top: 0.5rem;
`;

const ButtonBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 1rem;
`;

const QuantityBox = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const CartList: React.FC = () => {
  const { user } = useUser();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCartItems = async () => {
    try {
      const data = await cartAPI.getCart(user);
      setCartItems(data);
    } catch (err) {
      setError("장바구니를 가져오는 중 문제가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, [user]);

  const deleteCartHandler = async (menuId: number) => {
    try {
      await cartAPI.deleteCart(menuId);
      fetchCartItems();
    } catch (error) {
      console.error(error);
      setError("장바구니 아이템 삭제 중 오류가 발생했습니다.");
    }
  };

  const handleIncrease = (index: number) => {
    const newCartItems = [...cartItems];
    newCartItems[index].totalCount += 1;
    setCartItems(newCartItems);
  };

  const handleDecrease = (index: number) => {
    const newCartItems = [...cartItems];
    if (newCartItems[index].totalCount > 1) {
      newCartItems[index].totalCount -= 1;
      setCartItems(newCartItems);
    }
  };

  // 서버에 수정된 카트 항목을 보냄
  const handleUpdateCart = async (index: number) => {
    const cartItem = cartItems[index];

    try {
      // CartDto 객체 생성
      const cartDto = {
        id: cartItem.id,
        userId: cartItem.userId,
        menuId: cartItem.menuId,
        storeId: cartItem.storeId,
        totalCount: cartItem.totalCount,
        totalAmount: cartItem.totalAmount,
      };

      // 서버에 업데이트 요청 보내기
      await cartAPI.updateCart(user, cartDto);
      fetchCartItems(); // 업데이트 후 카트 아이템 다시 가져오기
    } catch (error) {
      console.error("카트 수정 중 오류 발생", error);
      setError("카트 수정 중 오류가 발생했습니다.");
    }
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <CartListContainer>
      <h2>장바구니</h2>
      {cartItems.length === 0 ? (
        <p>장바구니에 아이템이 없습니다.</p>
      ) : (
        cartItems.map((item, index) => (
          <CartItemContainer key={item.id}>
            <div>
              <ItemTitle>메뉴 ID: {item.menuId}</ItemTitle>
              <ItemDetails>수량: {item.totalCount}</ItemDetails>
              <TotalAmount>총액: {item.totalAmount}원</TotalAmount>
            </div>
            <ButtonBox>
              <QuantityBox>
                <Button onClick={() => handleDecrease(index)}>-</Button>
                <span>{item.totalCount}</span>
                <Button onClick={() => handleIncrease(index)}>+</Button>
              </QuantityBox>
              <Button onClick={() => handleUpdateCart(index)}>수정</Button>
              <Button onClick={() => deleteCartHandler(item.menuId)}>
                삭제
              </Button>
            </ButtonBox>
          </CartItemContainer>
        ))
      )}
    </CartListContainer>
  );
};

export default CartList;
