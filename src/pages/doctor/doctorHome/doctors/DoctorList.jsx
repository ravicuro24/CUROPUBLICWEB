// src/pages/doctor/doctorHome/doctors/DoctorList.jsx
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
    FaStar,
    FaSearch,
    FaMapMarkerAlt,
    FaHospital,
    FaBriefcaseMedical,
    FaGraduationCap,
    FaMoneyBillWave,
    FaCalendarAlt
} from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../../../Authorization/axiosInstance";
import nodata from "../../../../assets/doctor/nodata.jpg";
import LoaderSpinner from '../../../../../src/LoaderSpinner'
import {  MdWorkspacePremium } from "react-icons/md";

function DoctorList() {
    const navigate = useNavigate();
    const location = useLocation();
    const { searchTextId, searchTextCatId } = location.state || {};
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchDoctors();
    }, []);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [searchTerm]);

    const fetchDoctors = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.post("/doctor/filter", {
                [searchTextId ? "symptomIds" : "SpecializationId"]: searchTextId ? [searchTextId] : [searchTextCatId]
            });
            console.log("Fetched doctors:", response.data);
            setDoctors(response.data?.data || []);
        } catch (error) {
            console.error("Error fetching doctors:", error);
            setDoctors([]);
        } finally {
            setLoading(false);
        }
    };

    // Function to calculate average rating
    const calculateAverageRating = (ratings) => {
        if (!ratings || ratings.length === 0) return 0;

        const sum = ratings.reduce((total, rating) => {
            return total + parseFloat(rating.rating || 0);
        }, 0);

        return sum / ratings.length;
    };

    // Format rating to one decimal place
    const formatRating = (rating) => {
        return rating.toFixed(1);
    };

    // Render star rating component
    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        return (
            <div className="flex items-center gap-1">
                {[...Array(5)].map((_, index) => {
                    if (index < fullStars) {
                        return <FaStar key={index} className="text-yellow-500" />;
                    } else if (index === fullStars && hasHalfStar) {
                        return <FaStar key={index} className="text-yellow-500" />;
                    } else {
                        return <FaStar key={index} className="text-gray-300" />;
                    }
                })}
                <span className="ml-1 text-sm font-medium">{formatRating(rating)}</span>
            </div>
        );
    };

    const filteredDoctors = useMemo(() => {
        const search = searchTerm.toLowerCase();

        return doctors.filter((d) => {
            return (
                d.firstName?.toLowerCase().includes(search) ||
                d.lastName?.toLowerCase().includes(search) ||
                d.specialization?.toLowerCase().includes(search)
            );
        });
    }, [doctors, searchTerm]);

    const goToDoctorDetails = (doctor) => {
        navigate('/doctor/doctor-details', { state: { doctor } });
    };

    return (
        <div className="min-h-screen bg-white p-6">
            <div className="container mx-auto">
                {/* HEADER */}
                <div className="flex gap-2 mb-6">
                    <h1 className="text-2xl font-bold w-1/3">Find Your Doctor</h1>

                    <div className="relative w-2/3">
                        <FaSearch className="absolute top-3.5 left-3 text-gray-400" />
                        <input
                            type="search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search doctor or specialization..."
                            className="w-full pl-10 pr-4 py-2 border rounded-lg"
                        />
                    </div>
                </div>

                <p className="mb-4 text-gray-600">
                    Showing <b>{filteredDoctors.length}</b> doctors
                </p>

                {/* LOADING */}
                {loading && (
                    <LoaderSpinner />
                )}

                {/* LIST */}
                {!loading && filteredDoctors.length > 0 && (
                    <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredDoctors.map((doctor) => {
                            const averageRating = calculateAverageRating(doctor.ratingsReceived);
                            const reviewCount = doctor.ratingsReceived?.length || 0;

                            return (
                                <motion.div
                                    key={doctor.id}
                                    whileHover={{ y: -4 }}
                                    className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
                                >
                                    <div
                                        onClick={() => goToDoctorDetails(doctor)}
                                        className="flex gap-6 relative cursor-pointer"
                                    >
                                        <div className="relative">
                                            <img
                                                src={doctor.profilePicture || nodata}
                                                className="h-20 w-20 rounded-full object-cover"
                                                alt={`Dr. ${doctor.firstName} ${doctor.lastName}`}
                                            />
                                            {doctor?.isPremium && (
                                                <div className="absolute -top-2 -left-2">
                                                    <MdWorkspacePremium className="text-amber-500 text-3xl" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-grow">
                                            <div className="flex justify-between items-start">
                                                <h3 className="text-lg font-bold">
                                                    Dr. {doctor.firstName} {doctor.lastName}
                                                </h3>
                                                {doctor?.verified && (
                                                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                                        Verified
                                                    </span>
                                                )}
                                            </div>

                                            {/* Rating Display */}
                                            <div className="my-2">
                                                {reviewCount > 0 ? (
                                                    <div className="flex items-center gap-2">
                                                        {renderStars(averageRating)}
                                                        <span className="text-sm text-gray-500">
                                                            ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                                                        <FaStar className="text-gray-300" />
                                                        <span>No reviews yet</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-2 text-gray-600">
                                                <FaBriefcaseMedical />
                                                {doctor.specialization}
                                            </div>

                                            <div className="mt-2 text-sm text-gray-600 space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <FaGraduationCap />
                                                    {doctor.qualification?.[0]?.degreeName || "N/A"}
                                                    {doctor.yearsOfExperience && (
                                                        <span className="ml-2">
                                                            • {doctor.yearsOfExperience} years exp
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <FaHospital />
                                                    {doctor.hospitalAffiliation?.[0]?.hospitalName || "N/A"}
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <FaMapMarkerAlt />
                                                    {doctor.hospitalAffiliation?.[0]?.location ||
                                                        doctor.hospitalAffiliation?.[0]?.hospitalName ||
                                                        "Location not specified"}
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-center mt-4">
                                                <div className="flex items-center gap-2 text-green-600 font-semibold">
                                                    <FaMoneyBillWave />
                                                    ₹{doctor.consultationFee}
                                                </div>

                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        goToDoctorDetails(doctor);
                                                    }}
                                                    className="px-4 py-2 bg-teal-600 text-white rounded-full text-sm hover:bg-teal-700 transition-colors"
                                                >
                                                    <FaCalendarAlt className="inline mr-1" />
                                                    Book Appointment
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                )}

                {/* NO DATA */}
                {!loading && filteredDoctors.length === 0 && (
                    <div className="flex flex-col items-center mt-24">
                        <img src={nodata} className="w-64 mb-6" alt="No data" />
                        <p className="text-gray-600">No doctors found</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default DoctorList;