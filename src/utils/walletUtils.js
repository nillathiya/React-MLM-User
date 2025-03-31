export const getWalletBalance = (userWallet, key) => {
    if (!userWallet || typeof userWallet !== "object") return 0; 
    return userWallet[key] || 0; 
};
