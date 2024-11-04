import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { storeApi } from "../api/store";
import { StoreDetailType } from "../types/stores/detail";
import styled from "styled-components";

const StoreDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [storeDetail, setStoreDetail] = useState<StoreDetailType | null>(null);

  const getStoreDetail = useCallback(async () => {
    try {
      const response = await storeApi.getStoreDetail(Number(id));
      setStoreDetail(response);
    } catch (error) {
      console.error("Failed to fetch stores:", error);
    }
  }, [id]);
  useEffect(() => {
    getStoreDetail();
    // if (id) {
    //   storeApi
    //     .getStoreDetail(Number(id))
    //     .then((data) => setStoreDetail(data))
    //     .catch((error) =>
    //       console.error("Failed to fetch store detail:", error)
    //     );
    // }
  }, [getStoreDetail]);

  if (!storeDetail) {
    return <LoadingMessage>Loading store details...</LoadingMessage>;
  }

  return (
    <DetailContainer>
      <Image
        src={storeDetail.storeImg || "/img/noimage.jpg"}
        alt={storeDetail.store}
      />
      <InfoSection>
        <Title>{storeDetail.store}</Title>
        <Description>{storeDetail.storeContents}</Description>
        <DetailRow>
          <strong>Location:</strong> {storeDetail.storeLocation}
        </DetailRow>
        <DetailRow>
          <strong>Rating:</strong> {storeDetail.rating ?? 0}
        </DetailRow>
        <DetailRow>
          <strong>Open:</strong> {storeDetail.storeOpen}
        </DetailRow>
        <DetailRow>
          <strong>Close:</strong> {storeDetail.storeClose}
        </DetailRow>
        <DetailRow>
          <strong>Week Off:</strong> {storeDetail.storeWeekOff}
        </DetailRow>
      </InfoSection>
    </DetailContainer>
  );
};

export default StoreDetail;

const DetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
`;

const Image = styled.img`
  width: 100%;
  max-width: 400px;
  border-radius: 8px;
`;

const InfoSection = styled.div`
  margin-top: 16px;
  text-align: left;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: bold;
`;

const Description = styled.p`
  font-size: 16px;
  color: #555;
`;

const DetailRow = styled.div`
  font-size: 14px;
  color: #333;
  margin: 4px 0;
`;

const LoadingMessage = styled.div`
  font-size: 18px;
  text-align: center;
  padding: 20px;
`;
