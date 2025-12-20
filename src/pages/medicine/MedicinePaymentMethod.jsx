// src/pages/medicine/MedicinePaymentMethod.jsx

import React, { useEffect, useState } from 'react';
import Swal from "sweetalert2";
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAddresses } from '../../redux/features/addressSlice';
import { FaHome, FaPlus } from "react-icons/fa";
import { FaBuildingColumns } from "react-icons/fa6";
import axiosInstance from '../../Authorization/axiosInstance';
import AddNewAddressModal from '../../component/AddNewAddress';
import { useAuth } from '../../Authorization/AuthContext';
import RazorpayPayments from '../../component/payments/RazorpayPayments';
import { amountToWords } from '../../utils/numberToWords';


function PaymentMethod() {
    const { userData } = useAuth();
    const userId = userData?.id;
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const { cartData, totalAmount } = location.state || {};
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [addNewAddressModal, setAddNewAddressModal] = useState(false)
    const from = useParams()
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

    const showOrderConfirmation = (response) => {
        localStorage.removeItem("recentAcceptedPrescriptionId")
        localStorage.removeItem("recentUplaodedPrescriptionIs")
        navigate('/medicine/checkout/order-confirm', { state: { totalAmount, cartData } })
    }

    return (
        <div className="container md:mx-auto mx-2 flex flex-col py-2 ">
            <h1 className="md:text-2xl text-md text-center md:text-start font-bold mb-6">
                Payment Method
            </h1>
            <div className="flex-1 grid gap-5 md:grid-cols-3 ">
                <div className="md:col-span-2 shadow-md bg-white rounded-md p-6 mx-2">
                    <h2 className="text-md text-gray-500 font-bold mb-4">Total items ({totalItems})</h2>

                    {cartData?.map((item) => (
                        <div key={item.id} className="flex  md:block justify-between items-center mb-3 border-b border-gray-200 pb-2">
                            <div>
                                <p className="font-semibold text-[12px] md:text-md  ">{item.medicineBatch?.medicine?.name}</p>
                                <p className="text-gray-600 text-sm">
                                    Strength: {item.medicineBatch?.strength}
                                </p>
                                <p className="text-gray-600 text-sm">
                                    Quantity: <span className="font-medium">{item.quantity}</span>
                                </p>
                            </div>
                            <div className="text-right font-semibold text-gray-600">
                                {item.unitPrice}x{item.quantity} = {formatRupees(item.unitPrice * item.quantity)}
                            </div>
                        </div>
                    ))}
                    <div className="flex justify-end">
                        <div className="flex flex-col justify-end mt-4 text-right">
                            <p className="font-semibold text-md mb-2 digital-font">
                                Total Amount to Pay : {" "}
                                <span className="font-bold">
                                    {formatRupees(totalAmount)}
                                </span>
                            </p>

                            <p className="text-sm digital-font text-gray-600 font-semibold">
                                {amountToWords(totalAmount)}
                            </p>
                        </div>
                    </div>

                </div>
                <div className="p-6 mx-2 flex flex-col gap-6 shadow-md rounded-md  bg-white">



                    {/* ========================
                        TAB: ADDRESS
                    ========================= */}

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
                            onClick={() => setAddNewAddressModal(true)}
                            className="absolute bottom-0 right-2 cursor-pointer bg-teal-600 text-white w-12 h-12 flex items-center justify-center rounded-full shadow-md hover:bg-teal-700"
                        >
                            <FaPlus className="text-lg" />
                        </button>
                    </div>


                    {(selectedAddressId) &&
                        < RazorpayPayments
                            amount={totalAmount}
                            email={userData?.email}
                            planId="1"
                            contact={userData?.mobileNumber}
                            checkoutFrom={""}
                            deliveryAddressId={selectedAddressId}
                            description="medicineOrder"
                            type="medicine order"
                            userId={userData?.id}
                            orderFrom="pharmacy"
                            selectedPaymentMethod={
                                {
                                    selectedPayment: true,

                                }
                            }
                            onSuccess={showOrderConfirmation}
                        // onfailure={showOrderFailed}
                        />}
                </div>
            </div>

            {addNewAddressModal &&
                <div
                    onClick={() => setAddNewAddressModal(false)}
                    className="fixed inset-0 z-50 flex items-center justify-center backdrop-brightness-50">
                    {/* Modal Container */}
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-4xl mx-4 bg-white rounded-xl shadow-2xl animate-fadeIn">

                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b">
                            <h2 className="text-lg font-semibold text-gray-800">
                                Add New Address
                            </h2>

                            <button
                                onClick={() => setAddNewAddressModal(false)}
                                className="text-gray-400 hover:text-gray-700 text-2xl leading-none focus:outline-none"
                                aria-label="Close modal"
                            >
                                &times;
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 max-h-[70vh] overflow-y-auto">
                            <AddNewAddressModal
                                onClose={() => setAddNewAddressModal(false)}
                                onSuccess={() => dispatch(fetchAddresses(userId))}
                            />
                        </div>
                    </div>
                </div>

            }
        </div>
    );
}

export default PaymentMethod;
