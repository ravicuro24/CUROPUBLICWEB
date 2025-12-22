// src/component/InvestorRelations.jsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHardHat, FaChartLine, FaFileAlt, FaCalendarAlt, FaDownload, FaEnvelope, FaPhone } from 'react-icons/fa';
import { MdConstruction, MdOutlineEngineering } from 'react-icons/md';

function InvestorRelations() {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">

                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Investor Relations
                    </h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Connecting investors with Curo24's vision for the future of healthcare
                    </p>
                </div>

                {/* Construction/Development Banner */}
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg shadow-sm mb-12">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <MdConstruction className="h-12 w-12 text-yellow-500" />
                        </div>
                        <div className="ml-4">
                            <h3 className="text-xl font-semibold text-yellow-800 mb-2">
                                🚧 Page Under Development
                            </h3>
                            <div className="text-yellow-700">
                                <p className="mb-2">
                                    We're currently building our Investor Relations portal to provide you with comprehensive
                                    financial information, reports, and investor resources.
                                </p>
                                <p>
                                    This section will be available soon with detailed insights into our growth, performance,
                                    and future plans.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Coming Soon Features */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
                        What to Expect
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200">
                            <div className="flex items-center mb-4">
                                <div className="p-3 bg-blue-100 rounded-lg mr-4">
                                    <FaChartLine className="h-8 w-8 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800">Financial Reports</h3>
                            </div>
                            <p className="text-gray-600">
                                Quarterly and annual financial statements, earnings releases, and SEC filings.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200">
                            <div className="flex items-center mb-4">
                                <div className="p-3 bg-green-100 rounded-lg mr-4">
                                    <FaFileAlt className="h-8 w-8 text-green-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800">Investor Presentations</h3>
                            </div>
                            <p className="text-gray-600">
                                Latest investor decks, roadshow materials, and corporate presentations.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200">
                            <div className="flex items-center mb-4">
                                <div className="p-3 bg-purple-100 rounded-lg mr-4">
                                    <FaCalendarAlt className="h-8 w-8 text-purple-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800">Events & Webcasts</h3>
                            </div>
                            <p className="text-gray-600">
                                Upcoming earnings calls, investor conferences, and virtual events calendar.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200">
                            <div className="flex items-center mb-4">
                                <div className="p-3 bg-red-100 rounded-lg mr-4">
                                    <FaDownload className="h-8 w-8 text-red-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800">Resources & Downloads</h3>
                            </div>
                            <p className="text-gray-600">
                                Financial data, stock information, governance documents, and fact sheets.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200">
                            <div className="flex items-center mb-4">
                                <div className="p-3 bg-teal-100 rounded-lg mr-4">
                                    <MdOutlineEngineering className="h-8 w-8 text-teal-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800">Corporate Governance</h3>
                            </div>
                            <p className="text-gray-600">
                                Board of directors, committee charters, ethics policies, and sustainability reports.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200">
                            <div className="flex items-center mb-4">
                                <div className="p-3 bg-indigo-100 rounded-lg mr-4">
                                    <FaHardHat className="h-8 w-8 text-indigo-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800">Construction Progress</h3>
                            </div>
                            <p className="text-gray-600">
                                This page is 65% complete. We're working hard to launch it soon!
                            </p>
                            <div className="mt-4">
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div className="bg-teal-600 h-2.5 rounded-full" style={{ width: '65%' }}></div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Contact Information for Investors */}
                <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-2xl p-8 shadow-lg border border-teal-100">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">
                            Contact Investor Relations
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            For immediate investor inquiries while we build our portal
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <div className="flex items-start mb-4">
                                <FaEnvelope className="h-6 w-6 text-teal-600 mt-1 mr-3" />
                                <div>
                                    <h3 className="font-semibold text-gray-800 text-lg">Email</h3>
                                    <a
                                        href="mailto:investors@curo24.com"
                                        className="text-teal-700 hover:text-teal-900 transition-colors"
                                    >
                                        investors@curo24.com
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <div className="flex items-start mb-4">
                                <FaPhone className="h-6 w-6 text-teal-600 mt-1 mr-3" />
                                <div>
                                    <h3 className="font-semibold text-gray-800 text-lg">Phone</h3>
                                    <a
                                        href="tel:+1800INVESTOR"
                                        className="text-teal-700 hover:text-teal-900 transition-colors"
                                    >
                                        +1 (800) INVESTOR
                                    </a>
                                    <p className="text-sm text-gray-500 mt-1">Mon-Fri, 9AM-5PM EST</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-center mt-8">
                        <p className="text-gray-600 italic">
                            "Building the future of healthcare, one investment at a time."
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                            — Curo24 Leadership Team
                        </p>
                    </div>
                </div>

                {/* Back to Home Link */}
                <div className="text-center mt-12">
                    <Link
                        to="/"
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 transition-colors duration-300"
                    >
                        Return to Homepage
                    </Link>
                    <p className="text-gray-500 text-sm mt-4">
                        Thank you for your patience as we enhance your investor experience
                    </p>
                </div>

                {/* Footer Note */}
                <div className="mt-16 pt-8 border-t border-gray-200 text-center">
                    <p className="text-gray-500">
                        Curo24 Digital Health Services Pvt Ltd • Registered Office: [Address] • CIN: [Company Identification Number]
                    </p>
                    <p className="text-gray-400 text-sm mt-2">
                        This Investor Relations section is expected to launch in Q2 2024
                    </p>
                </div>

            </div>
        </div>
    );
}

export default InvestorRelations;