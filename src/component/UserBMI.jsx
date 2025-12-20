// src/component/UserBMI.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
    FaWeight,
    FaRulerVertical,
    FaCalculator,
    FaEdit,
    FaSave,
    FaTimes,
    FaHeart,
    FaRunning,
    FaAppleAlt,
    FaChartLine,
    FaExclamationTriangle,
    FaCheckCircle,
    FaInfoCircle
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../Authorization/AuthContext";
import axiosInstance from "../Authorization/axiosInstance";
import { getBmiDetails } from "./bmiDetails";
import { IoIosArrowForward } from "react-icons/io";
import LoadingAnimation from "../LoaderSpinner";

/* ---------------- Helpers ---------------- */
const calculateBMI = (weight, heightCm) => {
    if (!weight || !heightCm) return null;
    const heightM = heightCm / 100;
    return +(weight / (heightM * heightM)).toFixed(1);
};

const getBMICategory = (bmi) => {
    if (!bmi) return "—";
    if (bmi < 16) return "Severe Thinness";
    if (bmi < 17) return "Moderate Thinness";
    if (bmi < 18.5) return "Mild Thinness";
    if (bmi < 25) return "Normal";
    if (bmi < 30) return "Overweight";
    if (bmi < 35) return "Obese Class I";
    if (bmi < 40) return "Obese Class II";
    return "Obese Class III";
};

const getBMIColor = (bmi) => {
    if (!bmi) return "#6b7280";
    if (bmi < 16) return "#dc2626";
    if (bmi < 17) return "#f97316";
    if (bmi < 18.5) return "#f59e0b";
    if (bmi < 25) return "#10b981";
    if (bmi < 30) return "#f59e0b";
    if (bmi < 35) return "#f97316";
    if (bmi < 40) return "#dc2626";
    return "#991b1b";
};

const getRiskColor = (risk) => {
    if (!risk) return "#6b7280";
    if (risk.includes("Low")) return "#10b981";
    if (risk.includes("Medium")) return "#f59e0b";
    if (risk.includes("Enhanced")) return "#f97316";
    if (risk.includes("High")) return "#dc2626";
    if (risk.includes("Very high")) return "#991b1b";
    if (risk.includes("Extremely high")) return "#7f1d1d";
    return "#6b7280";
};

const getBMIPercentage = (bmi) => {
    if (!bmi) return 0;
    const maxBmi = 40;
    return Math.min((bmi / maxBmi) * 100, 100);
};

const getSegmentRanges = () => {
    return [
        { min: 0, max: 16, label: "Severe", color: "#dc2626" },
        { min: 16, max: 17, label: "Moderate", color: "#f97316" },
        { min: 17, max: 18.5, label: "Mild", color: "#f59e0b" },
        { min: 18.5, max: 25, label: "Normal", color: "#10b981" },
        { min: 25, max: 30, label: "Overweight", color: "#f59e0b" },
        { min: 30, max: 35, label: "Obese I", color: "#f97316" },
        { min: 35, max: 40, label: "Obese II", color: "#dc2626" },
    ];
};

/* ---------------- Circular Progress Component ---------------- */
const CircularProgress = ({ percentage, bmi, category, color, bmiDetails }) => {
    const radius = 100;
    const strokeWidth = 16;
    const normalizedRadius = radius - strokeWidth * 0.5;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    const getSegmentDashArray = (segment) => {
        const segmentPercentage = ((segment.max - segment.min) / 40) * 100;
        const segmentLength = (segmentPercentage / 100) * circumference;
        return `${segmentLength} ${circumference - segmentLength}`;
    };

    const getRiskIcon = () => {
        if (!bmiDetails?.risk) return null;

        if (bmiDetails.risk.includes("Low"))
            return <FaCheckCircle className="text-green-500 text-2xl" />;
        if (bmiDetails.risk.includes("Medium") || bmiDetails.risk.includes("Enhanced"))
            return <FaInfoCircle className="text-yellow-500 text-2xl" />;
        return <FaExclamationTriangle className="text-red-500 text-2xl" />;
    };

    const segments = getSegmentRanges();

    return (
        <div className="relative flex flex-col items-center">
            <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
                {/* Background circle */}
                <circle
                    stroke="#e5e7eb"
                    fill="none"
                    strokeWidth={strokeWidth}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />

                {/* BMI range segments */}
                {segments.map((segment, index) => {
                    const segmentRotation = (segment.min / 40) * 360;
                    return (
                        <circle
                            key={index}
                            stroke={segment.color}
                            fill="none"
                            strokeWidth={strokeWidth}
                            strokeLinecap="round"
                            r={normalizedRadius}
                            cx={radius}
                            cy={radius}
                            strokeDasharray={getSegmentDashArray(segment)}
                            transform={`rotate(${segmentRotation} ${radius} ${radius})`}
                            opacity="0.2"
                        />
                    );
                })}

                {/* Progress circle */}
                <circle
                    stroke={color}
                    fill="none"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    style={{ transition: "stroke-dashoffset 0.8s ease-in-out" }}
                />
            </svg>

            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <div className="text-4xl font-bold mb-1" style={{ color }}>
                    {bmi || "--"}
                </div>
                <div className="text-sm text-gray-500 mb-1">BMI</div>
                <div className="flex items-center justify-center gap-1">
                    {getRiskIcon()}
                    <div className="text-sm font-medium" style={{ color }}>
                        {category}
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ---------------- BMI Scale Component ---------------- */
const BMIScale = ({ bmi }) => {
    const ranges = getSegmentRanges();
    const currentPosition = bmi ? (bmi / 40) * 100 : 0;

    return (
        <div className="mt-8">
            <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <FaChartLine className="text-blue-500" />
                BMI Scale
            </h3>
            <div className="relative h-8 bg-gradient-to-r from-red-600 via-orange-400 via-yellow-400 via-green-500 via-yellow-400 via-orange-400 to-red-600 rounded-full overflow-hidden">
                {/* Current BMI indicator */}
                {bmi && (
                    <motion.div
                        initial={{ left: "0%" }}
                        animate={{ left: `${currentPosition}%` }}
                        transition={{ type: "spring", stiffness: 100 }}
                        className="absolute top-1/2 w-8 h-8 bg-white border-4 border-gray-800 rounded-full -translate-x-1/2 -translate-y-1/2 shadow-lg z-10"
                    >
                        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs font-semibold px-3 py-1 rounded-lg whitespace-nowrap">
                            {bmi}
                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
                        </div>
                    </motion.div>
                )}

                {/* Range markers */}
                {ranges.map((range, index) => (
                    <div
                        key={index}
                        className="absolute top-0 w-0.5 h-10 bg-white"
                        style={{ left: `${(range.min / 40) * 100}%` }}
                    >
                        <div className="absolute top-10 text-xs text-gray-600 whitespace-nowrap -translate-x-1/2 mt-2">
                            {range.min}
                        </div>
                    </div>
                ))}
                <div className="absolute top-0 right-0 w-0.5 h-10 bg-white -translate-x-1/2">
                    <div className="absolute top-10 text-xs text-gray-600 whitespace-nowrap -translate-x-1/2 mt-2">
                        40
                    </div>
                </div>
            </div>

            {/* Range labels */}
            <div className="grid grid-cols-7 gap-2 mt-10">
                {ranges.map((range, index) => (
                    <div key={index} className="text-center">
                        <div
                            className="w-3 h-3 rounded-full mx-auto mb-1"
                            style={{ backgroundColor: range.color }}
                        />
                        <div className="text-xs font-medium text-gray-700 truncate">{range.label}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

/* ---------------- Health Metrics Component ---------------- */
const HealthMetrics = ({ bmi, weight, height, bmiDetails }) => {
    const calculateIdealWeight = () => {
        if (!height) return { min: 0, max: 0 };
        const heightM = height / 100;
        const min = (18.5 * heightM * heightM).toFixed(1);
        const max = (24.9 * heightM * heightM).toFixed(1);
        return { min, max };
    };

    const idealWeight = calculateIdealWeight();
    const currentWeight = parseFloat(weight) || 0;
    const midIdealWeight = (parseFloat(idealWeight.min) + parseFloat(idealWeight.max)) / 2;
    const weightDiff = currentWeight - midIdealWeight;

    const getWeightStatus = () => {
        if (!weight) return null;
        if (currentWeight < parseFloat(idealWeight.min))
            return { text: "Under ideal range", color: "text-blue-600", bg: "bg-blue-50" };
        if (currentWeight > parseFloat(idealWeight.max))
            return { text: "Above ideal range", color: "text-yellow-600", bg: "bg-yellow-50" };
        return { text: "Within ideal range", color: "text-green-600", bg: "bg-green-50" };
    };

    const weightStatus = getWeightStatus();

    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                <div className="flex flex-col justify-center items-center gap-2 mb-2">
                    <FaWeight className="text-blue-500" />
                    <h4 className="font-semibold text-gray-700 text-center">Current Weight</h4>
                </div>
                <div className="text-md font-bold text-gray-800 text-center">
                    {currentWeight || "--"} <span className="text-sm text-gray-500">kg</span>
                </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                <div className="flex flex-col items-center gap-2 mb-2">
                    <FaRulerVertical className="text-green-500" />
                    <h4 className="font-semibold text-gray-700">Height</h4>
                </div>
                <div className="text-md font-bold text-gray-800 text-center">
                    {height || "--"} <span className="text-sm text-gray-500">cm</span>
                </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                <div className="flex flex-col items-center gap-2 mb-2">
                    <FaHeart className="text-purple-500" />
                    <h4 className="font-semibold text-gray-700">Ideal Weight</h4>
                </div>
                <div className="text-md font-bold text-gray-800 text-center">
                    {idealWeight.min} - {idealWeight.max} <span className="text-sm text-gray-500">kg</span>
                </div>
                {weightStatus && (
                    <div className={`text-xs font-medium mt-2 px-2 py-1 rounded-full inline-block ${weightStatus.bg} ${weightStatus.color}`}>
                        {weightStatus.text}
                    </div>
                )}
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-xl border border-amber-200">
                <div className="flex flex-col items-center gap-2 mb-2">
                    <FaChartLine className="text-amber-500" />
                    <h4 className="font-semibold text-gray-700">Health Risk</h4>
                </div>
                <div className="text-md font-bold mb-1 text-center" style={{ color: getRiskColor(bmiDetails?.risk) }}>
                    {bmiDetails?.risk || "--"}
                </div>
                <div className="text-xs text-gray-600 truncate text-center">
                    {bmiDetails?.summary || "Enter your measurements"}
                </div>
            </div>
        </div>
    );
};

/* ---------------- Main Component ---------------- */
const UserBMI = () => {
    const { userData ,setAuthModal } = useAuth();
    const id = userData?.id;

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    const [form, setForm] = useState({
        weight: "",
        height: ""
    });

    /* ---------- Fetch Profile ---------- */
    useEffect(() => {
        if (!id) return;

        const fetchProfile = async () => {
            try {
                setLoading(true);
                const res = await axiosInstance.get(
                    `/endUserEndPoint/getEndUserProfile?id=${id}`
                );
                const dto = res.data?.dto;
                setProfile(dto);

                setForm({
                    weight: dto?.weight?.toString() || "",
                    height: dto?.heightCm?.toString() || ""
                });
            } catch (err) {
                console.error("Profile fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [id]);

    /* ---------- BMI Calculations ---------- */
    const bmi = useMemo(() => {
        return calculateBMI(
            parseFloat(form.weight),
            parseFloat(form.height)
        );
    }, [form]);

    const bmiCategory = useMemo(() => getBMICategory(bmi), [bmi]);
    const bmiDetails = useMemo(() => {
        if (!bmi) return null;
        return getBmiDetails(bmi);
    }, [bmi]);

    const bmiColor = useMemo(() => getBMIColor(bmi), [bmi]);
    const riskColor = useMemo(() => getRiskColor(bmiDetails?.risk), [bmiDetails]);
    const bmiPercentage = useMemo(() => getBMIPercentage(bmi), [bmi]);

    /* ---------- Handlers ---------- */
    const handleChange = (key, value) => {
        const numValue = value === "" ? "" : Math.max(0, parseFloat(value));
        setForm((prev) => ({ ...prev, [key]: numValue.toString() }));
    };

    const handleSave = async () => {
        try {
            await axiosInstance.put(
                `/endUserEndPoint/updateEndUserProfile?id=${id}`,
                {
                    weight: Number(form.weight),
                    heightCm: Number(form.height)
                }
            );
            setIsEditing(false);
        } catch (err) {
            alert("Failed to update profile");
        }
    };

    /* ---------- LOGIN CHECK ---------- */
    if (!id) {
        return (
            <div className="container mx-auto">
                <div
                onClick={()=>setAuthModal(true)}
                className=" p-8 rounded-2xl border border-gray-200 bg-gray-50  text-start  animate-fade-in">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                Please Login
                            </h2>
                            <p className="text-gray-500 mb-6">
                                Login to view and calculate your BMI.
                            </p>
                        </div>
                        <div>
                            <IoIosArrowForward className="text-2xl" />

                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <LoadingAnimation/>
        );
    }

    /* ---------- UI ---------- */
    return (
        <AnimatePresence mode="wait">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className=""
            >
                <div className=" w-full md:container mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">BMI Health Dashboard</h1>
                            <p className="text-gray-600 mt-2">Monitor your Body Mass Index and health metrics</p>
                        </div>

                        <div className="flex gap-2">
                            {!isEditing ? (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setIsEditing(true)}
                                    className="px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-400 hover:from-teal-600 hover:to-teal-700 cursor-pointer text-white rounded-xl flex items-center gap-2 shadow-lg transition-all"
                                >
                                    <FaEdit />
                                    Edit Measurements
                                </motion.button>
                            ) : (
                                <>

                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setIsEditing(false)}
                                        className="px-6 py-3 bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white rounded-xl flex items-center gap-2 shadow-lg transition-all"
                                    >
                                        <FaTimes />
                                        Cancel
                                    </motion.button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Main Card */}
                    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6">
                        {/* Inputs Section */}
                        <div className="mb-8">
                            <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                <FaCalculator className="text-blue-500" />
                                Enter Your Measurements
                            </h2>
                            <div className="grid md:grid-cols-2 gap-6 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Weight (kg)</label>
                                    <div className="relative group">
                                        <FaWeight className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500" />
                                        <input
                                            type="number"
                                            value={form.weight}
                                            disabled={!isEditing}
                                            onChange={(e) => handleChange("weight", e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                                            placeholder="Enter weight"
                                            min="20"
                                            max="300"
                                            step="0.1"
                                        />
                                        <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                                            kg
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Height (cm)</label>
                                    <div className="relative group">
                                        <FaRulerVertical className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500" />
                                        <input
                                            type="number"
                                            value={form.height}
                                            disabled={!isEditing}
                                            onChange={(e) => handleChange("height", e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                                            placeholder="Enter height"
                                            min="100"
                                            max="250"
                                            step="0.1"
                                        />
                                        <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                                            cm
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* BMI Display Section */}
                        <div className="grid lg:grid-cols-2 gap-8">
                            {/* Left: Circular Progress and Details */}
                            <div>
                                <div className="flex flex-col items-center p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200">
                                    <CircularProgress
                                        percentage={bmiPercentage}
                                        bmi={bmi}
                                        category={bmiCategory}
                                        color={bmiColor}
                                        bmiDetails={bmiDetails}
                                    />

                                    {/* Risk Level Badge */}
                                    {bmiDetails && (
                                        <motion.div
                                            initial={{ scale: 0.9, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className="mt-6 px-4 py-2 rounded-full flex items-center gap-2 shadow-sm"
                                            style={{
                                                backgroundColor: `${riskColor}15`,
                                                border: `1px solid ${riskColor}30`
                                            }}
                                        >
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: riskColor }} />
                                            <span className="font-semibold" style={{ color: riskColor }}>
                                                {bmiDetails.risk}
                                            </span>
                                        </motion.div>
                                    )}
                                </div>

                                {/* Health Metrics */}
                                <HealthMetrics
                                    bmi={bmi}
                                    weight={parseFloat(form.weight)}
                                    height={parseFloat(form.height)}
                                    bmiDetails={bmiDetails}
                                />
                            </div>

                            {/* Right: BMI Scale and Recommendations */}
                            <div>
                                <BMIScale bmi={bmi} />

                                {/* Detailed Recommendations */}
                                {bmiDetails && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200"
                                    >
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                            <FaHeart className="text-blue-500" />
                                            Health Recommendations
                                        </h3>

                                        <div className="space-y-4">
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <FaRunning className="text-blue-500" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-800">Exercise Plan</h4>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        {bmiDetails.recommendation.includes('exercise')
                                                            ? bmiDetails.recommendation
                                                            : bmi < 18.5
                                                                ? 'Focus on strength training 3 times per week combined with light cardio'
                                                                : bmi < 25
                                                                    ? 'Maintain with 150 minutes of moderate exercise or 75 minutes of vigorous exercise weekly'
                                                                    : 'Aim for 300 minutes of moderate exercise weekly with strength training'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <FaAppleAlt className="text-green-500" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-800">Nutrition Guidance</h4>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        {bmi < 18.5
                                                            ? 'Increase calorie intake with protein-rich foods, healthy fats, and complex carbohydrates'
                                                            : bmi < 25
                                                                ? 'Maintain balanced diet with portion control, focusing on whole foods and vegetables'
                                                                : 'Focus on calorie deficit with high-protein, low-glycemic index foods and reduce processed sugars'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-6 pt-6 border-t border-blue-200">
                                            <h4 className="font-semibold text-gray-800 mb-2">Summary</h4>
                                            <p className="text-sm text-gray-700">
                                                {bmiDetails.summary}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </div>


                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default UserBMI;