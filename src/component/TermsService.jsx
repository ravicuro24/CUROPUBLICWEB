// src/component/TermsService.jsx
// src/components/Profile/TermsCondition.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TermsAndConditions = () => {
    const [accepted, setAccepted] = useState(false);
    const [expandedSections, setExpandedSections] = useState({});
    const navigate = useNavigate();

    // Auto-expand first section for better UX
    useEffect(() => {
        setExpandedSections({ eligibility: true });
    }, []);

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }, []);
    const toggleSection = (sectionId) => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId]
        }));
    };

    const handleAccept = () => {
        setAccepted(true);
        if (window.confirm(
            'Thank you for accepting our Terms and Conditions. You can now access all features of Curo24.'
        )) {
            navigate(-1);
        }
    };

    const openPrivacyPolicy = () => {
        window.open('https://curo24.com/privacy-policy', '_blank');
    };

    const openContact = () => {
        window.location.href = 'mailto:legal@curo24.com?subject=Terms%20and%20Conditions%20Query';
    };

    const openWebsite = () => {
        window.open('https://curo24.com', '_blank');
    };

    const SectionHeader = ({ title, id, isExpanded, icon }) => (
        <button
            onClick={() => toggleSection(id)}
            className={`
        flex justify-between items-center w-full p-4 sm:p-5 rounded-xl border-2 mb-2 transition-all duration-200
        ${isExpanded
                    ? 'bg-green-50 border-green-300 shadow-sm'
                    : 'bg-white border-gray-100 shadow-xs'
                } hover:shadow-md
      `}
        >
            <div className="flex items-center flex-1">
                {icon && (
                    <span className={`text-base sm:text-lg mr-3 ${isExpanded ? 'text-green-600' : 'text-green-500'}`}>
                        {icon}
                    </span>
                )}
                <span className={`
          font-semibold flex-1 text-left
          ${isExpanded ? 'text-green-900' : 'text-gray-900'}
          text-sm sm:text-base lg:text-lg
        `}>
                    {title}
                </span>
            </div>
            <span className={`transform transition-transform duration-200 text-sm sm:text-base ${isExpanded ? 'rotate-180' : ''}`}>
                ▼
            </span>
        </button>
    );

    const SectionContent = ({ children, isExpanded }) => {
        if (!isExpanded) return null;

        return (
            <div className="bg-white rounded-b-xl p-4 sm:p-5 border-2 border-t-0 border-green-100 mb-4 animate-fade-in">
                {children}
            </div>
        );
    };

    const BulletList = ({ items }) => (
        <div className="mt-1">
            {items.map((item, index) => (
                <div key={index} className="flex mb-3">
                    <div className="bg-green-100 rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center mt-1 mr-3 flex-shrink-0">
                        <span className="text-green-700 font-bold text-xs">•</span>
                    </div>
                    <p className="flex-1 text-gray-700 leading-6 sm:leading-7 text-xs sm:text-sm lg:text-base">
                        {item}
                    </p>
                </div>
            ))}
        </div>
    );

    const Section = ({ title, id, children, items, icon }) => (
        <div className="mb-1">
            <SectionHeader
                title={title}
                id={id}
                isExpanded={expandedSections[id]}
                icon={icon}
            />
            <SectionContent isExpanded={expandedSections[id]}>
                {children}
                {items && <BulletList items={items} />}
            </SectionContent>
        </div>
    );

    const ProfessionalCard = ({ children, className = '' }) => (
        <div className={`bg-white rounded-2xl p-4 sm:p-6 shadow-sm border-2 border-gray-100 mb-6 ${className}`}>
            {children}
        </div>
    );

    const QuickActionButton = ({ icon, title, onPress, color = "#3b82f6" }) => (
        <button
            onClick={onPress}
            className="flex items-center bg-white px-3 sm:px-5 py-3 sm:py-4 rounded-xl border-2 border-gray-100 shadow-xs mb-3 flex-1 mx-1 hover:shadow-md transition-shadow duration-200 min-w-0"
        >
            <span className="text-lg sm:text-xl" style={{ color }}>{icon}</span>
            <span className="text-gray-900 ml-2 sm:ml-3 font-semibold flex-1 text-left text-xs sm:text-sm lg:text-base truncate">
                {title}
            </span>
            <span className="text-gray-400 text-sm sm:text-base">›</span>
        </button>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-4 sm:py-6">
            {/* Centered Container */}
            <div className="container mx-auto px-3 sm:px-4 ">

                {/* Header */}
                <div className="text-start mb-6 sm:mb-8">
                    <h1 className="text-md sm:text-xs lg:text-4xl font-bold text-gray-900 mb-2">
                        Terms & Conditions
                    </h1>
                    <p className="text-gray-600 text-[10px] md:text-md lg:text-shadow-md">
                        Last updated: November 2025
                    </p>
                </div>

                {/* Enhanced Intro Card */}
                <ProfessionalCard>
                    <div className="flex items-start">
                        <div className="bg-green-100 p-2 sm:p-3 rounded-lg mr-3 sm:mr-4 flex-shrink-0">
                            <span className="text-xl sm:text-2xl text-green-500">🛡️</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-green-500 mb-2 sm:mb-3">
                                Welcome to Curo24
                            </h2>
                            <p className="text-gray-700 leading-6 sm:leading-7 mb-2 sm:mb-3 text-xs sm:text-sm lg:text-base">
                                Please read these Terms carefully before using our healthcare services. By accessing our platform, you agree to be bound by these Terms and our Privacy Policy.
                            </p>
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 sm:p-3">
                                <p className="text-yellow-800 text-xs sm:text-sm font-medium">
                                    📋 Scroll through all sections and accept to continue
                                </p>
                            </div>
                        </div>
                    </div>
                </ProfessionalCard>

                {/* Quick Links */}
                <div className="mb-6">
                    <h3 className="text-[10px] sm:text-lg lg:text-xl font-semibold text-gray-900 mb-3 ml-1">
                        Quick Links
                    </h3>
                    <div className="flex flex-wrap -mx-1">
                        <QuickActionButton
                            icon="🔒"
                            title="Privacy Policy"
                            onPress={openPrivacyPolicy}
                        />
                        <QuickActionButton
                            icon="💬"
                            title="Contact Legal"
                            onPress={openContact}
                        />
                    </div>
                </div>

                {/* Enhanced Sections with Icons */}
                <div className="mb-4">
                    <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-4 ml-1">
                        Terms & Conditions
                    </h3>

                    <Section
                        title="1. Eligibility & User Obligations"
                        id="eligibility"
                        icon="👤"
                        items={[
                            "Users must be 18 years or older to use the Curo24 platform.",
                            "You must provide accurate, complete, and updated information when registering and using the Services.",
                            "You are responsible for maintaining the confidentiality of your login credentials and all activities under your account."
                        ]}
                    />

                    <Section
                        title="2. Use of Services"
                        id="services"
                        icon="💊"
                        items={[
                            "Prescription medicines will only be dispensed upon receipt of a valid prescription issued by a registered medical practitioner.",
                            "You agree not to forge, alter, or misuse prescriptions.",
                            "Orders for prescription medicines require uploading a valid prescription, verified by the partner pharmacy.",
                            "Substitution with generics is allowed only if permitted by the prescribing doctor.",
                            "OTC medicines may be ordered without a prescription.",
                            "Proof of identity and age may be required for restricted medicines."
                        ]}
                    />

                    <Section
                        title="3. Delivery Timelines"
                        id="delivery"
                        icon="🚚"
                        items={[
                            "Standard delivery commitment is within 20 minutes, subject to product availability and serviceable location.",
                            "Deliveries are fulfilled by licensed partner pharmacies/logistics providers.",
                            "Curo24 does not guarantee delivery in cases of partner delays, stock-outs, or force majeure."
                        ]}
                    />

                    <Section
                        title="4. Telemedicine & Consultation Services"
                        id="telemedicine"
                        icon="📞"
                        items={[
                            "Curo24 facilitates teleconsultations under the Telemedicine Practice Guidelines, 2020.",
                            "Doctors are independent professionals, and Curo24 does not control their medical advice.",
                            "Teleconsultations are not a substitute for emergency care."
                        ]}
                    />

                    <Section
                        title="5. Diagnostic & Ambulance Services"
                        id="diagnostic"
                        icon="🏥"
                        items={[
                            "Curo24 enables bookings with accredited laboratories.",
                            "Test reports are the responsibility of such labs.",
                            "Curo24 assists in ambulance booking through authorized providers."
                        ]}
                    />

                    <Section
                        title="6. Payments"
                        id="payments"
                        icon="💳"
                        items={[
                            "All payments must be made online at the time of placing the order.",
                            "Orders are processed only after successful payment.",
                            "Prices are subject to change.",
                            "Payments go directly to third-party vendors.",
                            "Refunds follow Curo24's refund policy."
                        ]}
                    />

                    <Section
                        title="7. User Responsibilities"
                        id="responsibilities"
                        icon="📝"
                        items={[
                            "Provide genuine, valid prescriptions.",
                            "Ensure safe use of medicines as per instructions.",
                            "Check expiry dates and packaging before use.",
                            "Abuse, misuse, or fraudulent activity may lead to suspension."
                        ]}
                    />

                    <Section
                        title="8. Liability & Disclaimer"
                        id="liability"
                        icon="⚠️"
                        items={[
                            "Curo24 is an aggregator connecting users with third-party providers.",
                            "Vendors are fully responsible for compliance and service quality.",
                            "Curo24 disclaims all warranties and is not liable for indirect damages.",
                            "Maximum liability is limited to INR 1,000 for direct damages."
                        ]}
                    />

                    <Section
                        title="9. Data Privacy and Security"
                        id="privacy"
                        icon="🔐"
                        items={[
                            "Curo24 protects your data as per Indian IT and privacy laws.",
                            "Your data is collected only for providing services and regulatory compliance.",
                            "Personal data is not shared without consent, except as required by law."
                        ]}
                    />

                    <Section
                        title="10. Indemnity"
                        id="indemnity"
                        icon="⚖️"
                    >
                        <p className="text-gray-700 leading-6 sm:leading-7 text-xs sm:text-sm lg:text-base">
                            You agree to indemnify Curo24, its directors, and affiliates from any claims or damages arising out of misuse, false prescriptions, or breach of these Terms.
                        </p>
                    </Section>

                    <Section
                        title="11. Termination & Suspension"
                        id="termination"
                        icon="🚫"
                    >
                        <p className="text-gray-700 leading-6 sm:leading-7 text-xs sm:text-sm lg:text-base">
                            Curo24 may suspend or terminate your access if you violate any provision, engage in misuse, fraud, or provide false information.
                        </p>
                    </Section>

                    <Section
                        title="12. Compliance"
                        id="compliance"
                        icon="📋"
                    >
                        <p className="text-gray-700 leading-6 sm:leading-7 text-xs sm:text-sm lg:text-base">
                            All services comply with applicable Indian laws including the Drugs & Cosmetics Act, IT Act, and Consumer Protection Act.
                        </p>
                    </Section>

                    <Section
                        title="13. Governing Law"
                        id="governing"
                        icon="🏛️"
                    >
                        <p className="text-gray-700 leading-6 sm:leading-7 text-xs sm:text-sm lg:text-base">
                            These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in your applicable region.
                        </p>
                    </Section>

                    <Section
                        title="14. Grievance Redressal"
                        id="grievance"
                        icon="📧"
                    >
                        <p className="text-gray-700 leading-6 sm:leading-7 text-xs sm:text-sm lg:text-base">
                            For complaints, contact our Grievance Officer within 1 month. Escalation to the Nodal Officer is possible if unresolved.
                            <span className="text-green-600 font-medium"> Email: legal@curo24.com</span>
                        </p>
                    </Section>
                </div>

                {/* Enhanced Acceptance Section */}
                <ProfessionalCard>
                    <div className="flex items-start mb-4 sm:mb-5">
                        <div className="bg-green-100 p-2 sm:p-3 rounded-xl mr-3 sm:mr-4 flex-shrink-0">
                            <span className="text-xl sm:text-2xl text-green-600">✅</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                                Final Acknowledgement
                            </h3>
                            <p className="text-gray-700 leading-6 sm:leading-7 mb-1 text-xs sm:text-sm lg:text-base">
                                By using the Curo24 platform, you acknowledge that you have read, understood, and agreed to these Terms & Conditions and our Privacy Policy.
                            </p>
                            <p className="text-green-700 text-xs sm:text-sm font-medium mt-2">
                                ✓ I understand and agree to all terms mentioned above
                            </p>
                        </div>
                    </div>

                    <button
                        disabled={accepted}
                        onClick={handleAccept}
                        className={`
              flex items-center cursor-pointer justify-center w-full py-3 sm:py-4 rounded-xl transition-all duration-200 font-bold text-base sm:text-lg
              ${accepted
                                ? 'bg-green-600 text-white cursor-not-allowed'
                                : 'bg-gradient-to-r from-teal-600 to-teal-700 text-white hover:shadow-lg transform hover:-translate-y-0.5'
                            }
            `}
                    >
                        <span className="mr-2 sm:mr-3">{accepted ? '✅' : '👍'}</span>
                        {accepted ? 'Terms Accepted Successfully' : 'Accept Terms & Conditions'}
                    </button>

                    {accepted && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-2 sm:p-3 mt-3 sm:mt-4">
                            <p className="text-green-800 text-xs sm:text-sm text-center font-medium">
                                ✅ Thank you! You can now access all Curo24 services.
                            </p>
                        </div>
                    )}
                </ProfessionalCard>

                {/* Enhanced Footer */}
                <div className="text-center mt-6 sm:mt-8 px-2 sm:px-4">
                    <div className="bg-gray-50 rounded-xl p-4 sm:p-5 border border-gray-100">
                        <p className="text-gray-600 text-center text-xs sm:text-sm leading-5 sm:leading-6 mb-2 sm:mb-3">
                            © 2025 Curo24 Healthcare Services.<br />
                            All rights reserved. Licensed under applicable Indian laws.
                        </p>
                        <button onClick={openWebsite} className="flex items-center justify-center mx-auto">
                            <span className="text-teal-500 mr-2">🔗</span>
                            <span className="text-green-600 font-semibold text-sm sm:text-base">www.curo24.com</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Add custom animations */}
            <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        
        /* Ensure proper scrolling on mobile */
        @media (max-width: 640px) {
          .container {
            padding-left: 12px;
            padding-right: 12px;
          }
        }
      `}</style>
        </div>
    );
};

export default TermsAndConditions;