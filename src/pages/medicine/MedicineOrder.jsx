// src/pages/medicine/MedicineOrder.jsx
// src/component/medicine/MedicineOrder.jsx
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../Authorization/axiosInstance';
import { useAuth } from '../../Authorization/AuthContext';
import { MdHome, MdLocationCity, MdMap, MdPhone, MdOutlinePin, MdLocalPharmacy, MdDescription } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import LoadingAnimation from '../../LoaderSpinner';

function MedicineOrder() {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [allOrders, setAllOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'medicine', 'prescription'
  const id = userData?.id;

  useEffect(() => {
    getAllOrderMedicine();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [allOrders, activeFilter]);

  const getAllOrderMedicine = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get(
        `/endUserEndPoint/getMedicineOrdersByEndUserId?endUserId=${id}`
      );
      console.log("All order", response.data.dto)
      setAllOrders(response.data.dto || []);
    } catch (err) {
      console.error("Get orders error:", err?.response ?? err);
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    switch (activeFilter) {
      case 'medicine':
        setFilteredOrders(allOrders.filter(order => order.pharmacyId === 0));
        break;
      case 'prescription':
        setFilteredOrders(allOrders.filter(order => order.pharmacyId !== 0));
        break;
      default:
        setFilteredOrders(allOrders);
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
        return 'bg-teal-100 text-teal-800 border-teal-200';
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const renderOrderItems = (order) => {
    if (!order.orderItems || order.orderItems.length === 0) {
      return (
        <tr key={order.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex flex-col">
              <span className="text-xs md:text-md font-semibold text-teal-600">
                #{order.id}
              </span>
              <div className="flex items-center gap-1 mt-1">
                {order.pharmacyId === 0 ? (
                  <>
                    <MdLocalPharmacy className="text-teal-500 text-sm" />
                    <span className="text-xs text-gray-500">Medicine Order</span>
                  </>
                ) : (
                  <>
                    <MdDescription className="text-teal-500 text-sm" />
                    <span className="text-xs text-gray-500">Prescription Order</span>
                  </>
                )}
              </div>
            </div>
          </td>
          <td className="px-6 py-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-lg border border-gray-200">
                <span className="text-gray-400 text-sm">No Items</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">No items in this order</p>
                <p className="text-sm text-gray-500">Order might be prescription-based</p>
              </div>
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            <div className="flex flex-col">
              <span className="font-semibold">{formatCurrency(order.totalAmount)}</span>
              <span
                className={`inline-flex w-fit items-center px-2.5 py-0.5 rounded-full text-xs font-medium border mt-1 ${getStatusColor(order.status)}`}
              >
                {order.status}
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleTrackOrder(order);
                }}
                className='text-xs bg-teal-400 hover:bg-teal-600 text-white px-2 cursor-pointer py-1 rounded-lg mt-2 w-fit'
              >
                Track Order
              </button>
            </div>
          </td>
        </tr>
      );
    }

    return order.orderItems.map((item, index) => (
      <tr
        key={`${order.id}-${item.id || index}`}
        className="hover:bg-gray-50 transition-colors cursor-pointer"
        onClick={() => setSelectedOrder(order)}
      >
        {index === 0 && (
          <td className="px-6 py-4 whitespace-nowrap align-top" rowSpan={order.orderItems.length}>
            <div className="flex flex-col">
              <span className="text-xs md:text-md font-semibold text-teal-600 hover:text-teal-800 transition-colors">
                #{order.id}
              </span>
              <span className="text-sm text-gray-500 mt-1">
                {formatDate(order.orderDate)}
              </span>
              <div className="flex items-center gap-1 mt-1">
                {order.pharmacyId === 0 ? (
                  <>
                    <MdLocalPharmacy className="text-teal-500 text-sm" />
                    <span className="text-xs text-gray-500">Medicine Order</span>
                  </>
                ) : (
                  <>
                    <MdDescription className="text-teal-500 text-sm" />
                    <span className="text-xs text-gray-500">Prescription Order</span>
                  </>
                )}
              </div>
            </div>
          </td>
        )}

        <td className="px-6 py-4">
          <div className="flex items-center space-x-3">
            <img
              src={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBeTXqOJnhL2W_vZewM6uL7UcNmfknP9MvEQ&s` || 'https://cdn-icons-png.flaticon.com/128/4599/4599096.png'}
              // src={item.medicineBatch?.medicine?.imagesUrl?.[0] || 'https://cdn-icons-png.flaticon.com/128/4599/4599096.png'}
              alt={item.medicineBatch?.medicine?.name || 'Medicine'}
              className="w-12 h-12 object-cover rounded-lg "

            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {item.medicineBatch?.medicine?.name?.slice(0, 50) || 'Unknown Medicine'}
              </p>
              <p className="text-sm text-gray-500 truncate">
                Batch: {item.medicineBatch?.batchNumber || 'N/A'}
              </p>
              <p className="text-sm text-gray-900 mt-1">
                {item.quantity} x {formatCurrency(item.unitPrice)}
              </p>
            </div>
          </div>
        </td>

        {index === 0 && (
          <td className="px-6 py-4 whitespace-nowrap align-top" rowSpan={order.orderItems.length}>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-900">
                {formatCurrency(order.totalAmount)}
              </span>
              <span
                className={`inline-flex w-fit items-center px-2.5 py-0.5 rounded-full text-xs font-medium border mt-1 ${getStatusColor(order.status)}`}
              >
                {order.status}
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleTrackOrder(order);
                }}
                className='text-xs bg-teal-400 hover:bg-teal-600 text-white px-2 cursor-pointer py-1 rounded-lg mt-2 w-fit'
              >
                Track Order
              </button>
            </div>
          </td>
        )}
      </tr>
    ));
  };

  if (loading) {
    return <LoadingAnimation />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-2">⚠️</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={getAllOrderMedicine}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="md:p-6 container md:mx-auto">
      <div className="mb-6">
        <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">My Orders</h2>

        {/* Filter Tabs */}
        <div className="flex space-x-2 mb-4">
          <button
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeFilter === 'all'
              ? 'bg-teal-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            onClick={() => setActiveFilter('all')}
          >
            All Orders
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${activeFilter === 'medicine'
              ? 'bg-teal-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            onClick={() => setActiveFilter('medicine')}
          >
            <MdLocalPharmacy />
            Medicine Orders
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${activeFilter === 'prescription'
              ? 'bg-teal-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            onClick={() => setActiveFilter('prescription')}
          >
            <MdDescription />
            Prescription Orders
          </button>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="flex justify-center items-center min-h-64">
          <div className="text-center">
            <div className="text-gray-400 text-6xl mb-4">
              {activeFilter === 'medicine' ? '💊' : activeFilter === 'prescription' ? '📋' : '📦'}
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Orders Found</h3>
            <p className="text-gray-500">
              {activeFilter === 'all'
                ? "You haven't placed any orders yet."
                : activeFilter === 'medicine'
                  ? "No medicine orders found."
                  : "No prescription orders found."}
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto hide-scrollbar">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Order Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Total & Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[...filteredOrders].reverse().map(order => renderOrderItems(order))}
              </tbody>

            </table>
          </div>
        </div>
      )}

      {/* Modal remains the same */}
      {selectedOrder && (
        <div className="fixed inset-0 backdrop-brightness-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden hide-scrollbar">
            <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-4">
              <div className="flex justify-between items-center">
                <div className='flex gap-4'>
                  <h3 className="text-xl font-bold text-white">Order Details</h3>
                  <p className="text-teal-100 text-sm mt-1">#{selectedOrder.id}</p>
                </div>
                <button
                  className="text-white cursor-pointer bg-teal-50/20 text-gray-600 rounded-full h-8 w-8 hover:text-teal-200 transition-colors text-md font-light p-1"
                  onClick={() => setSelectedOrder(null)}
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              {/* Order Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-700 mb-2 md:text-md text-[12px]">Order Type</h4>
                  <div className="flex items-center gap-2">
                    {selectedOrder.pharmacyId === 0 ? (
                      <>
                        <MdLocalPharmacy className="text-teal-500" />
                        <span className="text-gray-900 md:text-md text-xs">Medicine Order</span>
                      </>
                    ) : (
                      <>
                        <MdDescription className="text-teal-500" />
                        <span className="text-gray-900 md:text-md text-xs">Prescription Order</span>
                      </>
                    )}
                  </div>
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
                  <p className="md:text-md text-xs font-bold text-teal-600">
                    {formatCurrency(selectedOrder.totalAmount)}
                  </p>
                </div>
              </div>

              {/* Delivery Address */}
              {selectedOrder.deliveryAddress && (
                <div className="mb-6">
                  <h4 className="md:text-md text-xs font-semibold text-gray-900 mb-3">Delivery Address</h4>
                  <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-700">
                      <p className="flex items-center gap-2 md:text-md text-xs">
                        <MdHome className="text-teal-500" />
                        {selectedOrder.deliveryAddress.houseNumber}, {selectedOrder.deliveryAddress.street}
                      </p>
                      <p className="flex items-center gap-2 md:text-md text-xs">
                        <MdLocationCity className="text-teal-500" />
                        {selectedOrder.deliveryAddress.city}
                      </p>
                      <p className="flex items-center gap-2 md:text-md text-xs">
                        <MdMap className="text-teal-500" />
                        <span className="font-medium">Address Type:</span> {selectedOrder.deliveryAddress.addressType}
                      </p>
                      <p className="flex items-center gap-2 md:text-md text-xs">
                        <MdLocationCity className="text-teal-500" />
                        <span className="font-medium">State:</span> {selectedOrder.deliveryAddress.state}
                      </p>
                      <p className="flex items-center gap-2 md:text-md text-xs">
                        <MdOutlinePin className="text-teal-500" />
                        {selectedOrder.deliveryAddress.postalCode}
                      </p>
                      <p className="flex items-center gap-2 md:text-md text-xs">
                        <MdPhone className="text-teal-500" />
                        {selectedOrder.deliveryAddress.phoneNumber}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Order Items */}
              <div>
                <h4 className="text-xs md:text-md font-semibold text-gray-900 mb-4">Order Items</h4>
                {(!selectedOrder.orderItems || selectedOrder.orderItems.length === 0) ? (
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-4xl mb-3">📋</div>
                    <p className="text-gray-600">This is a prescription-based order with no specific items listed.</p>
                    <p className="text-gray-500 text-sm mt-2">Please check your prescription for details.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedOrder.orderItems?.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                        <img
                          // src={item.medicineBatch?.medicine?.imagesUrl?.[0] || 'https://cdn-icons-png.flaticon.com/128/4599/4599096.png'}
                          src={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBeTXqOJnhL2W_vZewM6uL7UcNmfknP9MvEQ&s` || 'https://cdn-icons-png.flaticon.com/128/4599/4599096.png'}
                          alt={item.medicineBatch?.medicine?.name}
                          className="w-16 h-16 object-cover rounded-lg "

                        />
                        <div className="flex-1 min-w-0">
                          <h5 className="font-semibold text-gray-900 md:text-md text-xs mb-1">
                            {item.medicineBatch?.medicine?.name}
                          </h5>
                          <div className="flex items-center space-x-6 text-sm">
                            <span className="text-md font-semibold text-gray-600 md:text-md text-xs">
                              {item.quantity}x{formatCurrency(item.unitPrice)} = {formatCurrency(item.quantity * item.unitPrice)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MedicineOrder;