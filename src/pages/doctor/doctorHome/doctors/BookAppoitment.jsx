// src/pages/doctor/doctorHome/doctors/BookAppoitment.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaStar, FaVideo, FaClinicMedical, FaCheck, FaArrowLeft, FaCalendarAlt, FaClock, FaUser } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

function BookAppointment() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const doctor = state?.doctor;

    // Step control
    const [step, setStep] = useState(1);
    const [isAnimating, setIsAnimating] = useState(false);

    // Step 1 states
    const [consultType, setConsultType] = useState(null);
    const [patientName, setPatientName] = useState("");
    const [patientPhone, setPatientPhone] = useState("");

    // Step 2 states
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [selectedPatient, setSelectedPatient] = useState("");

    // Loading state for confirmation
    const [isLoading, setIsLoading] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false);

    // Dummy Patients List
    const patients = [
        { id: 1, name: "John Doe", phone: "+91 98765 43210" },
        { id: 2, name: "Riya Sharma", phone: "+91 98711 44556" },
        { id: 3, name: "Amit Verma", phone: "+91 98220 98765" },
    ];

    // Dummy Dates
    const dates = ["01 Mar 2025", "02 Mar 2025", "03 Mar 2025", "04 Mar 2025", "05 Mar 2025"];

    // Dummy Time Slots
    const timeSlots = ["09:00 AM", "10:30 AM", "12:00 PM", "03:30 PM", "05:00 PM"];

    // Validation for Step 1
    const step1Valid =
        consultType !== null ;

    // Validation for Step 2
    const step2Valid =
        selectedDate !== "" &&
        selectedTime !== "" &&
        selectedPatient !== "";

    const handleNextStep = (nextStep) => {
        if (isAnimating) return;
        
        setIsAnimating(true);
        setTimeout(() => {
            setStep(nextStep);
            setIsAnimating(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 300);
    };

    const handlePrevStep = () => {
        if (step > 1) {
            setIsAnimating(true);
            setTimeout(() => {
                setStep(step - 1);
                setIsAnimating(false);
            }, 300);
        }
    };

    const handleConfirmAppointment = () => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setIsConfirmed(true);
            
            // Redirect after confirmation
            setTimeout(() => {
                navigate('/appointments');
            }, 2000);
        }, 1500);
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { 
                duration: 0.5,
                staggerChildren: 0.1
            }
        },
        exit: { 
            opacity: 0, 
            y: -20,
            transition: { duration: 0.3 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };

    const stepVariants = {
        active: { scale: 1.1, backgroundColor: "#0d9488" },
        inactive: { scale: 1, backgroundColor: "#f1f5f9" }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 to-white py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header with Back Button */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center justify-between mb-8"
                >
                   
                    <h1 className="md:text-2xl text-sm font-bold text-gray-800">Book Your Appointment</h1>
                    <div className="w-20"></div> {/* Spacer for alignment */}
                </motion.div>

                {/* Doctor Card */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-white shadow-xl rounded-2xl p-4 sm:p-6 flex items-center gap-4 mb-8 border border-teal-100"
                >
                    <img
                        src={doctor?.image || "https://cdn-icons-png.flaticon.com/512/387/387561.png"}
                        alt={doctor?.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-teal-100"
                    />
                    <div className="flex-1">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{doctor?.name}</h2>
                        <p className="text-teal-600 font-medium">{doctor?.specialty}</p>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1 text-amber-500">
                                <FaStar />
                                <span className="font-bold">{doctor?.rating || "4.8"}</span>
                            </div>
                            <span className="text-gray-500 text-sm">•</span>
                            <span className="text-gray-600 text-sm">{doctor?.experience || "15"}+ years experience</span>
                        </div>
                    </div>
                </motion.div>

                {/* Progress Steps */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="relative mb-12"
                >
                    {/* Progress Line */}
                    <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 -z-10">
                        <motion.div 
                            className="h-full bg-teal-700"
                            initial={{ width: "0%" }}
                            animate={{ width: `${(step - 1) * 50}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                    
                    <div className="flex justify-between">
                        {[
                            { num: 1, label: "Consultation Details", icon: <FaUser /> },
                            { num: 2, label: "Date & Time", icon: <FaCalendarAlt /> },
                            { num: 3, label: "Confirmation", icon: <FaCheck /> }
                        ].map(({ num, label, icon }) => (
                            <div key={num} className="flex flex-col items-center relative z-10">
                                <motion.div
                                    variants={stepVariants}
                                    initial="inactive"
                                    animate={step >= num ? "active" : "inactive"}
                                    className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold shadow-lg
                                        ${step >= num ? "text-white" : "text-gray-600"}`}
                                >
                                    {step > num ? <FaCheck /> : icon}
                                </motion.div>
                                <p className={`text-xs sm:text-sm font-medium mt-3 text-center max-w-24
                                    ${step >= num ? "text-teal-700" : "text-gray-500"}`}>
                                    {label}
                                </p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                <AnimatePresence mode="wait">
                    {/* Step 1 */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="bg-white shadow-xl rounded-2xl p-6 sm:p-8 border border-teal-50"
                        >
                            <motion.h2 variants={itemVariants} className="text-md md:text-2xl font-bold text-gray-800 mb-2">
                                Consultation Details
                            </motion.h2>
                            <motion.p variants={itemVariants} className="text-gray-600 mb-6 md:text-xs text-sm">
                                Choose your preferred consultation type and provide patient details
                            </motion.p>

                            {/* Consultation Type */}
                            <motion.div variants={itemVariants} className="mb-8">
                                <h3 className="text-lg font-semibold text-gray-700 mb-4">Consultation Type</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Online */}
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`p-5 rounded-xl border-2 cursor-pointer transition-all duration-300
                                            ${consultType === "online" 
                                                ? "border-teal-700 bg-teal-50 shadow-md" 
                                                : "border-gray-200 hover:border-teal-300"}`}
                                        onClick={() => setConsultType("online")}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-lg ${consultType === "online" ? "bg-teal-100" : "bg-gray-100"}`}>
                                                <FaVideo className={`text-xl ${consultType === "online" ? "text-teal-700" : "text-gray-500"}`} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-800 md:text-md text-sm">Online Consultation</p>
                                                <p className="text-sm text-gray-600 mt-1">Video call with doctor</p>
                                                <p className="text-teal-700 font-bold mt-2 text-xs md:text-base">₹{doctor?.fees || "1500"}</p>
                                            </div>
                                            {consultType === "online" && (
                                                <div className="ml-auto">
                                                    <div className="w-6 h-6 rounded-full bg-teal-700 flex items-center justify-center">
                                                        <FaCheck className="text-white text-xs" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>

                                    {/* In-Clinic */}
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`p-5 rounded-xl border-2 cursor-pointer transition-all duration-300
                                            ${consultType === "clinic" 
                                                ? "border-teal-700 bg-teal-50 shadow-md" 
                                                : "border-gray-200 hover:border-teal-300"}`}
                                        onClick={() => setConsultType("clinic")}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-lg ${consultType === "clinic" ? "bg-teal-100" : "bg-gray-100"}`}>
                                                <FaClinicMedical className={`text-xl ${consultType === "clinic" ? "text-teal-700" : "text-gray-500"}`} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-800 md:text-md text-sm">In-Clinic Visit</p>
                                                <p className="text-sm text-gray-600 mt-1">Visit doctor at clinic</p>
                                                <p className="text-teal-700 font-bold mt-2 text-xs md:text-base">₹{doctor?.fees ? parseInt(doctor.fees) + 500 : "2000"}</p>
                                            </div>
                                            {consultType === "clinic" && (
                                                <div className="ml-auto">
                                                    <div className="w-6 h-6 rounded-full bg-teal-700 flex items-center justify-center">
                                                        <FaCheck className="text-white text-xs" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                </div>
                            </motion.div>

                            {/* Patient Details */}
                            

                            {/* Action Buttons */}
                            <motion.div 
                                variants={itemVariants}
                                className="flex md:flex-row flex-col gap-2 justify-between mt-10 pt-6 border-t border-gray-100"
                            >
                                <button
                                    onClick={() => navigate(-1)}
                                    className="px-6 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    disabled={!step1Valid}
                                    onClick={() => handleNextStep(2)}
                                    className={`px-8 py-3 rounded-xl font-bold transition-all duration-300 flex items-center gap-2
                                        ${step1Valid
                                            ? "bg-teal-700 text-white hover:bg-teal-800 hover:shadow-lg transform hover:-translate-y-0.5"
                                            : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                                >
                                    Continue
                                    <FaArrowLeft className="rotate-180" />
                                </button>
                            </motion.div>
                        </motion.div>
                    )}

                    {/* Step 2 */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="bg-white shadow-xl rounded-2xl p-6 sm:p-8 border border-teal-50"
                        >
                            <motion.h2 variants={itemVariants} className="text-2xl font-bold text-gray-800 mb-2">
                                Select Date & Time
                            </motion.h2>
                            <motion.p variants={itemVariants} className="text-gray-600 mb-6">
                                Choose a convenient slot for your appointment
                            </motion.p>

                            {/* Date Selection */}
                            <motion.div variants={itemVariants} className="mb-8">
                                <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                    <FaCalendarAlt className="text-teal-700" />
                                    Available Dates
                                </h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                                    {dates.map((d) => (
                                        <motion.button
                                            key={d}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setSelectedDate(d)}
                                            className={`p-4 rounded-xl border-2 text-center transition-all duration-300
                                                ${selectedDate === d
                                                    ? "bg-teal-700 text-white border-teal-700 shadow-lg"
                                                    : "border-gray-200 text-gray-700 hover:border-teal-300 hover:bg-teal-50"}`}
                                        >
                                            <div className="font-bold">{d.split(" ")[0]}</div>
                                            <div className="text-xs opacity-80">{d.split(" ")[1]} {d.split(" ")[2]}</div>
                                        </motion.button>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Time Slots */}
                            <motion.div variants={itemVariants} className="mb-8">
                                <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                    <FaClock className="text-teal-700" />
                                    Available Time Slots
                                </h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                                    {timeSlots.map((t) => (
                                        <motion.button
                                            key={t}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setSelectedTime(t)}
                                            className={`p-4 rounded-xl border-2 text-center transition-all duration-300
                                                ${selectedTime === t
                                                    ? "bg-teal-700 text-white border-teal-700 shadow-lg"
                                                    : "border-gray-200 text-gray-700 hover:border-teal-300 hover:bg-teal-50"}`}
                                        >
                                            <div className="font-bold text-lg">{t.split(":")[0]}:{t.split(":")[1].split(" ")[0]}</div>
                                            <div className="text-xs">{t.split(" ")[1]}</div>
                                        </motion.button>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Select Patient */}
                            <motion.div variants={itemVariants}>
                                <h3 className="text-lg font-semibold text-gray-700 mb-4">Select Patient ji</h3>
                                <div className="space-y-3">
                                    {patients.map((p) => (
                                        <motion.label
                                            key={p.id}
                                            whileHover={{ x: 5 }}
                                            className={`p-4 border-2 rounded-xl flex items-center gap-4 cursor-pointer transition-all duration-300
                                                ${selectedPatient === p.id 
                                                    ? "border-teal-700 bg-teal-50 shadow-sm" 
                                                    : "border-gray-200 hover:border-teal-300"}`}
                                        >
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center
                                                ${selectedPatient === p.id 
                                                    ? "border-teal-700 bg-teal-700" 
                                                    : "border-gray-300"}`}
                                            >
                                                {selectedPatient === p.id && (
                                                    <FaCheck className="text-white text-xs" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-bold text-gray-800">{p.name}</p>
                                                <p className="text-sm text-gray-600">{p.phone}</p>
                                            </div>
                                            <input
                                                type="radio"
                                                name="patient"
                                                className="hidden"
                                                value={p.id}
                                                checked={selectedPatient === p.id}
                                                onChange={() => setSelectedPatient(p.id)}
                                            />
                                        </motion.label>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Action Buttons */}
                            <motion.div 
                                variants={itemVariants}
                                className="flex justify-between mt-10 pt-6 border-t border-gray-100"
                            >
                                <button
                                    onClick={handlePrevStep}
                                    className="px-6 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                                >
                                    <FaArrowLeft />
                                    Back
                                </button>
                                <button
                                    disabled={!step2Valid}
                                    onClick={() => handleNextStep(3)}
                                    className={`px-8 py-3 rounded-xl font-bold transition-all duration-300 flex items-center gap-2
                                        ${step2Valid
                                            ? "bg-teal-700 text-white hover:bg-teal-800 hover:shadow-lg transform hover:-translate-y-0.5"
                                            : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                                >
                                    Continue
                                    <FaArrowLeft className="rotate-180" />
                                </button>
                            </motion.div>
                        </motion.div>
                    )}

                    {/* Step 3 – Review */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="bg-white shadow-xl rounded-2xl p-6 sm:p-8 border border-teal-50"
                        >
                            {!isConfirmed ? (
                                <>
                                    <motion.h2 variants={itemVariants} className="text-2xl font-bold text-gray-800 mb-2">
                                        Review & Confirm
                                    </motion.h2>
                                    <motion.p variants={itemVariants} className="text-gray-600 mb-6">
                                        Please review all details before confirming your appointment
                                    </motion.p>

                                    <motion.div variants={itemVariants} className="space-y-6">
                                        {/* Appointment Summary */}
                                        <div className="bg-teal-50 rounded-xl p-5 border border-teal-100">
                                            <h3 className="text-lg font-bold text-teal-800 mb-3">Appointment Summary</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-teal-600"></div>
                                                        <span className="font-medium text-gray-700">Consultation Type:</span>
                                                        <span className="text-gray-800 font-bold capitalize">{consultType}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-teal-600"></div>
                                                        <span className="font-medium text-gray-700">Date:</span>
                                                        <span className="text-gray-800 font-bold">{selectedDate}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-teal-600"></div>
                                                        <span className="font-medium text-gray-700">Time:</span>
                                                        <span className="text-gray-800 font-bold">{selectedTime}</span>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-teal-600"></div>
                                                        <span className="font-medium text-gray-700">Patient:</span>
                                                        <span className="text-gray-800 font-bold">
                                                            {patients.find((p) => p.id === selectedPatient)?.name}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-teal-600"></div>
                                                        <span className="font-medium text-gray-700">Fees:</span>
                                                        <span className="text-teal-700 font-bold">
                                                            ₹{consultType === "clinic" 
                                                                ? (doctor?.fees ? parseInt(doctor.fees) + 500 : "2000")
                                                                : (doctor?.fees || "1500")}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Doctor Info */}
                                        <div className="border border-gray-200 rounded-xl p-5">
                                            <h3 className="text-lg font-bold text-gray-800 mb-3">Doctor Information</h3>
                                            <div className="flex items-center gap-4">
                                                <img
                                                    src={doctor?.image}
                                                    alt={doctor?.name}
                                                    className="w-16 h-16 rounded-full object-cover border-2 border-teal-200"
                                                />
                                                <div>
                                                    <h4 className="font-bold text-gray-800">{doctor?.name}</h4>
                                                    <p className="text-teal-600">{doctor?.specialty}</p>
                                                    <p className="text-gray-600 text-sm">{doctor?.hospital}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Success Message */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-green-50 border border-green-200 rounded-xl p-4"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                                    <FaCheck className="text-green-600" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-green-800">All details verified!</p>
                                                    <p className="text-green-700 text-sm">Ready to confirm your appointment</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </motion.div>

                                    {/* Action Buttons */}
                                    <motion.div 
                                        variants={itemVariants}
                                        className="flex justify-between mt-10 pt-6 border-t border-gray-100"
                                    >
                                        <button
                                            onClick={handlePrevStep}
                                            className="px-6 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                                        >
                                            <FaArrowLeft />
                                            Back
                                        </button>
                                        <button
                                            onClick={handleConfirmAppointment}
                                            disabled={isLoading}
                                            className="px-8 py-3 bg-teal-700 text-white rounded-xl font-bold hover:bg-teal-800 hover:shadow-lg transition-all duration-300 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    <FaCheck />
                                                    Confirm Appointment
                                                </>
                                            )}
                                        </button>
                                    </motion.div>
                                </>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-12"
                                >
                                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <FaCheck className="text-green-600 text-4xl" />
                                    </div>
                                    <h2 className="text-3xl font-bold text-gray-800 mb-3">Appointment Confirmed!</h2>
                                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                        Your appointment with Dr. {doctor?.name} has been successfully booked. 
                                        You will receive a confirmation email and SMS shortly.
                                    </p>
                                    <div className="bg-teal-50 rounded-xl p-6 max-w-md mx-auto">
                                        <p className="font-bold text-teal-800 mb-2">Appointment Details</p>
                                        <p className="text-gray-700">
                                            {selectedDate} at {selectedTime} • {consultType?.toUpperCase()} Consultation
                                        </p>
                                        <p className="text-sm text-gray-600 mt-3">
                                            Please arrive 10 minutes before your scheduled time
                                        </p>
                                    </div>
                                    <div className="mt-8">
                                        <div className="w-12 h-1 bg-teal-700 mx-auto mb-4"></div>
                                        <p className="text-gray-500 text-sm">Redirecting to appointments...</p>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

export default BookAppointment;