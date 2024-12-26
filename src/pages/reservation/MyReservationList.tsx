import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { myReservationListTypes } from "../../types/reservation/myList";
import { reservationApi } from "../../api/reservation";
import { useUser } from "../../hooks/useUser";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";

const MyReservationList: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [reservations, setReservations] = useState<myReservationListTypes[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const data = await reservationApi.myReservationList(user);
        setReservations(Array.isArray(data) ? data : [data]);
      } catch (error) {
        console.error("Failed to fetch reservations:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchReservations();
    }
  }, [user]);

  if (loading) {
    return (
      <Container>
        <LoadingWrapper>
          <LoadingText>예약 내역을 불러오는 중입니다...</LoadingText>
        </LoadingWrapper>
      </Container>
    );
  }

  if (!reservations.length) {
    return (
      <Container>
        <NoReservations>예약 내역이 없습니다.</NoReservations>
      </Container>
    );
  }

  const handleCardClick = (id: number | undefined) => {
    navigate(`/store/${id}`);
  };

  const handleReservationCancel = async (store: string | undefined) => {
    try {
      await reservationApi.myReservationCancel(store);
      alert("예약이 취소되었습니다.");
      window.location.reload();
    } catch (err: any) {
      alert(err.response?.data?.message);
    }
  };

  return (
    <Container>
      <Title>나의 예약 내역</Title>
      {reservations.length === 0 ? (
        <NoResults>예약된 정보가 없습니다</NoResults>
      ) : (
        <ReservationGrid>
          {reservations.map((reservation) => (
            <ReservationCard
              key={reservation.id}
              onClick={() => handleCardClick(reservation.storeId)}
            >
              <ReservationHeader>
                <StoreName>{reservation.store}</StoreName>
              </ReservationHeader>
              <ReservationInfo>
                <InfoItem>
                  <Label>인원</Label>
                  <Value>{reservation.peopleNb}명</Value>
                </InfoItem>
                <InfoItem>
                  <Label>연락처</Label>
                  <Value>{reservation.phone}</Value>
                </InfoItem>
                <InfoItem>
                  <Label>대기번호</Label>
                  <Value>{reservation.waitingNumber}</Value>
                </InfoItem>
              </ReservationInfo>

              <FullWidthButtonWrapper>
                <Button
                  onClick={() => handleReservationCancel(reservation.store)}
                >
                  예약 취소
                </Button>
              </FullWidthButtonWrapper>
            </ReservationCard>
          ))}
        </ReservationGrid>
      )}
    </Container>
  );
};

const Container = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const NoResults = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
`;

const LoadingText = styled.p`
  font-size: 1.1rem;
  color: #666;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #333;
  margin-bottom: 2rem;
  text-align: center;
`;

const ReservationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  padding: 1rem 0;
`;

const ReservationCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const ReservationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
`;

const StoreName = styled.h2`
  font-size: 1.3rem;
  color: #1a1a1a;
  margin: 0;
  font-weight: 600;
`;

const ReservationInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.2rem;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.span`
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 0.4rem;
`;

const Value = styled.span`
  font-size: 1rem;
  color: #333;
  font-weight: 500;
`;

const NoReservations = styled.div`
  text-align: center;
  padding: 3rem;
  color: #666;
  background: #f8f9fa;
  border-radius: 12px;
  font-size: 1.1rem;
  margin: 2rem auto;
  max-width: 500px;
`;

const FullWidthButtonWrapper = styled.div`
  margin-top: 10px;
  width: 100%;
  button {
    width: 100%;
  }
`;
export default MyReservationList;
