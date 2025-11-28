// src/pages/medicine/MedicinePopularCategories.jsx
import React, { useEffect, useState } from 'react'
import axiosInstance from '../../Authorization/axiosInstance'
import { useNavigate } from 'react-router-dom';

function MedicinePopularCategories() {
    const [categoryList, setCategoriesList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showAll, setShowAll] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPopularCategories();
    }, []);

    const fetchPopularCategories = async () => {
        try {
            const response = await axiosInstance.get(`category/getAllCategories`);
            console.log('medicine category:', response);

            setCategoriesList(response.data.categoryList || []);
        } catch (error) {
            console.log("error", error?.response);
            setError("Failed to load categories.");
        } finally {
            setLoading(false);
        }
    };

    // 👉 Show only 10 cards on medium & large screens
    const visibleCategories = showAll ? categoryList : categoryList.slice(0, 10);

    return (
        <div className="">
            {/* Title */}
            <h2 className="md:text-3xl text-xl font-bold text-gray-800 mb-8 text-start">
                Popular Categories
            </h2>

            {error && <p className="text-red-600">{error}</p>}

            {/* Category Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5 transition-all duration-500">
                {visibleCategories.map((item) => (
                    <div
                        key={item.id}
                        onClick={() =>
                            navigate(`/medicine/category/subcategory/product/${item.id}`)
                        }
                        className="relative rounded-md p-3 flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer group hover:scale-105"
                    >
                        {/* Pulsing Border */}
                        <div className="absolute inset-0 rounded-md bg-gradient-to-r from-teal-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 group-hover:animate-pulse"></div>
                        <div className="absolute inset-[2px] rounded-md bg-white -z-10"></div>

                        <img
                            src={
                                item.imageUrl ||
                                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTfAEcls00hkcIVfM7Znr95z3vkKn8K4e2tgAHtAgw3A&s'
                            }
                            alt={item.name}
                            className="h-16 w-full md:h-30 md:w-34 object-cover rounded-md group-hover:scale-110 transition-transform duration-300"
                        />

                        <p className="font-medium mt-2 text-md text-center group-hover:text-teal-600 transition-colors duration-300">
                            {item.name}
                        </p>
                    </div>
                ))}
            </div>

            {/* View More / View Less button only if more than 10 categories */}
            {categoryList.length > 10 && (
                <div className="flex justify-center mt-6">
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className="px-5 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition"
                    >
                        {showAll ? "View Less" : "View More"}
                    </button>
                </div>
            )}

            {!loading && categoryList.length === 0 && (
                <p className="text-gray-500 mt-4">No categories found.</p>
            )}
        </div>
    );
}

export default MedicinePopularCategories;
