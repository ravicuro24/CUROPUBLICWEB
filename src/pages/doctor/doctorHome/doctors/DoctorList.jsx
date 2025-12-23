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
import { BreadCrumb } from 'primereact/breadcrumb';

function DoctorList() {
    const navigate = useNavigate();
    const location = useLocation();
    const { searchTextId, searchTextCatId } = location.state || {};
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const items = [{ label: 'Electronics' }, { label: 'Computer' }, { label: 'Accessories' }, { label: 'Keyboard' }, { label: 'Wireless' }];
    const home = { icon: 'pi pi-home', url: 'https://primereact.org' }
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
                [searchTextId ? "symptomIds" : "specializationId"]: searchTextId ? [searchTextId] : [searchTextCatId]
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
                    <p className="text-center text-gray-500 mt-20">
                        Loading doctors...
                    </p>
                )}

                {/* LIST */}
                {!loading && filteredDoctors.length > 0 && (
                    <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredDoctors.map((doctor) => (
                            <motion.div
                                key={doctor.id}
                                whileHover={{ y: -4 }}
                                className="bg-white rounded-2xl shadow-lg border p-6"
                            >
                                <div className="flex gap-6">
                                    <img
                                        src={doctor.profilePicture || nodata}
                                        className="h-20 w-20 rounded-full object-cover"
                                        alt=""
                                    />

                                    <div className="flex-grow">
                                        <h3 className="text-lg font-bold">
                                            Dr. {doctor.firstName} {doctor.lastName}
                                        </h3>

                                        <div className="flex items-center gap-2 text-gray-600">
                                            <FaBriefcaseMedical />
                                            {doctor.specialization}
                                        </div>

                                        <div className="mt-2 text-sm text-gray-600 space-y-1">
                                            <div className="flex items-center gap-2">
                                                <FaGraduationCap />
                                                {doctor.qualification?.[0]?.degreeName || "N/A"}
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <FaHospital />
                                                {doctor.hospitalAffiliation?.[0]?.hospitalName || "N/A"}
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <FaMapMarkerAlt />
                                                {doctor.hospitalAffiliation?.[0]?.hospitalName}
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center mt-4">
                                            <div className="flex items-center gap-2">
                                                <FaMoneyBillWave className="text-green-500" />
                                                ₹{doctor.consultationFee}
                                            </div>

                                            <button
                                                onClick={() => goToDoctorDetails(doctor)}
                                                className="px-4 py-2 bg-teal-600 text-white rounded-full text-sm"
                                            >
                                                <FaCalendarAlt className="inline mr-1" />
                                                Book
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
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
