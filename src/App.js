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
import Direct from "./pages/Genelogy/direct";
import Generation from "./pages/Genelogy/generation";
import AddFund from "./pages/Fund/addFund";
import AddFundArb from "./pages/Fund/addFundArb";
import TranseferFund from "./pages/Fund/transeferFund";
import FundConvertHistory from "./pages/Fund/fundConvertHistory";
import FundConvert from "./pages/Fund/fundConvert";
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
        <Route path='/genology/direct' element={<Direct/>}/>
        <Route path='/fund/addfundarb' element={<AddFund/>}/>
        <Route path='/fund/transfer-fund' element={<AddFundArb/>}/>
        <Route path='/fund/transfer-fund' element={<TranseferFund/>}/>
        <Route path='/fund/fund-transfer-history' element={<FundConvertHistory/>}/>
        <Route path='/fund/fund-convert' element={<FundConvert/>}/>
        <Route path='/fund/fund-convert-history' element={<FundConvertHistory/>}/>
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