import React, { createContext, useContext, useState, useEffect } from "react";

interface StoreContextType {
  storeId: number | null;
  setStoreId: (id: number) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [storeId, setStoreId] = useState<number | null>(() => {
    const savedId = localStorage.getItem("storeId");
    return savedId ? parseInt(savedId, 10) : null;
  });

  useEffect(() => {
    if (storeId !== null) {
      localStorage.setItem("storeId", storeId.toString());
    }
  }, [storeId]);

  return (
    <StoreContext.Provider value={{ storeId, setStoreId }}>
      {children}
    </StoreContext.Provider>
  );
};
