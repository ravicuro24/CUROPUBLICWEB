// src/pages/lab/labhome/SelectSlot.jsx

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLabAuth } from "../../../Authorization/LabAuthContext";
import axiosInstance from "../../../Authorization/axiosInstance";
import AddNewFamily from "../../../component/familyMedical/AddNewFamily";
import AddNewAddress from "../../../component/profile/AddnewAddress";
import RazorpayPayment from "../../../component/payments/RazorpayPayments";

function SelectSlot({ labCartItems, page = "HomeCollection" }) {
    const [addNewPatientModal, setAddNewPatientMdoal] = useState(false)
    const [addNewAddressModal, setAddNewAddressModal] = useState(false)
    const { userData, getAllLabCartItems } = useLabAuth();
    const userId = userData?.id;
    const navigate = useNavigate();
    const [appointmentDate, setAppointmentDate] = useState(
        new Date().toISOString().split("T")[0]
    );

    const [slots, setSlots] = useState([]);
    const [familyMembers, setFamilyMembers] = useState([]);
    const [addresses, setAddresses] = useState([]);

    const [activePackage, setActivePackage] = useState(null);
    const [activeStep, setActiveStep] = useState(null);

    const [selections, setSelections] = useState({});
    const [applyToAllEnabled, setApplyToAllEnabled] = useState(false);
    const [loading, setLoading] = useState(false);

    // New state for payment
    const [showPayment, setShowPayment] = useState(false);
    const [paymentAmount, setPaymentAmount] = useState(0);
    const [paymentData, setPaymentData] = useState(null);

    // Check if it's VisitLab mode
    const isVisitLab = page === "VisitLab";

    // Function to categorize time slots
    const categorizeSlots = (slots) => {
        const categorized = {
            morning: [],
            afternoon: [],
            evening: []
        };

        slots.forEach(slot => {
            const startHour = parseInt(slot.startAt.split(':')[0]);

            // Determine category based on start time
            if (startHour >= 6 && startHour < 12) {
                categorized.morning.push(slot);
            } else if (startHour >= 12 && startHour < 17) {
                categorized.afternoon.push(slot);
            } else if (startHour >= 17 && startHour < 22) {
                categorized.evening.push(slot);
            } else {
                // For slots that don't fit neatly, add to appropriate category
                if (startHour < 12) {
                    categorized.morning.push(slot);
                } else if (startHour < 17) {
                    categorized.afternoon.push(slot);
                } else {
                    categorized.evening.push(slot);
                }
            }
        });

        // Sort slots within each category
        Object.keys(categorized).forEach(category => {
            categorized[category].sort((a, b) => {
                const aTime = a.startAt;
                const bTime = b.startAt;
                return aTime.localeCompare(bTime);
            });
        });

        return categorized;
    };

    function convertTo12Hour(time24) {
        let [hours, minutes] = time24.split(":");

        let modifier = "AM";

        hours = parseInt(hours, 10);

        if (hours >= 12) {
            modifier = "PM";
            if (hours > 12) hours -= 12;
        }

        if (hours === 0) {
            hours = 12;
        }

        // Format hours with leading zero
        const formattedHours = hours.toString().padStart(2, "0");

        return `${formattedHours}:${minutes} ${modifier}`;
    }

    // --- API Calls ---
    const fetchSlots = async (labId) => {
        try {
            const res = await axiosInstance.get(
                `/endUserEndPoint/findLabSlot/${labId}?date=${appointmentDate}`
            );
            setSlots(res.data || []);
        } catch (err) {
            console.error("fetchSlots:", err);
            setSlots([]);
        }
    };

    const fetchFamilyMembers = async () => {
        try {
            const res = await axiosInstance.get(
                `/endUserEndPoint/getFamilyMembersByEndUserId?endUserId=${userData?.id}`
            );
            console.log("Family Members:", res.data);
            setFamilyMembers(res.data?.dtoList || []);
        } catch (err) {
            console.error("fetchFamilyMembers:", err);
            setFamilyMembers([]);
        }
    };

    const fetchAddress = async () => {
        try {
            const res = await axiosInstance.get(
                `/endUserAddress/getAddressByUserId/${userData?.id}`
            );
            setAddresses(res.data?.dto || res.data || []);
        } catch (err) {
            console.error("fetchAddress:", err);
            setAddresses([]);
        }
    };

    useEffect(() => {
        fetchFamilyMembers();
        if (!isVisitLab) { // Only fetch addresses for Home Collection
            fetchAddress();
        }
    }, [isVisitLab]);

    useEffect(() => {
        if (activePackage) {
            const pkg = labCartItems.find((p) => p.labPackage.id === activePackage);
            if (pkg) {
                fetchSlots(pkg.labPackage.lab.id);
                setActiveStep("slots");
            }
        } else {
            setSlots([]);
            setActiveStep(null);
        }
    }, [activePackage]);

    useEffect(() => {
        if (activePackage) {
            const pkg = labCartItems.find((p) => p.labPackage.id === activePackage);
            if (pkg) fetchSlots(pkg.labPackage.lab.id);
        }
    }, [appointmentDate]);

    // --- Selection Handlers ---
    const updateSelectionForActivePackage = (obj) => {
        if (!activePackage) return;
        setSelections((prev) => ({
            ...prev,
            [activePackage]: {
                ...(prev[activePackage] || {}),
                ...obj,
                appointmentDate,
                selectedPackageId: String(activePackage),
                ...(isVisitLab && { selectedAddressId: null }), // For VisitLab, set addressId to null
            },
        }));
    };

    // FIXED: Proper toggleApplyToAll function
    const toggleApplyToAll = () => {
        if (!applyToAllEnabled) {
            // Apply first package's selections to all packages
            const firstPkgId = Object.keys(selections)[0];
            if (!firstPkgId) return;

            const firstSelection = selections[firstPkgId];
            const newSelections = {};

            labCartItems.forEach((pkg) => {
                const pkgId = pkg.labPackage.id;
                // Create a copy of the first selection but with the correct package ID
                newSelections[pkgId] = {
                    ...firstSelection,
                    selectedPackageId: String(pkgId),
                    // For VisitLab, ensure addressId is null
                    ...(isVisitLab && { selectedAddressId: null }),
                };
            });

            setSelections(newSelections);
            setApplyToAllEnabled(true);
        } else {
            // When turning OFF "Apply to all", keep all selections but reset the flag
            // Don't clear any data - just turn off the apply-to-all mode
            setApplyToAllEnabled(false);
        }
    };

    const onClickPackage = (pkg) => {
        // If apply to all is enabled, warn user that changes will affect all packages
        if (applyToAllEnabled) {
            if (window.confirm("'Apply to all packages' is enabled. Editing this package will update all packages. Do you want to continue?")) {
                setActivePackage(pkg.labPackage.id);
            }
        } else {
            setActivePackage(pkg.labPackage.id);
        }
    };

    const onSelectSlot = (slot) => {
        updateSelectionForActivePackage({
            selectedSlotId: String(slot.id),
            slotStartAt: slot.startAt,
            slotEndAt: slot.endAt
        });
        setActiveStep("family");
    };

    const onSelectFamily = (fm) => {
        updateSelectionForActivePackage({
            patientId: String(fm.id),
            patientName: fm.name
        });

        if (isVisitLab) {
            // For VisitLab, skip address selection
            // If apply to all is enabled, apply this selection to all packages
            if (applyToAllEnabled) {
                const currentSelection = selections[activePackage];
                const newSelections = {};

                labCartItems.forEach((pkg) => {
                    const pkgId = pkg.labPackage.id;
                    newSelections[pkgId] = {
                        ...currentSelection,
                        selectedPackageId: String(pkgId),
                        patientId: String(fm.id),
                        patientName: fm.name,
                        selectedAddressId: null // Explicitly set to null for VisitLab
                    };
                });

                setSelections(newSelections);
            }

            setActivePackage(null);
            setActiveStep(null);
        } else {
            setActiveStep("address");
        }
    };

    const onSelectAddress = (ad) => {
        updateSelectionForActivePackage({
            selectedAddressId: String(ad.id),
            addressName: ad.city + " - " + (ad.houseNumber || ad.fullAddress)
        });

        // If apply to all is enabled, apply this selection to all packages
        if (applyToAllEnabled) {
            const currentSelection = selections[activePackage];
            const newSelections = {};

            labCartItems.forEach((pkg) => {
                const pkgId = pkg.labPackage.id;
                newSelections[pkgId] = {
                    ...currentSelection,
                    selectedPackageId: String(pkgId),
                    // Update the address for all packages
                    selectedAddressId: String(ad.id),
                    addressName: ad.city + " - " + (ad.houseNumber || ad.fullAddress)
                };
            });

            setSelections(newSelections);
        }

        setActivePackage(null);
        setActiveStep(null);
    };

    const calculateTotalPrice = (items = []) => {
        return items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
    };

    // Format amount without decimal points
    const formatAmountForRazorpay = (amount) => {
        // Convert to number, round to nearest integer, and remove decimal points
        return Math.round(Number(amount)).toString();
    };

    // Prepare order data for checkout
    const prepareOrderData = () => {
        const totalAmount = calculateTotalPrice(labCartItems);
        const formattedAmount = formatAmountForRazorpay(totalAmount);

        // Filter selections based on mode
        const order = Object.values(selections)
            .filter(s => {
                // Basic validation for all modes
                if (!s || !s.appointmentDate || !s.selectedSlotId ||
                    !s.selectedPackageId || !s.patientId) {
                    return false;
                }

                // For Home Collection: address is required
                if (!isVisitLab && !s.selectedAddressId) {
                    return false;
                }

                // For Visit Lab: address should be null (or not present)
                if (isVisitLab) {
                    // Ensure addressId is explicitly null
                    s.selectedAddressId = null;
                }

                return true;
            })
            .map(s => ({
                appointmentDate: s.appointmentDate,
                selectedSlotId: s.selectedSlotId,
                selectedAddressId: isVisitLab ? null : s.selectedAddressId,
                selectedPackageId: s.selectedPackageId,
                patientId: s.patientId
            }));

        return { order, totalAmount, formattedAmount };
    };

    // Handle checkout button click - start payment process
    const handleCheckoutClick = () => {
        const orderData = prepareOrderData();

        if (orderData.order.length === 0) {
            alert("Please complete all package selections before checkout");
            return;
        }

        // Set payment data and amount
        setPaymentData(orderData);
        setPaymentAmount(orderData.formattedAmount); // Use formatted amount without decimals
        setShowPayment(true);
    };

    // This function will be called after successful payment
    const handleCheckoutAfterPayment = async (paymentResponse) => {
        setLoading(true);
        console.log("Payment successful, proceeding with checkout...");
        console.log("Payment response:", paymentResponse);

        try {
            // Convert paymentAmount to number for backend
            const amountPaid = Number(paymentAmount);

            // Add payment details to the payload
            const payload = {
                order: paymentData.order,
                paymentId: paymentResponse.razorpay_payment_id,
                orderId: paymentResponse.razorpay_order_id,
                signature: paymentResponse.razorpay_signature,
                paymentMethod: 'Razorpay',
                amountPaid: amountPaid
            };

            console.log("FINAL PAYLOAD WITH PAYMENT:", JSON.stringify(payload, null, 2));

            const response = await axiosInstance.post(
                `/endUserEndPoint/createMultipleAppointmentForTestPackage?endUserId=${userId}`,
                payload
            );

            console.log("Order response:", response.data);
            await getAllLabCartItems();

            // Navigate to confirmation page with both order and payment details
            navigate('/lab/appointment/confirm', {
                state: {
                    orderResponse: response.data,
                    paymentResponse: paymentResponse,
                    amountPaid: amountPaid
                }
            });

        } catch (error) {
            console.error("Order error:", error.response?.data || error.message);
            alert("Error creating appointment after payment: " + (error.response?.data?.message || error.message));

            // You might want to handle refund or show retry option here
            // For now, just show an error and keep payment visible for retry
            setShowPayment(true);
        } finally {
            setLoading(false);
        }
    };

    // Payment success callback
    const handlePaymentSuccess = (paymentResponse) => {
        console.log("Payment Success:", paymentResponse);
        setShowPayment(false);
        handleCheckoutAfterPayment(paymentResponse);
    };

    // Payment failure callback
    const handlePaymentFailure = (error) => {
        console.log("Payment Failed:", error);
        alert("Payment failed. Please try again.");
        setShowPayment(false);
        setLoading(false);
    };

    const isPackageCompleted = (pkgId) => {
        const s = selections[pkgId];
        if (!s) return false;

        const requiredFields = [
            s.appointmentDate,
            s.selectedSlotId,
            s.selectedPackageId,
            s.patientId
        ];

        // For Home Collection, also check address
        if (!isVisitLab) {
            requiredFields.push(s.selectedAddressId);
        } else {
            // For VisitLab, ensure addressId is null (or not present)
            s.selectedAddressId = null;
        }

        return requiredFields.every(field => field != null && field !== '');
    };

    const renderSelectedSummary = (pkgId) => {
        const s = selections[pkgId];
        if (!s) return null;
        const slotName = s.slotStartAt && s.slotEndAt ? `${convertTo12Hour(s.slotStartAt)} - ${convertTo12Hour(s.slotEndAt)}` : "N/A";
        const patientName = s.patientName || "N/A";
        const addressName = isVisitLab ? "Visit Lab" : (s.addressName || "N/A");

        return (
            <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">All details selected</span>
                    {applyToAllEnabled && (
                        <span className="text-xs font-medium bg-teal-100 text-teal-800 px-2 py-1 rounded-full">
                            Applied to all
                        </span>
                    )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="flex flex-col">
                        <span className="text-xs font-medium text-gray-500 mb-1">Date</span>
                        <span className="text-sm font-semibold text-gray-900">{s.appointmentDate}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-medium text-gray-500 mb-1">Time Slot</span>
                        <span className="text-sm font-semibold text-gray-900">{slotName}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-medium text-gray-500 mb-1">Patient</span>
                        <span className="text-sm font-semibold text-gray-900">{patientName}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-medium text-gray-500 mb-1">
                            {isVisitLab ? "Collection Type" : "Address"}
                        </span>
                        <span className="text-sm font-semibold text-gray-900 truncate" title={addressName}>
                            {addressName}
                        </span>
                    </div>
                </div>
            </div>
        );
    };

    const renderStepIndicator = () => {
        const steps = isVisitLab
            ? [
                { key: "slots", label: "Select Slot", icon: "🕒" },
                { key: "family", label: "Select Patient", icon: "👨‍👩‍👧‍👦" }
                // No address step for VisitLab
            ]
            : [
                { key: "slots", label: "Select Slot", icon: "🕒" },
                { key: "family", label: "Select Patient", icon: "👨‍👩‍👧‍👦" },
                { key: "address", label: "Select Address", icon: "📍" }
            ];

        const currentIndex = steps.findIndex(step => step.key === activeStep);

        return (
            <div className="mb-8">
                <div className="flex items-center justify-between max-w-2xl mx-auto">
                    {steps.map((step, index) => (
                        <React.Fragment key={step.key}>
                            <div className="flex flex-col items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-base font-medium transition-all duration-300 ${index < currentIndex
                                    ? "bg-teal-600 text-white"
                                    : index === currentIndex
                                        ? "bg-teal-600 text-white ring-2 ring-teal-200"
                                        : "bg-gray-100 text-gray-400 border border-gray-300"
                                    }`}>
                                    {index < currentIndex ? "✓" : step.icon}
                                </div>
                                <span className={`text-xs font-medium mt-2 ${index <= currentIndex ? "text-gray-900" : "text-gray-400"
                                    }`}>
                                    {step.label}
                                </span>
                            </div>
                            {index < steps.length - 1 && (
                                <div className={`flex-1 h-1 mx-4 rounded-full transition-all duration-300 ${index < currentIndex ? "bg-teal-500" : "bg-gray-200"
                                    }`} />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        );
    };

    // Function to render categorized time slots
    const renderCategorizedSlots = (pkgId) => {
        const categorizedSlots = categorizeSlots(slots);

        return (
            <div className="space-y-6">
                {/* Morning Slots */}
                {categorizedSlots.morning.length > 0 && (
                    <div className="bg-white rounded-lg border border-gray-200 p-5">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                                <span className="text-orange-600 text-lg">🌅</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Morning</h3>
                                <p className="text-sm text-gray-600">6:00 AM - 12:00 PM</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {categorizedSlots.morning.map((slot) => {
                                const isSelected = selections[pkgId]?.selectedSlotId === String(slot.id);
                                return (
                                    <button
                                        key={slot.id}
                                        onClick={() => {
                                            onSelectSlot(slot);
                                            // If apply to all is enabled, apply this slot to all packages
                                            if (applyToAllEnabled) {
                                                const currentSelection = selections[pkgId];
                                                const newSelections = {};

                                                labCartItems.forEach((pkg) => {
                                                    const otherPkgId = pkg.labPackage.id;
                                                    newSelections[otherPkgId] = {
                                                        ...(selections[otherPkgId] || {}),
                                                        selectedPackageId: String(otherPkgId),
                                                        selectedSlotId: String(slot.id),
                                                        slotStartAt: slot.startAt,
                                                        slotEndAt: slot.endAt,
                                                        appointmentDate
                                                    };
                                                });

                                                setSelections(newSelections);
                                            }
                                        }}
                                        className={`px-4 py-3 rounded-lg border transition-all duration-200 flex flex-col items-center justify-center ${isSelected
                                            ? "bg-teal-50 border-teal-500 text-teal-700 ring-1 ring-teal-300"
                                            : "bg-white border-gray-300 text-gray-700 hover:bg-teal-50 hover:border-teal-300"
                                            }`}
                                    >
                                        <span className="font-semibold text-base">
                                            {convertTo12Hour(slot.startAt)}
                                        </span>
                                        <span className="text-xs text-gray-500 mt-1">
                                            to {convertTo12Hour(slot.endAt)}
                                        </span>
                                        {slot.capacity && (
                                            <span className="text-xs text-gray-400 mt-2">
                                                {slot.capacity} slots
                                            </span>
                                        )}
                                        {isSelected && (
                                            <div className="mt-2 w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center">
                                                <span className="text-white text-xs">✓</span>
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Afternoon Slots */}
                {categorizedSlots.afternoon.length > 0 && (
                    <div className="bg-white rounded-lg border border-gray-200 p-5">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                                <span className="text-yellow-600 text-lg">☀️</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Afternoon</h3>
                                <p className="text-sm text-gray-600">12:00 PM - 5:00 PM</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {categorizedSlots.afternoon.map((slot) => {
                                const isSelected = selections[pkgId]?.selectedSlotId === String(slot.id);
                                return (
                                    <button
                                        key={slot.id}
                                        onClick={() => {
                                            onSelectSlot(slot);
                                            // If apply to all is enabled, apply this slot to all packages
                                            if (applyToAllEnabled) {
                                                const currentSelection = selections[pkgId];
                                                const newSelections = {};

                                                labCartItems.forEach((pkg) => {
                                                    const otherPkgId = pkg.labPackage.id;
                                                    newSelections[otherPkgId] = {
                                                        ...(selections[otherPkgId] || {}),
                                                        selectedPackageId: String(otherPkgId),
                                                        selectedSlotId: String(slot.id),
                                                        slotStartAt: slot.startAt,
                                                        slotEndAt: slot.endAt,
                                                        appointmentDate
                                                    };
                                                });

                                                setSelections(newSelections);
                                            }
                                        }}
                                        className={`px-4 py-3 rounded-lg border transition-all duration-200 flex flex-col items-center justify-center ${isSelected
                                            ? "bg-teal-50 border-teal-500 text-teal-700 ring-1 ring-teal-300"
                                            : "bg-white border-gray-300 text-gray-700 hover:bg-teal-50 hover:border-teal-300"
                                            }`}
                                    >
                                        <span className="font-semibold text-base">
                                            {convertTo12Hour(slot.startAt)}
                                        </span>
                                        <span className="text-xs text-gray-500 mt-1">
                                            to {convertTo12Hour(slot.endAt)}
                                        </span>
                                        {slot.capacity && (
                                            <span className="text-xs text-gray-400 mt-2">
                                                {slot.capacity} slots
                                            </span>
                                        )}
                                        {isSelected && (
                                            <div className="mt-2 w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center">
                                                <span className="text-white text-xs">✓</span>
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Evening Slots */}
                {categorizedSlots.evening.length > 0 && (
                    <div className="bg-white rounded-lg border border-gray-200 p-5">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                <span className="text-indigo-600 text-lg">🌙</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Evening</h3>
                                <p className="text-sm text-gray-600">5:00 PM - 10:00 PM</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {categorizedSlots.evening.map((slot) => {
                                const isSelected = selections[pkgId]?.selectedSlotId === String(slot.id);
                                return (
                                    <button
                                        key={slot.id}
                                        onClick={() => {
                                            onSelectSlot(slot);
                                            // If apply to all is enabled, apply this slot to all packages
                                            if (applyToAllEnabled) {
                                                const currentSelection = selections[pkgId];
                                                const newSelections = {};

                                                labCartItems.forEach((pkg) => {
                                                    const otherPkgId = pkg.labPackage.id;
                                                    newSelections[otherPkgId] = {
                                                        ...(selections[otherPkgId] || {}),
                                                        selectedPackageId: String(otherPkgId),
                                                        selectedSlotId: String(slot.id),
                                                        slotStartAt: slot.startAt,
                                                        slotEndAt: slot.endAt,
                                                        appointmentDate
                                                    };
                                                });

                                                setSelections(newSelections);
                                            }
                                        }}
                                        className={`px-4 py-3 rounded-lg border transition-all duration-200 flex flex-col items-center justify-center ${isSelected
                                            ? "bg-teal-50 border-teal-500 text-teal-700 ring-1 ring-teal-300"
                                            : "bg-white border-gray-300 text-gray-700 hover:bg-teal-50 hover:border-teal-300"
                                            }`}
                                    >
                                        <span className="font-semibold text-base">
                                            {convertTo12Hour(slot.startAt)}
                                        </span>
                                        <span className="text-xs text-gray-500 mt-1">
                                            to {convertTo12Hour(slot.endAt)}
                                        </span>
                                        {slot.capacity && (
                                            <span className="text-xs text-gray-400 mt-2">
                                                {slot.capacity} slots
                                            </span>
                                        )}
                                        {isSelected && (
                                            <div className="mt-2 w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center">
                                                <span className="text-white text-xs">✓</span>
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* No Slots Available */}
                {slots.length === 0 && (
                    <div className="text-center py-10 bg-white rounded-lg border border-gray-200">
                        <div className="text-4xl mb-4">📅</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No slots available</h3>
                        <p className="text-gray-600 mb-4">Try selecting a different date</p>
                    </div>
                )}
            </div>
        );
    };

    const completedPackagesCount = Object.keys(selections).filter(pkgId =>
        isPackageCompleted(pkgId)
    ).length;

    const allPackagesCompleted = completedPackagesCount === labCartItems.length;

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex flex-col items-start">
                    <h1 className="text-md md:text-3xl font-bold text-gray-900 mb-1">
                        Schedule Lab Tests - {isVisitLab ? "Visit Lab" : "Home Collection"}
                    </h1>
                    <p className="text-gray-600 text-[12px] md:text-sm">
                        {isVisitLab
                            ? "Select time slots for your lab visit"
                            : "Select time slots and details for your home collection"}
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Sidebar - Progress Summary */}
                    <div className="lg:w-1/4">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Progress</h3>

                            <div className="space-y-4 mb-6">
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium text-gray-700">Packages Completed</span>
                                        <span className="text-sm font-semibold text-gray-900">
                                            {completedPackagesCount}/{labCartItems.length}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-teal-600 h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${(completedPackagesCount / labCartItems.length) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="text-center">
                                    <div className="text-2xl font-bold text-gray-900 mb-1">
                                        {Math.round((completedPackagesCount / labCartItems.length) * 100)}%
                                    </div>
                                    <div className="text-xs text-gray-500">Complete</div>
                                </div>
                            </div>

                            {/* Collection Type Info */}
                            <div className="border-t border-gray-200 pt-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-sm font-medium text-gray-700">Collection Type:</span>
                                    <span className={`text-sm font-semibold ${isVisitLab ? 'text-blue-600' : 'text-teal-600'}`}>
                                        {isVisitLab ? 'Visit Lab' : 'Home Collection'}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500">
                                    {isVisitLab
                                        ? 'You will visit the lab at the selected time'
                                        : 'Sample collection will be done at your selected address'}
                                </p>
                            </div>

                            {/* Apply to All Toggle - FIXED */}
                            {Object.keys(selections).length > 0 && (
                                <div className="border-t border-gray-200 pt-4 mt-4">
                                    <label className="flex items-center justify-between cursor-pointer">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-gray-700">
                                                Apply to all packages
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {applyToAllEnabled ? "All packages will use same details" : "Turn on to sync all packages"}
                                            </span>
                                        </div>
                                        <div
                                            onClick={toggleApplyToAll}
                                            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${applyToAllEnabled ? 'bg-teal-600' : 'bg-gray-300'
                                                }`}
                                        >
                                            <span
                                                className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${applyToAllEnabled ? 'translate-x-6' : 'translate-x-1'
                                                    }`}
                                            />
                                        </div>
                                    </label>
                                    {applyToAllEnabled && (
                                        <div className="mt-3 p-2 bg-teal-50 border border-teal-200 rounded-lg">
                                            <p className="text-xs text-teal-800">
                                                <span className="font-medium">Note:</span> Any changes you make will be applied to all packages automatically.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:w-3/4">
                        {/* Packages List */}
                        <div className="space-y-4 mb-8">
                            {labCartItems?.map((pkg, index) => {
                                const pkgId = pkg.labPackage.id;
                                const completed = isPackageCompleted(pkgId);
                                const isActive = activePackage === pkgId;

                                return (
                                    <div
                                        key={pkgId}
                                        className={`bg-white rounded-lg shadow-sm border transition-all duration-200 ${isActive
                                            ? 'ring-2 ring-teal-500 border-teal-300'
                                            : completed
                                                ? 'border-teal-200'
                                                : 'border-gray-200'
                                            }`}
                                    >
                                        {/* Package Header */}
                                        <div className="p-6">
                                            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-start gap-4 mb-3">
                                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold ${completed
                                                            ? 'bg-teal-600'
                                                            : 'bg-gray-600'
                                                            }`}>
                                                            {index + 1}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                                                <h3 className="text-xl font-semibold text-gray-900">
                                                                    {pkg.labPackage.packageName}
                                                                </h3>
                                                                {completed && (
                                                                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-teal-100 text-teal-800 border border-teal-200">
                                                                        Scheduled
                                                                    </span>
                                                                )}
                                                                {applyToAllEnabled && completed && (
                                                                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                                                                        Synced
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="flex flex-wrap gap-4 text-sm">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="font-medium text-gray-700">Price:</span>
                                                                    <span className="text-teal-700 font-semibold">₹{pkg.unitPrice}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <span className="font-medium text-gray-700">Lab:</span>
                                                                    <span className="text-gray-900">{pkg.labPackage.lab?.labName || pkg.labPackage.lab?.firstName || "N/A"}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <span className="font-medium text-gray-700">Type:</span>
                                                                    <span className={`font-semibold ${isVisitLab ? 'text-blue-600' : 'text-teal-600'}`}>
                                                                        {isVisitLab ? 'Visit Lab' : 'Home Collection'}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => onClickPackage(pkg)}
                                                        className={`px-6 py-2 rounded-lg font-medium text-sm transition-colors border cursor-pointer ${isActive
                                                            ? "bg-teal-50 text-teal-700 border-teal-300"
                                                            : completed
                                                                ? "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                                                                : "bg-teal-600 text-white border-teal-600 hover:bg-teal-700"
                                                            }`}
                                                    >
                                                        {isActive ? "Editing..." : completed ? "Edit" : "Select Patient & Slot"}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Selected Summary */}
                                            {completed && renderSelectedSummary(pkgId)}
                                        </div>

                                        {/* Selection Steps */}
                                        {isActive && (
                                            <div className="border-t border-gray-200 bg-gray-50 p-6 rounded-b-lg">
                                                {/* Step Indicator */}
                                                {renderStepIndicator()}

                                                {/* Apply All Banner */}
                                                {applyToAllEnabled && (
                                                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-blue-600">🔄</span>
                                                            <p className="text-sm text-blue-800">
                                                                <span className="font-medium">Apply to All Enabled:</span> Your selections will automatically apply to all {labCartItems.length} packages.
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Date Selection */}
                                                <div className="mb-6 bg-white p-4 rounded-lg border border-gray-200">
                                                    <label className="block text-base font-medium text-gray-900 mb-3">
                                                        Appointment Date
                                                    </label>
                                                    <div className="flex items-center gap-4">
                                                        <input
                                                            type="date"
                                                            value={appointmentDate}
                                                            onChange={(e) => {
                                                                const newDate = e.target.value;
                                                                setAppointmentDate(newDate);
                                                                // If apply to all is enabled, update date for all packages
                                                                if (applyToAllEnabled) {
                                                                    const newSelections = {};
                                                                    labCartItems.forEach((pkg) => {
                                                                        const otherPkgId = pkg.labPackage.id;
                                                                        newSelections[otherPkgId] = {
                                                                            ...(selections[otherPkgId] || {}),
                                                                            selectedPackageId: String(otherPkgId),
                                                                            appointmentDate: newDate
                                                                        };
                                                                    });
                                                                    setSelections(newSelections);
                                                                }
                                                            }}
                                                            min={new Date().toISOString().split('T')[0]}
                                                            className="block px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-base font-medium"
                                                        />
                                                        <span className="text-sm text-gray-500">
                                                            Select your preferred appointment date
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Slots Selection - Now categorized */}
                                                {activeStep === "slots" && renderCategorizedSlots(pkgId)}

                                                {/* Family Members Selection */}
                                                {activeStep === "family" && (
                                                    <div className="bg-white rounded-lg border border-gray-200 p-5">
                                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Patient </h3>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                                            {familyMembers.length === 0 ? (
                                                                <div className="col-span-full text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                                                    <div className="text-lg mb-2">No family members found</div>
                                                                    <p className="text-sm">Add family members in your profile</p>
                                                                </div>
                                                            ) : (
                                                                familyMembers.map((fm) => {
                                                                    const chosen = selections[pkgId]?.patientId === String(fm.id);
                                                                    return (
                                                                        <button
                                                                            key={fm.id}
                                                                            onClick={() => {
                                                                                onSelectFamily(fm);
                                                                            }}
                                                                            className={`p-2 rounded-lg border transition-all duration-200 flex flex-col items-center ${chosen
                                                                                ? "bg-teal-50 border-teal-500 text-teal-700 ring-1 ring-teal-200"
                                                                                : "bg-white border-gray-300 text-gray-700 hover:bg-teal-50 hover:border-teal-300"
                                                                                }`}
                                                                        >
                                                                            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 text-xl mb-3">
                                                                                👤
                                                                            </div>
                                                                            <span className="font-semibold text-base">{fm.name} ({fm.gender == "Male" ? "M" : "Female" ? "F" : "O"})</span>
                                                                            <span className="text-sm text-gray-500 mt-1">
                                                                                {fm.relationship || "Self"} • {fm.age || "N/A"} yrs
                                                                            </span>
                                                                            {chosen && (
                                                                                <div className="mt-3 w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center">
                                                                                    <span className="text-white text-xs">✓</span>
                                                                                </div>
                                                                            )}
                                                                        </button>
                                                                    );
                                                                })
                                                            )}
                                                            <button
                                                                onClick={() => setAddNewPatientMdoal(true)}
                                                                className='bg-teal-700 text-white rounded-md py-2 cursor-pointer' >+ Add New </button>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Address Selection - Only for Home Collection */}
                                                {activeStep === "address" && !isVisitLab && (
                                                    <div className="bg-white rounded-lg border border-gray-200 p-5">
                                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Address</h3>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            {addresses.length === 0 ? (
                                                                <div className="col-span-full text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                                                    <div className="text-lg mb-2">No addresses found</div>
                                                                    <p className="text-sm">Add addresses in your profile</p>
                                                                </div>
                                                            ) : (
                                                                addresses.map((ad) => {
                                                                    const chosen = selections[pkgId]?.selectedAddressId === String(ad.id);
                                                                    return (
                                                                        <button
                                                                            key={ad.id}
                                                                            onClick={() => onSelectAddress(ad)}
                                                                            className={`p-4 rounded-lg border transition-all duration-200 text-left ${chosen
                                                                                ? "bg-teal-50 border-teal-500 text-teal-700 ring-1 ring-teal-200"
                                                                                : "bg-white border-gray-300 text-gray-700 hover:bg-teal-50 hover:border-teal-300"
                                                                                }`}
                                                                        >
                                                                            <div className="flex items-start gap-3">
                                                                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                                                                                    <span className="text-gray-600">📍</span>
                                                                                </div>
                                                                                <div>
                                                                                    <span className="font-semibold text-base block mb-1">
                                                                                        {ad.city} - {ad.houseNumber || ad.fullAddress}
                                                                                    </span>
                                                                                    <span className="text-sm text-gray-600 block">
                                                                                        {ad.fullAddress}
                                                                                    </span>
                                                                                    <span className="text-xs text-gray-500 mt-2 block">
                                                                                        {ad.state} • {ad.pinCode}
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                            {chosen && (
                                                                                <div className="mt-3 w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center ml-auto">
                                                                                    <span className="text-white text-xs">✓</span>
                                                                                </div>
                                                                            )}
                                                                        </button>
                                                                    );
                                                                })
                                                            )}
                                                            <button
                                                                onClick={() => setAddNewAddressModal(true)}
                                                                className='bg-teal-700 text-white rounded-md py-2 cursor-pointer'>+ New Address</button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Checkout Button */}
                        {allPackagesCompleted && (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
                                    <div>
                                        <div className="text-lg font-semibold text-gray-900 mb-1">
                                            Ready to Book
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            All {labCartItems.length} packages are scheduled and confirmed
                                        </div>
                                        <div className="text-sm text-gray-600 mt-1">
                                            Collection Type: <span className={`font-semibold ${isVisitLab ? 'text-blue-600' : 'text-teal-600'}`}>
                                                {isVisitLab ? 'Visit Lab' : 'Home Collection'}
                                            </span>
                                        </div>
                                        <div className="text-lg font-bold text-teal-700 mt-2">
                                            Total Amount: ₹{calculateTotalPrice(labCartItems)}
                                        </div>
                                        {applyToAllEnabled && (
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                                                    📦 All packages use same details
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        onClick={handleCheckoutClick}
                                        disabled={loading || showPayment}
                                        className={`px-8 py-3 rounded-lg font-semibold text-white transition-all duration-300 ${loading || showPayment
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : "bg-teal-600 hover:bg-teal-700 hover:shadow-lg transform hover:-translate-y-0.5"
                                            }`}
                                    >
                                        {loading ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Processing...
                                            </div>
                                        ) : showPayment ? (
                                            "Processing Payment..."
                                        ) : (
                                            `Proceed to Payment`
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Razorpay Payment Component - Hidden until needed */}
            {showPayment && paymentData && (
                <div className="fixed inset-0 backdrop-brightness-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">Complete Payment</h3>
                            <button
                                onClick={() => setShowPayment(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="mb-6">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-600">Total Amount:</span>
                                    <span className="font-bold text-lg">₹{paymentAmount}</span>
                                </div>
                                <div className="text-sm text-gray-500">
                                    {labCartItems.length} package(s) • {isVisitLab ? 'Visit Lab' : 'Home Collection'}
                                </div>
                            </div>
                        </div>

                        <RazorpayPayment
                            amount={paymentAmount} // Already formatted without decimals
                            email={userData?.email || ""}
                            planId="1"
                            contact={userData?.mobileNumber || ""}
                            checkoutFrom="lab-booking"
                            type="Lab Test Booking"
                            userId={userData?.id}
                            orderFrom="lab"
                            description={`Lab tests booking for ${labCartItems.length} package(s)`}
                            selectedPaymentMethod={{
                                selectedPayment: true,
                                method: "Razorpay"
                            }}
                            onSuccess={handlePaymentSuccess}
                            onfailure={handlePaymentFailure}
                        />

                        <div className="mt-4 text-center">
                            <button
                                onClick={() => setShowPayment(false)}
                                className="text-sm text-gray-500 hover:text-gray-700"
                            >
                                Cancel Payment
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add New Patient Modal */}
            {addNewPatientModal && (
                <div className="fixed inset-0 backdrop-brightness-50 flex justify-center items-center z-50">
                    <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-md shadow-lg relative overflow-y-auto">
                        <div className="p-4">
                            <AddNewFamily onClose={() => setAddNewPatientMdoal(false)} onSuccess={() => fetchFamilyMembers()} />
                        </div>
                    </div>
                </div>
            )}

            {/* Add New Address Modal (Only for Home Collection) */}
            {!isVisitLab && addNewAddressModal && (
                <div className="fixed inset-0 backdrop-brightness-50 flex justify-center items-center z-50">
                    <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-md shadow-lg relative overflow-y-auto">
                        <div className="p-4">
                            <AddNewAddress
                                onSucess={() => {
                                    fetchAddress();
                                    setAddNewAddressModal(false);
                                }}
                                onClose={() => {
                                    setAddNewAddressModal(false);
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SelectSlot;