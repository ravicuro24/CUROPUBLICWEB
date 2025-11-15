// src/pages/medicine/MedicineProductBySubCategory.jsx
import React, { useState } from "react";
import { useAuth } from "../../Authorization/AuthContext";
import axiosInstance from "../../Authorization/axiosInstance";
import { useNavigate } from "react-router-dom";

function MedicineProductBySubCategory({ productList = [] }) {
    const { userData, getAllMedicineCartItems } = useAuth()
    const [addingCartId, setAddingCartItd] = useState(null)
    const navigate = useNavigate()
    const userId = userData?.id


    const handleAddtocart = async (item) => {
        try {
            setAddingCartItd(item?.pharmacyMedicineBatch.id)
            const response = await axiosInstance.post(
                `/endUserEndPoint/addToCart?userId=${userId}&batchId=${item?.pharmacyMedicineBatch.id}`
            );
            await getAllMedicineCartItems(userId);
            console.log("Add to Cart In ShopMedicine", response)
            setAddingCartItd(null)
        } catch (error) {
            console.log("error add to cart", error.respose)
            setAddingCartItd(null)
        }
    }

    return (
        <div className="space-y-3 md:space-y-4 px-3 h-screen  w-full">
            {productList.map((item, index) => (
                <div
                    onClick={() =>
                        navigate('/medicine/subCategory/medicine_details', {
                            state: { medicineList: item }
                        })
                    }
                    key={index}
                    className="flex items-center bg-white border border-gray-200 rounded-md p-3 shadow-sm"
                >
                    {/* Image */}
                    <div className="w-20 h-20 md:w-28 md:h-28 ">
                        <img
                            src={item?.pharmacyMedicineBatch?.medicine?.imagesUrl?.[0]}
                            alt="medicine"
                            className="h-full w-full object-contain rounded-md"
                        />
                    </div>

                    {/* Content */}
                    <div className="ml-3 flex flex-col justify-between w-full">
                        {/* Name */}
                        <p className="font-semibold text-sm md:text-base line-clamp-2">
                            {item?.pharmacyMedicineBatch?.medicine?.name}
                        </p>

                        {/* Category */}
                        <p className="text-xs md:text-sm text-gray-500 mt-1">
                            {item?.pharmacyMedicineBatch?.medicine?.packagingType} • {item?.pharmacyMedicineBatch?.medicine?.packagingSize}
                        </p>

                        {/* Price & Distance */}
                        <div className="flex  justify-between items-center mt-2">
                            <div className="flex flex-col justify-start items-start mt-2">
                                <p className="text-green-700 font-semibold text-sm md:text-lg">
                                    ₹{item?.pharmacyMedicineBatch?.effectiveCostPrice}
                                </p>

                                <p className="text-[10px] md:text-xs text-gray-400">
                                    {item?.distance?.toFixed(2)} km away
                                </p>
                            </div>
                            <div>
                                <button
                                    onClick={() => handleAddtocart(item)}
                                    className="bg-green-500 text-white px-4 py-1 rounded-md"
                                >
                                    {addingCartId === item?.pharmacyMedicineBatch.id ? (
                                        <span className="loading loading-spinner loading-sm"></span>
                                    ) : (
                                        " Add "
                                    )}
                                </button>

                            </div>
                        </div>
                    </div>
                </div>
            ))}

        </div>


    );
}

export default MedicineProductBySubCategory;
