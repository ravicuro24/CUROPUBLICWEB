// src/pages/medicine/MedicineProductBySubCategory.jsx
import React, { useState } from "react";
import { useAuth } from "../../Authorization/AuthContext";
import axiosInstance from "../../Authorization/axiosInstance";
import { useNavigate } from "react-router-dom";

function MedicineProductBySubCategory({ productList = [], loading }) {
    const { userData, getAllMedicineCartItems, setAuthModal, allmedicineIncart } = useAuth();
    const [addingCartId, setAddingCartId] = useState(null);
    const navigate = useNavigate();
    const userId = userData?.id;

    const handleAddtocart = async (item) => {
        if (!userId) {
            setAuthModal(true);
            return;
        }
        try {
            setAddingCartId(item?.pharmacyMedicineBatch?.id);
            const response = await axiosInstance.post(
                `/endUserEndPoint/addToCart?userId=${userId}&batchId=${item?.pharmacyMedicineBatch?.id}`
            );
            await getAllMedicineCartItems(userId);
            console.log("Add to Cart In ShopMedicine", response);
            setAddingCartId(null);
        } catch (error) {
            console.error("Error adding to cart:", error?.response || error);
            setAddingCartId(null);
        }
    };

    // Check if product already exists in cart
    const isInCart = (batchId) => {
        return allmedicineIncart?.some(
            (cartItem) => cartItem?.medicineBatch?.id === batchId
        );
    };

    const defaultImageURL =
        "https://png.pngtree.com/png-clipart/20240619/original/pngtree-drug-capsule-pill-from-prescription-in-drugstore-pharmacy-for-treatment-health-png-image_15366552.png";

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 mx-2">
            {productList.map((item, index) => (
                <div
                    key={index}
                    onClick={() =>
                        navigate("/medicine/subCategory/medicine_details", {
                            state: { medicineList: item },
                        })
                    }
                    className="flex flex-col bg-white border border-gray-100 shadow-sm rounded-xl h-70 cursor-pointer hover:shadow-md transition"
                >
                    <div className="relative">
                        <img
                            className="w-full md:h-24 h-16 rounded-t-xl object-contain p-2"
                            src={item?.pharmacyMedicineBatch?.medicine?.imagesUrl?.[0] || defaultImageURL}
                            alt={item?.pharmacyMedicineBatch?.medicine?.name || "Medicine"}
                        />

                        {!item?.pharmacyMedicineBatch?.medicine?.otc && (
                            <span className="absolute top-0 -right-2 z-10 text-[4px] md:text-[8px] bg-yellow-300 text-amber-900 rounded-full px-2 py-[2px] font-semibold">
                                Prescription required
                            </span>
                        )}
                    </div>

                    <div className="p-1 md:p-2 flex flex-col justify-between flex-grow">
                        <p className="text-xs md:text-sm line-clamp-2">
                            {item?.pharmacyMedicineBatch?.medicine?.name}
                        </p>

                        <p className="text-[10px] md:text-xs text-gray-500">
                            {item?.pharmacyMedicineBatch?.medicine?.packagingType} •{" "}
                            {item?.pharmacyMedicineBatch?.medicine?.packagingSize}
                        </p>

                        <div>
                            <p className="text-teal-700 font-semibold text-sm md:text-lg">
                                ₹{item?.pharmacyMedicineBatch?.unitPrice
                                }
                            </p>
                            <p className="text-[10px] md:text-xs text-gray-400">
                                {item?.distance?.toFixed(2)} km away
                            </p>
                        </div>

                        {isInCart(item?.pharmacyMedicineBatch?.id) ? (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate("/medicine/cart");
                                }}
                                className="mt-2 border border-teal-500 text-teal-700 cursor-pointer px-2 md:px-4 py-2 rounded-md hover:bg-teal-200/10 transition text-xs md:text-md"
                            >
                                Go to Cart
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddtocart(item); // ⬅️ No OTC checking, always allow
                                }}
                                className={`mt-2 px-1 md:px-4 md:py-2 py-1 rounded-md transition text-xs md:text-md
                                    bg-teal-500 text-white hover:bg-teal-600 cursor-pointer
                                    `}
                             >
                                {addingCartId === item?.pharmacyMedicineBatch?.id ? (
                                    <span className="loading loading-spinner loading-sm"></span>
                                ) : (
                                    <span className="text-[9px] text-md">Add</span>
                                )}
                            </button>



                        )}
                    </div>
                </div>
            ))}
            
        </div>
    );
}

export default MedicineProductBySubCategory;
