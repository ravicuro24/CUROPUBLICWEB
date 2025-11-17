// src/component/Header.jsx
import React, { useState, useEffect, useRef } from "react";
import { FiSearch, FiShoppingCart } from "react-icons/fi";
import { MdLocalPharmacy } from "react-icons/md";
import { BiTestTube } from "react-icons/bi";
import { FaUserMd, FaAmbulance, FaUserCircle } from "react-icons/fa";
import { HiHome, HiOutlineLocationMarker } from "react-icons/hi";
import { useAuth } from "../Authorization/AuthContext";
import Swal from "sweetalert2";
import { Link, useNavigate, useLocation } from "react-router-dom";
import GetCurrentLocation from "../Authorization/GetCurrentLocation";
import logo from "../assets/logo.png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { logout, token, setAuthModal, allmedicineIncart, getAllMedicineCartItems, userData } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const id = userData?.id;
  const profileRef = useRef(null);
  const currentPath = location.pathname;

  const menu = [
    { name: "Pharmacy", path: "/medicine/delivery", icon: <MdLocalPharmacy size={18} /> },
    { name: "Lab", path: "/lab", icon: <BiTestTube size={18} /> },
    { name: "Home", path: "/", icon: <HiHome size={18} /> },
    { name: "Doctor", path: "/doctor", icon: <FaUserMd size={18} /> },
    { name: "Ambulance", path: "/ambulance", icon: <FaAmbulance size={18} /> },
  ];

  // CLICK OUTSIDE PROFILE CLOSE
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
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

  // CLOSE PROFILE WHEN CLICKING MENU ITEMS
  const handleProfileMenuClick = (action) => {
    setProfileOpen(false); // <-- FIX: closes submenu on click
    action();
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">

        {/* MAIN NAV */}
        <div className="flex justify-between items-center h-16">

          {/* LOGO */}
          <div className="flex items-center">
            <Link to="/">
              <img src={logo} alt="" className="h-8 w-36" />
            </Link>
          </div>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center space-x-6 text-gray-700 text-sm font-medium">

            {menu.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-1 hover:text-teal-600 
                  ${currentPath === item.path ? "text-teal-600 font-semibold" : ""}`}
              >
                <span className={`${currentPath === item.path ? "text-teal-600" : ""}`}>
                  {item.icon}
                </span>
                <span>{item.name}</span>
              </Link>
            ))}

            {/* Location */}
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
              <input type="text" placeholder="Search for medicine" className="bg-transparent outline-none text-sm w-full border-0" />
            </div>

            {/* CART */}
            <button onClick={() => navigate('/medicine/cart')} className="relative cursor-pointer">
              <FiShoppingCart size={24} className="text-gray-700 hover:text-teal-600" />
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {allmedicineIncart?.length || 0}
              </span>
            </button>


            {/* PROFILE */}
            {token ? (
              <div className="relative" ref={profileRef}>
                <img
                  src="https://randomuser.me/api/portraits/women/44.jpg"
                  alt="Profile"
                  className="w-8 h-8 rounded-full border cursor-pointer"
                  onClick={() => setProfileOpen(!profileOpen)}
                />

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-md py-2 border z-50">

                    <button
                      onClick={() => handleProfileMenuClick(() => navigate("/profile"))}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Profile
                    </button>

                    <button
                      onClick={() => handleProfileMenuClick(() => navigate("/medicine/order"))}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      My Orders
                    </button>

                    <button
                      onClick={() => handleProfileMenuClick(handleLogout)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                    >
                      Logout
                    </button>
                  </div>
                )}
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

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 pb-4 space-y-3 text-gray-700 text-sm">

          {menu.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center space-x-2 py-2 
                hover:text-teal-600 
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
