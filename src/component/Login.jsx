// src/component/Login.jsx
// src/component/AuthanitactionWrapper.jsx/Login.jsx
// src/component/Login.jsx

import { useEffect, useRef, useState } from "react"
import { useAuth } from "../Authorization/AuthContext"
import axiosInstance from "../Authorization/axiosInstance"
import LoginImageSlider from "./LoginImageSlider"


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
    if (countdown > 0) return
    try {
      const response = await axiosInstance.post('/auth/endUserSignup', null, {
        params: { mobileNumber },
      })

      if (response.data.status === 'SUCCESS') {
        alert('New OTP sent!')
        setOtp('')
        startCountdown()
      } else {
        alert(response.data.message || 'Failed to resend OTP')
      }
    } catch (error) {
      console.error(error)
      alert('Error resending OTP')
    }
  }

  return (
    <>
      <div className="w-full  flex flex-col">
        <div className="flex flex-row  justify-between items-center  p-4 sm:p-5">
          <h2 className="text-xl sm:text-2xl  font-semibold text-gray-800 ">
            {showOtpInput ? "Verify OTP" : showSignUp ? "Create Account" : "Sign In"}
          </h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            ✖
          </button>
        </div>
        <div className="flex">
          <div className=" w-1/2 p-4 border">
            <LoginImageSlider />
          </div>
          {/* Header */}
          <div className=" w-1/2">
            {/* Body */}
            <div className="px-4 border py-5 sm:p-6 space-y-4 sm:space-y-5">

              {/* ######### NO OTP SCREEN ######### */}
              {!showOtpInput && (
                <>
                  {/* Signup fields */}
                  {showSignUp && (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-1">Full Name</label>
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg p-2.5 sm:p-3 bg-gray-50"
                          placeholder="Enter full name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg p-2.5 sm:p-3 bg-gray-50"
                          placeholder="Enter email address"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Date of Birth</label>
                        <input
                          type="text"
                          value={dob}
                          onChange={(e) => setDob(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg p-2.5 sm:p-3 bg-gray-50"
                          placeholder="DD-MM-YYYY"
                        />
                      </div>
                    </>
                  )}

                  {/* Mobile Number */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Mobile Number</label>
                    <div className="flex border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                      <span className="px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-100 font-semibold text-gray-700 flex items-center">
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
                        className="flex-1 p-2.5 sm:p-3 bg-gray-50 outline-none text-sm sm:text-base"
                        placeholder="Enter your 10-digit number"
                      />
                    </div>

                    {mobileError && (
                      <p className="text-red-500 text-xs sm:text-sm mt-1">{mobileError}</p>
                    )}
                  </div>

                  <button
                    onClick={handleSignUp}
                    disabled={isLoading || !!mobileError || mobileNumber.length < 10}
                    className={`w-full py-2.5 sm:py-3 text-white text-sm sm:text-base font-semibold rounded-lg transition ${isLoading || mobileError || mobileNumber.length < 10
                      ? "bg-teal-300"
                      : "bg-teal-600 hover:bg-teal-700"
                      }`}
                  >
                    {isLoading ? "Please wait..." : "Continue"}
                  </button>

                  <p className="text-xs sm:text-sm text-center text-gray-600">
                    {showSignUp ? "Already have an account?" : "Don’t have an account?"}{" "}
                    <button
                      onClick={() => setShowSignUp(!showSignUp)}
                      className="text-teal-600 font-medium"
                    >
                      {showSignUp ? "Log In" : "Sign Up"}
                    </button>
                  </p>
                </>
              )}

              {/* ######### OTP SCREEN ######### */}
              {showOtpInput && (
                <div className="text-center">

                  <p className="text-gray-600 mb-4 text-sm sm:text-base">
                    We've sent a 6-digit code to +91 {mobileNumber}
                  </p>

                  {/* OTP Boxes */}
                  <div className="flex justify-center gap-2 sm:gap-3 mb-4">
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        onClick={() => otpInputRef.current.focus()}
                        className={`w-8 h-8 sm:w-10 sm:h-10 border-2 rounded-lg flex items-center justify-center text-lg font-semibold cursor-text ${otpError
                          ? "border-red-500"
                          : otp[i]
                            ? "border-teal-500"
                            : "border-gray-300"
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
                    <p className="text-red-500 text-xs sm:text-sm mb-2">{otpError}</p>
                  )}

                  <button
                    onClick={verifyOtp}
                    disabled={otp.length < 6 || isLoading}
                    className={`w-full py-2.5 sm:py-3 text-white font-semibold text-sm sm:text-base rounded-lg ${otp.length < 6
                      ? "bg-teal-300"
                      : "bg-teal-600 hover:bg-teal-700"
                      }`}
                  >
                    {isLoading ? "Verifying..." : "Verify & Continue"}
                  </button>

                  <div className="mt-3 text-xs sm:text-sm text-gray-600">
                    Didn’t receive code?{" "}
                    <button
                      onClick={resendOtp}
                      disabled={countdown > 0}
                      className={`font-medium ${countdown > 0 ? "text-gray-400" : "text-teal-600"
                        }`}
                    >
                      {countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setShowOtpInput(false)
                      setOtp("")
                      setOtpMessage("")
                      setMobileNumber("")
                    }}
                    className="mt-3 text-teal-600 font-medium text-xs sm:text-sm"
                  >
                    Change Mobile Number
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>

  )
}

export default Login
