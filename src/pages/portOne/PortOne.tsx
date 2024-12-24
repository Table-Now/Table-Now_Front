// import React, { useState } from "react";
// import styled from "styled-components";
// import { instance } from "../../api/instance";

// const PortOneContainer = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: center;
//   height: 100vh;
//   background-color: #f4f4f4;
// `;

// const Title = styled.h1`
//   font-size: 2rem;
//   margin-bottom: 20px;
// `;

// const PaymentButton = styled.button`
//   background-color: #4caf50;
//   color: white;
//   border: none;
//   padding: 10px 20px;
//   font-size: 1.2rem;
//   cursor: pointer;
//   border-radius: 5px;
//   &:hover {
//     background-color: #45a049;
//   }
// `;

// const ErrorMessage = styled.div`
//   color: red;
//   margin-top: 20px;
// `;

// const PortOne: React.FC = () => {
//   const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   const handlePaymentRequest = async () => {
//     try {
//       // 더미 데이터를 사용한 결제 요청
//       const paymentData = {
//         orderName: "Sample Order",
//         merchantUid: "order_1234567890",
//         totalAmount: 1000,
//         buyerName: "John Doe",
//         buyerEmail: "john@example.com",
//         buyerPhone: "010-1234-5678",
//       };

//       // API 요청
//       const response = await instance.post("/payments/request", paymentData);

//       setPaymentUrl(response.data); // 서버로부터 받은 결제 URL
//     } catch (error: any) {
//       setError("결제 요청 중 오류가 발생했습니다.");
//     }
//   };

//   return (
//     <PortOneContainer>
//       <Title>PortOne 결제 시스템</Title>
//       <PaymentButton onClick={handlePaymentRequest}>결제 요청</PaymentButton>

//       {paymentUrl && (
//         <div>
//           <p>결제 페이지로 이동하려면 아래 링크를 클릭하세요:</p>
//           <a href={paymentUrl} target="_blank" rel="noopener noreferrer">
//             결제 페이지로 이동
//           </a>
//         </div>
//       )}

//       {error && <ErrorMessage>{error}</ErrorMessage>}
//     </PortOneContainer>
//   );
// };

// export default PortOne;
import React from "react";

const PortOne = () => {
  return <div>PortOne</div>;
};

export default PortOne;
