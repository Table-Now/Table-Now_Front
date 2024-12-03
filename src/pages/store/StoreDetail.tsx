import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { storeApi } from "../../api/store";
import { StoreDetailType } from "../../types/stores/detail";
import styled from "styled-components";
import Button from "../../components/Button";
import { useUser } from "../../hooks/useUser";
import ReservationModal from "../../components/modal/ReservationModal";
import { reservationApi } from "../../api/reservation";
import ReviewForm from "../review/ReviewForm";
import ReviewList from "../review/ReviewList";
import { reviewApi } from "../../api/review";
import { ReviewListTypes } from "../../types/review/Review";
import { wishlistApi } from "../../api/wishlist";
import KakaoMap from "../../components/KakaoMap";

const StoreDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user, role } = useUser();
  const [storeDetail, setStoreDetail] = useState<StoreDetailType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isReserved, setIsReserved] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(false);

  const [reviews, setReviews] = useState<ReviewListTypes[]>([]);

  const getStoreDetail = useCallback(async () => {
    try {
      const response = await storeApi.getStoreDetail(Number(id));

      setStoreDetail(response);
    } catch (err: any) {
      alert(err.response?.data);
      navigate("/");
    }
  }, [id, navigate]);

  const checkReservation = useCallback(async () => {
    if (user && id) {
      try {
        const reservationStatus = await reservationApi.reservationCheck({
          user,
          id: Number(id),
        });
        setIsReserved(reservationStatus);
      } catch (err: any) {
        console.error("Failed to check reservation status:", err);
      }
    }
  }, [user, id]);

  const fetchReviews = useCallback(async () => {
    if (storeDetail?.store) {
      try {
        const data = await reviewApi.getReview(storeDetail.store);
        setReviews(data);
      } catch (error: any) {
        alert(error.response?.data);
      }
    }
  }, [storeDetail?.store]);

  // 좋아요 상태 조회
  const fetchLikeStatus = useCallback(async () => {
    try {
      const result = await wishlistApi.isLiked(Number(id));
      setIsLiked(result);
    } catch (err: any) {
      console.error("Failed to fetch like status:", err);
    }
  }, [id]);

  useEffect(() => {
    getStoreDetail();
    checkReservation();
    fetchReviews();
    fetchLikeStatus(); // 페이지 로드 시 좋아요 상태 조회
  }, [getStoreDetail, checkReservation, fetchReviews, fetchLikeStatus]);

  if (!storeDetail) {
    return <LoadingMessage>Loading store details...</LoadingMessage>;
  }

  const handlerStoreUpdate = () => {
    navigate(`/store/update/${id}`);
  };

  const handlerStoreDelete = async () => {
    try {
      await storeApi.deleteStore(Number(id));
      alert("상점이 삭제되었습니다.");
      navigate("/");
    } catch (err: any) {
      alert(err.response?.data);
    }
  };

  const openReservationModal = () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      alert("로그인을 진행해주세요");
      navigate("/login");
    } else {
      setIsModalOpen(true);
    }
  };

  const handleReservationAction = () => {
    if (isReserved) {
      navigate(`/my/reservation/list/${user}`);
    } else {
      openReservationModal();
    }
  };

  const closeReservationModal = () => {
    setIsModalOpen(false);
  };

  const handleReviewSubmitted = (newReview: ReviewListTypes) => {
    setReviews((prevReviews) => [newReview, ...prevReviews]);
  };
  const handleReviewDeleted = (deletedReviewId: number) => {
    setReviews((prevReviews) =>
      prevReviews.filter((review) => review.id !== deletedReviewId)
    );
  };

  const handleLikeToggle = async () => {
    try {
      const result = await wishlistApi.toggleLike(Number(id));
      setIsLiked(result); // 좋아요 상태 업데이트
    } catch (err: any) {
      alert(err.response?.data);
    }
  };

  return (
    <>
      <DetailContainer>
        {user === storeDetail.user && (
          <ButtonBox>
            <Button onClick={handlerStoreUpdate}>수정</Button>
            <Button onClick={handlerStoreDelete}>삭제</Button>
          </ButtonBox>
        )}
        {sessionStorage.getItem("token") &&
          (role === "USER" || role == null) && (
            <ButtonBox>
              <Button onClick={handleReservationAction}>
                {isReserved ? "대기중" : "원격줄서기"}
              </Button>
            </ButtonBox>
          )}

        <Image
          src={storeDetail.storeImg || "/img/noimage.jpg"}
          alt={storeDetail.store}
        />

        <KakaoMap
          latitude={storeDetail.latitude}
          longitude={storeDetail.longitude}
          storeName={storeDetail.store}
        />

        <InfoSection>
          <Title>{storeDetail.store}</Title>
          <Description>{storeDetail.storeContents}</Description>
          <DetailRow>
            <Label>Location:</Label> {storeDetail.storeLocation}
          </DetailRow>
          <DetailRow>
            <Label>Rating:</Label> {storeDetail.rating ?? 0}
          </DetailRow>
          <DetailRow>
            <Label>Open:</Label> {storeDetail.storeOpen}
          </DetailRow>
          <DetailRow>
            <Label>Close:</Label> {storeDetail.storeClose}
          </DetailRow>
          <DetailRow>
            <Label>Week Off:</Label> {storeDetail.storeWeekOff}
          </DetailRow>

          <TitleRow>
            {sessionStorage.getItem("token") && role === "USER" && (
              <LikeButton onClick={handleLikeToggle}>
                <LikeIcon
                  src={isLiked ? "/img/unlike.png" : "/img/like.png"}
                  alt="Like"
                />
              </LikeButton>
            )}
          </TitleRow>
        </InfoSection>

        <ReservationModal
          isOpen={isModalOpen}
          onClose={closeReservationModal}
          storeName={storeDetail?.store ?? ""}
          user={user ?? ""}
          storeOpen={storeDetail?.storeOpen ?? ""}
          storeClose={storeDetail?.storeClose ?? ""}
          storeWeekOff={storeDetail?.storeWeekOff ?? ""}
        />
      </DetailContainer>

      {sessionStorage.getItem("token") && (
        <ReviewForm
          store={storeDetail.store ?? ""}
          onReviewSubmitted={handleReviewSubmitted}
        />
      )}

      <ReviewList reviews={reviews} onReviewDeleted={handleReviewDeleted} />
    </>
  );
};

export default StoreDetail;

const ButtonBox = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin: 10px 0;
`;
const DetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 50px auto;
  width: 95%;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.4);
  position: relative; /* 추가 */
`;

const Image = styled.img`
  width: 100%;
  max-width: 400px;
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
`;

const InfoSection = styled.div`
  margin-top: 16px;
  text-align: left;
  width: 100%;
  max-width: 600px;
  color: #333;
`;

const Title = styled.h2`
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin-bottom: 12px;
`;

const Description = styled.p`
  font-size: 16px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 16px;
`;

const DetailRow = styled.div`
  font-size: 15px;
  color: #444;
  margin: 8px 0;
  display: flex;
  align-items: center;
`;

const Label = styled.span`
  font-weight: 600;
  color: #333;
  margin-right: 8px;
  min-width: 80px;
`;

const LoadingMessage = styled.div`
  font-size: 18px;
  text-align: center;
  padding: 20px;
  color: #888;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const LikeButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  transition: transform 0.2s ease;
  position: absolute; /* 수정 */
  bottom: 10px; /* 오른쪽 아래로 배치 */
  right: 10px; /* 오른쪽 아래로 배치 */

  &:hover {
    transform: scale(1.1);
  }

  &:focus {
    outline: none;
  }
`;

const LikeIcon = styled.img`
  width: 100px;
  height: 100px;
  transition: filter 0.2s ease;
`;
