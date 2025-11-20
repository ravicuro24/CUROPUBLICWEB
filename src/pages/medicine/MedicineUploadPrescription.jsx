import React, { useState, useRef, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { FiCamera, FiUpload, FiUser, FiUsers } from "react-icons/fi";
import { useAuth } from "../../Authorization/AuthContext";
import axiosInstance from "../../Authorization/axiosInstance";

const MedicineUploadPrescription = ({ onClose, mode }) => {
    const { userData, latitude, longitude } = useAuth();
    const userId = userData?.id;

    const [file, setFile] = useState(null);
    const [previewModal, setPreviewModal] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    const [familyMembers, setFamilyMembers] = useState([]);
    const [familyModal, setFamilyModal] = useState(false);
    const [selectedFamily, setSelectedFamily] = useState(null);

    const fileInputRef = useRef(null);

    // -------------------------
    // Fetch Family Members
    // -------------------------
    useEffect(() => {
        if (userId && mode !== "normal")
            getAllFamilyMembers(userId);
    }, [userId]);

    const getAllFamilyMembers = async (userId) => {
        try {
            const res = await axiosInstance.get(
                `/endUserEndPoint/getFamilyMembersByEndUserId?endUserId=${userId}`
            );
            console.log("family", res)
            const list = res.data.dtoList || [];
            setFamilyMembers(list);
        } catch (err) {
            console.log("Error loading family:", err);
        }
    };

    // -------------------------
    // File Handlers
    // -------------------------
    const handleFileSelect = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            setFile(selected);
        }
    };

    const openGallery = () => fileInputRef.current?.click();

    const handleDragOver = (e) => {
        e.preventDefault();
        e.currentTarget.classList.add("border-blue-500", "bg-blue-50");
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        if (!file) {
            e.currentTarget.classList.remove("border-blue-500", "bg-blue-50");
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.currentTarget.classList.remove("border-blue-500", "bg-blue-50");

        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && (droppedFile.type.startsWith('image/') || droppedFile.type === 'application/pdf')) {
            setFile(droppedFile);
        } else {
            alert("Please upload only images or PDF files");
        }
    };

    // -------------------------
    // Main Upload Method
    // -------------------------
    const uploadFile = async (actionType) => {
        if (!file) {
            alert("Please select an image first");
            return;
        }

        // "Save" requires user to select family member
        if (actionType === "Save" && !selectedFamily) {
            setFamilyModal(true);
            return;
        }

        const distance = 5000;
        const lat = latitude || 0;
        const lan = longitude || 0;
        const prescriptionFor = "Pharmacy";
        const processFurther = actionType === "Continue";

        let body = {
            uploadedBy: { id: userId },
        };

        if (actionType === "Save" && selectedFamily) {
            body.uploadedFor = { id: selectedFamily?.id };
        }

        const form = new FormData();
        form.append("file", file);
        form.append("body", JSON.stringify(body));

        setIsUploading(true);
        setUploadProgress(0);

        try {
            const res = await axiosInstance.post(
                `/endUserEndPoint/uploadEndUserPrescription/${distance}?lat=${lat}&lan=${lan}&processFurther=${processFurther}&prescriptionFor=${prescriptionFor}`,
                form,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                    onUploadProgress: (e) => {
                        const progress = Math.round((e.loaded * 100) / e.total);
                        setUploadProgress(progress);
                    },
                }
            );

            console.log("Upload successful:", res);

            // Success handling
            setTimeout(() => {
                setFile(null);
                setSelectedFamily(null);
                setUploadProgress(0);
                setIsUploading(false);

                if (onClose) onClose();
            }, 1000);

        } catch (err) {
            console.log("Upload error:", err);
            alert("Upload failed! Please try again.");
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const clearFile = () => {
        setFile(null);
        setSelectedFamily(null);
    };

    const getFileIcon = () => {
        if (file?.type === "application/pdf") {
            return "📄";
        }
        return "🖼️";
    };

    return (
        <div className="p-4 md:p-6 relative w-full  mx-auto ">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800">Upload Prescription</h2>
                    <p className="text-sm text-gray-600 mt-1">Upload your prescription for pharmacy services</p>
                </div>

            </div>

            {/* File Upload Area */}
            <div
                className={`border-2 border-dashed rounded-xl p-4 md:p-8 text-center transition-all duration-300 cursor-pointer
                    ${file
                        ? "border-green-500 bg-green-50"
                        : "border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50"
                    }`}
                onClick={openGallery}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    accept="image/*,.pdf"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileSelect}
                />

                {file ? (
                    <div className="flex flex-col items-center">
                        <div className="text-4xl mb-3">{getFileIcon()}</div>
                        <p className="font-semibold text-gray-800 text-sm md:text-base truncate max-w-full">
                            {file.name}
                        </p>
                        <p className="text-gray-500 text-xs mt-1">
                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                        <div className="flex gap-2 mt-4 flex-wrap justify-center">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setPreviewModal(true);
                                }}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                            >
                                Preview
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    clearFile();
                                }}
                                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
                            >
                                Change File
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center">
                        <div className="bg-blue-100 w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mb-4">
                            <FiUpload size={28} className="text-blue-600" />
                        </div>
                        <p className="font-semibold text-gray-700 text-base md:text-lg mb-2">
                            Drag & Drop or Click to Upload
                        </p>
                        <p className="text-gray-500 text-sm md:text-base">
                            Supports JPG, PNG, PDF (Max: 10MB)
                        </p>
                    </div>
                )}
            </div>

            {/* Selected Family Member */}
            {selectedFamily && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                    <div className="flex items-center">
                        <FiUser className="text-blue-600 mr-2" />
                        <div>
                            <p className="font-medium text-blue-800">{selectedFamily.name}</p>
                            <p className="text-xs text-blue-600 capitalize">{selectedFamily.relationship}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setSelectedFamily(null)}
                        className="text-blue-600 hover:text-blue-800"
                    >
                        <IoClose size={18} />
                    </button>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <button
                    disabled={!file || isUploading}
                    onClick={() => uploadFile("Continue")}
                    className="flex-1 bg-gradient-to-r from-teal-600 to-teal-700 text-white py-3 px-4 rounded-lg font-semibold disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed hover:from-teal-700 hover:to-teal-800 transition-all flex items-center justify-center gap-2"
                >
                    {isUploading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Uploading...
                        </>
                    ) : (
                        <>
                            <FiUpload size={18} />
                            Continue
                        </>
                    )}
                </button>

                {mode !== "normal" && <button
                    disabled={!file || isUploading}
                    onClick={() => uploadFile("Save")}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-semibold disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-center gap-2"
                >
                    <FiUsers size={18} />
                    Save for Family
                </button>}

                <button
                    disabled={!file || isUploading}
                    onClick={clearFile}
                    className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white py-3 px-4 rounded-lg font-semibold disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed hover:from-gray-600 hover:to-gray-700 transition-all"
                >
                    Cancel
                </button>
            </div>

            {/* Upload Progress */}
            {uploadProgress > 0 && (
                <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Uploading...</span>
                        <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-green-500 to-green-600 h-full rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                        ></div>
                    </div>
                </div>
            )}

            {/* Preview Modal */}
            {previewModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-4 md:p-6 rounded-xl w-full max-w-4xl max-h-[90vh] relative">
                        <button
                            className="absolute top-3 right-3 bg-gray-100 hover:bg-gray-200 p-2 rounded-full z-10 transition-colors"
                            onClick={() => setPreviewModal(false)}
                        >
                            <IoClose size={20} />
                        </button>

                        <div className="h-full overflow-auto">
                            {file?.type === "application/pdf" ? (
                                <embed
                                    src={URL.createObjectURL(file)}
                                    type="application/pdf"
                                    className="w-full h-[70vh] rounded-lg"
                                />
                            ) : (
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt="Preview"
                                    className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Family Selection Modal */}
            {familyModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-5 md:p-6 rounded-xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                                <FiUsers size={24} />
                                Select Family Member
                            </h3>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            {familyMembers.length === 0 ? (
                                <div className="text-center py-8">
                                    <FiUsers size={48} className="text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500">No family members found.</p>
                                    <p className="text-sm text-gray-400 mt-1">
                                        Add family members in your profile first.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {familyMembers.map((fm) => (
                                        <div
                                            key={fm.id}
                                            onClick={() => {
                                                setSelectedFamily(fm);
                                                setFamilyModal(false);
                                                setTimeout(() => uploadFile("Save"), 100);
                                            }}
                                            className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition-all group"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium text-gray-800 group-hover:text-blue-700">
                                                        {fm.name}
                                                    </p>
                                                    <p className="text-sm text-gray-500 group-hover:text-blue-600 capitalize">
                                                        {fm.relationship}
                                                    </p>
                                                </div>
                                                <div className="w-2 h-2 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => setFamilyModal(false)}
                            className="mt-4 w-full bg-gray-200 hover:bg-gray-300 py-3 rounded-lg font-medium transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MedicineUploadPrescription;