// src/pages/medicine/MedicneOrderConfirm.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function MedicineOrderConfirm() {
    const [animate, setAnimate] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const { payment, cartData, totalAmount } = location.state || {};
    console.log(payment, cartData, totalAmount)

    useEffect(() => {
        setTimeout(() => setAnimate(true), 300);
        window.scrollTo(0, 0)
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-xl rounded-lg shadow-lg p-6 ">

                {/* ICON + TITLE SIDE BY SIDE */}
                <div className="flex flex-col items-center gap-1 justify-center">

                    {/* Animated Green Box */}
                    <div className="relative">
                        <div
                            className={`w-20 h-20 bg-green-500 rounded-full shadow-lg 
                                    transition-all duration-500 
                                    ${animate ? "scale-100 opacity-100" : "scale-0 opacity-0"}
                                `}
                        ></div>

                        {/* Tick Animation */}
                        <svg
                            className={`absolute top-0 left-0 w-20 h-20 p-2 
                            transition-opacity duration-500 
                            ${animate ? "opacity-100" : "opacity-0"}
                        `}
                            viewBox="0 0 52 52"
                        >
                            <path
                                className="tick stroke-white"
                                fill="none"
                                strokeWidth="5"
                                d="M14 27 L22 35 L38 18"
                            />
                        </svg>
                    </div>

                    {/* TEXT */}
                    <h2 className="text-2xl font-bold text-teal-700">
                        Order Confirmed!
                    </h2>
                </div>

                {/* Description */}
                <p className="text-center text-gray-600 mt-2">
                    Thank you for your medicine order.
                    Your order is being processed.
                </p>

                {/* ORDER DETAILS */}
                <div className="mt-6 bg-teal-100 rounded-xl p-4 border border-teal-300">
                    <h3 className="text-lg font-semibold text-teal-800 mb-3">
                        Order Details
                    </h3>

                    <div className="flex justify-between text-gray-700 mb-2">
                        <span>Order ID:</span>
                        <span className="font-semibold">#MD123456</span>
                    </div>

                    <div className="flex justify-between text-gray-700 mb-2">
                        <span>Payment:</span>
                        <span className="font-semibold">Online / COD</span>
                    </div>

                    <div className="flex justify-between text-gray-700 mb-2">
                        <span>Delivery:</span>
                        <span className="font-semibold">2 - 3 Days</span>
                    </div>
                </div>

                {/* HELP */}
                <div className="mt-6 text-center">
                    <p className="text-gray-700">Need help?</p>
                    <p className="font-semibold text-teal-700 mt-1">
                        📞 9451063419
                    </p>
                </div>

                {/* BUTTON */}
                <button className="w-full mt-6 bg-teal-600 text-white py-3 rounded-xl font-semibold hover:bg-teal-700 transition">
                    Continue Shopping
                </button>
            </div>

            {/* ANIMATION CSS */}
            <style>{`
        .tick {
          stroke-dasharray: 48;
          stroke-dashoffset: 48;
          animation: drawTick 0.7s ease forwards 0.4s;
        }

        @keyframes drawTick {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
        </div>
    );
}

export default MedicineOrderConfirm;
