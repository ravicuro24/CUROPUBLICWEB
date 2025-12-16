import React, { useEffect, useState } from 'react';
import {
    Search,
    Droplet,
    Users,
    Clock,
    Phone,
    MapPin,
    AlertCircle,
    Filter,
    ChevronRight
} from 'lucide-react';
import { DNA } from 'react-loader-spinner';

function BloodBankHome() {
    const [bloodType, setBloodType] = useState('');
    const [location, setLocation] = useState('');

    useEffect(()=>{
        window.scrollTo({
            top:0,
            behavior:'smooth'
        })
    },[])

    // Mock data for blood inventory
    const bloodInventory = [
        { type: 'A+', units: 45, status: 'Available', color: 'bg-red-100 border-red-500' },
        { type: 'A-', units: 22, status: 'Available', color: 'bg-red-50 border-red-400' },
        { type: 'B+', units: 38, status: 'Available', color: 'bg-blue-100 border-blue-500' },
        { type: 'B-', units: 15, status: 'Low', color: 'bg-blue-50 border-blue-400' },
        { type: 'O+', units: 67, status: 'Available', color: 'bg-green-100 border-green-500' },
        { type: 'O-', units: 12, status: 'Critical', color: 'bg-yellow-100 border-yellow-500' },
        { type: 'AB+', units: 28, status: 'Available', color: 'bg-purple-100 border-purple-500' },
        { type: 'AB-', units: 8, status: 'Low', color: 'bg-purple-50 border-purple-400' },
    ];

    // Emergency requests
    const emergencyRequests = [
        { id: 1, bloodType: 'O-', patient: 'John Smith', hospital: 'City General', time: '2 hours ago', priority: 'Critical' },
        { id: 2, bloodType: 'B+', patient: 'Sarah Johnson', hospital: 'Memorial Hospital', time: '4 hours ago', priority: 'High' },
    ];

    const upcomingDrives = [
        { date: 'Dec 25, 2023', location: 'Community Center', time: '9 AM - 4 PM' },
        { date: 'Jan 5, 2024', location: 'Downtown Mall', time: '10 AM - 6 PM' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-r from-red-600 to-red-800 text-white">

                {/* DNA SVG BACKGROUND */}
                <svg
                    className="absolute right-0 top-1/2 -translate-y-1/2 
                   w-[400px] md:w-[400px] lg:w-[500px] 
                   opacity-15 pointer-events-none"
                    viewBox="0 0 200 600"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* Strand 1 */}
                    <path
                        d="M80 0 C20 100, 20 200, 80 300 C140 400, 140 500, 80 600"
                        stroke="white"
                        strokeWidth="6"
                        strokeLinecap="round"
                    />

                    {/* Strand 2 */}
                    <path
                        d="M120 0 C180 100, 180 200, 120 300 C60 400, 60 500, 120 600"
                        stroke="white"
                        strokeWidth="6"
                        strokeLinecap="round"
                    />

                    {/* Rungs */}
                    {[...Array(14)].map((_, i) => (
                        <line
                            key={i}
                            x1="80"
                            y1={i * 45}
                            x2="120"
                            y2={i * 45 + 20}
                            stroke="white"
                            strokeWidth="4"
                        />
                    ))}
                </svg>

                {/* CONTENT */}
                <div className="relative max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Save Lives, Donate Blood
                        </h1>

                        <p className="text-xl mb-8 max-w-3xl mx-auto">
                            Join our community of life-savers. Every donation can save up to 3 lives.
                        </p>

                        {/* Search Bar */}
                        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-4">
                            <div className="flex flex-col md:flex-row gap-4">

                                {/* Blood Type */}
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-red-700 mb-2">
                                        Blood Type Needed
                                    </label>
                                    <select
                                        className="w-full font-bold p-3 border border-red-500 bg-red-100 text-red-500 border-gray-300 rounded-lg
                                       focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    >
                                        <option value="">Select Blood Type</option>
                                        <option>A+</option>
                                        <option>A-</option>
                                        <option>B+</option>
                                        <option>B-</option>
                                        <option>O+</option>
                                        <option>O-</option>
                                        <option>AB+</option>
                                        <option>AB-</option>
                                    </select>
                                </div>

                                {/* Location */}
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-red-700 mb-2">
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter city or zip code"
                                        className="w-full bg-red-100 p-3 border border-red-500 text-red-500 font-bold border-gray-300 rounded-lg
                                       focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    />
                                </div>

                                {/* Button */}
                                <div className="flex items-end">
                                    <button
                                        className="w-full cursor-pointer md:w-auto bg-red-600 hover:bg-red-700
                                       text-white font-semibold py-3 px-8 rounded-lg
                                       transition duration-300 flex items-center justify-center"
                                    >
                                        Find Blood
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {/* Stats Section */}
            <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 -mt-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-red-100 rounded-lg">
                                <Droplet className="h-8 w-8 text-red-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-600">Total Donations Today</p>
                                <p className="text-2xl font-bold text-gray-900">247</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <Users className="h-8 w-8 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-600">Active Donors</p>
                                <p className="text-2xl font-bold text-gray-900">5,824</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <Clock className="h-8 w-8 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-600">Lives Saved This Month</p>
                                <p className="text-2xl font-bold text-gray-900">743</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Blood Inventory */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Blood Inventory Status</h2>
                                <button className="flex items-center text-red-600 hover:text-red-700 font-medium">
                                    <Filter className="h-4 w-4 mr-2" />
                                    Filter
                                </button>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {bloodInventory.map((blood) => (
                                    <div
                                        key={blood.type}
                                        className={`border-2 ${blood.color} rounded-lg p-4 text-center transition-transform hover:scale-105`}
                                    >
                                        <div className="text-2xl font-bold text-gray-900">{blood.type}</div>
                                        <div className="text-lg font-semibold mt-2">{blood.units} Units</div>
                                        <div className={`mt-2 px-3 py-1 rounded-full text-sm font-medium ${blood.status === 'Critical' ? 'bg-yellow-100 text-yellow-800' :
                                            blood.status === 'Low' ? 'bg-orange-100 text-orange-800' :
                                                'bg-green-100 text-green-800'
                                            }`}>
                                            {blood.status}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Emergency Requests */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center">
                                    <AlertCircle className="h-6 w-6 text-red-600 mr-2" />
                                    <h2 className="text-2xl font-bold text-gray-900">Emergency Requests</h2>
                                </div>
                                <button className="text-red-600 hover:text-red-700 font-medium">
                                    View All <ChevronRight className="inline h-4 w-4" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                {emergencyRequests.map((request) => (
                                    <div key={request.id} className="border border-red-200 rounded-lg p-4 hover:bg-red-50 transition-colors">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <div className="flex items-center">
                                                    <span className="text-lg font-bold text-gray-900 mr-3">{request.bloodType}</span>
                                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${request.priority === 'Critical' ? 'bg-red-100 text-red-800' :
                                                        'bg-orange-100 text-orange-800'
                                                        }`}>
                                                        {request.priority} Priority
                                                    </span>
                                                </div>
                                                <p className="text-gray-600 mt-1">{request.patient} • {request.hospital}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-gray-500">{request.time}</p>
                                                <button className="mt-2 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300">
                                                    Donate Now
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Actions */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <button className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition duration-300">
                                    Book Donation Appointment
                                </button>
                                <button className="w-full border-2 border-red-600 text-red-600 hover:bg-red-50 font-medium py-3 px-4 rounded-lg transition duration-300">
                                    Become a Donor
                                </button>
                                <button className="w-full border-2 border-gray-300 hover:border-red-600 hover:text-red-600 font-medium py-3 px-4 rounded-lg transition duration-300">
                                    Request Blood
                                </button>
                            </div>
                        </div>

                        {/* Upcoming Blood Drives */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Upcoming Blood Drives</h3>
                            <div className="space-y-4">
                                {upcomingDrives.map((drive, index) => (
                                    <div key={index} className="border-l-4 border-red-600 pl-4 py-2">
                                        <p className="font-semibold text-gray-900">{drive.date}</p>
                                        <p className="text-gray-600">{drive.location}</p>
                                        <p className="text-sm text-gray-500">{drive.time}</p>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-4 text-center text-red-600 hover:text-red-700 font-medium py-2">
                                See All Events
                            </button>
                        </div>

                        {/* Contact Info */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Need Help?</h3>
                            <div className="space-y-3">
                                <div className="flex items-center">
                                    <Phone className="h-5 w-5 text-red-600 mr-3" />
                                    <div>
                                        <p className="text-sm text-gray-600">Emergency Hotline</p>
                                        <p className="font-semibold text-gray-900">1-800-BLOOD-BANK</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <Clock className="h-5 w-5 text-red-600 mr-3" />
                                    <div>
                                        <p className="text-sm text-gray-600">Operating Hours</p>
                                        <p className="font-semibold text-gray-900">24/7 Emergency Services</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default BloodBankHome;