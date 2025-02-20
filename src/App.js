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
import Withdrawal from "./pages/Withdrawal/withdrawal";
import ArbWithdrawal from "./pages/Withdrawal/arbWithdrawal";
import WithdrawalReports from "./pages/Withdrawal/withdrawalReport";
import DailyStack from "./pages/IncomeReports/dailyStack";
import StackSponsor from "./pages/IncomeReports/stackSponsor";
import TeamPerformance from "./pages/IncomeReports/teamPerformance";
import TeamDevelopment from "./pages/IncomeReports/teamDevelopment";
import Rewards from "./pages/IncomeReports/rewards";
import MemberTopup from "./pages/Topup/memberTopup";
import UpgradeAccount from "./pages/Topup/upgradeAccount";
import Orders from "./pages/Order/orders";
import RoyalityAndRewards from "./pages/RoyalityRewards/royalityAndRewards";
import Report from "./pages/Reports/report";
import NewsAndEvents from "./pages/News&Event/newsAndEvents";
import Support from "./pages/Supports/support";
import ChatProfileLayer from "./pages/Supports/ChatProfileLayer";

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
        <Route path='/genology/direct' element={<Direct />} />
        <Route path='/genology/generation' element={<Generation />} />
        <Route path='/fund/addfund' element={<AddFund />} />
        <Route path='/fund/addfundarb' element={<AddFundArb />} />
        <Route path='/fund/transfer-fund' element={<TranseferFund />} />
        <Route path='/fund/fund-transfer-history' element={<FundConvertHistory />} />
        <Route path='/fund/fund-convert' element={<FundConvert />} />
        <Route path='/fund/fund-convert-history' element={<FundConvertHistory />} />
        <Route path='/withdrawal' element={<Withdrawal />}/>
        <Route path='/withdrawal/arb-withdrawal' element={<ArbWithdrawal />}/>
        <Route path='/Users/withdrawal-report' element={<WithdrawalReports />}/>
        <Route path='/income/stake-reward' element={<DailyStack />}/>
        <Route path='/income/sponsor-reward' element={<StackSponsor />}/>
        <Route path='/income/reward' element={<Rewards />}/>
        <Route path='/income/performance-reward' element={<TeamPerformance />}/>
        <Route path='/income/development-reward' element={<TeamDevelopment />}/>
        <Route path='/upgrade/member-topup' element={<MemberTopup />}/>
        <Route path='/upgrade/upgrade-account' element={<UpgradeAccount />}/>
        <Route path='/orders' element={<Orders />}/>
        <Route path='/royalty-rewards' element={<RoyalityAndRewards />}/>
        <Route path='/report' element={<Report />}/>
        <Route path='/news-events' element={<NewsAndEvents />}/>
        <Route path='/support' element={<Support />}/>
        <Route path='/chat-profile' element={<ChatProfileLayer />}/>
        <Route path='*' element={<ErrorPage />} />
        <Route path='/' element={<SignIn />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/forgotPassword' element={<ForgotPassword />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;