// src/pages/medicine/MedicineProductBySubCategory.jsx
import React, { useState } from "react";
import { useAuth } from "../../Authorization/AuthContext";
import axiosInstance from "../../Authorization/axiosInstance";
import { useNavigate } from "react-router-dom";
import Loader from "../../component/Loader";

function MedicineProductBySubCategory({ productList = [], loading }) {
    const { userData, getAllMedicineCartItems } = useAuth();
    const [addingCartId, setAddingCartId] = useState(null);
    const navigate = useNavigate();
    const userId = userData?.id;

    console.log("product list", productList);

    const handleAddtocart = async (item) => {
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



    const defaultImageURL =
        "https://png.pngtree.com/png-clipart/20240619/original/pngtree-drug-capsule-pill-from-prescription-in-drugstore-pharmacy-for-treatment-health-png-image_15366552.png";

    return (

        <div className="flex flex-wrap justify-start items-start gap-2 mx-2">
          
            {productList.map((item, index) => (
                <div
                    key={index}
                    onClick={() =>
                        navigate("/medicine/subCategory/medicine_details", {
                            state: { medicineList: item },
                        })
                    }
                    className="flex flex-col bg-white border border-gray-200 shadow-sm rounded-xl w-32 md:w-40 h-70 cursor-pointer hover:shadow-md transition"
                >
                    <img
                        className="w-full h-24 rounded-t-xl object-contain"
                        src={item?.pharmacyMedicineBatch?.medicine?.image || defaultImageURL}
                        alt={item?.pharmacyMedicineBatch?.medicine?.name || "Medicine"}
                    />

                    <div className="p-3 md:p-4 flex flex-col justify-between flex-grow">
                        <p className="text-xs md:text-sm line-clamp-2">
                            {item?.pharmacyMedicineBatch?.medicine?.name}
                        </p>

                        <p className="text-[10px] md:text-xs text-gray-500 mt-1">
                            {item?.pharmacyMedicineBatch?.medicine?.packagingType} •{" "}
                            {item?.pharmacyMedicineBatch?.medicine?.packagingSize}
                        </p>

                        <div className="mt-2">
                            <p className="text-green-700 font-semibold text-sm md:text-lg">
                                ₹{item?.pharmacyMedicineBatch?.effectiveCostPrice}
                            </p>

                            <p className="text-[10px] md:text-xs text-gray-400">
                                {item?.distance?.toFixed(2)} km away
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleAddtocart(item);
                            }}
                            className="mt-2 bg-green-500 text-white px-4 py-1 rounded-md hover:bg-green-600 transition"
                        >
                            {addingCartId === item?.pharmacyMedicineBatch?.id ? (
                                <span className="loading loading-spinner loading-sm"></span>
                            ) : (
                                "Add"
                            )}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default MedicineProductBySubCategory;
