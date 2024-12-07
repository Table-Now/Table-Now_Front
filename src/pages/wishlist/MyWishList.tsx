import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { wishlistApi } from "../../api/wishlist";
import { useNavigate, useParams } from "react-router-dom";
import { WishListStoreResponse } from "../../types/wishlist/wishlist";

const MyWishList = () => {
  const { user } = useParams<{ user: string }>();
  const navigate = useNavigate();
  const [heart, setHeart] = useState<WishListStoreResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setError("User not found");
      return;
    }

    const fetchWishlist = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await wishlistApi.wishlist(user);
        setHeart(data);
      } catch (err) {
        setError("Failed to fetch wishlist");
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, [user]);

  const handleCardClick = (id: number | undefined) => {
    navigate(`/store/${id}`);
  };
  return (
    <Container>
      <Title>나의 찜 목록</Title>

      {loading && (
        <LoadingWrapper>
          <LoadingText>Loading...</LoadingText>
        </LoadingWrapper>
      )}

      {error && <NoResults>{error}</NoResults>}

      {heart.length === 0 && !loading && !error ? (
        <NoResults>찜한 목록이 없습니다</NoResults>
      ) : (
        <ReservationGrid>
          {heart.map((heart) => (
            <ReservationCard
              key={heart.storeId}
              onClick={() => handleCardClick(heart.storeId)}
            >
              <ReservationHeader>
                <StoreName>{heart.store}</StoreName>
              </ReservationHeader>
              <ReservationInfo>
                <StoreImage
                  src={heart.storeImg || "/img/noimage.jpg"}
                  alt="이미지가 존재하지 않습니다."
                />
              </ReservationInfo>
            </ReservationCard>
          ))}
        </ReservationGrid>
      )}
    </Container>
  );
};

export default MyWishList;

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

const StoreImage = styled.img.attrs<{ src: string }>((props) => ({
  src: props.src || "/img/noimage.jpg",
}))`
  width: 80px;
  height: 80px;
  border-radius: 8px;
  margin-right: 1.5rem;
  object-fit: cover;
`;
