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
import FundTranseferHistory from "./pages/Fund/fundTranseferHistory";
import DailyStack from "./pages/IncomeReports/dailyStack";
import StackSponsor from "./pages/IncomeReports/stackSponsor";
import TeamPerformance from "./pages/IncomeReports/teamPerformance";
import Rewards from "./pages/IncomeReports/rewards";
import TeamDevelopment from "./pages/IncomeReports/teamDevelopment";
import Withdrawal from "./pages/Withdrawal/withdrawal";
import WithdrawalReports from "./pages/Withdrawal/withdrawalReport";
import ArbWithdrawal from "./pages/Withdrawal/arbWithdrawal";

function App() {
  return (
    <BrowserRouter>
      <RouteScrollToTop />
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/genology/direct" element={<Direct />} />
        <Route path="/genology/generation" element={<Generation />} />
        <Route path="/fund/addfund" element={<AddFund />} />
        <Route path="/fund/addfundarb" element={<AddFundArb />} />
        <Route path="/fund/transfer-fund" element={<TranseferFund />} />
        <Route
          path="/fund/fund-transfer-history"
          element={<FundTranseferHistory />}
        />
        <Route path="/fund/fund-convert" element={<FundConvert />} />
        <Route
          path="/fund/fund-convert-history"
          element={<FundConvertHistory />}
        />
        <Route path="/withdrawal" element={<Withdrawal />} />
        <Route path="/withdrawal/arb-withdrawal" element={<ArbWithdrawal />} />
        <Route
          path="/withdrawal/withdrawal-report"
          element={<WithdrawalReports />}
        />
        <Route path="/income/daily-stake-reward" element={<DailyStack />} />
        <Route path="/income/stack-sponsor-reward" element={<StackSponsor />} />
        <Route
          path="/income/team-performance-reward"
          element={<TeamPerformance />}
        />
        <Route path="/income/reward" element={<Rewards />} />
        <Route
          path="/income/team-development-reward"
          element={<TeamDevelopment />}
        />
        <Route path="*" element={<ErrorPage />} />
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
