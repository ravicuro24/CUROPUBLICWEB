// src/pages/lab/labhome/LabHero.jsx
import React, { useState, useEffect, use } from "react";
import { FiSearch, FiUpload } from "react-icons/fi";
import { HiOutlineFolderOpen } from "react-icons/hi";
import heroImg from "../../../assets/lab/lab1.png";
import sl1 from '../../../assets/lab/lab2.png';
import sl2 from '../../../assets/lab/lab3.png';
import { useNavigate } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
import MedicineUploadPrescription from "../../medicine/MedicineUploadPrescription";
import LabUploadPrescription from "./LabUploadPrescription";
import { useLabAuth } from "../../../Authorization/LabAuthContext";

const LabHero = () => {
    const navigate = useNavigate();
    const sliderImages = [
        'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg',
        `https://images.pexels.com/photos/3938022/pexels-photo-3938022.jpeg`,
        `https://images.pexels.com/photos/6629366/pexels-photo-6629366.jpeg`,
        `https://images.pexels.com/photos/12193090/pexels-photo-12193090.jpeg`,
        `https://images.pexels.com/photos/9574415/pexels-photo-9574415.jpeg`
    ];
    const [uploadPrescriptionModal, setUploadPrescriptionModal] = useState(false);
    const [uploadMode, setUploadMode] = useState("normal");
    const [searchText, setSearchText] = useState("");
    const [searchHistory, setSearchHistory] = useState([]);
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const { screen, setScreen } = useLabAuth()

    // Auto Slider
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) =>
                prev === sliderImages.length - 1 ? 0 : prev + 1
            );
        }, 3000);

        return () => clearInterval(interval);
    }, []);
    useEffect(() => {
        setScreen('Lab')
    }, [screen])
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, []);


    // Load search history
    useEffect(() => {
        const stored = localStorage.getItem("medicineSearchHistory");
        if (stored) setSearchHistory(JSON.parse(stored));
    }, []);

    // Filter suggestions
    useEffect(() => {
        if (!searchText.trim()) return setFilteredSuggestions([]);

        setFilteredSuggestions(
            searchHistory.filter((item) =>
                item.toLowerCase().includes(searchText.toLowerCase())
            )
        );
    }, [searchText, searchHistory]);

    const saveSearchHistory = (text) => {
        if (!text.trim()) return;

        let updated = [...searchHistory];
        if (!updated.includes(text)) updated.unshift(text);
        updated = updated.slice(0, 10);

        setSearchHistory(updated);
        localStorage.setItem("medicineSearchHistory", JSON.stringify(updated));
    };

    const handleSearch = (text) => {
        if (!text.trim()) return;
        saveSearchHistory(text);
        navigate('/lab/vital/organlist', { state: { organName: text } });
    };



    return (
        <section className="w-full container mx-auto px-4">
            <div className="w-full mx-auto flex flex-col-reverse md:flex-row items-center md:items-start mt-10 md:mt-20 justify-between gap-10">

                {/* LEFT AREA (FULL WIDTH Mobile, 50% Desktop) */}
                <div className="w-full md:w-1/2 text-center md:text-left">

                    {/* MAIN HEADING */}
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
                                    "Accurate Lab Tests, Trusted Results", // lab-related
                                    1500,
                                    "Fast & Reliable Diagnostics",         // lab-related
                                    1500,
                                    "Your Lab Reports, Anytime, Anywhere", // lab-related
                                    1500,
                                ]}
                                wrapper="span"
                                speed={50}
                                repeat={Infinity}
                            />
                        </span>
                    </h1>


                    <h2 className="text-lg md:text-2xl font-semibold text-gray-800 mt-1">
                        Fast & Reliable Lab Services
                    </h2>

                    <p className="text-gray-600 mt-3 max-w-md mx-auto md:mx-0 text-sm md:text-base">
                        Order medicines, lab tests, and health products delivered to your doorstep.
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
                                placeholder="Search medicines, lab tests..."
                                className="w-full outline-none text-sm border-0 pr-8"
                            />

                            {searchText.length > 0 && (
                                <span
                                    onClick={() => handleSearch(searchText)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-700 hover:text-teal-700 text-lg font-bold"
                                >
                                    ➤
                                </span>
                            )}
                        </div>

                        {/* SEARCH SUGGESTIONS */}
                        {filteredSuggestions.length > 0 && (
                            <div className="absolute w-full bg-white shadow-lg border rounded-lg mt-1 z-20 max-h-40 overflow-y-auto">
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
                    <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
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
                            Upload from Records
                        </button>
                    </div>
                </div>

                {/* RIGHT SLIDER (FULL WIDTH Mobile, 50% Desktop) */}
                <div className="w-full md:w-1/2 relative rounded-2xl overflow-hidden h-[220px] sm:h-[280px] md:h-[380px] lg:h-[420px]">
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
                    <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
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

            {/* MODAL */}
            {uploadPrescriptionModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="relative bg-white w-full max-w-3xl rounded-lg shadow-lg max-h-[90vh] overflow-auto">

                        <button
                            onClick={() => setUploadPrescriptionModal(false)}
                            className="absolute top-3 right-3 z-50 cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold"
                        >
                            ×
                        </button>

                        <LabUploadPrescription
                            mode={uploadMode}
                            onClose={() => setUploadPrescriptionModal(false)}
                        />
                    </div>
                </div>
            )}
        </section>
    );
};

export default LabHero;
