import React, { useState } from 'react';
import { 
  Shield, 
  Home, 
  Car, 
  Heart, 
  Users,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  Star,
  Award,
  Globe,
  Calculator,
  FileText,
  Calendar,
  DollarSign,
  ArrowRight
} from 'lucide-react';

function InsuranceLandingPage() {
  const [insuranceType, setInsuranceType] = useState('');
  const [zipCode, setZipCode] = useState('');

  // Insurance types
  const insuranceTypes = [
    { 
      id: 1, 
      name: 'Health Insurance', 
      icon: <Heart className="h-8 w-8" />,
      color: 'bg-red-50 border-red-200',
      iconColor: 'text-red-600'
    },
    { 
      id: 2, 
      name: 'Auto Insurance', 
      icon: <Car className="h-8 w-8" />,
      color: 'bg-blue-50 border-blue-200',
      iconColor: 'text-blue-600'
    },
    { 
      id: 3, 
      name: 'Home Insurance', 
      icon: <Home className="h-8 w-8" />,
      color: 'bg-green-50 border-green-200',
      iconColor: 'text-green-600'
    },
    { 
      id: 4, 
      name: 'Life Insurance', 
      icon: <Users className="h-8 w-8" />,
      color: 'bg-purple-50 border-purple-200',
      iconColor: 'text-purple-600'
    },
  ];

  // Coverage options
  const coverageOptions = [
    { name: 'Comprehensive Coverage', desc: 'Full protection for all scenarios' },
    { name: 'Liability Protection', desc: 'Legal and damage coverage' },
    { name: 'Medical Payments', desc: 'Healthcare expense coverage' },
    { name: 'Property Damage', desc: 'Asset protection and repair' },
    { name: 'Personal Injury', desc: 'Accident and injury coverage' },
    { name: 'Natural Disasters', desc: 'Weather-related incident protection' },
  ];

  // Testimonials
  const testimonials = [
    { 
      name: 'Sarah Johnson',
      role: 'Small Business Owner',
      text: 'SecureShield saved me thousands when my home was damaged in a storm. Their claims process was incredibly smooth.',
      rating: 5,
      image: 'SJ'
    },
    { 
      name: 'Michael Chen',
      role: 'Family Man',
      text: 'The family health insurance plan is comprehensive and affordable. Great customer service!',
      rating: 5,
      image: 'MC'
    },
    { 
      name: 'Emma Rodriguez',
      role: 'Car Owner',
      text: 'After my accident, they handled everything. I was back on the road in no time.',
      rating: 4,
      image: 'ER'
    },
  ];

  // Partners
  const partners = [
    { name: 'Global Health', logo: '🏥' },
    { name: 'AutoSecure', logo: '🚗' },
    { name: 'HomeGuard', logo: '🏠' },
    { name: 'LifePlus', logo: '💼' },
    { name: 'TravelSafe', logo: '✈️' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* SVG Background Pattern */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#3b82f6" strokeWidth="0.5"/>
            </pattern>
            <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="#3b82f6" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>

      {/* Navigation */}
      

      {/* Hero Section */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Protect What Matters Most
              <span className="block text-blue-600">With Confidence</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Get personalized insurance coverage that fits your life and budget. 
              Trusted by over 2 million customers worldwide.
            </p>
            
            {/* Quote Calculator */}
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Get Your Free Quote</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Insurance Type
                  </label>
                  <select
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={insuranceType}
                    onChange={(e) => setInsuranceType(e.target.value)}
                  >
                    <option value="">Select Coverage Type</option>
                    <option value="health">Health Insurance</option>
                    <option value="auto">Auto Insurance</option>
                    <option value="home">Home Insurance</option>
                    <option value="life">Life Insurance</option>
                    <option value="business">Business Insurance</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Zip Code
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      className="w-full pl-12 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter zip code"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex items-end">
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition duration-300 flex items-center justify-center text-lg">
                    Calculate Premium
                    <Calculator className="ml-2 h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">95%</div>
                  <div className="text-sm text-gray-600">Claim Satisfaction</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">24/7</div>
                  <div className="text-sm text-gray-600">Support Available</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">$2.5B+</div>
                  <div className="text-sm text-gray-600">Claims Paid</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">A+</div>
                  <div className="text-sm text-gray-600">Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Insurance Types */}
      <div className="relative z-10 bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Comprehensive Coverage Options
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {insuranceTypes.map((type) => (
              <div 
                key={type.id}
                className={`${type.color} border-2 rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer`}
              >
                <div className={`${type.iconColor} mb-4`}>
                  {type.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{type.name}</h3>
                <p className="text-gray-600 mb-4">
                  Comprehensive protection tailored to your specific needs and lifestyle.
                </p>
                <button className="flex items-center text-blue-600 hover:text-blue-700 font-medium">
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="relative z-10 bg-gradient-to-r from-blue-50 to-cyan-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose SecureShield?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're committed to providing exceptional service and comprehensive protection
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <Award className="h-10 w-10 text-blue-600 mr-4" />
                <div>
                  <h3 className="text-lg font-bold text-gray-900">A-Rated Insurance</h3>
                  <p className="text-sm text-gray-600">Top financial strength rating</p>
                </div>
              </div>
              <p className="text-gray-600">
                Our A+ rating from AM Best ensures we have the financial strength to protect you.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <Globe className="h-10 w-10 text-green-600 mr-4" />
                <div>
                  <h3 className="text-lg font-bold text-gray-900">24/7 Global Support</h3>
                  <p className="text-sm text-gray-600">Always here to help</p>
                </div>
              </div>
              <p className="text-gray-600">
                Access claims assistance and customer support anytime, anywhere in the world.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <DollarSign className="h-10 w-10 text-purple-600 mr-4" />
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Best Price Guarantee</h3>
                  <p className="text-sm text-gray-600">Competitive rates</p>
                </div>
              </div>
              <p className="text-gray-600">
                We'll match any competitor's price for equivalent coverage.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Coverage Details */}
      <div className="relative z-10 bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Complete Protection for Every Aspect of Your Life
              </h2>
              <p className="text-gray-600 mb-8">
                Our comprehensive coverage options ensure you're protected against life's uncertainties. 
                From health emergencies to property damage, we've got you covered.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {coverageOptions.map((option, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900">{option.name}</h4>
                      <p className="text-sm text-gray-600">{option.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">Get Protected Today</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="bg-white/20 rounded-lg p-3 mr-4">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-bold">Easy Application</p>
                    <p className="text-blue-100">Complete online in 10 minutes</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="bg-white/20 rounded-lg p-3 mr-4">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-bold">Instant Coverage</p>
                    <p className="text-blue-100">Active immediately after approval</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="bg-white/20 rounded-lg p-3 mr-4">
                    <Shield className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-bold">Peace of Mind</p>
                    <p className="text-blue-100">24/7 protection guaranteed</p>
                  </div>
                </div>
              </div>
              
              <button className="w-full mt-8 bg-white text-blue-600 hover:bg-blue-50 font-bold py-4 px-6 rounded-lg transition duration-300">
                Start Your Application
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="relative z-10 bg-gradient-to-b from-white to-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Trusted by Thousands of Customers
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <span className="font-bold text-blue-600">{testimonial.image}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <p className="text-gray-600 italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Partners */}
      <div className="relative z-10 bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-lg font-medium text-center text-gray-600 mb-8">
            Trusted by leading organizations worldwide
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {partners.map((partner, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl mb-2">{partner.logo}</div>
                <div className="font-medium text-gray-700">{partner.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Shield className="h-8 w-8 text-blue-400" />
                <span className="ml-2 text-xl font-bold">SecureShield</span>
              </div>
              <p className="text-gray-400 mb-4">
                Protecting families and businesses for over 30 years with reliable insurance solutions.
              </p>
              <div className="flex space-x-4">
                <Phone className="h-5 w-5 text-gray-400" />
                <Mail className="h-5 w-5 text-gray-400" />
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 text-lg">Products</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Health Insurance</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Auto Insurance</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Home Insurance</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Life Insurance</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 text-lg">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Claims Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Policy Documents</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Risk Assessment</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 text-lg">Contact Us</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-center">
                  <Phone className="h-5 w-5 mr-3 text-blue-400" />
                  <span>1-800-SHIELD-NOW</span>
                </li>
                <li className="flex items-center">
                  <Mail className="h-5 w-5 mr-3 text-blue-400" />
                  <span>support@secureshield.com</span>
                </li>
                <li className="flex items-center">
                  <MapPin className="h-5 w-5 mr-3 text-blue-400" />
                  <span>123 Security Blvd, Safe City</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2023 SecureShield Insurance. All rights reserved. Insurance products underwritten by SecureShield Insurance Company.</p>
            <p className="mt-2 text-sm">This is for demonstration purposes only. Always consult with a licensed insurance agent for your specific needs.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InsuranceLandingPage;