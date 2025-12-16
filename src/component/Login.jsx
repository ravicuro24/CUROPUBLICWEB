// src/component/Login.jsx

import { useEffect, useRef, useState } from "react"
import { useAuth } from "../Authorization/AuthContext"
import axiosInstance from "../Authorization/axiosInstance"
import LoginImageSlider from "./LoginImageSlider"
import { FiSmartphone, FiMail, FiUser, FiCalendar, FiLock, FiArrowLeft, FiCheckCircle } from "react-icons/fi"
import { IoClose } from "react-icons/io5"

const Login = ({ onClose, onLoginSuccess }) => {
  const { setToken, setUserdata, setAuthModal } = useAuth()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [dob, setDob] = useState('')
  const [mobileNumber, setMobileNumber] = useState('')
  const [otp, setOtp] = useState('')
  const [otpMessage, setOtpMessage] = useState('')
  const [showOtpInput, setShowOtpInput] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [mobileError, setMobileError] = useState('')
  const [otpError, setOtpError] = useState('')
  const [showSignUp, setShowSignUp] = useState(false)
  const [isResending, setIsResending] = useState(false) // New state for resend loading
  const otpInputRef = useRef(null)

  // Auto focus OTP input
  useEffect(() => {
    if (showOtpInput && otpInputRef.current) {
      otpInputRef.current.focus()
    }
  }, [showOtpInput])

  // Countdown Timer
  const startCountdown = () => {
    setCountdown(30)
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleSignUp = async () => {
    setIsLoading(true)
    try {
      const endpoint = showSignUp ? '/auth/signupNewUser' : '/auth/endUserSignup'
      const params = showSignUp
        ? { mobileNumber, fullName, email, dob }
        : { mobileNumber }

      const response = showSignUp
        ? await axiosInstance.post(endpoint, params)
        : await axiosInstance.post(endpoint, null, { params })

      console.log("data", response)
      if (response.data.status === 'SUCCESS') {
        setShowOtpInput(true)
        setOtpMessage(`OTP sent successfully`)
        startCountdown()
      } else {
        console.log("Resend OTP", response)
        if (response.data.message === "Your number is not registered, please signup") {
          setShowSignUp(true)
          return;
        }
      }
    } catch (error) {
      console.error(error)
      alert(error.response?.data?.message || 'Something went wrong.')
    } finally {
      setIsLoading(false)
    }
  }

  const verifyOtp = async () => {
    setIsLoading(true)
    try {
      const endpoint = '/auth/endUserLogin'
      const params = { mobileNumber, otp }

      const response = await axiosInstance.post(endpoint, null, { params })
      const data = response.data

      console.log("verify Otp", response)

      // Save in localStorage
      localStorage.setItem('userData', JSON.stringify(data.dto))
      localStorage.setItem('token', response.data.token)

      // 🔥 IMPORTANT — update AuthContext
      setToken(response.data.token)
      setUserdata(data.dto)
      setAuthModal(false)

      if (onLoginSuccess) onLoginSuccess()
    } catch (error) {
      console.error(error)
      setOtpError(error.response?.data?.message || 'Invalid OTP')
    } finally {
      setIsLoading(false)
    }
  }

  const resendOtp = async () => {
    if (countdown > 0 || isResending) return

    setIsResending(true)
    try {
      const response = await axiosInstance.post('/auth/endUserSignup', null, {
        params: { mobileNumber },
      })

      if (response.data.status === 'SUCCESS') {
        setOtpMessage('New OTP sent successfully!')
        setOtp('')
        setOtpError('')
        startCountdown()
      } else {
        setOtpError(response.data.message || 'Failed to resend OTP')
      }
    } catch (error) {
      console.error(error)
      setOtpError(error.response?.data?.message || 'Error resending OTP')
    } finally {
      setIsResending(false)
    }
  }

  const formatDOB = (value) => {
    // Remove everything except numbers
    let cleaned = value.replace(/\D/g, "");

    // Add hyphens automatically
    if (cleaned.length > 2 && cleaned.length <= 4) {
      cleaned = cleaned.slice(0, 2) + "-" + cleaned.slice(2);
    } else if (cleaned.length > 4) {
      cleaned = cleaned.slice(0, 2) + "-" + cleaned.slice(2, 4) + "-" + cleaned.slice(4, 8);
    }

    return cleaned;
  };

  return (
    <div className="fixed inset-0 backdrop-brightness-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden animate-fade-in">

        {/* HEADER */}
        <div className="relative bg-gradient-to-r from-teal-500 to-blue-500 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">
                {showOtpInput ? "Verify OTP" : showSignUp ? "Create Account" : "Welcome Back"}
              </h2>
              <p className="text-teal-100 mt-1">
                {showOtpInput
                  ? "Enter the OTP sent to your mobile"
                  : showSignUp
                    ? "Join us today"
                    : "Sign in to continue"
                }
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-all duration-300 text-white"
            >
              <IoClose size={20} />
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row">

          {/* LEFT SIDE - IMAGE SLIDER */}
          <div className="lg:w-1/2 p-6 ">
            <div className="h-full flex items-center justify-center">
              <LoginImageSlider />
            </div>
          </div>

          {/* RIGHT SIDE - FORM */}
          <div className="lg:w-1/2 p-6 lg:p-8">
            <div className="space-y-6">

              {/* Success Message */}
              {otpMessage && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 animate-slide-up">
                  <p className="text-green-700 text-sm flex items-center gap-2">
                    <FiCheckCircle className="text-green-500" />
                    {otpMessage}
                  </p>
                </div>
              )}

              {/* ######### NO OTP SCREEN ######### */}
              {!showOtpInput && (
                <>
                  {/* Signup fields */}
                  {showSignUp && (
                    <div className="space-y-4 animate-slide-up">
                      <div className="relative">
                        <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full pl-10 pr-4 py-3  rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300"
                          placeholder="Enter full name"
                        />
                      </div>

                      <div className="relative">
                        <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-10 pr-4 py-3  rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300"
                          placeholder="Enter email address"
                        />
                      </div>

                      <div className="relative">
                        <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={dob}
                          onChange={(e) => setDob(formatDOB(e.target.value))}
                          maxLength={10}
                          placeholder="DD-MM-YYYY"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl 
                          focus:ring-2 focus:ring-teal-500 focus:border-transparent 
                          transition-all duration-300"
                        />
                      </div>
                    </div>
                  )}

                  {/* Mobile Number */}
                  <div className="space-y-4 animate-slide-up">
                    <div className="relative">
                      {/* <FiSmartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" /> */}
                      <div className="flex border border-gray-300 rounded-xl overflow-hidden bg-white focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-transparent transition-all duration-300">
                        <span className="px-4 py-3 bg-gray-100 font-semibold text-gray-700  items-center border-0 ">
                          +91
                        </span>
                        <input
                          type="text"
                          value={mobileNumber}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9]/g, "")
                            setMobileNumber(val)
                            if (val.length === 0) setMobileError("")
                            else if (!/^[6-9]/.test(val))
                              setMobileError("Enter valid mobile number")
                            else setMobileError("")
                          }}
                          maxLength={10}
                          className="flex-1 pl-12 pr-4 py-3 outline-none border-0 text-base"
                          placeholder="Enter your 10-digit number"
                        />
                      </div>
                      {mobileError && (
                        <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                          <span>⚠</span> {mobileError}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={handleSignUp}
                      disabled={isLoading || !!mobileError || mobileNumber.length < 10}
                      className={`w-full py-3.5 text-white font-semibold rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${isLoading || mobileError || mobileNumber.length < 10
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 shadow-lg"
                        }`}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-2 cursor-pointer border-white border-t-transparent rounded-full animate-spin"></div>
                          Please wait...
                        </div>
                      ) : (
                        "Continue"
                      )}
                    </button>

                    <div className="text-center">
                      <p className="text-gray-600">
                        {showSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                        <button
                          onClick={() => setShowSignUp(!showSignUp)}
                          className="text-teal-600 font-semibold hover:text-teal-700 transition-colors duration-300"
                        >
                          {showSignUp ? "Log In" : "Sign Up"}
                        </button>
                      </p>
                    </div>
                  </div>
                </>
              )}

              {/* ######### OTP SCREEN ######### */}
              {showOtpInput && (
                <div className="space-y-6 animate-slide-up">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FiLock className="text-teal-600 text-2xl" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Enter Verification Code</h3>
                    <p className="text-gray-600">
                      We've sent a 6-digit code to{" "}
                      <span className="font-semibold text-teal-600">+91 {mobileNumber}</span>
                    </p>
                  </div>

                  {/* OTP Boxes */}
                  <div className="flex justify-center gap-3 mb-6">
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        onClick={() => otpInputRef.current.focus()}
                        className={`w-12 h-12 border-2 rounded-lg flex items-center justify-center text-lg font-semibold cursor-text transition-all duration-300 ${otpError
                          ? "border-red-500 bg-red-50 shake-animation"
                          : otp[i]
                            ? "border-teal-500 bg-teal-50 scale-110"
                            : "border-gray-300 hover:border-teal-300"
                          }`}
                      >
                        {otp[i] || ""}
                      </div>
                    ))}
                  </div>

                  {/* Hidden Input */}
                  <input
                    ref={otpInputRef}
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    pattern="\d*"
                    className="opacity-0 absolute"
                    style={{ height: 0, width: 0 }}
                    value={otp}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, "").slice(0, 6)
                      setOtp(val)
                      setOtpError(val.length < 6 ? "Enter valid 6-digit OTP" : "")
                    }}
                  />

                  {otpError && (
                    <p className="text-red-500 text-sm text-center flex items-center justify-center gap-1">
                      <span>⚠</span> {otpError}
                    </p>
                  )}

                  <button
                    onClick={verifyOtp}
                    disabled={otp.length < 6 || isLoading}
                    className={`w-full py-3.5 text-white font-semibold rounded-xl transition-all duration-300 transform ${otp.length < 6 || isLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 hover:scale-105 shadow-lg"
                      }`}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Verifying...
                      </div>
                    ) : (
                      "Verify & Continue"
                    )}
                  </button>

                  <div className="text-center space-y-3">
                    <div className="text-sm text-gray-600">
                      Didn't receive code?{" "}
                      <button
                        onClick={resendOtp}
                        disabled={countdown > 0 || isResending}
                        className={`font-semibold transition-colors duration-300 flex items-center gap-1 ${countdown > 0 || isResending ? "text-gray-400 cursor-not-allowed" : "text-teal-600 hover:text-teal-700"
                          }`}
                      >
                        {isResending ? (
                          <>
                            <div className="w-3 h-3 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
                            Resending...
                          </>
                        ) : countdown > 0 ? (
                          `Resend in ${countdown}s`
                        ) : (
                          "Resend OTP"
                        )}
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        setShowOtpInput(false)
                        setOtp("")
                        setOtpMessage("")
                        setOtpError("")
                      }}
                      className="text-teal-600 font-semibold text-sm hover:text-teal-700 transition-colors duration-300 flex items-center justify-center gap-1 mx-auto"
                    >
                      <FiArrowLeft size={14} />
                      Change Mobile Number
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="bg-gray-50 px-6 py-4 ">
          <p className="text-center text-sm text-gray-600">
            By continuing, you agree to our{" "}
            <span className="text-teal-600 font-semibold cursor-pointer hover:text-teal-700">
              Terms of Service
            </span>{" "}
            and{" "}
            <span className="text-teal-600 font-semibold cursor-pointer hover:text-teal-700">
              Privacy Policy
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login