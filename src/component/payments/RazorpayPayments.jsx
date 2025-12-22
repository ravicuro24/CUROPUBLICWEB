// src/component/payments/RazorpayPayments.jsx
import React, { useState } from "react";
import { useAuth } from "../../Authorization/AuthContext";

const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        if (window.Razorpay) {
            resolve(true);
            return;
        }

        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;

        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);

        document.body.appendChild(script);
    });
};

const RazorpayPayment = ({
    amount,
    email,
    planId,
    type,
    selectedPaymentMethod,
    contact,
    checkoutFrom,
    deliveryAddressId,
    orderFrom,
    userId,
    onSuccess,
    onfailure,
    description,
}) => {
    const [loading, setLoading] = useState(false);
    const [isHover, setIsHover] = useState(false);
    const { getAllMedicineCartItems, userData } = useAuth()

    const initiatePayment = async () => {
        if (!email) {
            alert("Email is required");
            return;
        }

        setLoading(true);

        // Load Razorpay SDK
        const isLoaded = await loadRazorpayScript();
        if (!isLoaded) {
            alert("Razorpay SDK failed to load");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(
                "https://test.curo24.com/payment/create-order-end-user",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        amount: amount,
                        currency: "INR",
                        email,
                        planId,
                        type,
                        checkoutFrom,
                        deliveryAddressId,
                        phoneNumber: contact,
                        orderFrom,
                        userId,
                    }),
                }
            );

            const data = await res.json();
            const order = data.order;

            if (!order?.id) {
                alert("Order creation failed");
                setLoading(false);
                return;
            }
            await getAllMedicineCartItems(userData?.id)
            const options = {
                key: "rzp_test_RnSpkEAJt3y0B3",
                amount: order.amount,
                currency: order.currency,
                name: "Curo24 Payment",
                description,
                order_id: order.id,
                prefill: {
                    email,
                    contact,
                },
                theme: { color: "#073c38" },
                handler: function (response) {
                    onSuccess(response);
                },
                modal: {
                    ondismiss: function () {
                        onfailure({ message: "Payment cancelled" });
                    },
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            console.error(err);
            alert("Payment failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={initiatePayment}
            disabled={loading}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            style={{
                backgroundColor: isHover ? "#115E59" : "#0F766E", // teal-800 on hover
                color: "#fff",
                padding: "12px 20px",
                borderRadius: "10px",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                transition: "background-color 0.2s ease",
            }}
        >
            {loading ? "Processing..." : `Pay ₹${Number(amount).toFixed(2)}`}
        </button>
    );
};

export default RazorpayPayment;
