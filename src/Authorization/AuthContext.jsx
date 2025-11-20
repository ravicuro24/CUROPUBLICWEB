// src/Authorization/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "./axiosInstance";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [userData, setUserdata] = useState(null);
  const [authModal, setAuthModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const [latitude, setLatitude] = useState(25.33297); //25.33297
  const [longitude, setLongitude] = useState(82.966293); // 82.966293

  const [allmedicineIncart, setAllMedicineInCart] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    const storedToken = localStorage.getItem("token");


    let parsedUser = null;

    if (storedUser) {
      parsedUser = JSON.parse(storedUser);
      setUserdata(parsedUser);
    }

    if (storedToken) {
      setToken(storedToken);
    }
    console.log("auth", parsedUser)
    if (parsedUser?.dto?.id) {
      getAllMedicineCartItems(parsedUser.id);
    }

    setLoading(false);
  }, []);

  const getAllMedicineCartItems = async (userId) => {

    try {
      const response = await axiosInstance.get(
        `/endUserEndPoint/getCartItems?userId=${userId}`
      );
      const allItems = response.data?.dtoList || [];
      const filteredItems = allItems.filter(
        item => item.addedByPharmacyId === 0
      );

      setAllMedicineInCart(filteredItems);
      console.log("Filtered Medicine Cart", response);
    } catch (error) {
      console.log("Error fetching cart items:", error.response);
    }
  };

  const logout = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("token");

    setUserdata(null);
    setToken(null);
    setAuthModal(false);
    setAllMedicineInCart([]);
  };
  const value = {
    token,
    setToken,

    userData,
    setUserdata,

    authModal,
    setAuthModal,

    logout,

    latitude,
    setLatitude,

    longitude,
    setLongitude,

    allmedicineIncart,
    setAllMedicineInCart,

    getAllMedicineCartItems,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
