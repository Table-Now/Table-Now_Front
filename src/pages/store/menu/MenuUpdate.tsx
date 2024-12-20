import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { MenuItem, MenuUpdateProps } from "../../../types/menu/Menu";
import { menuApi } from "../../../api/menu";
import Button from "../../../components/Button";
import MenuUpdateModal from "../../../components/modal/MenuUpdateModal";
import MenuAddModal from "../../../components/modal/MenuAddModal";

const MenuUpdate = () => {
  const location = useLocation();
  const store = location.state?.customProp;

  const [menuList, setMenuList] = useState<MenuItem[]>([]);

  const [selectedMenu, setSelectedMenu] = useState<MenuItem | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      const response = await menuApi.getMenuList(store);
      setMenuList(response);
    } catch (err: any) {
      console.error(err.response?.data?.message);
    }
  };

  const handleDelete = async (menuId: number | undefined) => {
    try {
      await menuApi.deleteMenu(menuId);
      setMenuList((prevMenuList) =>
        prevMenuList.filter((menu) => menu.id !== menuId)
      );
      alert("메뉴가 삭제되었습니다.");
    } catch (err: any) {
      alert(err.response?.message);
    }
  };

  useEffect(() => {
    if (store !== undefined) {
      fetchData();
    }
  }, [store]);

  const getStatusLabel = (status: string | undefined) => {
    switch (status) {
      case "STOP":
        return "매진";
      default:
        return "판매중";
    }
  };

  const handleAddMenu = async (
    menuData: MenuUpdateProps,
    image: File | null
  ) => {
    try {
      await menuApi.addMenu(store, menuData, image);
      await fetchData();
      setIsAddModalOpen(false);
      alert("메뉴가 등록되었습니다.");
    } catch (error) {
      console.error("메뉴 등록 실패:", error);
      alert("메뉴 등록에 실패했습니다.");
    }
  };

  const handleUpdateClick = (menu: MenuItem) => {
    setSelectedMenu(menu);
  };

  const handleCloseModal = () => {
    setSelectedMenu(null);
  };

  const handleUpdate = async (
    menuId: number | undefined,
    menuData: MenuUpdateProps,
    image: File | null
  ) => {
    try {
      await menuApi.updateMenu(menuId, menuData, image);
      await fetchData(); // 목록 새로고침
      alert("메뉴가 수정되었습니다.");
    } catch (error) {
      console.error("메뉴 수정 실패:", error);
      alert("메뉴 수정에 실패했습니다.");
    }
  };

  return (
    <>
      <MenuList>
        <Button onClick={() => setIsAddModalOpen(true)}>메뉴 추가</Button>
        {menuList.map((menu) => (
          <MenuItemRow key={menu.id}>
            <MenuImage src={menu.image || "/img/noimage.jpg"} alt={menu.name} />
            <MenuDetails>
              <MenuName>{menu.name}</MenuName>
              <MenuPrice>{menu.price} 원</MenuPrice>
              <MenuStatus>{getStatusLabel(menu.status)}</MenuStatus>
            </MenuDetails>
            <ButtonBox>
              <Button onClick={() => handleDelete(menu.id)}>삭제</Button>
              <Button onClick={() => handleUpdateClick(menu)}>수정</Button>
            </ButtonBox>
          </MenuItemRow>
        ))}
      </MenuList>

      {selectedMenu && (
        <MenuUpdateModal
          menu={selectedMenu}
          onClose={handleCloseModal}
          onUpdate={handleUpdate}
        />
      )}

      {isAddModalOpen && (
        <MenuAddModal
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddMenu}
        />
      )}
    </>
  );
};

export default MenuUpdate;

const MenuList = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 1rem;
`;

const MenuItemRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const MenuImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 1rem;
`;

const MenuDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const MenuName = styled.h3`
  font-size: 1.2rem;
  margin: 0;
`;

const MenuPrice = styled.p`
  font-size: 1rem;
  color: #555;
`;

const MenuStatus = styled.p`
  font-size: 0.9rem;
  color: #888;
`;

const ButtonBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;
