// src/pages/lab/labhome/TestByCategoryTestList.jsx
import React, { useEffect, useState } from 'react'
import axiosInstance from '../../../Authorization/axiosInstance'
import { useAuth } from '../../../Authorization/AuthContext'
import { useLocation, useNavigate } from 'react-router-dom'
import { useLabAuth } from '../../../Authorization/LabAuthContext'

function TestByCategoryTestList() {
    const { latitude, longitude } = useAuth()
    const { userData, getAllLabCartItems, labCartItems } = useLabAuth()
    const id = userData?.id
    const [size] = useState(10)
    const [distance] = useState(5)
    const [pageNumber, setPageNumber] = useState(1)
    const location = useLocation()
    const navigate = useNavigate()
    const item = location.state
    const [organName, setOrganName] = useState(item?.name || '')
    const [testList, setTestList] = useState([])
    const [loading, setLoading] = useState(false)
    const [addingId, setAddingId] = useState(null)

    console.log("lab cart items", labCartItems)

    useEffect(() => {
        getAllTestByOrganList()
    }, [pageNumber])

    const getAllTestByOrganList = async () => {
        setLoading(true)
        try {
            const response = await axiosInstance.get(
                `/endUserEndPoint/searchTestByTestName?keyword=${organName}&page=${pageNumber}&size=${size}&lat=${latitude}&lng=${longitude}&distance=${distance}`
            )
            console.log("API response", response.data)

            if (response.data && response.data.dtoList) {
                setTestList(response.data.dtoList)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const getPackageImage = (pkg) => {
        if (pkg.labPackage.packageImage) return pkg.labPackage.packageImage
        const firstTest = pkg.labPackage.tests[0]
        if (firstTest?.imagesUrl?.length > 0) return firstTest.imagesUrl[0]
        return 'https://via.placeholder.com/300x200/3B82F6/FFFFFF?text=Medical+Test'
    }

    const calculateDiscountedPrice = (price, discount) => {
        return price - (price * discount / 100)
    }

    const handleAddToCart = async (pkg) => {
        setAddingId(pkg.labPackage.id)
        try {
            await axiosInstance.post(`endUserEndPoint/addTestPackageToCart?userId=${id}&packageId=${pkg.labPackage.id}`)
            await getAllLabCartItems()
            setAddingId(null)
        } catch (error) {
            console.error("Error adding to cart:", error?.response || error.message)
            setAddingId(null)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto">
                <div className='flex justify-between items-start '>
                    <div className="text-start mb-8">
                        <h1 className="text-xl font-bold text-gray-900 ">
                            Available Test Packages
                        </h1>
                        <p className="text-md text-gray-600">
                            For <span className='text-teal-700'>{organName || 'selected category'}</span>
                        </p>
                    </div>
                    {!loading && testList.length > 0 && (
                        <div className="flex justify-center items-center mt-8 space-x-4">
                            <button
                                onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
                                disabled={pageNumber === 1}
                                className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
                            >
                                Previous
                            </button>
                            <span className="text-gray-700 font-medium">
                                Page {pageNumber}
                            </span>
                            <button
                                onClick={() => setPageNumber(prev => prev + 1)}
                                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>

                {loading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
                    </div>
                )}

                {!loading && testList.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-400 text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            No Tests Found
                        </h3>
                        <p className="text-gray-600">
                            We couldn't find any tests matching your criteria.
                        </p>
                    </div>
                )}

                {!loading && testList.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {testList.map((pkg) => {
                            const discountedPrice = calculateDiscountedPrice(
                                pkg.labPackage.price,
                                pkg.labPackage.discount
                            )

                            const isInCart = labCartItems.some(item => item.labPackage.id === pkg.labPackage.id)

                            return (
                                <div
                                    key={pkg.labPackage.id}
                                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 flex flex-col h-full"
                                >
                                    <div className="relative h-48 bg-gray-200 overflow-hidden">
                                        <img
                                            src={getPackageImage(pkg)}
                                            alt={pkg.labPackage.packageName}
                                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                            onError={(e) => {
                                                e.target.src =
                                                    "https://via.placeholder.com/300x200/3B82F6/FFFFFF?text=Medical+Test"
                                            }}
                                        />
                                        {pkg.labPackage.discount > 0 && (
                                            <div className="absolute top-3 right-3">
                                                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                                                    {pkg.labPackage.discount}% OFF
                                                </span>
                                            </div>
                                        )}
                                        {pkg.labPackage.popular && (
                                            <div className="absolute top-3 left-3">
                                                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                                                    Popular
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-5 flex flex-col flex-grow justify-between">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                                                {pkg.labPackage.packageName}
                                            </h3>
                                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                                {pkg.labPackage.description}
                                            </p>

                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-2xl font-bold text-gray-900">
                                                        ₹{discountedPrice.toFixed(0)}
                                                    </span>
                                                    {pkg.labPackage.discount > 0 && (
                                                        <span className="text-sm text-gray-500 line-through">
                                                            ₹{pkg.labPackage.price}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-sm text-green-600 font-semibold">
                                                    Save ₹{(pkg.labPackage.price - discountedPrice).toFixed(0)}
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between mb-4 text-sm">
                                                <div className="flex items-center text-gray-600">
                                                    <svg className="w-4 h-4 mr-1 text-teal-500" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                                    </svg>
                                                    {pkg.distance.toFixed(2)} km away
                                                </div>
                                                <div className={`text-xs px-2 py-1 rounded-full ${pkg.distance < 2 ? "bg-green-100 text-green-800" :
                                                    pkg.distance < 5 ? "bg-yellow-100 text-yellow-800" :
                                                        "bg-red-100 text-red-800"
                                                    }`}>
                                                    {pkg.distance < 2 ? "Very Close" :
                                                        pkg.distance < 5 ? "Nearby" : "Far"}
                                                </div>
                                            </div>

                                            <div className="border-t pt-4">
                                                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                                                    <svg className="w-4 h-4 mr-2 text-teal-500" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                    Includes {pkg.labPackage.tests.length} Tests
                                                </h4>

                                                <div className="space-y-2 max-h-32 overflow-y-auto">
                                                    {pkg.labPackage.tests.slice(0, 3).map((test) => (
                                                        <div key={test.id} className="flex items-start space-x-2 text-sm">
                                                            <div className="w-2 h-2 bg-teal-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                                            <div className="flex-1">
                                                                <span className="font-medium text-gray-900">{test.testName}</span>
                                                                <div className="flex flex-wrap gap-1 mt-1">
                                                                    <span className="bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded">
                                                                        {test.testType}
                                                                    </span>
                                                                    <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                                                                        {test.sampleType}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {pkg.labPackage.tests.length > 3 && (
                                                        <div className="text-center text-sm text-teal-600 font-medium pt-2 border-t">
                                                            +{pkg.labPackage.tests.length - 3} more tests
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Conditional Button */}
                                        {isInCart ? (
                                            <button
                                                onClick={() => navigate('/lab/cart')}
                                                className="w-full mt-4 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
                                            >
                                                Go to Cart
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleAddToCart(pkg)}
                                                className="w-full mt-4 bg-teal-700 hover:bg-teal-800 cursor-pointer text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                                            >
                                                {addingId === pkg.labPackage.id ? (
                                                    <span className="loading loading-spinner loading-sm"></span>
                                                ) : (
                                                    'Add to Cart'
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

export default TestByCategoryTestList
