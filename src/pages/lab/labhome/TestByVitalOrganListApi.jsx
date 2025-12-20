// src/pages/lab/labhome/TestByVitalOrganListApi.jsx
import React, { useEffect, useState, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../Authorization/axiosInstance';
import { useLabAuth } from '../../../Authorization/LabAuthContext';
import { FaShoppingCart, FaHeart, FaMapMarkerAlt, FaSearch } from 'react-icons/fa';
import { MdLocalHospital } from 'react-icons/md';
import { useAuth } from '../../../Authorization/AuthContext';
import LoadingAnimation from '../../../LoaderSpinner';

function TestByVitalOrganListApi() {
    const { latitude, longitude, getAllLabCartItems, labCartItems } = useLabAuth()
    const { userData } = useAuth()
    const navigate = useNavigate()
    const [packageId, setPackageId] = useState(null)
    const id = userData?.id
    const [pageNumber, setPageNumber] = useState(1)
    const [size, setSize] = useState(12);
    const [distance, setDistance] = useState(10);
    const [organData, setOrganData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [totalItems, setTotalItems] = useState(0);
    const location = useLocation();
    const organName = location.state?.organName;
    const [search, setSearch] = useState(location.state?.organName || '')
    const [searchTimeout, setSearchTimeout] = useState(null)

    // Filter states
    const [filters, setFilters] = useState({
        sortBy: 'distance', // distance, price_low, price_high, name

    });

    useEffect(() => {
        if (latitude && longitude) {
            getOrganList();
        }
    }, [pageNumber, size, latitude, longitude, search, distance, filters]);

    useEffect(() => {
        // Reset pagination when filters change
        setPageNumber(1);
        setOrganData([]);
    }, [search, distance, filters]);

    // Debounced search handler
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearch(value);

        // Clear existing timeout
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        // Set new timeout
        const newTimeout = setTimeout(() => {
            setPageNumber(1);
            setOrganData([]);
        }, 500);

        setSearchTimeout(newTimeout);
    }

    const getOrganList = async () => {
        try {
            if (pageNumber === 1) {
                setLoading(true);
            } else {
                setLoadingMore(true);
            }

            // Build query parameters
            const params = new URLSearchParams({
                keyword: search,
                page: pageNumber,
                size: size,
                lat: latitude,
                lng: longitude,
                distance: distance
            });

            const response = await axiosInstance.get(
                `/endUserEndPoint/searchTestByTestName?${params.toString()}`
            );
            console.log("organ list", response);

            if (response.data) {
                if (pageNumber === 1) {
                    setOrganData(response.data.dtoList || []);
                } else {
                    setOrganData(prev => [...prev, ...(response.data.dtoList || [])]);
                }

                // Check if there are more items to load
                setTotalItems(response.data.totalItems || 0);
                setHasMore(
                    response.data.dtoList &&
                    response.data.dtoList.length === size &&
                    (response.data.totalItems || 0) > organData.length + response.data.dtoList.length
                );
            }
        } catch (error) {
            console.log("Error fetching organ list:", error.response || error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }

    const addToCart = async (item) => {
        try {

            setPackageId(item.labPackage.id);
            const response = await axiosInstance.post(
                `endUserEndPoint/addTestPackageToCart?userId=${id}&packageId=${item.labPackage.id}`
            );
            console.log("Add to cart", response);
            await getAllLabCartItems();
            setPackageId(null);
        } catch (error) {
            console.log("Error adding to cart:", error);
            setPackageId(null);
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

    const loadMore = () => {
        if (hasMore && !loadingMore) {
            setPageNumber(prev => prev + 1);
        }
    };



    const clearFilters = () => {
        setFilters({
            minPrice: '',
            maxPrice: '',
            sortBy: 'distance',
            labType: ''
        });
        setDistance(10);
    };

    const handleDistanceChange = (newDistance) => {
        setDistance(newDistance);
        setPageNumber(1);
        setOrganData([]);
    };

    // Distance options
    const distanceOptions = [2, 5, 10, 15, 20, 25, 50];

    if (loading && organData.length === 0) {
        return (
            <LoadingAnimation />
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
            <div className="container mx-auto px-3 sm:px-6 lg:px-8">
                {/* Search and Filter Section */}
                <div className="mb-6 sm:mb-8 space-y-4">
                    {/* Search Bar */}


                    {/* Filters Panel */}

                    <div className="bg-white flex gap-2 rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
                        <div className="relative w-full md:w-[75%] mx-auto ">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaSearch className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                value={search}
                                onChange={handleSearchChange}
                                placeholder="Search for tests, packages, or organs..."
                                className="block w-full pl-10 pr-12 py-3 sm:py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm sm:text-base transition-all duration-200"
                            />

                        </div>

                        <div className="w-full md:w-[25%]">
                            {/* Distance Filter */}
                            <div>

                                <select
                                    value={distance}
                                    onChange={(e) => handleDistanceChange(Number(e.target.value))}
                                    className="w-full border border-gray-300 rounded-xl px-3 py-4.5 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
                                >
                                    {distanceOptions.map(option => (
                                        <option key={option} value={option}>
                                            Within {option} km
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Header Section */}
                <div className="mb-6 sm:mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex-1">
                            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                                {search || 'All'} Health Tests
                            </h1>
                            <p className="text-gray-600 mt-1 sm:mt-2 text-xs sm:text-sm">
                                {totalItems > 0 ? (
                                    <>
                                        Showing {organData.length} of {totalItems} tests within {distance} km
                                        {filters.minPrice || filters.maxPrice ? ' with applied filters' : ''}
                                    </>
                                ) : (
                                    'Comprehensive diagnostic tests for health assessment'
                                )}
                            </p>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end space-x-4">
                            <div className="text-right sm:text-center">
                                <p className="text-xs sm:text-sm text-gray-500">Tests found</p>
                                <p className="text-xl sm:text-2xl font-bold text-teal-600">{totalItems}</p>
                            </div>
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-teal-100 rounded-full flex items-center justify-center">
                                <span className="text-xl sm:text-2xl">{getOrganIcon(organName)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tests Grid */}
                {organData.length === 0 ? (
                    <div className="text-center py-12 sm:py-16 bg-white rounded-xl sm:rounded-2xl shadow-sm border">
                        <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MdLocalHospital className="text-2xl sm:text-3xl text-gray-400" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No tests found</h3>
                        <p className="text-gray-600 max-w-md mx-auto text-sm sm:text-base px-4">
                            {search ? `No tests found for "${search}"` : 'No tests available'}
                            {distance && ` within ${distance} km of your location.`}
                            {filters.minPrice || filters.maxPrice ? ' Try adjusting your price filters.' : ' Try increasing the search distance or check back later.'}
                        </p>
                        {(filters.minPrice || filters.maxPrice || distance !== 10) && (
                            <button
                                onClick={clearFilters}
                                className="mt-4 bg-teal-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-teal-700 transition-colors"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                            {organData.map((item, index) => {
                                const packageData = item.labPackage;
                                const testData = packageData?.tests?.[0];
                                const hasDiscount = packageData?.discount > 0;
                                const originalPrice = hasDiscount
                                    ? Math.round(packageData.price / (1 - packageData.discount / 100))
                                    : null;

                                return (
                                    <div
                                        onClick={() => navigate('/lab/labPackage_details', { state: item })}
                                        key={`${packageData?.id}-${index}`}
                                        className="bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden group"
                                    >
                                        {/* Test Image with Overlay */}
                                        <div className="relative h-40 sm:h-48 overflow-hidden">
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
                                                    <span className="text-3xl sm:text-4xl">{getOrganIcon(organName)}</span>
                                                </div>
                                            )}

                                            {/* Discount Badge */}
                                            {hasDiscount && (
                                                <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                                                    <span className="bg-red-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold shadow-lg">
                                                        {packageData.discount}% OFF
                                                    </span>
                                                </div>
                                            )}

                                            {/* Distance Badge */}
                                            <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                                                <span className="bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                                                    <FaMapMarkerAlt className="h-3 w-3 mr-1" />
                                                    {item.distance?.toFixed(1)} km
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-4 sm:p-6">
                                            {/* Header with Test Name and Lab */}
                                            <div className="flex items-start justify-between mb-3 sm:mb-4">
                                                <div className="flex-1 pr-2">
                                                    <h3 className="font-bold text-base sm:text-lg lg:text-xl text-gray-900 leading-tight mb-1 line-clamp-2">
                                                        {testData?.testName || packageData?.packageName}
                                                    </h3>
                                                    <p className="text-teal-600 font-medium text-xs sm:text-sm">
                                                        {packageData?.lab?.labName || 'Certified Diagnostic Lab'}
                                                    </p>
                                                </div>
                                                <button className="ml-2 p-1 sm:p-2 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0">
                                                    <FaHeart className="h-4 w-4 sm:h-5 sm:w-5" />
                                                </button>
                                            </div>

                                            {/* Description */}
                                            <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2 leading-relaxed">
                                                {testData?.description || packageData?.description || 'Comprehensive diagnostic test for accurate health assessment.'}
                                            </p>

                                            {/* Vital Organs */}
                                            {testData?.forVitalOrgans && testData.forVitalOrgans.length > 0 && (
                                                <div className="mb-3 sm:mb-4">
                                                    <p className="text-xs font-semibold text-gray-700 mb-1 sm:mb-2 uppercase tracking-wide">
                                                        Related Organs
                                                    </p>
                                                    <div className="flex flex-wrap gap-1 sm:gap-2">
                                                        {testData.forVitalOrgans.slice(0, 2).map((organ, idx) => (
                                                            <span
                                                                key={idx}
                                                                className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium border ${getOrganColor(organ)}`}
                                                            >
                                                                {organ}
                                                            </span>
                                                        ))}
                                                        {testData.forVitalOrgans.length > 2 && (
                                                            <span className="px-2 sm:px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-700 font-medium">
                                                                +{testData.forVitalOrgans.length - 2}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Symptoms */}
                                            {testData?.symptoms && testData.symptoms.length > 0 && (
                                                <div className="mb-3 sm:mb-4">
                                                    <p className="text-xs font-semibold text-gray-700 mb-1 sm:mb-2 uppercase tracking-wide">
                                                        Common Symptoms
                                                    </p>
                                                    <div className="flex flex-wrap gap-1 sm:gap-2">
                                                        {testData.symptoms.slice(0, 2).map((symptom, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="px-2 sm:px-3 py-1 bg-gray-100 rounded-lg text-xs text-gray-700 font-medium"
                                                            >
                                                                {symptom}
                                                            </span>
                                                        ))}
                                                        {testData.symptoms.length > 2 && (
                                                            <span className="px-2 sm:px-3 py-1 bg-gray-100 rounded-lg text-xs text-gray-700 font-medium">
                                                                +{testData.symptoms.length - 2} more
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Sample Type */}
                                            {testData?.sampleType && (
                                                <div className="mb-3 sm:mb-4">
                                                    <p className="text-xs font-semibold text-gray-700 mb-1 sm:mb-2 uppercase tracking-wide">
                                                        Sample Required
                                                    </p>
                                                    <span className="px-2 sm:px-3 py-1 bg-teal-50 text-teal-700 rounded-lg text-xs sm:text-sm font-medium">
                                                        {testData.sampleType}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Price and CTA Section */}
                                            <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-gray-200">
                                                <div className="flex flex-col">
                                                    <div className="flex items-baseline space-x-1 sm:space-x-2">
                                                        <p className="text-lg sm:text-xl lg:text-2xl font-bold text-teal-600">
                                                            {formatPrice(packageData?.price)}
                                                        </p>
                                                        {originalPrice && (
                                                            <p className="text-xs sm:text-sm text-gray-500 line-through">
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

                                                <div className="flex space-x-2">
                                                    {isInCart(item.labPackage.id) ? (
                                                        <button
                                                            onClick={() => navigate("/lab/cartitems")}
                                                            className="flex cursor-pointer items-center space-x-1 sm:space-x-2 border border-teal-700 text-teal-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition-all duration-200 hover:shadow-lg text-xs sm:text-sm"
                                                        >
                                                            <FaShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
                                                            <span>View Cart</span>
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => addToCart(item)}
                                                            className="flex cursor-pointer items-center space-x-1 sm:space-x-2 bg-teal-600 hover:bg-teal-700 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition-all duration-200 hover:shadow-lg text-xs sm:text-sm"
                                                        >
                                                            {packageId === item.labPackage.id ? (
                                                                <span className="loading loading-spinner loading-xs sm:loading-sm"></span>
                                                            ) : (
                                                                <>
                                                                    <FaShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
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

                        {/* Load More Button */}
                        {hasMore && (
                            <div className="flex justify-center mt-8 sm:mt-12">
                                <button
                                    onClick={loadMore}
                                    disabled={loadingMore}
                                    className="bg-white text-teal-600 border border-teal-600 hover:bg-teal-50 px-6 sm:px-8 py-2 sm:py-3 rounded-xl font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base min-w-32"
                                >
                                    {loadingMore ? (
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-teal-600 mr-2"></div>
                                            Loading...
                                        </div>
                                    ) : (
                                        'Load More Tests'
                                    )}
                                </button>
                            </div>
                        )}

                        {/* End of results message */}
                        {!hasMore && organData.length > 0 && (
                            <div className="text-center mt-8 sm:mt-12">
                                <p className="text-gray-600 text-sm sm:text-base">
                                    You've seen all {totalItems} tests within {distance} km
                                    {filters.minPrice || filters.maxPrice ? ' with current filters' : ''}
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default TestByVitalOrganListApi