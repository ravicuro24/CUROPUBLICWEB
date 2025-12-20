// src/pages/doctor/doctorHome/doctors/SearchedDoctor.jsx
// src/pages/doctor/doctorHome/doctors/DoctorList.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    FaUserMd,
    FaHeartbeat,
    FaStar,
    FaMapMarkerAlt,
    FaBriefcaseMedical,
    FaCalendarAlt,
    FaSearch,
    FaFilter,
    FaSortAmountDown,
    FaPhoneAlt,
    FaRegClock,
    FaMoneyBillWave,
    FaStethoscope,
    FaGraduationCap,
    FaHospital
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function SearchedDoctor() {
    // Dummy doctors data
    const doctors = [
        { id: 1, image: 'https://media.istockphoto.com/id/469155474/photo/male-docotor-say-thats-ok-wearing-protective-mask.jpg?b=1&s=612x612&w=0&k=20&c=mjp3GO4BQ5OMzZ1ZB5-bML2x-B6K5vlyoj4BevH7g2s=', name: "Dr. Sarah Johnson", specialty: "Cardiology", experience: 15, rating: 4.9, reviews: 428, fees: 1500, availability: "Today", hospital: "Medicare Heart Center", location: "New York", imageColor: "bg-red-100", iconColor: "text-red-600", education: "MD, Cardiology", languages: ["English", "Spanish"] },
        { id: 2, image: 'https://media.istockphoto.com/id/469155474/photo/male-docotor-say-thats-ok-wearing-protective-mask.jpg?b=1&s=612x612&w=0&k=20&c=mjp3GO4BQ5OMzZ1ZB5-bML2x-B6K5vlyoj4BevH7g2s=', name: "Dr. Michael Chen", specialty: "Neurology", experience: 12, rating: 4.8, reviews: 312, fees: 1800, availability: "Tomorrow", hospital: "NeuroCare Institute", location: "San Francisco", imageColor: "bg-indigo-100", iconColor: "text-indigo-600", education: "MD, Neurology", languages: ["English", "Mandarin"] },
        { id: 3, image: 'https://media.istockphoto.com/id/469155474/photo/male-docotor-say-thats-ok-wearing-protective-mask.jpg?b=1&s=612x612&w=0&k=20&c=mjp3GO4BQ5OMzZ1ZB5-bML2x-B6K5vlyoj4BevH7g2s=', name: "Dr. Priya Sharma", specialty: "Dermatology", experience: 8, rating: 4.7, reviews: 245, fees: 1200, availability: "Today", hospital: "Skin & Beauty Clinic", location: "Mumbai", imageColor: "bg-purple-100", iconColor: "text-purple-600", education: "MD, Dermatology", languages: ["English", "Hindi", "Marathi"] },
        { id: 4, image: 'https://media.istockphoto.com/id/469155474/photo/male-docotor-say-thats-ok-wearing-protective-mask.jpg?b=1&s=612x612&w=0&k=20&c=mjp3GO4BQ5OMzZ1ZB5-bML2x-B6K5vlyoj4BevH7g2s=', name: "Dr. Robert Williams", specialty: "Orthopaedics", experience: 20, rating: 4.9, reviews: 567, fees: 2000, availability: "Today", hospital: "Bone & Joint Center", location: "Chicago", imageColor: "bg-gray-100", iconColor: "text-gray-600", education: "MS, Orthopaedics", languages: ["English"] },
        { id: 5, image: 'https://media.istockphoto.com/id/469155474/photo/male-docotor-say-thats-ok-wearing-protective-mask.jpg?b=1&s=612x612&w=0&k=20&c=mjp3GO4BQ5OMzZ1ZB5-bML2x-B6K5vlyoj4BevH7g2s=', name: "Dr. Aisha Patel", specialty: "Pediatrics", experience: 10, rating: 4.8, reviews: 389, fees: 1000, availability: "Tomorrow", hospital: "Little Angels Hospital", location: "Dubai", imageColor: "bg-yellow-100", iconColor: "text-yellow-600", education: "MD, Pediatrics", languages: ["English", "Arabic", "Hindi"] },
        { id: 6, image: 'https://media.istockphoto.com/id/469155474/photo/male-docotor-say-thats-ok-wearing-protective-mask.jpg?b=1&s=612x612&w=0&k=20&c=mjp3GO4BQ5OMzZ1ZB5-bML2x-B6K5vlyoj4BevH7g2s=', name: "Dr. James Wilson", specialty: "General Surgery", experience: 18, rating: 4.7, reviews: 421, fees: 2200, availability: "Today", hospital: "City General Hospital", location: "London", imageColor: "bg-blue-100", iconColor: "text-blue-600", education: "MS, General Surgery", languages: ["English"] },
        { id: 7, image: 'https://media.istockphoto.com/id/469155474/photo/male-docotor-say-thats-ok-wearing-protective-mask.jpg?b=1&s=612x612&w=0&k=20&c=mjp3GO4BQ5OMzZ1ZB5-bML2x-B6K5vlyoj4BevH7g2s=', name: "Dr. Maria Garcia", specialty: "Obstetrics & Gynecology", experience: 14, rating: 4.9, reviews: 498, fees: 1600, availability: "Today", hospital: "Women's Health Center", location: "Los Angeles", imageColor: "bg-pink-100", iconColor: "text-pink-600", education: "MD, OB/GYN", languages: ["English", "Spanish"] },
        { id: 8, image: 'https://media.istockphoto.com/id/469155474/photo/male-docotor-say-thats-ok-wearing-protective-mask.jpg?b=1&s=612x612&w=0&k=20&c=mjp3GO4BQ5OMzZ1ZB5-bML2x-B6K5vlyoj4BevH7g2s=', name: "Dr. Kenji Tanaka", specialty: "Ophthalmology", experience: 11, rating: 4.8, reviews: 276, fees: 1400, availability: "Tomorrow", hospital: "Vision Care Clinic", location: "Tokyo", imageColor: "bg-sky-100", iconColor: "text-sky-600", education: "MD, Ophthalmology", languages: ["Japanese", "English"] },
        { id: 9, image: 'https://media.istockphoto.com/id/469155474/photo/male-docotor-say-thats-ok-wearing-protective-mask.jpg?b=1&s=612x612&w=0&k=20&c=mjp3GO4BQ5OMzZ1ZB5-bML2x-B6K5vlyoj4BevH7g2s=', name: "Dr. Emily Brown", specialty: "Psychiatry", experience: 9, rating: 4.6, reviews: 189, fees: 1700, availability: "Today", hospital: "Mind Wellness Center", location: "Boston", imageColor: "bg-violet-100", iconColor: "text-violet-600", education: "MD, Psychiatry", languages: ["English", "French"] },
        { id: 10, image: 'https://media.istockphoto.com/id/469155474/photo/male-docotor-say-thats-ok-wearing-protective-mask.jpg?b=1&s=612x612&w=0&k=20&c=mjp3GO4BQ5OMzZ1ZB5-bML2x-B6K5vlyoj4BevH7g2s=', name: "Dr. Carlos Rodriguez", specialty: "Gastroenterology", experience: 16, rating: 4.9, reviews: 354, fees: 1900, availability: "Tomorrow", hospital: "Digestive Health Institute", location: "Miami", imageColor: "bg-green-100", iconColor: "text-green-600", education: "MD, Gastroenterology", languages: ["English", "Spanish"] },
        { id: 11, image: 'https://media.istockphoto.com/id/469155474/photo/male-docotor-say-thats-ok-wearing-protective-mask.jpg?b=1&s=612x612&w=0&k=20&c=mjp3GO4BQ5OMzZ1ZB5-bML2x-B6K5vlyoj4BevH7g2s=', name: "Dr. Lisa Wang", specialty: "Dentistry", experience: 7, rating: 4.7, reviews: 234, fees: 800, availability: "Today", hospital: "Bright Smile Dental", location: "Seattle", imageColor: "bg-teal-100", iconColor: "text-teal-600", education: "DDS, Dentistry", languages: ["English", "Chinese"] },
        { id: 12, image: 'https://media.istockphoto.com/id/469155474/photo/male-docotor-say-thats-ok-wearing-protective-mask.jpg?b=1&s=612x612&w=0&k=20&c=mjp3GO4BQ5OMzZ1ZB5-bML2x-B6K5vlyoj4BevH7g2s=', name: "Dr. Ahmed Hassan", specialty: "ENT", experience: 13, rating: 4.8, reviews: 287, fees: 1300, availability: "Today", hospital: "Ear Nose Throat Center", location: "Cairo", imageColor: "bg-emerald-100", iconColor: "text-emerald-600", education: "MS, ENT", languages: ["Arabic", "English"] },
        { id: 13, image: 'https://media.istockphoto.com/id/469155474/photo/male-docotor-say-thats-ok-wearing-protective-mask.jpg?b=1&s=612x612&w=0&k=20&c=mjp3GO4BQ5OMzZ1ZB5-bML2x-B6K5vlyoj4BevH7g2s=', name: "Dr. Sophia Kim", specialty: "Endocrinology", experience: 10, rating: 4.7, reviews: 198, fees: 1500, availability: "Tomorrow", hospital: "Metabolic Health Clinic", location: "Seoul", imageColor: "bg-rose-100", iconColor: "text-rose-600", education: "MD, Endocrinology", languages: ["Korean", "English"] },
        { id: 14, image: 'https://media.istockphoto.com/id/469155474/photo/male-docotor-say-thats-ok-wearing-protective-mask.jpg?b=1&s=612x612&w=0&k=20&c=mjp3GO4BQ5OMzZ1ZB5-bML2x-B6K5vlyoj4BevH7g2s=', name: "Dr. David Miller", specialty: "Urology", experience: 17, rating: 4.9, reviews: 412, fees: 2100, availability: "Today", hospital: "UroCare Center", location: "Toronto", imageColor: "bg-cyan-100", iconColor: "text-cyan-600", education: "MD, Urology", languages: ["English", "French"] },
        { id: 15, image: 'https://media.istockphoto.com/id/469155474/photo/male-docotor-say-thats-ok-wearing-protective-mask.jpg?b=1&s=612x612&w=0&k=20&c=mjp3GO4BQ5OMzZ1ZB5-bML2x-B6K5vlyoj4BevH7g2s=', name: "Dr. Olivia Taylor", specialty: "Dermatology", experience: 6, rating: 4.5, reviews: 156, fees: 1100, availability: "Today", hospital: "Skin Solutions", location: "Sydney", imageColor: "bg-purple-100", iconColor: "text-purple-600", education: "MD, Dermatology", languages: ["English"] },
        { id: 16, image: 'https://media.istockphoto.com/id/469155474/photo/male-docotor-say-thats-ok-wearing-protective-mask.jpg?b=1&s=612x612&w=0&k=20&c=mjp3GO4BQ5OMzZ1ZB5-bML2x-B6K5vlyoj4BevH7g2s=', name: "Dr. Benjamin Clark", specialty: "Cardiology", experience: 22, rating: 5.0, reviews: 589, fees: 2500, availability: "Tomorrow", hospital: "Heart Excellence Center", location: "Houston", imageColor: "bg-red-100", iconColor: "text-red-600", education: "MD, Cardiology", languages: ["English"] },
        { id: 17, image: 'https://media.istockphoto.com/id/469155474/photo/male-docotor-say-thats-ok-wearing-protective-mask.jpg?b=1&s=612x612&w=0&k=20&c=mjp3GO4BQ5OMzZ1ZB5-bML2x-B6K5vlyoj4BevH7g2s=', name: "Dr. Isabella Rossi", specialty: "Pediatrics", experience: 8, rating: 4.7, reviews: 267, fees: 900, availability: "Today", hospital: "Children's Care Hospital", location: "Rome", imageColor: "bg-yellow-100", iconColor: "text-yellow-600", education: "MD, Pediatrics", languages: ["Italian", "English"] },
        { id: 18, image: 'https://media.istockphoto.com/id/469155474/photo/male-docotor-say-thats-ok-wearing-protective-mask.jpg?b=1&s=612x612&w=0&k=20&c=mjp3GO4BQ5OMzZ1ZB5-bML2x-B6K5vlyoj4BevH7g2s=', name: "Dr. Thomas Lee", specialty: "Orthopaedics", experience: 19, rating: 4.8, reviews: 432, fees: 2300, availability: "Today", hospital: "Sports Medicine Center", location: "Singapore", imageColor: "bg-gray-100", iconColor: "text-gray-600", education: "MS, Orthopaedics", languages: ["English", "Mandarin", "Malay"] },
        { id: 19, image: 'https://media.istockphoto.com/id/469155474/photo/male-docotor-say-thats-ok-wearing-protective-mask.jpg?b=1&s=612x612&w=0&k=20&c=mjp3GO4BQ5OMzZ1ZB5-bML2x-B6K5vlyoj4BevH7g2s=', name: "Dr. Chloe Martin", specialty: "Psychiatry", experience: 11, rating: 4.6, reviews: 213, fees: 1600, availability: "Tomorrow", hospital: "Peace of Mind Clinic", location: "Paris", imageColor: "bg-violet-100", iconColor: "text-violet-600", education: "MD, Psychiatry", languages: ["French", "English"] },
        { id: 20, image: 'https://media.istockphoto.com/id/469155474/photo/male-docotor-say-thats-ok-wearing-protective-mask.jpg?b=1&s=612x612&w=0&k=20&c=mjp3GO4BQ5OMzZ1ZB5-bML2x-B6K5vlyoj4BevH7g2s=', name: "Dr. Alex Turner", specialty: "General Physician", experience: 12, rating: 4.7, reviews: 345, fees: 1000, availability: "Today", hospital: "Family Health Center", location: "Melbourne", imageColor: "bg-blue-100", iconColor: "text-blue-600", education: "MD, General Medicine", languages: ["English"] }
    ];

    // All unique specialties for filter
    const allSpecialties = [...new Set(doctors.map(doc => doc.specialty))];
    const navigate = useNavigate()

    // State management
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSpecialty, setSelectedSpecialty] = useState("All");
    const [sortBy, setSortBy] = useState("rating");
    const [showFilters, setShowFilters] = useState(false);
    const [availabilityFilter, setAvailabilityFilter] = useState("All");

    // Filter and sort doctors
    const filteredDoctors = doctors
        .filter(doctor => {
            const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                doctor.hospital.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesSpecialty = selectedSpecialty === "All" || doctor.specialty === selectedSpecialty;
            const matchesAvailability = availabilityFilter === "All" ||
                (availabilityFilter === "Today" && doctor.availability === "Today") ||
                (availabilityFilter === "Tomorrow" && doctor.availability === "Tomorrow");
            return matchesSearch && matchesSpecialty && matchesAvailability;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case "rating": return b.rating - a.rating;
                case "experience": return b.experience - a.experience;
                case "fees_low": return a.fees - b.fees;
                case "fees_high": return b.fees - a.fees;
                default: return 0;
            }
        });

    // Handle book appointment
    const handleBookAppointment = (doctor) => {
        if (!doctor) return;
        navigate('/doctor/doctor-details', { state: { doctor }, });
    };


    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.3
            }
        }
    };

    return (
        <div className="">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
                        Find Your Doctor
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Browse through our network of {doctors.length}+ certified doctors and book appointments instantly
                    </p>
                </motion.div>

                {/* Search and Filter Bar */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="mb-8"
                >
                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                        {/* Search Input */}
                        <div className="flex-grow relative">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search doctors by name, specialty, or hospital..."
                                className="w-full px-6 py-3 pl-12 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none shadow-sm"
                            />
                            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>

                        {/* Filter Toggle Button */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="md:hidden flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            <FaFilter />
                            Filters
                        </button>
                    </div>

                    {/* Filters Section */}
                    <motion.div
                        initial={false}
                        animate={{ height: showFilters ? 'auto' : 0, opacity: showFilters ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Specialty Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Specialty
                                    </label>
                                    <select
                                        value={selectedSpecialty}
                                        onChange={(e) => setSelectedSpecialty(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                                    >
                                        <option value="All">All Specialties</option>
                                        {allSpecialties.map(specialty => (
                                            <option key={specialty} value={specialty}>{specialty}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Availability Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Availability
                                    </label>
                                    <select
                                        value={availabilityFilter}
                                        onChange={(e) => setAvailabilityFilter(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                                    >
                                        <option value="All">All Availability</option>
                                        <option value="Today">Today</option>
                                        <option value="Tomorrow">Tomorrow</option>
                                    </select>
                                </div>

                                {/* Sort Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Sort By
                                    </label>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                                    >
                                        <option value="rating">Highest Rating</option>
                                        <option value="experience">Most Experience</option>
                                        <option value="fees_low">Fee: Low to High</option>
                                        <option value="fees_high">Fee: High to Low</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Results Info */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex justify-between items-center mb-6"
                >
                    <p className="text-gray-700">
                        Showing <span className="font-bold text-blue-600">{filteredDoctors.length}</span> of {doctors.length} doctors
                    </p>
                    <div className="flex items-center gap-2 text-gray-500">
                        <FaSortAmountDown />
                        <span className="text-sm">Sorted by {sortBy.replace('_', ' ')}</span>
                    </div>
                </motion.div>

                {/* Doctors Grid/List */}
                {filteredDoctors.length > 0 ? (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-2 lg:grid-cols-2 gap-6"
                    >
                        {filteredDoctors.map(doctor => (
                            <motion.div
                                key={doctor.id}
                                variants={itemVariants}
                                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                            >
                                <div className="p-6">
                                    <div className="flex flex-col md:flex-row gap-6 ">
                                        {/* Doctor Image/Icon */}
                                        <div className="flex-shrink-0">
                                            <img src={doctor.image} className='h-20 w-20 rounded-full' alt="" />

                                        </div>

                                        {/* Doctor Details */}
                                        <div className="flex-grow">
                                            <div className="flex flex-col md:flex-row md:items-start justify-between mb-3">
                                                <div>
                                                    <h3 className=" text-md md:text-xl font-bold text-gray-800">{doctor.name}</h3>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <FaBriefcaseMedical className="text-gray-400 text-xs md:text-md" />
                                                        <span className="text-gray-600 text-xs md:text-md ">{doctor.specialty}</span>
                                                    </div>
                                                </div>
                                                <div className="mt-2 md:mt-0">
                                                    <div className="flex items-center gap-1">
                                                        <FaStar className="text-yellow-400 fill-current text-sm md:text-md" />
                                                        <span className="font-bold text-gray-800 text-sm md:text-md">{doctor.rating}</span>
                                                        <span className="text-gray-500 text-xs md:text-sm">({doctor.reviews} reviews)</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Additional Info */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <FaGraduationCap className=' text-xs md:text-sm' />
                                                    <span className=" text-xs md:text-sm">{doctor.education}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <FaBriefcaseMedical className=' text-xs md:text-sm' />
                                                    <span className="text-xs md:text-sm">{doctor.experience} years experience</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <FaHospital className=' text-xs md:text-sm' />
                                                    <span className="text-xs md:text-sm">{doctor.hospital}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <FaMapMarkerAlt className=' text-xs md:text-sm' />
                                                    <span className="text-xs md:text-sm">{doctor.location}</span>
                                                </div>
                                            </div>

                                            {/* Languages */}
                                            <div className="mb-4">
                                                <p className="text-xs md:text-sm text-gray-500 mb-1">Languages:</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {doctor.languages.map((lang, index) => (
                                                        <span
                                                            key={index}
                                                            className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs "
                                                        >
                                                            {lang}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Footer with CTA */}
                                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center pt-4 border-t border-gray-100">
                                                <div className="flex flex-wrap gap-4 mb-4 md:mb-0">
                                                    <div className="flex items-center gap-2">
                                                        <FaMoneyBillWave className="text-green-500" />
                                                        <span className="font-bold text-gray-800">₹{doctor.fees}</span>
                                                        <span className="text-gray-500 text-xs">Consultation Fee</span>
                                                    </div>

                                                </div>
                                                <div className="flex gap-3">

                                                    <button
                                                        onClick={() => handleBookAppointment(doctor)}
                                                        className="px-2 md:px-6 md:py-2.5 py-1.5 text-xs md:text-md bg-gradient-to-r from-teal-600 to-cyan-800 cursor-pointer text-white rounded-full font-semibold hover:shadow-lg transition-all duration-300"
                                                    >
                                                        <FaCalendarAlt className="inline mr-2 text-xs md:text-md" />
                                                        Book Appointment
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    // No results found
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-16 bg-white rounded-2xl shadow-md"
                    >
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                            <FaUserMd className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                            No doctors found
                        </h3>
                        <p className="text-gray-500 mb-6 max-w-md mx-auto">
                            Try adjusting your search filters or use different keywords
                        </p>
                        <button
                            onClick={() => {
                                setSearchTerm("");
                                setSelectedSpecialty("All");
                                setAvailabilityFilter("All");
                            }}
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-full font-semibold hover:shadow-lg transition-all duration-300"
                        >
                            Reset Filters
                        </button>
                    </motion.div>
                )}

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6"
                >
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-2">{doctors.length}+</div>
                        <p className="text-gray-600">Verified Doctors</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
                        <div className="text-3xl font-bold text-green-600 mb-2">24/7</div>
                        <p className="text-gray-600">Available Support</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
                        <div className="text-3xl font-bold text-purple-600 mb-2">98%</div>
                        <p className="text-gray-600">Patient Satisfaction</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
                        <div className="text-3xl font-bold text-yellow-600 mb-2">10min</div>
                        <p className="text-gray-600">Avg. Response Time</p>
                    </div>
                </motion.div>

                {/* Footer Note */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                    className="mt-12 text-center text-gray-500 text-sm"
                >
                    <p>Need help? Contact our support team at support@medicare.com or call 1-800-MED-HELP</p>
                    <p className="mt-2">All doctors are verified and licensed to practice in their respective regions</p>
                </motion.div>
            </div>
        </div>
    );
}

export default SearchedDoctor;