const menuItems = [
  {
    title: "Dashboard",
    icon: "solar:home-smile-angle-outline",
    path: "/dashboard",
  },
  {
    title: "Users",
    icon: "flowbite:users-group-outline",
    submenu: [
      { title: "All Users", path: "/Users/alluser" },
      { title: "User Reward", path: "/Users/userReward" },
      { title: "Add Member", path: "/Users/addmember" },
    ],
  },
  {
    title: "Authentication",
    icon: "simple-line-icons:vector",
    submenu: [
      { title: "Sign In", path: "/" },
      { title: "Sign Up", path: "/signup" },
      { title: "Forgot Password", path: "/forgotPassword" },
    ],
  },
];

export default menuItems;
