// src/component/PrivacyPolicy.jsx
// src/Screens/PrivacyCenter/PrivacyCenter.js
import React, { useEffect } from 'react';

const PrivacyCenter = () => {
    const handleContactSupport = () => {
        window.location.href = 'mailto:privacy@curo24.com?subject=Privacy%20Policy%20Inquiry';
    };
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }, []);

    const handleWithdrawConsent = () => {
        const confirmed = window.confirm(
            "Withdrawal of consent may result in termination of services that rely on that information. Do you want to continue?"
        );
        if (confirmed) {
            // Navigate to withdraw consent page - you'll need to implement your routing
            console.log('Navigate to WithdrawConsent page');
        }
    };

    const quickActions = [
        {
            title: 'Access Your Data',
            description: 'Access your data stored with us',
            icon: '📁',
            action: () => console.log('Navigate to DataAccess page')
        },
        {
            title: 'Correct Your Data',
            description: 'Request correction of your personal/health records',
            icon: '✏️',
            action: () => console.log('Navigate to DataCorrection page')
        },
        {
            title: 'Withdraw Consent',
            description: 'Revoke consent for processing your personal data',
            icon: '❌',
            action: handleWithdrawConsent
        },
        {
            title: 'File Grievance',
            description: 'File a grievance with our Data Protection Officer',
            icon: '📧',
            action: handleContactSupport
        }
    ];

    const privacySections = [
        {
            id: 'introduction',
            title: 'Privacy Policy',
            icon: '📄',
            content: `Curo24 is committed to protecting the privacy, confidentiality, and security of patient information. This Privacy Policy explains how we collect, use, store, and share your data in compliance with the Information Technology Act, 2000, the Digital Personal Data Protection Act, 2023, the Telemedicine Practice Guidelines, 2020 and other applicable laws.`
        },
        {
            id: 'data-collection',
            title: '1. Data We Collect',
            icon: '📊',
            content: `● We may collect the following categories of personal and health information:
- Personal details: name, email, address, age, phone number, and demographic information.
- Medical Records & Health Information (Sensitive Personal Data): Prescription uploads, lab test results, consultation notes, and health history shared during services, medical and treatment records, dosage instructions, and medical practitioner data.
- Financial Information & Payment details for orders and services: Card number, expiry, billing and shipping addresses.
- Service-Related Data: Items added to cart, healthcare products ordered (including OTC and prescription), telehealth bookings, lab test requests, Appointment/consultation details, booking history, and communication preferences.

● Curo24 may receive information from third-party partners or advertisers to enhance user experience.`
        },
        {
            id: 'data-usage',
            title: '2. How We Use Your Data',
            icon: '📈',
            content: `● Your data is used only for purposes necessary to deliver healthcare services, including:
- For user registration and service delivery (like lab test bookings).
- Coordinating and Facilitating service delivery—with pharmacies, labs, doctors, and ambulance providers.
- Sending service-related notifications, reminders, and updates.
- Ensuring compliance with legal and regulatory obligations.
- To tailor content, manage technical operations, and improve site features and user experience.
- Handling customer service, communications, and fraud prevention.
- Sharing updates on services or policy changes, or contacting for support
- Managing authentication and personalization.

● We do not sell or use your data for unauthorized marketing purposes.`
        },
        {
            id: 'data-storage',
            title: '3. Data Storage & Security',
            icon: '🛡️',
            content: `● All personal and medical information is stored on encrypted servers with industry-standard security protocols.
● Access is strictly role-based and limited to authorized personnel.
● Data is retained only for as long as required to fulfill legal, medical, and operational needs, after which it will be securely deleted or anonymized.
● User data is stored electronically (and sometimes physically)
● Uses technical, operational, and managerial controls for data protection.
● Requires third-party handlers to maintain similar security standards.
● Internet communication can't be fully guaranteed secure; Curo24 disclaims liability for intercepted data.`
        },
        {
            id: 'data-sharing',
            title: '4. Third-Party Data Sharing',
            icon: '👥',
            content: `● We may share your information only as necessary with trusted third parties, such as:
- Pharmacies for medicine delivery.
- Labs & Diagnostic Centers for test bookings and result processing.
- Doctors & Healthcare Professionals for consultations and treatment.
- Ambulance Providers for emergency services.
- Service providers working on behalf of Curo24.
- Government authorities, when legally required.
- In business restructuring or asset transfers—new entities may continue to use existing data.

● Access to user data is limited to staff needing it, with confidentiality obligations in place.
● All third parties are contractually bound to maintain confidentiality and comply with applicable data protection laws.`
        },
        {
            id: 'cookies',
            title: '5. Cookies & Tracking Technologies',
            icon: '👀',
            content: `● Curo24 uses cookies and similar tools to manage user sessions, monitor site usage, and enhance the platform experience. These tools help retain your preferences and streamline navigation.`
        },
        {
            id: 'user-rights',
            title: '6. Your Rights as a Patient',
            icon: '👤',
            content: `● As per the Data Protection Act, 2023, you have the right to:
- Access your data stored with us.
- Request correction, updation, or deletion of your personal/health records (subject to medical record retention laws).
- Revoke consent for processing your personal data at any time.
- File a grievance with our Data Protection Officer in case of concerns.

- Users can voluntarily withdraw consent, though this isn't retroactive.
● Withdrawal of consent may result in termination of services that rely on that information.`
        },
        {
            id: 'children-protection',
            title: '7. Children\'s Data Protection',
            icon: '❤️',
            content: `● Curo24 does not knowingly collect or process data of children under the age of 18 years without the consent of a parent or legal guardian.
● If it is discovered that data of a minor has been collected without proper consent, we will take steps to delete such data promptly.`
        },
        {
            id: 'data-breach',
            title: '8. Data Breach Notification',
            icon: '⚠️',
            content: `● In the event of a data breach that compromises your personal or medical information, Curo24 will:
- Notify affected individuals and relevant authorities as per applicable laws.
- Provide details of the breach, potential risks, and measures taken to mitigate impact.
- Offer guidance to patients on protective steps they may take.`
        },
        {
            id: 'cross-border',
            title: '9. Cross-Border Data Transfer',
            icon: '🌐',
            content: `● In certain cases, your personal or medical information may be processed or stored by third-party service providers (e.g., cloud storage, payment gateways) located outside India.
● Such transfers will only be made in compliance with the Digital Personal Data Protection Act, 2023, ensuring that your data receives an equivalent level of protection.
● By using Curo24's services, you expressly consent to the transfer of your data outside India, where required for service delivery.`
        },
        {
            id: 'additional-notes',
            title: '10. Additional Notes',
            icon: 'ℹ️',
            content: `● Users must ensure the accuracy of their submitted information—Curo24 may suspend accounts if info is false or incomplete.
● Users are responsible for maintaining confidentiality of their account credentials and must notify Curo24 of any unauthorized use.
● Communication is typically via email or website notices.`
        },
        {
            id: 'policy-updates',
            title: '11. Policy Updates',
            icon: '🔄',
            content: `● Curo24 may update this policy at any time, with or without notice.
● Significant changes will be highlighted on the website or via email.

● Continued use of the app or website after updates implies acceptance of the revised terms.`
        },
        {
            id: 'legal-references',
            title: '12. Legal References',
            icon: '⚖️',
            content: `● This policy is governed by and compliant with:
- Information Technology Act, 2000 and applicable IT Rules.
- Digital Personal Data Protection Act, 2023 (DPDP Act).
- Telemedicine Practice Guidelines, 2020 issued by the Medical Council of India.`
        },
        {
            id: 'grievance-redressal',
            title: '13. Grievance Redressal',
            icon: '📧',
            content: `● A designated grievance officer handles privacy-related complaints promptly (within one month).
● Users can reach out via email or regular mail to the appointed officer at _______`
        },
        {
            id: 'disclaimer-consent',
            title: '14. Disclaimer & Consent',
            icon: '✅',
            content: `By using Curo24's services (app, website, or helpline), you consent to the collection, processing, storage, transfer, and use of your information in accordance with this Privacy Policy.`
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto py-8 px-1 md:px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-start md:mb-8 mb-1">
                    <h1 className="text-lg md:text-3xl font-bold text-gray-900 mb-4">
                        Privacy Center
                    </h1>
                    <p className="text-xs md:text-[14px] text-gray-600 max-w-3xl">
                        Your privacy and data protection are our top priorities. Learn how we collect, use, and protect your information.
                    </p>
                </div>


                {/* Quick Actions Grid */}
                <div className="mb-12">
                    <h2 className="text-md  md:text-2xl font-semibold text-gray-900 mb-6 text-start">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {quickActions.map((action, index) => (
                            <button
                                key={index}
                                onClick={action.action}
                                className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 text-left hover:border-teal-500 hover:transform hover:-translate-y-1"
                            >
                                <div className="flex items-center mb-3">
                                    <span className="text-[12px] md:text-xl mr-4">{action.icon}</span>
                                    <h3 className="font-semibold text-gray-900 text-lg">{action.title}</h3>
                                </div>
                                <p className="text-gray-600 text-sm leading-relaxed">{action.description}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Privacy Policy Sections */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-2 md:px-8 md:py-6 py-4">
                        <h2 className="text-md md:text-2xl font-bold text-white">Privacy Policy</h2>
                        <p className="text-teal-100 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
                    </div>

                    <div className="p-8">
                        <div className="space-y-8">
                            {privacySections.map((section, index) => (
                                <div
                                    key={section.id}
                                    className={`pb-8 ${index !== privacySections.length - 1 ? 'border-b border-gray-100' : ''}`}
                                >
                                    <div className="flex items-start mb-4">
                                        <div className="flex items-center justify-center h-6 w-6 md:w-12 md:h-12 bg-teal-100 rounded-lg mr-4 flex-shrink-0">
                                            <span className=" text-xs md:text-xl">{section.icon}</span>
                                        </div>
                                        <h3 className=" text-md md:text-md  font-semibold text-gray-900 md:mt-2">
                                            {section.title}
                                        </h3>
                                    </div>

                                    <div className="md:ml-16">
                                        <p className="text-gray-700 leading-7 whitespace-pre-line text-xs md:text-[14px]">
                                            {section.content}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Consent Footer */}
                <div className="mt-8 bg-gradient-to-r from-teal-50 to-indigo-50 border border-teal-200 rounded-2xl p-8">
                    <div className="flex md:flex-row flex-col items-center justify-center">
                        <div className="flex items-center justify-center w-16 h-16 bg-teal-100 rounded-full mr-6">
                            <span className="text-2xl text-teal-600">✅</span>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-semibold text-teal-800 mb-2">
                                Consent Acknowledgement
                            </h3>
                            <p className="text-teal-700 text-xs md:text-lg leading-relaxed md:text-start text-center">
                                By using Curo24's services, you consent to the collection, processing,
                                storage, transfer, and use of your information in accordance with this Privacy Policy.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="mt-8 text-center">
                    <p className="text-gray-600 mb-4">
                        For any privacy-related questions or concerns, please contact our Data Protection Officer
                    </p>

                </div>
            </div>
        </div>
    );
};

export default PrivacyCenter;