import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { menuApi } from "../../../api/menu";
import { cartAPI } from "../../../api/cart"; // cartAPI import
import { MenuDetailProps, MenuProps } from "../../../types/menu/Menu";
import { useUser } from "../../../hooks/useUser";

const MenuDetail: React.FC<MenuProps> = ({ store }) => {
  const { user } = useUser();
  const { menuId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuDetail, setMenuDetail] = useState<MenuDetailProps | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const storeId = location.state?.store;

  useEffect(() => {
    const fetchMenuDetail = async () => {
      try {
        const response = await menuApi.detailMenu(Number(menuId));
        setMenuDetail(response);
      } catch (err: any) {
        console.error(err.response.data?.message);
      }
    };

    if (menuId) {
      fetchMenuDetail();
    }
  }, [menuId]);

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = async () => {
    if (!storeId || !menuDetail) {
      setError("장바구니에 추가할 메뉴 정보가 잘못되었습니다.");
      return;
    }

    setLoading(true);
    setError(null);

    // 디버깅: cartDto가 제대로 생성되는지 확인
    const cartDto = {
      menuId: Number(menuId),
      storeId: storeId,
      totalCount: quantity,
      userId: user,
    };

    try {
      const response = await cartAPI.addCart(storeId, cartDto);

      if (response) {
        alert("장바구니에 추가되었습니다!");
        navigate(-1);
      }
    } catch (err: any) {
      alert(err.response?.data.message);
      console.error("카트 추가 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!menuDetail) {
    return <div>로딩 중...</div>;
  }

  const totalPrice = menuDetail.price * quantity;

  return (
    <>
      <PageContainer>
        <DetailContainer>
          <Header>
            <BackButton onClick={() => navigate(-1)}>뒤로가기</BackButton>
          </Header>

          <ImageContainer>
            <MenuImage
              src={menuDetail.image || "/img/noimage.jpg"}
              alt={menuDetail.name}
            />
            {menuDetail.status === "STOP" && <SoldOutBadge>매진</SoldOutBadge>}
          </ImageContainer>

          <ContentSection>
            <MenuName>{menuDetail.name}</MenuName>
            <Price>{menuDetail.price.toLocaleString()}원</Price>

            <QuantitySection>
              <Label>수량</Label>
              <QuantityControl>
                <QuantityButton onClick={handleDecrease}>-</QuantityButton>
                <QuantityDisplay>{quantity}</QuantityDisplay>
                <QuantityButton onClick={handleIncrease}>+</QuantityButton>
              </QuantityControl>
            </QuantitySection>
          </ContentSection>
        </DetailContainer>

        <BottomSection>
          <TotalPriceSection>
            <OrderPrice>주문금액</OrderPrice>
            <TotalPrice>{totalPrice.toLocaleString()}원</TotalPrice>
          </TotalPriceSection>
          <OrderButton
            disabled={menuDetail.status === "STOP" || loading}
            onClick={handleAddToCart}
          >
            {loading
              ? "장바구니 추가 중..."
              : menuDetail.status === "STOP"
              ? "매진된 메뉴입니다"
              : `${totalPrice.toLocaleString()}원 담기`}
          </OrderButton>
          {error && <ErrorMessage>{error}</ErrorMessage>}{" "}
        </BottomSection>
      </PageContainer>
    </>
  );
};

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const DetailContainer = styled.div`
  max-width: 768px;
  margin: 0 auto;
  padding: 24px;
  width: 100%;
  flex: 1;
`;

const Header = styled.div`
  margin-bottom: 20px;
`;

const BackButton = styled.button`
  padding: 8px 16px;
  border: none;
  background-color: white;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 400px;
  position: relative;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    height: 300px;
  }

  @media (max-width: 450px) {
    height: 200px;
  }
`;

const MenuImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
`;

const SoldOutBadge = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: bold;
`;

const ContentSection = styled.div`
  background-color: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
`;

const MenuName = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 12px;
`;

const Price = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 24px;
`;

const QuantitySection = styled.div`
  margin-top: 20px;
`;

const Label = styled.div`
  font-size: 16px;
  color: #666;
  margin-bottom: 8px;
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  width: fit-content;
`;

const QuantityButton = styled.button`
  background: white;
  border: none;
  padding: 12px 20px;
  cursor: pointer;
  font-size: 18px;
  color: #333;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const QuantityDisplay = styled.div`
  padding: 12px 24px;
  font-size: 16px;
  border-left: 1px solid #ddd;
  border-right: 1px solid #ddd;
  min-width: 60px;
  text-align: center;
`;

const BottomSection = styled.div`
  background: white;
  padding: 20px 24px;
  border-top: 1px solid #eee;
`;

const TotalPriceSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  max-width: 768px;
  margin: 0 auto;
`;

const OrderPrice = styled.span`
  font-size: 16px;
  color: #333;
`;

const TotalPrice = styled.span`
  font-size: 20px;
  font-weight: bold;
  color: #333;
`;

const OrderButton = styled.button`
  width: 100%;
  max-width: 768px;
  margin: 16px auto 0;
  padding: 16px;
  background-color: #36b9cc;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  display: block;

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background-color: #2fa1b3;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  margin-top: 10px;
  text-align: center;
`;

export default MenuDetail;
