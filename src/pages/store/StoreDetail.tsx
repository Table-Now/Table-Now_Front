import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { storeApi } from "../../api/store";
import { StoreDetailType } from "../../types/stores/detail";
import styled from "styled-components";
import Button from "../../components/Button";
import { useUser } from "../../hooks/useUser";
import ReservationModal from "../../components/modal/ReservationModal";
import { reservationApi } from "../../api/reservation";

const StoreDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user, role } = useUser();
  const [storeDetail, setStoreDetail] = useState<StoreDetailType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isReserved, setIsReserved] = useState<boolean>(false);

  const getStoreDetail = useCallback(async () => {
    try {
      const response = await storeApi.getStoreDetail(Number(id));

      setStoreDetail(response);
    } catch (err: any) {
      alert(err.response?.data);
      navigate("/");
    }
  }, [id]);

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

  useEffect(() => {
    getStoreDetail();
    checkReservation();
  }, [getStoreDetail, checkReservation]);

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

  return (
    <DetailContainer>
      {user === storeDetail.user && (
        <ButtonBox>
          <Button onClick={handlerStoreUpdate}>수정</Button>
          <Button onClick={handlerStoreDelete}>삭제</Button>
        </ButtonBox>
      )}
      {(role === "USER" || role == null) && (
        <ButtonBox>
          <Button onClick={handleReservationAction}>
            {isReserved ? "예약 중" : "예약하기"}
          </Button>
        </ButtonBox>
      )}

      <Image
        src={storeDetail.storeImg || "/img/noimage.jpg"}
        alt={storeDetail.store}
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
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.1);
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
