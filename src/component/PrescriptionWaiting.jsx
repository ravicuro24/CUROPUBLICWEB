import React, { useEffect, useState } from "react";
import { useStomp } from "../notification/StompSocket";
import PrescriptionMedicineCart from "../pages/medicine/PrescriptionMedicineCart";
import { useNavigate } from "react-router-dom";

function PrescriptionWaiting() {
    const { connected, subscribe } = useStomp();
    const [subscription, setSubscription] = useState(null);
    const [isPrepared, setIsPrepared] = useState(false)

    const recentUploadedPrescriptionId = localStorage.getItem("recentUplaodedPrescriptionIs");
    const [recentAcceptedPrescriptionId, setRecentAcceptedPrescriptionId] = useState(
        localStorage.getItem("recentAcceptedPrescriptionId")
    );
    const navigate = useNavigate()

    // ---- Handle subscription logic ----
    const subscribeToEndpoint = (endpoint, onMessage) => {
        if (!connected) return;

        // Unsubscribe old if exists
        if (subscription) subscription.unsubscribe();

        const sub = subscribe(endpoint, onMessage);
        setSubscription(sub);
    };

    useEffect(() => {
        if (!recentUploadedPrescriptionId) {
            navigate("/")
        }
    }, [])

    // ----- Stage 1 → Waiting for pharmacist to ACCEPT -----
    useEffect(() => {
        if (!connected) return;

        if (!recentAcceptedPrescriptionId) {
            // Subscribe to acceptance channel
            subscribeToEndpoint(
                `/topic/prescription-accept-${recentUploadedPrescriptionId}`,
                (msg) => {
                    // Store accepted prescription ID
                    localStorage.setItem("recentAcceptedPrescriptionId", msg.prescriptionId);
                    setRecentAcceptedPrescriptionId(msg.prescriptionId);

                    alert(msg.message);
                }
            );
        }
    }, [connected, recentAcceptedPrescriptionId]);

    // ----- Stage 2 → Pharmacist PREPARED the prescription -----
    useEffect(() => {
        if (!connected) return;


        if (recentAcceptedPrescriptionId) {
            // Subscribe to next stage
            subscribeToEndpoint(
                `/topic/prescription-prepared-${recentAcceptedPrescriptionId}`,
                (msg) => {
                    setIsPrepared(true)
                }
            );
        }
    }, [connected, recentAcceptedPrescriptionId]);

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-10 py-10">

            {/* --- STEPS ROADMAP --- */}
            <div className="w-full max-w-md mb-10">
                <div className="flex justify-between items-center">

                    {/* Step 1: Uploaded */}
                    <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center 
                        ${recentUploadedPrescriptionId ? "bg-green-500 text-white" : "bg-gray-300 text-gray-600"}`}>
                            1
                        </div>
                        <p className="text-xs sm:text-sm mt-2 font-medium">Uploaded</p>
                    </div>

                    {/* Line between */}
                    <div className={`flex-1 h-1 mx-2 
                    ${recentAcceptedPrescriptionId ? "bg-green-500" : "bg-gray-300"}`}
                    ></div>

                    {/* Step 2: Accepted */}
                    <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center 
                        ${recentAcceptedPrescriptionId ? "bg-green-500 text-white" : "bg-gray-300 text-gray-600"}`}>
                            2
                        </div>
                        <p className="text-xs sm:text-sm mt-2 font-medium">Accepted</p>
                    </div>

                    {/* Line between */}
                    <div className={`flex-1 h-1 mx-2 
                    ${false ? "bg-green-500" : "bg-gray-300"}`}
                    ></div>

                    {/* Step 3: Prepared */}
                    <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center 
                        ${false ? "bg-green-500 text-white" : "bg-gray-300 text-gray-600"}`}>
                            3
                        </div>
                        <p className="text-xs sm:text-sm mt-2 font-medium">Prepared</p>
                    </div>
                </div>
            </div>

            {/* --- EXISTING UI BELOW --- */}
            <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-8 lg:p-10 w-full max-w-sm sm:max-w-md lg:max-w-lg text-center border-t-4 border-teal-600">
                {isPrepared ? <div >
                    
                </div>
                    :
                    <div className="flex justify-center mb-6">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                }
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-800">
                    Prescription Uploaded Successfully!
                </h1>

                {!isPrepared && <p className="text-gray-600 mt-3 text-sm sm:text-base leading-relaxed">
                    {recentAcceptedPrescriptionId
                        ? "Pharmacist accepted your prescription. Preparing your order..."
                        : "Please wait while our pharmacist reviews your prescription."}
                </p>}

                {isPrepared ? <div className="p-3 text-green-100 rounded-2xl bg-green-600 mt-10"> Prescription prepared now you can preview and place order ...</div> : <div className="mt-6 bg-teal-50 text-teal-800 rounded-xl p-3 sm:p-4 border border-teal-200">
                    <p className="text-sm sm:text-base font-medium">
                        {recentAcceptedPrescriptionId
                            ? "⏳ Preparing your prescription…"
                            : "⏳ Waiting for pharmacist response…"}
                    </p>
                </div>}

                <div className="mt-8">
                    <div className="w-full h-2 bg-teal-100 rounded-full overflow-hidden">
                        <div className="h-full bg-teal-600 animate-pulse"></div>
                    </div>
                </div>
            </div>

            <div className="mt-5">
                {recentAcceptedPrescriptionId && <PrescriptionMedicineCart prepared={isPrepared}/>}
            </div>
        </div>
    );

}

export default PrescriptionWaiting;
