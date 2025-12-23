// src/pages/doctor/doctorHome/doctors/ViewDoctorDetails.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaStar, FaGraduationCap, FaHospitalAlt, FaCheckCircle, FaCalendarAlt } from "react-icons/fa";
import { MdWork, MdOutlineLanguage } from "react-icons/md";
import { IoPersonCircleOutline, IoSchoolOutline } from "react-icons/io5";
import SelectSlotModal from './SelectSlotModal';

export default function ViewDoctorDetails() {
    const [consultTypeClinic, setConsultTypeClinic] = useState(null);
    const [consultTypeVideo, setConsultTypeVideo] = useState(null);
    const [selectedFee, setSelectedFee] = useState(0);
    const [showDateModal, setShowDateModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTimeSlot, setSelectedTimeSlot] = useState('');

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        // Initialize with today's date
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        setSelectedDate(formattedDate);
    }, []);

    const { state } = useLocation();
    const doctor = state?.doctor;

    // Fallback doctor data if state is not available (for development)
    const fallbackDoctor = {
        firstName: "Dr. Evelyn",
        lastName: "Reed",
        specialization: "Pediatric Cardiologist",
        ratingsReceived: [],
        yearsOfExperience: 15,
        consultationFee: 150,
        qualification: [{ degreeName: "MD, Harvard Medical School" }],
        languages: ["English", "Spanish", "French"],
        bannerImage: "https://via.placeholder.com/150",
        profilePicture: "https://via.placeholder.com/150"
    };

    const displayDoctor = doctor || fallbackDoctor;

    const navigate = useNavigate();

    const handleVideoSelect = () => {
        setConsultTypeVideo(true);
        setConsultTypeClinic(false);
        setSelectedFee(getConsultationFee());
        setShowDateModal(true);
    };

    const handleClinicSelect = () => {
        setConsultTypeVideo(false);
        setConsultTypeClinic(true);
        const baseFee = getConsultationFee();
        setSelectedFee(baseFee + 150);
        setShowDateModal(true);
    };

    const handleProceedToPay = () => {
        if (!consultTypeVideo && !consultTypeClinic) {
            alert("Please select a consultation type");
            return;
        }

        if (!selectedDate || !selectedTimeSlot) {
            alert("Please select both date and time slot");
            return;
        }

        const consultationData = {
            doctor: displayDoctor,
            consultationType: consultTypeVideo ? "Video Consultation" : "In-Person Visit",
            fee: selectedFee,
            appointmentDate: selectedDate,
            appointmentTime: selectedTimeSlot,
            formattedDate: new Date(selectedDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        };
        console.log("Appointment Data:", consultationData);

        // Close modal and navigate to payment
        setShowDateModal(false);
        navigate('/doctor/quick-consult/payment', { state: consultationData });
    };

    const formatSelectedDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const closeModal = () => {
        setShowDateModal(false);
        // Reset selection if no date/time selected
        if (!selectedTimeSlot) {
            setConsultTypeVideo(false);
            setConsultTypeClinic(false);
            setSelectedFee(0);
        }
    };

    const handleSlotSelection = (date, timeSlot) => {
        setSelectedDate(date);
        setSelectedTimeSlot(timeSlot);
    };

    const handleConfirmSlot = () => {
        handleProceedToPay();
    };

    // Helper function to render qualifications
    const renderQualifications = () => {
        const qual = displayDoctor?.qualification;
        
        if (qual && Array.isArray(qual)) {
            return qual.map((q, index) => (
                <li key={index} className="flex items-start">
                    <FaCheckCircle className="w-4 h-4 text-teal-500 mt-1 mr-2 flex-shrink-0" />
                    <span className='uppercase'>{q.degreeName || 'Not specified'}</span>
                </li>
            ));
        }
        
        return (
            <li className="flex items-start">
                <FaCheckCircle className="w-4 h-4 text-teal-500 mt-1 mr-2 flex-shrink-0" />
                <span>No qualification information available</span>
            </li>
        );
    };

    // Helper function to get consultation fee safely
    const getConsultationFee = () => {
        return displayDoctor?.consultationFee || 0;
    };

    // Helper function to get rating and reviews
    const getRatingData = () => {
        const ratings = displayDoctor?.ratingsReceived || [];
        if (ratings.length === 0) {
            return { averageRating: 4.9, reviewCount: 875 };
        }
        
        const totalRating = ratings.reduce((sum, rating) => sum + rating.rating, 0);
        const averageRating = totalRating / ratings.length;
        
        return {
            averageRating: averageRating.toFixed(1),
            reviewCount: ratings.length
        };
    };

    const ratingData = getRatingData();

    // Helper function to get hospital name
    const getHospitalName = () => {
        const hospital = displayDoctor?.hospitalAffiliation?.[0];
        return hospital?.hospitalName || "Not specified";
    };

    // Helper function to get languages
    const getLanguages = () => {
        // Assuming languages might be stored differently
        // You can update this based on your actual data structure
        return displayDoctor?.languages || ["English", "Hindi"];
    };

    return (
        <div className="min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 py-6">
                {/* Header Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex items-start space-x-4">
                            <div className="">
                                <img
                                    src={displayDoctor?.profilePicture || displayDoctor?.bannerImage}
                                    className='w-20 h-20 rounded-full object-cover'
                                    alt={`${displayDoctor?.firstName} ${displayDoctor?.lastName}`}
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/150';
                                    }}
                                />
                            </div>

                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-teal-700">
                                    Dr. {displayDoctor?.firstName} {displayDoctor?.lastName}
                                </h1>
                                <p className="text-lg text-teal-600 font-medium mt-1">
                                    {displayDoctor?.specialization}
                                </p>

                                <div className="flex items-center mt-3 space-x-4">
                                    <div className="flex items-center">
                                        <FaStar className="text-yellow-400 w-5 h-5" />
                                        <span className="ml-1 text-lg font-bold text-gray-900">{ratingData.averageRating}</span>
                                        <span className="ml-1 text-gray-500">({ratingData.reviewCount} Reviews)</span>
                                    </div>

                                    <div className="flex items-center text-gray-600">
                                        <FaHospitalAlt className="w-4 h-4 mr-1" />
                                        <span>Consultation Fee: ₹{getConsultationFee()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Professional Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Professional Details Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-3 border-b border-gray-200">
                                Professional Details
                            </h2>

                            {/* Qualifications */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                                    <IoSchoolOutline className="w-5 h-5 mr-2 text-teal-600" />
                                    Qualifications:
                                </h3>
                                <ul className="space-y-2 pl-7">
                                    {renderQualifications()}
                                </ul>
                            </div>

                            {/* Year of Experience & Hospital */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div className="flex gap-2 rounded-xl">
                                    <div className="flex items-center">
                                        <MdWork className="w-5 h-5 text-teal-600 mr-2" />
                                        <span className="font-semibold text-gray-700">Years of Experience:</span>
                                    </div>
                                    <p className="text-lg font-bold text-gray-900">{displayDoctor?.yearsOfExperience || 0} years</p>
                                </div>
                                
                                <div className="flex gap-2 rounded-xl">
                                    <div className="flex items-center">
                                        <FaHospitalAlt className="w-5 h-5 text-teal-600 mr-2" />
                                        <span className="font-semibold text-gray-700">Hospital:</span>
                                    </div>
                                    <p className="text-lg font-bold text-gray-900">{getHospitalName()}</p>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">Contact Information</h3>
                                <div className="space-y-2">
                                    <p className="text-gray-700">
                                        <span className="font-semibold">Email:</span> {displayDoctor?.email || "Not provided"}
                                    </p>
                                    <p className="text-gray-700">
                                        <span className="font-semibold">Phone:</span> {displayDoctor?.contactNumber || "Not provided"}
                                    </p>
                                    <p className="text-gray-700">
                                        <span className="font-semibold">Available Hours:</span> {displayDoctor?.availableHours || "09:00 AM - 05:00 PM"}
                                    </p>
                                </div>
                            </div>

                            {/* Languages */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                                    <MdOutlineLanguage className="w-5 h-5 mr-2 text-teal-600" />
                                    Languages:
                                </h3>
                                <div className="overflow-x-auto">
                                    <div className="flex space-x-3">
                                        {getLanguages().map((language, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 border border-teal-200 text-teal-400 bg-teal-50 rounded-md text-sm"
                                            >
                                                {language}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-gray-300 my-6"></div>

                        {/* Patient Feedback Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">
                                Patient Feedback
                            </h2>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="text-4xl font-bold text-gray-900">{ratingData.averageRating}</div>
                                    <div className="ml-4">
                                        <div className="flex">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <FaStar
                                                    key={star}
                                                    className={`w-5 h-5 ${star <= Math.floor(ratingData.averageRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-gray-600 mt-1">({ratingData.reviewCount} Reviews)</p>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <div className="text-3xl font-bold text-teal-600">
                                        {displayDoctor?.yearsOfExperience || 0}+
                                    </div>
                                    <p className="text-gray-600">years of experience</p>
                                </div>
                            </div>

                            {/* Recent Reviews Section - Show actual reviews if available */}
                            {displayDoctor?.ratingsReceived && displayDoctor.ratingsReceived.length > 0 ? (
                                <div className="mt-8">
                                    <h3 className="font-semibold text-gray-800 mb-4">Recent Reviews</h3>
                                    <div className="space-y-4">
                                        {displayDoctor.ratingsReceived.slice(0, 3).map((review, index) => (
                                            <div key={index} className="flex items-start space-x-3">
                                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                                                    <IoPersonCircleOutline className="w-6 h-6 text-gray-400" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-medium">
                                                            {review.patientName || "Anonymous"}
                                                        </span>
                                                        <div className="flex items-center text-yellow-400">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <FaStar
                                                                    key={star}
                                                                    className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <p className="text-gray-600 text-sm mt-1">
                                                        {review.comment || "No comment provided"}
                                                    </p>
                                                    <span className="text-gray-400 text-xs mt-1 block">
                                                        {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : "Recently"}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-8 text-center py-8 text-gray-500">
                                    <p>No reviews yet. Be the first to review!</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Action Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-2xl shadow-sm border border-teal-100 p-6 sticky top-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Schedule Consultation</h3>

                            {/* Display selected appointment details if any */}
                            {(selectedDate && selectedTimeSlot) && (
                                <div className="mb-4 p-3 bg-white rounded-lg border border-teal-200">
                                    <div className="flex items-center text-teal-600 mb-1">
                                        <FaCalendarAlt className="w-4 h-4 mr-2" />
                                        <span className="font-medium">Selected Appointment:</span>
                                    </div>
                                    <p className="text-sm text-gray-700">
                                        {formatSelectedDate(selectedDate)} at {selectedTimeSlot}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {consultTypeVideo ? "Video Consultation" : "Clinic Visit"}
                                    </p>
                                </div>
                            )}

                            <div className="space-y-4 mb-6">
                                <div
                                    onClick={handleVideoSelect}
                                    className={`cursor-pointer rounded-xl p-4 border transition-all duration-200 ${consultTypeVideo
                                        ? "bg-teal-100 border-teal-300 shadow-md"
                                        : "bg-white border-gray-200 hover:bg-gray-50"
                                        }`}
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-medium text-gray-700">Video Consultation</span>
                                        <span className="text-lg font-bold text-teal-600">₹ {getConsultationFee()}</span>
                                    </div>
                                    <p className="text-sm text-gray-500">30-45 minutes • Available today</p>
                                </div>

                                <div
                                    onClick={handleClinicSelect}
                                    className={`cursor-pointer rounded-xl p-4 border transition-all duration-200 ${consultTypeClinic
                                        ? "bg-teal-100 border-teal-300 shadow-md"
                                        : "bg-white border-gray-200 hover:bg-gray-50"
                                        }`}
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-medium text-gray-700">In-Person Visit</span>
                                        <span className="text-lg font-bold text-teal-600">₹ {getConsultationFee() + 150}</span>
                                    </div>
                                    <p className="text-sm text-gray-500">60 minutes • By appointment</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <button
                                    onClick={handleProceedToPay}
                                    disabled={!selectedDate || !selectedTimeSlot}
                                    className={`w-full font-semibold py-3 px-4 rounded-xl transition duration-200 flex items-center justify-center ${(selectedDate && selectedTimeSlot)
                                        ? "bg-teal-600 hover:bg-teal-700 text-white"
                                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        }`}
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                    </svg>
                                    {(selectedDate && selectedTimeSlot) ? "Proceed to Pay & Connect" : "Select Date & Time"}
                                </button>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <h4 className="font-semibold text-gray-700 mb-3">
                                    Why choose Dr. {displayDoctor?.lastName || displayDoctor?.firstName}?
                                </h4>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-start">
                                        <FaCheckCircle className="w-4 h-4 text-teal-500 mt-0.5 mr-2 flex-shrink-0" />
                                        <span>{displayDoctor?.isPremium ? "Premium verified doctor" : "Board certified specialist"}</span>
                                    </li>
                                    <li className="flex items-start">
                                        <FaCheckCircle className="w-4 h-4 text-teal-500 mt-0.5 mr-2 flex-shrink-0" />
                                        <span>{displayDoctor?.yearsOfExperience || 0}+ years of experience</span>
                                    </li>
                                    <li className="flex items-start">
                                        <FaCheckCircle className="w-4 h-4 text-teal-500 mt-0.5 mr-2 flex-shrink-0" />
                                        <span>Available: {displayDoctor?.availableHours || "09:00 AM - 05:00 PM"}</span>
                                    </li>
                                    <li className="flex items-start">
                                        <FaCheckCircle className="w-4 h-4 text-teal-500 mt-0.5 mr-2 flex-shrink-0" />
                                        <span>{displayDoctor?.verified ? "Verified doctor" : "Same-day appointments available"}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Date & Time Selection Modal */}
            {showDateModal && (
                <div
                    onClick={closeModal}
                    className="fixed inset-0 backdrop-brightness-50 flex items-center justify-center z-50 p-4">
                    <SelectSlotModal
                        isOpen={showDateModal}
                        onClose={closeModal}
                        onConfirm={handleConfirmSlot}
                        onSlotSelect={handleSlotSelection}
                        selectedDate={selectedDate}
                        selectedTimeSlot={selectedTimeSlot}
                        consultTypeVideo={consultTypeVideo}
                        consultTypeClinic={consultTypeClinic}
                        selectedFee={selectedFee}
                    />
                </div>
            )}
        </div>
    );
}