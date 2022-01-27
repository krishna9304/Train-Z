import axios from "axios";
import React, { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Config } from "./configs/server-urls";
import Auth from "./pages/Auth";
import EmailVerification from "./pages/EmailVerification";
import NotFound from "./pages/NotFound";
import { useDispatch } from "react-redux";
import { instantiateUser } from "./redux/slices/userSlice";
import Dashboard from "./pages/Dashboard";
import EditSchedule from "./pages/EditSchedule";

const App = () => {
  const state = useSelector((state) => state);
  const [{ jwt }, setCookie] = useCookies(["jwt"]);
  const dispatch = useDispatch();
  useEffect(() => {
    if (jwt)
      axios
        .post(Config.VERIFYJWT, {
          token: jwt,
        })
        .then((res) => {
          if (res.data.res) {
            dispatch(
              instantiateUser({
                userType: res.data.userinfo.userType,
                ...res.data.userinfo.user,
              })
            );
            setCookie("jwt", res.data.token);
          } else if (res.data.errs) {
            res.data.errs.forEach((err) => {
              toast(err, { type: "warning" });
            });
          }
        })
        .catch(console.error);
    return () => {};
  }, []);
  useEffect(() => {
    console.log(state);
    return () => {};
  }, [state]);
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={state.user.userDetails ? <Dashboard /> : <Auth />}
          />
          <Route path="/verifyemail" element={<EmailVerification />} />
          <Route
            path="/user/dashboard"
            element={state.user.userDetails ? <Dashboard /> : <Auth />}
          />
          <Route path="/schedule/edit" element={<EditSchedule />} />
          <Route path="/class/:id" element={<NotFound />} /> //Only for mentor
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer position="bottom-right" />
    </>
  );
};

export default App;
