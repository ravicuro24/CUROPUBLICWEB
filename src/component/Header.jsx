// src/component/Header.jsx
import React, { useState, useEffect, useRef } from "react";
import { FiSearch, FiShoppingCart } from "react-icons/fi";
import { MdLocalPharmacy } from "react-icons/md";
import { BiTestTube } from "react-icons/bi";
import { FaUserMd, FaAmbulance, FaUserCircle } from "react-icons/fa";
import { HiHome, HiOutlineLocationMarker } from "react-icons/hi";
import Swal from "sweetalert2";
import { Link, useNavigate, useLocation } from "react-router-dom";
import GetCurrentLocation from "../Authorization/GetCurrentLocation";
import logo from "../assets/logo.png";
import { useAuth } from "../Authorization/AuthContext";
import { useLabAuth } from "../Authorization/LabAuthContext";
const placeholders = [
  "Search for medicine",
  "Search for pain relief",
  "Search for vitamins",
  "Search for health products",
];

const Navbar = () => {
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { logout, token, setAuthModal, allmedicineIncart, getAllMedicineCartItems, userData } = useAuth();
  const { screen, setScreen, getAllLabCartItems, labCartItems } = useLabAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const id = userData?.id;
  const profileRef = useRef(null);
  const currentPath = location.pathname;


  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) =>
        prev === placeholders.length - 1 ? 0 : prev + 1
      );
    }, 2000); // change every 2 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    getAllLabCartItems()
  }, [])

  const menu = [
    { name: "Home", path: "/", icon: <HiHome size={18} /> },
    { name: "Pharmacy", path: "/medicine/delivery", icon: <MdLocalPharmacy size={18} /> },
    { name: "Lab", path: "/lab", icon: <BiTestTube size={18} /> },
    { name: "Doctor", path: "/doctor", icon: <FaUserMd size={18} /> },
    { name: "Ambulance", path: "/ambulance", icon: <FaAmbulance size={18} /> },
  ];

  // CLICK OUTSIDE PROFILE
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        // Prevent close unless clicking outside
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

  // LOGOUT FUNCTION
  const handleLogout = () => {
    Swal.fire({
      title: "Logout?",
      text: "Are you sure you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, logout",
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        Swal.fire("Logged Out", "You have been logged out successfully.", "success").then(() => {
          window.location.reload();
        });
      }
    });
  };

  // Close sidebar after clicking item
  const handleProfileMenuClick = (action) => {
    setProfileOpen(false);
    action();
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* LOGO */}
          <div className="flex items-center mx-4">
            <Link to="/">
              <img src={logo} alt="" className="md:h-5 md:w-30 lg:h-8 xl:h-5 xl:w-30 lg:w-36 h-3 w-14" />
            </Link>
          </div>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center space-x-6 text-gray-700 text-sm font-medium">
            {menu.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-1 px-2 py-1 rounded-md duration-600 transition-all hover:text-teal-600 hover:bg-teal-100 
                  ${currentPath === item.path ? "text-teal-600 font-semibold bg-teal-100 " : ""}`}
              >
                <span>{item.name}</span>
              </Link>
            ))}

            <div className="flex items-center space-x-1">
              <HiOutlineLocationMarker size={18} />
              <GetCurrentLocation />
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div className="flex items-center space-x-3 gap-4">

            {/* SEARCH BAR */}
            <div className="hidden sm:flex items-center bg-gray-100 px-3 py-1.5 rounded-full w-56">
              <FiSearch className="text-gray-500 mr-2" />
              <input
                type="text"
                placeholder={placeholders[placeholderIndex]}
                className="bg-transparent outline-none text-sm w-full border-0 transition-all duration-300"
              />
            </div>

            {/* CART */}
            {screen == "Pharmacy" ? <button onClick={() => navigate('/medicine/cart')} className="relative cursor-pointer">
              <FiShoppingCart size={24} className="text-gray-700 hover:text-teal-600" />
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {allmedicineIncart?.length || 0}
              </span>
            </button>
              :
              <button onClick={() => navigate('/lab_cartitems')} className="relative cursor-pointer">
                <FiShoppingCart size={24} className="text-gray-700 hover:text-teal-600" />
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {labCartItems?.length || 0}
                </span>
              </button>
            }



            {/* PROFILE ICON */}
            {token ? (
              <div>
                <img
                  src="https://randomuser.me/api/portraits/women/44.jpg"
                  alt="Profile"
                  className="w-8 h-8 rounded-full border cursor-pointer"
                  onClick={() => setProfileOpen(true)}
                />
              </div>
            ) : (
              <FaUserCircle onClick={() => setAuthModal(true)} size={22} className="cursor-pointer" />
            )}

            {/* MOBILE MENU BUTTON */}
            <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>

          </div>
        </div>
      </div>

      {/* ============================
            RIGHT SIDE PROFILE SLIDE BAR (SLOW MOTION)
      ============================= */}
      {profileOpen && (
        <>
          {/* BACKDROP WITH FADE */}
          <div
            onClick={() => setProfileOpen(false)}
            className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-500 
            ${profileOpen ? "opacity-100" : "opacity-0"}`}
          ></div>

          {/* SLIDING PROFILE PANEL */}
          <div
            ref={profileRef}
            className={`
              fixed top-0 right-0 h-full w-64 bg-white shadow-2xl z-50 
              transform transition-transform duration-500 ease-in-out
              ${profileOpen ? "translate-x-0" : "translate-x-full"}
            `}
          >
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold">My Account</h2>
              <button onClick={() => setProfileOpen(false)} className="text-gray-600 text-xl">✕</button>
            </div>

            <div className="flex flex-col mt-3">
              <button
                onClick={() => handleProfileMenuClick(() => navigate("/manage_profile"))}
                className="w-full text-left px-4 py-3 hover:bg-gray-100 cursor-pointer"
              >
                Manage Profile
              </button>

              <button
                onClick={() => handleProfileMenuClick(() => navigate("/medicine/order"))}
                className="w-full text-left px-4 py-3 hover:bg-gray-100"
              >
                My Orders
              </button>

              <button
                onClick={() => handleProfileMenuClick(handleLogout)}
                className="w-full text-left px-4 py-3 text-red-600 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          </div>
        </>
      )}

      {/* ============================
            MOBILE MENU (BOTTOM SLIDER)
      ============================= */}
      {menuOpen && (
        <div
          className={`
            md:hidden bg-white border-t border-gray-200 px-4 pb-4 space-y-3 text-gray-700 text-sm
            transform transition-transform duration-500 ease-in-out
            ${menuOpen ? "translate-y-0" : "translate-y-full"}
          `}
        >
          {menu.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center space-x-2 py-2 hover:text-teal-600 
                ${currentPath === item.path ? "text-teal-600 font-semibold" : ""}`}
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}

          <div className="flex items-center space-x-2">
            <HiOutlineLocationMarker size={18} />
            <GetCurrentLocation />
          </div>
        </div>
      )}

    </nav>
  );
};

export default Navbar;
