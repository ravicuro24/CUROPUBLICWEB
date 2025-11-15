// src/pages/medicine/SubCategoryMedicineDetails.jsx
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import SimilarMedicineProduct from "./SimilarMedicineProduct";
import axiosInstance from "../../Authorization/axiosInstance";
import { useAuth } from "../../Authorization/AuthContext";
import { toast } from "react-toastify";

function SubCategoryMedicineDetails() {
    const { getAllMedicineCartItems, userData } = useAuth()
    const userId = userData?.id
    const { state } = useLocation();
    const data = state?.medicineList;
    const medicine = data?.pharmacyMedicineBatch;
    const images = medicine.medicine?.imagesUrl || [];
    const [activeImage, setActiveImage] = useState(images[0]);
    const [addingCart, setAddingCart] = useState(false)

    if (!data) {
        return (
            <div className="p-6 text-center text-red-500">
                No medicine details!
            </div>
        );
    }

    const handleAddtocart = async (item) => {
        console.log("item", item.pharmacyMedicineBatch.id)
        try {
            setAddingCart(true)
            const response = await axiosInstance.post(
                `/endUserEndPoint/addToCart?userId=${userId}&batchId=${item?.pharmacyMedicineBatch.id}`
            );
            await getAllMedicineCartItems(userId);
            setAddingCart(false)
            toast.success(`${medicine.medicine?.name} Added in cart`);
        } catch (error) {
            console.log("error add to cart", error.respose)
            setActiveImage(false)
        }
    }

    return (
        <div className=" min-h-screen p-6 container md:mx-auto mx-2">
            <div className=" mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* LEFT SECTION */}
                <div className="col-span-2  ">
                    <div className="flex gap-4">
                        <div className="flex gap-4">
                            {/* Thumbnail List */}
                            <div className="flex flex-col gap-3">
                                {images.map((img, i) => (
                                    <img
                                        key={i}
                                        src={img}
                                        onClick={() => setActiveImage(img)}
                                        className={`h-20 w-20 object-cover rounded-lg border cursor-pointer ${activeImage === img ? "border-blue-600" : "border-gray-300"
                                            }`}
                                    />
                                ))}
                            </div>

                            {/* Main Image */}
                            <div className="flex-1">
                                <img
                                    src={activeImage}
                                    className="w-full h-72 object-cover rounded-xl shadow"
                                />
                            </div>
                        </div>
                        <div className="mt-6">
                            {/* Title */}
                            <h1 className="text-2xl font-semibold text-gray-800">
                                {medicine.medicine?.name}
                            </h1>

                            {/* Ratings */}
                            <div className="flex items-center gap-3 mt-2">
                                <span className="bg-green-600 text-white px-2 py-1 rounded-md text-sm font-semibold">
                                    4.3 ★
                                </span>
                                <span className="text-gray-600">
                                    296 Ratings & 57 Reviews
                                </span>
                            </div>

                            {/* Price */}
                            <div className="mt-4 flex items-center gap-3">
                                {/* SELLING PRICE */}
                                <p className="text-green-600 text-2xl font-bold">
                                    ₹{medicine?.unitPrice}
                                </p>

                                {/* MRP */}
                                {/* <p className="line-through text-gray-500">
                                    ₹{medicine?.unitPrice}
                                </p> */}

                                {/* AUTO-CALCULATED DISCOUNT */}
                                <p className="text-green-600 font-semibold">
                                    (0) %off
                                    {/* {Math.round(
                                        ((medicine?.unitPrice - medicine?.costPrice) / medicine?.unitPrice) * 100
                                    )}% off */}
                                </p>
                            </div>



                            {/* Highlights */}
                            <div className="mt-6">
                                <h2 className="font-semibold text-gray-700">Product highlights</h2>
                                <ul className="mt-2 text-gray-600 list-disc pl-5">
                                    <li>It can help manage your blood sugar levels</li>
                                    <li>The tablets can help stimulate secretion of insulin</li>
                                    <li>It can help manage metabolism & produce key enzymes</li>
                                    <li>It can aid in repairing beta cells</li>
                                </ul>
                            </div>

                            {/* Symptoms */}
                            {medicine?.diseases?.length > 0 && (
                                <div className="mt-6">
                                    <p className="text-gray-600 mt-1 text-sm">
                                        {medicine.diseases.join(", ")}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>


                </div>

                {/* RIGHT SECTION – ADD TO CART CARD */}
                <div className="bg-white rounded-xl p-6 shadow-sm  sticky top-10">
                    <p className="text-green-600 text-2xl font-bold">
                        ₹{medicine?.unitPrice}
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                        {/* <p className="line-through text-gray-500 text-lg">₹120</p> */}
                        <p className="text-green-600 font-semibold text-lg">
                            {data?.discount || 0}% off
                        </p>
                    </div>

                    <p className="text-gray-500 text-sm mt-1">
                        Inclusive of all taxes
                    </p>

                    {/* Add to Cart */}
                    <button
                        onClick={() => handleAddtocart(data)}
                        className="mt-5 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition"
                    >
                        {addingCart ? <span className="loading loading-spinner loading-sm"></span> : "Add to cart"}
                    </button>
                </div>
            </div>
            <SimilarMedicineProduct name={medicine.medicine?.prescribedFor} />
        </div>
    );
}

export default SubCategoryMedicineDetails;
