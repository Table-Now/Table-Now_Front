import { BrowserRouter, Routes, Route } from "react-router-dom";
import Join from "../pages/Join";
import StoreList from "../pages/StoreList";
import Login from "../pages/Login";
import Header from "../common/Header";
import Mypages from "../pages/Mypages";
import EmailAuth from "../pages/EmailAuth";
import Storeregister from "../pages/Storeregister";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/join" element={<Join />} />
        <Route
          path="/"
          element={
            <>
              <Header />
              <StoreList />
            </>
          }
        />

        <Route
          path="/mypage"
          element={
            <>
              <Header />
              <Mypages />
            </>
          }
        />

        <Route
          path="/storeregister"
          element={
            <>
              <Header />
              <Storeregister />
            </>
          }
        />

        <Route
          path="/auth"
          element={
            <>
              <Header />
              <EmailAuth />
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
