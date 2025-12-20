// src/pages/medicine/MedicineCheckout.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import RazorpayPayment from '../../component/payments/RazorpayPayments';
import { useAuth } from '../../Authorization/AuthContext';

function MedicineCheckout() {
    const{userData} = useAuth
    const location = useLocation();
    const { cartData, totalAmount } = location.state || {};
    console.log(cartData)
    const navigate = useNavigate()

    // Format number as Indian Rupees
    const formatRupees = (amount) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
    };

    return (
        <div className='min-h-screen p-5 container mx-auto '>
            <h1 className='text-2xl font-bold mb-6'>Medicine Checkout</h1>

            {cartData && cartData.length > 0 ? (
                <div className='flex flex-col lg:flex-row gap-6'>
                    {/* Left Side: Products */}
                    <div className='bg-white rounded-md border border-gray-200 p-6 w-full md:w-2/3'>
                        <h2 className='text-xl font-bold mb-4'>Products in Cart</h2>

                        {cartData.map((item) => (
                            <div
                                key={item.id}
                                className='flex items-center gap-4 mb-4 border-b pb-3 last:border-b-0 last:pb-0'
                            >
                                {/* Product Image */}
                                {item.medicineBatch.medicine?.imagesUrl?.[0] && (
                                    <img
                                        src={item.medicineBatch.medicine.imagesUrl[0]}
                                        alt={item.medicineBatch.medicine?.name}
                                        className='w-16 h-16 object-cover rounded'
                                    />
                                )}

                                {/* Product Details */}
                                <div className='flex-1'>
                                    <p className='font-semibold text-gray-800'>
                                        {item.medicineBatch.medicine?.name}
                                    </p>
                                    <p className='text-gray-600'>
                                        Quantity: <span className='font-medium'>{item.quantity}</span>
                                    </p>
                                    <p className='text-gray-800 font-semibold'>
                                        Total: {formatRupees(item.totalPrice)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right Side: Order Summary */}
                    <div className='w-full lg:w-1/3 bg-white rounded-lg shadow-md p-5 flex flex-col'>
                        <h2 className='text-xl font-bold mb-4'>Order Summary</h2>
                        <div className='flex flex-col gap-3'>
                            {cartData.map((item) => (
                                <>
                                    <div className='flex flex-row items-center justify-between'>
                                        <div key={item.id} className='flex flex-col justify-between'>
                                            <span>{item.medicineBatch.medicine?.name}</span>
                                            <span>{formatRupees(item.totalPrice)} x {item.quantity}</span>
                                        </div>
                                        <div>
                                            {formatRupees(item.unitPrice * item.quantity)}
                                        </div>

                                    </div>
                                </>
                            ))}
                        </div>
                        <hr className='my-4 border-gray-300' />
                        <div className='flex justify-between text-lg font-bold'>
                            <span>Total Amount:</span>
                            <span>{formatRupees(totalAmount)}</span>
                        </div>
                        <button
                            onClick={() => navigate('/medicine/checkout/payemnt', { state: { cartData, totalAmount } })}
                            className='mt-6 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold'>
                            Proceed to Payment
                        </button>
                    </div>
                </div>
            ) : (
                <div className='text-center mt-20'>
                    <p className='text-gray-500 text-lg'>No cart data found!</p>
                </div>
            )}

            
        </div>
    );
}

export default MedicineCheckout;
