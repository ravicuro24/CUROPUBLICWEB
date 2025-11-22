// src/pages/lab/labhome/LabCartItems.jsx

import React, { useEffect } from 'react'
import { useLabAuth } from '../../../Authorization/LabAuthContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../Authorization/axiosInstance';

function LabCartItems() {
    const { userData, getAllLabCartItems, labCartItems } = useLabAuth()
    const navigate = useNavigate()
    const id = userData?.id;

    useEffect(() => {
        getAllLabCartItems()
    }, [])

    const calculateTotal = () => {
        return labCartItems.reduce((total, item) => total + (item.unitPrice * item.numberOfPatients), 0);
    }

    const handleRemoveItem = async (item) => {
        try {
            const response = await axiosInstance.put(`/endUserEndPoint/removeTestPackageFromCart?cartItemId=${item.id}`)
            await getAllLabCartItems();
        } catch (error) {
            console.error("Error removing item:", error?.response || error);
        }
    }

    const handleProceedToCheckout = () => {
        navigate('/lab/package/selectSlot', { state: labCartItems })
    }

    return (
        <div className="min-h-screen container md:mx-auto mx-2 py-8">
            <div className=" mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}


                {labCartItems.length === 0 ? (
                    // Empty Cart State
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                        <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
                            <svg fill="currentColor" viewBox="0 0 20 20">
                                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                        <p className="text-gray-600 mb-6">No test packages have been added to your cart yet.</p>
                        <button className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
                            Browse Packages
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 border-r border-r-gray-300 pr-4">
                            <div className="  overflow-hidden">
                                {/* Cart Header */}
                                <div className=" px-6 py-4 border-b border-gray-200">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-lg font-semibold text-gray-900">
                                            Cart Items ({labCartItems.length})
                                        </h2>
                                        <span className="text-sm text-gray-500">
                                            Total: ₹{calculateTotal().toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                {/* Cart Items List */}
                                <div className="divide-y divide-gray-200">
                                    {labCartItems.map((item) => (
                                        <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                                            <div className="flex flex-col sm:flex-row gap-4">
                                                {/* Package Image */}
                                                <div className="flex-shrink-0">
                                                    <img
                                                        src={item.labPackage?.packageImage || "https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg"}
                                                        alt={item.labPackage?.packageName}
                                                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover border border-gray-200"
                                                        onError={(e) => {
                                                            e.target.src = "https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg";
                                                        }}
                                                    />
                                                </div>

                                                {/* Package Details */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                                                        <div className="flex-1">
                                                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                                                                {item.labPackage?.packageName}
                                                            </h3>
                                                            <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                                                                {item.labPackage?.description || "Comprehensive health test package"}
                                                            </p>
                                                        </div>

                                                        {/* Price */}
                                                        <div className="text-right">
                                                            <p className="text-xl font-bold text-teal-600">
                                                                ₹{item.unitPrice?.toLocaleString()}
                                                            </p>
                                                            <p className="text-sm text-gray-500 mt-1">
                                                                per patient
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Quantity and Actions */}
                                                    <div className="flex items-center justify-between mt-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className="flex items-center bg-gray-100 rounded-lg px-3 py-1">
                                                                <span className="text-sm font-medium text-gray-700">
                                                                    Patients: {item.numberOfPatients}
                                                                </span>
                                                            </div>
                                                            <div className="text-sm font-semibold text-gray-900">
                                                                Total: ₹{(item.unitPrice * item.numberOfPatients).toLocaleString()}
                                                            </div>
                                                        </div>

                                                        {/* Remove Button */}
                                                        <button
                                                            onClick={() => handleRemoveItem(item)}
                                                            className="flex items-center gap-1 hover:bg-red-100 px-2 py-1 transition ease-in-out duration-300 rounded-lg cursor-pointer text-red-600 hover:text-red-700 font-medium text-sm transition-colors duration-200"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className=" p-6 sticky top-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>

                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="text-gray-900">₹{calculateTotal().toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Discount</span>
                                        <span className="text-green-600">-₹0</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Tax</span>
                                        <span className="text-gray-900">₹0</span>
                                    </div>

                                </div>

                                {/* Checkout Button */}
                                <button
                                    onClick={() => handleProceedToCheckout()}
                                    className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                                >
                                    Select Slot
                                </button>

                                {/* Security Badge */}
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        Secure checkout guaranteed
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default LabCartItems;