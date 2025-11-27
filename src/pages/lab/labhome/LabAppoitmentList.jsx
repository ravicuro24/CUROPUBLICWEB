// src/pages/lab/labhome/LabAppoitmentList.jsx
// src/pages/lab/labhome/LabAppointmentList.jsx

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../Authorization/AuthContext';
import axiosInstance from '../../../Authorization/axiosInstance';
import AppointmentsList from './AppotmentList';
import { FiFilter, FiList, FiSearch } from 'react-icons/fi';
import { useLabAuth } from '../../../Authorization/LabAuthContext';

function LabAppointmentList() {
  const { userData } = useAuth();
  const id = userData?.id;

  const { searchAppointment, setSearchAppointment } = useLabAuth();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [pageNo, setPageNo] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // API CALL FUNCTION
  const getAppointmentsByUserId = async () => {
    try {
      setLoading(true);

      const response = await axiosInstance.get(
        `/endUserEndPoint/getAllAppointmentsByBookedById?endUserId=${id}&appointmentStatus=${status}&sortedField=updatedAt&perPage=${itemsPerPage}&pageNo=${pageNo}&sortingOrder=Desc${searchAppointment ? `&appointmentNumber=${searchAppointment}` : ""}`
      );

      console.log("Appointments response:", response.data);
      setAppointments(response.data || []);
      setTotalPages(response.data?.totalPages || 1);

    } catch (error) {
      console.error("Error fetching appointments", error);
    } finally {
      setLoading(false);
    }
  };

  // NORMAL API TRIGGERS (pagination, status, items per page)
  useEffect(() => {
    if (id) getAppointmentsByUserId();
  }, [id, status, pageNo, itemsPerPage]);

  // DEBOUNCE SEARCH - CALL AFTER 1 SEC STOP TYPING
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (id !== null) {
        setPageNo(1);
        getAppointmentsByUserId();
      }
    }, 1000); // wait 1 second

    return () => clearTimeout(delaySearch);
  }, [searchAppointment]);


  // Pagination handlers
  const handleNext = () => {
    if (pageNo < totalPages) setPageNo(pageNo + 1);
  };

  const handlePrev = () => {
    if (pageNo > 1) setPageNo(pageNo - 1);
  };

  const handlePageClick = (num) => setPageNo(num);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center hide-scrollbar">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen hide-scrollbar">

      <div className="mb-2">
        <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
        <p className="text-gray-600 mt-1">Total Pages: {totalPages}</p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 p-4 border-b border-gray-200">

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <FiFilter className="text-gray-600 text-lg" />
          <label className="text-sm font-medium text-gray-700">Status:</label>
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPageNo(1); }}
            className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">All</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="TESTING_IN_PROGRESS">Testing in progress</option>
            <option value="SAMPLE_COLLECTED">Sample collected</option>
            <option value="RESCHEDULED">Rescheduled</option>
            <option value="REJECTED">Rejected</option>
            <option value="CANCELED">Canceled</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        {/* Search */}
        <div className="flex items-center w-full sm:w-72 relative">
          <FiSearch className="w-5 h-5 absolute left-3 text-gray-400" />
          <input
            value={searchAppointment}
            onChange={(e) => setSearchAppointment(e.target.value)}
            type="text"
            placeholder="Search appointments..."
            className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Items per Page */}
        <div className="flex items-center gap-2">
          <FiList className="text-gray-600 text-lg" />
          <label className="text-sm font-medium text-gray-700">Items/Page:</label>
          <select
            value={itemsPerPage}
            onChange={(e) => { setItemsPerPage(Number(e.target.value)); setPageNo(1); }}
            className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
            <option value="40">40</option>
          </select>
        </div>

      </div>

      {/* Appointment List */}
      <AppointmentsList appointments={appointments} />
      {/* Pagination */}
      
    </div>
  );
}

export default LabAppointmentList;
