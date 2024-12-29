import { useUser } from "../../hooks/useUser";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { OrderCheck } from "../../types/cart/Cart";
import { cartAPI } from "../../api/cart";
import Button from "../../components/Button";
import { instance } from "../../api/instance";
import { useNavigate } from "react-router-dom";

const PaymentCheck = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [orderData, setOrderData] = useState<OrderCheck | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  console.log(orderData);
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

  const paymentHandler = async () => {
    if (!orderData) {
      setError("주문 데이터가 없습니다.");
      return;
    }

    if (window.IMP) {
      const IMP = window.IMP;
      IMP.init("imp62440604");

      const storeName = orderData.orderDetails?.[0]?.store || "TableNow";

      const paymentData = {
        pg: "html5_inicis",
        pay_method: orderData.payMethod,
        merchant_uid: orderData.impUid,
        name: storeName,
        amount: orderData.totalAmount,
        buyer_name: orderData.takeoutName,
        buyer_tel: orderData.takeoutPhone,
      };

      IMP.request_pay(paymentData, async (response: any) => {
        if (response.success) {
          console.log(response); // 결제 성공 시 response 확인
          try {
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

            // 1. 결제 처리
            await cartAPI.createSettle(settlementData);

            // 2. 결제 검증을 위해 imp_uid로 GET 요청
            await cartAPI.verifyPayment(response.imp_uid);
            alert("결제 및 주문이 완료되었습니다.");
            navigate("/");
          } catch (error) {
            console.error("Settlement processing failed:", error);
            alert(
              "결제는 완료되었으나 주문 처리 중 오류가 발생했습니다. 고객센터에 문의해주세요."
            );
          }
        } else {
          alert(`${response.error_msg}`);
        }
      });
    } else {
      setError("결제 서비스가 제대로 로드되지 않았습니다.");
    }
  };

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const getPaymentCheck = async () => {
      try {
        const response = await cartAPI.getOrderCheck(user);
        setOrderData(response);
      } catch (err: any) {
        setError(
          err.response?.data.message || "주문 정보를 불러오는데 실패했습니다."
        );
      } finally {
        setLoading(false);
      }
    };
    getPaymentCheck();
  }, [user]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;
  if (!orderData) return null;

  return (
    <Container>
      <Header>결제 정보</Header>
      <Section>
        <Title>테이크아웃 정보</Title>
        <Info>Name: {orderData.takeoutName}</Info>
        <Info>Phone: {orderData.takeoutPhone}</Info>
      </Section>
      <Section>
        <Title>결제 정보</Title>
        <Info>결제 방식: {orderData.payMethod}</Info>
        <Info>총 금액: {orderData.totalAmount}원</Info>
      </Section>
      <Section>
        <Title>주문 세부사항</Title>
        {orderData.orderDetails.map((detail) => (
          <OrderCard key={detail.menuId}>
            <CardInfo>매장: {detail.store}</CardInfo>
            <CardInfo>메뉴: {detail.menu}</CardInfo>
            <CardInfo>수량: {detail.menuCount}</CardInfo>
            <CardInfo>총 가격: {detail.totalPrice}원</CardInfo>
          </OrderCard>
        ))}
      </Section>

      <ButtonBox>
        <Button type="button" onClick={paymentHandler}>
          결제
        </Button>
      </ButtonBox>
    </Container>
  );
};

export default PaymentCheck;

const Container = styled.div`
  width: 90%;
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  background: #f9fafb;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Header = styled.h1`
  font-size: 1.5rem;
  color: #ff5733;
  text-align: center;
  margin-bottom: 20px;
`;

const Section = styled.div`
  margin-bottom: 20px;
`;

const Title = styled.h2`
  font-size: 1.2rem;
  color: #1f2937;
  margin-bottom: 10px;
`;

const Info = styled.p`
  font-size: 1rem;
  color: #4b5563;
  margin: 5px 0;
`;

const OrderCard = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const CardInfo = styled.p`
  font-size: 0.9rem;
  color: #374151;
  margin: 5px 0;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #2563eb;
  border-radius: 50%;
  margin: 20px auto;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const ErrorMessage = styled.div`
  text-align: center;
  color: #ef4444;
  padding: 1rem;
`;

const ButtonBox = styled.div`
  text-align: right;
  width: 100%;
`;
