// src/component/profile/ManageProfile.jsx
import React, { useEffect, useState } from "react";
import MedicineOrder from "../../pages/medicine/MedicineOrder";
import SavedAddress from "./SavedAddress";
import MyProfile from "./Profile";
import { FiMenu, FiX } from "react-icons/fi";

function ManageProfile() {
  const [activePage, setActivePage] = useState("profile");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const menu = [
    { name: "Manage Profile", key: "profile" },
    { name: "My Orders", key: "orders" },
    { name: "Address Book", key: "address" },
  ];

  const handleMenuClick = (key) => {
    setActivePage(key);
    setSidebarOpen(false); // Close sidebar on mobile
  };

  return (
    <div className="min-h-screen container mx-auto p-4">

      {/* MOBILE TOP BAR */}
      <div className="md:hidden flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">My Account</h2>
        <button onClick={() => setSidebarOpen(true)}>
          <FiMenu className="text-3xl" />
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">

        {/* SIDEBAR FOR DESKTOP */}
        <div className="hidden md:block w-full md:w-1/4">
          {menu.map((item, index) => {
            const isActive = activePage === item.key;
            return (
              <div
                key={index}
                onClick={() => handleMenuClick(item.key)}
                className={`flex items-center px-5 py-3 shadow shadow-gray-300 my-2 rounded-lg cursor-pointer transition-all
                ${isActive ? "bg-teal-600 text-white font-semibold" : "hover:bg-gray-100 text-gray-700"}
                `}
              >
                {item.name}
              </div>
            );
          })}
        </div>

        {/* MOBILE SLIDE-IN SIDEBAR OVERLAY */}
        {sidebarOpen && (
          <div className="fixed inset-0 backdrop-brightness-50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* MOBILE SIDEBAR PANEL */}
        <div
          className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 md:hidden
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-semibold">Menu</h3>
            <button onClick={() => setSidebarOpen(false)}>
              <FiX className="text-2xl" />
            </button>
          </div>

          {/* Menu Items */}
          <div className="p-4">
            {menu.map((item, index) => {
              const isActive = activePage === item.key;
              return (
                <div
                  key={index}
                  onClick={() => handleMenuClick(item.key)}
                  className={`px-4 py-3 my-2 rounded-lg cursor-pointer
                  ${isActive ? "bg-teal-600 text-white font-semibold" : "hover:bg-gray-200 text-gray-700"}
                  `}
                >
                  {item.name}
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="w-full md:w-3/4 bg-white shadow-md rounded-lg p-6 h-[90vh] overflow-y-auto">
          {activePage === "profile" && <MyProfile />}
          {activePage === "orders" && <MedicineOrder />}
          {activePage === "address" && <SavedAddress />}
        </div>
      </div>
    </div>
  );
}

export default ManageProfile;
