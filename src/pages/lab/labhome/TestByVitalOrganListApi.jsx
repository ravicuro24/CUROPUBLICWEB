// src/pages/lab/labhome/TestByVitalOrganListApi.jsx
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import axiosInstance from '../../../Authorization/axiosInstance';
import { useLabAuth } from '../../../Authorization/LabAuthContext';
import { FaShoppingCart, FaHeart, FaMapMarkerAlt, FaClock, FaTag } from 'react-icons/fa';
import { MdLocalHospital } from 'react-icons/md';

function TestByVitalOrganListApi() {
    const { latitude, longitude, userData, getAllLabCartItems, labCartItems } = useLabAuth()
    const [packageId, setPackageId] = useState(null)
    const id = userData?.id
    const [pageNumber, setPageNumber] = useState(1)
    const [size, setSize] = useState(10);
    const [distance, setDistance] = useState(5);
    const [organData, setOrganData] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const organName = location.state?.organName;

    useEffect(() => {
        if (latitude && longitude) {
            getOrganList()
        }
    }, [pageNumber, size, latitude, longitude])

    const getOrganList = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/endUserEndPoint/searchTestByTestName?keyword=${organName}&page=${pageNumber}&size=${size}&lat=${latitude}&lng=${longitude}&distance=${distance}`)
            console.log("organ list", response)

            if (response.data && response.data.dtoList) {
                setOrganData(response.data.dtoList);
            }
        } catch (error) {
            console.log(error.response)
        } finally {
            setLoading(false);
        }
    }



    const addToCart = async (item) => {
        try {
            setPackageId(item.labPackage.id)
            const response = await axiosInstance.post(`endUserEndPoint/addTestPackageToCart?userId=${id}&packageId=${item.labPackage.id}`)
            console.log(response)
            await getAllLabCartItems()
            setPackageId(null)
        } catch (error) {
            console.log(error)
            setPackageId(null)
        }
    };

    const isInCart = (packageId) => {
        return labCartItems?.some(cart => cart.labPackage?.id === packageId);
    };


    // Color mapping for different organs
    const getOrganColor = (organName) => {
        const colorMap = {
            'Heart': 'bg-red-50 border-red-200 text-red-700',
            'Brain': 'bg-purple-50 border-purple-200 text-purple-700',
            'Kidneys': 'bg-teal-50 border-teal-200 text-teal-700',
            'Liver': 'bg-amber-50 border-amber-200 text-amber-700',
            'Lungs': 'bg-teal-50 border-teal-200 text-teal-700',
            'Stomach': 'bg-orange-50 border-orange-200 text-orange-700',
            'Bone': 'bg-indigo-50 border-indigo-200 text-indigo-700',
            'Eyes': 'bg-cyan-50 border-cyan-200 text-cyan-700',
        };
        return colorMap[organName] || 'bg-gray-50 border-gray-200 text-gray-700';
    }

    // Icon mapping for organs
    const getOrganIcon = (organName) => {
        const iconMap = {
            'Heart': '❤️',
            'Brain': '🧠',
            'Kidneys': '💧',
            'Liver': '🫁',
            'Lungs': '🫁',
            'Stomach': '🍽️',
            'Bone': '🦴',
            'Eyes': '👁️',
        };
        return iconMap[organName] || '⚕️';
    }

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-96">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mb-4"></div>
                    <div className="text-lg text-gray-600">Loading available tests...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-md md:text-xl font-bold text-gray-900">
                                {organName} Health Tests
                            </h1>
                            <p className="text-gray-600 mt-2 text-xs md:text-sm italic">
                                Comprehensive diagnostic tests for {organName} health assessment
                            </p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-right">
                                <p className="text-sm text-gray-500">Tests found</p>
                                <p className="text-2xl font-bold text-teal-600">{organData.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                                <span className="text-2xl">{getOrganIcon(organName)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Stats Bar */}

                </div>

                {/* Tests Grid */}
                {organData.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl shadow-sm border">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MdLocalHospital className="text-3xl text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No tests found</h3>
                        <p className="text-gray-600 max-w-md mx-auto">
                            We couldn't find any {organName.toLowerCase()} tests within {distance} km of your location.
                            Try increasing the search distance or check back later.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 ">
                        {organData.map((item, index) => {
                            const packageData = item.labPackage;
                            const testData = packageData?.tests?.[0];
                            const hasDiscount = packageData?.discount > 0;
                            const originalPrice = hasDiscount
                                ? Math.round(packageData.price / (1 - packageData.discount / 100))
                                : null;

                            return (
                                <div
                                    key={index}
                                    className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden group"
                                >
                                    {/* Test Image with Overlay */}
                                    <div className="relative h-48 overflow-hidden">
                                        {testData?.imagesUrl?.[0] ? (
                                            <img
                                                src={testData.imagesUrl[0]}
                                                alt={testData?.testName || 'Test Image'}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                onError={(e) => {
                                                    e.target.src = 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80';
                                                }}
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-teal-50 to-indigo-100 flex items-center justify-center">
                                                <span className="text-4xl">{getOrganIcon(organName)}</span>
                                            </div>
                                        )}

                                        {/* Discount Badge */}
                                        {hasDiscount && (
                                            <div className="absolute top-4 left-4">
                                                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                                                    {packageData.discount}% OFF
                                                </span>
                                            </div>
                                        )}

                                        {/* Distance Badge */}
                                        <div className="absolute top-4 right-4">
                                            <span className="bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                                                <FaMapMarkerAlt className="h-3 w-3 mr-1" />
                                                {item.distance?.toFixed(1)} km
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        {/* Header with Test Name and Lab */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <h3 className="font-bold text-xl text-gray-900 leading-tight mb-1">
                                                    {testData?.testName || packageData?.packageName}
                                                </h3>
                                                <p className="text-teal-600 font-medium text-sm">
                                                    {packageData?.lab?.labName || 'Certified Diagnostic Lab'}
                                                </p>
                                            </div>
                                            <button className="ml-4 p-2 text-gray-400 hover:text-red-500 transition-colors">
                                                <FaHeart className="h-5 w-5" />
                                            </button>
                                        </div>

                                        {/* Description */}
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                                            {testData?.description || packageData?.description || 'Comprehensive diagnostic test for accurate health assessment.'}
                                        </p>

                                        {/* Vital Organs */}
                                        {testData?.forVitalOrgans && testData.forVitalOrgans.length > 0 && (
                                            <div className="mb-4">
                                                <p className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                                                    Related Organs
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {testData.forVitalOrgans.map((organ, idx) => (
                                                        <span
                                                            key={idx}
                                                            className={`px-3 py-1 rounded-full text-xs font-medium border ${getOrganColor(organ)}`}
                                                        >
                                                            {organ}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Symptoms */}
                                        {testData?.symptoms && testData.symptoms.length > 0 && (
                                            <div className="mb-4">
                                                <p className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                                                    Common Symptoms
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {testData.symptoms.slice(0, 3).map((symptom, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="px-3 py-1 bg-gray-100 rounded-lg text-xs text-gray-700 font-medium"
                                                        >
                                                            {symptom}
                                                        </span>
                                                    ))}
                                                    {testData.symptoms.length > 3 && (
                                                        <span className="px-3 py-1 bg-gray-100 rounded-lg text-xs text-gray-700 font-medium">
                                                            +{testData.symptoms.length - 3} more
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Sample Type */}
                                        {testData?.sampleType && (
                                            <div className="mb-4">
                                                <p className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                                                    Sample Required
                                                </p>
                                                <span className="px-3 py-1 bg-teal-50 text-teal-700 rounded-lg text-sm font-medium">
                                                    {testData.sampleType}
                                                </span>
                                            </div>
                                        )}

                                        {/* Price and CTA Section */}
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                            <div className="flex flex-col">
                                                <div className="flex items-baseline space-x-2">
                                                    <p className="text-2xl font-bold text-teal-600">
                                                        {formatPrice(packageData?.price)}
                                                    </p>
                                                    {originalPrice && (
                                                        <p className="text-sm text-gray-500 line-through">
                                                            {formatPrice(originalPrice)}
                                                        </p>
                                                    )}
                                                </div>
                                                {hasDiscount && (
                                                    <p className="text-xs text-teal-600 font-medium">
                                                        You save {formatPrice(originalPrice - packageData.price)}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex space-x-3">
                                                {isInCart(item.labPackage.id) ? (
                                                    <button
                                                        onClick={() => navigate("/lab-cart")}   // ← Change route accordingly
                                                        className="flex cursor-pointer items-center space-x-2 border border-teal-700 text-teal-700 px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg"
                                                    >
                                                        <FaShoppingCart className="h-4 w-4" />
                                                        <span>Go to Cart</span>
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => addToCart(item)}
                                                        className="flex cursor-pointer items-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg"
                                                     >
                                                        {packageId === item.labPackage.id ? (
                                                            <span className="loading loading-spinner loading-sm"></span>
                                                        ) : (
                                                            <>
                                                                <FaShoppingCart className="h-4 w-4" />
                                                                <span>Add to Cart</span>
                                                            </>
                                                        )}
                                                    </button>
                                                )}
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Load More Button */}
                {organData.length > 0 && (
                    <div className="flex justify-center mt-12">
                        <button className="bg-white text-teal-600 border border-teal-600 hover:bg-teal-50 px-8 py-3 rounded-xl font-semibold transition-colors duration-200">
                            Load More Tests
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default TestByVitalOrganListApi