import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { managerStoreApi } from "../../api/store";
import { useUser } from "../../hooks/useUser";
import { ManagerStoreList } from "../../types/stores/list";

const MyStoreList: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [stores, setStores] = useState<ManagerStoreList[]>([]);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        if (user) {
          const response = await managerStoreApi.storeList(user);
          setStores(response);
        }
      } catch (error) {
        console.error("Error fetching stores:", error);
      }
    };

    fetchStores();
  }, [user]);

  const handleCardClick = (user: string) => {
    navigate(`/store/${user}`);
  };

  return (
    <Container>
      <Title>내 상점 목록</Title>
      <StoreGrid>
        {stores.map((store) => (
          <StoreCard
            key={store.store}
            onClick={() => handleCardClick(store.store)}
          >
            <StoreImage
              src={store.storeImg || "/img/noimage.jpg"}
              alt={store.store}
            />
            <StoreInfo>
              <StoreName>{store.store}</StoreName>
              <StoreLocation>{store.storeLocation}</StoreLocation>
              <StoreRating>평점: {store.rating}</StoreRating>
              <StoreHours>
                영업시간: {store.storeOpen} - {store.storeClose}
              </StoreHours>
              <StoreWeekOff>휴무일: {store.storeWeekOff}</StoreWeekOff>
            </StoreInfo>
          </StoreCard>
        ))}
      </StoreGrid>
    </Container>
  );
};

export default MyStoreList;

// Styled components
const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #333;
  margin-bottom: 2rem;
  text-align: center;
`;

const StoreGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
`;

const StoreCard = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
  }
`;

const StoreImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const StoreInfo = styled.div`
  padding: 1rem;
`;

const StoreName = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 0.5rem;
`;

const StoreLocation = styled.p`
  font-size: 1rem;
  color: #666;
  margin-bottom: 0.5rem;
`;

const StoreRating = styled.p`
  font-size: 1rem;
  color: #f39c12;
  margin-bottom: 0.5rem;
`;

const StoreHours = styled.p`
  font-size: 0.9rem;
  color: #777;
  margin-bottom: 0.25rem;
`;

const StoreWeekOff = styled.p`
  font-size: 0.9rem;
  color: #777;
`;
