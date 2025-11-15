// src/pages/medicine/ShopByHealthConcernMedicne.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../Authorization/axiosInstance";
import { toast } from 'react-toastify';

const ShopByHealthConcernMedicne = () => {
    const { name } = useParams();
    const [pageNum, setPageNum] = useState(1);
    const [pageSize] = useState(10);
    const [loading, setLoading] = useState(false);
    const [medicines, setMedicines] = useState([]);
    const navigate = useNavigate()
  

    useEffect(() => {
        getShopMedication();
        window.scrollTo(0,0)
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

    const handleAddToCart = (item) => {
        console.log("Add to cart => ", item);
        // integrate your add-to-cart logic here
    };

    return (
        <div className="container mx-auto mt-6 mb-10 px-3 h-screen">
            <h2 className="text-2xl font-bold mb-3">
                Medicines for: <span className="text-green-600">{name}</span>
            </h2>

            {loading && <p className="text-gray-500">Loading...</p>}

            {/* Medicines Grid */}
            <div

                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 mt-5">

                {medicines.map((item) => (
                    <div
                        onClick={() =>
                            navigate('/medicine/shopbyhealthconcern/medicine_details', {
                                state: { medicine: item }
                            })
                        }
                        key={item.id}
                        className="border border-gray-200 rounded-xl p-3 shadow-sm bg-white hover:shadow-lg transition-transform hover:-translate-y-1 cursor-pointer flex flex-col"
                     >
                        {/* Image */}
                        <div className="w-full h-32 bg-gray-100 rounded-md overflow-hidden flex justify-center items-center">
                            <img
                                src={item?.medicine?.imagesUrl?.[0] || "/no-image.png"}
                                alt={item.medicine?.name}
                                className="w-full h-full object-contain"
                            />
                        </div>

                        {/* Medicine Info */}
                        <div className="mt-3 flex-1">
                            <p className="font-semibold text-gray-900 text-sm truncate">
                                {item.medicine?.name}
                            </p>
                            <p className="text-gray-500 text-sm mt-1">
                                MRP: <span className="font-medium">₹{item.unitPrice}</span>
                            </p>
                        </div>

                        {/* Add to Cart */}
                        <button
                            onClick={() => handleAddToCart(item)}
                            className="mt-3 bg-green-500 text-white py-1.5 rounded-lg text-sm font-medium hover:bg-green-700 transition cursor-pointer"
                        >
                            Add to Cart
                        </button>
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
