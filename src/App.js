import { BrowserRouter, Route, Routes } from "react-router-dom";
import RouteScrollToTop from "./helper/RouteScrollToTop";
import ErrorPage from "./pages/ErrorPage";
import Dashboard from "./pages/Dashboard";
import SignIn from "./pages/Authentication/signIn";
import SignUp from "./pages/Authentication/signUp";
import AllUsers from "./pages/Users/allUsers";
import UserReward from "./pages/Users/userReward";
import AddMember from "./pages/Users/addMember";
import ForgotPassword from "./pages/Authentication/forgotPassword";
import { Toaster } from "react-hot-toast";

// console.log(process.env.REACT_APP_API_URL)

function App() {
  return (
    <BrowserRouter future={{ v7_relativeSplatPath: true }}>
      <RouteScrollToTop />
      <Routes>
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/Users/alluser' element={<AllUsers />} />
        <Route path='/Users/userReward' element={<UserReward />} />
        <Route path='/Users/addmember' element={<AddMember />} />
        <Route path='*' element={<ErrorPage />} />
        <Route path='/' element={<SignIn />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/forgotPassword' element={<ForgotPassword />} />
      </Routes>
      <Toaster/>
    </BrowserRouter>
  );
}

export default App;