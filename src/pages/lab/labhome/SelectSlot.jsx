// src/pages/lab/labhome/SelectSlot.jsx

import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useLabAuth } from "../../../Authorization/LabAuthContext";
import axiosInstance from "../../../Authorization/axiosInstance";

function SelectSlot() {
    const location = useLocation();
    const labCartItems = location.state || [];
    const { userData } = useLabAuth();
    const userId = userData?.id

    // date default in YYYY-MM-DD
    const [appointmentDate, setAppointmentDate] = useState(
        new Date().toISOString().split("T")[0]
    );

    // fetched lists (for currently active package)
    const [slots, setSlots] = useState([]);
    const [familyMembers, setFamilyMembers] = useState([]);
    const [addresses, setAddresses] = useState([]);

    // control which package is active for step-by-step selection
    const [activePackage, setActivePackage] = useState(null); // labPackage.id
    const [activeStep, setActiveStep] = useState(null); // "slots" | "family" | "address" | null

    // store completed selections per package: key = packageId, value = selection object
    const [selections, setSelections] = useState({});

    // --- API calls ---
    const fetchSlots = async (labId) => {
        try {
            const res = await axiosInstance.get(
                `/endUserEndPoint/findLabSlot/${labId}?date=${appointmentDate}`
            );
            // API returns array in res.data (from your logs). adjust if necessary.
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
            // API returned object with dtoList earlier:
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
            // some responses used res.data.dto — fallback to data
            setAddresses(res.data?.dto || res.data || []);
        } catch (err) {
            console.error("fetchAddress:", err);
            setAddresses([]);
        }
    };

    // preload family and address lists once (they are user-wide)
    useEffect(() => {
        fetchFamilyMembers();
        fetchAddress();
    }, []);

    // whenever activePackage changes, load its slots (for current date)
    useEffect(() => {
        if (activePackage) {
            const pkg = labCartItems.find((p) => p.labPackage.id === activePackage);
            if (pkg) {
                fetchSlots(pkg.labPackage.lab.id);
                setActiveStep("slots");
            }
        } else {
            // no active package => clear temporary lists
            setSlots([]);
            setActiveStep(null);
        }
    }, [activePackage]);

    // whenever appointmentDate changes while a package is active, re-fetch slots
    useEffect(() => {
        if (activePackage) {
            const pkg = labCartItems.find((p) => p.labPackage.id === activePackage);
            if (pkg) fetchSlots(pkg.labPackage.lab.id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appointmentDate]);

    // helper: save selection fragment for current package
    const updateSelectionForActivePackage = (obj) => {
        if (!activePackage) return;
        setSelections((prev) => ({
            ...prev,
            [activePackage]: {
                ...(prev[activePackage] || {}),
                ...obj,
                appointmentDate, // always record chosen date for that package
                selectedPackageId: String(activePackage),
            },
        }));
    };

    // UI actions
    const onClickPackage = (pkg) => {
        // if package already completed selection and user clicks again, let them re-edit
        setActivePackage(pkg.labPackage.id);
    };

    const onSelectSlot = (slot) => {
        updateSelectionForActivePackage({ selectedSlotId: String(slot.id) });
        // move to family step
        setActiveStep("family");
    };

    const onSelectFamily = (fm) => {
        updateSelectionForActivePackage({ patientId: String(fm.id) });
        // move to address step
        setActiveStep("address");
    };

    const onSelectAddress = (ad) => {
        updateSelectionForActivePackage({ selectedAddressId: String(ad.id) });
        // selection finished for this package -> close step UI
        setActivePackage(null);
        setActiveStep(null);
        // ensure addresses/family/slots remain for other edits (no change)
    };

    const handleCheckout = async () => {
        // create payload.order as array from selections (only include fully filled ones)
        const order = Object.values(selections).filter(
            (s) =>
                s &&
                s.appointmentDate &&
                s.selectedSlotId &&
                s.selectedAddressId &&
                s.selectedPackageId &&
                s.patientId
        );

        const payload = { order };
        console.log("FINAL PAYLOAD:", payload);
        try {
            const response = await axiosInstance.post(
                `/endUserEndPoint/createMultipleAppointmentForTestPackage?endUserId=${userId}`,
                payload 
            );
            console.log("Order response:", response.data);
        } catch (error) {
            console.error("Order error:", error.response?.data || error.message);
        }
    };

    // helper to check if package has completed selection
    const isPackageCompleted = (pkgId) => {
        const s = selections[pkgId];
        return (
            s &&
            s.appointmentDate &&
            s.selectedSlotId &&
            s.selectedAddressId &&
            s.selectedPackageId &&
            s.patientId
        );
    };

    // helper to render selected summary for a package
    const renderSelectedSummary = (pkgId) => {
        const s = selections[pkgId];
        if (!s) return null;
        return (
            <div className="mt-2 p-3 border rounded bg-gray-50 text-sm">
                <div>
                    <b>Date:</b> {s.appointmentDate}
                </div>
                <div>
                    <b>Slot ID:</b> {s.selectedSlotId}
                </div>
                <div>
                    <b>Patient ID:</b> {s.patientId}
                </div>
                <div>
                    <b>Address ID:</b> {s.selectedAddressId}
                </div>
            </div>
        );
    };

    return (
        <div className="p-4 max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Select Packages & Slots</h2>

            {/* list packages */}
            <div className="space-y-3">
                {labCartItems.map((pkg) => {
                    const pkgId = pkg.labPackage.id;
                    const completed = isPackageCompleted(pkgId);
                    return (
                        <div key={pkgId} className="border rounded p-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-medium">
                                        {pkg.labPackage.packageName} - ₹{pkg.unitPrice}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                        Lab: {pkg.labPackage.lab?.labName || pkg.labPackage.lab?.firstName || "N/A"}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {completed && (
                                        <span className="text-sm text-green-700 font-medium">Selected</span>
                                    )}
                                    <button
                                        className={`px-3 py-1 rounded border ${activePackage === pkgId ? "bg-indigo-50" : "bg-white"
                                            }`}
                                        onClick={() => onClickPackage(pkg)}
                                    >
                                        {activePackage === pkgId ? "Editing" : completed ? "Edit" : "Select"}
                                    </button>
                                </div>
                            </div>

                            {/* show summary if completed */}
                            {completed && renderSelectedSummary(pkgId)}

                            {/* if this package is active, show step UI */}
                            {activePackage === pkgId && (
                                <div className="mt-3 border-t pt-3">
                                    <div className="mb-2">
                                        <label className="text-sm font-medium">Appointment Date</label>
                                        <input
                                            type="date"
                                            value={appointmentDate}
                                            onChange={(e) => setAppointmentDate(e.target.value)}
                                            className="ml-2 border px-2 py-1 rounded"
                                        />
                                    </div>

                                    {/* Step: slots */}
                                    {activeStep === "slots" && (
                                        <>
                                            <div className="mb-2 font-medium">Select Slot</div>
                                            <div className="flex flex-wrap gap-2">
                                                {slots.length === 0 && (
                                                    <div className="text-sm text-gray-500">No slots for this date</div>
                                                )}
                                                {slots.map((slot) => {
                                                    const isChosen =
                                                        selections[pkgId] && selections[pkgId].selectedSlotId === String(slot.id);
                                                    return (
                                                        <button
                                                            key={slot.id}
                                                            onClick={() => onSelectSlot(slot)}
                                                            className={`border p-2 rounded text-sm ${isChosen ? "bg-green-600 text-white" : "bg-white"
                                                                }`}
                                                        >
                                                            {slot.startAt} - {slot.endAt}
                                                            <div className="text-xs">{slot.capacity} available</div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </>
                                    )}

                                    {/* Step: family */}
                                    {activeStep === "family" && (
                                        <>
                                            <div className="mb-2 font-medium">Select Patient</div>
                                            <div className="flex flex-wrap gap-2">
                                                {familyMembers.length === 0 && (
                                                    <div className="text-sm text-gray-500">No family members found</div>
                                                )}
                                                {familyMembers.map((fm) => {
                                                    const chosen = selections[pkgId] && selections[pkgId].patientId === String(fm.id);
                                                    return (
                                                        <button
                                                            key={fm.id}
                                                            onClick={() => onSelectFamily(fm)}
                                                            className={`border p-2 rounded text-sm ${chosen ? "bg-green-600 text-white" : "bg-white"
                                                                }`}
                                                        >
                                                            {fm.name} {fm.relationship ? `(${fm.relationship})` : ""}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </>
                                    )}

                                    {/* Step: address */}
                                    {activeStep === "address" && (
                                        <>
                                            <div className="mb-2 font-medium">Select Address</div>
                                            <div className="flex flex-wrap gap-2">
                                                {addresses.length === 0 && (
                                                    <div className="text-sm text-gray-500">No addresses found</div>
                                                )}
                                                {addresses.map((ad) => {
                                                    const chosen =
                                                        selections[pkgId] && selections[pkgId].selectedAddressId === String(ad.id);
                                                    return (
                                                        <button
                                                            key={ad.id}
                                                            onClick={() => onSelectAddress(ad)}
                                                            className={`border p-2 rounded text-sm ${chosen ? "bg-green-600 text-white" : "bg-white"
                                                                }`}
                                                        >
                                                            {ad.city} - {ad.houseNumber || ad.fullAddress}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Checkout */}
            <div className="mt-6">
                <button
                    onClick={handleCheckout}
                    disabled={Object.values(selections).filter(
                        (s) =>
                            s &&
                            s.appointmentDate &&
                            s.selectedSlotId &&
                            s.selectedAddressId &&
                            s.selectedPackageId &&
                            s.patientId
                    ).length === 0}
                    className={`px-6 py-2 rounded font-medium ${Object.values(selections).filter(
                        (s) =>
                            s &&
                            s.appointmentDate &&
                            s.selectedSlotId &&
                            s.selectedAddressId &&
                            s.selectedPackageId &&
                            s.patientId
                    ).length === 0
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : "bg-blue-600 text-white"
                        }`}
                >
                    Checkout ({Object.values(selections).filter(
                        (s) =>
                            s &&
                            s.appointmentDate &&
                            s.selectedSlotId &&
                            s.selectedAddressId &&
                            s.selectedPackageId &&
                            s.patientId
                    ).length})
                </button>
            </div>
        </div>
    );
}

export default SelectSlot;
