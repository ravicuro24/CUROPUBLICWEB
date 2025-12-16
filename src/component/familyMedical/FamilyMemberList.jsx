// src/component/familyMedical/FamilyMemberList.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEdit } from "react-icons/fa";
import { MdDeleteOutline, MdSearch, MdNavigateNext } from "react-icons/md";
import axiosInstance from "../../Authorization/axiosInstance";
import { useAuth } from "../../Authorization/AuthContext";
import PrescriptionDocument from "./PrescriptionDocument";
import OtherFamily from "./OtherFamily";
import AddNewFamily from "./AddNewFamily";
import Swal from "sweetalert2";

const FamilyMemeberList = () => {
    const { userData } = useAuth();
    const id = userData?.id;
    const [addFamilyModal, setAddNewFamilyModal] = useState(false)
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState("");
    const [familyMembers, setFamilyMembers] = useState([]);
    const [selectedMember, setSelectedMember] = useState(null);
    const [existingMember, setExistingMember] = useState(null)

    // NEW STATE FOR TOGGLING THE SCREEN
    const [showOtherHistory, setShowOtherHistory] = useState(false);

    useEffect(() => {
        getAllFamilyMember();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }, [id]);

    const getAllFamilyMember = async () => {
        try {
            const response = await axiosInstance.get(
                `/endUserEndPoint/getFamilyMembersByEndUserId?endUserId=${id}`
            );

            const list = response?.data?.dtoList.reverse() || [];
            setFamilyMembers(list);

            // Auto-select first member
            if (list.length > 0) {
                setSelectedMember(list[0]);
            }
        } catch (error) {
            console.log("Fetch error:", error);
        }
    };

    const handleEdit = (item) => {
        setAddNewFamilyModal(true)
        setExistingMember(item)
    }

    const handleDelete = async (item) => {
        Swal.fire({
            title: "Are you sure?",
            text: `Do you really want to delete ${item.name}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axiosInstance.delete(
                        `/endUserEndPoint/deleteFamilyMemberById?memberId=${item.id}`
                    );

                    Swal.fire({
                        icon: "success",
                        title: "Deleted!",
                        text: "Family member has been deleted successfully.",
                        timer: 1200,
                        showConfirmButton: false,
                    });

                    getAllFamilyMember();
                } catch (err) {
                    console.log(err);
                    Swal.fire({
                        icon: "error",
                        title: "Error!",
                        text: "Something went wrong while deleting.",
                    });
                }
            }
        });
    };

    const filteredMembers = (familyMembers ?? []).filter(m =>
        ((m?.name ?? "") + " " + (m?.relation ?? m?.relationship ?? ""))
            .toLowerCase()
            .includes((searchText ?? "").toLowerCase().trim())
    );

    return (
        <div className="w-full min-h-screen bg-white p-4">
            {showOtherHistory ? (
                <div className="">
                    <button
                        onClick={() => setShowOtherHistory(false)}
                        className="text-teal-600 underline mb-4"
                    >
                        ← Back
                    </button>

                    <OtherFamily onBack={() => setShowOtherHistory(false)} />
                </div>
            ) : (
                <>

                    <div className="flex flex-col lg:flex-row gap-4">

                        {/* LEFT SIDE — FAMILY MEMBERS */}
                        <div className="w-full lg:w-1/2">

                            {/* Search */}
                            <div className="bg-gray-100 rounded-lg px-4 py-2 flex items-center mt-4">
                                <MdSearch size={22} className="text-gray-500 mr-3" />
                                <input
                                    className="flex-1 bg-transparent outline-none border-0 text-gray-800"
                                    placeholder="Search Family Name or Relation"
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                />
                                {searchText && (
                                    <button onClick={() => setSearchText("")}>
                                        <MdDeleteOutline size={20} className="text-gray-500" />
                                    </button>
                                )}
                            </div>

                            {/* Member List */}
                            <div className="border border-gray-200 rounded-lg mt-4 p-5 max-h-[70vh] overflow-y-auto hide-scrollbar">

                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-sm md:text-lg font-semibold text-gray-700">
                                        Family Members ({filteredMembers.length})
                                    </h2>

                                    {/* Mobile: + Family */}
                                    <button
                                        onClick={() => setAddNewFamilyModal(true)}
                                        className="bg-teal-500 text-white px-1 text-xs py-1 rounded-md md:hidden">
                                        + Family
                                    </button>

                                    {/* Desktop: Add New Family */}
                                    <button
                                        onClick={() => setAddNewFamilyModal(true)}
                                        className="bg-teal-500 text-white px-3 py-1 rounded-md hidden md:block">
                                        Add New Family
                                    </button>
                                </div>

                                {filteredMembers.map((item) => (
                                    <div
                                        key={item.id}
                                        onClick={() => setSelectedMember(item)}
                                        className={`flex items-center justify-between px-3 py-4 mb-3 rounded-xl shadow-md cursor-pointer
                                        ${selectedMember?.id === item.id ? "bg-teal-50" : "bg-white"}`}
                                    >
                                        {/* Left Side */}
                                        <div className="flex items-center gap-4">
                                            <div className="h-8 w-8 md:h-12 md:w-12 bg-teal-100 rounded-full flex items-center justify-center">
                                                <FaUser className="text-teal-700 text-sm md:text-lg" />
                                            </div>

                                            <div>
                                                <p className="text-[10px] md:text-[14px] font-semibold text-gray-900 capitalize">
                                                    {item.name}
                                                    <span className="text-gray-500"> ({item.relationship})</span>
                                                </p>

                                                <p className="text-[10px] md:text-sm text-gray-600 mt-1">
                                                    {item.gender} — {item.age} Years • {item.relation}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Edit & Delete */}
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => handleEdit(item)}
                                                className="p-2 rounded-full hover:bg-gray-100"
                                            >
                                                <FaEdit className="text-gray-600 text-xs md:text-lg" />
                                            </button>

                                            <button
                                                onClick={() => handleDelete(item)}
                                                className="p-2 rounded-full hover:bg-gray-100"
                                            >
                                                <MdDeleteOutline className="text-red-500 text-lg" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT SIDE — PRESCRIPTION DOCUMENT */}
                        <div className="w-full lg:w-1/2">
                            {selectedMember ? (
                                <PrescriptionDocument data={selectedMember} />
                            ) : (
                                <div className="text-center border rounded-xl p-6 mt-6 lg:mt-0 shadow-sm bg-gray-50">
                                    <p className="text-gray-500">
                                        Select a family member to view prescriptions
                                    </p>
                                </div>
                            )}
                        </div>

                    </div>

                    <div className="mt-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">
                            Health Records
                        </h2>

                        <div
                            onClick={() => setShowOtherHistory(true)}
                            className="bg-white flex items-center border rounded-lg p-4 mb-3 shadow cursor-pointer"
                        >
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <MdNavigateNext size={24} className="text-red-500" />
                            </div>

                            <div className="ml-4 flex-1">
                                <p className="font-semibold text-gray-800 mb-1">Other History</p>
                                <p className="text-gray-500 text-sm">
                                    View and manage family health records.
                                </p>
                            </div>

                            <MdNavigateNext size={24} className="text-gray-500" />
                        </div>
                    </div>
                </>
            )}
            {addFamilyModal && (
                <div className="fixed inset-0 backdrop-brightness-50 flex justify-center items-center z-50">

                    {/* Modal Box */}
                    <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-md shadow-lg relative overflow-y-auto">

                        {/* Header */}
                        {/* <div className="flex justify-between items-center py-3 px-4 bg-teal-200 rounded-t-md">
                            <p className="font-semibold text-gray-800"></p>

                            <button
                                onClick={() => setAddNewFamilyModal(false)}
                                className="text-gray-600 hover:text-black text-xl"
                            >
                                ×
                            </button>
                        </div> */}

                        {/* Content */}
                        <div className="p-4">
                            <AddNewFamily onClose={() => setAddNewFamilyModal(false)} onSuccess={() => getAllFamilyMember()} existingMember={existingMember} />
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
};

export default FamilyMemeberList;
