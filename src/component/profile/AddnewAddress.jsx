// src/component/profile/AddnewAddress.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MdHome, MdClose } from "react-icons/md";
import { FaMapMarkerAlt } from "react-icons/fa";
import { IoBusiness } from "react-icons/io5";
import axiosInstance from "../../Authorization/axiosInstance";
import { useAuth } from "../../Authorization/AuthContext";

const AddNewAddress = ({ onClose, editData }) => {
  const { userData } = useAuth();
  const userId = userData?.id;
  const navigate = useNavigate();
  const location = useLocation();
  const { address } = location.state || {};

  const isEditing = editData || address;

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    mobileNumber: editData?.phoneNumber || address?.phoneNumber || "",
    pincode: editData?.postalCode || address?.postalCode || "",
    houseNo: editData?.houseNumber || address?.houseNumber || "",
    area: editData?.street || address?.street || "",
    city: editData?.city || address?.city || "",
    state: editData?.state || address?.state || "",
    addressType:
      editData?.addressType?.toLowerCase() ||
      address?.addressType?.toLowerCase() ||
      "home",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.houseNo.trim()) newErrors.houseNo = "House/Building No. is required";
    if (!formData.area.trim()) newErrors.area = "Area/Street is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";

    if (!formData.pincode.trim()) newErrors.pincode = "Pincode is required";
    else if (formData.pincode.length !== 6)
      newErrors.pincode = "Pincode must be 6 digits";

    if (!formData.mobileNumber.trim())
      newErrors.mobileNumber = "Mobile number is required";
    else if (formData.mobileNumber.length !== 10)
      newErrors.mobileNumber = "Mobile number must be 10 digits";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ----------------------------------------
      ADD NEW ADDRESS
  ----------------------------------------- */
  const addNewAddress = async () => {
    if (!validate()) return;

    const payload = {
      user: { id: userId },
      phoneNumber: formData.mobileNumber,
      postalCode: formData.pincode,
      houseNumber: formData.houseNo,
      street: formData.area,
      city: formData.city,
      state: formData.state,
    };

    try {
      setLoading(true);

      const endpoint =
        formData.addressType === "home"
          ? "/endUserAddress/addHomeAddress"
          : formData.addressType === "work"
            ? "/endUserAddress/addOfficeAddress"
            : "/endUserAddress/addOtherAddress";

      await axiosInstance.post(endpoint, payload);
      setLoading(false);
      onClose();
    } catch (error) {
      setLoading(false);
      alert("Failed to add address");
    }
  };

  /* ----------------------------------------
      UPDATE ADDRESS
  ----------------------------------------- */
  const updateAddress = async () => {
    if (!validate()) return;

    const idToUpdate = editData?.id || address?.id;

    const payload = {
      user: { id: userId },
      phoneNumber: formData.mobileNumber,
      postalCode: formData.pincode,
      houseNumber: formData.houseNo,
      street: formData.area,
      city: formData.city,
      state: formData.state,
      id: idToUpdate,
    };

    try {
      setLoading(true);
      await axiosInstance.put("/endUserAddress/updateAddressById", payload);
      setLoading(false);
      onClose();
    } catch (error) {
      setLoading(false);
      alert(error.response?.data?.message || "Failed to update address");
    }
  };

  /* ----------------------------------------
      ADDRESS TYPE OPTIONS UI
  ----------------------------------------- */
  const addressTypeOptions = [
    {
      value: "home",
      label: "Home",
      icon: MdHome,
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50",
      activeBorder: "border-green-500",
      borderColor: "border-green-200",
    },
    {
      value: "work",
      label: "Work",
      icon: IoBusiness,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      activeBorder: "border-blue-500",
      borderColor: "border-blue-200",
    },
    {
      value: "other",
      label: "Other",
      icon: FaMapMarkerAlt,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      activeBorder: "border-purple-500",
      borderColor: "border-purple-200",
    },
  ];

  return (
    <div className="mx-auto px-4 w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 border-b border-gray-200">
        <h2 className="text-md md:text-lg font-bold text-gray-900">
          {isEditing ? "Edit Address" : "Add New Address"}
        </h2>

        {onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <MdClose size={24} className="text-gray-500" />
          </button>
        )}
      </div>

      {/* Form Fields */}
      <div className="space-y-1">
        {/* House/Building */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            House/Building No. <span className="text-red-500">*</span>
          </label>

          <input
            type="text"
            value={formData.houseNo}
            onChange={(e) => handleInputChange("houseNo", e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg ${errors.houseNo ? "border-red-300 bg-red-50" : "border-gray-300"
              }`}
          />
          {errors.houseNo && (
            <p className="text-red-500 text-sm mt-1">{errors.houseNo}</p>
          )}
        </div>

        {/* Area */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Area/Street <span className="text-red-500">*</span>
          </label>

          <input
            type="text"
            value={formData.area}
            onChange={(e) => handleInputChange("area", e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg ${errors.area ? "border-red-300 bg-red-50" : "border-gray-300"
              }`}
          />
          {errors.area && (
            <p className="text-red-500 text-sm mt-1">{errors.area}</p>
          )}
        </div>

        {/* CITY / STATE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* city */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              City <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              value={formData.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg ${errors.city ? "border-red-300 bg-red-50" : "border-gray-300"
                }`}
            />
            {errors.city && (
              <p className="text-red-500 text-sm mt-1">{errors.city}</p>
            )}
          </div>

          {/* state */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              State <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              value={formData.state}
              onChange={(e) => handleInputChange("state", e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg ${errors.state ? "border-red-300 bg-red-50" : "border-gray-300"
                }`}
            />
            {errors.state && (
              <p className="text-red-500 text-sm mt-1">{errors.state}</p>
            )}
          </div>
        </div>

        {/* PINCODE / MOBILE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* pincode */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Pincode <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              maxLength={6}
              value={formData.pincode}
              onChange={(e) => handleInputChange("pincode", e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg ${errors.pincode ? "border-red-300 bg-red-50" : "border-gray-300"
                }`}
            />
            {errors.pincode && (
              <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>
            )}
          </div>

          {/* phone */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Mobile Number <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              maxLength={10}
              value={formData.mobileNumber}
              onChange={(e) => handleInputChange("mobileNumber", e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg ${errors.mobileNumber
                ? "border-red-300 bg-red-50"
                : "border-gray-300"
                }`}
            />
            {errors.mobileNumber && (
              <p className="text-red-500 text-sm mt-1">
                {errors.mobileNumber}
              </p>
            )}
          </div>
        </div>

        {/* ADDRESS TYPE */}
        <div>
          <label className="block text-sm font-semibold mb-3">
            Address Type
          </label>

          <div className="grid grid-cols-3 gap-3">
            {addressTypeOptions.map((type) => {
              const Icon = type.icon;
              const isActive = formData.addressType === type.value;

              return (
                <button
                  key={type.value}
                  onClick={() => handleInputChange("addressType", type.value)}
                  className={`flex items-center justify-center p-2 border-2 rounded-xl transition-all ${isActive
                    ? `${type.activeBorder} ${type.bgColor}`
                    : `${type.borderColor} bg-white`
                    }`}
                >
                  <div className="flex items-center space-x-2">
                    <div
                      className={`p-2 rounded-lg bg-gradient-to-r ${type.color} text-white`}
                    >
                      <Icon size={18} />
                    </div>
                    <span className="font-medium">{type.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ACTION BUTTON */}
      <div className="mt-8">
        <button
          disabled={loading}
          onClick={isEditing ? updateAddress : addNewAddress}
          className={`w-full py-2 rounded-xl text-white font-semibold text-lg transition-all ${loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-green-600 to-emerald-600"
            }`}
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>{isEditing ? "Updating..." : "Saving..."}</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <FaMapMarkerAlt size={18} />
              <span>{isEditing ? "Update Address" : "Save Address"}</span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default AddNewAddress;
