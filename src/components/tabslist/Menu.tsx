import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { menuApi } from "../../api/menu";
import { useUser } from "../../hooks/useUser";
import Button from "../Button";
import { MenuItem, MenuProps } from "../../types/menu/Menu";
import { useNavigate } from "react-router-dom";

const Menu: React.FC<MenuProps> = ({ store, detailUser }) => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [menuList, setMenuList] = useState<MenuItem[]>([]);

  const fetchData = async () => {
    try {
      const response = await menuApi.getMenuList(store);
      setMenuList(response);
    } catch (err: any) {
      console.error(err.response.data?.message);
    }
  };

  useEffect(() => {
    if (store !== undefined) {
      fetchData();
    }
  }, [store]);

  const handleMenuClick = (
    menuId: number | undefined,
    storeId: number | undefined
  ) => {
    navigate(`/menu/${menuId}`, { state: { storeId } });
  };

  return (
    <MenuContainer>
      {user === detailUser && (
        <Button to="/manager/menu/update" customProp={store}>
          메뉴 수정
        </Button>
      )}

      {menuList.length === 0 ? (
        <StTitle>메뉴를 추가해주세요</StTitle>
      ) : (
        menuList.map((menu, index) => (
          <MenuCard
            key={index}
            isSoldOut={menu.status === "STOP"}
            onClick={() => handleMenuClick(menu.id, menu.storeId)}
          >
            <MenuDetails>
              <MenuName>{menu.name}</MenuName>
              <MenuPrice>{menu.price}원</MenuPrice>
              {menu.status === "STOP" && <SoldOutText>매진</SoldOutText>}
            </MenuDetails>
            <MenuImage src={menu.image || "/img/noimage.jpg"} alt={menu.name} />
          </MenuCard>
        ))
      )}
    </MenuContainer>
  );
};

export default Menu;

const StTitle = styled.div`
  font-size: 20px;
  font-weight: bold;
  text-align: center;
`;

const MenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
`;

const MenuCard = styled.div<{ isSoldOut: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  padding: 16px;
  position: relative;
  ${(props) =>
    props.isSoldOut &&
    `
    opacity: 0.5; /* 투명도 주기 */
    pointer-events: none; /* 클릭 비활성화 */
  `}
`;

const MenuDetails = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  flex: 1;
  padding-right: 16px;
`;

const MenuName = styled.h3`
  font-size: 18px;
  margin: 0 0 8px 0;
  color: #333;
`;

const MenuPrice = styled.p`
  font-size: 16px;
  margin: 0;
  color: #777;
`;

const MenuImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 8px;
  object-fit: cover;
`;

const SoldOutText = styled.div`
  font-size: 16px;
  color: #ff4747;
  font-weight: bold;
  position: absolute;
  top: 16px;
  right: 16px;
`;
