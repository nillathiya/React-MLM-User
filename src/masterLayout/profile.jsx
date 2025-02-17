import React, { useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useEnsAvatar, useEnsName } from "wagmi";
import { Icon } from "@iconify/react/dist/iconify.js";
import { ICON } from "../constants/icons";

const Profile = ({ handleChild }) => {
  const { address, connector, isConnected } = useAccount();
  const { data: ensAvatar } = useEnsAvatar({ addressOrName: address });
  const { data: ensName } = useEnsName({ address });
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const { disconnect } = useDisconnect();

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
      setTimeout(() => setIsCopied(false), 2000); // Reset copied state after 2 seconds
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
          <img
            src={ensAvatar || "/assets/images/default-avatar.png"}
            alt="ENS Avatar"
            className="w-20 h-20 rounded-full border-2 border-gray-300"
          />
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
          <button
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            onClick={disconnect}
          >
            Disconnect
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <p className="text-gray-500">No wallet connected</p>
          {connectors?.map((connector, index) => (
            <button
              key={connector.id}
              onClick={() => connect({ connector })}
              className="mt-3 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              {isLoading && pendingConnector?.id === connector.id
                ? "Connecting..."
                : connector.name}
            </button>
          ))}
          {/* {error && <div className="text-red-500 mt-2">{error.message}</div>} */}
        </div>
      )}
    </div>
  );
};

export default Profile;
