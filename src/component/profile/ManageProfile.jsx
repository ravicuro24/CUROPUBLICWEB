import React, { useState } from "react";
import MedicineOrder from "../../pages/medicine/MedicineOrder";
import SavedAddress from "./SavedAddress";
import MyProfile from "./Profile";

function ManageProfile() {

  const [activePage, setActivePage] = useState("profile");

  const menu = [
    { name: "Manage Profile", key: "profile" },
    { name: "My Orders", key: "orders" },
    { name: "Address Book", key: "address" },
  ];

  return (
    <div className="min-h-screen container mx-auto p-4 overflow-y-auto">
      <div className="flex flex-col md:flex-row gap-4">

        {/* LEFT SIDEBAR */}
        <div className="w-full md:w-1/4  ">
          {menu.map((item, index) => {
            const isActive = activePage === item.key;

            return (
              <div
                key={index}
                onClick={() => setActivePage(item.key)}
                className={`flex items-center px-5 py-3 shadow shadow-gray-300 my-2 rounded-lg cursor-pointer transition-all
                  ${
                    isActive
                      ? "bg-teal-600 text-white font-semibold"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
              >
                {item.name}
              </div>
            );
          })}
        </div>

        {/* RIGHT CONTENT AREA */}
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
