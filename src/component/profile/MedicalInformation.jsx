// src/component/profile/MedicalInformation.jsx
// src/component/Profile/MedicalInformation.jsx
import React, { useEffect, useState } from "react";
import { HiPencilSquare } from "react-icons/hi2";

import { FaCheck } from "react-icons/fa";



import { useAuth } from "../../Authorization/AuthContext";
import axiosInstance from "../../Authorization/axiosInstance";
import { IoMdCloseCircle } from "react-icons/io";

const MedicalInformation = () => {
    const { userData } = useAuth();
    const [medicalData, setMedicalData] = useState({
        bloodType: "",
        emergencyContactName: "",
        emergencyContactMobile: "",
    });
    const [originalData, setOriginalData] = useState({});
    const [editingField, setEditingField] = useState(null);
    const [tempValue, setTempValue] = useState("");
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showBloodModal, setShowBloodModal] = useState(false);

    const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

    // Fetch medical data
    const getMedicalData = async () => {
        if (!userData?.id) return;
        try {
            const response = await axiosInstance.get(
                `/endUserEndPoint/getEndUserProfile?id=${userData.id}`
            );
            const dto = response.data.dto;
            const medicalInfo = {
                bloodType: dto.bloodType || "",
                emergencyContactName: dto.emergencyContactName || "",
                emergencyContactMobile: dto.emergencyContactMobile || "",
            };
            setMedicalData(medicalInfo);
            setOriginalData(medicalInfo);
        } catch (error) {
            console.log("Fetch error:", error);
        }
    };

    useEffect(() => {
        getMedicalData();
    }, [userData]);

    // Update API
    const updateMedicalInfoAPI = async (field, value) => {
        if (!userData?.id) return { success: false };
        setIsLoading(true);
        setErrors({});
        try {
            await axiosInstance.put(
                `/endUserEndPoint/updateEndUserProfile?fieldName=${encodeURIComponent(
                    field
                )}&value=${encodeURIComponent(value)}&userId=${userData.id}`
            );
            setMedicalData((prev) => ({ ...prev, [field]: value }));
            setOriginalData((prev) => ({ ...prev, [field]: value }));
            setEditingField(null);
            setTempValue("");
            return { success: true };
        } catch (error) {
            console.log("Update error:", error?.response?.data || error.message);
            const msg =
                error?.response?.data?.message || "Failed to update medical information";
            setErrors({ [field]: msg });
            return { success: false };
        } finally {
            setIsLoading(false);
        }
    };

    const validateField = (field, value) => {
        switch (field) {
            case "emergencyContactName":
                if (!value.trim()) return "Emergency contact name is required";
                if (value.length > 30) return "Name cannot exceed 30 characters";
                if (!/^[a-zA-Z\s]*$/.test(value)) return "Only letters and spaces allowed";
                break;
            case "emergencyContactMobile":
                if (!value.trim()) return "Emergency contact number is required";
                if (!/^\d+$/.test(value)) return "Only numbers allowed";
                if (value.length !== 10) return "Mobile number must be 10 digits";
                break;
            case "bloodType":
                if (!value.trim()) return "Blood type is required";
                break;
            default:
                return "";
        }
        return "";
    };

    const saveEdit = async (field) => {
        setErrors({});
        const error = validateField(field, tempValue);
        if (error) {
            setErrors({ [field]: error });
            return;
        }
        await updateMedicalInfoAPI(field, tempValue);
    };

    const handleBloodTypeSelect = async (type) => {
        setShowBloodModal(false);
        await updateMedicalInfoAPI("bloodType", type);
    };

    const handleFieldEdit = (fieldKey) => {
        if (fieldKey === "bloodType") {
            setShowBloodModal(true);
        } else {
            setEditingField(fieldKey);
            setTempValue(medicalData[fieldKey]);
            setErrors({});
        }
    };

    const handleCancel = (fieldKey) => {
        setEditingField(null);
        setTempValue("");
        setErrors({});
        if (originalData[fieldKey] !== medicalData[fieldKey]) {
            setMedicalData((prev) => ({ ...prev, [fieldKey]: originalData[fieldKey] }));
        }
    };

    const handleFieldChange = (e) => {
        setTempValue(e.target.value);
        if (errors[editingField]) setErrors((prev) => ({ ...prev, [editingField]: "" }));
    };

    const isFieldEditing = (fieldKey) => editingField === fieldKey;
    const hasChanges = (fieldKey) =>
        tempValue !== originalData[fieldKey] && tempValue.trim() !== "";

    const fields = [
        { key: "bloodType", label: "Blood Type", icon: "🩸" },
        { key: "emergencyContactName", label: "Emergency Contact Name", icon: "👤" },
        {
            key: "emergencyContactMobile",
            label: "Emergency Contact Number",
            icon: "📞",
        },
    ];

    const handleDeleteAccount = async (id) => {
        try {
            const response = await axiosInstance.delete(`/endUserEndPoint/updateEndUserProfile?fieldName=heightCM&value=168&userId=${id}`)
            console.log("account deleted", response)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="">


            <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
                {fields.map((field, index) => (
                    <div
                        key={field.key}
                        className={`px-6 py-4 ${index !== fields.length - 1 ? "border-b border-gray-100" : ""
                            }`}
                    >
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <div className="flex items-center mb-1">
                                    <span className="mr-3 bg-green-500/20 p-2 rounded-md">{field.icon}</span>
                                    <span className="text-xs text-gray-500 uppercase tracking-wide">{field.label}</span>
                                </div>

                                {isFieldEditing(field.key) ? (
                                    <div className="mt-2">
                                        <input
                                            type={field.key === "emergencyContactMobile" ? "tel" : "text"}
                                            value={tempValue}
                                            onChange={handleFieldChange}
                                            placeholder={`Enter ${field.label.toLowerCase()}`}
                                            className={`w-full px-4 py-2 border-2 rounded-md ${errors[field.key] ? "border-red-400" : "border-green-400"
                                                }`}
                                            maxLength={
                                                field.key === "emergencyContactName"
                                                    ? 30
                                                    : field.key === "emergencyContactMobile"
                                                        ? 10
                                                        : undefined
                                            }
                                        />
                                        {errors[field.key] && (
                                            <p className="text-red-500 text-sm mt-1">{errors[field.key]}</p>
                                        )}

                                        <div className="flex justify-end mt-4 gap-2">
                                            <button
                                                onClick={() => handleCancel(field.key)}
                                                className="px-4 py-2 border rounded-md bg-white"
                                                disabled={isLoading}
                                            >
                                                <FaCheck size={18} />
                                            </button>
                                            <button
                                                onClick={() => saveEdit(field.key)}
                                                disabled={!hasChanges(field.key) || isLoading || errors[field.key]}
                                                className={`px-4 py-2 bg-green-500 rounded-md text-white flex items-center justify-center ${!hasChanges(field.key) || isLoading || errors[field.key]
                                                    ? "opacity-50"
                                                    : ""
                                                    }`}
                                            >
                                                <FaCheck size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        className="flex justify-between items-center cursor-pointer"
                                        onClick={() => handleFieldEdit(field.key)}
                                    >
                                        <span className="text-sm text-gray-900">
                                            {medicalData[field.key] || `No ${field.label.toLowerCase()} set`}
                                        </span>
                                        <HiPencilSquare size={18} className="text-green-600" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}


            </div>
            <div className="mt-2 flex justify-end">
                <button
                    onClick={() => handleDeleteAccount(userData?.id)}
                    className="bg-red-500 text-white px-4 py-2 cursor-pointer rounded-md hover:bg-red-600">Delete Account</button>
            </div>

            {/* Blood Type Modal */}
            {showBloodModal && (
                <div className="fixed inset-0 flex items-center justify-center backdrop-brightness-50 z-50">
                    <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden relative">
                        <button
                            onClick={() => setShowBloodModal(false)}
                            className="absolute top-4 right-4 p-2"
                        >
                            <IoMdCloseCircle size={24} />
                        </button>

                        <div className="px-6 py-4 bg-green-500 text-white text-center font-bold">
                            Select Blood Type
                        </div>

                        <div className="p-6 flex flex-wrap justify-center gap-3">
                            {bloodTypes.map((type) => (
                                <button
                                    key={type}
                                    className={`w-12 h-12 rounded-md flex items-center justify-center font-bold border-2 ${medicalData.bloodType === type
                                        ? "bg-red-500 border-red-600 text-white"
                                        : "bg-gray-100 border-gray-200 text-gray-700"
                                        }`}
                                    onClick={() => handleBloodTypeSelect(type)}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MedicalInformation;
