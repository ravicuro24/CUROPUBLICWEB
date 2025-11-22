// src/Authorization/LabAuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "./axiosInstance";


const LabAuthContext = createContext();
export const useLabAuth = () => useContext(LabAuthContext);

export const LabAuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [userData, setUserdata] = useState(null);
    const [loading, setLoading] = useState(true);

    const [screen, setScreen] = useState("Pharmacy");
    const [latitude, setLatitude] = useState(25.33297);
    const [longitude, setLongitude] = useState(82.966293);

    const [labCartItems, setLabCartItems] = useState([]);
    const [labCartLoading, setLabCartLoading] = useState(false);
    const [selectedSlots, setSelectedSlots] = useState({});

    useEffect(() => {
        const storedUser = localStorage.getItem("userData");
        const storedToken = localStorage.getItem("token");

        if (storedUser) setUserdata(JSON.parse(storedUser));
        if (storedToken) setToken(storedToken);

        setLoading(false);
    }, []);

    // API call to fetch lab cart items
    const getAllLabCartItems = async () => {
        if (!userData?.id) return;
        setLabCartLoading(true);
        try {
            const response = await axiosInstance.get(
                `/endUserEndPoint/getLabCartItems?userId=${userData.id}`
            );
            const items = response.data?.dtoList || [];
            setLabCartItems(items);
        } catch (error) {
            console.error("Error fetching cart items:", error?.response || error);
        } finally {
            setLabCartLoading(false);
        }
    };

    const value = {
        token, setToken,
        userData, setUserdata,
        latitude, setLatitude,
        longitude, setLongitude,
        screen, setScreen,
        labCartItems,
        labCartLoading,
        getAllLabCartItems,
        selectedSlots,
        setSelectedSlots
    };

    return (
        <LabAuthContext.Provider value={value}>
            {!loading && children}
        </LabAuthContext.Provider>
    );
};
