// src/pages/medicine/SimilarMedicineProduct.jsx
import React, { useEffect, useRef, useState } from "react";
import { LuClock3 } from "react-icons/lu";
import axiosInstance from "../../Authorization/axiosInstance";
import { useNavigate } from "react-router-dom";
import { IoCaretBackSharp, IoCaretForwardSharp } from "react-icons/io5";

export default function SimilarMedicineProduct({ name }) {
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const scrollRef = useRef(null);

    useEffect(() => {
        if (name) getSimilarProducts();
        window.scrollTo(0, 0);
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

    const scrollLeft = () => {
        scrollRef.current?.scrollBy({ left: -200, behavior: "smooth" });
    };

    const scrollRight = () => {
        scrollRef.current?.scrollBy({ left: 200, behavior: "smooth" });
    };

    // AUTO SLIDE EVERY 3 SECONDS
    useEffect(() => {
        if (medicines.length <= 1) return;
        const interval = setInterval(() => {
            scrollRight();
        }, 3000);

        return () => clearInterval(interval);
    }, [medicines]);

    // ⛔ Show message when no similar products found
    if (!loading && medicines.length === 0) {
        return (
            <div className="mt-8 px-2 md:px-0">
                <div className="bg-white p-4 rounded-lg flex flex-col">
                    <h2 className="text-lg font-semibold mb-4">Similar products</h2>
                    <p className="text-gray-500">No similar products found.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="mt-8 px-2 md:px-0">
            <div className="bg-white p-4 rounded-lg flex flex-col">
                <h2 className="text-lg font-semibold mb-4">Similar products</h2>

                {!loading && medicines.length > 0 && (
                    <div className="relative mt-6">

                        {/* LEFT ARROW */}
                        <button
                            onClick={scrollLeft}
                            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 
                                bg-white shadow-md p-2 rounded-full z-10 hover:bg-gray-100"
                        >
                            <IoCaretBackSharp />
                        </button>

                        {/* SCROLL CONTAINER */}
                        <div
                            ref={scrollRef}
                            className="flex gap-3 overflow-x-auto no-scrollbar scroll-smooth"
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
                                        className="min-w-[150px] sm:min-w-[180px] md:min-w-[200px] 
                                            rounded-xl p-3 bg-white shadow-sm 
                                            hover:shadow-md transition-all cursor-pointer"
                                    >
                                        <span className="bg-teal-600 text-white text-xs px-2 py-1 rounded-md font-semibold">
                                            SALE
                                        </span>

                                        <div className="w-full flex justify-center mt-2">
                                            {/* <img
                                                src={m.imagesUrl?.[0] || "/no-image.png"}
                                                alt={m.name}
                                                className="h-24 sm:h-28 md:h-32 object-contain"
                                            /> */}
                                            <img
                                                src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBeTXqOJnhL2W_vZewM6uL7UcNmfknP9MvEQ&s"}
                                                alt={m.name}
                                                className="h-24 sm:h-28 md:h-32 object-contain"
                                            />
                                        </div>

                                        <div className="flex items-center gap-1 text-gray-600 text-xs mt-3">
                                            <LuClock3 className="text-sm" />
                                            <span>ends in 4 days 10 hrs</span>
                                        </div>

                                        <p className="text-gray-800 text-xs sm:text-sm font-medium mt-2 line-clamp-2 min-h-10">
                                            {m.name || "Unknown Product"}
                                        </p>

                                        <p className="text-gray-500 text-[10px] sm:text-xs">
                                            {m.packagingType && m.packagingSize
                                                ? `${m.packagingType} of ${m.packagingSize}`
                                                : "package details not available"}
                                        </p>

                                        <div className="flex items-center gap-2 text-xs mt-1">
                                            <span className="bg-teal-600 text-white text-[10px] px-2 py-1 rounded-md font-semibold">
                                                4.3 ★
                                            </span>
                                            <span className="text-gray-600 text-[10px]">100+ ratings</span>
                                        </div>

                                        <p className="text-gray-700 text-[10px]">
                                            Get by <span className="font-semibold">3pm, Today</span>
                                        </p>

                                        <div className="mt-2">
                                            <p className="text-base font-bold text-gray-800">
                                                ₹{item.unitPrice || 0}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* RIGHT ARROW */}
                        <button
                            onClick={scrollRight}
                            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 
                                bg-white shadow-md p-2 rounded-full z-10 hover:bg-gray-100"
                        >
                            <IoCaretForwardSharp />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
