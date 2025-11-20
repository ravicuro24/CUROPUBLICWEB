// src/pages/medicine/MedicineHero.jsx

import React, { useState, useEffect } from "react";
import { FiSearch, FiUpload } from "react-icons/fi";
import { HiOutlineFolderOpen } from "react-icons/hi";
import heroImg from "../../assets/h1.png";
import sl1 from '../../assets/h2.png'
import sl2 from '../../assets/h3.png'
import MedicinePopularCategories from "../medicine/MedicinePopularCategories";
import ShopByHealthConcern from "./ShopByHealthConcern";
import MedicineUploadPrescription from "./MedicineUploadPrescription";
import { useNavigate } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";

const MedicineHero = () => {
    const navigate = useNavigate();
    const sliderImages = [heroImg, sl1, sl2];
    const [uploadPrescriptionModal, setUploadPrescriptionModal] = useState(false);
    const [uploadMode, setUploadMode] = useState("normal");

    const [searchText, setSearchText] = useState("");
    const [searchHistory, setSearchHistory] = useState([]);
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            handleNextSlide();
        }, 3000); // 3 seconds
        return () => clearInterval(interval);
    }, [currentIndex]);

    // Smooth slide transition
    const handleNextSlide = () => {
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentIndex((prev) =>
                prev === sliderImages.length - 1 ? 0 : prev + 1
            );
            setIsTransitioning(false);
        }, 500); // Match this with CSS transition duration
    };

    const goToSlide = (index) => {
        if (index === currentIndex) return;
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentIndex(index);
            setIsTransitioning(false);
        }, 500);
    };

    // -------------------------------
    // LOAD SAVED SEARCH HISTORY
    // -------------------------------
    useEffect(() => {
        const stored = localStorage.getItem("medicineSearchHistory");
        if (stored) {
            setSearchHistory(JSON.parse(stored));
        }
    }, []);

    // -------------------------------
    // LIVE AUTO-SUGGEST FILTERING
    // -------------------------------
    useEffect(() => {
        if (searchText.trim() === "") {
            setFilteredSuggestions([]);
            return;
        }

        const results = searchHistory.filter(item =>
            item.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredSuggestions(results);
    }, [searchText, searchHistory]);

    // -------------------------------
    // SAVE SEARCH TERM TO HISTORY
    // -------------------------------
    const saveSearchHistory = (text) => {
        if (!text.trim()) return;

        let updated = [...searchHistory];

        // Avoid duplicates
        if (!updated.includes(text)) {
            updated.unshift(text);
        }

        updated = updated.slice(0, 10); // Limit history

        setSearchHistory(updated);
        localStorage.setItem("medicineSearchHistory", JSON.stringify(updated));
    };

    // -------------------------------
    // SEARCH ACTION
    // -------------------------------
    const handleSearch = (text) => {
        if (!text.trim()) return;

        saveSearchHistory(text);

        navigate(`/medicine/shopbyhealthconcern/medicine/${text}`);
    };

    return (
        <section className="w-full  container mx-auto">
            <div className="w-full mx-auto flex flex-col md:flex-row items-start mt-20 justify-between ">
                {/* LEFT AREA - equal width */}
                <div className="w-1/2 text-center md:text-left  p-2 hidden md:block">

                    <h1 className="text-2xl md:text-4xl font-bold leading-tight">
                        <span className="bg-gradient-to-r from-teal-800 to-teal-300 text-transparent bg-clip-text">
                            <TypeAnimation
                                sequence={[
                                    "Your Health, Our Priority",
                                    1500,
                                    "Quality Care, Delivered Fast",
                                    1500,
                                    "Your Wellness Matters",
                                    1500,
                                ]}
                                wrapper="span"
                                speed={50}
                                repeat={Infinity}
                            />
                        </span>
                    </h1>

                    <h2 className="text-xl md:text-3xl font-semibold text-gray-800 mt-1">
                        Fast & Reliable Pharmacy Services
                    </h2>

                    <p className="text-gray-600 mt-3 max-w-md">
                        Order medicines, health products, and consultation from trusted pharmacies.
                    </p>

                    {/* SEARCH BAR */}
                    <div className="relative mt-6 max-w-md mx-auto md:mx-0">
                        <div className="relative flex items-center bg-white border border-gray-300 rounded-lg px-3 py-2 shadow-sm">
                            <FiSearch
                                className="text-gray-400 mr-2 cursor-pointer"
                                onClick={() => handleSearch(searchText)}
                            />

                            <input
                                type="text"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                placeholder="Search medicines, health products..."
                                className="w-full outline-none text-sm border-0 pr-8"
                            />

                            {searchText.length > 0 && (
                                <span
                                    onClick={() => handleSearch(searchText)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer 
                                    text-gray-700 hover:text-teal-700 text-lg font-bold"
                                >
                                    ➤
                                </span>
                            )}
                        </div>

                        {filteredSuggestions.length > 0 && (
                            <div className="absolute w-full bg-white shadow-lg border rounded-lg mt-1 z-20">
                                {filteredSuggestions.map((item, index) => (
                                    <div
                                        key={index}
                                        onClick={() => {
                                            setSearchText(item);
                                            handleSearch(item);
                                        }}
                                        className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
                                    >
                                        {item}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* BUTTONS */}
                    <div className="mt-5 flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                        <button
                            onClick={() => {
                                setUploadMode("normal");
                                setUploadPrescriptionModal(true);
                            }}
                            className="bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold py-2.5 px-5 rounded-lg flex items-center justify-center gap-2"
                        >
                            <FiUpload size={16} />
                            Upload Prescription
                        </button>

                        <button
                            onClick={() => {
                                setUploadMode("saved");
                                setUploadPrescriptionModal(true);
                            }}
                            className="border border-gray-300 text-gray-800 hover:bg-gray-100 text-sm font-medium py-2.5 px-5 rounded-lg flex items-center justify-center gap-2"
                        >
                            <HiOutlineFolderOpen size={18} />
                            Upload from Saved Medical Records
                        </button>
                    </div>
                </div>

                {/* RIGHT SLIDER - equal width */}
                <div className="w-1/2  relative rounded-2xl overflow-hidden  h-[350px] md:h-[420px] mx-auto ">

                    <div className="relative w-full h-full overflow-hidden">
                        {sliderImages.map((image, index) => (
                            <div
                                key={index}
                                className={`absolute inset-0 w-full h-full transition-all duration-700 ease-in-out ${index === currentIndex
                                        ? "opacity-100 scale-100"
                                        : "opacity-0 scale-105"
                                    }`}
                            >
                                <img
                                    src={image}
                                    alt={`Slide ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ))}
                    </div>

                    {/* DOTS */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {sliderImages.map((_, index) => (
                            <div
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-3 h-3 rounded-full cursor-pointer transition-all ${index === currentIndex
                                        ? "bg-white scale-125"
                                        : "bg-white/50"
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <MedicinePopularCategories />
            <ShopByHealthConcern />

            {/* UPLOAD PRESCRIPTION MODAL */}
            {uploadPrescriptionModal && (
                <div className="fixed inset-0 backdrop-brightness-50 flex items-center justify-center z-50">
                    <div className="relative bg-white max-w-7xl w-full rounded-lg shadow-lg overflow-auto">

                        {/* CLOSE BUTTON */}
                        <button
                            onClick={() => setUploadPrescriptionModal(false)}
                            className="absolute top-3 right-3 z-50 cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-700 
                            rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold"
                        >
                            ×
                        </button>

                        {/* MODAL CONTENT */}
                        <MedicineUploadPrescription
                            mode={uploadMode}
                            onClose={() => setUploadPrescriptionModal(false)}
                        />
                    </div>
                </div>
            )}

        </section>
    );
};

export default MedicineHero;