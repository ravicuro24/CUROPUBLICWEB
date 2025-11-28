// src/component/Header.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiShoppingCart,
  FiX,
  FiMenu,
  FiUser
} from "react-icons/fi";
import {
  MdLocalPharmacy,
  MdOutlineManageAccounts,
} from "react-icons/md";

import { BiTestTube } from "react-icons/bi";
import {
  FaUserMd,
  FaAmbulance,
  FaUserCircle,
  FaSignOutAlt,
  FaHistory,
  FaMapMarkerAlt
} from "react-icons/fa";
import { HiHome } from "react-icons/hi";
import { IoIosArrowDown } from "react-icons/io";
import Swal from "sweetalert2";
import { Link, useNavigate, useLocation } from "react-router-dom";
import GetCurrentLocation from "../Authorization/GetCurrentLocation";
import logo from "../assets/logo.png";
import { useAuth } from "../Authorization/AuthContext";
import { useLabAuth } from "../Authorization/LabAuthContext";
import { Sidebar } from 'primereact/sidebar';
import Map from "./Map";

const placeholders = [
  "Search for medicine...",
  "Search for pain relief...",
  "Search for vitamins...",
  "Search for health products...",
];
const Header = () => {
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { logout, token, setAuthModal, allmedicineIncart, getAllMedicineCartItems, userData } = useAuth();
  const { screen, setScreen, getAllLabCartItems, labCartItems } = useLabAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const id = userData?.id;
  const profileRef = useRef(null);
  const searchRef = useRef(null);
  const currentPath = location.pathname;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) =>
        prev === placeholders.length - 1 ? 0 : prev + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    getAllLabCartItems();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    const fetchCart = async () => {
      await getAllMedicineCartItems(id);
    };
    fetchCart();

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navigationItems = [
    { name: "Home", path: "/", icon: <HiHome size={18} /> },
    { name: "Pharmacy", path: "/medicine/delivery", icon: <MdLocalPharmacy size={18} /> },
    { name: "Lab", path: "/lab", icon: <BiTestTube size={18} /> },
    { name: "Doctor", path: "/doctor", icon: <FaUserMd size={18} /> },
    { name: "Ambulance", path: "/ambulance", icon: <FaAmbulance size={18} /> },
  ];

  const handleLogout = () => {
    Swal.fire({
      title: "Logout?",
      text: "Are you sure you want to logout?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, logout",
      cancelButtonText: "Cancel",
      background: "#fff",
      color: "#374151",
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        Swal.fire({
          title: "Logged Out",
          text: "You have been logged out successfully.",
          icon: "success",
          confirmButtonColor: "#10b981",
          background: "#fff",
          color: "#374151",
        }).then(() => {
          window.location.reload();
        });
      }
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      {/* Top Bar */}
     

      {/* Main Navigation */}
      <nav className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center flex-shrink-0"
          >
            <Link to="/" className="flex items-center space-x-3 group">
              <img
                src={logo}
                alt="Company Logo"
                className="md:h-5 h-5 w-auto transition-transform duration-300 group-hover:scale-105"
              />
              <div className="hidden lg:block  border-gray-300 h-8"></div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1 mx-8 flex-1 justify-center">
            {navigationItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial="hidden"
                animate="visible"
                variants={itemVariants}
                custom={index}
              >
                <Link
                  to={item.path}
                  className={`relative flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 group
                    ${currentPath === item.path
                      ? "text-teal-600 bg-teal-50"
                      : "text-gray-700 hover:text-teal-600 hover:bg-gray-50"
                    }`}
                >
                  <span className={`transition-colors duration-300 ${currentPath === item.path ? 'text-teal-600' : 'text-gray-500 group-hover:text-teal-600'
                    }`}>
                    {item.icon}
                  </span>
                  <span className="text-sm font-semibold">{item.name}</span>

                  {/* Hover effect */}
                  <div className={`absolute inset-0 rounded-lg bg-gradient-to-r from-teal-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${currentPath === item.path ? 'opacity-100' : ''
                    }`}></div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-3">

            {/* Location */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setVisible(true)}
              className="hidden md:flex items-center space-x-2 cursor-pointer "
            >
              <FaMapMarkerAlt className="text-teal-600" size={14} />
              <GetCurrentLocation />
            </motion.div>

            {/* Search Bar */}
            <motion.div
              ref={searchRef}
              className="hidden md:flex items-center bg-gray-50 border border-gray-200 px-4 py-2 rounded-lg w-64 transition-all duration-300 focus-within:border-teal-500 focus-within:bg-white focus-within:shadow-sm"
            >
              <FiSearch className="text-gray-400 mr-2" size={18} />
              <input
                type="text"
                placeholder={placeholders[placeholderIndex]}
                className="bg-transparent outline-none text-sm w-full border-0 placeholder-gray-400"
              />
            </motion.div>

            {/* Mobile Search Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSearchOpen(true)}
              className="md:hidden p-2 text-gray-600 hover:text-teal-600 transition-colors"
            >
              <FiSearch size={20} />
            </motion.button>

            {/* Cart */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => screen === "Pharmacy" ? navigate('/medicine/cart') : navigate('/lab_cartitems')}
              className="relative p-2 text-gray-600 hover:text-teal-600 transition-colors group"
             >
              <div className="relative">
                <FiShoppingCart size={22} />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold min-w-[20px] h-5 flex items-center justify-center rounded-full shadow-sm">
                  {screen === "Pharmacy" ? allmedicineIncart?.length || 0 : labCartItems?.length || 0}
                </span>
              </div>
            </motion.button>

            {/* Profile Section */}
            {token ? (
              <motion.div ref={profileRef} className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    <FiUser size={16} />
                  </div>
                  <IoIosArrowDown
                    className={`text-gray-400 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`}
                    size={14}
                  />
                </motion.button>

                {/* Profile Dropdown */}
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50"
                    >
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-semibold text-gray-900 truncate">Welcome!</p>
                        <p className="text-sm text-gray-500 truncate">{userData?.email || "User"}</p>
                      </div>

                      {/* Menu Items */}
                      <button
                        onClick={() => { setProfileOpen(false); navigate("/manage_profile"); }}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition-colors duration-200"
                      >
                        <MdOutlineManageAccounts size={18} />
                        <span className="text-sm">Manage Profile</span>
                      </button>

                      <button
                        onClick={() => { setProfileOpen(false); navigate("/medicine/order"); }}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition-colors duration-200"
                      >
                        <FaHistory size={16} />
                        <span className="text-sm">My Orders</span>
                      </button>

                      {/* Logout */}
                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button
                          onClick={() => { setProfileOpen(false); handleLogout(); }}
                          className="w-full flex items-center space-x-3 px-4 py-3 text-left text-red-600 hover:bg-red-50 transition-colors duration-200"
                        >
                          <FaSignOutAlt size={16} />
                          <span className="text-sm">Logout</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setAuthModal(true)}
                className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-sm"
              >
                <FaUserCircle size={16} />
                <span className="text-sm font-semibold">Login</span>
              </motion.button>
            )}

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-teal-600 transition-colors"
            >
              <FiMenu size={22} />
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Mobile Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSearchOpen(false)}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="fixed top-4 left-4 right-4 bg-white rounded-xl shadow-xl z-50 md:hidden p-4"
            >
              <div className="flex items-center space-x-3">
                <div className="flex-1 flex items-center bg-gray-100 border border-gray-200 px-4 py-3 rounded-lg">
                  <FiSearch className="text-gray-400 mr-3" size={18} />
                  <input
                    type="text"
                    placeholder={placeholders[placeholderIndex]}
                    className="bg-transparent outline-none text-sm w-full border-0"
                    autoFocus
                  />
                </div>
                <button
                  onClick={() => setSearchOpen(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
                >
                  <FiX size={20} />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: "spring", damping: 30 }}
            className="fixed inset-0 bg-white z-40 lg:hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <img src={logo} alt="Logo" className="h-8" />
              <button
                onClick={() => setMenuOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-700"
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Menu Items */}
            <div className="p-4 space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${currentPath === item.path
                    ? "bg-teal-50 text-teal-600 font-semibold"
                    : "text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              ))}

              {/* Location in mobile menu */}
              <div className="flex items-center space-x-3 p-3 text-gray-700 border-t border-gray-200 mt-4 pt-4">
                <FaMapMarkerAlt className="text-teal-600" size={16} />
                <GetCurrentLocation />
              </div>

              {/* Login button in mobile menu */}
              {!token && (
                <button
                  onClick={() => { setMenuOpen(false); setAuthModal(true); }}
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white py-3 rounded-lg font-semibold mt-4"
                >
                  <FaUserCircle size={18} />
                  <span>Login to Account</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="card flex justify-content-center ">
        <Sidebar
          visible={visible}
          onHide={() => setVisible(false)}
          position="right"
          style={{ width: "50vw" }}   // Half screen width
        >
          <Map />
        </Sidebar>
      </div>

    </header>
  );
};

export default Header;