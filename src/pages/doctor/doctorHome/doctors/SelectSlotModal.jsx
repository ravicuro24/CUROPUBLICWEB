// src/pages/doctor/doctorHome/doctors/SelectSlotModal.jsx
import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaClock, FaTimes, FaCheckCircle } from "react-icons/fa";

function SelectSlotModal({
    isOpen,
    onClose,
    onConfirm,
    onSlotSelect,
    selectedDate: initialSelectedDate,
    selectedTimeSlot: initialSelectedTimeSlot,
    consultTypeVideo,
    consultTypeClinic,
    selectedFee
}) {
    const [selectedDate, setSelectedDate] = useState(initialSelectedDate || '');
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(initialSelectedTimeSlot || '');
    const [manualDate, setManualDate] = useState('');
    const [nextFiveDays, setNextFiveDays] = useState([]);
    const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
    const [activeTimeCategory, setActiveTimeCategory] = useState('morning'); // Default to morning
    const [filteredSlots, setFilteredSlots] = useState([]);

    useEffect(() => {
        if (isOpen) {
            generateNextFiveDays();
            const today = new Date().toISOString().split('T')[0];
            if (!selectedDate) {
                setSelectedDate(today);
                setManualDate(today);
            }
            const slots = getTimeSlotsForDate(selectedDate || today);
            setAvailableTimeSlots(slots);
            filterSlotsByCategory('morning', slots);
        }
    }, [isOpen, selectedDate]);

    useEffect(() => {
        if (selectedDate && selectedTimeSlot) {
            onSlotSelect(selectedDate, selectedTimeSlot);
        }
    }, [selectedDate, selectedTimeSlot]);

    useEffect(() => {
        filterSlotsByCategory(activeTimeCategory, availableTimeSlots);
    }, [activeTimeCategory, availableTimeSlots]);

    const generateNextFiveDays = () => {
        const dates = [];
        const today = new Date();

        for (let i = 0; i < 5; i++) {
            const nextDate = new Date(today);
            nextDate.setDate(today.getDate() + i);

            const formattedDate = nextDate.toISOString().split('T')[0];
            const dayName = nextDate.toLocaleDateString('en-US', { weekday: 'short' });
            const dayNumber = nextDate.getDate();
            const monthName = nextDate.toLocaleDateString('en-US', { month: 'short' });

            dates.push({
                date: formattedDate,
                display: `${dayName}, ${dayNumber} ${monthName}`,
                dayNumber,
                dayName,
                monthName
            });
        }

        setNextFiveDays(dates);
        if (dates.length > 0 && !selectedDate) {
            const todayFormatted = today.toISOString().split('T')[0];
            setSelectedDate(todayFormatted);
            setManualDate(todayFormatted);
        }
    };

    const getTimeSlotsForDate = (date) => {
        // Mock time slots - in real app, this would come from backend
        const morningSlots = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'];
        const afternoonSlots = ['01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM'];
        const eveningSlots = ['05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM'];

        return [...morningSlots, ...afternoonSlots, ...eveningSlots];
    };

    const filterSlotsByCategory = (category, slots) => {
        switch (category) {
            case 'morning':
                setFilteredSlots(slots.filter(slot => slot.includes('AM')));
                break;
            case 'afternoon':
                setFilteredSlots(slots.filter(slot =>
                    slot.includes('PM') &&
                    parseInt(slot) < 5
                ));
                break;
            case 'evening':
                setFilteredSlots(slots.filter(slot =>
                    slot.includes('PM') &&
                    parseInt(slot) >= 5
                ));
                break;
            default:
                setFilteredSlots(slots.filter(slot => slot.includes('AM')));
        }
    };

    const handleDateSelect = (date) => {
        setSelectedDate(date);
        setManualDate(date);
        const slots = getTimeSlotsForDate(date);
        setAvailableTimeSlots(slots);
        filterSlotsByCategory(activeTimeCategory, slots);
        setSelectedTimeSlot('');
    };

    const handleManualDateChange = (e) => {
        const date = e.target.value;
        setManualDate(date);
        setSelectedDate(date);
        const slots = getTimeSlotsForDate(date);
        setAvailableTimeSlots(slots);
        filterSlotsByCategory(activeTimeCategory, slots);
        setSelectedTimeSlot('');
    };

    const handleTimeSlotSelect = (time) => {
        setSelectedTimeSlot(time);
    };

    const handleTimeCategorySelect = (category) => {
        setActiveTimeCategory(category);
        setSelectedTimeSlot('');
    };

    const formatSelectedDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleConfirm = () => {
        if (selectedDate && selectedTimeSlot) {
            onConfirm();
        }
    };

    const getCategoryCount = (category) => {
        switch (category) {
            case 'morning':
                return availableTimeSlots.filter(slot => slot.includes('AM')).length;
            case 'afternoon':
                return availableTimeSlots.filter(slot =>
                    slot.includes('PM') && parseInt(slot) < 5
                ).length;
            case 'evening':
                return availableTimeSlots.filter(slot =>
                    slot.includes('PM') && parseInt(slot) >= 5
                ).length;
            default:
                return 0;
        }
    };

    if (!isOpen) return null;

    return (
        <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl z-10">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Select Date & Time</h2>
                        <p className="text-gray-600 mt-1">
                            Choose your preferred appointment slot for {consultTypeVideo ? "Video Consultation" : "Clinic Visit"}
                        </p>
                    </div>
                    <div className="inline-flex items-center px-4 py-2 rounded-lg bg-teal-50 border border-teal-200">
                        <span className="text-teal-700 font-medium">
                            {consultTypeVideo ? "Video Consultation" : "In-Person Visit"} -
                            ₹{selectedFee}
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <FaTimes className="w-6 h-6" />
                    </button>
                </div>

                {/* Selected Consultation Type */}

            </div>

            {/* Modal Body */}
            <div className="p-6">
                {/* Manual Date Input */}
                <div className=' flex justify-between items-center gap-2'>
                    <div className="mb-2 md:w-1/2 w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                            <FaCalendarAlt className="w-4 h-4 mr-2 text-teal-600" />
                            Select Date
                        </label>
                        <div className="flex items-center space-x-4">
                            <input
                                type="date"
                                value={manualDate}
                                onChange={handleManualDateChange}
                                min={new Date().toISOString().split('T')[0]}
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                            />
                        </div>
                    </div>

                    {/* Next 5 Days Quick Selection */}
                    <div className="w-full md:w-1/2 mt-3">
                        <div className="grid grid-cols-5 gap-2">
                            {nextFiveDays.map((day) => (
                                <button
                                    key={day.date}
                                    onClick={() => handleDateSelect(day.date)}
                                    className={`flex flex-col items-center justify-center p-1 rounded-xl border transition-all duration-200 ${selectedDate === day.date
                                        ? "bg-teal-600 text-white border-teal-600"
                                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                        }`}
                                >
                                    <span className="text-sm font-medium">{day.dayName}</span>
                                    <span className="text-base font-semibold mt-1">{day.dayNumber} {day.monthName}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>



                {/* Time Categories Tabs */}
                <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <FaClock className="w-5 h-5 mr-2 text-teal-600" />
                        Available Time Slots
                    </h3>

                    <div className="flex justify-start items-center space-x-1 mb-6">
                        <button
                            onClick={() => handleTimeCategorySelect('morning')}
                            className={` py-1 w-40 rounded-xl border transition-all duration-200 flex flex-col items-center ${activeTimeCategory === 'morning'
                                ? "bg-teal-100 border-teal-300 text-teal-700"
                                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                                }`}
                        >
                            <span className="font-medium">Morning</span>
                            <span className="text-xs text-gray-500 mt-1">
                                {getCategoryCount('morning')} slots
                            </span>
                        </button>

                        <button
                            onClick={() => handleTimeCategorySelect('afternoon')}
                            className={` py-1 w-40 rounded-xl border transition-all duration-200 flex flex-col items-center ${activeTimeCategory === 'afternoon'
                                ? "bg-teal-100 border-teal-300 text-teal-700"
                                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                                }`}
                        >
                            <span className="font-medium">Afternoon</span>
                            <span className="text-xs text-gray-500 mt-1">
                                {getCategoryCount('afternoon')} slots
                            </span>
                        </button>

                        <button
                            onClick={() => handleTimeCategorySelect('evening')}
                            className={` py-1 w-40 rounded-xl border transition-all duration-200 flex flex-col items-center ${activeTimeCategory === 'evening'
                                ? "bg-teal-100 border-teal-300 text-teal-700"
                                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                                }`}
                        >
                            <span className="font-medium">Evening</span>
                            <span className="text-xs text-gray-500 mt-1">
                                {getCategoryCount('evening')} slots
                            </span>
                        </button>
                    </div>

                    {/* Time Slots Grid */}
                    {filteredSlots.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            No {activeTimeCategory} slots available for this date. Please select another date or time category.
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                            {filteredSlots.map((time) => (
                                <button
                                    key={time}
                                    onClick={() => handleTimeSlotSelect(time)}
                                    className={`py-3 px-4 rounded-lg border transition-all duration-200 ${selectedTimeSlot === time
                                        ? "bg-teal-600 text-white border-teal-600"
                                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                        }`}
                                >
                                    {time}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Category Description */}
                    <div className="mt-4 text-sm text-gray-600">
                        {activeTimeCategory === 'morning' && (
                            <p>Morning slots are typically between 9:00 AM - 12:00 PM</p>
                        )}
                        {activeTimeCategory === 'afternoon' && (
                            <p>Afternoon slots are typically between 1:00 PM - 4:00 PM</p>
                        )}
                        {activeTimeCategory === 'evening' && (
                            <p>Evening slots are typically between 5:00 PM - 8:00 PM</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 rounded-b-2xl z-10">
                <div className="flex justify-between items-center">
                    <div>
                        {selectedTimeSlot && (
                            <div className="text-sm text-gray-600">
                                <p className="font-medium">Selected Appointment:</p>
                                <p className="text-teal-700 font-semibold">
                                    {formatSelectedDate(selectedDate)} at {selectedTimeSlot}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {activeTimeCategory.charAt(0).toUpperCase() + activeTimeCategory.slice(1)} slot
                                </p>
                            </div>
                        )}
                    </div>
                    <div className="flex space-x-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={!selectedTimeSlot}
                            className={`px-6 py-3 rounded-xl transition-colors ${selectedTimeSlot
                                ? "bg-teal-600 hover:bg-teal-700 text-white"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                }`}
                        >
                            Confirm & Continue
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SelectSlotModal;