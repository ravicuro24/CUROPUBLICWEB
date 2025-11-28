// src/pages/lab/labhome/LabCartItems.jsx

import React, { useEffect, useState } from 'react'
import { useLabAuth } from '../../../Authorization/LabAuthContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../Authorization/axiosInstance';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShoppingCart,
    Trash2,
    Shield,
    CreditCard,
    Wallet,
    IndianRupee,
    Calendar,
    TestTube
} from 'lucide-react';

function LabCartItems() {
    const { userData, getAllLabCartItems, labCartItems } = useLabAuth()
    const navigate = useNavigate()
    const id = userData?.id;

    const [paymentMethod, setPaymentMethod] = useState("Pay at Lab");
    const [paymentMessage, setPaymentMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [removingItem, setRemovingItem] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        // Fetch cart items
        getAllLabCartItems();

        // Smooth scroll to top
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);
    const calculateTotal = () => {
        return labCartItems.reduce((total, item) => total + (item.unitPrice * item.numberOfPatients), 0);
    }

    const calculateDiscount = () => {
        return labCartItems.reduce((total, item) => {
            const discount = item.labPackage?.discount || 0;
            return total + ((item.unitPrice * discount / 100) * item.numberOfPatients);
        }, 0);
    }

    const calculateFinalTotal = () => {
        return calculateTotal() - calculateDiscount();
    }

    const handleRemoveItem = async (item) => {
        setRemovingItem(item.id);
        try {
            await axiosInstance.put(`/endUserEndPoint/removeTestPackageFromCart?cartItemId=${item.id}`)
            await getAllLabCartItems();
        } catch (error) {
            console.error("Error removing item:", error?.response || error);
        } finally {
            setRemovingItem(null);
        }
    }

    const handleProceedToCheckout = async () => {
        if (paymentMethod !== "Pay at Lab") {
            setPaymentMessage("Only 'Pay at Lab' is allowed at this time.");
            return;
        }
        setIsLoading(true);
        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            // navigate('/lab/package/selectSlot', { state: labCartItems })
            navigate('/lab/package/typeCollection', { state: labCartItems })
        } finally {
            setIsLoading(false);
        }
    }

    const handlePaymentChange = (method) => {
        setPaymentMethod(method);
        setDropdownOpen(false);
        if (method !== "Pay at Lab") {
            setPaymentMessage("Only 'Pay at Lab' is allowed at this time.");
        } else {
            setPaymentMessage("");
        }
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
    };

    const paymentOptions = [
        { label: "Pay at Lab", icon: <Wallet className="w-4 h-4" /> },
        { label: "Credit/Debit Card", icon: <CreditCard className="w-4 h-4" /> },
        { label: "UPI Payment", icon: null },
        { label: "Net Banking", icon: null }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 py-8">
            <div className=" container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-start mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Cart</h1>
                    <p className="text-gray-600 text-xs">Review and manage your selected test packages</p>
                </motion.div>

                {labCartItems.length === 0 ? (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center max-w-md mx-auto">
                        <div className="w-20 h-20 mx-auto mb-6 bg-teal-50 rounded-full flex items-center justify-center">
                            <ShoppingCart className="w-10 h-10 text-teal-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">Your cart is empty</h3>
                        <p className="text-gray-600 mb-8">No test packages have been added to your cart yet.</p>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate('/lab')}
                            className="bg-gradient-to-r cursor-pointer from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 shadow-lg shadow-teal-500/25"
                        >
                            Browse Packages
                        </motion.button>
                    </motion.div>
                ) : (
                    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2">
                            <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm  overflow-hidden">
                                {/* Cart Header */}
                                <div className="bg-gradient-to-r from-teal-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <ShoppingCart className="h-4 w-4 md:w-6 md:h-6 text-teal-600" />
                                            <h2 className="text-md md:text-xl font-semibold text-gray-900">
                                                Cart Items ({labCartItems.length})
                                            </h2>
                                        </div>
                                        <span className="text-lg font-bold text-teal-600">
                                            ₹{calculateTotal().toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                {/* Cart Items List */}
                                <div className="divide-y divide-gray-100">
                                    <AnimatePresence>
                                        {labCartItems.map((item) => (
                                            <motion.div key={item.id} layout initial={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}
                                                className="p-6 hover:bg-gray-50/50 transition-colors duration-200">
                                                <div className="flex flex-col sm:flex-row gap-6">
                                                    {/* Package Image */}
                                                    <div className="flex-shrink-0">
                                                        <div className="relative">
                                                            <img
                                                                src={item.labPackage?.packageImage || "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"}
                                                                alt={item.labPackage?.packageName}
                                                                className="w-24 h-24 rounded-xl object-cover border border-gray-200 shadow-sm"
                                                                onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"; }}
                                                            />
                                                            <div className="absolute -top-2 -right-2 bg-teal-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                                                <TestTube className="w-3 h-3" />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Package Details */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                                                            <div className="flex-1">
                                                                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                                    {item.labPackage?.packageName}
                                                                </h3>
                                                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                                                    {item.labPackage?.description || "Comprehensive health test package including essential diagnostic tests"}
                                                                </p>
                                                            </div>

                                                            {/* Price and Actions */}
                                                            <div className="flex flex-col items-end gap-3">
                                                                <div className="text-right">
                                                                    <p className="text-md md:text-2xl font-bold text-teal-600">
                                                                        ₹{item.unitPrice?.toLocaleString()}
                                                                    </p>

                                                                </div>

                                                                <motion.button
                                                                    whileHover={{ scale: 1.02 }}
                                                                    whileTap={{ scale: 0.98 }}
                                                                    onClick={() => handleRemoveItem(item)}
                                                                    disabled={removingItem === item.id}
                                                                    className="flex items-center gap-2 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg transition-colors duration-200 text-red-600 hover:text-red-700 font-medium text-sm"
                                                                >
                                                                    {removingItem === item.id ? (
                                                                        <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                                                                    ) : (
                                                                        <Trash2 className="w-4 h-4" />
                                                                    )}
                                                                    Remove
                                                                </motion.button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm  p-6 sticky top-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                    Order Summary
                                </h3>

                                {/* Pricing Breakdown */}
                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="text-gray-900 font-semibold">₹{calculateTotal().toLocaleString()}</span>
                                    </div>

                                    {/* <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Discount</span>
                                        <span className="text-teal-600 font-semibold">-₹{calculateDiscount().toLocaleString()}</span>
                                    </div> */}

                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500">Taxes & Fees</span>
                                        <span className="text-gray-700">₹0</span>
                                    </div>

                                    <div className="border-t border-gray-200 pt-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-semibold text-teal-700">Total Amount</span>
                                            <span className="text-gray-900 font-semibold">₹{calculateTotal().toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Custom Payment Method Dropdown */}
                                <div className="mb-6 relative">
                                    <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                                        <CreditCard className="w-4 h-4" /> Payment Method
                                    </label>
                                    <div
                                        className="border border-gray-300 rounded-xl py-3 px-4 text-sm bg-gray-50 cursor-pointer flex justify-between items-center"
                                        onClick={() => setDropdownOpen(!dropdownOpen)}
                                    >
                                        <div className="flex items-center gap-2">
                                            {paymentOptions.find(opt => opt.label === paymentMethod)?.icon}
                                            <span>{paymentMethod}</span>
                                        </div>
                                        <span className="text-gray-500">▼</span>
                                    </div>
                                    {dropdownOpen && (
                                        <div className="absolute left-0 right-0 mt-1 bg-white border rounded-xl shadow-lg z-10">
                                            {paymentOptions.map(opt => (
                                                <div key={opt.label}
                                                    className="px-4 py-3 hover:bg-teal-50 cursor-pointer flex items-center gap-2"
                                                    onClick={() => handlePaymentChange(opt.label)}
                                                >
                                                    {opt.icon}
                                                    <span>{opt.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {paymentMessage && (
                                        <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-sm mt-2 flex items-center gap-1">
                                            ⚠️ {paymentMessage}
                                        </motion.p>
                                    )}
                                </div>

                                {/* Checkout Button */}
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleProceedToCheckout}
                                    disabled={isLoading}
                                    className="w-full bg-gradient-to-r cursor-pointer from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-teal-500/25 flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <Calendar className="w-5 h-5" />
                                            Select Time Slot
                                        </>
                                    )}
                                </motion.button>

                                {/* Security & Trust Badges */}
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                                            <Shield className="w-4 h-4 text-teal-500" />
                                            100% Secure Payment
                                        </div>
                                        <div className="text-xs text-gray-400 text-center">
                                            Your personal and payment information is always protected
                                        </div>
                                    </div>
                                </div>

                                {/* Additional Benefits */}
                                <div className="mt-6 space-y-3">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <div className="w-2 h-2 bg-teal-700 rounded-full"></div>
                                        Free sample collection at home
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <div className="w-2 h-2 bg-teal-700 rounded-full"></div>
                                        Digital reports within 24 hours
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <div className="w-2 h-2 bg-teal-700 rounded-full"></div>
                                        Certified diagnostic labs
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

export default LabCartItems;
