import React, { useEffect, useRef, useState, useCallback } from "react";
import GetCurrentLocation from "../Authorization/GetCurrentLocation";
import { FiSearch, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { MdOutlineMedicalServices } from "react-icons/md";
import { RiMedicineBottleLine } from "react-icons/ri";
import { Sidebar } from "primereact/sidebar";
import Map from "./Map";

function Header2() {
    const searchRef = useRef(null);
    const inputRef = useRef(null);

    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [visible, setVisible] = useState(false);

    /* ---------------- TYPEWRITER PLACEHOLDER ---------------- */
    const placeholders = [
        "Search medicines, healthcare products...",
        "e.g., Paracetamol, Vitamin C, Dolo 650",
        "Search by symptoms or conditions",
        "Prescription medicines & wellness products",
    ];

    const [placeholderIndex, setPlaceholderIndex] = useState(0);
    const [typedPlaceholder, setTypedPlaceholder] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const currentText = placeholders[placeholderIndex];
        let typingSpeed = isDeleting ? 40 : 80;

        const timeout = setTimeout(() => {
            if (!isDeleting) {
                setTypedPlaceholder(currentText.substring(0, typedPlaceholder.length + 1));
                if (typedPlaceholder === currentText) {
                    setTimeout(() => setIsDeleting(true), 1200);
                }
            } else {
                setTypedPlaceholder(currentText.substring(0, typedPlaceholder.length - 1));
                if (typedPlaceholder === "") {
                    setIsDeleting(false);
                    setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
                }
            }
        }, typingSpeed);

        return () => clearTimeout(timeout);
    }, [typedPlaceholder, isDeleting, placeholderIndex]);

    /* ---------------- CLICK OUTSIDE ---------------- */
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setSearchOpen(false);
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    /* ---------------- FOCUS ---------------- */
    const handleFocus = useCallback(() => {
        setSearchOpen(true);
        setIsFocused(true);
        setShowSuggestions(true);
        setTimeout(() => inputRef.current?.focus(), 100);
    }, []);

    /* ---------------- SEARCH ---------------- */
    const handleSearch = useCallback(async (query) => {
        if (!query.trim()) return;
        setIsLoading(true);
        setSearchQuery(query);
        setShowSuggestions(false);
        await new Promise((r) => setTimeout(r, 500));
        setIsLoading(false);
        console.log("Searching:", query);
    }, []);

    const clearSearch = useCallback(() => {
        setSearchQuery("");
        setShowSuggestions(true);
        inputRef.current?.focus();
    }, []);

    const handleKeyPress = useCallback(
        (e) => {
            if (e.key === "Enter" && searchQuery.trim()) handleSearch(searchQuery);
            if (e.key === "Escape") setSearchOpen(false);
        },
        [searchQuery, handleSearch]
    );

    return (
        <div className="relative bg-transparent">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">

                {/* LOCATION */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => setVisible(true)}
                    className="hidden md:flex cursor-pointer"
                >
                    <GetCurrentLocation />
                </motion.div>

                {/* SEARCH BAR */}
                <div className="w-full md:flex-1 max-w-2xl relative">
                    <motion.div
                        ref={searchRef}
                        className="relative border-b border-gray-200 bg-white"

                    >
                        <div className="flex items-center px-4 py-2" onClick={handleFocus}>
                            <FiSearch className="text-gray-400 mr-3" size={20} />

                            <input
                                ref={inputRef}
                                type="text"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setShowSuggestions(true);
                                }}
                                onFocus={handleFocus}
                                onKeyDown={handleKeyPress}
                                placeholder={typedPlaceholder}
                                className="w-full bg-transparent outline-none border-0 text-gray-800
                                           placeholder-gray-500 text-sm md:text-base"
                            />

                            {searchQuery && (
                                <button onClick={clearSearch} className="ml-2 p-1">
                                    <FiX size={18} className="text-gray-500" />
                                </button>
                            )}

                            {isLoading && (
                                <div className="ml-2 h-5 w-5 border-0 rounded-full animate-spin" />
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* MOBILE SEARCH OVERLAY */}
            <AnimatePresence>
                {searchOpen && window.innerWidth < 768 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-white z-50"
                    >
                        <div className="flex items-center gap-3 p-4 border-0-b">
                            <button onClick={() => setSearchOpen(false)}>
                                <FiX size={24} />
                            </button>
                            <input
                                ref={inputRef}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search medicines..."
                                className="flex-1 p-3 bg-gray-50 rounded-lg"
                                autoFocus
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* MAP SIDEBAR */}
            <Sidebar
                visible={visible}
                onHide={() => setVisible(false)}
                position="right"
                style={{ width: "40vw" }}
            >
                <Map />
            </Sidebar>
        </div>
    );
}

export default Header2;
