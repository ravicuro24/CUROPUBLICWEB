// src/pages/doctor/doctorHome/DoctorAllSymtoms.jsx
// src/Screens/DoctorScreen/AllSymptoms.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../Authorization/axiosInstance";
import { useAuth } from "../../../Authorization/AuthContext";

const AllSymptoms = ({ page }) => {
  const navigate = useNavigate();

  const [liveSymptoms, setLiveSymptoms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [perPage, setPerPage] = useState(20);
  const [totalDataCount, setTotalDataCount] = useState(0);

  const { symptomsId, setSymptomsId } = useAuth();

  const fetchSymptoms = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/doctor/symptom?pageNo=1&perPage=${perPage}&sortField=createdAt&sortingType=desc`
      );
      setLiveSymptoms(response.data?.data || []);
      setTotalDataCount(response.data?.totalDataCount || 0);
    } catch (error) {
      console.error("Error fetching symptoms:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSymptoms();
  }, [perPage]);

  const skeletonArray = Array(5).fill(0);

  const getBackgroundColor = (isGeneral) =>
    isGeneral ? "#E3F2FD" : "#FFEBEE";

  // 🔹 CLICK HANDLER
  const handleSymptomClick = (item) => {
    if (page === "quickConsult") {
      // ✅ SAVE ID + NAME (MULTI SELECT)
      setSymptomsId((prev = []) => {
        const exists = prev.some((sym) => sym.id === item.id);

        if (exists) {
          return prev.filter((sym) => sym.id !== item.id);
        }

        return [...prev, { id: item.id, name: item.name }];
      });
    } else {
      // ✅ NORMAL FLOW
      setSymptomsId(item.id);
      navigate("/doctor/allDoctor", {
        state: { searchTextId: item.id },
      });
    }
  };

  // 🔹 CHECK SELECTED
  const isSelected = (id) =>
    page === "quickConsult" &&
    Array.isArray(symptomsId) &&
    symptomsId.some((sym) => sym.id === id);

  return (
    <div className="container mx-auto">
      <h2 className="text-xl font-bold text-gray-900 mb-2">
        Not sure whom to consult?
      </h2>

      <h3 className="text-md font-bold text-gray-900 mb-4">
        Search by Symptoms
      </h3>

      <div className="flex overflow-x-auto gap-8 mt-2 no-scrollbar">
        {/* 🔹 SKELETON */}
        {loading &&
          skeletonArray.map((_, index) => (
            <div
              key={index}
              className="flex flex-col items-center px-7 py-2 rounded-md bg-gray-200 min-w-[120px]"
            >
              <div className="w-8 h-8 bg-gray-300 rounded-full mb-2 animate-pulse" />
              <div className="w-12 h-3 bg-gray-300 rounded animate-pulse" />
            </div>
          ))}

        {/* 🔹 SYMPTOMS LIST */}
        {!loading &&
          liveSymptoms.map((item) => (
            <div
              key={item.id}
              onClick={() => handleSymptomClick(item)}
              style={{ backgroundColor: getBackgroundColor(item.isGeneral) }}
              className={`cursor-pointer flex flex-col items-center px-8 py-2
                rounded-md min-w-[150px] border
                ${
                  isSelected(item.id)
                    ? "border-teal-600 ring-2 ring-teal-400"
                    : "border-transparent"
                }`}
            >
              <img
                src={
                  item.imageUrl ||
                  "https://cdn-icons-png.flaticon.com/128/2853/2853863.png"
                }
                alt={item.name}
                className="h-10 w-10 rounded-full object-contain mb-1"
              />

              <p className="text-gray-800 text-[12px] capitalize font-medium text-center">
                {item.name}
              </p>
            </div>
          ))}

        {/* 🔹 VIEW MORE */}
        <button
          onClick={() => setPerPage(perPage + 10)}
          className="flex items-center px-4 py-2 underline text-gray-700 whitespace-nowrap"
        >
          View More
        </button>
      </div>
    </div>
  );
};

export default AllSymptoms;
