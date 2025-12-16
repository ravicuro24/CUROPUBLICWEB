// src/pages/medicine/ShopByHealthConcernMedicne.jsx

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../Authorization/axiosInstance";
import { toast } from 'react-toastify';
import { useAuth } from "../../Authorization/AuthContext";
import SimilarMedicineProduct from "./SimilarMedicineProduct";
import LoadingAnimation from "../../LoaderSpinner";

const ShopByHealthConcernMedicne = () => {
    const { name } = useParams();
    const { userData, getAllMedicineCartItems, allmedicineIncart, setAuthModal } = useAuth();
    const userId = userData?.id;
    const [searchtext, setSearchtext] = useState(name);
    const [pageNum, setPageNum] = useState(1);
    const [pageSize] = useState(12);
    const [loading, setLoading] = useState(false);
    const [medicines, setMedicines] = useState([]);
    const [addingCartId, setAddingCartId] = useState(null);
    const [totalPages, setTotalPages] = useState(0);
    const navigate = useNavigate();
    const [search, setSearch] = useState(false);

    useEffect(() => {
        getShopMedication();
        window.scrollTo(0, 0);
    }, [name, pageNum]);

    const getShopMedication = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(
                `/endUserEndPoint/getMedicineByPrescribedFor?prescribedFor=${searchtext}&page=${pageNum}&size=${pageSize}`
            );
            const data = response.data?.dtoList || {};
            console.log("Medicines data:", data);
            setMedicines(data.content || []);
            setTotalPages(data.totalPages || 0);
        } catch (error) {
            console.error("Error fetching medicines:", error.response || error);
            toast.error("Failed to load medicines");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        setSearch(true)
        e.preventDefault();
        setPageNum(1);
        getShopMedication();
    };

    const handleAddtocart = async (item) => {
        if (!userId) {
            setAuthModal(true);
            return;
        }
        try {
            setAddingCartId(item?.id);
            await axiosInstance.post(
                `/endUserEndPoint/addToCart?userId=${userId}&batchId=${item?.id}`
            );
            await getAllMedicineCartItems(userId);
            toast.success(`${item?.medicine?.name} - Added to cart`);
            setAddingCartId(null);
        } catch (error) {
            console.error("Error adding to cart:", error?.response || error);
            toast.error("Failed to add item to cart");
            setAddingCartId(null);
        }
    };

    const isInCart = (batchId) => {
        return allmedicineIncart?.some(
            (cartItem) => cartItem?.medicineBatch?.id === batchId
        );
    };

    const defaultImageURL =
        "https://png.pngtree.com/png-clipart/20240619/original/pngtree-drug-capsule-pill-from-prescription-in-drugstore-pharmacy-for-treatment-health-png-image_15366552.png";

    return (
        <div className="min-h-screen bg-gray-50 py-8  ">
            <div className="container mx-auto px-4 ">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-md font-bold text-gray-900 mb-2">
                                Medicines for{" "}
                                <span className="text-teal-600 uppercase">
                                    {search ? searchtext : name}
                                </span>
                            </h1>

                            <p className="text-gray-600">
                                Discover specialized medications for your health needs
                            </p>
                        </div>

                        {/* Search Bar */}
                        <form onSubmit={handleSearch} className="flex gap-2 max-w-md w-full">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    value={searchtext}
                                    onChange={(e) => setSearchtext(e.target.value)}
                                    placeholder="Search medicines..."
                                    className="w-full px-4 py-2 pl-11 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="px-6 cursor-pointer py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-200 font-medium"
                            >
                                Search
                            </button>
                        </form>
                    </div>


                </div>

                {/* Loading State */}
                {loading && (
                    <LoadingAnimation />

                )}

                {/* Medicines Grid */}
                {!loading && medicines.length > 0 && (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-12">
                            {medicines.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer overflow-hidden flex flex-col group"
                                    onClick={() =>
                                        navigate('/medicine/shopbyhealthconcern/medicine_details', {
                                            state: { medicine: item }
                                        })
                                    }
                                >
                                    {/* Image Container */}
                                    <div className="relative w-full h-48 bg-gradient-to-br from-gray-50 to-gray-100 rounded-t-xl overflow-hidden p-6">
                                        <img
                                            src={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBeTXqOJnhL2W_vZewM6uL7UcNmfknP9MvEQ&s`}
                                            alt={item.medicine?.name}
                                            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"

                                        />
                                        {/* <img
                                            src={item.medicine?.imagesUrl?.[0]}
                                            alt={item.medicine?.name}
                                            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"

                                        /> */}
                                        <span className="absolute top-2 left-2 text-[8px] bg-amber-300 text-amber-900 rounded-full px-2">{item.medicine?.otc ? "" : "Prescription required"}</span>
                                    </div>

                                    {/* Content Container */}
                                    <div className="flex-1 p-5 flex flex-col">
                                        <h3 className="font-semibold text-gray-900 text-base leading-tight line-clamp-2 mb-3 group-hover:text-teal-600 transition-colors">
                                            {item.medicine?.name}
                                        </h3>

                                        {/* Medicine Details */}
                                        <div className="space-y-2 mb-4 flex-1">
                                            {item.medicine?.manufacturer && (
                                                <p className="text-sm text-gray-600 line-clamp-1">
                                                    By {item.medicine?.manufacturer}
                                                </p>
                                            )}
                                            {item.medicine?.composition && (
                                                <p className="text-xs text-gray-500 line-clamp-2">
                                                    {item.medicine?.composition}
                                                </p>
                                            )}
                                        </div>

                                        <div className="mt-auto">
                                            {/* Price */}
                                            <div className="flex items-center justify-between mb-4">
                                                <div>
                                                    <p className="text-sm text-gray-600">MRP</p>
                                                    <p className="text-xl font-bold text-teal-600">
                                                        ₹{item.unitPrice}
                                                    </p>
                                                </div>
                                                {item.discount > 0 && (
                                                    <span className="bg-red-100 text-red-600 text-xs font-medium px-2 py-1 rounded-full">
                                                        {item.discount}% OFF
                                                    </span>
                                                )}
                                            </div>

                                            {/* Cart Button */}
                                            {isInCart(item?.id) ? (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate("/medicine/cart");
                                                    }}
                                                    className="w-full border-2 border-teal-600 bg-teal-50 hover:bg-teal-100 text-teal-700 py-3 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                                    </svg>
                                                    View in Cart
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleAddtocart(item);
                                                    }}
                                                    disabled={addingCartId === item.id}
                                                    className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white py-3 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 group/btn"
                                                >
                                                    {addingCartId === item.id ? (
                                                        <>
                                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                            Adding...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <svg className="w-4 h-4 transition-transform group-hover/btn:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                            </svg>
                                                            Add to Cart
                                                        </>
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center space-x-2 mb-12">
                                <button
                                    onClick={() => setPageNum(prev => Math.max(prev - 1, 1))}
                                    disabled={pageNum === 1}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                >
                                    Previous
                                </button>

                                {[...Array(totalPages)].map((_, index) => {
                                    const page = index + 1;
                                    if (
                                        page === 1 ||
                                        page === totalPages ||
                                        (page >= pageNum - 1 && page <= pageNum + 1)
                                    ) {
                                        return (
                                            <button
                                                key={page}
                                                onClick={() => setPageNum(page)}
                                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${pageNum === page
                                                    ? 'bg-teal-600 text-white'
                                                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        );
                                    } else if (page === pageNum - 2 || page === pageNum + 2) {
                                        return <span key={page} className="px-2 text-gray-500">...</span>;
                                    }
                                    return null;
                                })}

                                <button
                                    onClick={() => setPageNum(prev => Math.min(prev + 1, totalPages))}
                                    disabled={pageNum === totalPages}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}

                {/* Empty State */}
                {!loading && medicines.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                        <div className="bg-blue-50 rounded-full p-8 mb-6">
                           <img src="https://cdn-icons-png.flaticon.com/128/13983/13983163.png" alt="" />
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-3">No Medicines Found</h3>
                       
                        <button
                            onClick={() => {
                                setSearchtext(name);
                                setPageNum(1);
                                getShopMedication();
                            }}
                            className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all duration-200 font-medium"
                        >
                            Retry
                        </button>
                    </div>
                )}
                <SimilarMedicineProduct name={search ? searchtext : name ||'para'} />
            </div>
        </div>
    );
};

export default ShopByHealthConcernMedicne;