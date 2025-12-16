// src/component/familyMedical/PrescriptionDocument.jsx
import React, { useEffect, useState } from "react";
import axiosInstance from "../../Authorization/axiosInstance";
import { useAuth } from "../../Authorization/AuthContext";
import { MdDownload, MdEdit, MdFilterList, MdSort, MdCalendarToday } from "react-icons/md";
import { SlCalender } from "react-icons/sl";
import LoadingAnimation from "../../LoaderSpinner";

function PrescriptionDocument({ data }) {
    const { userData } = useAuth();
    const [prescriptionType, setPrescriptionType] = useState("Pharmacy");
    const [records, setRecords] = useState([]);
    const [filteredRecords, setFilteredRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sortOrder, setSortOrder] = useState("newest");
    const [filterDate, setFilterDate] = useState("");

    // 🔥 NEW STATES for Editing
    const [editId, setEditId] = useState(null);
    const [editTag, setEditTag] = useState("");

    useEffect(() => {
        if (data?.id) {
            getAllFamilyMedicalHistory();
        }
    }, [data, prescriptionType]);

    useEffect(() => {
        applyFilters();
    }, [sortOrder, filterDate, records]);

    const getAllFamilyMedicalHistory = async () => {
        try {
            setLoading(true);
            const payload = {
                uploadedBy: userData?.id,
                uploadedFor: data?.id,
            };

            const response = await axiosInstance.post(
                `/endUserEndPoint/getPrescription?prescriptionType=${prescriptionType}`,
                payload
            );

            const list = Array.isArray(response.data?.prescription)
                ? response.data.prescription
                : [];

            setRecords(list);
        } catch (error) {
            console.log("Error fetching prescriptions:", error.response || error);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let updated = [...records];

        if (filterDate) {
            updated = updated.filter((item) =>
                item.uploadedAt.startsWith(filterDate)
            );
        }

        updated.sort((a, b) => {
            if (sortOrder === "newest") {
                return new Date(b.uploadedAt) - new Date(a.uploadedAt);
            } else {
                return new Date(a.uploadedAt) - new Date(b.uploadedAt);
            }
        });

        setFilteredRecords(updated);
    };

    const downloadFile = (url) => {
        const link = document.createElement("a");
        link.href = url;
        link.download = "prescription";
        link.target = "_blank";
        link.click();
    };

    const getStatusColor = (acceptedAt) => {
        return acceptedAt ? "bg-teal-100 text-teal-800" : "bg-yellow-100 text-yellow-800";
    };

    const getStatusText = (acceptedAt) => {
        return acceptedAt ? "Accepted" : "Pending";
    };



    const handleEditSubmit = async (item) => {
        console.log("Updated Data:", editTag, item);
        // Exit editing mode
        setEditId(null);
        setEditTag("");
        try {
            const response = await axiosInstance.put(
                `/endUserEndPoint/prescriptionTag/${item.id}?tag=${editTag}`
            );
            console.log("update response", response.data);
            await getAllFamilyMedicalHistory()
        } catch (error) {
            console.log("Rename error:", error?.response || error);
            alert("Update failed!");
        }

    }

    return (
        <div className="space-y-6 p-3 md:p-4">

            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="flex flex-col sm:flex-row justify-between gap-4">

                    {/* Text */}
                    <div className="flex-1">
                        <h2 className="text-base md:text-lg font-semibold text-gray-800">
                            Prescription Documents
                        </h2>
                        <p className="text-xs md:text-sm text-gray-600 mt-1">
                            Manage and view all prescription records
                        </p>
                    </div>

                    {/* User card */}
                    <div className="flex items-center gap-3 p-2 bg-teal-50 rounded-lg w-full sm:w-auto">
                        <div className="bg-teal-500 w-10 h-10 md:w-12 md:h-12 rounded-full 
                                flex items-center justify-center text-white 
                                text-base md:text-lg font-semibold">
                            {data?.name?.charAt(0)}
                        </div>

                        <div className="text-sm md:text-base">
                            <p className="font-medium">
                                {data?.name} ({data?.age} {data?.gender?.charAt(0)})
                            </p>
                            <p className="text-gray-600 text-xs md:text-sm">
                                {data?.relationship}
                            </p>
                        </div>
                    </div>

                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">

                    {/* Type */}
                    <div className="flex items-center gap-2">
                        <div className="flex bg-gray-100 rounded-lg p-1">
                            {["Pharmacy", "Laboratory"].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setPrescriptionType(type)}
                                    className={`px-4 py-1.5 rounded-md text-sm cursor-pointer font-medium ${prescriptionType === type
                                        ? "bg-teal-500 text-white"
                                        : "text-gray-600 hover:text-gray-800"
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Sort + Date */}
                    <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">

                        {/* Sort */}
                        <div className="relative w-full sm:w-40">
                            <MdSort className="absolute left-3 top-3 text-gray-400" size={16} />
                            <select
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                                className="pl-10 pr-4 py-2.5 w-full border border-gray-200 rounded-lg text-sm"
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                            </select>
                        </div>

                        {/* Date */}
                        <div className="relative w-full sm:w-40">
                            <MdCalendarToday className="absolute left-3 top-3 text-gray-400" size={16} />
                            <input
                                type="date"
                                value={filterDate}
                                onChange={(e) => setFilterDate(e.target.value)}
                                className="pl-10 pr-4 py-2.5 w-full border border-gray-200 rounded-lg text-sm"
                            />
                        </div>

                    </div>
                </div>
            </div>

            {/* Loader */}
            {loading && (
                <LoadingAnimation />
            )}

            {/* Empty */}
            {!loading && filteredRecords.length === 0 && (
                <div className="text-center py-10 bg-white rounded-xl shadow-sm border border-gray-100">
                    <MdFilterList size={22} className="mx-auto mb-3 text-gray-400" />
                    <h3 className="text-base md:text-lg font-medium text-gray-900 mb-1">
                        Try searching with a different name or upload a prescription.

                    </h3>
                    <p className="text-gray-500 text-sm">
                        {filterDate || prescriptionType !== "Pharmacy"
                            ? "Try adjusting your filters"
                            : "No prescription documents uploaded"}
                    </p>
                </div>
            )}

            {/* Records */}
            {!loading && filteredRecords.length > 0 && (
                <div className="space-y-4">

                    {filteredRecords.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white rounded-lg shadow-sm hover:shadow-md border border-gray-50 
                                                    p-1 md:p-4 flex flex-col md:flex-row justify-between gap-1 md:gap-4 transition-all mt-2"
                        >
                            {/* Left Section */}
                            <div className="flex gap-4 ">
                                {/* Image */}
                                <div className="h-16 w-16 md:h-24 md:w-24 rounded-lg overflow-hidden shadow-sm">
                                    <img
                                        src={item.prescriptionUrl}
                                        alt="Prescription"
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Text */}
                                <div>
                                    {editId === item.id ? (
                                        <input
                                            type="text"
                                            value={editTag}
                                            onChange={(e) => setEditTag(e.target.value)}
                                            className="w-full border rounded-md px-3 py-2 text-sm"
                                        />
                                    ) : (
                                        <p className="font-medium text-gray-800 text-sm md:text-base">
                                            {item.prescriptionTag || "Medicine Document"}
                                        </p>
                                    )}

                                    <p className="text-gray-700 text-xs md:text-sm flex md:mt-2 items-center gap-3">
                                        <span className="flex items-center gap-2 font-semibold">
                                            <SlCalender />
                                            {new Date(item.uploadedAt).toLocaleDateString()}
                                        </span>

                                        <span
                                            className={`px-3 py-1 rounded-full text-[10px] md:text-xs font-semibold 
                                                            ${item.acceptedAt
                                                    ? "bg-teal-100 text-teal-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                                }`}
                                        >
                                            {item.acceptedAt ? "Approved" : "Pending"}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-2 items-center justify-end">
                                {editId === item.id ? (
                                    <>
                                        {/* Submit */}
                                        <button
                                            onClick={() => handleEditSubmit(item)}
                                            className="px-3 py-2 bg-teal-500 hover:bg-teal-600 
                                                            text-white rounded-md text-sm"
                                        >
                                            Submit
                                        </button>

                                        {/* Cancel */}
                                        <button
                                            onClick={() => setEditId(null)}
                                            className="px-3 py-2 bg-red-500 hover:bg-red-600 
                                                            text-white rounded-md text-sm"
                                        >
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <div className=" gap-4 flex">
                                        {/* Edit */}
                                        <button
                                            onClick={() => {
                                                setEditId(item.id);
                                                setEditTag(item.prescriptionTag || "");
                                            }}
                                            className="flex items-center justify-center gap-1 
                                                                bg-teal-500 hover:bg-teal-600 text-white rounded-md  
                                                                p-2 md:px-3 md:py-2 text-sm"
                                        >
                                            <MdEdit className="text-xs md:text-lg" />
                                            <span className="hidden md:inline">Edit</span>
                                        </button>

                                        {/* Download */}
                                        <button
                                            onClick={() => downloadFile(item.prescriptionUrl)}
                                            className="flex items-center justify-center gap-1 
                                                                bg-teal-500 hover:bg-teal-600 text-white rounded-md  
                                                                p-2 md:px-3 md:py-2 text-sm"
                                        >
                                            <MdDownload className="text-xs md:text-lg" />
                                            <span className="hidden md:inline">Download</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

    );
}

export default PrescriptionDocument;
