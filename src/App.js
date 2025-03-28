import { BrowserRouter, Route, Routes, Navigate, useSearchParams, useNavigate } from "react-router-dom";
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
import AddFundHistory from "./pages/Fund/addFundHistory";
import TranseferFund from "./pages/Fund/transeferFund";
import FundConvertHistory from "./pages/Fund/fundConvertHistory";
import FundConvert from "./pages/Fund/fundConvert";
import { Toaster } from "react-hot-toast";
import Withdrawal from "./pages/Withdrawal/withdrawal";
import WithdrawalReports from "./pages/Withdrawal/withdrawalReport";
import MemberTopup from "./pages/Topup/memberTopup";
import Orders from "./pages/Order/orders";
import RoyalityAndRewards from "./pages/RoyalityRewards/royalityAndRewards";
import Report from "./pages/Reports/report";
import NewsAndEvents from "./pages/News&Event/newsAndEvents";
import Support from "./pages/Supports/support";
import { useSelector, shallowEqual } from "react-redux";
import { useAccount } from "wagmi";
import { selectIsLoggedIn } from "./feature/auth/authSlice";
import Loader from "./components/common/Loader";
import ChatProfileLayer from "./pages/Supports/ChatProfileLayer";
import FundTransferHistory from "./pages/Fund/FundTransferHistory";
import IncomeReports from "./pages/IncomeReports";
import ViewProfile from "./pages/Users/ViewProfile";
import { useEffect } from "react";
import { setNavigate } from "./store/store";

// console.log(process.env.REACT_APP_API_URL)

const ProtectedDashboardRoute = ({ children }) => {
  const { isConnected, isConnecting } = useAccount();
  const { isLoggedIn, loading, loginByAdmin } = useSelector(state => state.auth, shallowEqual);

  // ✅ Show loader when authentication is in progress
  if (loading || isConnecting) {
    return <Loader loader="ClipLoader" color="blue" size={50} fullPage />;
  }

  // ✅ Allow access if login by user is true and user is logged in
  if (isLoggedIn && loginByAdmin) {
    console.log("Login By Admin is true and user is logged in");
    return children;
  }

  // ✅ Protect the route
  return isLoggedIn && isConnected ? children : <Navigate to="/" />;
};

const ProtectedHomeRoute = ({ children }) => {
  // const [searchParams] = useSearchParams();
  // const token = searchParams.get("impersonate");

  const { isConnected, isConnecting } = useAccount();
  const { isLoggedIn, loading, loginByAdmin } = useSelector(state => state.auth, shallowEqual);

  // if (loading || isConnecting) {
  //   return <Loader loader="ClipLoader" color="blue" size={50} fullPage />;
  // }

  if (isLoggedIn && loginByAdmin) {
    console.log("Login By Admin is true and user is logged in");
    return <Navigate to="/dashboard" />
  }
  if (isConnected === null) {
    return <Loader loader="ClipLoader" color="blue" size={50} fullPage />;
  }

  return isLoggedIn && isConnected ? <Navigate to="/dashboard" /> : children;
};


function App() {
  return (
    <BrowserRouter future={{ v7_relativeSplatPath: true }}>
      <RouteScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path='/' element={<ProtectedHomeRoute><SignIn /></ProtectedHomeRoute>} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/forgotPassword' element={<ForgotPassword />} />
        <Route path='*' element={<ErrorPage />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedDashboardRoute><Dashboard /></ProtectedDashboardRoute>} />

        <Route path='/Users'>
          <Route path='alluser' element={<ProtectedDashboardRoute><AllUsers /></ProtectedDashboardRoute>} />
          <Route path='userReward' element={<ProtectedDashboardRoute><UserReward /></ProtectedDashboardRoute>} />
          <Route path='addmember' element={<ProtectedDashboardRoute><AddMember /></ProtectedDashboardRoute>} />
          <Route path='withdrawal-report' element={<ProtectedDashboardRoute><WithdrawalReports /></ProtectedDashboardRoute>} />
        </Route>

        <Route path='/genology'>
          <Route path='direct' element={<ProtectedDashboardRoute><Direct /></ProtectedDashboardRoute>} />
          <Route path='generation' element={<ProtectedDashboardRoute><Generation /></ProtectedDashboardRoute>} />
        </Route>

        <Route path='/fund'>
          <Route path='addfund' element={<ProtectedDashboardRoute><AddFund /></ProtectedDashboardRoute>} />
          <Route path='add-fund-history' element={<ProtectedDashboardRoute><AddFundHistory /></ProtectedDashboardRoute>} />
          <Route path='transfer-fund' element={<ProtectedDashboardRoute><TranseferFund /></ProtectedDashboardRoute>} />
          <Route path='fund-transfer-history' element={<ProtectedDashboardRoute><FundTransferHistory /></ProtectedDashboardRoute>} />
          <Route path='fund-convert' element={<ProtectedDashboardRoute><FundConvert /></ProtectedDashboardRoute>} />
          <Route path='fund-convert-history' element={<ProtectedDashboardRoute><FundConvertHistory /></ProtectedDashboardRoute>} />
        </Route>

        <Route path='/withdrawal'>
          <Route path='' element={<ProtectedDashboardRoute><Withdrawal /></ProtectedDashboardRoute>} />
        </Route>

        <Route path='/income-report' element={<IncomeReports />} />

        <Route path='/upgrade'>
          <Route path='member-topup' element={<ProtectedDashboardRoute><MemberTopup /></ProtectedDashboardRoute>} />
        </Route>

        <Route path='/orders' element={<ProtectedDashboardRoute><Orders /></ProtectedDashboardRoute>} />
        <Route path='/royalty-rewards' element={<ProtectedDashboardRoute><RoyalityAndRewards /></ProtectedDashboardRoute>} />
        <Route path='/report' element={<ProtectedDashboardRoute><Report /></ProtectedDashboardRoute>} />
        <Route path='/news-events' element={<ProtectedDashboardRoute><NewsAndEvents /></ProtectedDashboardRoute>} />
        <Route path='/support' element={<ProtectedDashboardRoute><Support /></ProtectedDashboardRoute>} />
        <Route path='/chat-profile' element={<ChatProfileLayer />} />
        <Route path='/view-profile' element={<ProtectedDashboardRoute><ViewProfile /></ProtectedDashboardRoute>} />

      </Routes>
      <Toaster />
    </BrowserRouter>

  );
}

export default App;