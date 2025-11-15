// src/pages/medicine/ShopByHealthConcern.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    MdMedicalServices,
} from "react-icons/md";
import {
    FaBone,
    FaHeadSideVirus,
    FaBed,
    FaVirus,
    FaHeart,
} from "react-icons/fa";
import {
    GiStomach,
    GiKidneys,
    GiLiver,
} from "react-icons/gi";
import { IoBagAddSharp } from "react-icons/io5";

import {
    PiFlowerLotusBold,
} from "react-icons/pi";
import {
    TbHeartRateMonitor,
} from "react-icons/tb";
import axiosInstance from "../../Authorization/axiosInstance";

// Dummy icon set but with React Icons
const dummyIcons = [
    { icon: <IoBagAddSharp size={30} color="#800572" /> },
    { icon: <FaHeart size={28} color="#16a34a" /> },
    { icon: <GiStomach size={30} color="#800572" /> },
    { icon: <FaBone size={28} color="#16a34a" /> },
    { icon: <IoBagAddSharp size={30} color="#800572" /> },
    { icon: <FaHeadSideVirus size={30} color="#800572" /> },
    { icon: <MdMedicalServices size={30} color="#9E7505" /> },
    { icon: <FaBed size={28} color="#16a34a" /> },
    { icon: <TbHeartRateMonitor size={30} color="#800572" /> },
    { icon: <PiFlowerLotusBold size={30} color="#9E4705" /> },
    { icon: <FaVirus size={28} color="#16a34a" /> },
    { icon: <GiLiver size={30} color="#800572" /> },
    { icon: <GiKidneys size={30} color="#800572" /> },
];

function ShopByHealthConcern() {
    const navigate = useNavigate();
    const [apiCategories, setApiCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch health concern list
    const getAllShopByHealth = async () => {
        try {
            const response = await axiosInstance.get(
                "/endUserEndPoint/getHealthConcernList"
            );
            setApiCategories(response.data || []);
        } catch (error) {
            console.log("Error fetching categories:", error.response);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllShopByHealth();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center w-full py-10">
                <div className="loader border-t-4 border-green-600 rounded-full w-10 h-10 animate-spin"></div>
            </div>
        );
    }

    // Combine dummy icons with API names
    const combinedData = apiCategories.map((name, index) => ({
        name,
        icon: dummyIcons[index % dummyIcons.length].icon,
    }));

    return (
        <div className="">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
                Shop by Health Concerns
            </h2>

            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 gap-6 justify-items-center">
                {combinedData.map((item, index) => (
                    <div
                        key={index}
                        onClick={() =>
                            navigate(`/medicine/shopbyhealthconcern/medicine/${item.name}`)
                        }
                        className="cursor-pointer bg-white rounded-md flex flex-col items-center shdow-md hover:shadow-md transition p-4 w-full"
                    >
                        <div className="w-20 h-20  flex flex-col items-center justify-center">
                            {item.icon}
                            <p className="text-xs text-gray-700 mt-1 text-center px-1">
                                {item.name}
                            </p>
                        </div>
                    </div>
                ))}

            </div>
        </div>



    );
}

export default ShopByHealthConcern;
