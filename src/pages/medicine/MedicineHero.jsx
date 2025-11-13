// src/pages/medicine/MedicineHero.jsx
// src/component/Hero.jsx
import React from "react";
import { FiSearch, FiUpload } from "react-icons/fi";
import { HiOutlineFolderOpen } from "react-icons/hi";
import heroImg from '../../assets/hero.png'

const MedicineHero = () => {
    return (

        <section className="w-full bg-white py-10 container mx-auto  mt-2">
            <div className="w-full mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
                {/* Left Content */}
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

                    {/* Search Bar */}
                    <div className="mt-6 flex items-center bg-white border border-gray-300 rounded-lg px-3 py-2 shadow-sm max-w-md mx-auto md:mx-0">
                        <FiSearch className="text-gray-400 mr-2" />
                        <input
                            type="text"
                            placeholder="Search medicines, health products..."
                            className="w-full outline-none text-sm"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="mt-5 flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                        <button className="bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold py-2.5 px-5 rounded-lg flex items-center justify-center gap-2">
                            <FiUpload size={16} />
                            Upload Prescription
                        </button>
                        <button className="border border-gray-300 text-gray-800 hover:bg-gray-100 text-sm font-medium py-2.5 px-5 rounded-lg flex items-center justify-center gap-2">
                            <HiOutlineFolderOpen size={18} />
                            Upload from Saved Medical Records
                        </button>
                    </div>
                </div>

                {/* Right Image */}

                <div className="rounded-2xl      ">
                    <img
                        src={heroImg}
                        alt="Doctor illustration"
                        className="w-120 object-contain"
                    />
                </div>

            </div>
        </section>
    );
};

export default MedicineHero;
