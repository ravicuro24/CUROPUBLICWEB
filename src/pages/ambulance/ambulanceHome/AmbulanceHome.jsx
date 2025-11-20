// src/pages/ambulance/ambulanceHome/AmbulanceHome.jsx
import React from 'react';
import {
    FaAmbulance,
    FaPhone,
    FaMapMarkerAlt,
    FaClock,
    FaUserMd,
    FaHeart,
    FaShieldAlt,
    FaStar,
    FaRocket,
    FaCalendarAlt
} from 'react-icons/fa';
import {
    GiHospitalCross,
    GiHeartBeats
} from 'react-icons/gi';

function AmbulanceHome() {
    const upcomingFeatures = [
        {
            id: 1,
            title: "Emergency Response",
            description: "24/7 emergency ambulance services with trained paramedics",
            icon: <FaAmbulance className="text-3xl text-red-500" />,
            color: "bg-red-50 border-red-200",
            progress: 85
        },
        {
            id: 2,
            title: "Medical Transport",
            description: "Safe patient transport between facilities",
            icon: <GiHospitalCross className="text-3xl text-blue-500" />,
            color: "bg-blue-50 border-blue-200",
            progress: 70
        },
        {
            id: 3,
            title: "Critical Care",
            description: "Advanced life support during transport",
            icon: <GiHeartBeats className="text-3xl text-green-500" />,
            color: "bg-green-50 border-green-200",
            progress: 60
        },
        {
            id: 4,
            title: "First Aid",
            description: "Immediate medical care at the scene",
            icon: <FaHeart className="text-3xl text-purple-500" />,
            color: "bg-purple-50 border-purple-200",
            progress: 75
        }
    ];

    const features = [
        { icon: <FaClock className="text-lg" />, text: "Quick Response Time" },
        { icon: <FaUserMd className="text-lg" />, text: "Trained Paramedics" },
        { icon: <FaShieldAlt className="text-lg" />, text: "Fully Equipped" },
        { icon: <FaStar className="text-lg" />, text: "5-Star Service" }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
            {/* Header Section */}
            <div className="text-center mb-12 animate-fade-in">
                <div className="flex items-center justify-center mb-4">
                    <div className="relative">
                        <FaAmbulance className="text-6xl text-gray-400 animate-pulse" />
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full animate-ping"></div>
                    </div>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                    Ambulance Services
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Revolutionary emergency medical services coming soon to transform healthcare delivery
                </p>
            </div>

            {/* Coming Soon Banner */}
            <div className="max-w-4xl mx-auto mb-12">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-8 text-white text-center shadow-2xl transform hover:scale-105 transition-transform duration-300 animate-pulse-slow">
                    <div className="flex items-center justify-center mb-4">
                        <FaRocket className="text-2xl mr-3 animate-bounce" />
                        <h2 className="text-3xl font-bold">Coming Soon</h2>
                    </div>
                    <div className="text-4xl md:text-5xl font-bold mb-4 animate-pulse">
                        Launching 2025
                    </div>
                    <p className="text-yellow-100 text-lg">
                        We're building the future of emergency medical services
                    </p>
                </div>
            </div>

            {/* Features Grid */}
            <div className="max-w-6xl mx-auto mb-16">
                <h3 className="text-3xl font-bold text-center text-gray-800 mb-8">
                    What to Expect
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-center bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200"
                        >
                            <div className="text-gray-500 mr-3 animate-bounce-slow">
                                {feature.icon}
                            </div>
                            <span className="font-semibold text-gray-700">{feature.text}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Upcoming Features Grid */}
            <div className="max-w-6xl mx-auto mb-16">
                <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">
                    Upcoming Features
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {upcomingFeatures.map((feature, index) => (
                        <div
                            key={feature.id}
                            className={`bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl border-2 ${feature.color} animate-float relative overflow-hidden`}
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            {/* Coming Soon Badge */}
                            <div className="absolute top-4 right-4">
                                <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-semibold animate-pulse">
                                    SOON
                                </span>
                            </div>

                            <div className="text-center mb-4">
                                <div className="inline-block p-3 rounded-full bg-gray-50 shadow-md">
                                    {feature.icon}
                                </div>
                            </div>

                            <h4 className="text-xl font-semibold text-gray-800 text-center mb-3">
                                {feature.title}
                            </h4>

                            <p className="text-gray-600 text-center mb-4">
                                {feature.description}
                            </p>

                            {/* Progress Bar */}
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                                <div
                                    className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000 ease-out"
                                    style={{ width: `${feature.progress}%` }}
                                ></div>
                            </div>

                            <div className="text-center">
                                <span className="text-sm text-gray-500 font-medium">
                                    {feature.progress}% Complete
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Countdown Section */}
            

            {/* Notify Me Section */}
            <div className="max-w-2xl mx-auto text-center">
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-8 text-white shadow-2xl animate-fade-in-up">
                    <FaRocket className="text-4xl mx-auto mb-4 animate-bounce-slow" />
                    <h3 className="text-2xl font-bold mb-4">Be the First to Know</h3>
                    <p className="text-gray-300 mb-6">
                        Get notified when our ambulance services go live and be among the first to experience revolutionary emergency care.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="px-4 py-3 rounded-full text-gray-800 flex-1 min-w-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button className="bg-blue-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-600 transition-colors duration-300 transform hover:scale-105 flex items-center justify-center whitespace-nowrap">
                            <FaPhone className="mr-2" />
                            Notify Me
                        </button>
                    </div>
                </div>
            </div>
            

            {/* Floating Notification Button */}
            <div className="fixed bottom-6 right-6">
                <button className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center text-white shadow-2xl transform hover:scale-110 hover:rotate-12 transition-all duration-300 animate-bounce">
                    <FaAmbulance className="text-2xl" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></span>
                </button>
            </div>

            {/* Moving Ambulance Animation */}
            <div className="fixed bottom-20 left-0 right-0 hidden lg:block opacity-50">
                <div className="animate-move-ambulance-slow">
                    <FaAmbulance className="text-4xl text-gray-400" />
                </div>
            </div>
        </div>
    );
}

export default AmbulanceHome;