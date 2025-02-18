import React, { useEffect } from 'react';
import { useAccount, useConnect } from 'wagmi';
import { Icon } from '@iconify/react/dist/iconify.js';
import { IMAGES } from "../../constants/images";
import { useDispatch, useSelector } from 'react-redux';
import { setWalletAddress } from "../../feature/wallet/walletSlice";
import { selectCurrentNetwork } from '../../feature/network/networkSlice';
import { ICON } from '../../constants/icons';
import { useSwitchChain } from 'wagmi';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { NETWORKS } from '../../feature/network/networkConfig';

const ConnectWallet = ({ setConnectWalletModal }) => {
    const dispatch = useDispatch();
    const currentNetwork = useSelector(selectCurrentNetwork);
    const { address, chainId, isConnecting, isConnected } = useAccount();
    const navigate = useNavigate();

    const { connect, connectors, status, isPending, variables, error } = useConnect()

    const { switchNetwork, data: switchNetworkData } = useSwitchChain();

    // Define handleSwitchNetwork at the top to avoid reference error
    const handleSwitchNetwork = async () => {
        if (!switchNetwork) {
            console.error("switchNetwork function is not available");
            toast.error('Network switch functionality is not available for this wallet.');
            return;
        }
        try {
            await dispatch(switchNetwork(NETWORKS.BSC_TESTNET));
            await switchNetwork(currentNetwork.CHAIN_ID);
            toast.success('Network switched successfully!');
        } catch (error) {
            console.error("Failed to switch network:", error);
            toast.error('Could not switch to the desired network. Please ensure the wallet supports this action.');
        }
    };

    // Handling the success state for wallet connection
    useEffect(() => {
        if (status === 'success' && address) {
            console.log("Wallet connected:", address);
            dispatch(setWalletAddress(address));
            setConnectWalletModal(false);

            // If the connected wallet is on the wrong network, try to switch networks
            if (chainId !== currentNetwork.CHAIN_ID) {
                console.log("Switching network to: ", currentNetwork.CHAIN_ID);
                handleSwitchNetwork();
            }
            //  else {
            //     setConnectWalletModal(false);
            //     navigate('/dashboard');
            // }
        }
    }, [status, address, chainId, currentNetwork.CHAIN_ID, dispatch, navigate, setConnectWalletModal]);

    useEffect(() => {
        if (status === 'error') {
            // console.log("error", error?.details);
            // console.log("error", error?.code);
            toast.error(error?.cause.message || "There was an issue connecting your wallet. Please try again.");
        }
    }, [status]);


    const handleConnect = async (connector) => {
        console.log("address", address)
        if (address) {
            toast.success("Wallet is already connected");
            // console.log("Wallet already connected:", address);
            return;
        }
        if (isConnecting) return;
        try {
            await connect({ connector });
        } catch (error) {
            console.error("Error connecting wallet:", error);
            toast.error("There was an issue connecting your wallet. Please try again.");
        }
    };

    const walletImages = [
        IMAGES.WALLET_IMAGES.metamask,
        IMAGES.WALLET_IMAGES.walletConnect,
    ];

    // useEffect(() => {
    //     if (isConnecting) {
    //         toast.loading('Connection already in progress, please wait...');
    //     } else {
    //         toast.dismiss();
    //     }
    // }, [isConnecting]);

    console.log("switchNetworkData", switchNetworkData);
    console.log("isConnected", isConnected);
    console.log("variables", variables);

    return (
        <div
            tabIndex="-1"
            className="flex justify-center items-center fixed inset-0 z-50 outline-none focus:outline-none backdrop-brightness-50"
        >
            <div className="mx-5">
                <div className="relative my-6 w-full min-w-[90vw] sm:min-w-[70vw] md:min-w-[50vw] lg:min-w-[400px]">
                    <div className="rounded-xl shadow-lg flex flex-col bg-white outline-none focus:outline-none w-full">
                        <div className="flex items-center justify-between border-b border-gray-300 rounded-t-xl px-3 py-4">
                            <h3 className="text-xl text-black">Connect Wallet</h3>
                            <button
                                className="bg-transparent border-0 text-white"
                                onClick={() => setConnectWalletModal(false)}
                            >
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
                                            disabled={isConnecting}
                                        >
                                            <img
                                                className="h-10 rounded-md m-2"
                                                src={walletImages[index] || "/assets/images/default-wallet.svg"}
                                                alt={connector.name}
                                            />
                                            {connector.name}
                                            {(isPending && variables.connector.name === connector.name) && ' (connecting)'}
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
