// src/pages/lab/labhome/LabPackageDetails.jsx

import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    MapPin,
    Phone,
    Mail,
    Clock,
    Shield,
    Star,
    Calendar,
    FileText
} from "lucide-react";
import { useAuth } from "../../../Authorization/AuthContext";

function LabPackageDetails() {
    const location = useLocation();
    const navigate = useNavigate();
    const { userData, setAuthModal } = useAuth()
    const rawData = location.state;
    const id = userData?.id
    // Normalize data
    const item = rawData?.labPackage ? rawData : rawData?.pkg;
    const labPackage = item?.labPackage || item?.pkg?.labPackage;
    const distance = item?.distance || item?.pkg?.distance;
    const latitude = item?.latitude || item?.pkg?.latitude;
    const longitude = item?.longitude || item?.pkg?.longitude;

    const discountedPrice = labPackage?.price * (1 - (labPackage?.discount || 0) / 100);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    const maskPhone = (phone) => {
        if (!phone) return "";
        const lastTwo = phone.slice(-2);
        return `+91-xxxxxxx${lastTwo}`;
    };

    const maskEmail = (email) => {
        if (!email) return "";
        const [name, domain] = email.split("@");
        if (!domain) return email;
        if (name.length <= 2) return name[0] + "*****@" + domain;
        return name[0] + "*".repeat(name.length - 2) + name[name.length - 1] + "@" + domain;
    };

    const handleBookthisPackage = (item) => {
        if (!id) {
            setAuthModal(true)
            return;
        }
        navigate('/lab/package/single/package', { state: { item } })
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-4 lg:py-6">
                {/* Package Header Card */}
                <div className="border border-gray-200 rounded-2xl overflow-hidden mb-6 lg:mb-10 bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="flex flex-col lg:flex-row">

                        {/* IMAGE SECTION */}
                        <div className="relative w-full lg:w-2/5 bg-gray-100">
                            <img
                                src={labPackage?.tests?.[0]?.imagesUrl?.[0]}
                                alt={labPackage?.packageName}
                                className="w-full h-40 lg:h-full object-cover"
                            />

                            {labPackage?.popular && (
                                <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1.5 rounded-full shadow-md flex items-center gap-1 text-xs font-semibold">
                                    <Star size={14} fill="currentColor" />
                                    Popular
                                </div>
                            )}
                        </div>

                        {/* CONTENT SECTION */}
                        <div className="w-full lg:w-3/5 p-5 lg:p-8 flex flex-col justify-between">

                            {/* HEADER */}
                            <div>
                                <h1 className="text-lg lg:text-2xl font-semibold text-gray-900 leading-tight mb-2">
                                    {labPackage?.packageName}
                                </h1>

                                <div className="flex items-center gap-2 text-xs lg:text-sm text-gray-500 mb-4">
                                    <Calendar size={14} className="text-blue-600" />
                                    Created on{" "}
                                    {new Date(labPackage?.createdAt).toLocaleDateString("en-IN")}
                                </div>

                                {/* DESCRIPTION */}
                                <p className="text-gray-600 text-sm lg:text-base leading-relaxed border-l-4 border-blue-500 pl-4 bg-blue-50 rounded-md py-2">
                                    {labPackage?.description}
                                </p>
                            </div>

                            {/* PRICE SECTION */}
                            <div className="mt-6 bg-gray-50 rounded-xl p-4 border border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="text-xs uppercase tracking-wide text-gray-500">
                                            Price
                                        </span>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xl lg:text-2xl font-bold text-green-600">
                                                ₹{labPackage?.price}
                                            </span>

                                            {labPackage?.discount > 0 && (
                                                <span className="text-sm line-through text-gray-400">
                                                    ₹{labPackage?.price + labPackage?.discount}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {labPackage?.discount > 0 && (
                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                                            Save ₹{labPackage?.discount}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* QUICK FEATURES */}
                            <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-gray-200">
                                <div className="flex items-center gap-2 text-gray-600 text-sm">
                                    <span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span>
                                    Home Collection
                                </div>
                                <div className="flex items-center gap-2 text-gray-600 text-sm">
                                    <span className="w-2.5 h-2.5 bg-blue-500 rounded-full"></span>
                                    Fast Reports
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                    {/* Left Column - Lab Info & Tests */}
                    <div className="lg:col-span-2 space-y-4 lg:space-y-6">
                        {/* Lab Information Card */}
                        <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6">
                            <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-3 lg:mb-4 flex items-center">
                                <FileText className="mr-2" size={18} />
                                Lab Information
                            </h2>

                            <div className="space-y-3 lg:space-y-4">
                                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start space-y-3 lg:space-y-0">
                                    <div>
                                        <h3 className="text-base lg:text-lg font-semibold text-gray-800">
                                            {labPackage?.lab?.labName}
                                        </h3>
                                        <p className="text-gray-600 text-sm">
                                            {labPackage?.lab?.firstName} {labPackage?.lab?.lastName}
                                        </p>
                                    </div>
                                    <div className="lg:text-right">
                                        <div className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-semibold inline-block">
                                            {distance?.toFixed(2)} km away
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                                    <div className="flex items-center space-x-2 lg:space-x-3 text-gray-600 text-sm lg:text-base">
                                        <Phone size={16} />
                                        <span className="break-all">{maskPhone(labPackage?.lab?.mobileNumber)}</span>
                                    </div>

                                    <div className="flex items-center space-x-2 lg:space-x-3 text-gray-600 text-sm lg:text-base">
                                        <Mail size={16} />
                                        <span className="break-all">{maskEmail(labPackage?.lab?.email)}</span>
                                    </div>

                                    <div className="flex items-center space-x-2 lg:space-x-3 text-gray-600 text-sm lg:text-base">
                                        <Clock size={16} />
                                        <span>{labPackage?.lab?.operatingHours}</span>
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 pt-3 lg:pt-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                                        <div className="flex items-center space-x-2">
                                            <Shield size={16} className="text-gray-600" />
                                            <span className="text-sm text-gray-600">License Status:</span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2 break-all">
                                        GST: {labPackage?.lab?.gstRegistrationNumber}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Tests Included Card */}
                        <div className="bg-white rounded-xl shadow-sm  p-4 lg:p-6">
                            <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-3 lg:mb-4">
                                Tests Included ({labPackage?.tests?.length ?? 0})
                            </h2>

                            <div className="space-y-3 lg:space-y-4">
                                {labPackage?.tests?.map((test) => (
                                    <div
                                        key={test.id}
                                        className="border-l-4 border-teal-500 bg-teal-50 p-3 lg:p-4 rounded-r-lg"
                                    >
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 space-y-1 sm:space-y-0">
                                            <h3 className="font-semibold text-gray-900 text-base lg:text-lg">
                                                {test.testName}
                                            </h3>

                                            <span className="bg-white text-teal-600 px-2 py-1 rounded text-sm font-medium self-start">
                                                {test.testType}
                                            </span>
                                        </div>

                                        <p className="text-gray-700 text-sm lg:text-base mb-2 lg:mb-3">
                                            {test.description}
                                        </p>

                                        <div className="flex flex-wrap gap-2">
                                            <span className="bg-white text-gray-600 px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm border">
                                                Sample: {test.sampleType}
                                            </span>

                                            {test.preparation && (
                                                <span className="bg-white text-gray-600 px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm border">
                                                    Prep: {test.preparation}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Action Card */}
                    <div className="space-y-4 lg:space-y-6">
                        {/* Quick Actions Card */}
                        <div className="bg-white rounded-xl shadow-sm  p-4 lg:p-6 lg:sticky lg:top-6">
                            <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-3 lg:mb-4">Quick Actions</h3>

                            <div className="space-y-2 lg:space-y-3">
                                <button
                                    onClick={() => handleBookthisPackage(item)}
                                    className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200 text-sm lg:text-base"
                                >
                                    Book This Package
                                </button>

                                <button className="w-full border border-teal-600 text-teal-600 hover:bg-teal-50 py-3 px-4 rounded-lg font-semibold transition-colors duration-200 text-sm lg:text-base">
                                    Contact Lab
                                </button>

                                <button className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 py-3 px-4 rounded-lg font-semibold transition-colors duration-200 text-sm lg:text-base">
                                    Share Package
                                </button>
                            </div>

                            {/* Additional Info */}
                            <div className="mt-4 lg:mt-6 pt-4 lg:pt-6 border-t border-gray-200">
                                <h4 className="font-semibold text-gray-900 mb-2 lg:mb-3 text-sm lg:text-base">What's Included</h4>
                                <ul className="space-y-1 lg:space-y-2 text-xs lg:text-sm text-gray-600">
                                    <li className="flex items-center">
                                        <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-green-500 rounded-full mr-2 lg:mr-3"></div>
                                        Free Home Sample Collection
                                    </li>
                                    <li className="flex items-center">
                                        <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-green-500 rounded-full mr-2 lg:mr-3"></div>
                                        Digital Report Delivery
                                    </li>
                                    <li className="flex items-center">
                                        <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-green-500 rounded-full mr-2 lg:mr-3"></div>
                                        Doctor Consultation
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Support Card */}
                        <div className="bg-teal-50 rounded-xl border border-teal-200 p-4 lg:p-6">
                            <h3 className="font-semibold text-teal-900 mb-2 text-sm lg:text-base">Need Help?</h3>
                            <p className="text-teal-700 text-xs lg:text-sm mb-3 lg:mb-4">
                                Our support team is here to help you with any questions.
                            </p>
                            <button className="w-full bg-white text-teal-600 border border-teal-300 hover:bg-teal-100 py-2 px-4 rounded-lg font-semibold text-xs lg:text-sm transition-colors duration-200">
                                Contact Support
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LabPackageDetails;
