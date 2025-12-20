// src/pages/bloodBank/BloodBankHome.jsx
import React, { useEffect, useState, useRef } from 'react';
import {
  Search,
  Droplet,
  Users,
  Clock,
  Phone,
  MapPin,
  AlertCircle,
  Filter,
  ChevronRight,
  Heart,
  Shield,
  Award,
  Calendar,
  ArrowRight,
  CheckCircle,
  Download,
  Share2,
  Menu,
  X,
  Bell,
  XCircle,
  Info,
  Timer,
  Rocket
} from 'lucide-react';
import { DNA, RotatingLines } from 'react-loader-spinner';

function BloodBankHome() {
  const [bloodType, setBloodType] = useState('');
  const [location, setLocation] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [showComingSoon, setShowComingSoon] = useState(true);
  const [counters, setCounters] = useState({
    donations: 0,
    donors: 0,
    lives: 0
  });
  
  // Countdown timer state
  const [countdown, setCountdown] = useState({
    days: 30,
    hours: 12,
    minutes: 45,
    seconds: 30
  });

  const comingSoonRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);

    // Animate counters
    const counterInterval = setInterval(() => {
      setCounters(prev => ({
        donations: prev.donations < 247 ? prev.donations + 1 : 247,
        donors: prev.donors < 5824 ? prev.donors + 10 : 5824,
        lives: prev.lives < 743 ? prev.lives + 1 : 743
      }));
    }, 10);

    // Countdown timer
    const timerInterval = setInterval(() => {
      setCountdown(prev => {
        let { days, hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else if (days > 0) {
          days--;
          hours = 23;
          minutes = 59;
          seconds = 59;
        }
        
        return { days, hours, minutes, seconds };
      });
    }, 1000);

    // Animate progress bar
    if (progressRef.current) {
      let width = 0;
      const progressInterval = setInterval(() => {
        if (width < 85) {
          width += 1;
          progressRef.current.style.width = `${width}%`;
        }
      }, 30);
      
      return () => {
        clearInterval(progressInterval);
        clearInterval(counterInterval);
        clearInterval(timerInterval);
        window.removeEventListener('scroll', handleScroll);
      };
    }

    return () => {
      clearInterval(counterInterval);
      clearInterval(timerInterval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Mock data for blood inventory
  const bloodInventory = [
    { type: 'A+', units: 45, status: 'Available', color: 'bg-red-100 border-red-500' },
    { type: 'A-', units: 22, status: 'Available', color: 'bg-red-50 border-red-400' },
    { type: 'B+', units: 38, status: 'Available', color: 'bg-blue-100 border-blue-500' },
    { type: 'B-', units: 15, status: 'Low', color: 'bg-blue-50 border-blue-400' },
    { type: 'O+', units: 67, status: 'Available', color: 'bg-green-100 border-green-500' },
    { type: 'O-', units: 12, status: 'Critical', color: 'bg-yellow-100 border-yellow-500' },
    { type: 'AB+', units: 28, status: 'Available', color: 'bg-purple-100 border-purple-500' },
    { type: 'AB-', units: 8, status: 'Low', color: 'bg-purple-50 border-purple-400' },
  ];

  // Emergency requests
  const emergencyRequests = [
    { id: 1, bloodType: 'O-', patient: 'John Smith', hospital: 'City General', time: '2 hours ago', priority: 'Critical', distance: '2.5 km' },
    { id: 2, bloodType: 'B+', patient: 'Sarah Johnson', hospital: 'Memorial Hospital', time: '4 hours ago', priority: 'High', distance: '5.1 km' },
    { id: 3, bloodType: 'A+', patient: 'Michael Chen', hospital: 'Childrens Hospital', time: '6 hours ago', priority: 'Medium', distance: '3.7 km' },
  ];

  const upcomingDrives = [
    { date: 'Dec 25, 2023', location: 'Community Center', time: '9 AM - 4 PM', donors: 45 },
    { date: 'Jan 5, 2024', location: 'Downtown Mall', time: '10 AM - 6 PM', donors: 82 },
    { date: 'Jan 15, 2024', location: 'University Campus', time: '11 AM - 7 PM', donors: 120 },
  ];


 

  const renderHeroSection = () => (
    <div className="relative overflow-hidden bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white pt-16"
         style={{ marginTop: showComingSoon ? '3.5rem' : '0' }}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 10}s`
            }}
          >
            <div className="w-4 h-6 bg-red-400/30 rounded-full" />
          </div>
        ))}
      </div>

      {/* DNA SVG Background */}
      <svg
        className="absolute right-0 top-1/2 -translate-y-1/2 
                   w-[400px] md:w-[400px] lg:w-[500px] 
                   opacity-15 pointer-events-none"
        viewBox="0 0 200 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Strand 1 */}
        <path
          d="M80 0 C20 100, 20 200, 80 300 C140 400, 140 500, 80 600"
          stroke="white"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* Strand 2 */}
        <path
          d="M120 0 C180 100, 180 200, 120 300 C60 400, 60 500, 120 600"
          stroke="white"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* Rungs */}
        {[...Array(14)].map((_, i) => (
          <line
            key={i}
            x1="80"
            y1={i * 45}
            x2="120"
            y2={i * 45 + 20}
            stroke="white"
            strokeWidth="4"
          />
        ))}
      </svg>

      {/* Hero Content */}
      <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
        <div className="text-center">
            <h1 className='text-4xl font-bold mb-4 uppercase text-amber-400'>Coming Soon....</h1>
          <h1 className="text-md md:text-xl lg:text-6xl font-bold mb-6 leading-tight">
            Every Drop <span className="text-red-200">Counts</span>,
            <br />
            Every Life <span className="text-red-200">Matters</span>
          </h1>

          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-red-100">
            Join 50,000+ lifesavers in our mission to ensure no one dies waiting for blood
          </p>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-6 transform transition-all duration-300 hover:scale-[1.02]">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-bold text-red-700 mb-2">
                  <Droplet className="inline h-4 w-4 mr-1" />
                  Blood Type Needed
                </label>
                <div className="relative">
                  <select
                    className="w-full p-4 border-2 border-red-500 bg-red-50 text-red-600 font-bold rounded-xl
                             focus:ring-4 focus:ring-red-200 focus:border-red-600 outline-none"
                    value={bloodType}
                    onChange={(e) => setBloodType(e.target.value)}
                  >
                    <option value="">Select Blood Type</option>
                    <option>A+</option>
                    <option>A-</option>
                    <option>B+</option>
                    <option>B-</option>
                    <option>O+</option>
                    <option>O-</option>
                    <option>AB+</option>
                    <option>AB-</option>
                  </select>
                </div>
              </div>

              <div className="flex-1">
                <label className="block text-sm font-bold text-red-700 mb-2">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  Location
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter city or zip code"
                    className="w-full p-4 border-2 border-red-500 bg-red-50 text-red-600 font-bold rounded-xl
                             focus:ring-4 focus:ring-red-200 focus:border-red-600 outline-none"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-end">
                <button
                  className="w-full md:w-auto bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800
                           text-white font-bold py-4 px-8 rounded-xl transition-all duration-300
                           transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center"
                >
                  <Search className="h-5 w-5 mr-2" />
                  Search Blood
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  

  const renderBloodInventory = () => (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Live Blood Inventory</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real-time availability across all our partner hospitals and blood banks
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {bloodInventory.map((blood) => (
            <div
              key={blood.type}
              className={`${blood.color} rounded-2xl p-6 text-center transform transition-all duration-300 
                         hover:scale-105 hover:shadow-2xl border-2 relative overflow-hidden group`}
            >
              <div className="text-4xl font-bold text-gray-900 mb-2">{blood.type}</div>
              <div className="text-2xl font-semibold text-gray-800 mb-3">{blood.units} Units</div>
              <div className={`px-4 py-2 rounded-full text-sm font-bold inline-block
                            ${blood.status === 'Critical' ? 'bg-yellow-100 text-yellow-800 animate-pulse' :
                  blood.status === 'Low' ? 'bg-orange-100 text-orange-800' :
                    'bg-green-100 text-green-800'
                }`}>
                {blood.status}
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
            </div>
          ))}
        </div>

        <div className="text-center">
          <button className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105">
            View Detailed Report
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );

  const renderEmergencyRequests = () => (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <AlertCircle className="h-8 w-8 text-red-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">Urgent Blood Requests</h2>
          </div>
          <div className="flex items-center space-x-4">
            <button className="flex items-center text-red-600 hover:text-red-700 font-bold">
              <Bell className="h-4 w-4 mr-2" />
              Get Alerts
            </button>
            <button className="flex items-center text-red-600 hover:text-red-700 font-bold">
              View All
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {emergencyRequests.map((request) => (
            <div
              key={request.id}
              className={`border-2 rounded-2xl p-6 transform transition-all duration-300 hover:scale-[1.02]
                        ${request.priority === 'Critical' ? 'border-red-500 bg-red-50 animate-pulse' :
                  request.priority === 'High' ? 'border-orange-500 bg-orange-50' :
                    'border-yellow-500 bg-yellow-50'
                }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center mb-2">
                    <span className="text-3xl font-bold text-gray-900 mr-3">{request.bloodType}</span>
                    <span className={`px-4 py-1 rounded-full text-sm font-bold
                                   ${request.priority === 'Critical' ? 'bg-red-100 text-red-800' :
                        request.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                          'bg-yellow-100 text-yellow-800'
                      }`}>
                      {request.priority}
                    </span>
                  </div>
                  <p className="text-gray-600">{request.patient}</p>
                  <p className="text-sm text-gray-500">{request.hospital} • {request.distance} away</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{request.time}</p>
                </div>
              </div>
              <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105">
                <Heart className="inline h-5 w-5 mr-2" />
                I Can Help
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const renderUpcomingEvents = () => (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Upcoming Blood Drives</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join our community events and make a difference together
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {upcomingDrives.map((drive, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-red-50 to-white rounded-2xl p-8 border-2 border-red-100 
                         transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="text-2xl font-bold text-red-600">{drive.date}</div>
                  <div className="text-lg font-semibold text-gray-900 mt-2">{drive.location}</div>
                  <div className="text-gray-600 mt-1">{drive.time}</div>
                </div>
                <div className="bg-red-100 px-4 py-2 rounded-full">
                  <div className="flex items-center text-red-700 font-bold">
                    <Users className="h-4 w-4 mr-2" />
                    {drive.donors} Donors
                  </div>
                </div>
              </div>
              <button className="w-full bg-white border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white 
                               font-bold py-3 px-4 rounded-xl transition-all duration-300">
                Register Now
              </button>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button className="inline-flex items-center border-2 border-gray-300 hover:border-red-600 hover:text-red-600 
                           font-bold py-3 px-8 rounded-xl transition-all duration-300">
            <Calendar className="mr-2 h-5 w-5" />
            View Calendar
          </button>
        </div>
      </div>
    </section>
  );

  const renderComingSoonFeatures = () => (
    <section className="py-16 bg-gradient-to-br from-yellow-50 to-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-400 rounded-full animate-ping opacity-75"></div>
              <Rocket className="h-10 w-10 text-yellow-600 relative z-10" />
            </div>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Exciting New Features Coming Soon!</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're working hard to bring you revolutionary features that will transform blood donation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: 'AI Donor Matching',
              description: 'Intelligent algorithm that matches donors with recipients in real-time',
              icon: '🤖',
              eta: 'Launching Q1 2024'
            },
            {
              title: 'Mobile Blood Tracker',
              description: 'Track your blood donation journey with gamification and rewards',
              icon: '📱',
              eta: 'Coming February 2024'
            },
            {
              title: 'Live Analytics Dashboard',
              description: 'Real-time insights on blood supply and demand across regions',
              icon: '📊',
              eta: 'Beta Available Now'
            },
            {
              title: 'Smart Chat Support',
              description: '24/7 AI-powered assistance for donors and recipients',
              icon: '💬',
              eta: 'Launching March 2024'
            },
            {
              title: 'Emergency Alert System',
              description: 'Instant notifications for critical blood shortages',
              icon: '🚨',
              eta: 'Coming Soon'
            },
            {
              title: 'Virtual Reality Tours',
              description: 'Experience the donation process before you visit',
              icon: '👓',
              eta: 'In Development'
            }
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border-2 border-yellow-200 
                       transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 mb-4">{feature.description}</p>
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-semibold rounded-full">
                  {feature.eta}
                </span>
                <button className="text-yellow-600 hover:text-yellow-700 font-medium">
                  Learn More →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div id="newsletter" className="mt-16 bg-white rounded-2xl shadow-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Be the First to Know</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Sign up for our newsletter to get early access, exclusive updates, and special offers
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border-2 border-yellow-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <button className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 text-white font-bold rounded-xl
                             hover:from-yellow-600 hover:to-amber-700 transition-all duration-300 transform hover:scale-105">
              Notify Me
            </button>
          </div>
        </div>
      </div>
    </section>
  );

 

  return (
    <div className="min-h-screen bg-white"> 
   
      {renderHeroSection()}
      {renderBloodInventory()}
      {renderEmergencyRequests()}
      {renderUpcomingEvents()}
      {renderComingSoonFeatures()}


      {/* Floating CTA Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button 
          className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-2xl 
                   transform transition-all duration-300 hover:scale-110 animate-pulse"
          onClick={() => document.getElementById('newsletter')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <Bell className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}

export default BloodBankHome;