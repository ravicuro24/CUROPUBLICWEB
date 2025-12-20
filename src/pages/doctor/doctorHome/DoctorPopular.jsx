// src/pages/doctor/doctorHome/DoctorPopular.jsx
import React, { useState } from 'react';
import { FaStar, FaRegStar, FaMapMarkerAlt, FaStethoscope, FaRegClock, FaPhoneAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function DoctorPopular() {
    const navigate = useNavigate();

    const [showAll, setShowAll] = useState(false); // SHOW ONLY 8 AT START

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars.push(<FaStar key={i} className="text-yellow-500" />);
            } else if (i === fullStars + 1 && hasHalfStar) {
                stars.push(<FaRegStar key={i} className="text-yellow-500" />);
            } else {
                stars.push(<FaRegStar key={i} className="text-gray-300" />);
            }
        }
        return stars;
    };

    const popularDoctors = [
        { id: 1, qualification: "mbbs,md", name: "Dr. Sarah Johnson", specialty: "Cardiologist", experience: "15 years", rating: 4.8, reviews: 1247, fee: 1200, location: "Delhi", availability: "Today", image: "https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg" },
        { id: 2, qualification: "mbbs,md", name: "Dr. Rajesh Kumar", specialty: "Neurologist", experience: "12 years", rating: 4.9, reviews: 892, fee: 1500, location: "Mumbai", availability: "Tomorrow", image: "https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg" },
        { id: 3, qualification: "mbbs,md", name: "Dr. Priya Sharma", specialty: "Pediatrician", experience: "10 years", rating: 4.7, reviews: 1563, fee: 800, location: "Bangalore", availability: "Today", image: "https://images.pexels.com/photos/6749779/pexels-photo-6749779.jpeg" },
        { id: 4, qualification: "mbbs,md", name: "Dr. Michael Chen", specialty: "Orthopedic Surgeon", experience: "18 years", rating: 4.6, reviews: 945, fee: 1800, location: "Chennai", availability: "Today", image: "https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg" },
        { id: 5, qualification: "mbbs,md", name: "Dr. Anjali Mehta", specialty: "Dermatologist", experience: "8 years", rating: 4.5, reviews: 734, fee: 1000, location: "Kolkata", availability: "Tomorrow", image: "https://images.pexels.com/photos/7659568/pexels-photo-7659568.jpeg" },
        { id: 6, qualification: "mbbs,md", name: "Dr. David Wilson", specialty: "Psychiatrist", experience: "14 years", rating: 4.8, reviews: 621, fee: 2000, location: "Hyderabad", availability: "Today", image: "https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg" },
        { id: 7, qualification: "mbbs,md", name: "Dr. Neha Gupta", specialty: "Gynecologist", experience: "11 years", rating: 4.7, reviews: 1034, fee: 1200, location: "Pune", availability: "Today", image: "https://images.pexels.com/photos/6749778/pexels-photo-6749778.jpeg" },
        { id: 8, qualification: "mbbs,md", name: "Dr. James Miller", specialty: "ENT Specialist", experience: "16 years", rating: 4.9, reviews: 832, fee: 1100, location: "Delhi", availability: "Tomorrow", image: "https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg" },
        { id: 9, qualification: "mbbs,md", name: "Dr. Sunita Patel", specialty: "Ophthalmologist", experience: "13 years", rating: 4.6, reviews: 567, fee: 900, location: "Mumbai", availability: "Today", image: "https://images.pexels.com/photos/6749786/pexels-photo-6749786.jpeg" },
        { id: 10, qualification: "mbbs,md", name: "Dr. Robert Brown", specialty: "Urologist", experience: "17 years", rating: 4.7, reviews: 489, fee: 1600, location: "Bangalore", availability: "Tomorrow", image: "https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg" },
        { id: 11, qualification: "mbbs,md", name: "Dr. Kavita Singh", specialty: "Endocrinologist", experience: "9 years", rating: 4.5, reviews: 321, fee: 1300, location: "Chennai", availability: "Today", image: "https://images.pexels.com/photos/6749784/pexels-photo-6749784.jpeg" },
        { id: 12, qualification: "mbbs,md", name: "Dr. Thomas Lee", specialty: "Gastroenterologist", experience: "14 years", rating: 4.8, reviews: 745, fee: 1400, location: "Kolkata", availability: "Today", image: "https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg" },
        { id: 13, qualification: "mbbs,md", name: "Dr. Radhika Nair", specialty: "Rheumatologist", experience: "10 years", rating: 4.4, reviews: 289, fee: 1700, location: "Hyderabad", availability: "Tomorrow", image: "https://images.pexels.com/photos/6749775/pexels-photo-6749775.jpeg" },
        { id: 14, qualification: "mbbs,md", name: "Dr. William Taylor", specialty: "Pulmonologist", experience: "15 years", rating: 4.7, reviews: 634, fee: 1250, location: "Pune", availability: "Today", image: "https://images.pexels.com/photos/4386476/pexels-photo-4386476.jpeg" },
        { id: 15, qualification: "mbbs,md", name: "Dr. Meera Reddy", specialty: "Nephrologist", experience: "12 years", rating: 4.6, reviews: 412, fee: 1900, location: "Delhi", availability: "Tomorrow", image: "https://images.pexels.com/photos/6749792/pexels-photo-6749792.jpeg" },
        { id: 16, qualification: "mbbs,md", name: "Dr. Christopher Martin", specialty: "Hematologist", experience: "11 years", rating: 4.5, reviews: 298, fee: 2100, location: "Mumbai", availability: "Today", image: "https://images.pexels.com/photos/4386464/pexels-photo-4386464.jpeg" },
        { id: 17, qualification: "mbbs,md", name: "Dr. Sneha Verma", specialty: "Oncologist", experience: "16 years", rating: 4.9, reviews: 856, fee: 2500, location: "Bangalore", availability: "Today", image: "https://images.pexels.com/photos/6749782/pexels-photo-6749782.jpeg" },
        { id: 18, qualification: "mbbs,md", name: "Dr. Daniel Clark", specialty: "Allergist", experience: "8 years", rating: 4.3, reviews: 234, fee: 950, location: "Chennai", availability: "Tomorrow", image: "https://images.pexels.com/photos/5452295/pexels-photo-5452295.jpeg" },
        { id: 19, qualification: "mbbs,md", name: "Dr. Ananya Das", specialty: "Physiotherapist", experience: "7 years", rating: 4.4, reviews: 567, fee: 700, location: "Kolkata", availability: "Today", image: "https://images.pexels.com/photos/6749788/pexels-photo-6749788.jpeg" },
        { id: 20, qualification: "mbbs,md", name: "Dr. Steven White", specialty: "Dentist", experience: "13 years", rating: 4.7, reviews: 987, fee: 850, location: "Hyderabad", availability: "Tomorrow", image: "https://images.pexels.com/photos/5327661/pexels-photo-5327661.jpeg" }
    ];

    const visibleDoctors = showAll ? popularDoctors : popularDoctors.slice(0, 8);

    const handleBookAppointment = (doctor, e) => {
        e.stopPropagation();
        navigate('/doctor/doctor-details', { state: { doctor } });
    };

    return (
        <div className="w-full py-8 container md:mx-auto ">
            <h1 className='my-2 text-base md:text-md font-semibold md:font-bold text-gray-800'>Popular Doctor</h1>
            <div className="mx-auto">

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {visibleDoctors.map((doctor) => (
                        <div
                            key={doctor.id}
                            onClick={(e) => handleBookAppointment(doctor, e)}
                            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100"
                        >
                            <div className="relative h-48 sm:h-52 overflow-hidden">
                                <img
                                    src={doctor.image}
                                    alt={doctor.name}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                />

                                <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${doctor.availability === 'Today' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'}`}>
                                    {doctor.availability === 'Today' ? 'Available Today' : 'Available Tomorrow'}
                                </div>

                                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-sm font-semibold">
                                    {doctor.experience}
                                </div>
                            </div>

                            <div className="p-4 sm:p-5">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg text-gray-800 truncate">{doctor.name}</h3>
                                    <span className="bg-teal-50 text-teal-700 px-2 py-1 rounded text-sm font-semibold whitespace-nowrap">
                                        ₹{doctor.fee}
                                    </span>
                                </div>

                                <div className="flex items-center text-gray-600 mb-3">
                                    <FaStethoscope className="mr-2 text-teal-600" />
                                    <span className="text-sm font-medium">{doctor.specialty}</span>
                                </div>

                                <div className="flex items-center text-gray-600 mb-4">
                                    <FaMapMarkerAlt className="mr-2 text-red-500" />
                                    <span className="text-sm">{doctor.location}</span>
                                </div>

                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center">
                                        <div className="flex mr-2">{renderStars(doctor.rating)}</div>
                                        <span className="font-bold text-gray-800">{doctor.rating}</span>
                                        <span className="text-gray-500 text-sm ml-1">({doctor.reviews})</span>
                                    </div>
                                    <div className="flex items-center text-gray-600 text-sm">
                                        <FaRegClock className="mr-1" />
                                        <span>30 min</span>
                                    </div>
                                </div>

                                <div className="flex space-x-3">
                                    <button
                                        onClick={(e) => handleBookAppointment(doctor, e)}
                                        className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-2.5 rounded-lg font-semibold text-sm transition-colors text-center"
                                    >
                                        Book Now
                                    </button>

                                   
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* VIEW MORE / VIEW LESS BUTTON */}
                <div className="text-center mt-10">
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className="px-8 py-3 bg-white border-2 border-teal-600 text-teal-600 rounded-lg font-semibold hover:bg-teal-50 transition-colors text-sm sm:text-base"
                    >
                        {showAll ? "View Less" : "View More"}
                    </button>
                </div>

            </div>
        </div>
    );
}

export default DoctorPopular;
