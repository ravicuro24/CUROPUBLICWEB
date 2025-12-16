import React, { useEffect, useState } from 'react';
import {
  Search,
  Ambulance,
  Phone,
  MapPin,
  Clock,
  Shield,
  Users,
  AlertCircle,
  Stethoscope,
  Heart,
  ChevronRight,
  Star,
  CheckCircle,
  Award
} from 'lucide-react';

function AmbulanceLandingPage() {
  const [location, setLocation] = useState('');
  const [emergencyType, setEmergencyType] = useState('');
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");

  const handleNameChange = (e) => {
    const value = e.target.value.replace(/[^a-zA-Z\s]/g, ""); // allow letters + space
    setName(value);
  };


  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // remove non-numbers
    if (value.length <= 10) {
      setPhone(value);
    }
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }, [])

  // Emergency types
  const emergencyTypes = [
    { id: 1, name: 'Accident', icon: '🚑', color: 'bg-red-100 text-red-600' },
    { id: 2, name: 'Heart Attack', icon: '❤️', color: 'bg-pink-100 text-pink-600' },
    { id: 3, name: 'Stroke', icon: '🧠', color: 'bg-purple-100 text-purple-600' },
    { id: 4, name: 'Difficulty Breathing', icon: '😮‍💨', color: 'bg-blue-100 text-blue-600' },
    { id: 5, name: 'Severe Bleeding', icon: '🩸', color: 'bg-red-100 text-red-600' },
    { id: 6, name: 'Other Emergency', icon: '⚠️', color: 'bg-yellow-100 text-yellow-600' },
  ];

  // Active ambulances
  const activeAmbulances = [
    { id: 1, number: 'AMB-001', status: 'Available', eta: '5 min', type: 'Advanced Life Support' },
    { id: 2, number: 'AMB-002', status: 'On Route', eta: '12 min', type: 'Basic Life Support' },
    { id: 3, number: 'AMB-003', status: 'Available', eta: '8 min', type: 'Neonatal' },
    { id: 4, number: 'AMB-004', status: 'Available', eta: '15 min', type: 'Cardiac' },
  ];

  // Emergency contacts
  const emergencyContacts = [
    { name: 'Police', number: '100', color: 'bg-blue-600' },
    { name: 'Fire', number: '101', color: 'bg-red-600' },
    { name: 'Poison Control', number: '1-800-222-1222', color: 'bg-green-600' },
    { name: 'Suicide Prevention', number: '1-800-273-8255', color: 'bg-purple-600' },
  ];

  // Testimonials
  const testimonials = [
    { name: 'Robert Johnson', text: 'Amazing response time! They arrived in 7 minutes and saved my wife\'s life.', rating: 5 },
    { name: 'Maria Garcia', text: 'Professional and caring staff. They handled the emergency with expertise.', rating: 5 },
    { name: 'James Wilson', text: 'The ambulance was fully equipped and the paramedics were highly skilled.', rating: 4 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Emergency Banner */}


      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Emergency Ambulance Service
                <span className="block text-blue-200">24/7 Fast Response</span>
              </h1>
              <p className="text-xl mb-8 opacity-90">
                Immediate medical assistance when every second counts. Our advanced life support ambulances reach you in minutes.
              </p>

              {/* Emergency Call Button */}
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="tel:911"
                  className="bg-red-600 hover:bg-red-700 text-white font-bold text-lg py-3 px-8 rounded-lg transition duration-300 flex items-center justify-center"
                >
                  <Phone className="mr-2 h-6 w-6" />
                  CURO24 EMERGENCY
                </a>
                <button className="border-2 border-white hover:bg-white hover:text-blue-900 font-semibold py-3 px-8 rounded-lg transition duration-300">
                  Book Non-Emergency
                </button>
              </div>
            </div>

            {/* Emergency Form */}
            <div className="bg-white rounded-xl shadow-2xl p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Request Ambulance</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Emergency Type
                  </label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                    value={emergencyType}
                    onChange={(e) => setEmergencyType(e.target.value)}
                  >
                    <option value="">Select Emergency Type</option>
                    <option value="accident">Accident/Injury</option>
                    <option value="heart">Heart Attack/Chest Pain</option>
                    <option value="stroke">Stroke Symptoms</option>
                    <option value="breathing">Difficulty Breathing</option>
                    <option value="bleeding">Severe Bleeding</option>
                    <option value="other">Other Medical Emergency</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      className="w-full pl-10 p-3 border text-gray-700 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter exact address or location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Patient Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={handleNameChange}
                      className="w-full p-3 text-gray-700 border border-gray-300 rounded-lg
             focus:ring-2 focus:ring-blue-500"
                      placeholder="Optional"
                    />

                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={handlePhoneChange}
                      inputMode="numeric"
                      maxLength={10}
                      pattern="[0-9]*"
                      className="w-full p-3 border text-gray-700 border-gray-300 rounded-lg
             focus:ring-2 focus:ring-blue-500"
                      placeholder="Emergency contact"
                    />

                  </div>
                </div>

                <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center">
                  <AlertCircle className="mr-2 h-5 w-5" />
                  SEND AMBULANCE NOW
                </button>

                <p className="text-sm text-gray-500 text-center">
                  By clicking, you confirm this is a genuine emergency
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Average Response Time</p>
                <p className="text-2xl font-bold text-gray-900">8.2 min</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Ambulance className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Active Ambulances</p>
                <p className="text-2xl font-bold text-gray-900">47</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Certified Paramedics</p>
                <p className="text-2xl font-bold text-gray-900">156</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg">
                <Heart className="h-8 w-8 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Lives Saved</p>
                <p className="text-2xl font-bold text-gray-900">12,847+</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Services */}
          <div className="lg:col-span-2">
            {/* Active Ambulances */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Ambulances Near You</h2>
                <button className="flex items-center text-blue-600 hover:text-blue-700 font-medium">
                  Live Tracking
                  <ChevronRight className="ml-1 h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4">
                {activeAmbulances.map((ambulance) => (
                  <div key={ambulance.id} className="border border-gray-200 rounded-lg p-4 hover:bg-blue-50 transition-colors">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="flex items-center">
                          <Ambulance className="h-6 w-6 text-blue-600 mr-3" />
                          <span className="text-lg font-bold text-gray-900">{ambulance.number}</span>
                          <span className={`ml-3 px-3 py-1 rounded-full text-sm font-medium ${ambulance.status === 'Available' ? 'bg-green-100 text-green-800' :
                            'bg-yellow-100 text-yellow-800'
                            }`}>
                            {ambulance.status}
                          </span>
                        </div>
                        <p className="text-gray-600 mt-1">{ambulance.type}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Estimated Time</p>
                        <p className="text-xl font-bold text-blue-600">{ambulance.eta}</p>
                        <button className="mt-2 text-blue-600 hover:text-blue-700 font-medium text-sm">
                          Track Location
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Emergency Types */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Common Emergencies</h2>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {emergencyTypes.map((type) => (
                  <button
                    key={type.id}
                    className={`${type.color} rounded-xl p-4 text-center transition-transform hover:scale-105 border border-gray-200`}
                    onClick={() => setEmergencyType(type.name)}
                  >
                    <div className="text-2xl mb-2">{type.icon}</div>
                    <div className="font-semibold text-gray-900">{type.name}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Emergency Contacts */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Emergency Contacts</h3>
              <div className="space-y-3">
                {emergencyContacts.map((contact) => (
                  <div key={contact.name} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div>
                      <p className="font-medium text-gray-900">{contact.name}</p>
                    </div>
                    <a
                      href={`tel:${contact.number}`}
                      className={`${contact.color} text-white font-bold py-1 px-3 rounded-lg hover:opacity-90 transition-opacity`}
                    >
                      {contact.number}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Why Choose Us */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Why Choose Us</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">24/7 Availability</p>
                    <p className="text-sm text-gray-600">Always ready to respond</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Shield className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Certified Paramedics</p>
                    <p className="text-sm text-gray-600">Advanced medical training</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Stethoscope className="h-5 w-5 text-purple-500 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Advanced Equipment</p>
                    <p className="text-sm text-gray-600">Life-saving technology onboard</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Award className="h-5 w-5 text-yellow-500 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Accredited Service</p>
                    <p className="text-sm text-gray-600">Government certified</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonials */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">What Patients Say</h3>
              <div className="space-y-4">
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="border-l-4 border-blue-600 pl-4 py-2">
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-600 italic">"{testimonial.text}"</p>
                    <p className="font-medium text-gray-900 mt-2">- {testimonial.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Ambulance className="h-8 w-8 text-red-500 mr-2" />
                <span className="text-xl font-bold">MediRescue</span>
              </div>
              <p className="text-gray-400">
                Providing emergency medical services with compassion and expertise since 2005.
              </p>
              <div className="mt-4 flex space-x-4">
                <div className="bg-blue-800 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold">24/7</div>
                  <div className="text-sm">Service</div>
                </div>
                <div className="bg-green-800 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold">8min</div>
                  <div className="text-sm">Avg Response</div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-lg">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Emergency Services</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Non-Emergency Transport</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Ambulance Types</a></li>
                <li><a href="#" className="hover:text-white transition-colors">First Aid Tips</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-lg">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Emergency Procedures</a></li>
                <li><a href="#" className="hover:text-white transition-colors">CPR Guide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Hospital Network</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Insurance Partners</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-lg">Contact Info</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-start">
                  <Phone className="h-5 w-5 mr-2 mt-0.5 text-red-500" />
                  <div>
                    <p className="font-medium">Emergency</p>
                    <a href="tel:911" className="hover:text-white">911 or 1-800-AMBULANCE</a>
                  </div>
                </li>
                <li className="flex items-start">
                  <Phone className="h-5 w-5 mr-2 mt-0.5 text-blue-500" />
                  <div>
                    <p className="font-medium">Non-Emergency</p>
                    <a href="tel:1-800-222-1234" className="hover:text-white">1-800-222-1234</a>
                  </div>
                </li>
                <li className="flex items-start">
                  <Clock className="h-5 w-5 mr-2 mt-0.5 text-green-500" />
                  <div>
                    <p className="font-medium">24/7 Operation</p>
                    <p>Always Available</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2023 MediRescue Ambulance Service. All rights reserved. In case of emergency, call 911 immediately.</p>
            <p className="mt-2 text-sm">This is for demonstration purposes only. In real emergencies, always call your local emergency number.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AmbulanceLandingPage;