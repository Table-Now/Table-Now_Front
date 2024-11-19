import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
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
import MyReservationList from "../pages/reservation/MyReservationList";

interface ProtectedRouteProps {
  element: JSX.Element;
}

const AppContent: React.FC = () => {
  const location = useLocation();
  const hideHeaderRoutes = ["/login", "/join", "/auth", "/storeregister"];

  const showHeader = !hideHeaderRoutes.includes(location.pathname);

  const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      return <Navigate to="/login" replace />;
    }
    return element;
  };

  return (
    <>
      {showHeader && <Header />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/join" element={<Join />} />
        <Route path="/" element={<StoreList />} />
        <Route
          path="/mypage"
          element={<ProtectedRoute element={<Mypages />} />}
        />
        <Route
          path="/storeregister"
          element={<ProtectedRoute element={<Storeregister />} />}
        />
        <Route path="/auth" element={<EmailAuth />} />
        <Route path="/store/:id" element={<StoreDetail />} />
        <Route
          path="/store/update/:id"
          element={<ProtectedRoute element={<StoreUpdate />} />}
        />
        <Route
          path="/store/manager/list/:user"
          element={<ProtectedRoute element={<MyStoreList />} />}
        />
        <Route
          path="/my/reservation/list/:user"
          element={<ProtectedRoute element={<MyReservationList />} />}
        />
      </Routes>
    </>
  );
};

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default AppRouter;
