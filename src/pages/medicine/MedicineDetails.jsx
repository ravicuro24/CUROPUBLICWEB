// src/pages/medicine/MedicineDetails.jsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import SimilarMedicineProduct from "./SimilarMedicineProduct";
import axiosInstance from "../../Authorization/axiosInstance";
import { useAuth } from "../../Authorization/AuthContext";

export default function MedicineDetails() {
    const { userData, getAllMedicineCartItems } = useAuth();
    const userId = userData?.id;
    const { state } = useLocation();
    const medicine = state?.medicine;
    const [addingCart, setAddingCart] = useState(false);
    const [showAll, setShowAll] = useState(false);
    const symptoms = medicine.medicine?.symptoms || [];
    const displayedSymptoms = showAll ? symptoms : symptoms.slice(0, 4);
    const [activeImage, setActiveImage] = useState(
        medicine?.medicine?.imagesUrl?.[0] || "https://thumbs.dreamstime.com/b/herbal-medicine-herbs-21119245.jpg"
    );

    if (!medicine) return <div>No medicine data found.</div>;

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        setActiveImage(medicine.medicine?.imagesUrl?.[0] || "");
    }, [medicine]);

    const handleAddtocart = async (item) => {
        try {
            setAddingCart(true);
            await axiosInstance.post(
                `/endUserEndPoint/addToCart?userId=${userId}&batchId=${item?.id}`
            );
            await getAllMedicineCartItems(userId);
            setAddingCart(false);
            toast.success(`${medicine.medicine?.name} Added in cart`);
        } catch (error) {
            console.log("error add to cart", error.response);
            setAddingCart(false);
        }
    };

    return (
        <div className="p-4 md:p-6 container mx-auto min-h-screen">
            <div className="flex flex-col md:flex-row gap-6">
                {/* LEFT SECTION (Images + Details) */}
                <div className="flex flex-col md:flex-row w-full gap-5">
                    {/* Thumbnail Column */}
                    <div className="flex flex-row md:flex-col gap-3 md:w-20 w-full overflow-x-auto md:overflow-x-visible">
                        {/* {medicine.medicine?.imagesUrl?.map((img, i) => (
                            <img
                                key={i}
                                src={img}
                                onClick={() => setActiveImage(img)}
                                className={`w-16 h-16 object-cover rounded-md cursor-pointer shadow-md transition
                                ${activeImage === img ? "ring-2 ring-blue-500" : "hover:scale-105"}`}
                                alt=""
                            />
                        ))} */}
                    </div>

                    {/* Main Image + Details */}
                    <div className="flex flex-col md:flex-row w-full gap-4">
                        {/* Main Image */}
                        {/* <div className="w-full md:w-1/2 flex justify-center items-center p-2 bg-white rounded-lg shadow-sm">
                            <img
                                src={activeImage || "https://thumbs.dreamstime.com/b/herbal-medicine-herbs-21119245.jpg"}
                                alt="medicine"
                                className="w-full h-64 md:h-72 object-contain"
                            />

                        </div> */}
                        <div className="w-full md:w-1/2 flex justify-center items-center p-2 bg-white rounded-lg shadow-sm">
                            <img
                                src={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBeTXqOJnhL2W_vZewM6uL7UcNmfknP9MvEQ&s`}
                                alt="medicine"
                                className="w-full h-64 md:h-72 object-contain"
                            />

                        </div>

                        {/* Product Text */}
                        <div className="flex-1 mt-4 md:mt-0 space-y-3 md:space-y-4">
                            <h1 className="text-lg md:text-xl font-bold text-gray-800">
                                {medicine.medicine?.name}
                            </h1>

                            <div className="flex items-center gap-2">
                                <span className="bg-teal-600 text-white text-xs px-2 py-1 rounded-md font-semibold">
                                    4.3 ★
                                </span>
                                <p className="text-gray-600 text-sm">
                                    296 Ratings & 57 Reviews
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <p className="text-xl font-semibold text-teal-600 flex items-center gap-1">
                                    ₹{medicine.unitPrice
                                    }
                                </p>
                                <p className="line-through text-gray-500 text-sm">₹363</p>
                                <p className="text-teal-600 font-medium text-sm">35% off</p>
                            </div>

                            <p className="flex items-center gap-2 text-gray-700 text-md">
                                {medicine.medicine?.prescribedFor || "NA"}
                            </p>



                            <div className="mt-6">
                                <h2 className="font-semibold text-gray-700">Product highlights symptoms</h2>
                                <ul className="list-disc ml-6">
                                    {displayedSymptoms.map((ele, index) => (
                                        <li key={index} className="mb-1">{ele}</li>
                                    ))}
                                </ul>

                                {symptoms.length > 4 && (
                                    <button
                                        onClick={() => setShowAll(!showAll)}
                                        className="mt-2 text-teal-600 font-medium hover:underline"
                                    >
                                        {showAll ? 'Show Less' : `Show All (${symptoms.length})`}
                                    </button>
                                )}
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

                {/* RIGHT SECTION (Pricing Card) */}
                <div className="w-full md:w-1/4 bg-white p-4 rounded-lg shadow-md flex-shrink-0">
                    <div className="space-y-4">
                        <p className="text-xl font-semibold text-teal-600">
                            ₹{medicine.unitPrice
                            }
                        </p>
                        <div className="flex gap-2">
                            <p className="line-through text-gray-500 text-sm">₹363</p>
                            <p className="text-teal-600 font-medium text-sm">35% off</p>
                        </div>
                        <span className="text-gray-400 text-xs">Inclusive of all taxes</span>
                        <button
                            onClick={() => handleAddtocart(medicine)}
                            className="bg-teal-600 cursor-pointer w-full py-2 text-white rounded-md text-lg font-medium hover:bg-teal-700 transition"
                        >
                            {addingCart ? (
                                <span className="loading loading-spinner loading-sm"></span>
                            ) : (
                                "Add to cart"
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-10">
                <SimilarMedicineProduct
                    name={medicine.medicine?.name ||
                        medicine.medicine?.prescribedFor ||
                        medicine.medicine?.symptoms?.[0]
                    }
                />
            </div>
        </div>
    );
}
