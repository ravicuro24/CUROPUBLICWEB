// src/pages/lab/labhome/LabPopularPackages.jsx

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPopularPackages } from '../../../redux/features/labSilice';
import { useAuth } from "../../../Authorization/AuthContext";
import { useNavigate } from 'react-router-dom';

function LabPopularPackages() {
  const [pageSize, setPageSize] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);
  const [distance] = useState(5);

  const dispatch = useDispatch();
  const { latitude, longitude } = useAuth();
  const navigate = useNavigate();

  const { packages, loading } = useSelector((state) => state.packages);

  // 🔥 Run API call when pageSize / location changes
  useEffect(() => {
    if (!latitude || !longitude) return;

    dispatch(
      fetchPopularPackages({
        pageSize,
        pageNumber,
        latitude,
        longitude,
        distance,
      })
    );
  }, [pageSize, pageNumber, latitude, longitude]);

  // 🔥 Increase pageSize by 10 on Load More
  const loadMore = () => {
    setPageSize((prev) => prev + 10);
  };

  return (
    <div className="w-full my-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Popular Lab Packages</h2>
          <p className="text-gray-600 mt-1">Find the best health checkup packages near you</p>
        </div>
      </div>

      {/* LOADING */}
      {loading && packages.length === 0 && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        </div>
      )}

      {/* PACKAGES GRID */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6">
        {packages.map((item, index) => (
          <div
            onClick={() => navigate('/labPackage_details', { state: item })}
            key={index}
            className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-teal-200 overflow-hidden transform hover:-translate-y-1"
          >
            {/* Top Section */}
            <div className="relative">
              <img
                src={item.labPackage.tests[0].imagesUrl[0]}
                alt="Package"
                className="w-full h-32 md:h-36 object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Distance */}
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                <span className="text-xs font-semibold text-gray-700 flex items-center">
                  <svg className="w-3 h-3 mr-1 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  {item.distance.toFixed(1)} km
                </span>
              </div>

              {/* Discount */}
              {item.labPackage.discount > 0 && (
                <div className="absolute top-3 right-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-2 py-1 rounded-full shadow-lg">
                  <span className="text-xs font-bold">{item.labPackage.discount}% OFF</span>
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="p-4">
              {/* Package Title */}
              <h3 className="font-bold text-gray-900 text-sm md:text-base leading-tight line-clamp-2 group-hover:text-teal-700 transition-colors min-h-[2.5rem]">
                {item.labPackage.packageName}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-xs mt-1 line-clamp-2 leading-relaxed">
                {item.labPackage.description}
              </p>

              {/* Price */}
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="text-lg md:text-xl font-bold text-teal-700">
                    ₹{item.labPackage.price}
                  </span>

                  {item.labPackage.originalPrice > item.labPackage.price && (
                    <span className="text-xs text-gray-500 line-through">
                      ₹{item.labPackage.originalPrice}
                    </span>
                  )}
                </div>

                {/* Rating */}
                {item.rating && (
                  <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full">
                    <svg className="w-3 h-3 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-xs font-semibold text-gray-700">{item.rating}</span>
                  </div>
                )}
              </div>

              {/* Features */}
              {item.features?.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {item.features.slice(0, 2).map((feature, idx) => (
                    <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {feature}
                    </span>
                  ))}

                  {item.features.length > 2 && (
                    <span className="text-xs text-gray-500">+{item.features.length - 2} more</span>
                  )}
                </div>
              )}

              {/* Action Button */}
              <button className="mt-4 w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg group-hover:shadow-teal-200">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* LOAD MORE BUTTON */}
      {!loading && packages.length > 0 && (
        <div className="flex justify-center mt-8">
          <button
            onClick={loadMore}
            className="px-8 py-3 bg-white border border-teal-600 text-teal-700 rounded-xl hover:bg-teal-50 hover:border-teal-700 transition-all duration-300 font-semibold shadow-sm hover:shadow-md flex items-center gap-2"
          >
            Load More
          </button>
        </div>
      )}

      {/* PAGINATION LOADING */}
      {loading && packages.length > 0 && (
        <div className="flex justify-center items-center mt-6 py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mr-3"></div>
          <span className="text-gray-600">Loading more packages...</span>
        </div>
      )}

      {/* NO DATA */}
      {!loading && packages.length === 0 && (
        <div className="text-center py-12 text-gray-600">
          No packages found.
        </div>
      )}
    </div>
  );
}

export default LabPopularPackages;
