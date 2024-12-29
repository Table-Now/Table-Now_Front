import React, { useEffect, useState } from "react";
import { useUser } from "../../hooks/useUser";
import { cartAPI } from "../../api/cart";
import styled from "styled-components";

interface OrderDetail {
  menuId: number;
  menu: string;
  store: string;
  menuCount: number;
  totalPrice: number;
}

interface PaymentData {
  orderDetails: OrderDetail[];
  payMethod: string;
  takeoutName: string;
  takeoutPhone: string;
  totalAmount: number;
  impUid: string;
  status: string;
}

const PaymentDetails = () => {
  const { user } = useUser();
  const [paymentData, setPaymentData] = useState<PaymentData[]>([]);

  const fetchData = async () => {
    try {
      const response = await cartAPI.getPaymentDetails(user);
      setPaymentData(response);
    } catch (error) {
      console.error("주문 확인 데이터 가져오기 실패:", error);
    }
  };

  const handleCancelPayment = (impUid: string | null) => {
    if (impUid) {
      console.log(`결제 취소 요청: ${impUid}`);
      // 결제 취소 로직을 여기에 추가
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  return (
    <Container>
      <h2>결제 내역</h2>
      {paymentData.length > 0 ? (
        paymentData.map((payment, index) => (
          <PaymentCard key={index}>
            <PaymentInfo>
              <h3>주문자: {payment.takeoutName}</h3>
              <p>전화번호: {payment.takeoutPhone}</p>
              <p>결제 금액: {payment.totalAmount} 원</p>
              <p>결제 방법: {payment.payMethod}</p>
            </PaymentInfo>
            <OrderDetailsTable>
              <thead>
                <tr>
                  <th>메뉴</th>
                  <th>상점</th>
                  <th>수량</th>
                  <th>총 금액</th>
                </tr>
              </thead>
              <tbody>
                {payment.orderDetails.map((detail, idx) => (
                  <tr key={idx}>
                    <td>{detail.menu}</td>
                    <td>{detail.store}</td>
                    <td>{detail.menuCount}</td>
                    <td>{detail.totalPrice} 원</td>
                  </tr>
                ))}
              </tbody>
            </OrderDetailsTable>
            {payment.status !== "CANCEL" && (
              <CancelButton onClick={() => handleCancelPayment(payment.impUid)}>
                결제 취소
              </CancelButton>
            )}
          </PaymentCard>
        ))
      ) : (
        <p>결제 내역이 없습니다.</p>
      )}
    </Container>
  );
};

export default PaymentDetails;

const Container = styled.div`
  padding: 20px;
  max-width: 900px;
  margin: 0 auto;
`;

const PaymentCard = styled.div`
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const PaymentInfo = styled.div`
  margin-bottom: 20px;
  h3 {
    margin: 0;
    font-size: 1.5rem;
  }
  p {
    margin: 5px 0;
    font-size: 1rem;
  }
`;

const OrderDetailsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;

  th,
  td {
    padding: 10px;
    border: 1px solid #ddd;
    text-align: left;
  }

  th {
    background-color: #f0f0f0;
  }

  td {
    background-color: #fff;
  }
`;

const CancelButton = styled.button`
  padding: 10px 20px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  &:hover {
    background-color: #c0392b;
  }
`;
