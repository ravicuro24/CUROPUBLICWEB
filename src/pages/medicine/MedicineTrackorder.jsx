// src/pages/medicine/MedicineTrackorder.jsx
import React from "react";
import { FiCheck } from "react-icons/fi";
import { FaRegClipboard, FaShieldAlt, FaUserTie, FaGift } from "react-icons/fa";
import { useLocation } from "react-router-dom";

const MedicineTrackorder = () => {
  const location = useLocation();
  const activePage = location.state;

  console.log("order Data",activePage);
  const steps = [
    {
      title: "Order Placed",
      desc: "We have received your order.",
      icon: <FaRegClipboard />,
      completed: true,
    },
    {
      title: "Order Confirmed",
      desc: "Your order has been confirmed.",
      icon: <FaShieldAlt />,
      completed: true,
    },
    {
      title: "Order Processed",
      desc: "We are preparing your order.",
      icon: <FaUserTie />,
      completed: false,
      active: true,
    },
    {
      title: "Ready to Pickup",
      desc: "Your order is ready for pickup.",
      icon: <FaGift />,
      completed: false,
    },
  ];

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow h-screen my-4">
      {/* Header */}
      <div className="text-center border-b pb-4 mb-6">
        <h2 className="text-2xl font-bold text-green-700">Track Order</h2>

        <div className="flex justify-between text-sm mt-4 px-4">
          <div>
            <p className="text-gray-500">ESTIMATED TIME</p>
            <p className="text-lg font-semibold text-gray-800">30 minutes</p>
          </div>

          <div>
            <p className="text-gray-500">ORDER NUMBER</p>
            <p className="text-lg font-semibold text-gray-800">#2482011</p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="ml-5 relative">
        {/* Vertical Line */}
        <div className="absolute left-3 top-0 w-1 h-full bg-gray-300 rounded-full"></div>

        {steps.map((step, index) => (
          <div key={index} className="flex items-start gap-4 mb-10 relative">
            {/* Circle */}
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center z-10
                ${step.completed || step.active
                  ? "bg-green-600"
                  : "bg-gray-300"
                }`}
            >
              {step.completed ? (
                <FiCheck className="text-white text-sm" />
              ) : (
                <span className="w-2 h-2 bg-white rounded-full"></span>
              )}
            </div>

            {/* Text */}
            <div>
              <h3
                className={`flex items-center gap-2 text-lg font-semibold 
                ${step.active
                    ? "text-blue-600"
                    : step.completed
                      ? "text-gray-900"
                      : "text-gray-400"
                  }`}
              >
                {step.icon} {step.title}
              </h3>
              <p className="text-gray-500 text-sm">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="text-center mt-6 text-gray-600 text-sm">
        For help, call{" "}
        <span className="font-semibold text-green-700">+91 94XXXXXXXX</span>
      </div>
    </div>
  );
};

export default MedicineTrackorder;
