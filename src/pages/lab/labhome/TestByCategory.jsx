// src/pages/lab/labhome/TestByCategory.jsx
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchTestByVitalOrgan } from '../../../redux/features/labSilice';
import { useAuth } from '../../../Authorization/AuthContext';
import { useNavigate } from 'react-router-dom';

function TestByCategory() {
    const dispatch = useDispatch();
    const { latitude, longitude } = useAuth();
    const navigate = useNavigate()
    const [distance, setDistance] = useState(5);
    const [categoryList, setCategoryList] = useState([]);
    const [symtomList, setSymtomList] = useState([]);
    const [vitalOrganList, setVitalOrganList] = useState([]);
    const [activeTab, setActiveTab] = useState('category');

    const { organList, loading } = useSelector((state) => state.packages);

    useEffect(() => {
        if (organList?.response) {
            setCategoryList(organList.response.category || []);
            setSymtomList(organList.response.symptom || []);
            setVitalOrganList(organList.response.vitalOrgan || []);
        }
    }, [organList]);

    useEffect(() => {
        dispatch(fetchTestByVitalOrgan({ latitude, longitude, distance }));
    }, [latitude, longitude, distance]);

    const CategoryCard = ({ item, type, index }) => {
        const [isHovered, setIsHovered] = useState(false);

        const getTypeStyles = () => {
            switch (type) {
                case 'category':
                    return {
                        gradient: 'from-teal-500 via-teal-700 to-teal-400',
                        bg: '',
                        text: 'text-blue-600',
                        icon: (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        )
                    };
                case 'disease':
                    return {
                        gradient: 'from-teal-200 via-teal-500 to-teal-500',
                        bg: 'bg-red-50',
                        text: 'text-red-600',
                        icon: (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        )
                    };
                case 'symptom':
                    return {
                        gradient: 'from-green-200 via-teal-500 to-teal-700',
                        bg: 'bg-green-50',
                        text: 'text-green-600',
                        icon: (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        )
                    };
                case 'vitalOrgan':
                    return {
                        gradient: 'from-teal-200 via-teal-500 to-teal-800',
                        bg: 'bg-purple-50',
                        text: 'text-purple-600',
                        icon: (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        )
                    };
                default:
                    return {
                        gradient: 'from-gray-500 via-gray-600 to-gray-700',
                        bg: 'bg-gray-50',
                        text: 'text-gray-600',
                        icon: null
                    };
            }
        };

        const styles = getTypeStyles();

        return (

            <div
                className={`relative p-0.5 rounded-2xl  bg-gradient-to-r ${styles.gradient} transition-all  duration-500 transform hover:cursor-pointer hover:shadow-2xl group`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={() => navigate('/lab/package/Alltests', { state: item })}
            >
                <div className="relative bg-white rounded-2xl p-4 h-full backdrop-blur-sm">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                        <div className={`p-2 rounded-xl ${styles.bg} transition-colors duration-300`}>
                            {styles.icon}
                        </div>
                        <div className={`text-right transition-all duration-300 transform group-hover:scale-110`}>
                            <span className="text-2xl font-bold text-gray-900  ">{item.count}</span>
                            <p className="text-xs text-gray-500">Tests</p>
                        </div>
                    </div>

                    {/* Content */}
                    <div>
                        <h3 className="font-semibold text-gray-900 text-sm md:text-base mb-2 line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-gray-700 transition-all duration-300">
                            {item.name}
                        </h3>
                        <p className="text-xs text-gray-500 capitalize mb-3">
                            {type.replace(/([A-Z])/g, ' $1').trim()}
                        </p>
                    </div>



                    {/* Action Button */}
                    <button className={`w-full cursor-pointer py-2 text-xs font-semibold rounded-xl transition-all duration-300 transform border border-gray-300 text-teal-700 hover:bg-teal-50 hover:scale-105 flex items-center justify-center mt-4 group`} >
                        View Tests
                        <svg className="w-3 h-3 inline-block ml-1 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        );
    };

    const TabButton = ({ tab, label, count, icon, isActive }) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium text-sm border-2 ${isActive
                ? 'border-teal-500 bg-teal-50 text-teal-700 shadow-md'
                : 'border-gray-200 bg-white text-gray-700 hover:border-teal-300 hover:bg-teal-50'
                }`}
        >
            {icon}
            <span className="font-semibold">{label}</span>
            {count > 0 && (
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${isActive ? 'bg-teal-500 text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                    {count}
                </span>
            )}
        </button>
    );

    const renderContent = () => {
        const data =
            activeTab === 'category' ? categoryList :
                    activeTab === 'symptom' ? symtomList :
                        vitalOrganList;

        const type = activeTab;

        if (loading) {
            return (
                <div className=" grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {[...Array(10)].map((_, index) => (
                        <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 animate-pulse">
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-10 h-10 bg-gray-200 rounded-xl"></div>
                                <div className="text-right">
                                    <div className="h-6 w-8 bg-gray-200 rounded mb-1"></div>
                                    <div className="h-3 w-12 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
                            <div className="h-2 bg-gray-200 rounded w-full mb-2"></div>
                            <div className="h-8 bg-gray-200 rounded w-full"></div>
                        </div>
                    ))}
                </div>
            );
        }

        if (!data || data.length === 0) {
            return (
                <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
                    <div className="w-16 h-16 mx-auto mb-4 text-gray-300">
                        <svg fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No {activeTab} data found</h3>
                    <p className="text-gray-600">Try adjusting your search criteria</p>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                {data.map((item, index) => (
                    <CategoryCard key={index} item={item} type={type} index={index} />
                ))}
            </div>
        );
    };

    return (
        <div className="w-full  mx-auto  py-8">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                    Find Tests by Category
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Browse medical tests organized by categories, diseases, symptoms, and vital organs
                </p>
            </div>

            {/* Distance Filter */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Search within distance:
                        </label>
                        <div className="flex items-center space-x-3">
                            <input
                                type="range"
                                min="1"
                                max="50"
                                value={distance}
                                onChange={(e) => setDistance(parseInt(e.target.value))}
                                className="w-32 md:w-48 h-2 bg-teal-700 rounded-lg appearance-none cursor-pointer slider text-teal-700"
                            />
                            <span className="text-sm font-semibold text-teal-700 bg-teal-50 px-3 py-1 rounded-full">
                                {distance} km
                            </span>
                        </div>
                    </div>
                    <div className="text-sm text-gray-500">
                        Showing tests near your location
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-3 mb-8">
                <TabButton
                    tab="category"
                    label="Categories"
                    count={categoryList.length}
                    isActive={activeTab === 'category'}
                    icon={
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                    }
                />
                
                <TabButton
                    tab="symptom"
                    label="Symptoms"
                    count={symtomList.length}
                    isActive={activeTab === 'symptom'}
                    icon={
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    }
                />
                <TabButton
                    tab="vitalOrgan"
                    label="Vital Organs"
                    count={vitalOrganList.length}
                    isActive={activeTab === 'vitalOrgan'}
                    icon={
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    }
                />
            </div>

            {/* Content Grid */}
            {renderContent()}

            {/* Results Count */}
            {!loading && (
                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        {' '}
                        <span className="font-semibold text-teal-700">
                            {activeTab === 'category' ? categoryList.length :
                                    activeTab === 'symptom' ? symtomList.length :
                                        vitalOrganList.length}
                        </span>{' '}
                        {activeTab.replace(/([A-Z])/g, ' $1').trim().toLowerCase()} in your area
                    </p>
                </div>
            )}
        </div>
    );
}

export default TestByCategory;