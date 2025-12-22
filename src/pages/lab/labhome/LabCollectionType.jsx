// src/pages/lab/labhome/LabCollectionType.jsx
import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import SelectSlot from './SelectSlot'
import { MdHome } from "react-icons/md"
import { BiBuildingHouse } from "react-icons/bi"

function LabCollectionType() {
    const [collectionType, setCollectionType] = useState('home')
    const location = useLocation()
    const labCartItems = location.state || []

    return (
        <div className="container mx-auto p-4">

            {/* Toggle Buttons */}
            <div className="flex mb-6 gap-2">
                <button
                    onClick={() => setCollectionType('home')}
                    className={`flex items-center gap-2 px-5 py-3 text-sm font-medium rounded-t-lg
                        ${collectionType === 'home'
                            ? "bg-teal-700 text-white shadow-md"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                >
                    <MdHome className="text-lg" />
                    Home Collection
                </button>

                <button
                    onClick={() => setCollectionType('lab')}
                    className={`flex items-center gap-2 px-5 py-3 text-sm font-medium rounded-t-lg
                        ${collectionType === 'lab'
                            ? "bg-teal-700 text-white shadow-md"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                >
                    <BiBuildingHouse className="text-lg" />
                    Visit Lab
                </button>
            </div>

            {/* SINGLE PAGE RENDER */}
            <SelectSlot
                labCartItems={labCartItems}
                page={collectionType === 'home' ? 'HomeCollection' : 'VisitLab'}
            />

        </div>
    )
}

export default LabCollectionType
