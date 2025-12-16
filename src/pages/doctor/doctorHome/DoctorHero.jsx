// src/pages/doctor/doctorHome/DoctorHero.jsx
import React, { useEffect, useState } from 'react';
import { TypeAnimation } from 'react-type-animation';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import DoctorPopular from './DoctorPopular';
import { useLabAuth } from '../../../Authorization/LabAuthContext';

// Doctor-related images
const doctorImages = [
    'https://media.istockphoto.com/id/1302688389/photo/female-doctor-writting-prescription-about-medicine-stock-photo.jpg?s=612x612&w=0&k=20&c=_T9TOGhqftWPZpcaBB-BWjS03TDMW9yrZ7ISTJVqS1I=',
    'https://images.pexels.com/photos/3902881/pexels-photo-3902881.jpeg',
    'https://images.pexels.com/photos/5738735/pexels-photo-5738735.jpeg',
    'https://media.istockphoto.com/id/1301605007/photo/female-doctor-stock-photo.jpg?s=612x612&w=0&k=20&c=ubxYKnw24gIYuQFaCTn5ydknhYUIMIs3Zm2l6-nbGv4=',
    'https://media.istockphoto.com/id/1359760270/photo/portrait-of-a-nurse.jpg?s=612x612&w=0&k=20&c=qf4C6ZvDYN5whLSBrTZly4O85nMp7lIM1yboT68gVpk=',
];

function DoctorHero() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const { setScreen } = useLabAuth()
    const navigate = useNavigate()

    // Check for mobile device
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        setScreen('Doctor')
    }, [])

    // Animation for image rotation
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) =>
                prevIndex === doctorImages.length - 1 ? 0 : prevIndex + 1
            );
        }, 3000);

        return () => clearInterval(interval);
    }, [doctorImages.length]);

    return (
        <div className='bg-gradient-to-br from-blue-50 to-cyan-50'>
            {/* Mobile-only floating action button */}
            {isMobile && (
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="fixed bottom-6 right-4 z-40 md:hidden"
                >
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/doctor-category')}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-full font-semibold shadow-lg flex items-center gap-2"
                    >
                        <span className="text-sm">Book Now</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </motion.button>
                </motion.div>
            )}

            <div className="min-h-screen flex items-center justify-center px-4 md:px-8 lg:px-16 pt-20 md:pt-0">
                <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start lg:items-center">
                    
                    {/* Left Side: Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: isMobile ? 0 : -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="space-y-4 md:space-y-6 order-2 lg:order-1"
                    >
                        <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                            <span className="bg-gradient-to-r from-blue-600 via-teal-500 to-cyan-600 bg-clip-text text-transparent">
                                Expert Medical Care
                            </span>
                            <br />
                            <span className="text-gray-800 text-2xl md:text-4xl lg:text-5xl">
                                When You Need It Most
                            </span>
                        </h1>

                        {/* Type Animation - Responsive sizing */}
                        <div className="h-12 md:h-16">
                            <TypeAnimation
                                sequence={[
                                    '24/7 Doctor Consultations',
                                    2000,
                                    'Specialized Medical Advice',
                                    2000,
                                    'Emergency Care Support',
                                    2000,
                                    'Personalized Treatment Plans',
                                    2000,
                                ]}
                                wrapper="span"
                                speed={50}
                                style={{
                                    display: 'inline-block',
                                    fontSize: isMobile ? '1.25rem' : '1.875rem',
                                    background: 'linear-gradient(90deg, #3b82f6, #06b6d4)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    fontWeight: 'bold'
                                }}
                                repeat={Infinity}
                            />
                        </div>

                        <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                            Access top medical professionals anytime, anywhere. Our platform connects you
                            with certified doctors for instant consultations, second opinions, and
                            continuous healthcare support.
                        </p>

                        {/* CTA Buttons - Stack on mobile, row on desktop */}
                        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-2 md:pt-4">
                            <motion.button
                                whileHover={{ scale: isMobile ? 1 : 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-6 md:px-8 py-3 bg-gradient-to-r cursor-pointer from-blue-600 to-cyan-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-shadow duration-300 text-sm md:text-base"
                            >
                                <Link to='/doctor-category' className="flex items-center justify-center gap-2">
                                    <span>Book Appointment</span>
                                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            </motion.button>
                            
                            <motion.button
                                onClick={() => navigate('/doctor/quick-consult')}
                                whileHover={{ scale: isMobile ? 1 : 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-6 md:px-8 py-3 border-2 cursor-pointer border-blue-500 text-blue-600 rounded-full font-semibold hover:bg-blue-50 transition-colors duration-300 text-sm md:text-base"
                            >
                                <span className="flex items-center justify-center gap-2">
                                    Quick Consultation
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </span>
                            </motion.button>
                        </div>

                        {/* Promotional Text - Mobile optimized */}
                        <div className="pt-4 md:pt-6">
                            <div className="h-10 md:h-16">
                                <TypeAnimation
                                    sequence={[
                                        "Book online doctor consultation with top specialists",
                                        2000,
                                        "Instant medical advice from certified doctors",
                                        2000,
                                        "Skip the clinic — consult your doctor from home",
                                        2000,
                                        "Online doctor consultation starting at just ₹199",
                                        2000,
                                    ]}
                                    wrapper="span"
                                    speed={50}
                                    style={{
                                        display: 'inline-block',
                                        fontSize: isMobile ? '0.875rem' : '1.25rem',
                                        background: 'linear-gradient(90deg, #3b82f6, #06b6d4)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        lineHeight: '1.4'
                                    }}
                                    repeat={Infinity}
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Side: Animated Images - On mobile, this goes first */}
                    <motion.div
                        initial={{ opacity: 0, x: isMobile ? 0 : 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className={`relative ${isMobile ? 'h-[300px] md:h-[400px]' : 'h-[400px] md:h-[500px]'} w-full order-1 lg:order-2`}
                    >
                        {/* Main Image */}
                        <motion.div
                            key={currentImageIndex}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1 }}
                            transition={{ duration: 0.6 }}
                            className="absolute inset-0 rounded-2xl md:rounded-3xl overflow-hidden shadow-xl md:shadow-2xl"
                        >
                            <img
                                src={doctorImages[currentImageIndex]}
                                alt="Doctor"
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent"></div>
                        </motion.div>

                        {/* Floating Smaller Images - Hide on very small screens */}
                        {!isMobile || window.innerWidth > 375 ? (
                            <>
                                <motion.div
                                    animate={{
                                        y: [0, -10, 0],
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                    className={`absolute -top-2 -left-2 md:-left-8 w-24 h-24 md:w-40 md:h-40 rounded-xl md:rounded-2xl overflow-hidden shadow-lg md:shadow-xl border-2 md:border-4 border-white`}
                                >
                                    <img
                                        src={doctorImages[(currentImageIndex + 1) % doctorImages.length]}
                                        alt="Doctor Consultation"
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                </motion.div>

                                <motion.div
                                    animate={{
                                        y: [0, 10, 0],
                                    }}
                                    transition={{
                                        duration: 3.5,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        delay: 0.5,
                                    }}
                                    className={`absolute -bottom-3 -right-3 md:-bottom-6 md:-right-6 w-28 h-28 md:w-48 md:h-48 rounded-xl md:rounded-2xl overflow-hidden shadow-lg md:shadow-xl border-2 md:border-4 border-white`}
                                >
                                    <img
                                        src={doctorImages[(currentImageIndex + 2) % doctorImages.length]}
                                        alt="Medical Team"
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                </motion.div>
                            </>
                        ) : null}

                        {/* Floating Badge - Responsive positioning */}
                        <motion.div
                            animate={{
                                rotate: [0, 10, 0, -10, 0],
                            }}
                            transition={{
                                duration: 5,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className={`absolute ${isMobile ? 'top-4 right-4' : 'top-6 md:top-10 right-6 md:right-10'} bg-gradient-to-r from-emerald-500 to-green-400 text-white px-3 py-1 md:px-4 md:py-2 rounded-full font-bold shadow-lg z-10 text-xs md:text-sm`}
                        >
                            ⭐ 4.9/5 Rating
                        </motion.div>

                        {/* Image Indicator Dots - Responsive */}
                        <div className="absolute bottom-4 md:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-1 md:space-x-2">
                            {doctorImages.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentImageIndex(index)}
                                    className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${index === currentImageIndex
                                        ? 'bg-blue-600 w-6 md:w-8'
                                        : 'bg-gray-300 hover:bg-blue-400'
                                        }`}
                                    aria-label={`Go to image ${index + 1}`}
                                />
                            ))}
                        </div>

                        {/* Mobile Touch Navigation */}
                        {isMobile && (
                            <div className="absolute inset-0 flex justify-between items-center px-2">
                                <button
                                    onClick={() => setCurrentImageIndex(prev => prev === 0 ? doctorImages.length - 1 : prev - 1)}
                                    className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg"
                                    aria-label="Previous image"
                                >
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setCurrentImageIndex(prev => prev === doctorImages.length - 1 ? 0 : prev + 1)}
                                    className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg"
                                    aria-label="Next image"
                                >
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
            
            {/* Stats Section - Responsive grid */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="container mx-auto px-4 py-8 md:py-12"
            >
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                    <div className="text-center p-4 bg-white/50 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-sm">
                        <div className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">500+</div>
                        <div className="text-gray-600 text-sm md:text-base">Expert Doctors</div>
                    </div>
                    <div className="text-center p-4 bg-white/50 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-sm">
                        <div className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">24/7</div>
                        <div className="text-gray-600 text-sm md:text-base">Available Hours</div>
                    </div>
                    <div className="text-center p-4 bg-white/50 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-sm col-span-2 md:col-span-1">
                        <div className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">50K+</div>
                        <div className="text-gray-600 text-sm md:text-base">Patients Helped</div>
                    </div>
                </div>
            </motion.div>
            
            <DoctorPopular />
        </div>
    );
}

export default DoctorHero;