// src/pages/medicine/MedicineCartItems.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Authorization/AuthContext";
import axiosInstance from "../../Authorization/axiosInstance";
import { FaRegTrashAlt } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import SimilaMedicineProduct from '../medicine/SimilarMedicineProduct'
import LoadingAnimation from "../../LoaderSpinner";
import RazorpayPayment from "../../component/payments/RazorpayPayments";



function MedicineCartItems() {
    const navigate = useNavigate();
    const { userData, getAllMedicineCartItems, setAuthModal } = useAuth();
    const [handlingChareg, setHandlingChareg] = useState(12)
    const [cartData, setCartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const id = userData?.id

    const getAllCartItems = async (id) => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(
                `/endUserEndPoint/getCartItems?userId=${id}`
            );

            const data = response.data?.dtoList || [];

            // Filter items addedByPharmacyId === 0
            const filtered = data.filter((item) => item.addedByPharmacyId === 0);

            setCartData(filtered);
        } catch (error) {
            console.log("Cart fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    // Refresh on success
    useEffect(() => {
        if (id) {
            getAllCartItems(id)
            getAllMedicineCartItems(id);
        } else {
            setAuthModal(true)
            setLoading(false)
        }

    }, [userData]);
    const handleIncrease = async (itemId) => {
        const item = cartData.find((x) => x.id === itemId);
        if (!item) return;

        if (item.quantity >= 10) return toast.error("Max quantity 10");

        try {
            await axiosInstance.put(
                `/endUserEndPoint/increaseItemQuantity?cartItemId=${itemId}`
            );

            setCartData((prev) =>
                prev.map((i) =>
                    i.id === itemId ? { ...i, quantity: i.quantity + 1 } : i
                )
            );
        } catch {
            toast.error("Failed to increase");
        }
    };

    const handleDecrease = async (itemId) => {
        const item = cartData.find((x) => x.id === itemId);
        if (!item) return;

        try {
            if (item.quantity <= 1) {
                setCartData((prev) => prev.filter((i) => i.id !== itemId));
                await axiosInstance.delete(
                    `/endUserEndPoint/deleteCartItem?cartItemId=${itemId}`
                );
                getAllMedicineCartItems(id);
                return toast.success("Item removed");
            }

            await axiosInstance.put(
                `/endUserEndPoint/decreaseItemQuantity?cartItemId=${itemId}`
            );

            setCartData((prev) =>
                prev.map((i) =>
                    i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
                )
            );
        } catch {
            toast.error("Failed to update");
        }
    };

    const handleDeleteItem = async (item) => {
        try {
            setCartData((prev) => prev.filter((i) => i.id !== item.id));

            await axiosInstance.delete(
                `/endUserEndPoint/deleteCartItem?cartItemId=${item.id}`
            );
            getAllMedicineCartItems(id);

            toast.success("Removed from cart");
        } catch (error) {
            toast.error("Error removing item");
            setCartData((prev) => [...prev, item]);
        }
    };

    const EmptyCart = () => (
        <div className="flex h-screen flex-col items-center justify-center py-20">
            <div className="bg-gray-100 p-6 rounded-full mb-4">
                <img src="https://cdn-icons-png.flaticon.com/128/11329/11329060.png" alt="" />
            </div>
            <h2 className="text-2xl font-bold text-gray-700">Your Cart is Empty</h2>
            <p className="text-gray-500 mb-4">Start adding medicines to place your order</p>
            <button
                onClick={() => navigate("/medicine/delivery")}
                className="bg-teal-500 text-white px-6 py-2 rounded-md shadow"
            >
                Browse Products
            </button>
        </div>
    );

    if (loading)
        return (
            <LoadingAnimation />
        );

    if (cartData.length === 0) {
        return <EmptyCart />;
    }

    // Total Price
    const totalAmount = cartData.reduce(
        (sum, item) => sum + item.unitPrice * item.quantity,
        0
    );

    return (
        <div className="min-h-screen pb-28 px-4 container mx-auto">
            <p className="text-sm text-gray-600 mt-4">
                Total {cartData.length} items
            </p>

            {/* CART LIST */}
            <div className="flex flex-col md:flex-row gap-4 ">
                {/* LEFT CART ITEMS */}
                <div className="mt-4 space-y-4 md:w-2/3 md:border-r md:border-gray-300 md:pr-4 w-full">
                    {cartData.map((item) => {
                        const medicine = item.medicineBatch?.medicine;

                        return (
                            <div
                                key={item.id}
                                className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-300"
                            >

                                <div className="flex gap-4 w-full md:w-auto">
                                    <div>
                                        {!medicine.otc && <p className="text-[8px] bg-amber-200 border-amber-500 text-amber-500 px-1 rounded-full">Prescription Required</p>}
                                        <img
                                            src={
                                                // medicine?.imagesUrl?.[0] ||
                                                `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBeTXqOJnhL2W_vZewM6uL7UcNmfknP9MvEQ&s` ||
                                                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQywcmMUL-iZxqJ_yZYp67MaZefH7aXhMPS5w&s"
                                            }
                                            className="w-20 h-20 object-contain bg-gray-100 rounded"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 line-clamp-2">
                                            {medicine?.name || "Medicine"}
                                        </h3>
                                        <p className="text-xs mt-1 text-gray-600">
                                            Strip of 10 tablets
                                        </p>
                                    </div>
                                </div>

                                {/* PRICE & QUANTITY */}
                                <div className="w-full md:w-auto">
                                    <p className="text-sm text-gray-700 text-left md:text-right">
                                        ₹{item.unitPrice} × {item.quantity} ={" "}
                                        <span className="font-semibold">
                                            ₹{item.unitPrice * item.quantity}
                                        </span>
                                    </p>

                                    <div className="flex items-center gap-3 border border-teal-600 w-32 mt-2 px-2 py-1">
                                        {item.quantity === 1 ? (
                                            <button
                                                onClick={() => handleDeleteItem(item)}
                                                className="w-7 h-7 flex items-center justify-center rounded-full hover:cursor-pointer transition "
                                            >
                                                <FaRegTrashAlt className="text-red-500 text-sm" />
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleDecrease(item.id)}
                                                className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 cursor-pointer"
                                            >
                                                −
                                            </button>
                                        )}

                                        <span className="font-semibold text-gray-700 min-w-[1rem] text-center cursor-pointer">
                                            {item.quantity}
                                        </span>

                                        <button
                                            onClick={() => handleIncrease(item.id)}
                                            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* RIGHT BILL SUMMARY */}
                <div className="md:w-1/4 w-full mt-10 md:ml-10">
                    <div className="mx-auto w-full">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">
                            Bill Summary
                        </h2>

                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between text-gray-700">
                                <span>Item total (MRP)</span>
                                <span className="font-medium">₹{totalAmount.toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between text-gray-700">
                                <span>Handling charges</span>
                                <span className="font-medium">₹{handlingChareg}</span>
                            </div>

                            <div className="flex justify-between text-gray-700">
                                <span>Total discount</span>
                                <span className="font-medium text-teal-600">0</span>
                            </div>

                            <div className="flex justify-between text-gray-700">
                                <span>Shipping fee</span>
                                <span className="font-medium text-teal-600">Free</span>
                            </div>
                        </div>

                        <hr className="my-4" />

                        <div className="flex justify-between text-gray-900 text-base font-semibold">
                            <span>Grand Total</span>
                            <span>
                                ₹{(Number(totalAmount) + Number(handlingChareg)).toFixed(2)}
                            </span>
                        </div>

                        <button
                            className="bg-teal-600 w-full mt-6 text-white px-4 cursor-pointer py-2 text-lg font-semibold"
                            onClick={() =>
                                navigate("/medicine/payemnt", {
                                    state: {
                                        cartData,
                                        totalAmount: (Number(totalAmount) + Number(handlingChareg)).toFixed(2),
                                    },
                                })
                            }
                        >
                            Continue
                        </button>
                    </div>
                </div>

            </div>
            
            <SimilaMedicineProduct name={"Fever"} />
        </div>

    );
}

export default MedicineCartItems;
