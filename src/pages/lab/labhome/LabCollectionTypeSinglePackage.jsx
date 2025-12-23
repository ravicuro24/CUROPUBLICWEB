// src/pages/lab/labhome/LabCollectionTypeSinglePackage.jsx

import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { MdHome } from "react-icons/md";
import { BiBuildingHouse } from "react-icons/bi";
import LabSinglePackageHomeCollection from './LabSinglePackageHomeCollection';

function LabCollectionTypeSinglePackage() {
    const [collectionType, setCollectionType] = useState('home');
    const location = useLocation();
    const labCartItems = location.state || [];
    console.log("all Data", labCartItems)

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }, []);


    return (
        <div className="container mx-auto p-4">

            {/* Toggle Buttons */}
            <div className="flex mb-6 gap-2">
                <button
                    onClick={() => setCollectionType('home')}
                    className={`flex cursor-pointer items-center gap-2 px-5 py-3 text-sm font-medium rounded-t-lg
                    ${collectionType === 'home'
                            ? "bg-teal-700 text-white shadow-md"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-200"
                        }`}
                >
                    <MdHome className="text-lg" />
                    Home Collection
                </button>

                <button
                    onClick={() => setCollectionType('lab')}
                    className={`flex cursor-pointer items-center gap-2 px-5 py-3 text-sm font-medium rounded-t-lg
                    ${collectionType === 'lab'
                            ? "bg-teal-700 text-white shadow-md"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-200"
                        }`}
                >
                    <BiBuildingHouse className="text-lg" />
                    Visit Lab
                </button>
            </div>

            {/* Use single component with page prop */}
            <LabSinglePackageHomeCollection
                labCartItems={[labCartItems]}
                page={collectionType === 'home' ? "HomeCollection" : "VisitLab"}
            />

        </div>
    );
}

export default LabCollectionTypeSinglePackage;