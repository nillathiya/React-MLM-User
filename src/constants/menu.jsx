const menuItems = [
  {
    title: "Dashboard",
    icon: "material-symbols:dashboard-outline",
    path: "/dashboard",
  },
  {
    title: "My Genelogy",
    icon: "mdi:family-tree",
    submenu: [
      {
        title: "Direct",
        path: "/genology/direct",
        icon: "mdi:account-arrow-right-outline",
      },
      {
        title: "Generation",
        path: "/genology/generation",
        icon: "mdi:timeline-clock-outline",
      },
    ],
  },
  {
    title: "Fund",
    icon: "mdi:cash-multiple",
    submenu: [
      { title: "Add Fund", path: "/fund/addfund", icon: "mdi:cash-plus" },
      {
        title: "Transfer Fund",
        path: "/fund/transfer-fund",
        icon: "mdi:bank-transfer",
      },
      {
        title: "Fund Transfer History",
        path: "/fund/fund-transfer-history",
        icon: "mdi:history",
      },
      {
        title: "Fund Convert",
        path: "/fund/fund-convert",
        icon: "mdi:swap-horizontal",
      },
      {
        title: "Fund Convert History",
        path: "/fund/fund-convert-history",
        icon: "mdi:history",
      },
    ],
  },
  {
    title: "Withdrawal",
    icon: "mdi:bank-outline",
    submenu: [
      { title: "Withdrawal", path: "/withdrawal", icon: "mdi:cash-remove" },
      {
        title: "ARB Withdrawal",
        path: "/withdrawal/arb-withdrawal",
        icon: "mdi:currency-eth",
      },
      {
        title: "Withdrawal Report",
        path: "/Users/withdrawal-report",
        icon: "mdi:clipboard-list-outline",
      },
    ],
  },
  {
    title: "Upgrade",
    icon: "mdi:account-star-outline",
    submenu: [
      {
        title: "Member Topup",
        path: "/upgrade/member-topup",
        icon: "mdi:account-arrow-up-outline",
      },
      {
        title: "Upgrade Account",
        path: "/upgrade/upgrade-account",
        icon: "mdi:arrow-up-bold",
      },
    ],
  },
  {
    title: "Income Reports",
    icon: "mdi:chart-line",
    submenu: [
      {
        title: "Daily Stake Reward",
        path: "/income/stake-reward",
        icon: "mdi:chart-bar",
      },
      {
        title: "Stake Sponsor Reward",
        path: "/income/sponsor-reward",
        icon: "mdi:gift-outline",
      },
      {
        title: "Team Performance Reward",
        path: "/income/performance-reward",
        icon: "mdi:account-group-outline",
      },
      { title: "Reward", path: "/income/reward", icon: "mdi:medal-outline" },
      {
        title: "Team Development Reward",
        path: "/income/development-reward",
        icon: "mdi:account-group",
      },
    ],
  },
  {
    title: "Orders",
    icon: "mdi:cart-outline",
    path: "/orders",
  },
  {
    title: "Royalty & Rewards",
    icon: "mdi:crown-outline",
    path: "/royalty-rewards",
  },
  {
    title: "Report",
    icon: "mdi:file-chart-outline",
    path: "/report",
  },
  {
    title: "News & Events",
    icon: "mdi:newspaper-variant-outline",
    path: "/news-events",
  },
  {
    title: "Support",
    icon: "mdi:headset",
    path: "/support",
  },
  {
    title: "Logout",
    icon: "mdi:logout",
    path: "/logout",
  },
];

export default menuItems;
