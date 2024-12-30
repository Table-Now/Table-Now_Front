import React, { useEffect, useState } from "react";
import { cartAPI } from "../../api/cart";
import styled from "styled-components";
import { useUser } from "../../hooks/useUser";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import { OrderType } from "../../types/cart/Cart";

interface CartItem {
  id: number;
  userId: string;
  menuId: number;
  storeId: number;
  storeName: string;
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

const ItemStore = styled.div`
  font-size: 20px;
  font-weight: 800;
  color: #333;
  margin-bottom: 0.5rem;
`;

const ItemTitle = styled.h3`
  font-size: 16px;
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
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  margin-top: 20px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const TotalAmountText = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: #333;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  label {
    font-size: 16px;
    color: #555;
  }

  input {
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 5px;
    outline: none;
    transition: all 0.3s ease-in-out;

    &:focus {
      border-color: #007bff;
    }
  }
`;

const CartList: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [takeoutName, setTakeoutName] = useState<string>("");
  const [takeoutPhone, setTakeoutPhone] = useState<string>("");

  useEffect(() => {
    const loadScript = (src: string) => {
      return new Promise<void>((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => resolve();
        script.onerror = (error) => reject(error);
        document.body.appendChild(script);
      });
    };

    const loadScripts = async () => {
      try {
        await loadScript("https://code.jquery.com/jquery-3.6.0.min.js");
        await loadScript("https://cdn.iamport.kr/js/iamport.payment-1.1.8.js");
      } catch (error) {
        console.error("스크립트 로딩 중 오류 발생", error);
      }
    };

    loadScripts();
  }, []);

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
      const cartDto = {
        id: cartItem.id,
        userId: cartItem.userId,
        menuId: cartItem.menuId,
        storeId: cartItem.storeId,
        totalCount: cartItem.totalCount,
        totalAmount: cartItem.totalAmount,
      };

      await cartAPI.updateCart(user, cartDto);
      fetchCartItems();
    } catch (error) {
      console.error("카트 수정 중 오류 발생", error);
      setError("카트 수정 중 오류가 발생했습니다.");
    }
  };

  const totalCartAmount = cartItems.reduce(
    (sum, item) => sum + item.totalAmount,
    0
  );

  const paymentHandler = async () => {
    const uniqueId = `orders_${Date.now()}`;

    const orderData = {
      takeoutName,
      takeoutPhone,
      totalAmount: totalCartAmount,
      payMethod: "CARD",
      orderDetails: cartItems.map((item) => ({
        store: item.storeName,
        menuId: item.menuId,
        menu: item.menu,
        menuCount: item.totalCount,
        totalPrice: item.totalAmount,
      })),
    };

    if (window.IMP) {
      const IMP = window.IMP;
      IMP.init("imp62440604");

      const paymentData = {
        pg: "html5_inicis",
        pay_method: orderData.payMethod,
        merchant_uid: uniqueId,
        name: cartItems[0]?.storeName || "매장 정보 없음",
        amount: orderData.totalAmount,
        buyer_name: orderData.takeoutName,
        buyer_tel: orderData.takeoutPhone,
      };

      IMP.request_pay(paymentData, async (response: any) => {
        if (response.success) {
          try {
            const createOrderDetails = cartItems.map((item) => ({
              store: item.storeName,
              menuId: item.menuId,
              menu: item.menu,
              menuCount: item.totalCount,
              totalPrice: item.totalAmount,
            }));

            const createOrderPayload: OrderType = {
              totalAmount: totalCartAmount,
              payMethod: "CARD",
              orderDetails: createOrderDetails,
              takeoutName: takeoutName,
              takeoutPhone: takeoutPhone,
              uuid: uniqueId,
            };

            const settlementData = {
              settlementDetails: orderData.orderDetails.map((detail) => ({
                storeName: detail.store,
                menu: detail.menu,
                menuCount: detail.menuCount,
                totalPrice: detail.totalPrice,
              })),
              takeoutName: orderData.takeoutName,
              takeoutPhone: orderData.takeoutPhone,
              totalAmount: orderData.totalAmount,
            };

            await cartAPI.createOrder(createOrderPayload);
            // 결제 처리 및 결제 검증
            await cartAPI.createSettle(settlementData);
            await cartAPI.verifyPayment(response.imp_uid);

            alert("결제 및 주문이 완료되었습니다.");
            navigate("/");
          } catch (error) {
            console.error("결제 처리 중 오류 발생", error);
            alert("결제는 완료되었으나 주문 처리 중 오류가 발생했습니다.");
          }
        } else {
          alert(`${response.error_msg}`);
        }
      });
    } else {
      setError("결제 서비스가 제대로 로드되지 않았습니다.");
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
            <StTitleBox>
              <StImg src={item.image || "/img/noimage.jpg"} />
              <div>
                <ItemStore>매장: {item.storeName}</ItemStore>
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
        <TotalAmountText>총 결제 금액 : {totalCartAmount}원</TotalAmountText>
        <InputWrapper>
          <div>
            <label>
              주문자
              <input
                type="text"
                value={takeoutName}
                onChange={(e) => setTakeoutName(e.target.value)}
                placeholder="주문자명을 입력하세요"
                style={{ marginLeft: "10px" }}
              />
            </label>
          </div>
          <div>
            <label>
              핸드폰
              <input
                type="text"
                value={takeoutPhone}
                onChange={(e) => setTakeoutPhone(e.target.value)}
                placeholder="010-1234-1234"
                style={{ marginLeft: "10px" }}
              />
            </label>
          </div>
        </InputWrapper>
        <Button
          type="button"
          onClick={paymentHandler}
          disabled={!takeoutName || !takeoutPhone}
        >
          결제하기
        </Button>
      </Totalpayment>
    </CartListContainer>
  );
};

export default CartList;
