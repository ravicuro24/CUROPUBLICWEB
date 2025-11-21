// src/pages/medicine/PrescriptionMedicineCart.jsx
import React, { useEffect, useState } from "react";
import axiosInstance from "../../Authorization/axiosInstance";
import { useAuth } from "../../Authorization/AuthContext";
import { useNavigate } from "react-router-dom";
import { useStomp } from "../../notification/StompSocket";

function PrescriptionMedicineCart({ prepared }) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { userData } = useAuth();
    const [handlingChareg, setHandlingChareg] = useState(12)
    const navigate = useNavigate()
    const { connected, subscribe } = useStomp();
    const [subscription, setSubscription] = useState(null);


    const subscribeToEndpoint = (endpoint, onMessage) => {
        if (!connected) return;

        // Unsubscribe old if exists
        if (subscription) subscription.unsubscribe();

        const sub = subscribe(endpoint, onMessage);
        setSubscription(sub);
    };

    // Fetch cart items added by pharmacist
    const fetchCartItems = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(
                `/endUserEndPoint/getMedicineCartAddedByPharmacy?userId=${userData.id}`
            );
            setItems(response.data.dtoList || []);
        } catch (error) {
            console.log("❌ Error fetching prescription cart:", error);
            setError("Failed to load items. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        subscribeToEndpoint("/topic/cart-update-" + userData.id, (msg) => {
            fetchCartItems()
        })
        fetchCartItems();

    }, []);

    const totalAmount = items.reduce(
        (sum, item) => sum + item.unitPrice * item.quantity,
        0
    );

    return (
        <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-10 py-8">
            <div className="max-w-2xl mx-auto">

                {/* Header */}
                <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-6">
                    Your Prescription Cart
                </h1>

                {/* Loading Spinner */}
                {loading && (
                    <div className="flex justify-center py-10">
                        <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 text-center">
                        {error}
                    </div>
                )}

                {/* Cart Items */}
                {!loading && !error && (
                    <div className="space-y-4">
                        {items.length === 0 ? (
                            <div className="p-6 bg-teal-50 border border-teal-200 rounded-xl text-center text-teal-700">
                                No items added by pharmacist yet.
                            </div>
                        ) : (
                            items.map((item) => {
                                const med = item.medicineBatch?.medicine;

                                return (
                                    <div
                                        key={item.id}
                                        className="bg-white shadow-md rounded-xl p-4 border border-teal-100 flex gap-4 items-start"
                                    >
                                        {/* Medicine Image */}
                                        <img
                                            src={
                                                med?.imagesUrl?.[0] ||
                                                "https://via.placeholder.com/80?text=No+Image"
                                            }
                                            alt={med?.name || "Medicine"}
                                            className="w-20 h-20 object-cover rounded-lg border"
                                        />

                                        {/* Medicine Info */}
                                        <div className="flex-1">
                                            <h2 className="text-lg font-semibold text-gray-800">
                                                {med?.name}
                                            </h2>

                                            <p className="text-sm text-gray-600 mt-1">
                                                Strength: {med?.strength || "N/A"}
                                            </p>

                                            <p className="text-sm text-gray-600 mt-1">
                                                Packaging: {med?.packagingType} - {med?.packagingSize}
                                            </p>

                                            <p className="text-sm text-gray-500 mt-1">
                                                Qty: {item.quantity}
                                            </p>

                                            {/* Expiry */}
                                            <p className="text-xs text-gray-500 mt-1">
                                                Exp: {item.medicineBatch?.expiryDate}
                                            </p>
                                        </div>

                                        {/* Price Section */}
                                        <div className="text-right min-w-[70px]">
                                            <p className="font-semibold text-teal-700">
                                                ₹{item.totalPrice}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                (₹{item.unitPrice}/unit)
                                            </p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}

                {/* CTA Button */}
                {items.length > 0 && !loading && (
                    <div className="mt-8">
                        <button
                            disabled={!prepared}
                            onClick={() => navigate("/medicine/payment/Prescription",
                                {
                                    state: {
                                        cartData: items,
                                        totalAmount: (Number(totalAmount) + Number(handlingChareg)).toFixed(2)
                                    }
                                }
                            )}
                            className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-xl font-semibold shadow-md transition">
                            Proceed to Checkout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PrescriptionMedicineCart;
