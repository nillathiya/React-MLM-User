import React from "react";
import Navbar from "../../components/home/Navbar";
import MainSection from "../../components/home/MainSection";
import WhoWeAre from "../../components/home/WhoWeAre";
import HowItWorks from "../../components/home/HowItWorks";
import MarketOpportunity from "../../components/home/MarketOpportunity";
import DelegatorsProfits from "../../components/home/DelegatorsProfits";
function Home() {
  return (
    <div>
      <Navbar />
      <MainSection />
      <WhoWeAre />
      <HowItWorks />
      <MarketOpportunity />
      <DelegatorsProfits />
    </div>
  );
}

export default Home;
