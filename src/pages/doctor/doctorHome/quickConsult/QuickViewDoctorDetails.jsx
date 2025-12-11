// src/pages/doctor/doctorHome/quickConsult/QuickViewDoctorDetails.jsx

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaStar, FaGraduationCap, FaHospitalAlt, FaCheckCircle } from "react-icons/fa";
import { MdWork, MdOutlineLanguage } from "react-icons/md";
import { IoPersonCircleOutline, IoSchoolOutline } from "react-icons/io5";
import { TbHeartPlus } from "react-icons/tb";

export default function QuickViewDoctorDetails() {
    const [consultTypeClinic, setConsultTypeClinic] = useState(null);
    const [consultTypeVideo, setConsultTypeVideo] = useState(null);
    const [selectedFee, setSelectedFee] = useState(0);
    
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, []);

    const { state } = useLocation();
    const doctor = state?.doctor || {
        name: "Dr. Evelyn Reed",
        specialty: "Pediatric Cardiologist",
        rating: 4.9,
        reviews: 875,
        experience: 15,
        consultationFee: 150,
        education: "MD, Harvard Medical School",
        languages: ["English", "Spanish", "French"],
        recentConsultations: 120,
        image: "/doctor-image.jpg"
    };

    const navigate = useNavigate();

    const handleProceedToPay = () => {
        if (!consultTypeVideo && !consultTypeClinic) {
            alert("Please select a consultation type");
            return;
        }
        
        const consultationData = {
            doctor,
            consultationType: consultTypeVideo ? "Video Consultation" : "In-Person Visit",
            fee: selectedFee
        };
        console.log(consultationData)
        
        navigate('/doctor/quick-consult/payment', { state: consultationData });
    };

    const handleVideoSelect = () => {
        setConsultTypeVideo(true);
        setConsultTypeClinic(false);
        setSelectedFee(doctor?.consultationFee);
    };

    const handleClinicSelect = () => {
        setConsultTypeVideo(false);
        setConsultTypeClinic(true);
        setSelectedFee(doctor?.consultationFee + 150);
    };

    return (
        <div className="min-h-screen ">
            <div className="container mx-auto px-4 sm:px-6 py-6 ">
                {/* Header Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex items-start space-x-4">
                            <div className="">
                                <img 
                                    src={doctor.image} 
                                    className='w-20 h-20 rounded-full object-cover' 
                                    alt={doctor.name} 
                                />
                            </div>

                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-teal-700">{doctor?.name}</h1>
                                <p className="text-lg text-teal-600 font-medium mt-1">{doctor?.specialty}</p>

                                <div className="flex items-center mt-3 space-x-4">
                                    <div className="flex items-center">
                                        <FaStar className="text-yellow-400 w-5 h-5" />
                                        <span className="ml-1 text-lg font-bold text-gray-900">{doctor?.rating}</span>
                                        <span className="ml-1 text-gray-500">({doctor?.reviews} Reviews)</span>
                                    </div>

                                    <div className="flex items-center text-gray-600">
                                        <FaHospitalAlt className="w-4 h-4 mr-1" />
                                        <span>{doctor?.recentConsultations} recent consultations</span>
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
                                    <li className="flex items-start">
                                        <FaCheckCircle className="w-4 h-4 text-teal-500 mt-1 mr-2 flex-shrink-0" />
                                        <span>MD, Harvard Medical School</span>
                                    </li>
                                    <li className="flex items-start">
                                        <FaCheckCircle className="w-4 h-4 text-teal-500 mt-1 mr-2 flex-shrink-0" />
                                        <span>Board Certified in Pediatric Cardiology</span>
                                    </li>
                                    <li className="flex items-start">
                                        <FaCheckCircle className="w-4 h-4 text-teal-500 mt-1 mr-2 flex-shrink-0" />
                                        <span>Fellowship in Congenital Heart Disease</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Year of Experience & Fee */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-1">
                                <div className="flex gap-2 rounded-xl mb-1 md:mb-4">
                                    <div className="flex items-center">
                                        <MdWork className="w-5 h-5 text-teal-600 mr-2" />
                                        <span className="font-semibold text-gray-700">Year of Experience:</span>
                                    </div>
                                    <p className="text-lg font-bold text-gray-900">{doctor?.experience} years</p>
                                </div>

                                {/* <div className="flex justify-center items-center gap-2 rounded-xl">
                                    <div className="flex items-center">
                                        <TbHeartPlus className="w-5 h-5 text-teal-600 mr-2" />
                                        <span className="font-semibold text-gray-700">Consultation Fee:</span>
                                    </div>
                                    <p className="text-lg font-bold text-gray-900">₹{doctor?.consultationFee}</p>
                                </div> */}
                            </div>

                            {/* Languages */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                                    <MdOutlineLanguage className="w-5 h-5 mr-2 text-teal-600" />
                                    Language:
                                </h3>
                                <div className="overflow-x-auto">
                                    <div className="flex space-x-3">
                                        {doctor.languages?.map((language, index) => (
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
                                    <div className="text-4xl font-bold text-gray-900">{doctor?.rating}</div>
                                    <div className="ml-4">
                                        <div className="flex">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <FaStar
                                                    key={star}
                                                    className={`w-5 h-5 ${star <= Math.floor(doctor?.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-gray-600 mt-1">({doctor?.reviews} Reviews)</p>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <div className="text-3xl font-bold text-teal-600">{doctor?.recentConsultations}</div>
                                    <p className="text-gray-600">recent consultations</p>
                                </div>
                            </div>

                            {/* Recent Reviews Section */}
                            <div className="mt-8">
                                <h3 className="font-semibold text-gray-800 mb-4">Recent Reviews</h3>
                                <div className="space-y-4">
                                    <div className="flex items-start space-x-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                                            <IoPersonCircleOutline className="w-6 h-6 text-gray-400" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium">Sarah Johnson</span>
                                                <div className="flex items-center text-yellow-400">
                                                    <FaStar className="w-4 h-4" />
                                                    <FaStar className="w-4 h-4" />
                                                    <FaStar className="w-4 h-4" />
                                                    <FaStar className="w-4 h-4" />
                                                    <FaStar className="w-4 h-4" />
                                                </div>
                                            </div>
                                            <p className="text-gray-600 text-sm mt-1">
                                                Dr. Reed was incredibly patient and thorough with my daughter. She explained everything in detail.
                                            </p>
                                            <span className="text-gray-400 text-xs mt-1 block">2 days ago</span>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                                            <IoPersonCircleOutline className="w-6 h-6 text-gray-400" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium">Michael Chen</span>
                                                <div className="flex items-center text-yellow-400">
                                                    <FaStar className="w-4 h-4" />
                                                    <FaStar className="w-4 h-4" />
                                                    <FaStar className="w-4 h-4" />
                                                    <FaStar className="w-4 h-4" />
                                                    <FaStar className="w-4 h-4" />
                                                </div>
                                            </div>
                                            <p className="text-gray-600 text-sm mt-1">
                                                Excellent doctor! Very knowledgeable and caring approach. My son feels much better now.
                                            </p>
                                            <span className="text-gray-400 text-xs mt-1 block">1 week ago</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Action Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-2xl shadow-sm border border-teal-100 p-6 sticky top-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Schedule Consultation</h3>
                            <div className="space-y-4 mb-6">
                                <div
                                    onClick={handleVideoSelect}
                                    className={`cursor-pointer rounded-xl p-4 border transition-all duration-200 ${
                                        consultTypeVideo 
                                            ? "bg-teal-100 border-teal-300 shadow-md" 
                                            : "bg-white border-gray-200 hover:bg-gray-50"
                                    }`}
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-medium text-gray-700">Video Consultation</span>
                                        <span className="text-lg font-bold text-teal-600">₹ {doctor?.consultationFee}</span>
                                    </div>
                                    <p className="text-sm text-gray-500">30-45 minutes • Available today</p>
                                </div>

                                {/* <div
                                    onClick={handleClinicSelect}
                                    className={`cursor-pointer rounded-xl p-4 border transition-all duration-200 ${
                                        consultTypeClinic 
                                            ? "bg-teal-100 border-teal-300 shadow-md" 
                                            : "bg-white border-gray-200 hover:bg-gray-50"
                                    }`}
                                 >
                                    <div className="flex justify-between items-center mb-2">
                                        {console.log("check",doctor)}
                                        <span className="font-medium text-gray-700">In-Person Visit</span>
                                        <span className="text-lg font-bold text-teal-600">₹ {doctor?.consultationFee + 150 }</span>
                                    </div>
                                    <p className="text-sm text-gray-500">60 minutes • By appointment</p>
                                </div> */}
                            </div>

                            <div className="space-y-3">
                                <button
                                    onClick={handleProceedToPay}
                                    disabled={!selectedFee}
                                    className={`w-full font-semibold py-3 px-4 rounded-xl transition duration-200 flex items-center justify-center ${
                                        selectedFee 
                                            ? "bg-teal-600 hover:bg-teal-700 text-white" 
                                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    }`}
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                    </svg>
                                    {selectedFee ? "Proceed to Pay & Connect" : "Select Consultation Type"}
                                </button>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <h4 className="font-semibold text-gray-700 mb-3">Why choose Dr. {doctor?.name?.split(' ')[1] || doctor?.name}?</h4>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-start">
                                        <FaCheckCircle className="w-4 h-4 text-teal-500 mt-0.5 mr-2 flex-shrink-0" />
                                        <span>Board certified specialist</span>
                                    </li>
                                    <li className="flex items-start">
                                        <FaCheckCircle className="w-4 h-4 text-teal-500 mt-0.5 mr-2 flex-shrink-0" />
                                        <span>15+ years of experience</span>
                                    </li>
                                    <li className="flex items-start">
                                        <FaCheckCircle className="w-4 h-4 text-teal-500 mt-0.5 mr-2 flex-shrink-0" />
                                        <span>Multilingual consultation</span>
                                    </li>
                                    <li className="flex items-start">
                                        <FaCheckCircle className="w-4 h-4 text-teal-500 mt-0.5 mr-2 flex-shrink-0" />
                                        <span>Same-day appointments available</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}