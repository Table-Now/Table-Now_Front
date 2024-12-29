import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useUser } from "../../hooks/useUser";
import { cartAPI } from "../../api/cart";

export interface SettlementData {
  menu: string;
  menuCount: number;
  totalPrice: number;
  todayAmount: number;
}

const Settlement: React.FC = () => {
  const { user } = useUser();
  const [data, setData] = useState<SettlementData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchSettlementData = async () => {
      try {
        setLoading(true);

        const response = await cartAPI.getTodaySettle(user);
        setData(response); // 데이터 저장
      } catch (err) {
        console.error("데이터를 가져오는 중 에러 발생:", err);
        setError("데이터를 가져오는 중 문제가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchSettlementData();
    }
  }, [user]);

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>{error}</p>;

  return (
    <SettlementContainer>
      <h1>오늘의 정산</h1>
      {data.length === 0 ? (
        <p>오늘 정산 데이터가 없습니다.</p>
      ) : (
        <Table>
          <thead>
            <tr>
              <th>메뉴</th>
              <th>판매량</th>
              <th>총 매출</th>
              <th>총 매출액</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.menu}</td>
                <td>{item.menuCount}</td>
                <td>{item.totalPrice.toLocaleString()} 원</td>
                <td>{item.todayAmount.toLocaleString()} 원</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </SettlementContainer>
  );
};

export default Settlement;

const SettlementContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;

  h1 {
    font-size: 24px;
    margin-bottom: 20px;
  }

  p {
    font-size: 18px;
    color: #555;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;

  th,
  td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
  }

  th {
    background-color: #f4f4f4;
    font-weight: bold;
  }

  tr:nth-child(even) {
    background-color: #f9f9f9;
  }

  tr:hover {
    background-color: #f1f1f1;
  }
`;
