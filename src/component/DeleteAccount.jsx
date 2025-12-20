// src/component/DeleteAccount.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function DeleteAccount() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmationText, setConfirmationText] = useState('');
    const navigate = useNavigate();

    const handleDeleteAccount = () => {
        // Add your delete account logic here
        console.log('Account deletion requested');
        // Call API to delete account
        // On success, redirect to home/login page
        navigate('/');
    };

    const isDeleteDisabled = () => {
        return !password || confirmationText !== "DELETE MY ACCOUNT";
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-2xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Delete Account</h1>
                    <p className="text-gray-600 mb-6">
                        This action cannot be undone. All your data will be permanently removed.
                    </p>

                    {/* Warning Box */}
                    <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">Warning</h3>
                                <div className="mt-2 text-sm text-red-700">
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>All your personal data will be deleted</li>
                                        <li>Your account cannot be recovered</li>
                                        <li>All your content and posts will be removed</li>
                                        <li>Any active subscriptions will be cancelled</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>Step 1: Go to your Profile</div>
                    <div>Step 2: Open Manage Profile</div>
                    <div>Step 3: Select Delete Account</div>
                </div>

            </div>
        </div>
    );
}

export default DeleteAccount;