// src/pages/lab/labhome/TestByCategoryTestList.jsx

import React, { useEffect, useState, useRef } from 'react'
import axiosInstance from '../../../Authorization/axiosInstance'
import { useAuth } from '../../../Authorization/AuthContext'
import { useLocation, useNavigate } from 'react-router-dom'
import { useLabAuth } from '../../../Authorization/LabAuthContext'

function TestByCategoryTestList() {
    const { latitude, longitude } = useAuth()
    const { userData, getAllLabCartItems, labCartItems } = useLabAuth()
    const id = userData?.id

    const [size] = useState(8)
    const [distance] = useState(5)

    const [pageNumber, setPageNumber] = useState(1)
    const [hasMore, setHasMore] = useState(true)

    const initialLoad = useRef(false)

    const location = useLocation()
    const navigate = useNavigate()
    const { name: organNameFromState } = location.state || {}

    const [organName] = useState(organNameFromState || '')
    const [testList, setTestList] = useState([])
    const [loading, setLoading] = useState(false)
    const [addingId, setAddingId] = useState(null)

    // Prevent React 18 strict mode double API call
    useEffect(() => {
        if (!initialLoad.current) {
            loadMoreTests(1)
            initialLoad.current = true
        }
        window.scrollTo({ top: 0, behavior: "smooth" })
    }, [])

    // Load More Tests
    const loadMoreTests = async (page) => {
        if (loading) return
        setLoading(true)

        try {
            const response = await axiosInstance.get(
                `/endUserEndPoint/searchTestByTestName?keyword=${organName}&page=${page}&size=${size}&lat=${latitude}&lng=${longitude}&distance=${distance}`
            )

            const newData = response.data?.dtoList || []
            console.log("API:", response.data)

            if (newData.length < size) setHasMore(false)

            setTestList(prev => {
                const merged = [...prev, ...newData]
                const unique = merged.filter(
                    (obj, index, arr) =>
                        index === arr.findIndex(t => t.labPackage.id === obj.labPackage.id)
                )
                return unique
            })

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

    const calculateDiscountedPrice = (price, discount) =>
        price - (price * discount / 100)

    // 🚀 Add to cart without navigating
    const handleAddToCart = async (e, pkg) => {
        e.stopPropagation() // Prevent card click navigation
        setAddingId(pkg.labPackage.id)
        try {
            await axiosInstance.post(
                `endUserEndPoint/addTestPackageToCart?userId=${id}&packageId=${pkg.labPackage.id}`
            )
            await getAllLabCartItems()
        } catch (error) {
            console.error("Add to cart failed:", error)
        } finally {
            setAddingId(null)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto">

                <div className="flex justify-between items-start">
                    <div className="text-start mb-8">
                        <h1 className="text-xl font-bold text-gray-900">
                            Available Test Packages
                        </h1>
                        <p className="text-md text-gray-600">
                            For <span className="text-teal-700">{organName}</span>
                        </p>
                    </div>
                </div>

                {/* EMPTY STATE */}
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

                {/* TEST LIST */}
                {testList.length > 0 && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">

                            {testList.map((pkg, index) => {
                                const discountedPrice = calculateDiscountedPrice(
                                    pkg.labPackage.price,
                                    pkg.labPackage.discount
                                )

                                const isInCart = labCartItems.some(
                                    item => item.labPackage.id === pkg.labPackage.id
                                )

                                return (
                                    <div
                                        key={index}
                                        onClick={() => navigate('/labPackage_details', { state: { pkg } })}
                                        className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 flex flex-col h-full"
                                    >
                                        <div className="relative h-48 bg-gray-200 overflow-hidden">
                                            <img
                                                src={getPackageImage(pkg)}
                                                alt={pkg.labPackage.packageName}
                                                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                            />
                                            {pkg.labPackage.discount > 0 && (
                                                <div className="absolute top-3 right-3">
                                                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                                                        {pkg.labPackage.discount}% OFF
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
                                                </div>
                                            </div>

                                            {isInCart ? (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); navigate('/lab/cart') }}
                                                    className="w-full mt-4 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg"
                                                >
                                                    Go to Cart
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={(e) => handleAddToCart(e, pkg)}
                                                    className="w-full mt-4 bg-teal-700 hover:bg-teal-800 text-white font-semibold py-3 px-4 rounded-lg"
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

                        {/* VIEW MORE */}
                        {hasMore && !loading && (
                            <div className="flex justify-center mt-8">
                                <button
                                    onClick={() => {
                                        const nextPage = pageNumber + 1
                                        setPageNumber(nextPage)
                                        loadMoreTests(nextPage)
                                    }}
                                    className="px-6 py-3 bg-teal-600 text-white rounded-lg text-lg font-medium hover:bg-teal-700"
                                >
                                    View More
                                </button>
                            </div>
                        )}

                        {/* LOADING MORE */}
                        {loading && (
                            <div className="flex justify-center py-6">
                                <span className="loading loading-spinner loading-sm"></span>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default TestByCategoryTestList
