// src/pages/medicine/MedicinePopularCategories.jsx
import React, { useEffect, useState } from 'react'
import axiosInstance from '../../Authorization/axiosInstance'
import { useNavigate } from 'react-router-dom';

function MedicinePopularCategories() {
    const [categoryList, setCategoriesList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate()

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

    return (
        <div className="">

            {/* Title */}
            <h2 className="text-xl font-semibold mb-4">Popular Categories</h2>

            {loading && <p className="text-gray-500">Loading categories...</p>}
            {error && <p className="text-red-600">{error}</p>}

            {/* ✅ FIXED: Map the list */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {categoryList.map((item) => (
                    <div
                        key={item.id}
                        onClick={() => navigate(`/medicine/category/subcategory/product/${item.id}`)}
                        className="shadow-md bg-white hover:shadow-2xl rounded-md p-3 flex flex-col items-center justify-center text-center transition cursor-pointer"
                    >
                        <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="h-16 w-full md:h-24 md:w-full object-cover rounded-md"
                        />

                        <p className="font-medium mt-2 text-sm">
                            {item.name}
                        </p>
                    </div>

                ))}
            </div>

            {!loading && categoryList.length === 0 && (
                <p className="text-gray-500 mt-4">No categories found.</p>
            )}
        </div>
    );
}

export default MedicinePopularCategories;
