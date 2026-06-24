import { useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import useGetCity from "./hooks/useGetCity";
import useGetCurrentUser from "./hooks/useGetCurrentUser";
import useGetItemsByCity from "./hooks/useGetItemsByCity";
import useGetMyShop from "./hooks/useGetMyShop";
import useGetShopByCity from "./hooks/useGetShopByCity";
import AddItem from "./pages/AddItem";
import CreateEditShop from "./pages/createEditShop";
import EditItem from "./pages/EditItem";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import SignIn from "./pages/signIn";
import SignUp from "./pages/signUp";
export const serverUrl = "http://localhost:8000";

const App = () => {
  useGetCurrentUser();
  useGetItemsByCity();
  useGetMyShop();
  useGetCity();
  useGetShopByCity();

  const { userData } = useSelector((state) => state.user);
  return (
    <Routes>
      <Route
        path="/signup"
        element={!userData ? <SignUp /> : <Navigate to={"/"} />}
      />

      <Route
        path="/signin"
        element={!userData ? <SignIn /> : <Navigate to={"/"} />}
      />

      <Route
        path="/forgot-password"
        element={!userData ? <ForgotPassword /> : <Navigate to={"/"} />}
      />

      <Route
        path="/"
        element={userData ? <Home /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/create-edit-shop"
        element={userData ? <CreateEditShop /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/add-item"
        element={userData ? <AddItem /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/edit-item/:itemId"
        element={userData ? <EditItem /> : <Navigate to={"/signin"} />}
      />
    </Routes>
  );
};

export default App;
