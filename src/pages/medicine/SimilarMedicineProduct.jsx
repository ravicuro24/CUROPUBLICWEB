// src/pages/medicine/SimilarMedicineProduct.jsx
import React, { useEffect, useState } from "react";
import { LuClock3 } from "react-icons/lu";
import axiosInstance from "../../Authorization/axiosInstance";
import { useNavigate } from "react-router-dom";
import { IoCaretBackSharp, IoCaretForwardSharp } from "react-icons/io5";

export default function SimilarMedicineProduct({ name }) {
   
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()

    useEffect(() => {
        if (name) getSimilarProducts();
        window.scrollTo(0, 0)
    }, [name]);

    const getSimilarProducts = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get(
                `/endUserEndPoint/getMedicineByPrescribedFor?prescribedFor=${name}&page=1&size=100`
            );
            setMedicines(res.data?.dtoList?.content || []);
        } catch (err) {
            console.error("Error fetching medicines:", err);
        } finally {
            setLoading(false);
        }
    };

    const isScrollable = medicines.length > 5;

    return (
        <div className="mt-8 px-2 md:px-0">
            <div className="bg-white p-4 rounded-lg flex flex-col">
                <h2 className="text-lg font-semibold mb-4">Similar products</h2>

                {/* Container - Condition based layout */}
                {/* SHOW PRODUCTS ONLY IF WE HAVE DATA */}
                {!loading && medicines.length > 0 && (
                    <div className="relative mt-6">

                        {/* LEFT BUTTON */}
                        {isScrollable && (
                            <button
                                onClick={() => {
                                    const container = document.getElementById("similarScroll");
                                    container.scrollBy({ left: -300, behavior: "smooth" });
                                }}
                                className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 
                bg-white shadow-md p-2 rounded-full z-10 hover:bg-gray-100"
                            >
                                <IoCaretBackSharp />
                            </button>
                        )}

                        {/* SCROLLABLE WRAPPER */}
                        <div
                            id="similarScroll"
                            className={`grid gap-2 no-scrollbar  ${isScrollable
                                ? "grid-flow-col  auto-cols-max overflow-x-auto  "
                                : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
                                } scroll-smooth`}
                        >
                            {medicines.map((item) => {
                                const m = item.medicine || {};

                                return (
                                    <div
                                        onClick={() =>
                                            navigate('/medicine/shopbyhealthconcern/medicine_details', {
                                                state: { medicine: item }
                                            })
                                        }
                                        key={item.id}
                                        className={`min-w-[150px] sm:min-w-[180px] md:min-w-[200px] ${isScrollable ? "flex-shrink-0" : ""
                                            } rounded-xl p-3 bg-white shadow-sm hover:shadow-md transition-all cursor-pointer`}
                                    >
                                        {/* SALE Badge */}
                                        <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-md font-semibold">
                                            SALE
                                        </span>

                                        {/* Image */}
                                        <div className="w-full flex justify-center mt-2">
                                            <img
                                                src={m.imagesUrl?.[0] || "/no-image.png"}
                                                alt={m.name}
                                                className="h-24 sm:h-28 md:h-32 object-contain"
                                            />
                                        </div>

                                        {/* Timer */}
                                        <div className="flex items-center gap-1 text-gray-600 text-xs mt-3">
                                            <LuClock3 className="text-sm" />
                                            <span>ends in 4 days 10 hrs</span>
                                        </div>

                                        {/* Title */}
                                        <p className="text-gray-800 text-xs sm:text-sm font-medium mt-2 line-clamp-2 min-h-10">
                                            {m.name || "Unknown Product"}
                                        </p>

                                        {/* Packaging */}
                                        <p className="text-gray-500 text-[10px] sm:text-xs">
                                            {m.packagingType && m.packagingSize
                                                ? `${m.packagingType} of ${m.packagingSize}`
                                                : "package details not available"}
                                        </p>

                                        {/* Rating */}
                                        <div className="flex items-center gap-2 text-xs mt-1">
                                            <span className="bg-green-600 text-white text-[10px] px-2 py-1 rounded-md font-semibold">
                                                4.3 ★
                                            </span>
                                            <span className="text-gray-600 text-[10px]">100+ ratings</span>
                                        </div>

                                        {/* Delivery */}
                                        <p className="text-gray-700 text-[10px]">
                                            Get by <span className="font-semibold">3pm, Today</span>
                                        </p>

                                        {/* Price */}
                                        <div className="mt-2">
                                            <p className="text-gray-500 text-[10px]">
                                                MRP{" "}
                                                <span className="line-through">
                                                    ₹{item.unitPrice || m.mrp || (item.effectiveCostPrice + 20)}
                                                </span>{" "}
                                                <span className="text-green-600 font-semibold">5% off</span>
                                            </p>

                                            <p className="text-base font-bold text-gray-800">
                                                ₹{item.effectiveCostPrice || 0}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* RIGHT BUTTON */}
                        {isScrollable && (
                            <button
                                onClick={() => {
                                    const container = document.getElementById("similarScroll");
                                    container.scrollBy({ left: 300, behavior: "smooth" });
                                }}
                                className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 
                                bg-white shadow-md p-2 rounded-full z-10 hover:bg-gray-100"
                            >
                                <IoCaretForwardSharp />
                            </button>
                        )}
                    </div>
                )}


            </div>
        </div>
    );
}
