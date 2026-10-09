import React, { useState, useEffect } from 'react';
import {
  X,
  User as UserIcon,
  Briefcase,
  ShieldCheck,
  Lock,
  Mail,
  Phone,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Sparkles,
  KeyRound,
  ArrowLeft,
  RefreshCw,
  Loader2,
  Inbox,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MANAGER_CREDENTIALS } from '../data/initialData';

export const AuthModal: React.FC = () => {
  const {
    authModalOpen,
    setAuthModalOpen,
    authModalDefaultTab,
    currentUser,
    loginUser,
    signupUser,
    loginWithGoogle,
    loginEmployee,
    loginManager,
    employees,
    pendingAction,
    sendPasswordResetOtp,
    verifyResetOtp,
    resetPasswordAndLogin,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'user' | 'employee' | 'manager'>(
    authModalDefaultTab || 'user'
  );

  // User form states
  const [userMode, setUserMode] = useState<'signin' | 'signup'>('signin');
  const [userName, setUserName] = useState('');
  const [userEmailOrId, setUserEmailOrId] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userPassword, setUserPassword] = useState('');

  // Password Recovery via Email OTP states
  const [isForgotFlow, setIsForgotFlow] = useState(false);
  const [recoveryStep, setRecoveryStep] = useState<1 | 2 | 3>(1);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryOtp, setRecoveryOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isResendingOtp, setIsResendingOtp] = useState(false);
  const [isSubmittingRecovery, setIsSubmittingRecovery] = useState(false);

  // Employee form states
  const [employeeId, setEmployeeId] = useState('');
  const [employeePassword, setEmployeePassword] = useState('');

  // Manager form states
  const [managerUserId, setManagerUserId] = useState('');
  const [managerPassword, setManagerPassword] = useState('');

  // UI helpers
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [googlePromptOpen, setGooglePromptOpen] = useState(false);
  const [googleEmailInput, setGoogleEmailInput] = useState('');
  const [googleNameInput, setGoogleNameInput] = useState('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState('');

  // Complete credential wipe function - clears all inputs across all roles
  const clearAllFields = () => {
    setUserName('');
    setUserEmailOrId('');
    setUserPhone('');
    setUserPassword('');
    setEmployeeId('');
    setEmployeePassword('');
    setManagerUserId('');
    setManagerPassword('');
    setIsForgotFlow(false);
    setRecoveryStep(1);
    setRecoveryEmail('');
    setRecoveryOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setShowPassword(false);
    setErrorMessage('');
    setSuccessMessage('');
    setGooglePromptOpen(false);
    setGoogleEmailInput('');
    setGoogleNameInput('');
    setIsGoogleLoading(false);
    setGoogleError('');
  };

  // Every time the Auth modal opens or closes, start with completely blank input fields
  useEffect(() => {
    clearAllFields();
    if (authModalDefaultTab) {
      setActiveTab(authModalDefaultTab);
    }
  }, [authModalOpen, authModalDefaultTab]);

  // When any user logs out (currentUser becomes null) or session changes, wipe all internal credentials
  useEffect(() => {
    clearAllFields();
  }, [currentUser]);

  // When switching tabs between roles, immediately clear all form input fields
  const handleTabChange = (tab: 'user' | 'employee' | 'manager') => {
    setActiveTab(tab);
    clearAllFields();
  };

  // 60-second countdown for Resend OTP in Step 2
  useEffect(() => {
    let interval: any = null;
    if (isForgotFlow && recoveryStep === 2 && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isForgotFlow, recoveryStep, resendTimer]);

  if (!authModalOpen) return null;

  const resetMessages = () => {
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleStartForgotPassword = () => {
    setIsForgotFlow(true);
    setRecoveryStep(1);
    setRecoveryEmail(userEmailOrId || '');
    setRecoveryOtp('');
    setNewPassword('');
    setConfirmPassword('');
    resetMessages();
  };

  const handleBackToLogin = () => {
    clearAllFields();
  };

  const handleSendRecoveryOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    const cleanEmail = recoveryEmail.trim().toLowerCase();
    if (!cleanEmail) {
      setErrorMessage('Please enter your registered email address.');
      return;
    }
    setIsSendingOtp(true);
    try {
      const res = await sendPasswordResetOtp(cleanEmail);
      if (res.success) {
        setRecoveryStep(2);
        setResendTimer(60);
        setSuccessMessage('OTP sent successfully to your registered email address.');
      } else {
        setErrorMessage(res.message || 'Failed to send email. Please check your network or try again.');
      }
    } catch {
      setErrorMessage('Failed to send email. Please check your network or try again.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    resetMessages();
    const cleanEmail = recoveryEmail.trim().toLowerCase();
    setIsResendingOtp(true);
    try {
      const res = await sendPasswordResetOtp(cleanEmail);
      setResendTimer(60);
      if (res.success) {
        setSuccessMessage('OTP sent successfully to your registered email address.');
      } else {
        setErrorMessage(res.message || 'Failed to send email. Please check your network or try again.');
      }
    } catch {
      setResendTimer(60);
      setErrorMessage('Failed to send email. Please check your network or try again.');
    } finally {
      setIsResendingOtp(false);
    }
  };

  const handleVerifyOtpStep = (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    const cleanOtp = recoveryOtp.trim();
    if (!cleanOtp) {
      setErrorMessage('Please enter the 6-digit OTP code.');
      return;
    }
    if (cleanOtp.length < 6) {
      setErrorMessage('OTP must be exactly 6 digits.');
      return;
    }
    const res = verifyResetOtp(recoveryEmail, cleanOtp);
    if (res.success) {
      setRecoveryStep(3);
      resetMessages();
    } else {
      setErrorMessage(res.message);
    }
  };

  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    if (!newPassword.trim() || !confirmPassword.trim()) {
      setErrorMessage('Please enter and confirm your new password.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify both fields.');
      return;
    }
    if (newPassword.length < 4) {
      setErrorMessage('New password must be at least 4 characters long.');
      return;
    }

    setIsSubmittingRecovery(true);
    const res = resetPasswordAndLogin(recoveryEmail, recoveryOtp, newPassword);
    setIsSubmittingRecovery(false);

    if (res.success) {
      setSuccessMessage('Password reset successful! You are now logged in.');
      clearAllFields();
      setTimeout(() => {
        setAuthModalOpen(false);
      }, 900);
    } else {
      setErrorMessage(res.message);
    }
  };

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    if (userMode === 'signup') {
      if (!userName.trim() || !userEmailOrId.trim() || !userPassword.trim()) {
        setErrorMessage('Please fill in all required fields (Name, Email/User ID, Password).');
        return;
      }
      if (userPassword.length < 4) {
        setErrorMessage('Password should be at least 4 characters long.');
        return;
      }
      const res = signupUser(userName, userEmailOrId, userPhone, userPassword);
      if (res.success) {
        setSuccessMessage(res.message);
        clearAllFields();
        setTimeout(() => setAuthModalOpen(false), 900);
      } else {
        setErrorMessage(res.message);
      }
    } else {
      // User signin
      if (!userEmailOrId.trim() || !userPassword.trim()) {
        setErrorMessage('Please enter both User ID/Email and Password.');
        return;
      }
      const res = loginUser(userEmailOrId, userPassword);
      if (res.success) {
        setSuccessMessage(res.message);
        clearAllFields();
        setTimeout(() => setAuthModalOpen(false), 800);
      } else {
        setErrorMessage(res.message);
      }
    }
  };

  const handleEmployeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    if (!employeeId.trim() || !employeePassword.trim()) {
      setErrorMessage('Please enter both Employee ID and Password.');
      return;
    }
    const res = loginEmployee(employeeId, employeePassword);
    if (res.success) {
      setSuccessMessage(res.message);
      clearAllFields();
      setTimeout(() => setAuthModalOpen(false), 800);
    } else {
      setErrorMessage(res.message);
    }
  };

  const handleManagerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    if (!managerUserId.trim() || !managerPassword.trim()) {
      setErrorMessage('Invalid credentials.');
      return;
    }

    // STRICT VALIDATION: ONLY arun.prakash.45 and Arun@0999
    const cleanId = managerUserId.trim();
    if (cleanId !== MANAGER_CREDENTIALS.userId || managerPassword !== MANAGER_CREDENTIALS.password) {
      setErrorMessage('Access Denied: Invalid Manager credentials.');
      return;
    }

    const res = loginManager(managerUserId, managerPassword);
    if (res.success) {
      setSuccessMessage(res.message);
      clearAllFields();
      setTimeout(() => setAuthModalOpen(false), 800);
    } else {
      setErrorMessage(res.message);
    }
  };

  const handleGoogleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setGoogleError('');
    const email = googleEmailInput.trim().toLowerCase();
    if (!email) {
      setGoogleError('Please enter your Google email address.');
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      setGoogleError('Please enter a valid Google email address.');
      return;
    }
    setIsGoogleLoading(true);
    setTimeout(() => {
      const name = googleNameInput.trim() || email.split('@')[0];
      loginWithGoogle({
        name,
        email,
      });
      setIsGoogleLoading(false);
      clearAllFields();
      setAuthModalOpen(false);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col relative my-auto">
        {/* Top Header */}
        <div className="bg-[#071A33] text-white p-5 relative border-b border-white/10">
          <button
            onClick={() => {
              clearAllFields();
              setAuthModalOpen(false);
            }}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl font-black italic tracking-tight">
              Bharat<span className="text-[#FFB703]">Kart</span>
            </span>
            <span className="bg-[#FFB703] text-[#071A33] text-[10px] font-black px-1.5 py-0.5 rounded shadow-xs">
              Secure Auth
            </span>
          </div>
          <h2 className="text-lg font-bold text-white">Select Your Access Portal</h2>
          <p className="text-xs text-gray-300">
            Choose Customer, Employee, or Authorized Manager Login
          </p>
        </div>

        {/* 3 Role Tabs */}
        <div className="grid grid-cols-3 bg-gray-100 p-1 border-b border-gray-200">
          <button
            onClick={() => handleTabChange('user')}
            className={`flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold rounded-lg transition cursor-pointer ${
              activeTab === 'user'
                ? 'bg-white text-[#FF7A00] shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <UserIcon className="w-4 h-4" />
            <span>1. User Login</span>
          </button>

          <button
            onClick={() => handleTabChange('employee')}
            className={`flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold rounded-lg transition cursor-pointer ${
              activeTab === 'employee'
                ? 'bg-white text-[#138808] shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>2. Employee</span>
          </button>

          <button
            onClick={() => handleTabChange('manager')}
            className={`flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold rounded-lg transition cursor-pointer ${
              activeTab === 'manager'
                ? 'bg-white text-[#071A33] shadow-sm font-black'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-[#FFB703]" />
            <span>3. Manager</span>
          </button>
        </div>

        {/* Pending Action Resume Banner */}
        {pendingAction && (
          <div className="mx-5 mt-4 p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 rounded-xl text-xs text-amber-950 flex items-center gap-2.5 shadow-2xs">
            <Sparkles className="w-4 h-4 text-[#FF7A00] shrink-0" />
            <div className="leading-snug">
              <strong className="block text-gray-900 font-bold">Account login required to continue</strong>
              <span>
                {pendingAction.type === 'add_to_cart'
                  ? `Adding "${pendingAction.product.title.slice(0, 32)}..." will automatically finish once you sign in!`
                  : pendingAction.type === 'buy_now'
                  ? `Checkout for "${pendingAction.product.title.slice(0, 32)}..." will open automatically!`
                  : pendingAction.type === 'toggle_wishlist'
                  ? 'Your wishlist item will be saved automatically upon signing in.'
                  : pendingAction.type === 'open_cart'
                  ? 'Your shopping cart will open automatically once signed in.'
                  : pendingAction.type === 'open_checkout'
                  ? 'Direct checkout will open automatically once signed in.'
                  : pendingAction.type === 'open_track_order'
                  ? 'Real-time order tracking will open automatically once signed in.'
                  : pendingAction.type === 'write_review'
                  ? 'The review submission form will open automatically once signed in.'
                  : 'Your requested action will resume seamlessly.'}
              </span>
            </div>
          </div>
        )}

        {/* Messages */}
        {errorMessage && (
          <div className="mx-5 mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <span className="leading-relaxed font-medium">{errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div className="mx-5 mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{successMessage}</span>
          </div>
        )}

        {/* Content depending on active tab */}
        <div className="p-5 sm:p-6 overflow-y-auto max-h-[70vh]">
          {/* TAB 1: USER LOGIN / SIGNUP */}
          {activeTab === 'user' && (
            <div>
              {/* PASSWORD RECOVERY FLOW (FORGOT PASSWORD VIA EMAIL OTP) */}
              {isForgotFlow ? (
                <div className="space-y-4">
                  {/* Step Tracker Indicator */}
                  <div className="bg-orange-50/80 border border-orange-200 rounded-xl p-3.5">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-bold text-gray-900 flex items-center gap-1.5">
                        <KeyRound className="w-4 h-4 text-[#FF7A00]" />
                        <span>Password Recovery via Email OTP</span>
                      </span>
                      <span className="text-[10px] font-black uppercase text-[#FF7A00] bg-white px-2 py-0.5 rounded-full border border-orange-200 shadow-2xs">
                        Step {recoveryStep} of 3
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="grid grid-cols-3 gap-1.5">
                      <div className={`h-1.5 rounded-full transition-all ${recoveryStep >= 1 ? 'bg-[#FF7A00]' : 'bg-gray-200'}`} />
                      <div className={`h-1.5 rounded-full transition-all ${recoveryStep >= 2 ? 'bg-[#FF7A00]' : 'bg-gray-200'}`} />
                      <div className={`h-1.5 rounded-full transition-all ${recoveryStep >= 3 ? 'bg-[#FF7A00]' : 'bg-gray-200'}`} />
                    </div>

                    <div className="flex justify-between text-[10px] text-gray-500 font-medium mt-1.5">
                      <span className={recoveryStep === 1 ? 'text-[#FF7A00] font-bold' : ''}>1. Enter Email</span>
                      <span className={recoveryStep === 2 ? 'text-[#FF7A00] font-bold' : ''}>2. Verify OTP</span>
                      <span className={recoveryStep === 3 ? 'text-[#FF7A00] font-bold' : ''}>3. Reset Password</span>
                    </div>
                  </div>

                  {/* STEP 1: ENTER REGISTERED EMAIL */}
                  {recoveryStep === 1 && (
                    <form onSubmit={handleSendRecoveryOtp} autoComplete="off" className="space-y-4">
                      <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <p className="font-semibold text-gray-800 mb-0.5">Need help accessing your customer account?</p>
                        <p className="text-[11px] text-gray-500">
                          Enter your registered email address below. We'll generate and send a 6-digit verification code to reset your password.
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Registered Customer Email *
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            required
                            autoFocus
                            autoComplete="off"
                            name="rec_user_email_clean"
                            data-lpignore="true"
                            data-form-type="other"
                            placeholder="e.g. customer@gmail.com"
                            value={recoveryEmail}
                            onChange={(e) => setRecoveryEmail(e.target.value)}
                            className="w-full text-xs p-2.5 pl-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7A00] bg-white font-medium"
                          />
                          <Mail className="w-4 h-4 text-gray-400 absolute left-2.5 top-3" />
                        </div>
                        <p className="text-[11px] text-gray-400 mt-1">
                          A 6-digit OTP verification code will be sent to your registered email address.
                        </p>
                      </div>

                      <div className="pt-1 flex flex-col gap-2">
                        <button
                          type="submit"
                          disabled={isSendingOtp}
                          className="w-full bg-[#FF7A00] hover:bg-[#E86F00] text-white font-bold text-xs py-3 rounded-lg shadow-md transition transform active:scale-98 cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-60"
                        >
                          {isSendingOtp ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>Sending OTP...</span>
                            </>
                          ) : (
                            <>
                              <span>Send OTP</span>
                              <Mail className="w-3.5 h-3.5" />
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={handleBackToLogin}
                          className="w-full text-xs text-gray-600 hover:text-gray-900 font-semibold py-2 transition flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                          <span>Back to Login</span>
                        </button>
                      </div>
                    </form>
                  )}

                  {/* STEP 2: VERIFY 6-DIGIT OTP */}
                  {recoveryStep === 2 && (
                    <form onSubmit={handleVerifyOtpStep} autoComplete="off" className="space-y-4">
                      {/* Email Dispatch Notice */}
                      <div className="bg-orange-50/70 border border-orange-200 rounded-xl p-3.5 text-xs text-gray-800 shadow-2xs">
                        <div className="flex items-start gap-2.5">
                          <Inbox className="w-4 h-4 text-[#FF7A00] shrink-0 mt-0.5" />
                          <div className="space-y-1">
                            <p className="font-bold text-gray-900">
                              Check Your Registered Email Inbox
                            </p>
                            <p className="text-[11px] text-gray-600 leading-relaxed">
                              A 6-digit OTP has been sent to <strong className="font-mono text-gray-900">{recoveryEmail}</strong>. Please check your inbox or spam folder. The code expires in 10 minutes.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Enter 6-Digit OTP *
                        </label>
                        <input
                          type="text"
                          required
                          autoFocus
                          maxLength={6}
                          autoComplete="off"
                          name="rec_user_otp_code"
                          data-lpignore="true"
                          data-form-type="other"
                          placeholder="••••••"
                          value={recoveryOtp}
                          onChange={(e) => setRecoveryOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                          className="w-full text-center tracking-[0.5em] text-xl font-mono font-black p-3 border-2 border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7A00] bg-orange-50/20 text-gray-900"
                        />
                        <div className="flex items-center justify-between text-xs mt-2">
                          <span className="text-gray-500 text-[11px]">Didn't get the code?</span>
                          {resendTimer > 0 ? (
                            <span className="text-gray-400 font-medium text-[11px]">
                              Resend in <strong className="font-mono text-gray-700">{resendTimer}s</strong>
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={handleResendOtp}
                              disabled={isResendingOtp}
                              className="text-xs text-[#FF7A00] hover:text-[#E86F00] font-bold flex items-center gap-1 cursor-pointer disabled:opacity-60"
                            >
                              {isResendingOtp ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <RefreshCw className="w-3 h-3" />
                              )}
                              <span>{isResendingOtp ? 'Sending...' : 'Resend OTP'}</span>
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="pt-1 flex flex-col gap-2">
                        <button
                          type="submit"
                          className="w-full bg-[#FF7A00] hover:bg-[#E86F00] text-white font-bold text-xs py-3 rounded-lg shadow-md transition transform active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <span>Verify OTP & Continue</span>
                          <CheckCircle className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={handleBackToLogin}
                          className="w-full text-xs text-gray-600 hover:text-gray-900 font-semibold py-2 transition flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                          <span>Back to Login</span>
                        </button>
                      </div>
                    </form>
                  )}

                  {/* STEP 3: RESET PASSWORD */}
                  {recoveryStep === 3 && (
                    <form onSubmit={handleResetPasswordSubmit} autoComplete="off" className="space-y-4">
                      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-950">
                        <p className="font-bold flex items-center gap-1.5 text-emerald-900 mb-0.5">
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                          <span>OTP Verified Successfully</span>
                        </p>
                        <p className="text-[11px] text-emerald-800">
                          Create and confirm your new password for account <strong className="font-mono font-bold">{recoveryEmail}</strong>.
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          New Password *
                        </label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? 'text' : 'password'}
                            required
                            autoFocus
                            autoComplete="new-password"
                            name="rec_new_pass_field"
                            data-lpignore="true"
                            data-form-type="other"
                            placeholder="Enter new password (min. 4 characters)"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full text-xs p-2.5 pl-8 pr-9 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
                          />
                          <Lock className="w-4 h-4 text-gray-400 absolute left-2.5 top-3" />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
                          >
                            {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Confirm New Password *
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            required
                            autoComplete="new-password"
                            name="rec_confirm_pass_field"
                            data-lpignore="true"
                            data-form-type="other"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full text-xs p-2.5 pl-8 pr-9 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
                          />
                          <Lock className="w-4 h-4 text-gray-400 absolute left-2.5 top-3" />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
                          >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="pt-1 flex flex-col gap-2">
                        <button
                          type="submit"
                          disabled={isSubmittingRecovery}
                          className="w-full bg-[#138808] hover:bg-[#0f6b06] text-white font-bold text-xs py-3 rounded-lg shadow-md transition transform active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <span>Reset Password & Login</span>
                          <CheckCircle className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={handleBackToLogin}
                          className="w-full text-xs text-gray-600 hover:text-gray-900 font-semibold py-2 transition flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                          <span>Back to Login</span>
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              ) : (
                /* STANDARD SIGN IN / SIGN UP VIEW */
                <div>
                  {/* Toggle Sign In / Sign Up */}
                  <div className="flex border-b border-gray-200 mb-5">
                    <button
                      type="button"
                      onClick={() => {
                        setUserMode('signin');
                        clearAllFields();
                      }}
                      className={`flex-1 pb-2.5 text-xs font-bold border-b-2 transition cursor-pointer ${
                        userMode === 'signin'
                          ? 'border-[#FF7A00] text-[#FF7A00]'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Sign In (Existing User)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setUserMode('signup');
                        clearAllFields();
                      }}
                      className={`flex-1 pb-2.5 text-xs font-bold border-b-2 transition cursor-pointer ${
                        userMode === 'signup'
                          ? 'border-[#FF7A00] text-[#FF7A00]'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Sign Up (New Customer)
                    </button>
                  </div>

                  {/* Clean Single Google Action */}
                  <div className="mb-4">
                    <button
                      type="button"
                      onClick={() => {
                        resetMessages();
                        setGooglePromptOpen(true);
                      }}
                      className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 hover:bg-gray-50 active:bg-gray-100 text-gray-700 font-semibold text-xs py-2.5 px-4 rounded-lg shadow-2xs transition cursor-pointer"
                    >
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.14z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                        />
                      </svg>
                      <span>Sign in with Google</span>
                    </button>

                    {/* Dynamic Google Authentication Dialog */}
                    {googlePromptOpen && (
                      <div className="mt-3 p-4 bg-white border border-gray-200 rounded-xl shadow-lg text-xs animate-in fade-in">
                        <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100">
                          <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                              <path
                                fill="#4285F4"
                                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.14z"
                              />
                              <path
                                fill="#34A853"
                                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"
                              />
                              <path
                                fill="#FBBC05"
                                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                              />
                              <path
                                fill="#EA4335"
                                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                              />
                            </svg>
                            <div>
                              <p className="font-bold text-gray-900 leading-none">Sign in with Google</p>
                              <p className="text-[10px] text-gray-500 leading-tight">to continue to Bharat Kart</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setGooglePromptOpen(false);
                              setGoogleEmailInput('');
                              setGoogleNameInput('');
                              setGoogleError('');
                            }}
                            className="text-gray-400 hover:text-gray-600 p-1 rounded-full cursor-pointer hover:bg-gray-100 transition"
                            aria-label="Cancel Google Sign-in"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="space-y-3">
                          {googleError && (
                            <div className="p-2 bg-red-50 border border-red-200 text-red-600 rounded text-[11px] font-medium flex items-center gap-1.5">
                              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                              <span>{googleError}</span>
                            </div>
                          )}

                          <div>
                            <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                              Google Email Address <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="email"
                              required
                              autoComplete="off"
                              name="dynamic_google_email"
                              placeholder="Enter your Google email (e.g. name@gmail.com)"
                              value={googleEmailInput}
                              onChange={(e) => {
                                setGoogleEmailInput(e.target.value);
                                setGoogleError('');
                              }}
                              className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4285F4] focus:border-[#4285F4]"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                              Your Name <span className="text-gray-400 font-normal">(Optional)</span>
                            </label>
                            <input
                              type="text"
                              autoComplete="off"
                              name="dynamic_google_name"
                              placeholder="Enter your full name"
                              value={googleNameInput}
                              onChange={(e) => setGoogleNameInput(e.target.value)}
                              className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4285F4] focus:border-[#4285F4]"
                            />
                          </div>

                          <div className="flex items-center justify-end gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => {
                                setGooglePromptOpen(false);
                                setGoogleEmailInput('');
                                setGoogleNameInput('');
                                setGoogleError('');
                              }}
                              className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-semibold cursor-pointer transition"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={handleGoogleSignIn}
                              disabled={isGoogleLoading}
                              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#4285F4] hover:bg-[#3367D6] text-white text-xs font-bold shadow-xs cursor-pointer disabled:opacity-70 transition"
                            >
                              {isGoogleLoading ? (
                                <>
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  <span>Signing in...</span>
                                </>
                              ) : (
                                <span>Sign In with Google</span>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="relative my-4">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200" />
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span className="bg-white px-3 text-gray-400">or use password</span>
                      </div>
                    </div>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleUserSubmit} autoComplete="off" className="space-y-3.5">
                    {userMode === 'signup' && (
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          autoComplete="off"
                          name="customer_full_name_clean"
                          data-lpignore="true"
                          data-form-type="other"
                          placeholder="Enter your full name"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Email / User ID *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          autoComplete="off"
                          name="customer_account_id_clean"
                          data-lpignore="true"
                          data-form-type="other"
                          spellCheck="false"
                          placeholder="Enter your email or user ID"
                          value={userEmailOrId}
                          onChange={(e) => setUserEmailOrId(e.target.value)}
                          className="w-full text-xs p-2.5 pl-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <Mail className="w-4 h-4 text-gray-400 absolute left-2.5 top-3" />
                      </div>
                    </div>

                    {userMode === 'signup' && (
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Mobile Number
                        </label>
                        <div className="relative">
                          <input
                            type="tel"
                            autoComplete="off"
                            name="customer_mobile_clean"
                            data-lpignore="true"
                            data-form-type="other"
                            placeholder="e.g. 9876543210"
                            value={userPhone}
                            onChange={(e) => setUserPhone(e.target.value)}
                            className="w-full text-xs p-2.5 pl-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <Phone className="w-4 h-4 text-gray-400 absolute left-2.5 top-3" />
                        </div>
                      </div>
                    )}

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-semibold text-gray-700">
                          Password *
                        </label>
                        {userMode === 'signin' && (
                          <button
                            type="button"
                            onClick={handleStartForgotPassword}
                            className="text-xs text-[#FF7A00] hover:text-[#E86F00] font-semibold transition cursor-pointer"
                          >
                            Forgot Password?
                          </button>
                        )}
                      </div>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          autoComplete="new-password"
                          name="customer_password_clean"
                          data-lpignore="true"
                          data-form-type="other"
                          placeholder="Enter your password"
                          value={userPassword}
                          onChange={(e) => setUserPassword(e.target.value)}
                          className="w-full text-xs p-2.5 pl-8 pr-9 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <Lock className="w-4 h-4 text-gray-400 absolute left-2.5 top-3" />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#FF7A00] hover:bg-[#E86F00] text-white font-bold text-xs py-3 rounded-lg shadow-md transition transform active:scale-98 cursor-pointer"
                    >
                      {userMode === 'signup' ? 'Create Bharat Kart Account' : 'Login to Bharat Kart'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: EMPLOYEE LOGIN */}
          {activeTab === 'employee' && (
            <div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-4 text-xs text-emerald-800">
                <p className="font-bold flex items-center gap-1.5 text-emerald-900 mb-1">
                  <Briefcase className="w-4 h-4 text-emerald-700" />
                  Employee Access Portal
                </p>
                <p>
                  Employees can only log in with credentials created by the Store Manager. Once logged
                  in, you can add products with image, title, price, and specs!
                </p>
              </div>

              <form onSubmit={handleEmployeeSubmit} autoComplete="off" className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Employee ID *
                  </label>
                  <input
                    type="text"
                    required
                    autoComplete="off"
                    name="emp_user_id_clean"
                    data-lpignore="true"
                    data-form-type="other"
                    spellCheck="false"
                    placeholder="e.g. emp.vikram or emp.priya"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Password (Created by Manager) *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete="new-password"
                      name="emp_secret_pwd_clean"
                      data-lpignore="true"
                      data-form-type="other"
                      placeholder="Enter employee password"
                      value={employeePassword}
                      onChange={(e) => setEmployeePassword(e.target.value)}
                      className="w-full text-xs p-2.5 pr-9 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#138808] hover:bg-[#107507] text-white font-bold text-xs py-3 rounded-lg shadow-md transition transform active:scale-98 cursor-pointer"
                >
                  Login as Employee & Add Products
                </button>

                {/* Helpful default employee credential hint */}
                <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-200 text-xs text-gray-600">
                  <p className="font-semibold text-gray-700 mb-1">Pre-configured Employee Logins:</p>
                  <p>
                    • ID: <code className="font-mono text-emerald-700 font-bold">emp.vikram</code> |
                    Pass: <code className="font-mono text-emerald-700 font-bold">Emp@1234</code>
                  </p>
                  <p>
                    • ID: <code className="font-mono text-emerald-700 font-bold">emp.priya</code> |
                    Pass: <code className="font-mono text-emerald-700 font-bold">Emp@5678</code>
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1">
                    (Manager can add more employees or modify credentials anytime)
                  </p>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: MANAGER LOGIN (STRICT arun.prakash.45) */}
          {activeTab === 'manager' && (
            <div>
              <div className="bg-amber-50 border border-amber-300 rounded-lg p-3.5 mb-4 text-xs text-amber-900">
                <p className="font-bold flex items-center gap-1.5 text-amber-950 mb-1 text-sm">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  Exclusive Manager Portal
                </p>
                <p className="leading-relaxed">
                  Confidential Administrative Portal. Access is restricted to the authorized store owner only.
                </p>
              </div>

              <form onSubmit={handleManagerSubmit} autoComplete="off" className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Manager User ID
                  </label>
                  <input
                    type="text"
                    required
                    autoComplete="off"
                    name="mgr_admin_id_clean"
                    data-lpignore="true"
                    data-form-type="other"
                    spellCheck="false"
                    placeholder="Enter User ID"
                    value={managerUserId}
                    onChange={(e) => setManagerUserId(e.target.value)}
                    className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Manager Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete="new-password"
                      name="mgr_admin_pwd_clean"
                      data-lpignore="true"
                      data-form-type="other"
                      placeholder="Enter Password"
                      value={managerPassword}
                      onChange={(e) => setManagerPassword(e.target.value)}
                      className="w-full text-xs p-2.5 pr-9 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#071A33] hover:bg-[#0E284D] text-[#FFB703] hover:text-white font-black text-xs py-3 rounded-lg shadow-lg transition transform active:scale-98 flex items-center justify-center gap-2 border border-[#FFB703]/40 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-[#FFB703]" />
                  <span>Unlock Manager Portal</span>
                </button>

                <div className="text-[11px] text-gray-500 text-center leading-normal">
                  Administrator features: Manage catalog products, staff logins, customer orders,
                  and payment webhooks.
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
