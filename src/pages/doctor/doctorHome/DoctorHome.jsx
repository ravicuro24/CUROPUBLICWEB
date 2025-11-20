// src/pages/doctor/doctorHome/DoctorHome.jsx
// src/pages/lab/doctor/doctorHome/DoctorHome.jsx

import React from 'react'

function DoctorHome() {
  const upcomingFeatures = [
    {
      id: 1,
      title: "Patient Analytics",
      description: "Advanced analytics and insights for patient data",
      icon: "📊",
      color: "bg-blue-500"
    },
    {
      id: 2,
      title: "Smart Scheduling",
      description: "AI-powered appointment scheduling system",
      icon: "⏰",
      color: "bg-green-500"
    },
    {
      id: 3,
      title: "Telemedicine",
      description: "Virtual consultations and remote patient monitoring",
      icon: "📱",
      color: "bg-purple-500"
    },
    {
      id: 4,
      title: "Lab Integration",
      description: "Seamless integration with laboratory systems",
      icon: "🔬",
      color: "bg-orange-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      {/* Header */}
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Doctor Dashboard
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Exciting new features are coming soon to enhance your medical practice experience
        </p>
      </div>

      {/* Coming Soon Banner */}
      <div className="max-w-4xl mx-auto mb-12">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white text-center shadow-2xl transform hover:scale-105 transition-transform duration-300 animate-pulse-slow">
          <div className="flex items-center justify-center mb-4">
            <div className="w-3 h-3 bg-yellow-400 rounded-full animate-ping mr-2"></div>
            <span className="text-yellow-300 font-semibold">COMING SOON</span>
          </div>
          <h2 className="text-3xl font-bold mb-4">
            Next Generation Healthcare Platform
          </h2>
          <p className="text-purple-100 text-lg">
            We're working hard to bring you innovative features that will revolutionize patient care
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {upcomingFeatures.map((feature, index) => (
            <div
              key={feature.id}
              className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl border border-gray-100 animate-float"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Feature Icon */}
              <div className={`w-16 h-16 ${feature.color} rounded-full flex items-center justify-center text-2xl mb-4 mx-auto transform hover:rotate-12 transition-transform duration-300`}>
                {feature.icon}
              </div>
              
              {/* Feature Content */}
              <h3 className="text-xl font-semibold text-gray-800 text-center mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-center mb-4">
                {feature.description}
              </p>
              
              {/* Progress Indicator */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div 
                  className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-progress"
                  style={{ width: `${Math.random() * 30 + 70}%` }}
                ></div>
              </div>
              
              <div className="text-center">
                <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full">
                  In Development
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Countdown Section */}
      <div className="max-w-2xl mx-auto mt-16 text-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 animate-fade-in-up">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            Launching Soon
          </h3>
          <div className="flex justify-center space-x-4 mb-6">
            {[30, 24, 60, 60].map((value, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg animate-bounce-slow">
                  {value}
                </div>
                <span className="text-xs text-gray-500 mt-2 block">
                  {['Days', 'Hours', 'Minutes', 'Seconds'][index]}
                </span>
              </div>
            ))}
          </div>
          <p className="text-gray-600">
            Stay tuned for the official release announcement
          </p>
        </div>
      </div>

      {/* Notification Bell */}
      <div className="fixed bottom-6 right-6">
        <button className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg transform hover:scale-110 hover:rotate-12 transition-all duration-300 animate-bounce">
          <span className="text-xl">🔔</span>
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping"></span>
        </button>
      </div>
    </div>
  )
}

export default DoctorHome