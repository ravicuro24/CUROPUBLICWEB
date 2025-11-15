// src/component/HealthRecords.jsx
import React from 'react'
import { FaHandHoldingHeart } from "react-icons/fa";
import { MdKeyboardArrowRight } from "react-icons/md";



function HealthRecords() {
    return (
        <>
            <div className='container bg-white mx-auto shadow-md rounded-md my-10 p-6'>
                <div className='flex flex-row justify-between items-center'>
                    <div className='flex flex-row justify-start items-center gap-10'>
                        <div className='bg-yellow-50 p-4 rounded-full'><FaHandHoldingHeart className='text-amber-600' /></div>
                        <div className='flex flex-col'>
                            <p className='text-xl font-bold text-gray-700'>Family Medical History</p>
                            <p className='text-sm text-gray-500'>View and manage family health records securely.</p>
                        </div>
                    </div>
                    <div>
                        <MdKeyboardArrowRight size={26} />
                    </div>

                </div>

            </div>
        </>
    )
}

export default HealthRecords