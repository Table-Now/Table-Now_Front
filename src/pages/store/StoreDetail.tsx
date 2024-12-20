import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { storeApi } from "../../api/store";
import { StoreDetailType } from "../../types/stores/detail";
import styled from "styled-components";
import Button from "../../components/Button";
import { useUser } from "../../hooks/useUser";
import ReservationModal from "../../components/modal/ReservationModal";
import { reservationApi } from "../../api/reservation";
import { reviewApi } from "../../api/review";
import { ReviewListTypes } from "../../types/review/Review";
import { wishlistApi } from "../../api/wishlist";
import { userApi } from "../../api/user";
import { isOpenNow, isWeekOff } from "../../util/time";
import Tabs from "../../components/Tabs";
import Home from "../../components/tabslist/Home";
import Menu from "../../components/tabslist/Menu";
import Review from "../../components/tabslist/Review";
import DetailFooter from "../../components/DetailFooter";

const StoreDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user, role } = useUser();
  const [storeDetail, setStoreDetail] = useState<StoreDetailType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isReserved, setIsReserved] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState("home");

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

  const checkLikeStatus = useCallback(async () => {
    if (user && storeDetail?.store) {
      try {
        const likeStatus = await wishlistApi.checkLike(user, storeDetail.store);
        setIsLiked(likeStatus);
      } catch (err: any) {
        console.error("Failed to check like status:", err);
      }
    }
  }, [user, storeDetail?.store]);

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

  useEffect(() => {
    getStoreDetail();
    checkReservation();
    fetchReviews();
    checkLikeStatus();
  }, [getStoreDetail, checkReservation, fetchReviews, checkLikeStatus]);

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

  const handleReviewDeleted = (deletedReviewId: number) => {
    setReviews((prevReviews) =>
      prevReviews.filter((review) => review.id !== deletedReviewId)
    );
  };
  const handleLikeToggle = async () => {
    try {
      await wishlistApi.toggleLike(user, storeDetail.store);
      setIsLiked((prevState) => !prevState);
    } catch (err: any) {
      alert(err.response?.data);
    }
  };

  const handleReservationCancel = async () => {
    try {
      await reservationApi.myReservationCancel(storeDetail?.store);
      alert("예약이 취소되었습니다.");
      window.location.reload();
    } catch (err: any) {
      alert(err.response?.data?.message);
    }
  };

  const handleReservationApproval = async () => {
    const phone = await userApi.getMyInfo(user);
    try {
      const response = await reservationApi.myReservationApproval(phone.phone);
      if (response && response.message) {
        alert(response.message);
      }
    } catch (err: any) {
      alert(err.response?.data?.message);
    }
  };

  const handlerStoreName = async () => {
    navigate(`/manager/store/list/${storeDetail.store}`);
  };

  const isStoreOpenNow = isOpenNow(
    storeDetail?.storeOpen ?? "00:00",
    storeDetail?.storeClose ?? "00:00"
  );
  const isStoreWeekOff = isWeekOff(storeDetail?.storeWeekOff ?? "");

  return (
    <>
      <DetailContainer>
        {sessionStorage.getItem("token") &&
          (role === "USER" || role == null) && (
            <ButtonBox>
              <ReservationBtn>
                <Button onClick={handleReservationAction}>
                  {isReserved ? "대기중" : "원격줄서기"}
                </Button>
                <Button onClick={handleReservationApproval}>확정하기</Button>
              </ReservationBtn>

              <Button onClick={handleReservationCancel}>예약 취소</Button>
            </ButtonBox>
          )}

        <Image
          src={storeDetail.storeImg || "/img/noimage.jpg"}
          alt={storeDetail.store}
        />

        <InfoSection>
          {sessionStorage.getItem("token") && role === "USER" && (
            <LikeButton onClick={handleLikeToggle}>
              <LikeIcon
                src={isLiked ? "/img/unlike.png" : "/img/like.png"}
                alt="Like"
              />
            </LikeButton>
          )}
          <Title>{storeDetail.store}</Title>
          <DetailRow>{storeDetail.storeLocation}</DetailRow>
          <DetailRow>{storeDetail.rating ?? 0}</DetailRow>
          <DetailRow>번호</DetailRow>
          <DetailRow>
            {isStoreWeekOff ? (
              <span
                style={{
                  color: "orange",
                  marginRight: "10px",
                  fontWeight: "bold",
                }}
              >
                휴무
              </span>
            ) : isStoreOpenNow ? (
              <span
                style={{
                  color: "green",
                  marginRight: "10px",
                  fontWeight: "bold",
                }}
              >
                영업 중
              </span>
            ) : (
              <span
                style={{
                  color: "red",
                  marginRight: "10px",
                  fontWeight: "bold",
                }}
              >
                영업 종료
              </span>
            )}
            {storeDetail.storeOpen} ~ {storeDetail.storeClose}
          </DetailRow>

          <DetailRow>
            <Label>휴무일</Label>
            {storeDetail.storeWeekOff ? (
              <div>{storeDetail.storeWeekOff}</div>
            ) : (
              <div>없음</div>
            )}
          </DetailRow>

          <Tabs activeTab={activeTab} onTabChange={setActiveTab} />

          {activeTab === "home" && <Home storeDetail={storeDetail} />}

          {activeTab === "menu" && (
            <Menu store={storeDetail.id} detailUser={storeDetail.user} />
          )}

          {activeTab === "review" && (
            <Review
              storeDetail={storeDetail.store}
              reviews={reviews}
              setReviews={setReviews}
              onReviewDeleted={handleReviewDeleted}
            />
          )}
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
        {user === storeDetail.user && (
          <>
            <ButtonBox>
              <ButtonBox2>
                <Button onClick={handlerStoreUpdate}>수정</Button>
                <Button onClick={handlerStoreDelete}>삭제</Button>
              </ButtonBox2>
              <Button onClick={handlerStoreName}>예약 명단</Button>
            </ButtonBox>
          </>
        )}
      </DetailContainer>

      <DetailFooter />
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
const ButtonBox2 = styled.div`
  display: flex;
  gap: 10px;
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
  position: relative;
`;

const Image = styled.img`
  width: 600px;
  height: 400px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 10px;
  box-shadow: 0px 8px 12px rgba(0, 0, 0, 0.2);

  @media (max-width: 768px) {
    width: 400px;
    height: 300px;
  }

  @media (max-width: 450px) {
    width: 270px;
    height: 170px;
  }
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

const LikeButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }

  &:focus {
    outline: none;
  }
`;
const LikeIcon = styled.img`
  width: 50px;
  height: 60px;
`;

const ReservationBtn = styled.div`
  display: flex;
  gap: 10px;
`;
