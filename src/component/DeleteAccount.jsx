// src/component/DeleteAccount.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function DeleteAccount() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmationText, setConfirmationText] = useState('');
    const navigate = useNavigate();

    const handleDeleteAccount = () => {
        // Handle account deletion logic here
        setIsModalOpen(true);
    };

    const confirmDelete = () => {
        // API call to delete account
        console.log('Account deletion confirmed');
        // After successful deletion:
        // navigate('/login');
        setIsModalOpen(false);
    };

    const steps = [
        {
            number: 1,
            title: "Navigate to Your Profile",
            description: "Click on your profile picture or name in the top right corner",
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            )
        },
        {
            number: 2,
            title: "Access Account Settings",
            description: "Select 'Settings & Privacy' from the dropdown menu",
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            )
        },
        {
            number: 3,
            title: "Find Delete Option",
            description: "Scroll to 'Account Preferences' and click 'Delete Account'",
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            )
        },
        {
            number: 4,
            title: "Confirm Deletion",
            description: "Enter your password and type 'DELETE' to confirm",
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
            <div className="md:container w-full mx-auto px-4">
                <div className=" bg-white/70 p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Delete Your Account</h1>
                        <p className="text-gray-600 text-lg">
                            This action is permanent and cannot be undone
                        </p>
                    </div>

                    {/* Warning Banner */}
                    <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 rounded-r-lg p-6 mb-10 shadow-sm">
                        <div className="flex items-start">
                            <svg className="w-6 h-6 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-red-800">Before you proceed, please note:</h3>
                                <ul className="mt-2 space-y-2 text-red-700">
                                    <li className="flex items-center">
                                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                        All your personal data will be permanently deleted
                                    </li>
                                    <li className="flex items-center">
                                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                        Account recovery will not be possible
                                    </li>
                                    <li className="flex items-center">
                                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                        All your content and posts will be removed
                                    </li>
                                    <li className="flex items-center">
                                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                        Active subscriptions will be cancelled immediately
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Steps Section */}
                    <ol class="overflow-hidden space-y-8">
                        <li class="relative flex-1 after:content-[''] after:w-0.5 after:h-full after:bg-teal-600 after:inline-block after:absolute after:-bottom-10.5 after:left-4 lg:after:left-5">
                            <a href="#" class="flex items-center font-medium w-full">
                                <span class="w-8 h-8 border-2 border-teal-600 rounded-full flex justify-center items-center mr-3 text-sm text-teal-600 lg:w-10 lg:h-10">
                                    1
                                </span>
                                <div class="block">
                                    <h4 class="text-lg text-teal-600">Step 1</h4>
                                    <span class="text-sm">
                                        Click on the profile icon shown at the top-right corner.
                                    </span>
                                </div>
                            </a>
                        </li>


                        <li class="relative flex-1 after:content-[''] after:w-0.5 after:h-full after:bg-teal-600 after:inline-block after:absolute after:-bottom-10.5 after:left-4 lg:after:left-5">
                            <a href="#" class="flex items-center font-medium w-full">
                                <span class="w-8 h-8 border-2 border-teal-600 rounded-full flex justify-center items-center mr-3 text-sm text-teal-600 lg:w-10 lg:h-10">
                                    2
                                </span>
                                <div class="block">
                                    <h4 class="text-lg text-teal-600">Step 2</h4>
                                    <span class="text-sm">
                                        Click on the <strong>Manage Profile</strong> option.
                                    </span>
                                </div>
                            </a>
                        </li>

                        <li class="relative flex-1 after:content-[''] after:w-0.5 after:h-full after:bg-gray-200 after:inline-block after:absolute after:-bottom-13 after:left-4 lg:after:left-5">
                            <a class="flex items-center font-medium w-full">
                                <span class="w-8 h-8 border-2 border-teal-600 rounded-full flex justify-center items-center mr-3 text-sm lg:w-10 lg:h-10 text-teal-600">
                                    3
                                </span>
                                <div class="block">
                                    <h4 class="text-lg text-teal-600">Step 3</h4>
                                    <span class="text-sm">
                                        Click the <strong>Delete Account</strong> button. A confirmation popup will appear—confirm to permanently delete your account.
                                    </span>
                                </div>
                            </a>
                        </li>
                    </ol>

                    {/* Action Button */}

                </div>
            </div>

            {/* Confirmation Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all">
                        <div className="p-6">
                            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.346 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                                Confirm Account Deletion
                            </h3>
                            <p className="text-gray-600 text-center mb-6">
                                This action cannot be undone. Please confirm your identity to proceed.
                            </p>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        placeholder="Enter your password"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Type "DELETE" to confirm
                                    </label>
                                    <input
                                        type="text"
                                        value={confirmationText}
                                        onChange={(e) => setConfirmationText(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        placeholder="Type DELETE"
                                    />
                                </div>
                            </div>

                            <div className="mt-8 flex space-x-3">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    disabled={confirmationText !== 'DELETE' || !password}
                                    className={`flex-1 px-4 py-3 font-medium rounded-lg transition-colors ${confirmationText === 'DELETE' && password
                                        ? 'bg-red-600 text-white hover:bg-red-700'
                                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                        }`}
                                >
                                    Delete Account
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DeleteAccount;