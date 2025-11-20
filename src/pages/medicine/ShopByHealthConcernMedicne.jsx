// src/pages/medicine/ShopByHealthConcernMedicne.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../Authorization/axiosInstance";
import { toast } from 'react-toastify';
import { useAuth } from "../../Authorization/AuthContext";

const ShopByHealthConcernMedicne = () => {
    const { name } = useParams();
    const { userData, getAllMedicineCartItems } = useAuth()
    const userId = userData?.id
    const [pageNum, setPageNum] = useState(1);
    const [pageSize] = useState(10);
    const [loading, setLoading] = useState(false);
    const [medicines, setMedicines] = useState([]);
    const [addingCartId, setAddingCartId] = useState(null)
    const navigate = useNavigate()


    useEffect(() => {
        getShopMedication();
        window.scrollTo(0, 0)
    }, [name, pageNum]);

    const getShopMedication = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(
                `/endUserEndPoint/getMedicineByPrescribedFor?prescribedFor=${name}&page=${pageNum}&size=${pageSize}`
            );

            setMedicines(response.data?.dtoList?.content || []);
        } catch (error) {
            console.error("Error fetching medicines:", error.response || error);
        } finally {
            setLoading(false);
        }
    };



    const handleAddtocart = async (item) => {
        console.log(item)
        try {
            setAddingCartId(item?.id);
            const response = await axiosInstance.post(
                `/endUserEndPoint/addToCart?userId=${userId}&batchId=${item?.id}`
            );
            await getAllMedicineCartItems(userId);
             toast.success(`${item?.medicine?.name} - Added to cart`);
            console.log("Add to Cart In ShopMedicine", response);
            setAddingCartId(null);
        } catch (error) {
            console.error("Error adding to cart:", error?.response || error);
            setAddingCartId(null);
        }
    };



    const defaultImageURL =
        "https://png.pngtree.com/png-clipart/20240619/original/pngtree-drug-capsule-pill-from-prescription-in-drugstore-pharmacy-for-treatment-health-png-image_15366552.png";

    return (
        <div className="container mx-auto mt-6 mb-10 px-3 h-screen">
            <h2 className="text-2xl font-bold mb-3">
                Medicines for: <span className="text-green-600">{name}</span>
            </h2>

            {loading && <p className="text-gray-500">Loading...</p>}

            {/* Medicines Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                {medicines.map((item) => (
                    <div
                        key={item.id}
                        className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer overflow-hidden flex flex-col"
                        onClick={() =>
                            navigate('/medicine/shopbyhealthconcern/medicine_details', {
                                state: { medicine: item }
                            })
                        }
                    >
                        {/* Image Container */}
                        <div className="relative w-full h-36 bg-gray-50 rounded-t-xl overflow-hidden p-4">
                            <img
                                src={defaultImageURL}
                                alt={item.medicine?.name}
                                className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                            />
                            {/* Optional: Add a badge for offers/trending */}
                            {/* <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    Popular
                </div> */}
                        </div>

                        {/* Content Container */}
                        <div className="flex-1 p-4 flex flex-col">
                            {/* Medicine Name */}
                            <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2 mb-2 group-hover:text-green-600 transition-colors">
                                {item.medicine?.name}
                            </h3>

                            {/* Price Information */}
                            <div className="mt-auto">
                                <p className="text-gray-600 text-sm mb-3">
                                    MRP: <span className="font-bold text-green-600">₹{item.unitPrice}</span>
                                </p>

                                {/* Add to Cart Button */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleAddtocart(item);
                                    }}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 cursor-pointer rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 group/btn"
                                >

                                    {addingCartId === item.id ? <span className="loading loading-spinner loading-sm"></span> : "Add to Cart"}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {!loading && medicines.length === 0 && (
                <p className="text-red-500 mt-4 text-center">No medicines found.</p>
            )}
        </div>
    );
};

export default ShopByHealthConcernMedicne;
