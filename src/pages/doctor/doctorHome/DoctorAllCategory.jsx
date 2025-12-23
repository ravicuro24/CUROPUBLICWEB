// src/pages/doctor/doctorHome/DoctorAllCategory.jsx
// src/Screens/DoctorScreen/AllCategory.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../Authorization/axiosInstance";
import { useAuth } from "../../../Authorization/AuthContext";

// Soft pastel colors
const colors = [
  "#FFEBEE", "#E3F2FD", "#E8F5E9", "#FFF3E0", "#F3E5F5",
  "#E0F2F1", "#FCE4EC", "#EDE7F6", "#FFFDE7", "#E1F5FE",
  "#E8EAF6", "#FFEBF0", "#E6F7FF", "#F9FBE7", "#E0F7FA"
];

// 🔹 Skeleton Card
const CategorySkeleton = () => (
  <div className="px-4 py-3 mr-3 rounded-xl border border-gray-200 shadow-sm w-40 min-w-[160px] animate-pulse">
    <div className="h-14 w-14 bg-gray-300 rounded-full mx-auto mb-3"></div>
    <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
  </div>
);

const AllCategory = ({ page }) => {
  const [allDoctorCategories, setAllDoctorCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageNo] = useState(1);
  const [perPage, setPerPage] = useState(20);

  const {
    specializationId,
    setSpecializationId,
    setSymptomsId,
  } = useAuth();

  const navigate = useNavigate();

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/doctor/specializationDetail?pageNo=${pageNo}&perPage=${perPage}&sortField=createdAt&sortingType=desc`
      );
      setAllDoctorCategories(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, [perPage]);

  // 🔹 CLICK HANDLER
  const handleCategoryClick = (item) => {
    if (page === "quickConsult") {
      // ✅ SAVE ID + NAME (MULTI SELECT)
      setSpecializationId((prev = []) => {
        const exists = prev.some((cat) => cat.id === item.id);

        if (exists) {
          return prev.filter((cat) => cat.id !== item.id);
        }

        return [...prev, { id: item.id, name: item.name }];
      });
    } else {
      // ✅ NORMAL FLOW
      setSymptomsId(item.id);
      navigate("/doctor/allDoctor", {
        state: { searchTextCatId: item.id },
      });
    }
  };

  // 🔹 CHECK SELECTED
  const isSelected = (id) =>
    page === "quickConsult" &&
    Array.isArray(specializationId) &&
    specializationId.some((cat) => cat.id === id);

  return (
    <div className="container mx-auto">
      <h2 className="text-md font-bold text-gray-900 mb-3">Categories</h2>

      <div className="flex overflow-x-auto no-scrollbar">
        {/* 🔹 SKELETON */}
        {loading &&
          Array.from({ length: 6 }).map((_, index) => (
            <CategorySkeleton key={index} />
          ))}

        {/* 🔹 CATEGORY LIST */}
        {!loading &&
          allDoctorCategories.map((item, index) => (
            <div
              key={item.id}
              onClick={() => handleCategoryClick(item)}
              style={{ backgroundColor: colors[index % colors.length] }}
              className={`cursor-pointer px-4 py-3 mr-3 rounded-xl border shadow-sm
                flex flex-col items-center w-40 min-w-[160px]
                ${
                  isSelected(item.id)
                    ? "border-teal-600 ring-2 ring-teal-400"
                    : "border-gray-200"
                }`}
            >
              <img
                src={
                  item.imageUrl ||
                  "https://cdn-icons-png.flaticon.com/128/387/387561.png"
                }
                alt={item.name}
                className="h-14 w-14 rounded-full object-cover mb-2"
              />

              <p className="text-gray-800 font-medium text-center capitalize">
                {item.name}
              </p>
            </div>
          ))}

        {/* 🔹 VIEW MORE */}
        {!loading && (
          <button
            onClick={() => setPerPage(perPage + 10)}
            className="ml-2 underline text-gray-700 whitespace-nowrap self-center"
          >
            View More
          </button>
        )}
      </div>
    </div>
  );
};

export default AllCategory;
