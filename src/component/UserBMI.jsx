import React, { useEffect, useState, useMemo } from "react";
import {
    FaWeight,
    FaRulerVertical,
    FaBirthdayCake,
    FaUser,
    FaDumbbell,
    FaAppleAlt,
    FaBed,
    FaGlassWhiskey,
    FaBone,
    FaTint,
    FaPercentage,
    FaChevronRight,
    FaBullseye,
    FaCalculator,
    FaEdit,
    FaCheck,
    FaTimes
} from "react-icons/fa";
import { MdFavorite, MdDirectionsWalk } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../Authorization/AuthContext";

/* ---------- Helpers ---------- */
const calculateBMI = (weight, heightCm) => {
    if (!weight || !heightCm) return null;
    const heightM = heightCm / 100;
    return +(weight / (heightM * heightM)).toFixed(1);
};

const getBMICategory = (bmi) => {
    if (!bmi) return "—";
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal Weight";
    if (bmi < 30) return "Overweight";
    return "Obese";
};

const getBMIColor = (bmi) => {
    if (!bmi) return "from-gray-500 to-gray-600";
    if (bmi < 18.5) return "from-blue-400 to-cyan-500";
    if (bmi < 25) return "from-green-500 to-emerald-600";
    if (bmi < 30) return "from-amber-500 to-orange-500";
    return "from-red-500 to-rose-600";
};

const getBMIProgress = (bmi) => {
    if (!bmi) return 0;
    const min = 18.5;
    const max = 30;
    return Math.min(Math.max((bmi - min) / (max - min), 0), 1);
};

const UserBMI = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const { userData } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [calculatorValues, setCalculatorValues] = useState({
        weight: "",
        height: ""
    });
    const [userInfo, setUserInfo] = useState({
        weight: 71.9,
        height: 170,
        age: null,
        gender: null,
        goalWeight: 68,
        bodyFat: "18.5%",
        muscle: "38.2%",
        water: "55%",
        bone: "3.2 kg",
        heartRate: 72,
        steps: 8425,
    });

    // Initialize with auth data
    useEffect(() => {
        if (userData) {
            setUserInfo(prev => ({
                ...prev,
                age: userData.age || null,
                gender: userData.gender || null
            }));
        }
    }, [userData]);

    // Calculate BMI from calculator inputs or user info
    const calculatedBMI = useMemo(() => {
        if (calculatorValues.weight && calculatorValues.height) {
            return calculateBMI(calculatorValues.weight, calculatorValues.height);
        }
        return calculateBMI(userInfo.weight, userInfo.height);
    }, [calculatorValues, userInfo.weight, userInfo.height]);

    const bmiCategory = useMemo(() => getBMICategory(calculatedBMI), [calculatedBMI]);
    const bmiProgress = useMemo(() => getBMIProgress(calculatedBMI), [calculatedBMI]);
    const bmiColor = useMemo(() => getBMIColor(calculatedBMI), [calculatedBMI]);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoaded(true), 300);
        return () => clearTimeout(timer);
    }, []);

    const handleInputChange = (field, value) => {
        setCalculatorValues(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSaveCalculator = () => {
        if (calculatorValues.weight && calculatorValues.height) {
            setUserInfo(prev => ({
                ...prev,
                weight: parseFloat(calculatorValues.weight),
                height: parseFloat(calculatorValues.height)
            }));
            setIsEditing(false);
        }
    };

    const handleCancelEdit = () => {
        setCalculatorValues({
            weight: userInfo.weight.toString(),
            height: userInfo.height.toString()
        });
        setIsEditing(false);
    };

    const goalProgress = useMemo(() => {
        const weight = calculatorValues.weight || userInfo.weight;
        const goalWeight = userInfo.goalWeight;
        if (!weight || !goalWeight) return 0;
        const total = Math.abs(weight - goalWeight);
        const assumedTarget = 10;
        return Math.min((total / assumedTarget) * 100, 100);
    }, [calculatorValues.weight, userInfo.weight, userInfo.goalWeight]);

    /* ---------- Animation Variants ---------- */
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2,
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0, scale: 0.9 },
        visible: {
            y: 0,
            opacity: 1,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15
            }
        }
    };

    /* ---------- UI Data ---------- */
    const circularStats = [
        { icon: <FaWeight />, label: "Weight", value: `${userInfo.weight} kg`, color: "from-blue-500 to-cyan-500", progress: 0.85 },
        { icon: <FaRulerVertical />, label: "Height", value: `${userInfo.height} cm`, color: "from-emerald-500 to-green-500", progress: 0.65 },
        { icon: <FaBirthdayCake />, label: "Age", value: userInfo.age ? `${userInfo.age} Y` : "—", color: "from-purple-500 to-pink-500", progress: 0.72 },
        { icon: <FaUser />, label: "Gender", value: userInfo.gender || "—", color: "from-amber-500 to-orange-500", progress: 1.0 },
    ];

    const healthMetrics = [
        { label: "Body Fat", value: userInfo.bodyFat, status: "Healthy", icon: <FaPercentage />, color: "from-purple-500 to-purple-600", progress: 0.74 },
        { label: "Muscle Mass", value: userInfo.muscle, status: "Good", icon: <FaDumbbell />, color: "from-blue-500 to-blue-600", progress: 0.82 },
        { label: "Water", value: userInfo.water, status: "Optimal", icon: <FaTint />, color: "from-teal-500 to-cyan-600", progress: 0.91 },
        { label: "Bone Mass", value: userInfo.bone, status: "Normal", icon: <FaBone />, color: "from-gray-500 to-gray-600", progress: 0.68 },
    ];

   

    const recommendations = [
        { title: "Exercise", desc: "30 mins cardio daily", icon: <FaDumbbell />, color: "from-green-50 to-emerald-100" },
        { title: "Nutrition", desc: "Reduce sugar intake", icon: <FaAppleAlt />, color: "from-amber-50 to-orange-100" },
        { title: "Sleep", desc: "7–8 hours nightly", icon: <FaBed />, color: "from-indigo-50 to-blue-100" },
        { title: "Hydration", desc: "2L per day", icon: <FaGlassWhiskey />, color: "from-sky-50 to-cyan-100" },
    ];

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8"
            >
                {/* Header */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <h1 className="text-md md:text-xl font-bold text-gray-900 mb-1">
                        Health Dashboard
                    </h1>
                    <p className="text-gray-500">
                        Monitor your body metrics and wellness
                    </p>
                </motion.div>

                {/* BMI Calculator Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-8"
                >
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <FaCalculator className="text-blue-600 text-xl" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">BMI Calculator</h2>
                                    <p className="text-sm text-gray-500">Calculate your Body Mass Index</p>
                                </div>
                            </div>
                            {!isEditing ? (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                        setCalculatorValues({
                                            weight: userInfo.weight.toString(),
                                            height: userInfo.height.toString()
                                        });
                                        setIsEditing(true);
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    <FaEdit /> Edit
                                </motion.button>
                            ) : (
                                <div className="flex gap-2">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleSaveCalculator}
                                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                    >
                                        <FaCheck /> Save
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleCancelEdit}
                                        className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                                    >
                                        <FaTimes /> Cancel
                                    </motion.button>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Input Fields */}
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Weight (kg)
                                    </label>
                                    <div className="relative">
                                        <FaWeight className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={calculatorValues.weight}
                                            onChange={(e) => handleInputChange('weight', e.target.value)}
                                            className={`w-full pl-10 pr-4 py-3 border rounded-xl ${isEditing ? 'bg-white border-blue-300 focus:border-blue-500' : 'bg-gray-50 border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all`}
                                            disabled={!isEditing}
                                            placeholder="Enter weight in kg"
                                        />
                                        {!isEditing && (
                                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                                kg
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Height (cm)
                                    </label>
                                    <div className="relative">
                                        <FaRulerVertical className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={calculatorValues.height}
                                            onChange={(e) => handleInputChange('height', e.target.value)}
                                            className={`w-full pl-10 pr-4 py-3 border rounded-xl ${isEditing ? 'bg-white border-blue-300 focus:border-blue-500' : 'bg-gray-50 border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all`}
                                            disabled={!isEditing}
                                            placeholder="Enter height in cm"
                                        />
                                        {!isEditing && (
                                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                                cm
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {isEditing && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-4 bg-blue-50 rounded-lg border border-blue-200"
                                    >
                                        <p className="text-sm text-blue-700">
                                            Enter your weight and height to calculate your BMI. Your data will be saved to update your profile.
                                        </p>
                                    </motion.div>
                                )}
                            </div>

                            {/* BMI Result Display */}
                            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 flex flex-col justify-center">
                                <div className="text-center mb-6">
                                    <p className="text-gray-600 text-sm mb-2">Calculated BMI</p>
                                    <motion.div
                                        key={calculatedBMI}
                                        initial={{ scale: 0.8 }}
                                        animate={{ scale: 1 }}
                                        className={`text-6xl font-bold ${calculatedBMI ? getBMIColor(calculatedBMI).replace('from-', 'text-').split(' ')[0] : 'text-gray-400'}`}
                                    >
                                        {calculatedBMI ? calculatedBMI : "--"}
                                    </motion.div>
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className={`inline-block mt-3 px-4 py-1.5 rounded-full text-sm font-medium ${calculatedBMI ? 'bg-white/10 backdrop-blur-sm border' : 'bg-gray-200'}`}
                                    >
                                        {bmiCategory}
                                    </motion.div>
                                </div>

                                {/* BMI Scale */}
                                <div className="mt-4">
                                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                                        <span>Underweight</span>
                                        <span>Normal</span>
                                        <span>Overweight</span>
                                        <span>Obese</span>
                                    </div>
                                    <div className="h-2 bg-gradient-to-r from-blue-400 via-green-500 via-amber-500 to-red-500 rounded-full relative">
                                        {calculatedBMI && (
                                            <motion.div
                                                initial={{ left: "0%" }}
                                                animate={{ left: `${((calculatedBMI - 15) / (40 - 15)) * 100}%` }}
                                                className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2"
                                            >
                                                <div className="w-4 h-4 bg-white rounded-full shadow-lg border-2 border-gray-800" />
                                            </motion.div>
                                        )}
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                                        <span>{"<18.5"}</span>
                                        <span>18.5-25</span>
                                        <span>25-30</span>
                                        <span>{">30"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Main BMI Card with Circular Progress */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={isLoaded ? "visible" : "hidden"}
                    className="mb-8"
                >
                    <div className="relative bg-gradient-to-br from-gray-900 to-black text-white p-6 md:p-8 rounded-3xl overflow-hidden">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-600/20" />
                        </div>

                        <div className="relative z-10">
                            <div className="flex flex-col md:flex-row items-center justify-between">
                                <div className="mb-6 md:mb-0 md:mr-8">
                                    <p className="text-white/80 text-sm mb-2">Current BMI</p>
                                    <h2 className="text-5xl md:text-6xl font-bold mb-2">{calculatedBMI ?? "--"}</h2>
                                    <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium border border-white/20">
                                        {bmiCategory}
                                    </span>
                                    <div className="mt-4 text-sm text-white/60">
                                        <p>Weight: <span className="font-medium">{userInfo.weight} kg</span></p>
                                        <p>Height: <span className="font-medium">{userInfo.height} cm</span></p>
                                    </div>
                                </div>

                                {/* Large Circular BMI Progress */}
                                <div className="relative w-48 h-48">
                                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                        <circle
                                            cx="50"
                                            cy="50"
                                            r="45"
                                            fill="none"
                                            stroke="rgba(255,255,255,0.1)"
                                            strokeWidth="8"
                                        />
                                        <motion.circle
                                            cx="50"
                                            cy="50"
                                            r="45"
                                            fill="none"
                                            stroke="url(#bmiGradient)"
                                            strokeWidth="8"
                                            strokeLinecap="round"
                                            initial={{ pathLength: 0 }}
                                            animate={{ pathLength: bmiProgress }}
                                            transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
                                        />
                                        <defs>
                                            <linearGradient id="bmiGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="#10b981" />
                                                <stop offset="100%" stopColor="#059669" />
                                            </linearGradient>
                                        </defs>
                                    </svg>

                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <FaWeight className="text-2xl text-white/80 mb-2" />
                                        <span className="text-2xl font-bold">
                                            {(bmiProgress * 100).toFixed(1)}%
                                        </span>
                                        <span className="text-sm text-white/60">of healthy range</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Circular Stats Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={isLoaded ? "visible" : "hidden"}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8 px-2"
                >
                    {circularStats.map((stat, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className="flex justify-center items-center min-h-[200px] md:min-h-[240px]"
                        >
                            <CircularCard
                                icon={stat.icon}
                                label={stat.label}
                                value={stat.value}
                                color={stat.color}
                                progress={stat.progress}
                                delay={index * 0.1}
                            />
                        </motion.div>
                    ))}
                </motion.div>

                {/* Activity Metrics */}
                

                {/* Health Metrics with Circular Progress */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mb-8"
                >
                    <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center md:text-left">
                        Health Metrics
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        {healthMetrics.map((metric, index) => (
                            <motion.div
                                key={index}
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.5 + index * 0.1 }}
                                whileHover={{ y: -4 }}
                                className="flex justify-center"
                            >
                                <MetricCircle
                                    label={metric.label}
                                    value={metric.value}
                                    status={metric.status}
                                    color={metric.color}
                                    progress={metric.progress}
                                    icon={metric.icon}
                                />
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Goal Progress Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100 mb-8"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                <FaBullseye className="text-blue-500" />
                                Weight Goal Progress
                            </h3>
                            <p className="text-sm text-gray-600">
                                Current: <span className="font-semibold">{calculatorValues.weight || userInfo.weight} kg</span> | 
                                Target: <span className="font-semibold">{userInfo.goalWeight} kg</span>
                            </p>
                        </div>
                        <span className="text-2xl font-bold text-blue-600">{goalProgress.toFixed(0)}%</span>
                    </div>

                    <div className="relative h-4 bg-white rounded-full overflow-hidden shadow-inner">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${goalProgress}%` }}
                            transition={{ duration: 1.5, delay: 1, ease: "easeOut" }}
                            className="absolute h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full"
                        />
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.2 }}
                            className="absolute inset-0 flex items-center justify-center"
                        >
                            <div className="flex gap-1">
                                {[0, 1, 2, 3, 4].map((dot) => (
                                    <motion.div
                                        key={dot}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 1.3 + dot * 0.1 }}
                                        className="w-1 h-1 bg-white/30 rounded-full"
                                    />
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Recommendations */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mb-8"
                >
                    <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center md:text-left">
                        Health Recommendations
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {recommendations.map((rec, index) => (
                            <motion.div
                                key={index}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 1.1 + index * 0.1 }}
                                whileHover={{ y: -5 }}
                                className={`bg-gradient-to-br ${rec.color} p-5 rounded-2xl border transition-all duration-300 hover:shadow-lg cursor-pointer`}
                            >
                                <div className="flex flex-col items-center text-center">
                                    <div className="text-3xl text-gray-700 mb-3">{rec.icon}</div>
                                    <h3 className="font-semibold text-gray-900 mb-2">{rec.title}</h3>
                                    <p className="text-sm text-gray-600">{rec.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

/* ---------- Circular Card Component ---------- */
const CircularCard = ({ icon, label, value, color, progress, delay = 0, size = "lg" }) => {
    const sizeClass = size === "md" ? "w-32 h-32" : "w-36 h-36 md:w-44 md:h-44";
    const strokeWidth = size === "md" ? 6 : 8;
    const radius = size === "md" ? 40 : 46;

    return (
        <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
                delay
            }}
            whileHover={{ scale: 1.05 }}
            className="relative group w-full flex justify-center"
        >
            <div className={`${sizeClass} relative`}>
                <svg
                    className="w-full h-full transform -rotate-90"
                    viewBox="0 0 100 100"
                    style={{ overflow: 'visible' }}
                >
                    <circle
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="none"
                        stroke="rgb(229 231 235)"
                        strokeWidth={strokeWidth}
                        className="drop-shadow-sm"
                    />
                    <motion.circle
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="none"
                        stroke={`url(#gradient-${color.replace(/\s+/g, '-')})`}
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: progress }}
                        transition={{ duration: 1.5, delay: delay + 0.3, ease: "easeOut" }}
                        className="drop-shadow-md"
                    />
                    <defs>
                        <linearGradient id={`gradient-${color.replace(/\s+/g, '-')}`} x1="0%" y1="0%" x2="100%" y2="0%">
                            {color === "from-blue-500 to-cyan-500" && (
                                <>
                                    <stop offset="0%" stopColor="#3b82f6" />
                                    <stop offset="100%" stopColor="#06b6d4" />
                                </>
                            )}
                            {color === "from-emerald-500 to-green-500" && (
                                <>
                                    <stop offset="0%" stopColor="#10b981" />
                                    <stop offset="100%" stopColor="#22c55e" />
                                </>
                            )}
                            {color === "from-purple-500 to-pink-500" && (
                                <>
                                    <stop offset="0%" stopColor="#8b5cf6" />
                                    <stop offset="100%" stopColor="#ec4899" />
                                </>
                            )}
                            {color === "from-amber-500 to-orange-500" && (
                                <>
                                    <stop offset="0%" stopColor="#f59e0b" />
                                    <stop offset="100%" stopColor="#f97316" />
                                </>
                            )}
                        </linearGradient>
                    </defs>
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                    <div className="text-2xl md:text-3xl mb-2 text-gray-600">{icon}</div>
                    <div className="text-center px-2">
                        <p className="text-xs md:text-sm text-gray-500 mb-1 truncate w-full">{label}</p>
                        <p className="font-bold text-base md:text-sm text-gray-900 truncate w-full">{value}</p>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: delay + 0.5 }}
                    className="absolute -top-1 -right-1 p-4 bg-white rounded-full w-7 h-7 md:w-8 md:h-8 flex items-center justify-center shadow-md border border-gray-200 z-10"
                >
                    <span className="text-[10px] font-bold text-gray-700">
                        {Math.round(progress * 100)}%
                    </span>
                </motion.div>
            </div>
        </motion.div>
    );
};

/* ---------- Metric Circle Component ---------- */
const MetricCircle = ({ label, value, status, color, progress, icon }) => {
    return (
        <div className="relative group">
            <div className="w-36 h-36">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="rgb(243 244 246)"
                        strokeWidth="6"
                    />
                    <motion.circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="6"
                        strokeLinecap="round"
                        className={color.replace('from-', 'text-').replace(' to-', '-')}
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: progress }}
                        transition={{ duration: 2, delay: 0.6, ease: "easeOut" }}
                    />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-2xl mb-2 text-gray-600">{icon}</div>
                    <div className="text-center">
                        <p className="text-xs text-gray-500 mb-1">{label}</p>
                        <p className="font-bold text-lg text-gray-900">{value}</p>
                        <p className="text-xs text-gray-400 mt-1">{status}</p>
                    </div>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                className="absolute -top-1 -right-1 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md border"
            >
                <span className="text-xs font-bold text-gray-700">
                    {Math.round(progress * 100)}%
                </span>
            </motion.div>
        </div>
    );
};

export default UserBMI;