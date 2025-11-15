// src/component/UpcommingStaus.jsx
import React from "react";
import { FiTruck, FiCalendar } from "react-icons/fi";

export default function UpcommingStaus() {
  return (
    <div className=" container mx-2 md:mx-auto  flex flex-col items-center">

      <div className=" bg-white shdow-md rounded-md shadow-sm mt-10 w-full ">

        {/* Delivery Status */}
        <div className="py-3 px-4">
          <div className="flex items-center gap-2 mb-1 border-b border-gray-300 pb-1">
            <FiTruck className="text-gray-700"/>
            <h3 className="font-semibold text-gray-800">Delivery Status</h3>
          </div>

          <p className="text-sm text-gray-600">
            Your medicine order (ID: <span className="font-medium">#C24-98765</span>)
            is out for delivery and expected by <span className="font-medium">5:00 PM</span> today.
            Tracking information is available{" "}
            <span className="text-blue-600 cursor-pointer">here</span>.
          </p>
        </div>

        {/* LINE 1 (Delivery ka niche) */}
        <div className="border-t border-gray-300" ></div>
        

        {/* Upcoming Appointments */}
        <div className="px-4 py-3">
          <div className="flex items-center gap-2 mb-1">
            
            <FiCalendar className="text-gray-700" />
            <h3 className="font-semibold text-gray-800">Upcoming Appointments</h3>
             <div className="flex items-center gap-2 mb-1 border-b border-gray-300 pb-1"></div>
          </div>

          <p className="text-sm text-gray-600">
               <div className="border border-gray-300"></div>
            You have an upcoming appointment with
         
             <span className="font-medium">Dr. Alice Smith</span> on{" "}
            <span className="font-medium">2024-07-20 at 10:00 AM</span> for a general checkup.
          </p>

          <p className="text-sm text-gray-600">
            Please arrive 15 minutes early. Add to calendar{" "}
            <span className="text-blue-600 cursor-pointer">here</span>
          </p>
        </div>

        {/* LINE 2 (Upcoming ka niche) */}
        

      </div>

      {/* FOOTER */}
     
    </div>
  );
}
