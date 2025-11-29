// src/pages/lab/labhome/AppotmentList.jsx
import React, { useState } from 'react';
import { RxStopwatch } from "react-icons/rx";
import { useLabAuth } from '../../../Authorization/LabAuthContext';


const AppointmentsList = ({ appointments }) => {
    console.log("list", appointments);
    const { searchAppointment, setSearchAppointment } = useLabAuth()
    const [expandedAppointment, setExpandedAppointment] = useState(null);

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800';
            case 'CONFIRMED':
                return 'bg-teal-100 text-teal-800';
            case 'COMPLETED':
                return 'bg-green-100 text-green-800';
            case 'CANCELLED':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatTimeTo12Hour = (timeString) => {
        if (!timeString) return "";

        const [hours, minutes, seconds] = timeString.split(":");
        const h = parseInt(hours);
        const suffix = h >= 12 ? "PM" : "AM";
        const hour12 = h % 12 || 12; // convert 0->12

        return `${hour12.toString().padStart(2, "0")}:${minutes} ${suffix}`;
    };


    const toggleAccordion = (appointmentId) => {
        setExpandedAppointment(expandedAppointment === appointmentId ? null : appointmentId);
    };

    // Check if appointments is an array and has data
    if (appointments.data.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center py-12">
                    <h3 className="text-lg font-medium text-gray-900">No appointments found</h3>
                    <p className="text-gray-500 mt-2">There are no appointments to display.</p>
                </div>
            </div>
        );
    }


    return (
        <div className="bg-white">
            {/* Appointments List */}
            <div className="space-y-4">
                {appointments && appointments.data.map((appointment) => (
                    <div
                        key={appointment.id}
                        className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200"
                    >
                        <div
                            className="px-6 py-4 cursor-pointer"
                            onClick={() => toggleAccordion(appointment.id)}
                        >
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                {/* Left Section - Basic Info */}
                                <div className="flex-1 ">
                                    <div className="flex items-center space-x-4">
                                        <div>
                                            {/* <h3 className="text-lg font-semibold text-gray-900">
                                                {appointment.bookedFor?.name || 'N/A'}
                                            </h3> */}
                                            <p className="text-sm md:text-md font-semibold text-teal-700">
                                                {appointment.appointmentNumber}
                                            </p>
                                        </div>
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                                appointment.appointmentStatus
                                            )}`}
                                        >
                                            {appointment.appointmentStatus}
                                        </span>
                                    </div>
                                </div>

                                {/* Middle Section - Date & Time */}
                                <div className="flex-1 mt-2 md:mt-0  ">
                                    <div className="flex flex-col items-start gap-2 text-sm text-gray-600 flex-nowrap">

                                        <div className='flex ml-2'>
                                            <img
                                                className="h-4 w-4 mr-2"
                                                src="https://cdn-icons-png.flaticon.com/128/10691/10691802.png"
                                                alt=""
                                            />

                                            <span>{appointment.appointmentDate}</span>
                                        </div>
                                        <div className='flex'>
                                            <RxStopwatch size={14} className="text-blue-700 mx-2" />

                                            <span className="text-red-400 whitespace-nowrap">
                                                {formatTimeTo12Hour(appointment.bookedSlot?.startAt)}
                                                {" - "}
                                                {formatTimeTo12Hour(appointment.bookedSlot?.endAt)}
                                            </span>
                                        </div>
                                    </div>
                                </div>


                                {/* Right Section - Patient Info & Action */}
                                <div className="flex-1 mt-2 md:mt-0 md:text-right ">
                                    <div className="text-sm text-gray-600">
                                        <p className="text-gray-500 ">
                                            <span className='font-bold capitalize'>{appointment.bookedFor?.name?.split(" ").slice(0, 2).join(" ")}
                                                ({appointment.bookedFor?.age || 'N/A'} {appointment.bookedFor?.gender === "Male" ? 'M' : appointment.bookedFor?.gender === "Female" ? 'F' : "O"})</span>
                                        </p>
                                    </div>
                                </div>

                                {/* Expand/Collapse Icon */}
                                <div className="mt-2 md:mt-0 md:ml-4">
                                    <svg
                                        className={`w-5 h-5 text-gray-400 transform transition-transform ${expandedAppointment === appointment.id ? 'rotate-180' : ''
                                            }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Detailed Information - Accordion Content */}
                        {expandedAppointment === appointment.id && (
                            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Left Column */}
                                    <div className="space-y-4">
                                        {/* Patient Details */}
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-900 mb-2">Patient Details</h4>
                                            <div className="bg-white rounded-lg p-4 border border-gray-200">
                                                <div className="grid grid-cols-2 gap-4 text-sm">
                                                    <div>
                                                        <span className="font-medium text-gray-700">Full Name:</span>
                                                        <p className="text-gray-900">{appointment.bookedFor?.name || 'N/A'}</p>
                                                    </div>
                                                    <div>
                                                        <span className="font-medium text-gray-700">Age:</span>
                                                        <p className="text-gray-900">{appointment.bookedFor?.age || 'N/A'}</p>
                                                    </div>
                                                    <div>
                                                        <span className="font-medium text-gray-700">Gender:</span>
                                                        <p className="text-gray-900">{appointment.bookedFor?.gender || 'N/A'}</p>
                                                    </div>
                                                    <div>
                                                        <span className="font-medium text-gray-700">Booked By:</span>
                                                        <p className="text-gray-900">
                                                            {appointment.bookedFor?.relationship || 'N/A'}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <span className="font-medium text-gray-700">Blood Group:</span>
                                                        <p className="text-gray-900">
                                                            {appointment.bookedFor?.bloodGroup || 'N/A'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Address */}
                                        {appointment.addressForBooking && (
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-900 mb-2">Address</h4>
                                                <div className="bg-white rounded-lg p-4 border border-gray-200">
                                                    <p className="text-sm text-gray-600">
                                                        {appointment.addressForBooking.houseNumber}, {appointment.addressForBooking.street},<br />
                                                        {appointment.addressForBooking.city}, {appointment.addressForBooking.state}
                                                        {appointment.addressForBooking.pincode && ` - ${appointment.addressForBooking.pincode}`}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Right Column */}
                                    <div className="space-y-4">
                                        {/* Packages */}
                                        {appointment.packageList && appointment.packageList.length > 0 && (
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-900 mb-2">
                                                    Packages ({appointment.packageList.length})
                                                </h4>
                                                <div className="space-y-3">
                                                    {appointment.packageList.map((pkg, index) => (
                                                        <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                                                            <div className="flex justify-between items-start">
                                                                <div className="flex-1">
                                                                    <p className="text-sm font-medium text-gray-900">
                                                                        {pkg.packageName}
                                                                    </p>
                                                                    <p className="text-sm text-gray-600 mt-1">
                                                                        ₹{pkg.price} • {pkg.discount}% off
                                                                    </p>
                                                                    <p className="text-xs text-gray-500 mt-1">
                                                                        {pkg.description}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            {pkg.tests && pkg.tests.length > 0 && (
                                                                <div className="mt-3">
                                                                    <p className="text-xs font-medium text-gray-700 mb-2">Tests included:</p>
                                                                    <div className="flex flex-wrap gap-1">
                                                                        {pkg.tests.map((test, testIndex) => (
                                                                            <span
                                                                                key={testIndex}
                                                                                className="inline-block bg-teal-50 text-teal-700 text-xs px-2 py-1 rounded"
                                                                            >
                                                                                {test.testName}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Report Status */}
                                        {appointment.report && (
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-900 mb-2">Report Status</h4>
                                                <div className="bg-white rounded-lg p-4 border border-gray-200">
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <span className="text-sm font-medium text-gray-700">Status:</span>
                                                            {appointment.report.reportUrl && appointment.report.reportUrl !== 'na' ? (
                                                                <span className="ml-2 text-sm text-green-600">Available</span>
                                                            ) : (
                                                                <span className="ml-2 text-sm text-yellow-600">Pending</span>
                                                            )}
                                                        </div>
                                                        {appointment.report.reportUrl && appointment.report.reportUrl !== 'na' ? (
                                                            <a
                                                                href={appointment.report.reportUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                                                            >
                                                                View Report
                                                            </a>
                                                        ) : (
                                                            <span className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white">
                                                                Report Not Ready
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Additional Actions */}
                                <div className="mt-6 pt-4 border-t border-gray-200">
                                    <div className="flex space-x-3">
                                        {/* <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
                                            Contact Patient
                                        </button>
                                        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
                                            Update Status
                                        </button> */}
                                        {appointment.report?.reportUrl && appointment.report.reportUrl !== 'na' && (
                                            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                                                Download Report
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AppointmentsList;