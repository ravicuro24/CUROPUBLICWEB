// src/pages/lab/labhome/TestByVitalOrganList.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

function TestByVitalOrganList() {
  const navigate = useNavigate()
  const organs = [
    { name: "Hyperthyroidism", icon: "heart-outline", color: "yellow", tests: 15 },
    { name: "Anemia", icon: "heart-outline", color: "red", tests: 15 },
    { name: "Liver", icon: "liver", color: "amber", tests: 12 },
    { name: "Kidney", icon: "water-outline", color: "blue", tests: 10 },
    { name: "Lungs", icon: "lungs", color: "teal", tests: 8 },
    { name: "Brain", icon: "brain", color: "purple", tests: 9 },
    { name: "Stomach", icon: "food-outline", color: "orange", tests: 11 },
    { name: "Bone", icon: "bone", color: "indigo", tests: 7 },
    { name: "Eyes", icon: "eye-outline", color: "cyan", tests: 6 },
  ];

  // Color mapping for Tailwind CSS
  const colorClasses = {
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    red: 'bg-red-50 border-red-200 text-red-700',
    amber: 'bg-amber-50 border-amber-200 text-amber-700',
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    teal: 'bg-teal-50 border-teal-200 text-teal-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
    orange: 'bg-orange-50 border-orange-200 text-orange-700',
    indigo: 'bg-indigo-50 border-indigo-200 text-indigo-700',
    cyan: 'bg-cyan-50 border-cyan-200 text-cyan-700',
  };

  // Icon mapping (you can replace these with actual icons from your icon library)
  const getIcon = (iconName) => {
    const iconMap = {
      'heart-outline': '❤️',
      'liver': '🫁',
      'water-outline': '💧',
      'lungs': '🫁',
      'brain': '🧠',
      'food-outline': '🍽️',
      'bone': '🦴',
      'eye-outline': '👁️',
    };
    return iconMap[iconName] || '⚕️';
  };

  return (
    <div className=" py-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Tests by Vital Organ</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {organs.map((organ, index) => (
          <div
            onClick={() => navigate('/lab/vital/organlist', { state: { organName: organ.name } })}
            key={index}
            className={`border-2 rounded-lg p-4 cursor-pointer shadow-sm hover:shadow-2xl transition-shadow duration-200 ${colorClasses[organ.color]}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getIcon(organ.icon)}</span>
                <div>
                  <h3 className="font-semibold text-lg">{organ.name}</h3>
                  <p className="text-sm opacity-75">{organ.tests} tests available</p>
                </div>
              </div>
              <button className="bg-white cursor-pointer hover:bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium border border-gray-300 transition-colors">
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TestByVitalOrganList;