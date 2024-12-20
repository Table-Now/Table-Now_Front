import { MenuUpdateProps } from "../types/menu/Menu";
import { instance } from "./instance";

const getAuthHeader = () => {
  const token = sessionStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const menuApi = {
  getMenuList: async (storeId: number | undefined) => {
    const response = await instance.get(`menus/menu/${storeId}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  deleteMenu: async (menuId: number | undefined) => {
    await instance.delete(`menus/${menuId}`, {
      headers: getAuthHeader(),
    });
  },

  updateMenu: async (
    menuId: number | undefined,
    menuData: MenuUpdateProps,
    image: File | null
  ) => {
    const formData = new FormData();
    formData.append(
      "menuUpdateDto",
      new Blob([JSON.stringify(menuData)], { type: "application/json" })
    );

    if (image) {
      formData.append("image", image);
    }

    const response = await instance.put(`menus/${menuId}`, formData, {
      headers: {
        ...getAuthHeader(),
        // Content-Type 헤더를 제거 - FormData가 자동으로 설정함
      },
    });
    return response.data;
  },

  addMenu: async (
    storeId: number | undefined,
    menuData: MenuUpdateProps,
    image: File | null
  ) => {
    const formData = new FormData();
    formData.append(
      "menuCreateDto",
      new Blob([JSON.stringify({ ...menuData, storeId })], {
        type: "application/json",
      })
    );

    if (image) {
      formData.append("image", image);
    }

    const response = await instance.post(`menus/register`, formData, {
      headers: {
        ...getAuthHeader(),
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },

  reStatus: async (menuId: number | undefined) => {
    const response = await instance.put(
      `menus/${menuId}/restatus`,
      {},
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  },
};
