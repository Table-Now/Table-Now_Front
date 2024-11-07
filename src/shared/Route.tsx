import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Join from "../pages/user/Join";
import StoreList from "../pages/store/StoreList";
import Login from "../pages/user/Login";
import Header from "../common/Header";
import Mypages from "../pages/user/Mypages";
import EmailAuth from "../pages/user/EmailAuth";
import Storeregister from "../pages/store/Storeregister";
import StoreDetail from "../pages/store/StoreDetail";
import StoreUpdate from "../pages/store/StoreUpdate";
import MyStoreList from "../pages/store/MyStoreList";
import Testing from "../pages/Testing";

const AppContent = () => {
  const location = useLocation();
  const hideHeaderRoutes = ["/login", "/join"];

  const showHeader = !hideHeaderRoutes.includes(location.pathname);

  return (
    <>
      {showHeader && <Header />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/join" element={<Join />} />
        <Route path="/" element={<StoreList />} />
        <Route path="/mypage" element={<Mypages />} />
        <Route path="/storeregister" element={<Storeregister />} />
        <Route path="/auth" element={<EmailAuth />} />
        <Route path="/store/:id" element={<StoreDetail />} />
        <Route path="/store/update/:id" element={<StoreUpdate />} />
        <Route path="/store/manager/list/:user" element={<MyStoreList />} />
        <Route path="/test/page" element={<Testing />} />
      </Routes>
    </>
  );
};

const AppRouter = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default AppRouter;
