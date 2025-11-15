// src/pages/medicine/MedicinePaymentMethod.jsx

import React, { useEffect, useState } from 'react';
import Swal from "sweetalert2";
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Authorization/AuthContext';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAddresses } from '../../redux/features/addressSlice';
import { FaHome, FaPlus } from "react-icons/fa";
import { FaBuildingColumns } from "react-icons/fa6";

function PaymentMethod() {
    const { userData } = useAuth();
    const userId = userData?.id;
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    const { cartData, totalAmount } = location.state || {};

    const [selectedPayment, setSelectedPayment] = useState('cod');
    const [selectedAddressId, setSelectedAddressId] = useState(null);

    const { addresses } = useSelector((state) => state.address);

    // MOBILE TABS
    const [activeTab, setActiveTab] = useState("payment");

    useEffect(() => {
        if (userId) {
            dispatch(fetchAddresses(userId));
        }
    }, []);

    const formatRupees = (amount) =>
        new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

    const totalItems = cartData?.reduce((sum, item) => sum + item.quantity, 0) || 0;

    // ❗ BLOCK ALL PAYMENT METHODS EXCEPT COD
    const handlePaymentSelect = (method) => {
        if (method !== "cod") {
            Swal.fire({
                icon: "warning",
                title: "Not Available",
                text: "Only Cash on Delivery is allowed in your area.",
                confirmButtonColor: "#16A34A",
            });
            return; // stop selection
        }

        setSelectedPayment(method);
    };

    const handlePlaceOrder = () => {

        console.log(selectedPayment)
        navigate('/medicine/checkout/order-confirm', { state: { payment: selectedPayment, totalAmount, cartData } })
    };

    const paymentMethods = [
        { value: 'cod', label: 'Cash on Delivery', icon: 'https://cdn-icons-png.flaticon.com/128/6491/6491623.png' },
        { value: 'upi', label: 'UPI Payment', icon: 'https://cdn-icons-png.flaticon.com/128/8983/8983163.png' },
        { value: 'card', label: 'Credit/Debit Card', icon: 'https://cdn-icons-png.flaticon.com/128/16174/16174534.png' },
        { value: 'netbanking', label: 'Net Banking', icon: 'https://cdn-icons-png.flaticon.com/128/1625/1625539.png' },
    ];

    return (
        <div className="container md:mx-auto mx-2 flex flex-col py-2 ">
            <h1 className="md:text-2xl text-md text-center md:text-start font-bold mb-6">
                Payment Method
            </h1>

            <div className="flex-1 grid gap-5 md:grid-cols-3 ">

                {/* =====================
                    LEFT SIDE - CART ITEMS
                ===================== */}
                <div className="md:col-span-2 shadow-md bg-white rounded-md p-6 mx-2">
                    <h2 className="text-md text-gray-500 font-bold mb-4">Total items ({totalItems})</h2>

                    {cartData?.map((item) => (
                        <div key={item.id} className="flex hidden md:block justify-between items-center mb-3 border-b border-gray-200 pb-2">
                            <div>
                                <p className="font-semibold">{item.medicineBatch?.medicine?.name}</p>
                                <p className="text-gray-600 text-sm">
                                    Batch: {item.medicineBatch?.batchNumber}, Strength: {item.medicineBatch?.strength}
                                </p>
                                <p className="text-gray-600 text-sm">
                                    Quantity: <span className="font-medium">{item.quantity}</span>
                                </p>
                            </div>
                            <div className="text-right font-semibold text-gray-600">
                                {formatRupees(item.unitPrice * item.quantity)}
                            </div>
                        </div>
                    ))}
                </div>

                {/* ============================
                   RIGHT SIDE - Payment / Address
                ============================= */}
                <div className="p-6 mx-2 flex flex-col gap-6 shadow-md rounded-md  bg-white">

                    {/* -------- MOBILE TABS -------- */}
                    <div className="flex md:hidden w-full border-b border-gray-200 mb-2">
                        <button
                            className={`flex-1 text-center py-2 font-semibold 
                                ${activeTab === "payment" ? "border-b-2 border-green-600 text-green-600" : "text-gray-500"}
                            `}
                            onClick={() => setActiveTab("payment")}
                        >
                            Payment
                        </button>

                        <button
                            className={`flex-1 text-center py-2 font-semibold 
                                ${activeTab === "address" ? "border-b-2 border-green-600 text-green-600" : "text-gray-500"}
                            `}
                            onClick={() => setActiveTab("address")}
                        >
                            Address
                        </button>
                    </div>

                    {/* ========================
                        TAB: PAYMENT
                    ========================= */}
                    {(activeTab === "payment" || window.innerWidth >= 768) && (
                        <div className=''>
                            <h2 className="text-md font-bold mb-3  text-gray-400">Select Payment Method</h2>

                            <div className="flex flex-col gap-3">
                                {paymentMethods.map((method) => (
                                    <label
                                        key={method.value}
                                        className="flex items-center gap-2 p-2 border text-gray-500 
                                        border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                                    >
                                        <input
                                            type="radio"
                                            name="payment"
                                            value={method.value}
                                            checked={selectedPayment === method.value}
                                            onChange={() => handlePaymentSelect(method.value)}
                                            className="accent-green-600"
                                        />
                                        <img className="h-10" src={method.icon} alt={method.label} />
                                        {method.label}
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ========================
                        TAB: ADDRESS
                    ========================= */}
                    {(activeTab === "address" || window.innerWidth >= 768) && (
                        <div className="relative">
                            <h2 className="text-md font-bold mb-3 text-gray-400">Select Address</h2>

                            <div className="grid grid-cols-1 gap-4 pb-14">
                                {addresses?.map((add, index) => (
                                    <div
                                        key={index}
                                        onClick={() => setSelectedAddressId(add.id)}
                                        className={`flex justify-start items-center gap-4 bg-white px-4 py-2 rounded-lg border cursor-pointer transition-all
                                            ${selectedAddressId === add.id ? "border-green-600 bg-green-50" : "border-gray-200 hover:bg-gray-50"}
                                        `}
                                    >
                                        <div className="text-teal-700 bg-teal-50 p-2 rounded-full text-xl">
                                            {add.addressType === "HOME" ? (
                                                <FaHome size={14} />
                                            ) : (
                                                <FaBuildingColumns size={14} />
                                            )}
                                        </div>

                                        <div className="flex-1">
                                            <p className="text-gray-600 text-sm">
                                                {add.street}, {add.houseNumber}, {add.city}, {add.state} - {add.postalCode}
                                            </p>
                                            <p className="text-gray-700 text-sm font-medium">{add.phoneNumber}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Add Address Button */}
                            <button
                                onClick={() => navigate("/add-address")}
                                className="absolute bottom-0 right-2 cursor-pointer bg-teal-600 text-white w-12 h-12 flex items-center justify-center rounded-full shadow-md hover:bg-teal-700"
                            >
                                <FaPlus className="text-lg" />
                            </button>
                        </div>
                    )}

                    {/* ========================
                        PLACE ORDER BUTTON
                    ========================= */}
                    <button
                        onClick={handlePlaceOrder}
                        disabled={!(selectedPayment && selectedAddressId)}
                        className={`w-full text-white font-bold py-3 rounded-lg 
                            ${selectedPayment && selectedAddressId
                                ? "bg-green-600 hover:bg-green-700 cursor-pointer"
                                : "bg-gray-300 cursor-not-allowed"
                            }`}
                    >
                        Place Order ₹{totalAmount}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PaymentMethod;
