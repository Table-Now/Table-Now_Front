import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { menuApi } from "../../api/menu";

// 메뉴 아이템 타입 정의
interface MenuItem {
  image: string;
  name: string;
  price: string;
}

// Props 타입 정의
interface MenuProps {
  store: number | undefined;
}

const Menu: React.FC<MenuProps> = ({ store }) => {
  const [menuList, setMenuList] = useState<MenuItem[]>([]);

  const fetchData = async () => {
    try {
      const response = await menuApi.getMenuList(store);
      setMenuList(response);
    } catch (err: any) {
      alert(err.response?.data || "메뉴를 불러오는 데 실패했습니다.");
    }
  };

  useEffect(() => {
    if (store !== undefined) {
      fetchData();
    }
  }, [store]);

  return (
    <MenuContainer>
      {menuList.map((menu, index) => (
        <MenuCard key={index}>
          <MenuDetails>
            <MenuName>{menu.name}</MenuName>
            <MenuPrice>{menu.price}원</MenuPrice>
          </MenuDetails>
          <MenuImage src={menu.image} alt={menu.name} />
        </MenuCard>
      ))}
    </MenuContainer>
  );
};

export default Menu;

// Styled Components
const MenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
`;

const MenuCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  padding: 16px;
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
