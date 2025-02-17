import React from 'react';
import { useAccount, useConnect } from 'wagmi';
import { Icon } from '@iconify/react/dist/iconify.js';
import { IMAGES } from "../../constants/images";
import { useDispatch, useSelector } from 'react-redux';
import { setWalletAddress } from "../../feature/wallet/walletSlice";
import { selectCurrentNetwork } from '../../feature/network/networkSlice';
import { ICON } from '../../constants/icons';
import { useSwitchChain } from 'wagmi';
import { useNavigate } from 'react-router-dom';

const ConnectWallet = ({ setConnectWalletModal }) => {
    const dispatch = useDispatch();
    const currentNetwork = useSelector(selectCurrentNetwork);
    const { address, chainId } = useAccount();
    const navigate = useNavigate();

    const { connect, connectors, isLoading, pendingConnector } = useConnect({
        onSuccess(data) {
            dispatch(setWalletAddress(data.account));
            setConnectWalletModal(false);
            navigate('/dashboard');

            // Switch to the correct network after successful connection
            if (chainId !== currentNetwork.CHAIN_ID) {
                switchNetwork(currentNetwork.CHAIN_ID);
            }
        }
    });

    const { switchNetwork } = useSwitchChain(); // Destructure correctly here

    const handleConnect = async (connector) => {
        try {
            await connect({ connector });
            console.log("current network", currentNetwork.CHAIN_ID);
            if (chainId !== currentNetwork.CHAIN_ID) {
                // Check if the switchNetwork function is available
                if (switchNetwork) {
                    await switchNetwork(currentNetwork.CHAIN_ID);
                } else {
                    console.error("switchNetwork function is not available");
                }
            }
        } catch (error) {
            console.error("Error connecting wallet:", error);
            alert("There was an issue connecting your wallet. Please try again.");
        }
    };

    const walletImages = [
        IMAGES.WALLET_IMAGES.metamask,
        IMAGES.WALLET_IMAGES.walletConnect
    ];

    return (
        <div tabIndex="-1" className="flex justify-center items-center fixed inset-0 z-50 outline-none focus:outline-none backdrop-brightness-50">
            <div className="mx-5">
                <div className="relative my-6 w-full min-w-[90vw] sm:min-w-[70vw] md:min-w-[50vw] lg:min-w-[400px]">
                    <div className="rounded-xl shadow-lg flex flex-col bg-white outline-none focus:outline-none w-full">
                        <div className="flex items-center justify-between p-4 border-b border-gray-300 rounded-t-xl px-5">
                            <h3 className="text-xl text-black">Connect Wallet</h3>
                            <button className="bg-transparent border-0 text-white" onClick={() => setConnectWalletModal(false)}>
                                <Icon icon={ICON.CLOSE} className="text-black" width="24" height="24" />
                            </button>
                        </div>

                        <div className="p-3 py-5 flex flex-col justify-center">
                            <div className="flex-initial w-full p-2">
                                {connectors?.length > 0 ? (
                                    connectors.map((connector, index) => (
                                        <button
                                            key={connector.id}
                                            onClick={() => handleConnect(connector)}
                                            className="flex h-14 items-center rounded-xl my-3 w-full border hover:bg-customGray transition duration-300"
                                        >
                                            <img
                                                className="h-10 rounded-md m-2"
                                                src={walletImages[index] || "/assets/images/default-wallet.svg"}
                                                alt={connector.name}
                                            />
                                            {connector.name}
                                            {isLoading && pendingConnector?.id === connector.id && ' (connecting)'}
                                        </button>
                                    ))
                                ) : (
                                    <p className="text-center text-gray-500">No wallet connectors available</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConnectWallet;
