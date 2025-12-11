// src/pages/doctor/DoctorNotification.jsx
import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  AlertCircle, 
  CheckCircle, 
  XCircle,
  Bell,
  Search,
  ChevronRight,
  Phone,
  Video,
  MapPin,
  MoreVertical,
  Menu,
  Filter,
  ChevronDown,
  Plus,
  MessageSquare
} from 'lucide-react';

function DoctorNotification() {
  const [activeTab, setActiveTab] = useState('pending');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  // Dummy data for pending appointments
  const pendingAppointments = [
    {
      id: 1,
      patientName: 'John Smith',
      patientAge: 35,
      time: '10:30 AM',
      date: '2024-03-15',
      type: 'New Patient',
      symptoms: ['Fever', 'Headache'],
      status: 'pending',
      appointmentType: 'In-person',
      duration: '30 mins'
    },
    {
      id: 2,
      patientName: 'Sarah Johnson',
      patientAge: 28,
      time: '2:00 PM',
      date: '2024-03-15',
      type: 'Follow-up',
      symptoms: ['Back Pain'],
      status: 'pending',
      appointmentType: 'Video Call',
      duration: '20 mins'
    },
    {
      id: 3,
      patientName: 'Michael Chen',
      patientAge: 42,
      time: '4:15 PM',
      date: '2024-03-15',
      type: 'New Patient',
      symptoms: ['Cough', 'Fatigue'],
      status: 'pending',
      appointmentType: 'In-person',
      duration: '30 mins'
    },
  ];
  
  // Dummy data for upcoming appointments
  const upcomingAppointments = [
    {
      id: 4,
      patientName: 'Robert Davis',
      patientAge: 55,
      time: '9:00 AM',
      date: '2024-03-16',
      type: 'Follow-up',
      symptoms: ['Chest Pain', 'Fatigue'],
      status: 'confirmed',
      appointmentType: 'Video Call',
      duration: '25 mins'
    },
    {
      id: 5,
      patientName: 'Emily Wilson',
      patientAge: 32,
      time: '11:30 AM',
      date: '2024-03-16',
      type: 'New Patient',
      symptoms: ['Rash', 'Itching'],
      status: 'confirmed',
      appointmentType: 'In-person',
      duration: '30 mins'
    },
    {
      id: 6,
      patientName: 'David Brown',
      patientAge: 45,
      time: '3:45 PM',
      date: '2024-03-17',
      type: 'Follow-up',
      symptoms: ['Muscle Pain'],
      status: 'confirmed',
      appointmentType: 'Phone Call',
      duration: '15 mins'
    },
  ];
  
  // Dummy data for completed appointments
  const completedAppointments = [
    {
      id: 7,
      patientName: 'Lisa Taylor',
      patientAge: 38,
      time: '10:00 AM',
      date: '2024-03-14',
      type: 'Follow-up',
      symptoms: ['Headache'],
      status: 'completed',
      appointmentType: 'In-person',
      duration: '20 mins'
    },
  ];
  
  // Dummy data for urgent notifications
  const urgentNotifications = [
    {
      id: 1,
      title: 'New Test Results',
      patient: 'John Smith',
      time: '30 min ago',
      priority: 'high'
    },
    {
      id: 2,
      title: 'Prescription Refill',
      patient: 'Sarah Johnson',
      time: '1 hr ago',
      priority: 'medium'
    },
    {
      id: 3,
      title: 'Emergency Slot',
      time: '2 hrs ago',
      priority: 'high'
    },
  ];
  
  const handleAppointmentAction = (appointmentId, action) => {
    console.log(`Appointment ${appointmentId}: ${action}`);
  };
  
  const tabs = [
    { id: 'pending', name: 'Pending', count: pendingAppointments.length, icon: AlertCircle },
    { id: 'upcoming', name: 'Upcoming', count: upcomingAppointments.length, icon: Calendar },
    { id: 'completed', name: 'Completed', count: completedAppointments.length, icon: CheckCircle },
  ];
  
  const renderAppointmentCard = (appointment) => (
    <div key={appointment.id} className="bg-white rounded-lg md:rounded-xl border border-gray-200 shadow-xs md:shadow-sm hover:shadow-sm md:hover:shadow-md transition-shadow duration-200 p-3 md:p-4 lg:p-5">
      {/* Mobile Compact Header */}
      <div className="md:hidden flex justify-between items-start mb-3">
        <div className="flex items-center space-x-2 flex-1 min-w-0">
          <div className="w-8 h-8 bg-teal-100 rounded-full flex-shrink-0 flex items-center justify-center">
            <User className="w-4 h-4 text-teal-600" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold text-gray-800 truncate">{appointment.patientName}</h3>
            <p className="text-xs text-gray-500 truncate">{appointment.patientAge}y • {appointment.type}</p>
          </div>
        </div>
        
        <div className="flex flex-col items-end space-y-1">
          <div className="flex items-center space-x-1">
            {appointment.status === 'pending' && (
              <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-[10px] font-medium rounded-full">
                Pending
              </span>
            )}
            {appointment.status === 'confirmed' && (
              <span className="px-2 py-0.5 bg-green-100 text-green-800 text-[10px] font-medium rounded-full">
                Confirmed
              </span>
            )}
            {appointment.status === 'completed' && (
              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-medium rounded-full">
                Done
              </span>
            )}
            
            {appointment.appointmentType === 'Video Call' && (
              <Video className="w-4 h-4 text-purple-500" />
            )}
            {appointment.appointmentType === 'Phone Call' && (
              <Phone className="w-4 h-4 text-blue-500" />
            )}
            {appointment.appointmentType === 'In-person' && (
              <MapPin className="w-4 h-4 text-red-500" />
            )}
          </div>
          <span className="text-xs text-gray-600 font-medium">{appointment.time}</span>
        </div>
      </div>
      
      {/* Desktop Header */}
      <div className="hidden md:flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 lg:w-12 lg:h-12 bg-teal-100 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 lg:w-6 lg:h-6 text-teal-600" />
          </div>
          <div>
            <h3 className="text-sm lg:text-base font-semibold text-gray-800">{appointment.patientName}</h3>
            <p className="text-xs lg:text-sm text-gray-500">{appointment.patientAge} years • {appointment.type}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {appointment.status === 'pending' && (
            <span className="px-2 py-1 lg:px-3 lg:py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
              Pending
            </span>
          )}
          {appointment.status === 'confirmed' && (
            <span className="px-2 py-1 lg:px-3 lg:py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
              Confirmed
            </span>
          )}
          {appointment.status === 'completed' && (
            <span className="px-2 py-1 lg:px-3 lg:py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
              Completed
            </span>
          )}
          
          {appointment.appointmentType === 'Video Call' && (
            <Video className="w-5 h-5 text-purple-500" />
          )}
          {appointment.appointmentType === 'Phone Call' && (
            <Phone className="w-5 h-5 text-blue-500" />
          )}
          {appointment.appointmentType === 'In-person' && (
            <MapPin className="w-5 h-5 text-red-500" />
          )}
        </div>
      </div>
      
      {/* Appointment Details */}
      <div className="mb-3 md:mb-4">
        <div className="flex flex-wrap items-center text-xs md:text-sm text-gray-600 gap-2 mb-2">
          <div className="flex items-center">
            <Calendar className="w-3 h-3 md:w-4 md:h-4 mr-1" />
            <span className="font-medium">{appointment.date}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-3 h-3 md:w-4 md:h-4 mr-1 ml-2 md:ml-4" />
            <span className="font-medium">{appointment.time}</span>
          </div>
          <span className="px-2 py-0.5 md:px-2 md:py-1 bg-gray-100 text-gray-700 text-xs rounded">
            {appointment.duration}
          </span>
        </div>
        
        <div className="flex flex-wrap gap-1 md:gap-2">
          {appointment.symptoms.map((symptom, index) => (
            <span key={index} className="px-2 py-0.5 md:px-3 md:py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
              {symptom}
            </span>
          ))}
        </div>
      </div>
      
      {/* Action Buttons - Mobile */}
      {appointment.status === 'pending' && (
        <div className="md:hidden flex space-x-2">
          <button
            onClick={() => handleAppointmentAction(appointment.id, 'accept')}
            className="flex-1 flex items-center justify-center space-x-1 bg-teal-500 text-white px-2 py-1.5 rounded-lg hover:bg-teal-600 transition-colors duration-200 text-xs"
          >
            <CheckCircle className="w-3 h-3" />
            <span>Accept</span>
          </button>
          <button
            onClick={() => handleAppointmentAction(appointment.id, 'decline')}
            className="flex-1 flex items-center justify-center space-x-1 bg-red-100 text-red-600 px-2 py-1.5 rounded-lg hover:bg-red-200 transition-colors duration-200 text-xs"
          >
            <XCircle className="w-3 h-3" />
            <span>Decline</span>
          </button>
          <button className="p-1.5 border border-gray-300 rounded-lg hover:bg-gray-50">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      )}
      
      {appointment.status === 'confirmed' && (
        <div className="md:hidden flex space-x-2">
          <button className="flex-1 bg-teal-500 text-white px-2 py-1.5 rounded-lg hover:bg-teal-600 transition-colors duration-200 text-xs">
            Start Now
          </button>
          <button className="flex-1 border border-teal-500 text-teal-600 px-2 py-1.5 rounded-lg hover:bg-teal-50 transition-colors duration-200 text-xs">
            Reschedule
          </button>
        </div>
      )}
      
      {appointment.status === 'completed' && (
        <div className="md:hidden flex justify-between items-center">
          <button className="text-teal-600 hover:text-teal-700 text-xs font-medium flex items-center">
            View History
            <ChevronRight className="w-3 h-3 ml-1" />
          </button>
          <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-xs">
            Add Notes
          </button>
        </div>
      )}
      
      {/* Action Buttons - Desktop */}
      {appointment.status === 'pending' && (
        <div className="hidden md:flex space-x-3">
          <button
            onClick={() => handleAppointmentAction(appointment.id, 'accept')}
            className="flex-1 flex items-center justify-center space-x-2 bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors duration-200 text-sm"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Accept</span>
          </button>
          <button
            onClick={() => handleAppointmentAction(appointment.id, 'decline')}
            className="flex-1 flex items-center justify-center space-x-2 bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors duration-200 text-sm"
          >
            <XCircle className="w-4 h-4" />
            <span>Decline</span>
          </button>
          <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      )}
      
      {appointment.status === 'confirmed' && (
        <div className="hidden md:flex space-x-3">
          <button className="flex-1 bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors duration-200 text-sm">
            Start Consultation
          </button>
          <button className="flex-1 border border-teal-500 text-teal-600 px-4 py-2 rounded-lg hover:bg-teal-50 transition-colors duration-200 text-sm">
            Reschedule
          </button>
        </div>
      )}
      
      {appointment.status === 'completed' && (
        <div className="hidden md:flex justify-between items-center">
          <button className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center">
            View Medical History
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm">
            Add Notes
          </button>
        </div>
      )}
    </div>
  );
  
  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-3 md:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Mobile Header */}
        <div className="md:hidden mb-4">
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 rounded-lg bg-white border border-gray-200"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            
            <div className="flex-1 mx-3">
              <h1 className="text-lg font-bold text-gray-800 truncate">Appointments</h1>
              <p className="text-xs text-gray-600 truncate">Manage your patient appointments</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="relative p-2 bg-white border border-gray-200 rounded-lg">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                  3
                </span>
              </button>
              <button className="p-2 bg-teal-500 text-white rounded-lg">
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Mobile Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search appointments..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
            />
          </div>
        </div>
        
        {/* Desktop Header */}
        <div className="hidden md:block mb-6 lg:mb-8">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 gap-4">
            <div>
              <h1 className="text-xl lg:text-2xl xl:text-3xl font-bold text-gray-800">Appointment Dashboard</h1>
              <p className="text-gray-600 mt-1 text-sm lg:text-base">Manage your patient appointments and notifications</p>
            </div>
            
            <div className="flex items-center space-x-3 lg:space-x-4">
              <div className="relative flex-1 lg:flex-none lg:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search appointments..."
                  className="w-full pl-9 lg:pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                />
              </div>
              
              <button className="relative p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                <Bell className="w-5 h-5 lg:w-6 lg:h-6 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </button>
              
              <button className="hidden lg:flex items-center space-x-2 bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600">
                <Plus className="w-5 h-5" />
                <span>New Appointment</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Stats Cards - Mobile */}
        <div className="md:hidden overflow-x-auto pb-2 mb-4">
          <div className="flex space-x-3 min-w-max">
            <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-xs min-w-[140px]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-xs">Pending</p>
                  <p className="text-lg font-bold text-gray-800 mt-1">{pendingAppointments.length}</p>
                </div>
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-xs min-w-[140px]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-xs">Upcoming</p>
                  <p className="text-lg font-bold text-gray-800 mt-1">{upcomingAppointments.length}</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-xs min-w-[140px]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-xs">Completed</p>
                  <p className="text-lg font-bold text-gray-800 mt-1">{completedAppointments.length}</p>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats Cards - Desktop */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6 lg:mb-8">
          <div className="bg-white p-4 lg:p-5 rounded-lg lg:rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Pending Approvals</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-800 mt-1">{pendingAppointments.length}</p>
              </div>
              <div className="p-2 lg:p-3 bg-yellow-100 rounded-lg">
                <AlertCircle className="w-5 h-5 lg:w-6 lg:h-6 text-yellow-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 lg:p-5 rounded-lg lg:rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Upcoming Today</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-800 mt-1">{upcomingAppointments.length}</p>
              </div>
              <div className="p-2 lg:p-3 bg-blue-100 rounded-lg">
                <Calendar className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 lg:p-5 rounded-lg lg:rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Completed Today</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-800 mt-1">{completedAppointments.length}</p>
              </div>
              <div className="p-2 lg:p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 lg:w-6 lg:h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 lg:p-5 rounded-lg lg:rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Waiting Time</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-800 mt-1">15min</p>
              </div>
              <div className="p-2 lg:p-3 bg-purple-100 rounded-lg">
                <Clock className="w-5 h-5 lg:w-6 lg:h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Main Content - Appointments */}
          <div className="lg:col-span-2">
            {/* Mobile Tabs */}
            <div className="md:hidden bg-white rounded-lg border border-gray-200 mb-4">
              <div className="flex">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 flex flex-col items-center py-2 px-1 rounded-lg transition-colors duration-200 ${activeTab === tab.id
                        ? 'bg-teal-50 text-teal-700'
                        : 'text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                      <Icon className="w-4 h-4 mb-1" />
                      <span className="text-xs font-medium">{tab.name}</span>
                      {tab.count > 0 && (
                        <span className={`mt-1 px-1.5 py-0.5 text-[10px] rounded-full ${activeTab === tab.id
                          ? 'bg-teal-100 text-teal-700'
                          : 'bg-gray-100 text-gray-600'
                          }`}>
                          {tab.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
            
            {/* Desktop Tabs */}
            <div className="hidden md:block bg-white rounded-lg lg:rounded-xl border border-gray-200 p-1 mb-6">
              <div className="flex space-x-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center py-2 lg:py-3 px-2 lg:px-4 rounded-lg transition-colors duration-200 ${activeTab === tab.id
                      ? 'bg-teal-50 text-teal-700 font-semibold'
                      : 'text-gray-600 hover:bg-gray-50'
                      }`}
                  >
                    <span className="text-sm lg:text-base">{tab.name}</span>
                    {tab.count > 0 && (
                      <span className={`ml-2 px-2 py-0.5 lg:px-2 lg:py-1 text-xs rounded-full ${activeTab === tab.id
                        ? 'bg-teal-100 text-teal-700'
                        : 'bg-gray-100 text-gray-600'
                        }`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Appointments List */}
            <div className="space-y-3 md:space-y-4">
              {activeTab === 'pending' && pendingAppointments.map(renderAppointmentCard)}
              {activeTab === 'upcoming' && upcomingAppointments.map(renderAppointmentCard)}
              {activeTab === 'completed' && completedAppointments.map(renderAppointmentCard)}
              
              {(activeTab === 'pending' && pendingAppointments.length === 0) && (
                <div className="text-center py-8 md:py-12 bg-white rounded-lg md:rounded-xl border border-dashed border-gray-300">
                  <AlertCircle className="w-10 h-10 md:w-12 md:h-12 text-gray-400 mx-auto mb-3 md:mb-4" />
                  <h3 className="text-base md:text-lg font-semibold text-gray-600 mb-2">No Pending Appointments</h3>
                  <p className="text-gray-500 text-sm md:text-base">All appointments have been processed</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Sidebar - Notifications & Quick Actions */}
          <div className="space-y-4 md:space-y-6">
            {/* Urgent Notifications */}
            <div className="bg-white rounded-lg md:rounded-xl border border-gray-200 shadow-xs md:shadow-sm p-3 md:p-4 lg:p-5">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <h2 className="font-bold text-gray-800 text-sm md:text-base">Urgent Notifications</h2>
                <Bell className="w-4 h-4 md:w-5 md:h-5 text-gray-500" />
              </div>
              
              <div className="space-y-3 md:space-y-4">
                {urgentNotifications.map((notification) => (
                  <div key={notification.id} className={`p-3 md:p-4 rounded-lg border-l-4 ${notification.priority === 'high' 
                    ? 'border-l-red-500 bg-red-50' 
                    : 'border-l-yellow-500 bg-yellow-50'
                    }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-800 text-sm md:text-base truncate">{notification.title}</h4>
                        {notification.patient && (
                          <p className="text-xs md:text-sm text-gray-600 mt-1 truncate">Patient: {notification.patient}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
                      </div>
                      {notification.priority === 'high' && (
                        <span className="px-2 py-0.5 md:px-2 md:py-1 bg-red-100 text-red-700 text-xs font-medium rounded ml-2 flex-shrink-0">
                          Urgent
                        </span>
                      )}
                    </div>
                    <button className="mt-2 md:mt-3 text-teal-600 hover:text-teal-700 text-xs md:text-sm font-medium">
                      Take Action →
                    </button>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-3 md:mt-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm">
                View All Notifications
              </button>
            </div>
            
            {/* Quick Actions - Mobile */}
            <div className="md:hidden bg-white rounded-lg border border-gray-200 p-3">
              <h2 className="font-bold text-gray-800 text-sm mb-3">Quick Actions</h2>
              
              <div className="grid grid-cols-4 gap-2">
                <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 flex flex-col items-center">
                  <div className="p-1.5 bg-blue-100 rounded-lg mb-1">
                    <Calendar className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-xs font-medium text-gray-700 text-center">Schedule</span>
                </button>
                
                <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 flex flex-col items-center">
                  <div className="p-1.5 bg-green-100 rounded-lg mb-1">
                    <Video className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-xs font-medium text-gray-700 text-center">Video</span>
                </button>
                
                <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 flex flex-col items-center">
                  <div className="p-1.5 bg-purple-100 rounded-lg mb-1">
                    <Clock className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-xs font-medium text-gray-700 text-center">Time</span>
                </button>
                
                <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 flex flex-col items-center">
                  <div className="p-1.5 bg-orange-100 rounded-lg mb-1">
                    <MessageSquare className="w-4 h-4 text-orange-600" />
                  </div>
                  <span className="text-xs font-medium text-gray-700 text-center">Chat</span>
                </button>
              </div>
            </div>
            
            {/* Quick Actions - Desktop */}
            <div className="hidden md:block bg-white rounded-lg lg:rounded-xl border border-gray-200 shadow-sm p-4 lg:p-5">
              <h2 className="font-bold text-gray-800 text-base lg:text-lg mb-4">Quick Actions</h2>
              
              <div className="grid grid-cols-2 gap-3">
                <button className="p-3 lg:p-4 border border-gray-200 rounded-lg lg:rounded-xl hover:bg-gray-50 flex flex-col items-center">
                  <div className="p-2 lg:p-3 bg-blue-100 rounded-lg mb-2">
                    <Calendar className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
                  </div>
                  <span className="text-sm lg:text-base font-medium text-gray-700">Schedule</span>
                </button>
                
                <button className="p-3 lg:p-4 border border-gray-200 rounded-lg lg:rounded-xl hover:bg-gray-50 flex flex-col items-center">
                  <div className="p-2 lg:p-3 bg-green-100 rounded-lg mb-2">
                    <Video className="w-5 h-5 lg:w-6 lg:h-6 text-green-600" />
                  </div>
                  <span className="text-sm lg:text-base font-medium text-gray-700">Video Call</span>
                </button>
                
                <button className="p-3 lg:p-4 border border-gray-200 rounded-lg lg:rounded-xl hover:bg-gray-50 flex flex-col items-center">
                  <div className="p-2 lg:p-3 bg-purple-100 rounded-lg mb-2">
                    <Clock className="w-5 h-5 lg:w-6 lg:h-6 text-purple-600" />
                  </div>
                  <span className="text-sm lg:text-base font-medium text-gray-700">Availability</span>
                </button>
                
                <button className="p-3 lg:p-4 border border-gray-200 rounded-lg lg:rounded-xl hover:bg-gray-50 flex flex-col items-center">
                  <div className="p-2 lg:p-3 bg-orange-100 rounded-lg mb-2">
                    <User className="w-5 h-5 lg:w-6 lg:h-6 text-orange-600" />
                  </div>
                  <span className="text-sm lg:text-base font-medium text-gray-700">Patients</span>
                </button>
              </div>
            </div>
            
            {/* Today's Schedule Summary */}
            <div className="bg-white rounded-lg md:rounded-xl border border-gray-200 shadow-xs md:shadow-sm p-3 md:p-4 lg:p-5">
              <h2 className="font-bold text-gray-800 text-sm md:text-base mb-3 md:mb-4">Today's Schedule</h2>
              
              <div className="space-y-2 md:space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div>
                    <p className="font-medium text-gray-700 text-sm">Morning Session</p>
                    <p className="text-xs text-gray-500">9:00 AM - 1:00 PM</p>
                  </div>
                  <span className="px-2 py-0.5 md:px-3 md:py-1 bg-teal-100 text-teal-700 text-xs rounded-full">4 Patients</span>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div>
                    <p className="font-medium text-gray-700 text-sm">Lunch Break</p>
                    <p className="text-xs text-gray-500">1:00 PM - 2:00 PM</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium text-gray-700 text-sm">Evening Session</p>
                    <p className="text-xs text-gray-500">2:00 PM - 6:00 PM</p>
                  </div>
                  <span className="px-2 py-0.5 md:px-3 md:py-1 bg-blue-100 text-blue-700 text-xs rounded-full">3 Patients</span>
                </div>
              </div>
              
              <button className="w-full mt-3 md:mt-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 font-medium text-sm">
                View Full Schedule
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Floating Action Button */}
        <button className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-teal-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-teal-600 z-10">
          <Plus className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

export default DoctorNotification;  