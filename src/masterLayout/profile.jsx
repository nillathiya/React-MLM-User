import React, { useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useEnsAvatar, useEnsName } from "wagmi";
import { Icon } from "@iconify/react/dist/iconify.js";
import { ICON } from "../constants/icons";

const Profile = ({ handleChild }) => {
  const { address, connector, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName });
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (isConnected === true) {
      handleChild(true);
    }
  }, [isConnected, handleChild]);

  // Function to handle copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(address).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  // Function to truncate address
  const truncateAddress = (str, length = 12) => {
    return str ? `${str.slice(0, length)}...${str.slice(-4)}` : "";
  };

  return (
    <div className="profile-container py-4">
      {isConnected ? (
        <div className="flex flex-col items-center">
          {ensAvatar ? (
            <>
              <img
                src={ensAvatar || "/assets/images/default-avatar.png"}
                alt="ENS Avatar"
                className="w-20 h-20 rounded-full border-2 border-gray-300"
              />
            </>
          ) : (
            <>
              <Icon
                icon={ICON.DEFAULT_USER}
                width="24"
                height="24"
                className="w-16 h-16 rounded-full border-2 border-gray-300 text-[#31358e]"
              />
            </>
          )}

          <div className="mt-2 text-lg font-semibold text-primary-800">
            {ensName
              ? `${ensName} (${truncateAddress(address)})`
              : truncateAddress(address)}
          </div>
          <div className="mt-1 text-sm text-gray-600">
            Connected to {connector.name}
          </div>
          <div className="flex items-center mt-2">
            <button onClick={handleCopy}>
              <Icon icon={ICON.COPY} className="text-xl text-gray-600" />
            </button>
            {isCopied && (
              <span className="ml-2 text-green-500 text-sm">Copied!</span>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <p className="text-gray-500">No wallet connected</p>
          {/* {error && <div className="text-red-500 mt-2">{error.message}</div>} */}
        </div>
      )}
    </div>
  );
};

export default Profile;
