// src/pages/medicine/MedicneSUbcategoryProduct.jsx
// src/pages/medicine/MedicneSubcategoryProduct.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../Authorization/axiosInstance";
import MedicineProductBySubCategory from "./MedicineProductBySubCategory";
import { useAuth } from "../../Authorization/AuthContext";
import SimilarMedicineProduct from "./SimilarMedicineProduct";

function MedicneSubcategoryProduct() {
    const { id } = useParams(); // category ID
    const { latitude, longitude } = useAuth();
    const [fetching, setFetching] = useState(false)

    const [subcategories, setSubcategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [distance] = useState(1200);
    const [productList, setProductList] = useState([]);
    const [subCatName, setSubCatName] = useState("");
    const [activeIndex, setActiveIndex] = useState(0);

    // Fetch categories on mount
    useEffect(() => {
        if (id) fetchSubcategories();
        window.scrollTo(0, 0)
    }, [id]);

    // 👉 Fetch products by selected subcategory
    const getProductBySubCategory = async (item, index) => {
        setActiveIndex(index);
        setSubCatName(item.subCatname);
        setFetching(true)

        try {
            const response = await axiosInstance.get(
                `product/getProductBySubCategoryId?lat=${latitude}&lng=${longitude}&distance=${distance}&subCatId=${item.subCatid}`
            );

            setProductList(response.data.dtoList || []);
            setFetching(false)
        } catch (error) {
            console.log(error);
            setFetching(false)
        }
    };

    // 👉 Fetch Subcategories
    const fetchSubcategories = async () => {
        try {
            const response = await axiosInstance.get(`/category/get/subcategories/${id}`);
            const list = response.data || [];

            setSubcategories(list);

            // 👉 Automatically select & fetch product for 0th subcategory
            if (list.length > 0) {
                console.log("Default selected subCatId:", list[0].subCatid);
                getProductBySubCategory(list[0], 0);   // AUTO PASS 0th index subCatid
            }
        } catch (error) {
            console.log(error);
            setError("Failed to load subcategories");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full md:container mx-auto mb-2">
            {/* Loading */}
            {loading && <p className="text-gray-500">Loading...</p>}

            {/* Error */}
            {error && <p className="text-red-500">{error}</p>}

            {/* Selected Subcategory Name */}
            <div className="border-b border-gray-200 py-3">
                <p className="text-center capitalize font-bold">{`${subCatName}`}</p>
            </div>

            <div className="flex flex-row justify-start items-start p-1 gap-4">

                {/* Subcategory List */}
                <div className="grid grid-cols-1 gap-4">
                    {subcategories.map((item, index) => (
                        <div
                            key={item.subCatid}
                            onClick={() => getProductBySubCategory(item, index)}
                            className={`border rounded-md p-3 flex flex-col items-center cursor-pointer transition ${activeIndex === index
                                ? "bg-green-100 border-green-500 shadow-md"
                                : "bg-white border-gray-200 hover:shadow-md"
                                }`}
                        >
                            <img
                                src={item.imageUrl}
                                alt={item.subCatname}
                                className="h-8 md:h-20 md:w-20 object-cover rounded-md"
                            />

                            <p className="mt-2 text-center text-xs md:text-sm md:font-medium">
                                {window.innerWidth < 640
                                    ? item.subCatname.slice(0, 10) +
                                    (item.subCatname.length > 10 ? "..." : "")
                                    : item.subCatname}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Product List */}
                <div className="">
                    <MedicineProductBySubCategory productList={productList} loading={fetching} />
                </div>

            </div>


            {/* No Data */}
            {!loading && subcategories.length === 0 && (
                <p className="text-gray-500 mt-4">No subcategories found.</p>
            )}
            <SimilarMedicineProduct name={subCatName ?? "Headache"} />

        </div>
    );
}

export default MedicneSubcategoryProduct;
