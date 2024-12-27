import React, { useEffect, useState } from "react";
import { cartAPI } from "../../api/cart";
import styled from "styled-components";
import { useUser } from "../../hooks/useUser";
import Button from "../../components/Button";
import PaymentModal from "../../components/modal/PaymentModal";
import { useNavigate } from "react-router-dom";
import { OrderType } from "../../types/cart/Cart";

interface CartItem {
  id: number;
  userId: string;
  menuId: number;
  storeId: number;
  totalCount: number;
  totalAmount: number;
  menu: string;
  image: string;
}

const StTitleBox = styled.div`
  display: flex;
  align-items: center;
`;
const StImg = styled.img`
  width: 80px;
  height: 80px;
  margin-right: 20px;
`;
const CartListContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
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
`;

const QuantityBox = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Totalpayment = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  gap: 20px;
`;

const CartList: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

      await cartAPI.updateCart(user, cartDto);
      fetchCartItems(); // 업데이트 후 카트 아이템 다시 가져오기
    } catch (error) {
      console.error("카트 수정 중 오류 발생", error);
      setError("카트 수정 중 오류가 발생했습니다.");
    }
  };

  // useEffect(() => {
  //   const loadScript = (src: string) => {
  //     return new Promise<void>((resolve, reject) => {
  //       const script = document.createElement("script");
  //       script.src = src;
  //       script.onload = () => resolve();
  //       script.onerror = (error) => reject(error);
  //       document.body.appendChild(script);
  //     });
  //   };

  //   const loadScripts = async () => {
  //     try {
  //       await loadScript("https://code.jquery.com/jquery-3.6.0.min.js");
  //       await loadScript("https://cdn.iamport.kr/js/iamport.payment-1.1.8.js");
  //     } catch (error) {
  //       console.error("스크립트 로딩 중 오류 발생", error);
  //     }
  //   };

  //   loadScripts();
  // }, []);

  // const handleCheckout = async () => {
  //   if (!user || cartItems.length === 0) {
  //     setError("로그인 후 결제 가능합니다.");
  //     return;
  //   }

  //   if (window.IMP) {
  //     const IMP = window.IMP;
  //     // 이제 IMP를 사용할 수 있습니다

  //     IMP.init("imp62440604");

  //     const paymentData = {
  //       pg: "html5_inicis",
  //       pay_method: "card",
  //       merchant_uid: `order_${new Date().getTime()}`,
  //       name: "장바구니 결제",
  //       amount: 1000,
  //       buyer_email: "jominuk1025@naver.com",
  //       buyer_name: "조민욱",
  //       buyer_tel: "01033612489",
  //       buyer_postcode: "123-456",
  //     };

  //     IMP.request_pay(paymentData, function (response: any) {
  //       if (response.success) {
  //         console.log(response);
  //         alert("결제가 완료되었습니다.");
  //       } else {
  //         alert(`${response.error_msg}`);
  //       }
  //     });
  //   } else {
  //     setError("결제 서비스가 제대로 로드되지 않았습니다.");
  //   }
  // };

  const totalCartAmount = cartItems.reduce(
    (sum, item) => sum + item.totalAmount,
    0
  );

  const handlePaymentConfirm = async (
    takeoutName: string,
    takeoutPhone: string
  ) => {
    try {
      const orderDetails = cartItems.map((item) => ({
        menuId: item.menuId,
        menu: item.menu,
        menuCount: item.totalCount,
        totalPrice: item.totalAmount,
      }));

      const totalAmount = cartItems.reduce(
        (sum, item) => sum + item.totalAmount,
        0
      );

      const orderPayload: OrderType = {
        totalAmount: totalAmount,
        payMethod: "CARD",
        orderDetails: orderDetails,
        takeoutName,
        takeoutPhone,
      };

      await cartAPI.createOrder(orderPayload);
      alert("주문이 완료되었습니다!");
      navigate(`/check`);
    } catch (error: any) {
      console.error("Order error:", error);
      alert(
        error.response?.data?.message || "주문 처리 중 오류가 발생했습니다."
      );
    }
  };

  const handleCheckout = () => {
    setIsModalOpen(true);
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
            <StTitleBox>
              <StImg src={item.image || "/img/noimage.jpg"} />
              <div>
                <ItemTitle>메뉴: {item.menu}</ItemTitle>
                <ItemDetails>수량: {item.totalCount}</ItemDetails>
                <TotalAmount>총액: {item.totalAmount}원</TotalAmount>
              </div>
            </StTitleBox>
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
      <Totalpayment>
        <div>총 결제 금액 : {totalCartAmount}</div>
        <Button type="button" onClick={handleCheckout}>
          결제하기
        </Button>
      </Totalpayment>

      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        totalAmount={totalCartAmount}
        onConfirm={handlePaymentConfirm}
      />
    </CartListContainer>
  );
};

export default CartList;
