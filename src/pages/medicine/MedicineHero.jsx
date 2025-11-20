// src/pages/medicine/MedicineHero.jsx

import React, { useState, useEffect } from "react";
import { FiSearch, FiUpload } from "react-icons/fi";
import { HiOutlineFolderOpen } from "react-icons/hi";
import heroImg from "../../assets/hero.png";
import MedicinePopularCategories from "../medicine/MedicinePopularCategories";
import ShopByHealthConcern from "./ShopByHealthConcern";
import MedicineUploadPrescription from "./MedicineUploadPrescription";
import { useNavigate } from "react-router-dom";

const MedicineHero = () => {
    const navigate = useNavigate();

    const [uploadPrescriptionModal, setUploadPrescriptionModal] = useState(false);
    const [uploadMode, setUploadMode] = useState("normal");

    const [searchText, setSearchText] = useState("");
    const [searchHistory, setSearchHistory] = useState([]);
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);

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
        <section className="w-full min-h-screen py-10 container mx-auto mt-2 space-y-2">

            <div className="w-full mx-auto flex flex-col md:flex-row items-center justify-between gap-10">

                {/* LEFT CONTENT */}
                <div className="flex-1 text-center md:text-left">
                    <h1 className="text-2xl md:text-4xl font-bold text-gray-900 leading-tight">
                        Your Health, Our Priority:
                    </h1>

                    <h2 className="text-xl md:text-3xl font-semibold text-gray-800 mt-1">
                        Fast & Reliable Pharmacy Services
                    </h2>

                    <p className="text-gray-600 mt-3 max-w-md">
                        Order medicines, health products, and consultation from trusted pharmacies.
                    </p>

                    {/* SEARCH BOX */}
                    <div className="relative mt-6 max-w-md mx-auto md:mx-0">

                        <div className="relative flex items-center bg-white border border-gray-300 rounded-lg px-3 py-2 shadow-sm">

                            {/* LEFT SEARCH ICON */}
                            <FiSearch
                                className="text-gray-400 mr-2 cursor-pointer"
                                onClick={() => handleSearch(searchText)}
                            />

                            {/* INPUT */}
                            <input
                                type="text"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                placeholder="Search medicines, health products..."
                                className="w-full outline-none text-sm border-0 pr-8"
                            />

                            {/* RIGHT ARROW (ONLY WHEN TYPING) */}
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

                        {/* AUTO SUGGEST BOX */}
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

                        {/* Upload Prescription */}
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

                        {/* Upload From Saved Records */}
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

                {/* RIGHT IMAGE */}
                <div className="rounded-2xl">
                    <img
                        src={heroImg}
                        alt="Doctor illustration"
                        className="w-120 object-contain"
                    />
                </div>
            </div>

            <MedicinePopularCategories />
            <ShopByHealthConcern />

            {/* UPLOAD PRESCRIPTION MODAL */}
            {uploadPrescriptionModal && (
                <div className="fixed inset-0 backdrop-brightness-50 flex items-center justify-center z-50">
                    <div className="relative bg-white max-w-7xl w-full min-h-[80vh] rounded-lg shadow-lg overflow-auto">

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
