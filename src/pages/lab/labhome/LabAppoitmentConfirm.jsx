// src/pages/lab/labhome/LabAppoitmentConfirm.jsx
// src/pages/lab/labhome/LabAppointmentConfirm.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  FileText,
  Download,
  Share2,
  Home
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

function LabAppointmentConfirm() {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderResponse } = location.state || {};
  const [appointment, setAppointment] = useState(orderResponse?.response?.[0] || {});
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    if (orderResponse?.response?.[0]) {
      setAppointment(orderResponse.response[0]);
    }

    // Auto-hide confetti after 3 seconds
    const confettiTimer = setTimeout(() => {
      setShowConfetti(false);
    }, 3000);

    return () => clearTimeout(confettiTimer);
  }, [orderResponse]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Confetti animation components
  const Confetti = () => {
    return (
      <div className="fixed inset-0 pointer-events-none z-50">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2"
            style={{
              left: `${Math.random() * 100}%`,
              top: '-10px',
              backgroundColor: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'][
                Math.floor(Math.random() * 5)
              ],
            }}
            initial={{ y: -20, rotate: 0 }}
            animate={{
              y: window.innerHeight,
              rotate: 360,
              x: Math.random() * 100 - 50,
            }}
            transition={{
              duration: Math.random() * 2 + 1,
              repeat: 0,
              ease: "easeOut",
            }}
          />
        ))}
      </div>
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0, scale: 0.9 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const cardHoverVariants = {
    hover: {
      y: -5,
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 300
      }
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 py-8 px-4">
      <AnimatePresence>
        {showConfetti && <Confetti />}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="inline-block mb-4"
          >
            <div className="relative">
              <CheckCircle
                size={80}
                className="text-green-500 drop-shadow-lg"
              />
              <motion.div
                className="absolute inset-0 bg-green-500 rounded-full"
                initial={{ scale: 0, opacity: 0.5 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 1.5, delay: 0.5 }}
              />
            </div>
          </motion.div>
          <h1 className="text-md md:text-4xl font-bold text-gray-800 mb-3 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Appointment Confirmed!
          </h1>
          <p className="text-xl text-gray-600 max-w-md mx-auto leading-relaxed">
            Your lab test has been successfully scheduled. We've sent a confirmation to your email.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 "
        >
          {/* Main Confirmation Card */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
              {/* Success Header */}
              <motion.div
                variants={itemVariants}
                className="bg-gradient-to-r from-green-500 via-teal-500 to-teal-700 p-8 text-white relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white opacity-10"></div>
                <div className="relative z-10 text-center">
                  <motion.h2
                    className="text-md md:text-3xl font-bold mb-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    Booking Confirmed! 🎉
                  </motion.h2>
                  <p className="text-lg opacity-95">We're looking forward to seeing you!</p>
                </div>

                {/* Animated background elements */}
                <motion.div
                  className="absolute -top-4 -right-4 w-20 h-20 bg-white opacity-10 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              </motion.div>

              {/* Appointment Details */}
              <div className="p-8">
                <motion.div
                  variants={itemVariants}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
                >
                  <motion.div
                    className="flex items-center space-x-4 p-4 bg-blue-50 rounded-xl"
                    whileHover="hover"
                    variants={cardHoverVariants}
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Appointment Date</p>
                      <p className="font-semibold text-gray-800">
                        {appointment.appointmentDate || 'Not specified'}
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-center space-x-4 p-4 bg-purple-50 rounded-xl"
                    whileHover="hover"
                    variants={cardHoverVariants}
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <FileText className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Appointment Number</p>
                      <p className="font-semibold text-gray-800">
                        {appointment.appointmentNumber || 'N/A'}
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-center space-x-4 p-4 bg-green-50 rounded-xl"
                    whileHover="hover"
                    variants={cardHoverVariants}
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Clock className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Appointment ID</p>
                      <p className="font-semibold text-gray-800">
                        {appointment.id || 'N/A'}
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-center space-x-4 p-4 bg-orange-50 rounded-xl"
                    whileHover="hover"
                    variants={cardHoverVariants}
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className="font-semibold text-green-600">Confirmed</p>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Additional Information */}
                <motion.div
                  variants={itemVariants}
                  className="bg-gray-50 rounded-2xl p-6 border border-gray-200"
                >
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-gray-600" />
                    Important Notes
                  </h3>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      Please arrive 15 minutes before your scheduled time
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      Bring a valid ID and your insurance card
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      Fasting may be required for certain tests
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      Contact us if you need to reschedule
                    </li>
                  </ul>
                </motion.div>

                <button
                  onClick={() =>
                    navigate('/manage_profile', {
                      state: { from: 'confirmOrder' }
                    })
                  }
                  className="mt-4 bg-teal-600 text-white py-2 px-4 rounded-md"
                >
                  Go to Appointments
                </button>

              </div>
            </div>
          </motion.div>

          {/* Sidebar Actions */}
          <motion.div
            variants={itemVariants}
            className="space-y-6"
          >
          </motion.div>
        </motion.div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-8 text-gray-500 text-sm"
        >
          <p>You will receive a reminder 24 hours before your appointment</p>
        </motion.div>
      </div>
    </div>
  );
}

export default LabAppointmentConfirm;