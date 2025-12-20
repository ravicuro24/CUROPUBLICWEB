// src/pages/doctor/doctorHome/DoctorCategory.jsx
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    FaUserMd,
    FaHeartbeat,
    FaBaby,
    FaBone,
    FaBrain,
    FaHeart,
    FaFlask,
    FaHeadSideVirus,
    FaChild,
    FaLungs,
    FaSyringe,
    FaBrain as FaNeuro,
    FaJoint,
    FaEye,
    FaViruses,
    FaCut,
    FaUserInjured,
    FaPills,
    FaTooth,
    FaArrowRight,
    FaStar
} from 'react-icons/fa';
import { FaEarDeaf } from "react-icons/fa6";
import { GiKidneys } from "react-icons/gi";
import { GiStomach } from "react-icons/gi";
import { Link } from 'react-router-dom';



function DoctorCategory() {
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }, [])
    const specialties = [
        { id: 1, name: 'General Physician', icon: <FaUserMd />, color: 'from-blue-500 to-cyan-500', description: 'Primary care for all health concerns' },
        { id: 2, name: 'Dermatology', icon: <FaFlask />, color: 'from-purple-500 to-pink-500', description: 'Skin, hair, and nail care' },
        { id: 3, name: 'Obstetrics & Gynecology', icon: <FaBaby />, color: 'from-pink-500 to-rose-500', description: "Women's health and pregnancy care" },
        { id: 4, name: 'Orthopaedics', icon: <FaBone />, color: 'from-gray-700 to-gray-900', description: 'Bones, joints, and muscles' },
        { id: 5, name: 'ENT', icon: <FaEarDeaf />, color: 'from-teal-500 to-emerald-500', description: 'Ear, Nose, and Throat care' },
        { id: 6, name: 'Neurology', icon: <FaBrain />, color: 'from-indigo-500 to-purple-500', description: 'Brain and nervous system disorders' },
        { id: 7, name: 'Cardiology', icon: <FaHeart />, color: 'from-red-500 to-pink-600', description: 'Heart and cardiovascular health' },
        { id: 8, name: 'Urology', icon: <GiKidneys />, color: 'from-blue-600 to-indigo-600', description: 'Urinary and male reproductive system' },
        { id: 9, name: 'Gastroenterology', icon: <GiStomach />, color: 'from-green-500 to-teal-500', description: 'Digestive system disorders' },
        { id: 10, name: 'Psychiatry', icon: <FaHeadSideVirus />, color: 'from-violet-500 to-purple-600', description: 'Mental health and behavioral disorders' },
        { id: 11, name: 'Paediatrics', icon: <FaChild />, color: 'from-yellow-400 to-orange-400', description: "Children's healthcare (0-18 years)" },
        { id: 12, name: 'Pulmonology', icon: <FaLungs />, color: 'from-cyan-500 to-blue-500', description: 'Lungs and respiratory system' },
        { id: 13, name: 'Endocrinology', icon: <FaSyringe />, color: 'from-purple-400 to-pink-400', description: 'Hormones and metabolic disorders' },
        { id: 14, name: 'Nephrology', icon: <GiKidneys />, color: 'from-blue-400 to-cyan-400', description: 'Kidney diseases and dialysis' },
        { id: 15, name: 'Neurosurgery', icon: <FaNeuro />, color: 'from-gray-800 to-black', description: 'Surgical treatment of nervous system' },
        { id: 16, name: 'Rheumatology', icon: <FaJoint />, color: 'from-orange-500 to-red-500', description: 'Joint and autoimmune diseases' },
        { id: 17, name: 'Ophthalmology', icon: <FaEye />, color: 'from-sky-500 to-blue-500', description: 'Eye care and vision correction' },
        { id: 18, name: 'Surgical Gastroenterology', icon: <FaCut />, color: 'from-green-600 to-emerald-600', description: 'Surgical GI procedures' },
        { id: 19, name: 'Infectious Disease', icon: <FaViruses />, color: 'from-red-600 to-orange-600', description: 'Infectious diseases treatment' },
        { id: 20, name: 'General & Laparoscopic Surgery', icon: <FaCut />, color: 'from-gray-600 to-gray-800', description: 'Minimally invasive surgeries' },
        { id: 21, name: 'Psychology', icon: <FaUserInjured />, color: 'from-purple-500 to-indigo-500', description: 'Therapy and counseling' },
        { id: 22, name: 'Medical Oncology', icon: <FaPills />, color: 'from-red-400 to-pink-400', description: 'Cancer treatment and chemotherapy' },
        { id: 23, name: 'Diabetology', icon: <FaSyringe />, color: 'from-blue-300 to-cyan-300', description: 'Diabetes management and care' },
        { id: 24, name: 'Dentist', icon: <FaTooth />, color: 'from-white to-gray-100', description: 'Oral and dental healthcare' },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.4
            }
        }
    };


    return (
        <div className="py-16 px-4 md:px-8 lg:px-16 bg-gradient-to-b from-white to-blue-50">
            <div className="container mx-auto">

                {/* Search Bar */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="max-w-2xl mx-auto mb-12"
                >
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search for a specialty..."
                            className="w-full px-6 py-4 pl-14 rounded-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none shadow-lg"
                        />
                        <div className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <FaUserMd className="w-5 h-5" />
                        </div>
                        <button className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-teal-700 hover:bg-teal-800 cursor-pointer text-white px-6 py-2 rounded-full hover:shadow-lg transition-shadow">
                            Search
                        </button>
                    </div>
                </motion.div>

                {/* Specialties Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6"
                >
                    {specialties.map((specialty) => (
                        <motion.div
                            key={specialty.id}
                            variants={itemVariants}
                            whileHover={{
                                y: -5,
                                scale: 1.02,
                                transition: { duration: 0.2 }
                            }}
                            className="group"
                        >
                            <div className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-2xl transition-all duration-300 h-full border border-gray-100 hover:border-blue-200">
                                {/* Icon Container */}
                                <div className={`mb-4 w-16 h-16 rounded-xl bg-gradient-to-br ${specialty.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                    <div className="text-white text-2xl">
                                        {specialty.icon}
                                    </div>
                                </div>

                                {/* Content */}
                                <h3 className="font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                                    {specialty.name}
                                </h3>
                                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                    {specialty.description}
                                </p>

                                {/* Doctor Count & Rating */}
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center space-x-1">
                                        <FaStar className="w-4 h-4 text-yellow-400" />
                                        <span className="text-sm font-semibold">4.8</span>
                                    </div>
                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                        {Math.floor(Math.random() * 50) + 20} doctors
                                    </span>
                                </div>

                                {/* View Button */}
                                <Link to='/doctor/allDoctor' className="w-full cursor-pointer flex items-center justify-center gap-2 py-2 text-sm font-semibold text-blue-600 hover:text-blue-700 group-hover:bg-blue-50 rounded-lg transition-colors">
                                    View Doctors
                                    <FaArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* View All Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="text-center mt-12"
                >
                    <button className="px-8 py-3 bg-teal-700 text-white cursor-pointer hover:bg-teal-800 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group flex items-center gap-2 mx-auto">
                        View All Specialties
                        <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </motion.div>

                {/* Additional Info */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 1 }}
                    className="mt-16 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-3xl p-8 md:p-12"
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaUserMd className="w-6 h-6 text-white" />
                            </div>
                            <h4 className="font-bold text-gray-800 mb-2">Certified Specialists</h4>
                            <p className="text-gray-600">All doctors are board-certified with extensive experience</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaHeartbeat className="w-6 h-6 text-white" />
                            </div>
                            <h4 className="font-bold text-gray-800 mb-2">Instant Appointments</h4>
                            <p className="text-gray-600">Book same-day appointments with specialists</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaStar className="w-6 h-6 text-white" />
                            </div>
                            <h4 className="font-bold text-gray-800 mb-2">Patient Reviews</h4>
                            <p className="text-gray-600">Read genuine feedback from thousands of patients</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default DoctorCategory;