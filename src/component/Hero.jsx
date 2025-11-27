// src/component/Hero.jsx
import React, { useState } from "react";
import { FiSearch, FiUpload, FiArrowRight, FiPlay, FiShield, FiClock, FiStar } from "react-icons/fi";
import { HiOutlineFolderOpen } from "react-icons/hi";
import { motion } from "framer-motion";
import heroImg from '../assets/doctor/doc.png';
import { TypeAnimation } from "react-type-animation";

const Hero = () => {
    const [searchValue, setSearchValue] = useState("");

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: 0.3,
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    const imageVariants = {
        hidden: { x: 100, opacity: 0 },
        visible: {
            x: 0,
            opacity: 1,
            transition: {
                duration: 0.8,
                ease: "easeOut"
            }
        }
    };

    const floatingAnimation = {
        y: [-10, 10, -10],
        transition: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
        }
    };

    return (
        <section className="w-full relative overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50"></div>

            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    className="absolute top-10 left-10 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"
                    animate={{
                        x: [0, 100, 0],
                        y: [0, -50, 0],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute top-40 right-20 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"
                    animate={{
                        x: [0, -80, 0],
                        y: [0, 60, 0],
                    }}
                    transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute bottom-20 left-1/3 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"
                    animate={{
                        x: [0, 60, 0],
                        y: [0, -80, 0],
                    }}
                    transition={{
                        duration: 14,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </div>

            <div className="relative w-full py-16 md:py-24 container mx-auto px-4 md:px-6">
                <div className="w-full mx-auto flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
                    {/* Left Content */}
                    <motion.div
                        className="flex-1 text-center md:text-left"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div variants={itemVariants}>
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-teal-200 rounded-full px-4 py-2 mb-6 shadow-sm">
                                <FiStar className="text-teal-600 w-4 h-4" />
                                <span className="text-[10px] font-medium text-teal-800">
                                    Trusted by 1M+ Patients Across India
                                </span>
                            </div>
                        </motion.div>

                        <motion.h1
                            variants={itemVariants}
                            className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight"
                        >
                            <span className="bg-gradient-to-r from-teal-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Curo24
                            </span>
                        </motion.h1>

                        <motion.h2
                            variants={itemVariants}
                            className="text-xl md:text-3xl lg:text-4xl font-semibold mt-2 md:mt-4"
                        >
                            <span className="bg-gradient-to-r from-teal-500 to-blue-600 bg-clip-text text-transparent">
                                <TypeAnimation
                                    sequence={[
                                        "Your Complete Digital Healthcare Partner",
                                        2000,
                                        "Trusted Care, Anytime and Anywhere",
                                        2000,
                                        "24/7 Healthcare at Your Fingertips",
                                        2000,
                                    ]}
                                    wrapper="span"
                                    speed={50}
                                    repeat={Infinity}
                                    cursor={true}
                                />
                            </span>
                        </motion.h2>

                        <motion.p
                            variants={itemVariants}
                            className="text-gray-600 mt-4 md:mt-6 text-lg md:text-xl max-w-2xl leading-relaxed"
                        >
                            Order medicines, book doctor appointments, schedule lab tests, and access all your health information in one secure place. Your health journey starts here.
                        </motion.p>

                        {/* Search Bar */}
                        <motion.div
                            variants={itemVariants}
                            className="mt-8 max-w-2xl"
                        >
                            <div className="relative flex items-center bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl px-4 py-4 shadow-lg hover:shadow-xl transition-all duration-300">
                                <FiSearch className="text-gray-400 mr-3 w-5 h-5" />
                                <input
                                    type="text"
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    placeholder="Search medicines, doctors, lab tests, health products..."
                                    className="w-full border-0 outline-none text-base bg-transparent placeholder-gray-400"
                                />
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="ml-2 bg-gradient-to-r from-teal-500 to-blue-600 text-white px-6 py-2 rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg transition-all duration-300"
                                >
                                    Search
                                    <FiArrowRight className="w-4 h-4" />
                                </motion.button>
                            </div>
                        </motion.div>

                        {/* Quick Actions */}


                        {/* Features */}
                        <motion.div
                            variants={itemVariants}
                            className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl"
                        >
                            {[
                                { icon: FiShield, text: "100% Safe & Secure" },
                                { icon: FiClock, text: "24/7 Available" },
                                { icon: FiStar, text: "4.8/5 Rating" }
                            ].map((feature, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ scale: 1.05 }}
                                    className="flex items-center gap-2 text-sm text-gray-600"
                                >
                                    <feature.icon className="w-4 h-4 text-teal-600" />
                                    <span>{feature.text}</span>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Right Image */}
                    <motion.div
                        className="flex-1 flex justify-center"
                        variants={imageVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <div className="relative">
                            {/* Main Image Container */}
                            <motion.div
                                className="relative"
                                animate={floatingAnimation}
                            >
                                <img
                                    src={heroImg}
                                    alt="Doctor illustration"
                                    className="w-80 md:w-96 lg:w-[500px] object-contain drop-shadow-2xl"
                                />

                                {/* Floating Elements */}
                                <motion.div
                                    className="absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-2xl border border-gray-100"
                                    animate={{
                                        y: [-5, 5, -5],
                                        rotate: [0, 5, 0],
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                        <span className="text-xs font-semibold text-gray-700">Quick Response</span>
                                    </div>
                                </motion.div>

                                <motion.div
                                    className="absolute -bottom-4 -left-4 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-2xl p-4 shadow-2xl"
                                    animate={{
                                        y: [5, -5, 5],
                                        scale: [1, 1.05, 1],
                                    }}
                                    transition={{
                                        duration: 4,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                >
                                    <div className="text-center">
                                        <div className="text-sm font-bold">500+</div>
                                        <div className="text-xs">Doctors Online</div>
                                    </div>
                                </motion.div>
                            </motion.div>

                            {/* Background Decoration */}
                            <div className="absolute inset-0 bg-gradient-to-r from-teal-400/20 to-blue-500/20 rounded-full blur-3xl -z-10 scale-150"></div>
                        </div>
                    </motion.div>
                </div>

                {/* Bottom Stats */}
                <motion.div
                    className="mt-16 md:mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                >
                    {[
                        { number: "1M+", label: "Happy Patients" },
                        { number: "500+", label: "Expert Doctors" },
                        { number: "100+", label: "Cities Across India" },
                        { number: "24/7", label: "Support Available" }
                    ].map((stat, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            className="text-center bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/80 shadow-sm hover:shadow-md transition-all duration-300"
                        >
                            <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                                {stat.number}
                            </div>
                            <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;