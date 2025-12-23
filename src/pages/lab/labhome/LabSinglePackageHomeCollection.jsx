// src/pages/lab/labhome/LabSinglePackageHomeCollection.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLabAuth } from "../../../Authorization/LabAuthContext";
import axiosInstance from "../../../Authorization/axiosInstance";
import AddNewFamily from "../../../component/familyMedical/AddNewFamily";
import AddNewAddress from "../../../component/profile/AddnewAddress";
import RazorpayPayment from "../../../component/payments/RazorpayPayments";

function LabSinglePackageHomeCollection({ labCartItems, page = "HomeCollection" }) {
  const [addNewPatientModal, setAddNewPatientModal] = useState(false);
  const [addNewAddressModal, setAddNewAddressModal] = useState(false);
  const { userData, getAllLabCartItems } = useLabAuth();
  const userId = userData?.id;
  const navigate = useNavigate();

  // Determine if it's home collection or visit lab from page prop
  const isHomeCollection = page === "HomeCollection";
  const isVisitLab = page === "VisitLab";

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

  // Payment states
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [orderPayload, setOrderPayload] = useState(null);

  // Function to categorize time slots
  const categorizeSlots = (slots) => {
    const categorized = {
      morning: [],
      afternoon: [],
      evening: []
    };

    slots.forEach(slot => {
      const startHour = parseInt(slot.startAt.split(':')[0]);
      const endHour = parseInt(slot.endAt.split(':')[0]);

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

  // --- Normalize labCartItems to ensure labPackage exists ---
  const normalizedLabCartItems = labCartItems?.map((pkg) => {
    if (!pkg) return null;
    const labPackage = pkg.labPackage || pkg.item?.labPackage;
    return labPackage ? { ...pkg, labPackage } : null;
  }).filter(Boolean);

  console.log("Collection Type:", page, "isHomeCollection:", isHomeCollection, "items:", normalizedLabCartItems);

  // Calculate total amount for payment
  const calculateTotalAmount = () => {
    let total = 0;
    normalizedLabCartItems?.forEach(pkg => {
      if (pkg?.labPackage?.price) {
        total += parseFloat(pkg.labPackage.price);
      }
    });
    return Math.round(total * 100); // Convert to paise for Razorpay
  };

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
    if (isHomeCollection) {
      fetchAddress();
    }
  }, [isHomeCollection]);

  useEffect(() => {
    if (activePackage) {
      const pkg = normalizedLabCartItems.find((p) => p.labPackage.id === activePackage);
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
      const pkg = normalizedLabCartItems.find((p) => p.labPackage.id === activePackage);
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
      },
    }));
  };

  const toggleApplyToAll = () => {
    if (!applyToAllEnabled) {
      const firstPkgId = Object.keys(selections)[0];
      if (!firstPkgId) return;

      const firstSelection = selections[firstPkgId];
      const newSelections = {};

      normalizedLabCartItems.forEach((pkg) => {
        const pkgId = pkg.labPackage.id;
        newSelections[pkgId] = { ...firstSelection, selectedPackageId: String(pkgId) };
      });

      setSelections(newSelections);
      setApplyToAllEnabled(true);
    } else {
      const firstPkgId = Object.keys(selections)[0];
      const firstSelection = selections[firstPkgId];
      setSelections({ [firstPkgId]: firstSelection });
      setApplyToAllEnabled(false);
    }
  };

  const onClickPackage = (pkg) => setActivePackage(pkg.labPackage.id);

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

    // If it's visit lab, skip address step and auto-complete
    if (isVisitLab) {
      updateSelectionForActivePackage({
        selectedAddressId: null,
        addressName: "Lab Visit - No Address Required"
      });
      setActivePackage(null);
      setActiveStep(null);
    } else {
      // For home collection, go to address step
      setActiveStep("address");
    }
  };

  const onSelectAddress = (ad) => {
    updateSelectionForActivePackage({
      selectedAddressId: String(ad.id),
      addressName: ad.city + " - " + (ad.houseNumber || ad.fullAddress)
    });
    setActivePackage(null);
    setActiveStep(null);
  };

  // Prepare order payload (used by both payment and checkout)
  const prepareOrderPayload = () => {
    const order = Object.values(selections)
      .filter(s => {
        // Basic validation for all orders
        if (!s || !s.appointmentDate || !s.selectedSlotId || !s.selectedPackageId || !s.patientId) {
          return false;
        }

        // For home collection, ensure address is selected
        if (isHomeCollection && !s.selectedAddressId) {
          return false;
        }

        // For visit lab, address can be null
        if (isVisitLab) {
          return true;
        }

        return true;
      })
      .map(s => {
        // Base order object
        const baseOrder = {
          appointmentDate: s.appointmentDate,
          selectedSlotId: s.selectedSlotId,
          selectedPackageId: s.selectedPackageId,
          patientId: s.patientId
        };

        // Add address only for home collection
        if (isHomeCollection) {
          baseOrder.selectedAddressId = s.selectedAddressId;
        } else if (isVisitLab) {
          // For visit lab, set address to null explicitly
          baseOrder.selectedAddressId = null;
        }

        return baseOrder;
      });

    if (order.length === 0) {
      return null;
    }

    return { order };
  };

  const initiateCheckout = () => {
    // Prepare payload first
    const payload = prepareOrderPayload();

    if (!payload) {
      alert("Please complete all selections before proceeding.");
      return;
    }

    // Calculate total amount
    const totalAmount = calculateTotalAmount();

    if (totalAmount <= 0) {
      alert("Invalid order amount. Please check your selections.");
      return;
    }

    // Set payment amount and payload
    setPaymentAmount(totalAmount);
    setOrderPayload(payload);

    // Show payment modal
    setShowPaymentModal(true);
  };

  // Handle payment success
  const handlePaymentSuccess = async (paymentResponse) => {
    console.log("Payment successful:", paymentResponse);

    // Close payment modal
    setShowPaymentModal(false);

    // Now call the actual checkout API
    await callCheckoutAPI(paymentResponse);
  };

  // Handle payment failure
  const handlePaymentFailure = (error) => {
    console.error("Payment failed:", error);
    alert("Payment failed. Please try again.");
    setShowPaymentModal(false);
  };

  // Actual API call after successful payment
  const callCheckoutAPI = async (paymentResponse) => {
    setLoading(true);

    try {
      const finalPayload = {
        ...orderPayload,
        paymentDetails: {
          razorpayPaymentId: paymentResponse.razorpay_payment_id,
          razorpaySignature: paymentResponse.razorpay_signature,
          amount: paymentAmount / 100, // Convert back to rupees
          status: "success"
        }
      };

      console.log("Final payload with payment:", finalPayload);

      const response = await axiosInstance.post(`/endUserEndPoint/createMultipleAppointmentForTestPackage?endUserId=${userId}&razorpayOrderId=${paymentResponse.razorpay_order_id}`, finalPayload);
      console.log("Order response:", response.data);

      // Clear cart
      await getAllLabCartItems();

      // Navigate to confirmation page
      navigate('/lab/appointment/confirm', {
        state: {
          orderResponse: response.data,
          collectionType: page,
          paymentResponse: paymentResponse
        }
      });
    } catch (error) {
      console.error("Order error:", error.response?.data || error.message);

      // If API fails, we might need to refund
      alert("Order creation failed after payment. Please contact support. Payment will be refunded if order not created.");

      // You might want to call a refund API here
      // await initiateRefund(paymentResponse.razorpay_payment_id);
    } finally {
      setLoading(false);
    }
  };

  const isPackageCompleted = (pkgId) => {
    const s = selections[pkgId];

    // Basic validations for all
    if (!s || !s.appointmentDate || !s.selectedSlotId || !s.selectedPackageId || !s.patientId) {
      return false;
    }

    // For home collection, check address
    if (isHomeCollection) {
      return s.selectedAddressId != null;
    }

    // For visit lab, address is not required
    if (isVisitLab) {
      return true; // Only the above fields are needed
    }

    return false;
  };

  const renderSelectedSummary = (pkgId) => {
    const s = selections[pkgId];
    if (!s) return null;

    const slotName = s.slotStartAt && s.slotEndAt ? `${convertTo12Hour(s.slotStartAt)} - ${convertTo12Hour(s.slotEndAt)}` : "N/A";
    const patientName = s.patientName || "N/A";
    const addressName = isHomeCollection
      ? (s.addressName || "N/A")
      : (isVisitLab ? "Visit Lab" : "N/A");

    return (
      <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 bg-green-600 rounded-full"></div>
          <span className="text-sm font-medium text-gray-700">All details selected</span>
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
              {isHomeCollection ? "Address" : "Visit Type"}
            </span>
            <span className="text-sm font-semibold text-gray-900 truncate" title={addressName}>
              {addressName}
              {isVisitLab && (
                <span className="ml-2 text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                  Lab Visit
                </span>
              )}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderStepIndicator = () => {
    // Define steps based on collection type
    let steps;
    if (isHomeCollection) {
      steps = [
        { key: "slots", label: "Select Slot", icon: "🕒" },
        { key: "family", label: "Select Patient", icon: "👨‍👩‍👧‍👦" },
        { key: "address", label: "Select Address", icon: "📍" }
      ];
    } else {
      steps = [
        { key: "slots", label: "Select Slot", icon: "🕒" },
        { key: "family", label: "Select Patient", icon: "👨‍👩‍👧‍👦" }
      ];
    }

    const currentIndex = steps.findIndex(step => step.key === activeStep);

    return (
      <div className="mb-8">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {steps.map((step, index) => (
            <React.Fragment key={step.key}>
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-base font-medium transition-all duration-300 ${index < currentIndex
                  ? "bg-green-600 text-white"
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
                <div className={`flex-1 h-1 mx-4 rounded-full transition-all duration-300 ${index < currentIndex ? "bg-green-500" : "bg-gray-200"
                  }`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  // Function to render categorized time slots
  const renderCategorizedSlots = () => {
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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {categorizedSlots.morning.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => onSelectSlot(slot)}
                  className={`px-4 py-3 rounded-lg border transition-all duration-200 flex flex-col items-center justify-center ${selections[activePackage]?.selectedSlotId === String(slot.id)
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
                </button>
              ))}
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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {categorizedSlots.afternoon.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => onSelectSlot(slot)}
                  className={`px-4 py-3 rounded-lg border transition-all duration-200 flex flex-col items-center justify-center ${selections[activePackage]?.selectedSlotId === String(slot.id)
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
                </button>
              ))}
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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {categorizedSlots.evening.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => onSelectSlot(slot)}
                  className={`px-4 py-3 rounded-lg border transition-all duration-200 flex flex-col items-center justify-center ${selections[activePackage]?.selectedSlotId === String(slot.id)
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
                </button>
              ))}
            </div>
          </div>
        )}

        {/* No Slots Available */}
        {slots.length === 0 && (
          <div className="text-center py-10 bg-white rounded-lg border border-gray-200">
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No slots available</h3>
            <p className="text-gray-600 mb-4">Try selecting a different date</p>
            <input
              type="date"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="block px-4 py-2 border border-gray-300 rounded-md mx-auto"
            />
          </div>
        )}
      </div>
    );
  };

  const completedPackagesCount = Object.keys(selections).filter(pkgId =>
    isPackageCompleted(pkgId)
  ).length;

  const allPackagesCompleted = completedPackagesCount === normalizedLabCartItems.length;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col items-start">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-md md:text-3xl font-bold text-gray-900">
              {isHomeCollection ? "Schedule Home Collection" : "Schedule Lab Visit"}
            </h1>
            <span className={`text-xs font-medium px-3 py-1 rounded-full ${isHomeCollection
              ? "bg-teal-100 text-teal-800 border border-teal-200"
              : "bg-blue-100 text-blue-800 border border-blue-200"}`}>
              {isHomeCollection ? "🏠 Home Collection" : "🏥 Lab Visit"}
            </span>
          </div>
          <p className="text-gray-600 text-[12px] md:text-sm">
            {isHomeCollection
              ? "Select time slots, patient, and address for your lab packages"
              : "Select time slots and patient for your lab visit"}
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
                      {completedPackagesCount}/{normalizedLabCartItems.length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(completedPackagesCount / normalizedLabCartItems.length) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {Math.round((completedPackagesCount / normalizedLabCartItems.length) * 100)}%
                  </div>
                  <div className="text-xs text-gray-500">Complete</div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-medium text-gray-700 mb-2">Order Summary</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">₹{calculateTotalAmount() / 100}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">₹0.00</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 mt-2">
                    <span className="font-medium">Total</span>
                    <span className="font-bold text-teal-700">₹{calculateTotalAmount() / 100}</span>
                  </div>
                </div>
              </div>

              {/* Collection Type Info */}
              <div className={`border-t border-gray-200 pt-4 ${!isHomeCollection ? 'pb-4' : ''}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-lg ${isHomeCollection ? 'text-teal-600' : 'text-blue-600'}`}>
                    {isHomeCollection ? '🏠' : '🏥'}
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    {isHomeCollection ? 'Home Collection' : 'Lab Visit'}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  {isHomeCollection
                    ? 'Sample will be collected at your selected address'
                    : 'Visit the lab at your selected time slot'}
                </p>
              </div>

              {/* Apply to All Toggle */}
              {Object.keys(selections).length > 0 && (
                <div className="border-t border-gray-200 pt-4">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm font-medium text-gray-700">
                      Apply to all packages
                    </span>
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
                  <p className="text-xs text-gray-500 mt-2">
                    Apply first package's selections to all packages
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Packages List */}
            <div className="space-y-4 mb-8">
              {normalizedLabCartItems?.map((pkg, index) => {
                const pkgId = pkg.labPackage.id;
                const completed = isPackageCompleted(pkgId);
                const isActive = activePackage === pkgId;

                return (
                  <div
                    key={pkgId}
                    className={`bg-white rounded-lg shadow-sm border transition-all duration-200 ${isActive
                      ? 'ring-2 ring-teal-500 border-teal-300'
                      : completed
                        ? 'border-green-200'
                        : 'border-gray-200'
                      }`}
                  >
                    {/* Package Header */}
                    <div className="p-6">
                      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-4 mb-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold ${completed
                              ? 'bg-green-600'
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
                                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                    Scheduled
                                  </span>
                                )}
                              </div>
                              <div className="flex flex-wrap gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-gray-700">Price:</span>
                                  <span className="text-green-700 font-semibold">₹{pkg.labPackage.price}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-gray-700">Lab:</span>
                                  <span className="text-gray-900">{pkg.labPackage.lab?.labName || pkg.labPackage.lab?.firstName || "N/A"}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-gray-700">Type:</span>
                                  <span className={`text-xs font-medium px-2 py-1 rounded ${isHomeCollection
                                    ? 'bg-teal-100 text-teal-800'
                                    : 'bg-blue-100 text-blue-800'}`}>
                                    {isHomeCollection ? 'Home Collection' : 'Lab Visit'}
                                  </span>
                                </div>
                              </div>
                              <div>
                                {pkg.labPackage.tests.map((tst, idx) => (
                                  <div key={idx}>
                                    <span>{tst.testName}</span>
                                    <div>
                                      {tst.symptoms?.map((symp, index) => (
                                        <div key={index} className="text-xs text-gray-500">
                                          - {symp}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onClickPackage(pkg)}
                            className={`px-6 py-2 rounded-lg font-medium text-sm transition-colors border ${isActive
                              ? "bg-teal-50 text-teal-700 border-teal-300"
                              : completed
                                ? "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                                : "bg-teal-600 text-white border-teal-600 hover:bg-teal-700"
                              }`}
                          >
                            {isActive ? "Editing..." : completed ? "Edit" : "Select"}
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

                        {/* Date Selection */}
                        <div className="mb-6 bg-white p-4 rounded-lg border border-gray-200">
                          <label className="block text-base font-medium text-gray-900 mb-3">
                            Appointment Date
                          </label>
                          <div className="flex items-center gap-4">
                            <input
                              type="date"
                              value={appointmentDate}
                              onChange={(e) => setAppointmentDate(e.target.value)}
                              min={new Date().toISOString().split('T')[0]}
                              className="block px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                            />
                            <span className="text-sm text-gray-600">
                              Select a date to view available time slots
                            </span>
                          </div>
                        </div>

                        {/* Time Slots - Categorized */}
                        {activeStep === "slots" && renderCategorizedSlots()}

                        {/* Family Members */}
                        {activeStep === "family" && (
                          <div className="bg-white rounded-lg border border-gray-200 p-5">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Patient</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                              {familyMembers.map((fm) => (
                                <button
                                  key={fm.id}
                                  onClick={() => onSelectFamily(fm)}
                                  className={`p-4 rounded-lg border transition-all duration-200 flex flex-col items-center ${selections[activePackage]?.patientId === String(fm.id)
                                    ? "bg-teal-50 border-teal-500 text-teal-700 ring-1 ring-teal-300"
                                    : "bg-white border-gray-300 text-gray-700 hover:bg-teal-50 hover:border-teal-300"
                                    }`}
                                >
                                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 text-xl mb-3">
                                    👤
                                  </div>
                                  <span className="font-semibold text-base">{fm.name}</span>
                                  <span className="text-sm text-gray-500 mt-1">Age: {fm.age || "N/A"}</span>
                                </button>
                              ))}
                              <button
                                onClick={() => setAddNewPatientModal(true)}
                                className="p-4 rounded-lg border-2 border-dashed border-teal-300 hover:border-teal-500 hover:bg-teal-50 transition-colors flex flex-col items-center justify-center cursor-pointer"
                              >
                                <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 text-2xl mb-3">
                                  +
                                </div>
                                <span className="font-semibold text-base text-teal-700">Add New Family</span>
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Addresses (only for home collection) */}
                        {isHomeCollection && activeStep === "address" && (
                          <div className="bg-white rounded-lg border border-gray-200 p-5">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Address</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {addresses.map((ad) => (
                                <button
                                  key={ad.id}
                                  onClick={() => onSelectAddress(ad)}
                                  className={`p-4 rounded-lg border transition-all duration-200 text-left ${selections[activePackage]?.selectedAddressId === String(ad.id)
                                    ? "bg-teal-50 border-teal-500 text-teal-700 ring-1 ring-teal-300"
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
                                </button>
                              ))}
                              <button
                                onClick={() => setAddNewAddressModal(true)}
                                className="p-4 rounded-lg border-2 border-dashed border-teal-300 hover:border-teal-500 hover:bg-teal-50 transition-colors flex items-center justify-center cursor-pointer"
                              >
                                <div className="text-center">
                                  <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 text-xl mb-2 mx-auto">
                                    +
                                  </div>
                                  <span className="font-semibold text-base text-teal-700">Add New Address</span>
                                </div>
                              </button>
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
            <div className="mt-8 text-center">
              <button
                disabled={!allPackagesCompleted || loading}
                onClick={initiateCheckout}
                className={`px-8 py-3 rounded-lg font-semibold text-white transition-all duration-300 ${allPackagesCompleted
                  ? "bg-teal-600 hover:bg-teal-700 hover:shadow-lg transform hover:-translate-y-0.5"
                  : "bg-gray-400 cursor-not-allowed"
                  }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </span>
                ) : (
                  `Proceed to Payment - ₹${calculateTotalAmount() / 100}`
                )}
              </button>
              <p className="text-xs text-gray-500 mt-2">
                {allPackagesCompleted
                  ? "Complete payment to confirm your appointment"
                  : "Complete all selections to proceed to payment"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Razorpay Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 backdrop-brightness-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Complete Payment</h3>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="mb-6">
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700">Total Amount</span>
                    <span className="text-2xl font-bold text-teal-700">₹{paymentAmount / 100}</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {normalizedLabCartItems.length} lab package(s)
                  </p>
                </div>

                <RazorpayPayment
                  amount={paymentAmount / 100}
                  email={userData?.email || ""}
                  planId="1"
                  contact={userData?.mobileNumber || ""}
                  checkoutFrom="lab-booking"
                  type="Lab Test Booking"
                  userId={userData?.id}
                  orderFrom="lab"
                  description={`Lab tests booking for ${normalizedLabCartItems.length} package(s)`}
                  selectedPaymentMethod={{
                    selectedPayment: true,
                    method: "Razorpay"
                  }}
                  onSuccess={handlePaymentSuccess}
                  onfailure={handlePaymentFailure}
                />
              </div>

              <div className="text-center">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Family Modal */}
      {addNewPatientModal && (
        <div className="fixed inset-0 backdrop-brightness-50 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-md shadow-lg relative overflow-y-auto">
            <div className="p-4">
              <AddNewFamily
                onClose={() => setAddNewPatientModal(false)}
                onSuccess={() => {
                  fetchFamilyMembers();
                  setAddNewPatientModal(false);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Add New Address Modal */}
      {addNewAddressModal && (
        <div className="fixed inset-0 backdrop-brightness-50 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-md shadow-lg relative overflow-y-auto">
            <div className="p-4">
              <AddNewAddress
                onSuccess={() => {
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

export default LabSinglePackageHomeCollection;