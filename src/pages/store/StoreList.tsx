import React, { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import { Store, SortType } from "../../types/stores/list";
import { storeApi } from "../../api/store";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";

const StoreList: React.FC = () => {
  const navigate = useNavigate();

  const [stores, setStores] = useState<Store[]>([]);
  const [keyword, setKeyword] = useState<string>("");
  const [sortType, setSortType] = useState<SortType>("ALL");
  const [loading, setLoading] = useState(false);

  const transformStoreData = (data: any): Store => ({
    id: data.id || 0,
    user: data.user,
    title: data.store,
    location: data.storeLocation,
    imageUrl: data.storeImg || "",
    description: data.storeContents,
    rating: data.rating || 0,
    openDate: data.storeOpen,
    closeDate: data.storeClose,
    weekOff: data.storeWeekOff,
    createAt: data.createAt,
    updateAt: data.updateAt,
    latitude: data.latitude,
    longitude: data.longitude,
    distance: data.distance || 0,
  });

  const getStores = useCallback(
    async (params: {
      keyword?: string;
      sortType?: SortType;
      userLat?: number;
      userLon?: number;
    }) => {
      try {
        setLoading(true);
        const apiParams = {
          ...params,
          sortType: params.sortType === "ALL" ? undefined : params.sortType,
        };
        const response = await storeApi.getStoreList(apiParams);
        const transformedData = response.map(transformStoreData);
        setStores(transformedData);
      } catch (err: any) {
        alert(err.response?.data);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // 검색 버튼 클릭 시 호출되는 함수
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    getStores({ keyword, sortType });
  };

  // 정렬 옵션 변경 시 호출되는 함수
  const handleSortChange = async (newSortType: SortType) => {
    setSortType(newSortType);
    if (newSortType === "DISTANCE") {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            await getStores({
              keyword,
              sortType: newSortType,
              userLat: latitude,
              userLon: longitude,
            });
          },
          (error) => {
            console.error("Error getting location:", error);
            alert("위치 정보를 가져올 수 없습니다.");
          }
        );
      } else {
        alert("이 브라우저는 위치 정보를 지원하지 않습니다.");
      }
    } else {
      await getStores({ keyword, sortType: newSortType });
    }
  };

  useEffect(() => {
    getStores({});
  }, [getStores]);

  const handleCardClick = (id: number) => {
    navigate(`/store/${id}`);
  };

  return (
    <>
      {/* <StLocation>
        <LocationStatus>
          <div>내 위치 확인: </div>
          <StatusLight
            color={
              locationStatus === "SUCCESS"
                ? "성공"
                : locationStatus === "ERROR"
                ? "실패"
                : "blue"
            }
          />
        </LocationStatus>
      </StLocation> */}
      <SearchSection>
        <SearchForm onSubmit={handleSearch}>
          <SearchInput
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="상점 검색..."
          />
          <Button type="submit">검색</Button>
        </SearchForm>
      </SearchSection>
      <SortSelect
        value={sortType}
        onChange={(e) => handleSortChange(e.target.value as SortType)}
      >
        <option value="ALL">전체</option>
        <option value="DISTANCE">거리순</option>
        <option value="RATING_HIGH">평점 높은순</option>
        <option value="RATING_LOW">평점 낮은순</option>
      </SortSelect>

      <ListContainer>
        {loading ? (
          <LoadingMessage>로딩 중...</LoadingMessage>
        ) : stores.length === 0 ? (
          <NoResults>검색 결과가 없습니다.</NoResults>
        ) : (
          stores.map((store) => (
            <StoreItem key={store.id} onClick={() => handleCardClick(store.id)}>
              <StoreImage
                src={store.imageUrl || "/img/noimage.jpg"}
                alt={store.title}
              />
              <StoreInfo>
                <StoreTitle>{store.title}</StoreTitle>
                {/* <StoreDescription>{store.description}</StoreDescription> */}
                <StoreDescription>{store.location}</StoreDescription>
                <DateInfo>
                  <span>Open: {store.openDate}</span> |{" "}
                  <span>Close: {store.closeDate}</span>
                </DateInfo>
                {/* {store.distance && (
                  <DistanceInfo>
                    거리: {store.distance.toFixed(1)}km
                  </DistanceInfo>
                )} */}
              </StoreInfo>
            </StoreItem>
          ))
        )}
      </ListContainer>
    </>
  );
};

export default StoreList;

const SearchSection = styled.div`
  display: flex;
  gap: 1rem;
  margin: 20px;
  align-items: center;
`;

const SearchForm = styled.form`
  display: flex;
  gap: 0.5rem;
  flex: 1;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const SortSelect = styled.select`
  margin: 0 0 20px 20px;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
`;

const NoResults = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
`;

const StoreItem = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #f0f0f0;
  }
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

const StoreInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const StoreTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0;
  color: #333;
`;

const StoreDescription = styled.p`
  margin: 0.5rem 0;
  color: #666;
  font-size: 0.95rem;
`;

const DateInfo = styled.div`
  font-size: 0.85rem;
  color: #999;
  margin-top: 0.5rem;
`;
