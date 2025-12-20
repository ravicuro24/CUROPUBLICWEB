// src/pages/insurance/InsuranceHome.jsx
import React, { useState, useEffect } from 'react';
import {
  Shield,
  Home,
  Car,
  Heart,
  Users,
  CheckCircle,
  MapPin,
  Star,
  Award,
  Globe,
  Calculator,
  FileText,
  Calendar,
  ArrowRight,
  Clock,
  Bell,
  Rocket,
  Target,
  Zap
} from 'lucide-react';
import { LuIndianRupee } from "react-icons/lu";

function InsuranceHome() {
  const [email, setEmail] = useState('');
  const [subscribers, setSubscribers] = useState(12543);
  const [daysLeft, setDaysLeft] = useState(45);
  const [progress, setProgress] = useState(75);

  // Animation for counter
  useEffect(() => {
    const interval = setInterval(() => {
      setSubscribers(prev => prev + Math.floor(Math.random() * 10));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Insurance types with coming soon badges
  const insuranceTypes = [
    {
      id: 1,
      name: 'Health Insurance',
      icon: <Heart className="h-10 w-10" />,
      color: 'bg-red-50 border-red-200',
      iconColor: 'text-red-600',
      status: 'Coming Soon',
      launchDate: 'Q1 2024'
    },   
   
    {
      id: 4,
      name: 'Life Insurance',
      icon: <Users className="h-10 w-10" />,
      color: 'bg-purple-50 border-purple-200',
      iconColor: 'text-purple-600',
      status: 'Planning',
      launchDate: 'Q3 2024'
    },
  ];

  // Features we're building
  const features = [
    {
      title: 'AI-Powered Risk Assessment',
      description: 'Smart algorithms for personalized coverage',
      icon: <Zap className="h-6 w-6" />,
      progress: 85
    },
    {
      title: 'Instant Claim Processing',
      description: 'Get claims approved in minutes, not weeks',
      icon: <Clock className="h-6 w-6" />,
      progress: 70
    },
    {
      title: 'Mobile-First Experience',
      description: 'Manage everything from your smartphone',
      icon: <Rocket className="h-6 w-6" />,
      progress: 90
    },
    {
      title: 'Smart Policy Management',
      description: 'One dashboard for all your policies',
      icon: <Target className="h-6 w-6" />,
      progress: 65
    },
  ];

  // Launch timeline
  const timeline = [
    { phase: 'Research & Planning', date: 'Completed', status: 'done' },
    { phase: 'UI/UX Design', date: 'Completed', status: 'done' },
    { phase: 'Development Phase', date: 'In Progress', status: 'current' },
    { phase: 'Beta Testing', date: 'Q4 2023', status: 'pending' },
    { phase: 'Public Launch', date: 'Q1 2024', status: 'pending' },
  ];

  const handleNotifyMe = (e) => {
    e.preventDefault();
    if (email) {
      alert(`Thank you! We'll notify you at ${email} when we launch.`);
      setEmail('');
      setSubscribers(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, #3b82f6 2px, transparent 2px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
         
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          
            <span className="block text-blue-600 mt-2">Coming Soon .....</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            We're building a next-generation insurance platform that makes protection
            smart, simple, and accessible for everyone.
          </p>
          
          {/* Countdown Stats */}
          
        </div>

        {/* Progress Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Development Progress</h2>
            <span className="text-sm font-medium text-blue-600">{progress}% Complete</span>
          </div>
          
          <div className="mb-8">
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-1000"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-center mb-3">
                  <div className="p-2 bg-blue-50 rounded-lg mr-3">
                    <div className="text-blue-600">
                      {feature.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden mr-3">
                    <div 
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${feature.progress}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-blue-600">
                    {feature.progress}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Insurance Products Preview */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-start text-gray-900 mb-12">
            Insurance Products We're Building
          </h2>
          
          <div className="flex flex-row justify-start items-center gap-2">
            {insuranceTypes.map((type) => (
              <div
                key={type.id}
                className={`${type.color} border rounded-xl p-6 relative overflow-hidden group hover:shadow-lg transition-all duration-300 w-70 h-60`}
              >
                {/* Coming Soon Badge */}
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                    {type.status}
                  </span>
                </div>
                
                <div className={`${type.iconColor} mb-4`}>
                  {type.icon}
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">{type.name}</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Launching {type.launchDate}
                </p>
                
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>Coming Soon</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Launch Timeline</h2>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-white/30" />
            
            {timeline.map((item, index) => (
              <div key={index} className="relative flex items-start mb-8 last:mb-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 z-10 ${
                  item.status === 'done' ? 'bg-green-400' :
                  item.status === 'current' ? 'bg-yellow-400 animate-pulse' :
                  'bg-white/30'
                }`}>
                  {item.status === 'done' ? (
                    <CheckCircle className="h-5 w-5 text-white" />
                  ) : (
                    <div className="w-3 h-3 rounded-full bg-white" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-bold text-lg">{item.phase}</h3>
                    <span className="text-blue-100">{item.date}</span>
                  </div>
                  <div className={`h-2 rounded-full ${
                    item.status === 'done' ? 'bg-green-400' :
                    item.status === 'current' ? 'bg-yellow-400' :
                    'bg-white/20'
                  }`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notification Signup */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
              <Bell className="h-8 w-8 text-blue-600" />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Get Notified When We Launch
            </h2>
            
            <p className="text-gray-600 mb-8">
              Be the first to experience our revolutionary insurance platform.
              Early subscribers get exclusive benefits and priority access.
            </p>
            
            <form onSubmit={handleNotifyMe} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition duration-300 flex items-center justify-center"
                >
                  Notify Me
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-3">
                Join {subscribers.toLocaleString()}+ others waiting for launch
              </p>
            </form>
          </div>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">AI-Powered Protection</h3>
            <p className="text-gray-600 text-sm">
              Smart algorithms that understand your unique needs
            </p>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
              <LuIndianRupee className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Transparent Pricing</h3>
            <p className="text-gray-600 text-sm">
              No hidden fees, just honest pricing you can trust
            </p>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4">
              <Globe className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">24/7 Digital Support</h3>
            <p className="text-gray-600 text-sm">
              Get help anytime, anywhere through our app
            </p>
          </div>
        </div>

        {/* Footer */}
        
      </div>

      {/* Animated Elements */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .floating {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
      
      {/* Floating Elements */}
      <div className="hidden md:block">
        <div className="absolute top-20 left-10 floating">
          <div className="w-8 h-8 bg-blue-200/30 rounded-full" />
        </div>
        <div className="absolute bottom-40 right-10 floating" style={{ animationDelay: '1s' }}>
          <div className="w-6 h-6 bg-blue-300/30 rounded-full" />
        </div>
        <div className="absolute top-1/3 right-20 floating" style={{ animationDelay: '2s' }}>
          <div className="w-4 h-4 bg-blue-400/30 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export default InsuranceHome;