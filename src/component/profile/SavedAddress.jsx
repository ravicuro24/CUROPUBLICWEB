// src/component/profile/SavedAddress.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    MdHome, MdWork, MdPhone, MdDelete, MdEdit
} from "react-icons/md";
import { FaBriefcase, FaMapMarkerAlt } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
import axiosInstance from "../../Authorization/axiosInstance";
import { useAuth } from "../../Authorization/AuthContext";
import AddnewAddress from "./AddnewAddress";
import Swal from "sweetalert2";

const SavedAddress = () => {
    const navigate = useNavigate();
    const { userData } = useAuth();
    const userId = userData?.id;

    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [addAddressModal, setAddaddressModal] = useState(false);
    const [editAddressData, setEditAddressData] = useState(null);

    // ─────────────────────────────────────────
    // COLORS
    const getTypeColor = (type) => {
        switch (type) {
            case "Home": return "#3B82F6";
            case "Work": return "#10B981";
            case "Other": return "#8B5CF6";
            default: return "#6B7280";
        }
    };

    // ICONS
    const getTypeIcon = (type) => {
        switch (type) {
            case "Home":
                return <MdHome size={22} color={getTypeColor(type)} />;
            case "Work":
                return <FaBriefcase size={22} color={getTypeColor(type)} />;
            case "Other":
                return <FaMapMarkerAlt size={22} color={getTypeColor(type)} />;
            default:
                return <FaMapMarkerAlt size={22} color={getTypeColor(type)} />;
        }
    };

    // ─────────────────────────────────────────
    // FETCH ADDRESSES
    const fetchAddresses = async () => {
        if (!userId) return;

        try {
            setLoading(true);
            const res = await axiosInstance.get(
                `/endUserAddress/getAddressByUserId/${userId}`
            );

            const list = Array.isArray(res?.data?.dto)
                ? [...res.data.dto].reverse()
                : [];

            setAddresses(list);
        } catch (error) {
            console.log(error);
            setAddresses([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, [userId]);

    // ─────────────────────────────────────────
    // DELETE ADDRESS
    const confirmDeleteAddress = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This address will be permanently deleted.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axiosInstance.delete(
                        `/endUserAddress/deleteAddressById/${id}`
                    );

                    Swal.fire({
                        title: "Deleted!",
                        text: "Address has been deleted successfully.",
                        icon: "success",
                        timer: 1500,
                        showConfirmButton: false,
                    });

                    fetchAddresses();
                } catch (error) {
                    Swal.fire({
                        title: "Failed!",
                        text: "Something went wrong. Please try again.",
                        icon: "error",
                    });
                }
            }
        });
    };

    return (
        <div>
            {/* Header */}
            <div className="py-4 flex justify-between items-center">
                <div>
                    <h1 className="text-sm md:text-xl font-bold text-gray-800">
                        Saved Addresses
                    </h1>
                    <p className="text-gray-500 text-sm hidden md:block">
                        Manage your delivery addresses
                    </p>
                </div>

                <div className="flex gap-4 items-center">
                    <button
                        onClick={() => {
                            setEditAddressData(null); // reset edit mode
                            setAddaddressModal(true);
                        }}
                        className="bg-green-200 cursor-pointer py-1 px-2 md:px-4 text-[10px] md:text-sm rounded-full hover:bg-green-300 text-green-800 flex items-center gap-2"
                    >
                        Add New Address
                    </button>

                    <div className="bg-green-200 px-2 md:px-4 py-1 md:py-2 text-[10px] md:text-sm rounded-full font-semibold text-green-800">
                        {addresses.length} {addresses.length === 1 ? "Address" : "Addresses"}
                    </div>
                </div>
            </div>

            {/* ADDRESS LIST */}
            <div className="p-2">
                {addresses.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">

                        {addresses.map((address) => (
                            <div key={address.id}
                                className="bg-white rounded-lg shadow-md border border-gray-200 p-2 flex flex-col justify-between h-[260px]"
                            >
                                {/* Card Header */}
                                <div className="flex justify-between items-center p-2">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="h-10 w-10 p-2 rounded-md flex items-center justify-center"
                                            style={{
                                                background: `${getTypeColor(address.addressType)}20`
                                            }}
                                        >
                                            {getTypeIcon(address.addressType)}
                                        </div>
                                        <h2 className="text-sm font-semibold">
                                            {address.addressType}
                                        </h2>
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="p-2 space-y-2">
                                    <div className="flex gap-3">
                                        <IoLocationSharp size={20} className="text-red-500 mt-1" />
                                        <div>
                                            <p className="font-medium text-gray-800 text-sm">
                                                {address.houseNumber}, {address.street}
                                            </p>
                                            <p className="text-gray-600 text-xs">
                                                {address.city}, {address.state} - {address.postalCode}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 items-center">
                                        <MdPhone size={18} className="text-gray-500" />
                                        <p className="text-gray-600 text-sm">
                                            {address.phoneNumber}
                                        </p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex justify-between pt-2 border-t mt-auto">
                                    <button
                                        onClick={() => {
                                            setEditAddressData(address);
                                            setAddaddressModal(true);
                                        }}
                                        className="flex items-center gap-2 text-blue-600 text-sm"
                                    >
                                        <MdEdit size={16} />
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => confirmDeleteAddress(address.id)}
                                        className="flex items-center gap-2 text-red-600 text-sm"
                                    >
                                        <MdDelete size={16} />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}

                    </div>
                ) : (
                    <div className="flex flex-col items-center mt-20">
                        <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center">
                            <FaMapMarkerAlt size={45} className="text-purple-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mt-4">
                            No Address Found!
                        </h3>
                    </div>
                )}
            </div>

            {/* ADD / EDIT ADDRESS MODAL */}
            {addAddressModal && (
                <div className="fixed inset-0 backdrop-brightness-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg max-w-5xl w-full h-[90vh] overflow-y-auto p-2 relative">

                        <AddnewAddress
                            onClose={() => {
                                fetchAddresses();
                                setAddaddressModal(false);
                                setEditAddressData(null);
                            }}
                            editData={editAddressData} // **THIS IS THE MAIN POINT**
                        />
                    </div>
                </div>
            )}

        </div>
    );
};

export default SavedAddress;
