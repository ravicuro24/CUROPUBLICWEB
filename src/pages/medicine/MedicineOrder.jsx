// src/pages/medicine/MedicineOrder.jsx
// src/component/medicine/MedicineOrder.jsx
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../Authorization/axiosInstance';
import { useAuth } from '../../Authorization/AuthContext';
import { MdHome, MdLocationCity, MdMap, MdPhone, MdOutlinePin } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';


function MedicineOrder() {
  const { userData } = useAuth();
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false);
  const [allOrderList, setAllOrderList] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [error, setError] = useState(null);
  const id = userData?.id;

  useEffect(() => {
    getAllOrderMedicine();
  }, []);

  const getAllOrderMedicine = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get(
        `/endUserEndPoint/getMedicineOrdersByEndUserId?endUserId=${id}`
      );
      setAllOrderList(response.data.dto || []);
      console.log("my order", response)
    } catch (err) {
      console.error("Get orders error:", err?.response ?? err);
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'shipped':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleTrackOrder = (order) => {
    navigate('/medicine_trackOrder', {
      state: { activePage: order }
    });
  };


  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-2">⚠️</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={getAllOrderMedicine}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!allOrderList.length) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">💊</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Orders Found</h3>
          <p className="text-gray-500">You haven't placed any medicine orders yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="  md:p-6 container  md:mx-auto">
      <div className="mb-1">
        <h2 className="text-md md:text-lg font-bold text-gray-900 mb-2">My Medicine Orders</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Medicine
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {allOrderList.map((order) =>
                order.orderItems?.map((item, index) => (
                  <tr
                    key={`${order.id}-${item.id}`}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => setSelectedOrder(order)}
                  >
                    {index === 0 && (
                      <td className="px-6 py-4 whitespace-nowrap align-top" rowSpan={order.orderItems.length}>
                        <div className="flex flex-col">
                          <span className="text-xs md:text-md font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                            #{order.id}
                          </span>
                          <span className="text-sm text-gray-500 mt-1">
                            {new Date(order.orderDate).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border mt-2 ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                          <div className="mt-2 text-sm font-semibold text-gray-900">
                            {formatCurrency(order.totalAmount)}
                          </div>
                          <div>
                            <button onClick={() => handleTrackOrder(order)} className='text-xs bg-blue-400 hover:bg-blue-600 text-white px-2 cursor-pointer py-1 rounded-lg'>Tack Order</button>
                          </div>
                        </div>
                      </td>
                    )}

                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.medicineBatch?.medicine?.imagesUrl[0] || '/placeholder-medicine.jpg'}
                          alt={""}
                          className="w-12 h-12 object-cover rounded-lg border border-gray-200"

                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {item.medicineBatch?.medicine?.name}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            Batch: {item.medicineBatch?.batchNumber || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.quantity} x {item.unitPrice} = {formatCurrency(item.totalPrice)}
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enhanced Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 backdrop-brightness-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {console.log("selcet", selectedOrder)}
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
              <div className="flex justify-between items-center">
                <div className='flex gap-4'>
                  <h3 className="text-xl font-bold text-white">Order Details</h3>
                  <p className="text-blue-100 text-sm mt-1">#{selectedOrder.id}</p>
                </div>
                <button
                  className="text-white cursor-pointer bg-blue-50/20 text-gray-600 rounded-full h-8 w-8 hover:text-blue-200 transition-colors text-md font-light p-1"
                  onClick={() => setSelectedOrder(null)}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              {/* Order Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-700 mb-2 md:text-md text-[12px]">Order Status</h4>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full font-medium md:text-md text-xs ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-700 mb-2 md:text-md text-[12px]">Order Date</h4>
                  <p className="text-gray-900 md:text-md text-xs">
                    {new Date(selectedOrder.orderDate).toLocaleString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-700 mb-2 md:text-md text-[12px]">Total Amount</h4>
                  <p className="md:text-md text-xs font-bold text-blue-600">
                    {formatCurrency(selectedOrder.totalAmount)}
                  </p>
                </div>
              </div>

              {/* Delivery Address */}
              {selectedOrder.deliveryAddress && (
                <div className="mb-6">
                  <h4 className="md:text-md text-xs font-semibold text-gray-900 mb-3">Delivery Address</h4>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-700">
                      <p className="flex items-center gap-2 md:text-md text-xs">
                        <MdHome className="text-blue-500" />
                        {selectedOrder.deliveryAddress.houseNumber}, {selectedOrder.deliveryAddress.street}
                      </p>
                      <p className="flex items-center gap-2 md:text-md text-xs">
                        <MdLocationCity className="text-blue-500" />
                        {selectedOrder.deliveryAddress.city}
                      </p>
                      <p className="flex items-center gap-2 md:text-md text-xs">
                        <MdMap className="text-blue-500" />
                        <span className="font-medium">Address Type:</span> {selectedOrder.deliveryAddress.addressType}
                      </p>
                      <p className="flex items-center gap-2 md:text-md text-xs">
                        <MdLocationCity className="text-blue-500" />
                        <span className="font-medium">State:</span> {selectedOrder.deliveryAddress.state}
                      </p>
                      <p className="flex items-center gap-2 md:text-md text-xs">
                        <MdOutlinePin className="text-blue-500" />
                        {selectedOrder.deliveryAddress.postalCode}
                      </p>
                      <p className="flex items-center gap-2 md:text-md text-xs">
                        <MdPhone className="text-blue-500" />
                        {selectedOrder.deliveryAddress.phoneNumber}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Order Items */}
              <div>
                <h4 className="text-xs md:text-md font-semibold text-gray-900 mb-4">Order Items</h4>
                <div className="space-y-2">
                  {selectedOrder.orderItems?.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                      <img
                        src={item.medicineBatch?.medicine?.imagesUrl[0] || '/placeholder-medicine.jpg'}
                        alt={item.medicineBatch?.medicine?.name}
                        className="w-16 h-16 object-cover rounded-lg border border-gray-200"

                      />
                      <div className="flex-1 min-w-0">
                        <h5 className="font-semibold text-gray-900 md:text-md text-xs mb-1">
                          {item.medicineBatch?.medicine?.name}
                        </h5>

                        <div className="flex items-center space-x-6 text-sm">
                          <span className="text-md font-semibold text-gray-600 md:text-md text-xs">
                            {item.quantity}x{item.unitPrice.toFixed(2)} = ₹{(item.quantity * item.unitPrice).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MedicineOrder;