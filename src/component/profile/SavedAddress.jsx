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
import LoadingAnimation from "../../LoaderSpinner";

const SavedAddress = () => {
    const navigate = useNavigate();
    const { userData } = useAuth();
    const userId = userData?.id;

    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [addAddressModal, setAddaddressModal] = useState(false);
    const [editAddressData, setEditAddressData] = useState(null);

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
                            setEditAddressData(null);
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

            {/* LOADING SPINNER */}
            {loading && (
                <LoadingAnimation />
            )}

            {/* ADDRESS LIST */}
            <div className="p-2">
                {!loading && (
                    <>
                        {addresses.length > 0 ? (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                {/* Desktop Table */}
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="text-left p-4">
                                                    <span className="text-sm font-semibold text-gray-700">Type</span>
                                                </th>
                                                <th className="text-left p-4">
                                                    <span className="text-sm font-semibold text-gray-700">Address Details</span>
                                                </th>
                                                <th className="text-left p-4">
                                                    <span className="text-sm font-semibold text-gray-700">Contact</span>
                                                </th>
                                                <th className="text-left p-4">
                                                    <span className="text-sm font-semibold text-gray-700">Actions</span>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {addresses.map((address) => (
                                                <tr key={address.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-3">
                                                            <div
                                                                className="h-8 w-8 p-2 rounded-lg flex items-center justify-center"
                                                                style={{
                                                                    background: `${getTypeColor(address.addressType)}20`
                                                                }}
                                                            >
                                                                {getTypeIcon(address.addressType)}
                                                            </div>
                                                            <span className="font-medium text-gray-800">{address.addressType}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex items-start gap-3">
                                                            <IoLocationSharp size={18} className="text-red-500 mt-1 flex-shrink-0" />
                                                            <div>
                                                                <p className="font-medium text-gray-800">
                                                                    {address.houseNumber}, {address.street}
                                                                </p>
                                                                <p className="text-gray-600 text-sm mt-1">
                                                                    {address.city}, {address.state} - {address.postalCode}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-3">
                                                            <MdPhone size={16} className="text-gray-500" />
                                                            <span className="text-gray-800">{address.phoneNumber}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => {
                                                                    setEditAddressData(address);
                                                                    setAddaddressModal(true);
                                                                }}
                                                                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 px-3 py-1.5 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                                                            >
                                                                <MdEdit size={14} />
                                                                <span>Edit</span>
                                                            </button>
                                                            <button
                                                                onClick={() => confirmDeleteAddress(address.id)}
                                                                className="flex items-center gap-1 text-red-600 hover:text-red-800 px-3 py-1.5 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                                                            >
                                                                <MdDelete size={14} />
                                                                <span>Delete</span>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile Cards */}
                                <div className="md:hidden space-y-4 p-4">
                                    {addresses.map((address) => (
                                        <div key={address.id} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="h-12 w-12 p-3 rounded-lg flex items-center justify-center"
                                                        style={{
                                                            background: `${getTypeColor(address.addressType)}20`
                                                        }}
                                                    >
                                                        {getTypeIcon(address.addressType)}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-gray-800">{address.addressType}</h3>
                                                        <p className="text-sm text-gray-500 mt-1">{address.city}, {address.state}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-3 mb-4">
                                                <div className="flex gap-3">
                                                    <IoLocationSharp size={18} className="text-red-500 mt-0.5" />
                                                    <div>
                                                        <p className="font-medium text-gray-800">{address.houseNumber}, {address.street}</p>
                                                        <p className="text-sm text-gray-500">{address.postalCode}</p>
                                                    </div>
                                                </div>

                                                <div className="flex gap-3 items-center">
                                                    <MdPhone size={16} className="text-gray-500" />
                                                    <p className="text-gray-800">{address.phoneNumber}</p>
                                                </div>
                                            </div>

                                            <div className="flex gap-2 pt-4 border-t">
                                                <button
                                                    onClick={() => {
                                                        setEditAddressData(address);
                                                        setAddaddressModal(true);
                                                    }}
                                                    className="flex-1 flex items-center justify-center gap-2 text-blue-600 py-2.5 border border-blue-200 rounded-lg hover:bg-blue-50"
                                                >
                                                    <MdEdit size={16} />
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => confirmDeleteAddress(address.id)}
                                                    className="flex-1 flex items-center justify-center gap-2 text-red-600 py-2.5 border border-red-200 rounded-lg hover:bg-red-50"
                                                >
                                                    <MdDelete size={16} />
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
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
                    </>
                )}
            </div>

            {/* ADD / EDIT ADDRESS MODAL */}
            {addAddressModal && (
                <div className="fixed inset-0 backdrop-brightness-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg max-w-5xl w-full  overflow-y-auto p-2 relative">

                        <AddnewAddress
                            onSucess={() => {
                                fetchAddresses();
                                setAddaddressModal(false);
                                setEditAddressData(null);
                            }}
                            onClose={() => {
                                setAddaddressModal(false);
                                setEditAddressData(null);
                            }}
                            editData={editAddressData}
                        />
                    </div>
                </div>
            )}

        </div>
    );
};

export default SavedAddress;
