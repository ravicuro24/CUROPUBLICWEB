// src/component/profile/Profile.jsx
// src/component/Profile.jsx
import React, { useEffect, useState } from "react";
import {
    HiPencilSquare as PencilIcon,
    HiXMark as XMarkIcon,
    HiCheck as CheckIcon,
} from "react-icons/hi2";
import { useAuth } from "../../Authorization/AuthContext";
import axiosInstance from "../../Authorization/axiosInstance";
import MedicalInformation from "./MedicalInformation";
import SavedAddress from "./SavedAddress";

const MyProfile = () => {
    const { userData, setAuthModal, setUserdata } = useAuth();
    const id = userData?.id;

    const [profileData, setProfileData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        mobileNumber: "",
        gender: "",
        age: "",
        weight: "",
        heightCm: "",
        heightFeet: "",
        heightInches: "",
    });

    const [originalData, setOriginalData] = useState({});
    const [editingField, setEditingField] = useState(null);
    const [tempData, setTempData] = useState({});
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    // Modals
    const [showGenderModal, setShowGenderModal] = useState(false);
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [emailInput, setEmailInput] = useState("");
    const [showHeightModal, setShowHeightModal] = useState(false);

    const genderOptions = [
        { label: "Male", value: "Male" },
        { label: "Female", value: "Female" },
        { label: "Other", value: "Other" },
    ];

    const fieldIcons = {
        firstName: "👤",
        lastName: "📝",
        email: "📧",
        mobileNumber: "📱",
        gender: "⚧️",
        age: "🎂",
        weight: "⚖️",
        height: "📏",
    };

    useEffect(() => {
        if (!id) {
            setAuthModal(true);
        } else {
            getUserData();
        }
    }, [id]);

    useEffect(() => {
        if (userData) {
            const newProfile = {
                firstName: userData.firstName || "",
                lastName: userData.lastName || "",
                email: userData.email || "",
                mobileNumber: userData.mobileNumber || "",
                gender: userData.gender || "",
                age: userData.age || "",
                weight: userData.weight || "",
                heightCm: userData.heightCm || "",
                heightFeet: userData.heightFeet || "",
                heightInches: userData.heightInches || "",
            };
            setProfileData(newProfile);
            setOriginalData(newProfile);
        }
    }, [userData]);

    const getUserData = async () => {
        if (!id) return;

        try {
            const response = await axiosInstance.get(
                `/endUserEndPoint/getEndUserProfile?id=${id}`
            );
            setUserdata(response.data.dto);
        } catch (err) {
            console.log("Fetch profile error:", err);
        }
    };

    const updateProfileFieldAPI = async (updatesObj) => {
        if (!id) return;
        setIsLoading(true);
        setErrors({});
        try {
            const updates = Object.entries(updatesObj);
            for (const [field, value] of updates) {
                try {
                    await axiosInstance.put(
                        `/endUserEndPoint/updateEndUserProfile?fieldName=${field}&value=${value}&userId=${id}`
                    );
                    setProfileData((prev) => ({ ...prev, [field]: value }));
                } catch (error) {
                    console.error(`Error updating ${field}:`, error.response?.data || error.message);
                    setErrors((prev) => ({ ...prev, [field]: "Update failed" }));
                }
            }
            await getUserData();
        } catch (err) {
            console.log("Update failed:", err);
            setErrors({ global: "Failed to update" });
        } finally {
            setIsLoading(false);
        }
    };

    const validateName = (value) => {
        if (!value.trim()) return "This field is required";
        if (value.length > 20) return "Max 20 characters allowed";
        if (!/^[a-zA-Z\s]*$/.test(value)) return "Only letters allowed";
        return "";
    };

    const validateField = (field, value) => {
        if (field === "email") {
            if (!value.trim()) return "Email required";
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Invalid email";
        }

        if (field === "age") {
            if (!value.trim()) return "Age required";
            const num = Number(value);
            if (isNaN(num)) return "Numbers only";
            if (num < 1 || num > 120) return "Age between 1–120";
        }

        if (field === "weight") {
            if (!value.trim()) return "Weight required";
            const num = Number(value);
            if (isNaN(num)) return "Numbers only";
            if (num < 1 || num > 300) return "Weight between 1–300 kg";
        }

        return "";
    };

    const saveNameEdit = async () => {
        const err1 = validateName(tempData.firstName || "");
        const err2 = validateName(tempData.lastName || "");

        if (err1 || err2) {
            setErrors({ firstName: err1, lastName: err2 });
            return;
        }

        const updates = {};
        if (tempData.firstName !== originalData.firstName)
            updates.firstName = tempData.firstName;
        if (tempData.lastName !== originalData.lastName)
            updates.lastName = tempData.lastName;

        if (Object.keys(updates).length === 0) {
            alert("No changes detected");
            return;
        }

        await updateProfileFieldAPI(updates);
        setEditingField(null);
    };

    // Function to format height display
    const formatHeightDisplay = () => {
        const feet = profileData.heightFeet || "";
        const inches = profileData.heightInches || "";
        const cm = profileData.heightCm || "";
        
        if (feet && inches) {
            return `${feet} ft ${inches} inch`;
        } else if (cm) {
            return `${cm} cm`;
        }
        return "No height set";
    };

    // Function to save height
    const saveHeight = async () => {
        const feet = tempData.heightFeet || "";
        const inches = tempData.heightInches || "";
        const cm = tempData.heightCm || "";

        // Validate feet and inches
        if (feet || inches) {
            const feetNum = Number(feet);
            const inchesNum = Number(inches);
            
            if (feet && (feetNum < 2 || feetNum > 8)) {
                setErrors({ height: "Feet should be between 2-8" });
                return;
            }
            if (inches && (inchesNum < 0 || inchesNum >= 12)) {
                setErrors({ height: "Inches should be 0-11" });
                return;
            }
        }
        
        // Validate cm
        if (cm) {
            const cmNum = Number(cm);
            if (cmNum < 50 || cmNum > 250) {
                setErrors({ height: "Height should be 50-250 cm" });
                return;
            }
        }

        const updates = {};
        if (feet !== profileData.heightFeet) updates.heightFeet = feet;
        if (inches !== profileData.heightInches) updates.heightInches = inches;
        if (cm !== profileData.heightCm) updates.heightCm = cm;

        if (Object.keys(updates).length > 0) {
            await updateProfileFieldAPI(updates);
        }
        setShowHeightModal(false);
        setErrors({});
    };

    return (
        <div className="container mx-auto min-h-screen ">
            <div className="px-6 py-8">
                {/* HEADER */}
                <div className="mb-4 flex justify-between">
                    <div>
                        <h1 className=" text-sm md:text-md lg:text-xl font-bold text-gray-900">
                            Personal Information
                        </h1>
                        <p className="text-gray-500 mt-2">Your Basic Details</p>
                    </div>

                    <div className=" h-14 w-14  md:h-20 md:w-20 rounded-full bg-green-500/20 flex items-center justify-center">
                        <p className="text-sm md:text-lg font-bold text-green-700">
                            {(profileData.firstName?.[0] || "") +
                                (profileData.lastName?.[0] || "")}
                        </p>
                    </div>
                </div>

                {/* PROFILE CARD */}
                <div className=" gap-4 flex flex-col md:flex-row w-full justify-between items-start">
                    <div className="bg-white w-full md:w-1/2 py-2 rounded-md border border-gray-200 overflow-hidden mb-4">

                        {/* NAME FIELD */}
                        <div className="px-6 py-2 border-b border-gray-100">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3 ">
                                    <span className="text-md bg-green-500/20 p-2 rounded-md">
                                        {fieldIcons.firstName}
                                    </span>

                                    {editingField === "name" ? (
                                        <div className="flex-1">
                                            <input
                                                className={`w-full border-2 text-xs md:text-md rounded-md px-4 py-2 ${errors.firstName ? "border-red-400" : "border-green-400"
                                                    }`}
                                                value={tempData.firstName || ""}
                                                onChange={(e) =>
                                                    setTempData({ ...tempData, firstName: e.target.value })
                                                }
                                                placeholder="Enter first name"
                                            />
                                            <input
                                                className={`w-full border-2 text-xs md:text-md rounded-md px-4 py-2 mt-2 ${errors.lastName ? "border-red-400" : "border-green-400"
                                                    }`}
                                                value={tempData.lastName || ""}
                                                onChange={(e) =>
                                                    setTempData({ ...tempData, lastName: e.target.value })
                                                }
                                                placeholder="Enter last name"
                                            />
                                        </div>
                                    ) : (
                                        <p className="text-gray-900 text-xs md:text-md">
                                            {profileData.firstName} {profileData.lastName}
                                        </p>
                                    )}
                                </div>

                                {editingField === "name" ? (
                                    <div className="flex flex-col gap-2 ml-2">
                                        <button
                                            onClick={() => setEditingField(null)}
                                            className="px-3 py-2 border rounded-md bg-white"
                                        >
                                            <XMarkIcon size={18} />
                                        </button>

                                        <button
                                            onClick={saveNameEdit}
                                            className="px-3 py-2 bg-green-500 rounded-md text-white"
                                        >
                                            <CheckIcon size={18} />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => {
                                            setEditingField("name");
                                            setTempData({
                                                firstName: profileData.firstName,
                                                lastName: profileData.lastName,
                                            });
                                        }}
                                    >
                                        <PencilIcon size={18} className="text-green-600" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* AGE FIELD */}
                        <div className="px-6 py-2 border-b border-gray-100">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center flex-1 gap-3">
                                    <span className="text-xs md:text-md bg-green-500/20 p-2 rounded-md">
                                        {fieldIcons.age}
                                    </span>

                                    {editingField === "age" ? (
                                        <input
                                            className={`border-2 text-xs md:text-md rounded-md px-4  py-2 ${errors.age ? "border-red-400" : "border-green-400"
                                                }`}
                                            value={tempData.age || ""}
                                            onChange={(e) =>
                                                setTempData({ ...tempData, age: e.target.value })
                                            }
                                            placeholder="Enter age"
                                        />
                                    ) : (
                                        <p>{profileData.age || "No age set"}</p>
                                    )}
                                </div>

                                {editingField === "age" ? (
                                    <div className="flex flex-col gap-2 ml-2">
                                        <button
                                            onClick={() => setEditingField(null)}
                                            className="px-3 py-2 border rounded-md"
                                        >
                                            <XMarkIcon size={18} />
                                        </button>

                                        <button
                                            onClick={async () => {
                                                const err = validateField("age", tempData.age || "");
                                                if (err) return setErrors({ age: err });

                                                await updateProfileFieldAPI({ age: tempData.age });
                                                setEditingField(null);
                                            }}
                                            className="px-3 py-2 bg-green-500 text-white rounded-md"
                                        >
                                            <CheckIcon size={18} />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => {
                                            setEditingField("age");
                                            setTempData({ age: profileData.age });
                                        }}
                                    >
                                        <PencilIcon size={18} className="text-green-600" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* WEIGHT FIELD */}
                        <div className="px-6 py-2 border-b border-gray-100">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center flex-1 gap-3">
                                    <span className="text-xs md:text-md bg-green-500/20 p-2 rounded-md">
                                        {fieldIcons.weight}
                                    </span>

                                    {editingField === "weight" ? (
                                        <div className="flex items-center gap-2">
                                            <input
                                                className={`border-2 text-xs md:text-md rounded-md px-4 py-2 w-24 ${errors.weight ? "border-red-400" : "border-green-400"
                                                    }`}
                                                value={tempData.weight || ""}
                                                onChange={(e) =>
                                                    setTempData({ ...tempData, weight: e.target.value })
                                                }
                                                placeholder="Enter weight"
                                            />
                                            <span className="text-gray-500">kg</span>
                                        </div>
                                    ) : (
                                        <p className='text-xs'>{profileData.weight ? `${profileData.weight} kg` : "No weight set"}</p>
                                    )}
                                </div>

                                {editingField === "weight" ? (
                                    <div className="flex flex-col gap-2 ml-2">
                                        <button
                                            onClick={() => setEditingField(null)}
                                            className="px-3 py-2 border rounded-md"
                                        >
                                            <XMarkIcon size={18} />
                                        </button>

                                        <button
                                            onClick={async () => {
                                                const err = validateField("weight", tempData.weight || "");
                                                if (err) return setErrors({ weight: err });

                                                await updateProfileFieldAPI({ weight: tempData.weight });
                                                setEditingField(null);
                                            }}
                                            className="px-3 py-2 bg-green-500 text-white rounded-md"
                                        >
                                            <CheckIcon size={18} />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => {
                                            setEditingField("weight");
                                            setTempData({ weight: profileData.weight });
                                        }}
                                    >
                                        <PencilIcon size={18} className="text-green-600" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* HEIGHT FIELD */}
                        <div className="px-6 py-2 border-b border-gray-100">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center flex-1 gap-3">
                                    <span className="text-xs md:text-md bg-green-500/20 p-2 rounded-md">
                                        {fieldIcons.height}
                                    </span>
                                    <p className="text-gray-900 text-xs md:text-md">
                                        {formatHeightDisplay()}
                                    </p>
                                </div>

                                <button
                                    onClick={() => {
                                        setShowHeightModal(true);
                                        setTempData({
                                            heightFeet: profileData.heightFeet,
                                            heightInches: profileData.heightInches,
                                            heightCm: profileData.heightCm,
                                        });
                                        setErrors({});
                                    }}
                                >
                                    <PencilIcon size={18} className="text-green-600" />
                                </button>
                            </div>
                        </div>

                        {/* EMAIL, GENDER, MOBILE */}
                        {["email", "gender", "mobileNumber"].map((field) => (
                            <div
                                key={field}
                                className="px-6 py-2 border-b border-gray-100 last:border-b-0"
                            >
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <span className="bg-green-500/20 p-2 rounded-md">
                                            {fieldIcons[field]}
                                        </span>
                                        <p className="text-gray-900 text-xs md:text-md">
                                            {profileData[field] || field}
                                        </p>
                                    </div>

                                    {(field === "email" || field === "gender") && (
                                        <button
                                            onClick={() => {
                                                if (field === "gender") setShowGenderModal(true);
                                                if (field === "email") {
                                                    setEmailInput(profileData.email);
                                                    setErrors({});
                                                    setShowEmailModal(true);
                                                }
                                            }}
                                        >
                                            <PencilIcon className="text-green-600" size={18} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="w-full md:w-1/2">
                        <MedicalInformation />
                    </div>
                </div>
            </div>

            {/* GENDER MODAL */}
            {showGenderModal && (
                <div className="fixed inset-0 bg-black/60 flex justify-center items-center">
                    <div className="bg-white w-full max-w-sm rounded-md overflow-hidden relative">
                        <button
                            className="absolute top-4 right-4"
                            onClick={() => setShowGenderModal(false)}
                        >
                            <XMarkIcon size={24} />
                        </button>

                        <div className="bg-green-500 px-6 py-3 text-white text-center font-bold">
                            Select Gender
                        </div>

                        {genderOptions.map((g) => (
                            <button
                                key={g.value}
                                className="w-full text-center py-3 border-b hover:bg-gray-100"
                                onClick={() => {
                                    setShowGenderModal(false);
                                    updateProfileFieldAPI({ gender: g.value });
                                }}
                            >
                                {g.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* EMAIL MODAL */}
            {showEmailModal && (
                <div className="fixed inset-0 bg-black/60 flex justify-center items-center">
                    <div className="bg-white w-full max-w-md p-6 rounded-md relative">
                        <button
                            className="absolute top-2 right-2 bg-red-500 p-1 rounded-full text-white"
                            onClick={() => setShowEmailModal(false)}
                        >
                            <XMarkIcon size={14} />
                        </button>

                        <h2 className="text-lg font-bold mb-3">Update Email</h2>

                        <input
                            className={`w-full border-2 rounded-md px-4 py-2 ${errors.email ? "border-red-400" : "border-gray-300"
                                }`}
                            value={emailInput}
                            onChange={(e) => {
                                setEmailInput(e.target.value);
                                const v = validateField("email", e.target.value);
                                setErrors({ email: v });
                            }}
                            placeholder="Enter your email"
                        />

                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                        )}

                        <button
                            onClick={() => {
                                if (!emailInput.trim() || errors.email) return;
                                updateProfileFieldAPI({ email: emailInput });
                                setShowEmailModal(false);
                            }}
                            className={`w-full mt-4 bg-green-500 text-white py-2 rounded-md ${!emailInput.trim() || errors.email ? "opacity-50" : ""
                                }`}
                            disabled={!emailInput.trim() || errors.email}
                        >
                            Update
                        </button>
                    </div>
                </div>
            )}

            {/* HEIGHT MODAL */}
            {showHeightModal && (
                <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
                    <div className="bg-white w-full max-w-md p-6 rounded-md relative">
                        <button
                            className="absolute top-2 right-2 bg-red-500 p-1 rounded-full text-white"
                            onClick={() => {
                                setShowHeightModal(false);
                                setErrors({});
                            }}
                        >
                            <XMarkIcon size={14} />
                        </button>

                        <h2 className="text-lg font-bold mb-3">Update Height</h2>
                        <p className="text-gray-500 text-sm mb-4">Enter height in either format</p>

                        {/* Feet and Inches Input */}
                        <div className="mb-6">
                            <h3 className="font-medium mb-2">Feet & Inches</h3>
                            <div className="flex items-center gap-3">
                                <div className="flex-1">
                                    <label className="block text-sm text-gray-600 mb-1">Feet</label>
                                    <input
                                        type="number"
                                        min="2"
                                        max="8"
                                        className={`w-full border-2 rounded-md px-4 py-2 ${errors.height ? "border-red-400" : "border-gray-300"
                                            }`}
                                        value={tempData.heightFeet || ""}
                                        onChange={(e) =>
                                            setTempData({ ...tempData, heightFeet: e.target.value })
                                        }
                                        placeholder="e.g., 5"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm text-gray-600 mb-1">Inches</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="11"
                                        className={`w-full border-2 rounded-md px-4 py-2 ${errors.height ? "border-red-400" : "border-gray-300"
                                            }`}
                                        value={tempData.heightInches || ""}
                                        onChange={(e) =>
                                            setTempData({ ...tempData, heightInches: e.target.value })
                                        }
                                        placeholder="e.g., 7"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="relative mb-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">OR</span>
                            </div>
                        </div>

                        {/* Centimeters Input */}
                        <div className="mb-6">
                            <h3 className="font-medium mb-2">Centimeters</h3>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    min="50"
                                    max="250"
                                    className={`w-full border-2 rounded-md px-4 py-2 ${errors.height ? "border-red-400" : "border-gray-300"
                                        }`}
                                    value={tempData.heightCm || ""}
                                    onChange={(e) =>
                                        setTempData({ ...tempData, heightCm: e.target.value })
                                    }
                                    placeholder="e.g., 170"
                                />
                                <span className="text-gray-500 whitespace-nowrap">cm</span>
                            </div>
                        </div>

                        {errors.height && (
                            <p className="text-red-500 text-sm mb-3">{errors.height}</p>
                        )}

                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowHeightModal(false);
                                    setErrors({});
                                }}
                                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveHeight}
                                className="flex-1 bg-green-500 text-white py-2 rounded-md hover:bg-green-600"
                            >
                                Save Height
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyProfile;