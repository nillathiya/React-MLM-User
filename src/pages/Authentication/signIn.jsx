import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAccount, useDisconnect, useChainId } from 'wagmi';
import { writeContract, waitForTransactionReceipt, readContract } from '@wagmi/core';
import { config } from '../../config/wagmiConfig';
import ConnectWallet from '../../components/wallet/ConnectWallet';
import { useDispatch, useSelector } from 'react-redux';
import {
  checkWalletAsync,
  userLoginAsync,
  selectUserExists,
} from '../../feature/auth/authSlice';
import { registerNewUserAsync, checkSponsorAsync, getCompanyInfoAsync } from '../../feature/user/userSlice';
import { createUserWalletAsync } from '../../feature/wallet/walletSlice';
import toast from 'react-hot-toast';
import Loader from '../../components/common/Loader';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { parseUnits } from 'viem';
import { contractAbi } from '../../ABI/contractAbi';
import { abi as usdtAbi } from '../../ABI/usdtAbi';

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const userExists = useSelector(selectUserExists);
  const { companyInfo } = useSelector((state) => state.user);

  // State
  const [connectWalletModal, setConnectWalletModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sponsorId, setSponsorId] = useState(searchParams.get('ref') || '');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentStage, setPaymentStage] = useState(null);
  const [isSponsorValid, setIsSponsorValid] = useState(searchParams.get('ref') ? true : false);
  const [checkingSponsor, setCheckingSponsor] = useState(false);
  const [error, setError] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [hasCheckedWallet, setHasCheckedWallet] = useState(false);

  const TUSDT_ADDRESS = companyInfo?.TOKEN_CONTRACT;
  const FEES_CONTRACT_ADDRESS = companyInfo?.BSCADDRESS;
  const AMOUNT = parseUnits('1', 18);

  // Fetch company info on mount
  useEffect(() => {
    dispatch(getCompanyInfoAsync())
      .unwrap()
      .then((result) => {
        console.log('getCompanyInfoAsync Response:', result);
      })
      .catch((err) => {
        console.error('getCompanyInfoAsync Error:', err);
        toast.error('Failed to fetch company info: ' + (err.message || 'Unknown error'));
      });
  }, [dispatch]);

  // Log companyInfo to verify contract addresses
  useEffect(() => {
    console.log('Company Info:', companyInfo);
  }, [companyInfo]);

  // Check wallet on connection (only once)
  useEffect(() => {
    if (isConnected && address && !hasCheckedWallet && !loading) {
      setLoading(true);
      dispatch(checkWalletAsync({ wallet: address }))
        .unwrap()
        .then((result) => {
          console.log('checkWalletAsync Response:', result);
          setHasCheckedWallet(true);
        })
        .catch((err) => {
          console.error('checkWalletAsync Error:', err);
          toast.error('Failed to check wallet: ' + (err.message || 'Unknown error'));
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isConnected, address, dispatch, hasCheckedWallet]);

  // Validate sponsor ID
  useEffect(() => {
    if (!searchParams.get('ref') && sponsorId) {
      setCheckingSponsor(true);
      dispatch(checkSponsorAsync(sponsorId))
        .unwrap()
        .then((result) => {
          console.log('checkSponsorAsync Response:', result);
          setIsSponsorValid(result.data.valid === true);
          if (!result.data.valid) {
            toast.error('Invalid Sponsor ID');
          }
        })
        .catch((error) => {
          console.error('checkSponsorAsync Error:', error);
          setIsSponsorValid(false);
          toast.error('Error checking Sponsor ID: ' + (error.message || 'Unknown error'));
        })
        .finally(() => {
          setCheckingSponsor(false);
        });
    }
  }, [sponsorId, dispatch, searchParams]);

  const handleLogin = async () => {
    if (!address) return;
    setLoading(true);
    try {
      const result = await dispatch(userLoginAsync({ wallet: address })).unwrap();
      console.log('userLoginAsync Response:', result);
      if (result.status === 'success') {
        localStorage.setItem(`userToken_${result.data.user._id}`, result.data.token);
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('userLoginAsync Error:', err);
      setError(err.message || 'Login failed');
      toast.error(err.message || 'Login failed');
      disconnect();
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentAndRegister = async () => {
    if (!address || !sponsorId || !email || !phoneNumber || !isSponsorValid) {
      setError('Please fill all fields with a valid Sponsor ID and connect wallet');
      toast.error('Please fill all fields with a valid Sponsor ID and connect wallet');
      return;
    }
    if (!termsAccepted) {
      setError('Please accept the Terms & Conditions');
      toast.error('Please accept the Terms & Conditions');
      return;
    }
    if (chainId !== 97) {
      setError('Please switch to BSC Testnet');
      toast.error('Please switch to BSC Testnet');
      return;
    }
    if (!TUSDT_ADDRESS || !FEES_CONTRACT_ADDRESS) {
      setError('Contract addresses are not configured correctly');
      toast.error('Contract addresses are not configured correctly');
      console.error('Invalid contract addresses:', { TUSDT_ADDRESS, FEES_CONTRACT_ADDRESS });
      return;
    }

    setLoading(true);
    try {
      // Check USDT balance
      console.log('Checking balance for:', { TUSDT_ADDRESS, address });
      const usdtBalance = await readContract(config, {
        address: TUSDT_ADDRESS,
        abi: usdtAbi,
        functionName: 'balanceOf',
        args: [address],
      });
      console.log('USDT Balance:', usdtBalance.toString());
      if (usdtBalance < AMOUNT) {
        setError('Insufficient USDT balance');
        toast.error('Insufficient USDT balance');
        return;
      }

      // Approve tUSDT
      setPaymentStage('approving');
      const approveHash = await writeContract(config, {
        address: TUSDT_ADDRESS,
        abi: usdtAbi,
        functionName: 'approve',
        args: [FEES_CONTRACT_ADDRESS, AMOUNT],
      });
      console.log('Approve Hash:', approveHash);
      await waitForTransactionReceipt(config, { hash: approveHash });
      toast.success('Allowance approved!');

      // Deposit to fees contract
      setPaymentStage('depositing');
      const depositHash = await writeContract(config, {
        address: FEES_CONTRACT_ADDRESS,
        abi: contractAbi,
        functionName: 'deposit',
        args: [AMOUNT],
      });
      console.log('Deposit Hash:', depositHash);
      await waitForTransactionReceipt(config, { hash: depositHash });
      toast.success('Payment successful!');

      // Register user
      await handleRegister(depositHash);
    } catch (error) {
      let message = 'Transaction failed';
      if (error?.message?.includes('User rejected')) {
        message = 'Transaction rejected by user';
      } else if (error?.cause?.message?.includes('User rejected')) {
        message = 'Transaction rejected by user';
      } else if (error?.shortMessage) {
        message = error.shortMessage;
      } else if (error.message.includes('invalid opcode')) {
        message = 'Invalid contract or network configuration. Please check contract address and network.';
      }
      console.error('Payment Error:', error);
      setError(message);
      toast.error(message);
      disconnect();
    } finally {
      setLoading(false);
      setPaymentStage(null);
    }
  };

  const handleRegister = async (depositHash) => {
    const payload = {
      wallet: address,
      sponsorUsername: sponsorId,
      email,
      phoneNumber,
      hash: depositHash,
    };
    console.log('Register Payload:', payload);
    try {
      const registerResponse = await dispatch(registerNewUserAsync(payload)).unwrap();
      console.log('Register Response:', registerResponse);

      const loginResponse = await dispatch(userLoginAsync({ wallet: address })).unwrap();
      console.log('Login Response:', loginResponse);
      if (loginResponse.status === 'success') {
        const userId = loginResponse.data.user._id;
        localStorage.setItem(`userToken_${userId}`, loginResponse.data.token);
        await dispatch(createUserWalletAsync(userId)).unwrap();
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Registration Error:', err);
      setError(err.message || 'Registration failed');
      toast.error(err.message || 'Registration failed');
      disconnect();
    }
  };

  const isFormComplete = sponsorId && name && email && phoneNumber && isSponsorValid && termsAccepted;

  return (
    <section className='auth bg-base d-flex flex-wrap'>
      <div className='auth-left d-lg-block d-none'>
        <div className='d-flex align-items-center flex-column h-100 justify-content-center'>
          <img src='assets/images/auth/auth-img.png' alt='' />
        </div>
      </div>
      <div className='auth-right py-32 px-24 d-flex flex-column justify-content-center'>
        <div className='max-w-464-px mx-auto w-100'>
          <div>
            <Link to='/' className='mb-40 max-w-290-px'>
              <img src='assets/images/logo.png' alt='' />
            </Link>
            <h4 className='mb-12'>Sign Up with Wallet</h4>
            <p className='mb-32 text-secondary-light text-lg'>
              Connect your wallet to create an account
            </p>
          </div>
          {error && <p className='text-danger mb-16'>{error}</p>}
          {loading || checkingSponsor ? (
            <div className='flex flex-col items-center justify-center gap-2 my-2 w-full'>
              <Loader loader='ClipLoader' color='blue' size={40} />
              <span className='text-blue-600 font-semibold text-lg text-center animate-pulse'>
                {checkingSponsor
                  ? 'Checking Sponsor ID...'
                  : paymentStage === 'approving'
                  ? 'Approving tUSDT...'
                  : paymentStage === 'depositing'
                  ? 'Processing Payment...'
                  : 'Please Wait for Authentication...'}
              </span>
            </div>
          ) : (
            <>
              {!isConnected || !address ? (
                <button
                  onClick={() => setConnectWalletModal(true)}
                  className='btn btn-primary text-sm btn-sm px-12 py-16 w-100 radius-12'
                >
                  Connect Wallet
                </button>
              ) : userExists ? (
                <button
                  onClick={handleLogin}
                  className='btn btn-primary text-sm btn-sm px-12 py-16 w-100 radius-12'
                >
                  Login
                </button>
              ) : (
                <form onSubmit={(e) => e.preventDefault()}>
                  <div className='icon-field mb-16'>
                    <span className='icon top-50 translate-middle-y'>
                      <Icon icon='f7:person' />
                    </span>
                    <input
                      type='text'
                      value={sponsorId}
                      onChange={(e) => !searchParams.get('ref') && setSponsorId(e.target.value)}
                      disabled={searchParams.get('ref') || isSponsorValid}
                      className='form-control h-56-px bg-neutral-50 radius-12'
                      placeholder='Sponsor ID (Referral)'
                    />
                  </div>
                  <div className='icon-field mb-16'>
                    <span className='icon top-50 translate-middle-y'>
                      <Icon icon='mage:email' />
                    </span>
                    <input
                      type='email'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className='form-control h-56-px bg-neutral-50 radius-12'
                      placeholder='Email'
                    />
                  </div>
                  <div className='icon-field mb-16'>
                    <span className='icon top-50 translate-middle-y'>
                      <Icon icon='mage:user' />
                    </span>
                    <input
                      type='text'
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className='form-control h-56-px bg-neutral-50 radius-12'
                      placeholder='Name'
                    />
                  </div>
                  <div className='icon-field mb-16'>
                    <span className='icon top-50 translate-middle-y'>
                      <Icon icon='mdi:phone' />
                    </span>
                    <PhoneInput
                      international
                      defaultCountry='US'
                      value={phoneNumber}
                      onChange={setPhoneNumber}
                      className='form-control h-56-px bg-neutral-50 radius-12'
                    />
                  </div>
                  <div className='mb-20'>
                    <div className='form-check style-check d-flex align-items-start'>
                      <input
                        className='form-check-input border border-neutral-300 mt-4'
                        type='checkbox'
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        id='condition'
                      />
                      <label className='form-check-label text-sm' htmlFor='condition'>
                        By creating an account, you agree to the
                        <Link to='#' className='text-primary-600 fw-semibold'>
                          Terms & Conditions
                        </Link>{' '}
                        and our
                        <Link to='#' className='text-primary-600 fw-semibold'>
                          Privacy Policy
                        </Link>
                      </label>
                    </div>
                  </div>
                  <button
                    onClick={handlePaymentAndRegister}
                    disabled={!isFormComplete}
                    className={`btn btn-primary text-sm btn-sm px-12 py-16 w-100 radius-12 mt-32 ${
                      !isFormComplete ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    Register (1 USDT)
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
      {connectWalletModal && (
        <ConnectWallet setConnectWalletModal={setConnectWalletModal} />
      )}
    </section>
  );
};

export default SignUp;