// src/pages/doctor/doctorHome/quickConsult/FilterDoctorList.jsx
import React, { useEffect, useState } from 'react';
import {
  Search,
  Filter,
  Star,
  MapPin,
  Clock,
  CheckCircle,
  Award,
  Users,
  Calendar,
  X,
  Heart,
  MessageCircle,
  Phone
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { RiStethoscopeFill } from "react-icons/ri";
import { CiSearch } from "react-icons/ci";
import DoctorAllSymptoms from '../DoctorAllSymtoms';
import DoctorAllCategory from '../DoctorAllCategory';
import { useAuth } from '../../../../Authorization/AuthContext';
import axiosInstance from '../../../../Authorization/axiosInstance';

function FilterDoctorList() {
  // Destructure values from your auth context
  const { symptomsId = [], specializationId = [] } = useAuth();

  // Initialize state with the values from context
  const [selectedCategories, setSelectedCategories] = useState([]); // Changed to array for multiple
  const [selectedCategoryNames, setSelectedCategoryNames] = useState([]); // Changed to array
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [selectedSymptomNames, setSelectedSymptomNames] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    // Initialize filters from context
    initializeFiltersFromContext();
  }, []);

  useEffect(() => {
    // Update filters when context changes
    initializeFiltersFromContext();
  }, [specializationId, symptomsId]);

  // Helper function to extract specializations from context
  const extractSpecializationsFromContext = () => {
    const categories = [];
    const categoryNames = [];

    if (!specializationId || !Array.isArray(specializationId)) {
      return { categories, categoryNames };
    }

    console.log("Processing specializationId:", specializationId);

    // Process each item in the specializationId array
    specializationId.forEach(item => {
      if (item === null || item === undefined) return;

      // If item is an object with name property
      if (typeof item === 'object') {
        if (item.name) {
          // Use id if available, otherwise use name as id
          const id = item.id || item.name;
          categories.push(id);
          categoryNames.push(item.name);
        }
        // If there's a nested array, process it recursively
        else if (Array.isArray(item)) {
          const nested = extractSpecializationsFromArray(item);
          categories.push(...nested.categories);
          categoryNames.push(...nested.categoryNames);
        }
      }
      // If item is an array (nested structure)
      else if (Array.isArray(item)) {
        const nested = extractSpecializationsFromArray(item);
        categories.push(...nested.categories);
        categoryNames.push(...nested.categoryNames);
      }
      // If item is a string (ID)
      else if (typeof item === 'string' && item.trim() !== '') {
        categories.push(item);
        // Try to extract name from object in the array
        const nameObj = specializationId.find(x =>
          typeof x === 'object' && x !== null && (x.id === item || x.name === item)
        );
        categoryNames.push(nameObj?.name || item);
      }
    });

    return { categories, categoryNames };
  };

  // Helper to extract from nested arrays
  const extractSpecializationsFromArray = (arr) => {
    const categories = [];
    const categoryNames = [];

    arr.forEach(item => {
      if (item === null || item === undefined) return;

      if (typeof item === 'object' && item.name) {
        const id = item.id || item.name;
        categories.push(id);
        categoryNames.push(item.name);
      } else if (typeof item === 'string' && item.trim() !== '') {
        categories.push(item);
        const nameObj = arr.find(x =>
          typeof x === 'object' && x !== null && (x.id === item || x.name === item)
        );
        categoryNames.push(nameObj?.name || item);
      }
    });

    return { categories, categoryNames };
  };

  const initializeFiltersFromContext = () => {
    console.log("Initializing filters from context...");
    console.log("Raw specializationId:", specializationId);

    // Handle specializations
    const { categories, categoryNames } = extractSpecializationsFromContext();

    if (categories.length > 0) {
      console.log("Setting categories:", categories);
      console.log("Setting category names:", categoryNames);
      setSelectedCategories(categories);
      setSelectedCategoryNames(categoryNames);
    } else {
      setSelectedCategories([]);
      setSelectedCategoryNames([]);
    }

    // Handle symptoms
    if (symptomsId && symptomsId.length > 0) {
      const symptomIds = [];
      const symptomNames = [];

      symptomsId.forEach(symptom => {
        if (typeof symptom === 'object' && symptom !== null) {
          if (symptom.id && symptom.name) {
            symptomIds.push(symptom.id);
            symptomNames.push(symptom.name);
          } else if (symptom.name) {
            symptomIds.push(symptom.name);
            symptomNames.push(symptom.name);
          }
        } else if (typeof symptom === 'string' || typeof symptom === 'number') {
          symptomIds.push(symptom);
          symptomNames.push(getSymptomNameById(symptom));
        }
      });

      console.log("Setting symptoms:", { symptomIds, symptomNames });
      setSelectedSymptoms(symptomIds);
      setSelectedSymptomNames(symptomNames);
    } else {
      setSelectedSymptoms([]);
      setSelectedSymptomNames([]);
    }

    // Fetch doctors if we have filters
    if (specializationId.length > 0 || symptomsId.length > 0) {
      getFilteredDoctors();
    }
  };

  // Helper function to get symptom name by ID
  const getSymptomNameById = (id) => {
    return id.toString();
  };

  // Update filtered doctors when filters change
  useEffect(() => {
    // Debounce API calls when filters change
    const timeoutId = setTimeout(() => {
      if (selectedCategories.length > 0 || selectedSymptoms.length > 0) {
        getFilteredDoctors();
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [selectedCategories, selectedSymptoms]);

  const handleBookAppointment = (doctor) => {
    navigate('/doctor/quick-consult/payment', { state: { doctor } });
  };

  const getFilteredDoctors = async () => {
    setLoading(true);
    try {
      // Build payload with multiple specializations
      const payload = {
        // Send array of specialization IDs
        specializationId: selectedCategories.length > 0 ? selectedCategories : [],

        // Convert symptom IDs
        symptomIds: selectedSymptoms.map(id => {
          if (typeof id === 'number') return id;
          const parsedId = parseInt(id);
          return isNaN(parsedId) ? id : parsedId;
        })
      };

      console.log("Fetching doctors with payload:", JSON.stringify(payload, null, 2));

      const response = await axiosInstance.post("/doctor/filter", payload);
      console.log("Fetched doctors:", response.data);

      // Update the state with real data from the API
      setDoctors(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching filtered doctors:", error);
      if (error.response) {
        console.error("Response error:", error.response.data);
        console.error("Response status:", error.response.status);
      }
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleSymptom = (symptomId, symptomName) => {
    setSelectedSymptoms(prev => {
      if (prev.includes(symptomId)) {
        const newSymptoms = prev.filter(s => s !== symptomId);
        setSelectedSymptomNames(prevNames =>
          prevNames.filter(name => name !== symptomName)
        );
        return newSymptoms;
      } else {
        const newSymptoms = [...prev, symptomId];
        setSelectedSymptomNames(prevNames => [...prevNames, symptomName]);
        return newSymptoms;
      }
    });
  };

  const toggleCategory = (categoryId, categoryName = '') => {
    console.log("Toggling category:", categoryId, categoryName);
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        // Remove category
        const newCategories = prev.filter(c => c !== categoryId);
        // Remove corresponding name
        setSelectedCategoryNames(prevNames =>
          prevNames.filter((name, index) => prev[index] !== categoryId)
        );
        return newCategories;
      } else {
        // Add category
        const newCategories = [...prev, categoryId];
        // Add corresponding name
        setSelectedCategoryNames(prevNames => [...prevNames, categoryName || categoryId]);
        return newCategories;
      }
    });
  };

  const handleCategorySelect = (categoryId, categoryName = '') => {
    console.log("Category selected:", categoryId, categoryName);
    toggleCategory(categoryId, categoryName);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedCategoryNames([]);
    setSelectedSymptoms([]);
    setSelectedSymptomNames([]);
    setSearchQuery('');
    setShowSearchInput(false);
  };

  const placeholders = [
    "Search doctors...",
    "Search clinics...",
    "Search clinics...",
    "Search symptoms (fever, cough...)",
    "Search specialties (cardiologist, dentist...)"
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(prev => (prev + 1) % placeholders.length);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Filter doctors based on search query
  const filteredDoctors = doctors.filter(doctor => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        (doctor.name && doctor.name.toLowerCase().includes(query)) ||
        (doctor.firstName && `${doctor.firstName} ${doctor.lastName || ''}`.toLowerCase().includes(query)) ||
        (doctor.specialization && doctor.specialization.toLowerCase().includes(query)) ||
        (doctor.qualification && doctor.qualification.toLowerCase().includes(query))
      );
    }
    return true;
  });

  // Update DoctorAllSymptoms usage to pass symptom names
  const handleSymptomSelectFromComponent = (symptomId, symptomName) => {
    toggleSymptom(symptomId, symptomName);
  };

  return (
    <div className="min-h-screen mt-4">
      {/* Hero Section */}
      <div className="">
        <div className="container mx-auto px-4">
          <h1 className="text-sm md:text-lg mb-2">
            Find the right specialist for your needs and consult instantly.
          </h1>
          {/* Main Search Bar */}
          <div className="w-full">
            <label className="input border w-full flex items-center gap-2">
              <CiSearch className="text-gray-500 text-lg" />
              <input
                type="search"
                className="w-full"
                placeholder={placeholders[index]}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    getFilteredDoctors();
                  }
                }}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Common Symptoms Section */}
        <DoctorAllSymptoms
          page={"quickConsult"}
          selectedSymptoms={selectedSymptoms}
          onSymptomSelect={handleSymptomSelectFromComponent}
        />

        {/* Medical Specialties */}
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Explore Medical Specialties</h2>
          <DoctorAllCategory
            page={"quickConsult"}
            selectedCategory={selectedCategories} // Pass array instead of single value
            onCategorySelect={handleCategorySelect}
            isMultiSelect={true} // Add this prop if DoctorAllCategory supports it
          />
        </div>

        {/* Filter Status */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex flex-wrap items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-700">Active Filters:</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedCategoryNames.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedCategoryNames.map((categoryName, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-800"
                      >
                        {categoryName}
                        <button
                          onClick={() => {
                            // Remove this specific category
                            const categoryId = selectedCategories[index];
                            toggleCategory(categoryId, categoryName);
                          }}
                          className="ml-2 text-teal-600 hover:text-teal-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                {selectedSymptomNames.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedSymptomNames.map((symptomName, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                      >
                        {symptomName}
                        <button
                          onClick={() => {
                            const symptomId = selectedSymptoms[index];
                            toggleSymptom(symptomId, symptomName);
                          }}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition duration-200"
            >
              Clear all filters
            </button>
          </div>
        </div>

        {/* Available Doctors */}
        <div className="m-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm md:text-xl font-bold text-gray-900">
              Currently Available Doctors
              {loading && <span className="ml-2 text-sm text-teal-600">(Loading...)</span>}
            </h2>
            {/* <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  setSelectedCategories([]);
                  setSelectedCategoryNames([]);
                }}
                className={`px-3 py-1 text-sm rounded-full ${selectedCategories.length === 0
                  ? 'bg-teal-100 text-teal-700'
                  : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                All
              </button>
              <button
                onClick={clearFilters}
                className="text-[9px] md:text-sm text-gray-500 hover:text-gray-700"
              >
                Clear filters
              </button>
            </div> */}
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
            </div>
          ) : filteredDoctors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredDoctors.map((doctor) => (
                <div
                  onClick={() => navigate('/doctor/quick/doctor-details', { state: { doctor } })}
                  key={doctor.id || doctor.doctorId}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer"
                >
                  <div className="p-5">
                    {/* Doctor Header */}
                    <div className="flex flex-col items-center justify-center mb-4">
                      <div className="flex flex-col items-center space-x-3">
                        {/* Profile Image */}
                        <div className="w-14 h-14 rounded-full flex items-center justify-center">
                          <img
                            src={doctor.profilePicture || doctor.bannerImage || doctor.image || "https://via.placeholder.com/150"}
                            alt={`${doctor.firstName || ''} ${doctor.lastName || ''}`}
                            className="rounded-full h-10 w-10 object-cover"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/150";
                            }}
                          />
                        </div>

                        {/* Name + Speciality */}
                        <div className="text-center">
                          <h3 className="font-bold text-gray-900">
                            {doctor.name || `Dr. ${doctor.firstName || ''} ${doctor.lastName || ''}`.trim()}
                          </h3>

                          <div className="flex items-center justify-center mt-1">
                            <p className="text-teal-600 text-xs font-medium">
                              {doctor.specialization || doctor.specialty || "General Practitioner"}
                            </p>

                            {doctor.isVerified && (
                              <CheckCircle className="w-4 h-4 text-teal-500 ml-2" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Experience and Rating */}
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <div className="flex items-center">
                        <span className="text-gray-600 text-sm">
                          {doctor.yearsOfExperience || doctor.experience || "5"} years experience
                        </span>
                      </div>
                      <div className="flex items-center px-2 py-1 rounded">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="ml-1 font-medium">{doctor.rating || doctor.avgRating || "4.5"}</span>
                      </div>
                    </div>

                    {/* Languages */}
                    <div className="mb-4 flex justify-center">
                      <div className="bg-blue-50 text-blue-600 text-center text-[10px] px-2 py-1 rounded-full">
                        {doctor.availability || "Available Today"}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookAppointment(doctor);
                        }}
                        className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-2 cursor-pointer rounded-lg font-medium transition duration-200 flex items-center justify-center"
                      >
                        Contact Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No doctors found
              </h3>
              <p className="text-gray-500 mb-6">
                {doctors.length === 0
                  ? "Try adjusting your filters or search criteria"
                  : "No doctors match your search query"}
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition duration-200"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>

        {/* Load More */}
        {filteredDoctors.length > 0 && (
          <div className="text-center">
            <button
              onClick={getFilteredDoctors}
              className="px-8 py-3 border-2 border-teal-600 text-teal-600 rounded-lg hover:bg-teal-50 transition duration-200 font-medium"
            >
              Load More Doctors
            </button>
          </div>
        )}
      </div>

      {/* Mobile Filter Panel */}
      {showFilterPanel && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="absolute bottom-0 left-0 right-0  rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Filters</h3>
              <button
                onClick={() => setShowFilterPanel(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-6">
              <h4 className="font-medium text-gray-700 mb-3">Active Filters</h4>
              <div className="space-y-2">
                <div className="text-sm">
                  <p><strong>Specializations:</strong> {selectedCategoryNames.length > 0 ? selectedCategoryNames.join(', ') : 'All'}</p>
                  <p><strong>Symptoms:</strong> {selectedSymptomNames.join(', ') || 'None'}</p>
                </div>
              </div>
            </div>

            <button
              onClick={clearFilters}
              className="w-full py-3 bg-red-50 text-red-600 rounded-lg font-medium"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 px-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowSearchInput(!showSearchInput)}
            className="flex-1 flex flex-col items-center text-gray-600"
          >
            <Search className="w-5 h-5 mb-1" />
            <span className="text-xs">Search</span>
          </button>
          <button
            onClick={() => setShowFilterPanel(true)}
            className="flex-1 flex flex-col items-center text-gray-600 relative"
          >
            <Filter className="w-5 h-5 mb-1" />
            <span className="text-xs">Filter</span>
            {(selectedCategories.length > 0 || selectedSymptoms.length > 0) && (
              <span className="absolute top-2 right-1/4 bg-teal-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {selectedCategories.length + selectedSymptoms.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {showSearchInput && (
        <div className="lg:hidden fixed inset-0 bg-white z-50 p-4">
          <div className="flex items-center mb-6">
            <button
              onClick={() => setShowSearchInput(false)}
              className="mr-4"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search doctors, clinics, or conditions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg"
                autoFocus
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    getFilteredDoctors();
                    setShowSearchInput(false);
                  }
                }}
              />
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="font-medium text-gray-700">Recent Searches</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setSearchQuery('Cardiologist');
                  getFilteredDoctors();
                  setShowSearchInput(false);
                }}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                Cardiologist
              </button>
              <button
                onClick={() => {
                  setSearchQuery('Fever');
                  getFilteredDoctors();
                  setShowSearchInput(false);
                }}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                Fever
              </button>
              <button
                onClick={() => {
                  setSearchQuery('Dermatology');
                  getFilteredDoctors();
                  setShowSearchInput(false);
                }}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                Dermatology
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FilterDoctorList;