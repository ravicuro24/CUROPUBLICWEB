// src/component/WeatherReport.jsx
import axios from "axios"
import React, { useEffect, useRef, useState } from "react"
import { useAuth } from "../Authorization/AuthContext"
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import GetCurrentLocation from "../Authorization/GetCurrentLocation"
import WeatherAQIHistory from './WeatherAQIHistory'


/* Fix Leaflet marker issue */
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

function WeatherReport() {
    const { latitude, longitude } = useAuth()
    const [aqiHistoryPage, setAqiHistoryPage] = useState(false)
    const [historyLoading, setHistoryLoading] = useState(false)

    const lat = latitude || 25.3095
    const lon = longitude || 83.0056
    const historyRef = useRef(null)


    const apiKey = "582efd0c9dcd41be3e80decbe4bd53e2"

    const [aqiData, setAqiData] = useState(null)
    const [historyData, setHistoryData] = useState([])

    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")

    /* ---------------- CURRENT AQI ---------------- */
    const getCurrentAQI = async () => {
        try {
            const res = await axios.get(
                "https://api.openweathermap.org/data/2.5/air_pollution",
                {
                    params: {
                        lat,
                        lon,
                        appid: apiKey,
                    },
                }
            )
            setAqiData(res.data.list[0])
        } catch (err) {
            console.log("Current AQI error", err)
        }
    }

    /* ---------------- AQI HISTORY ---------------- */
    const getAQIHistory = async () => {
        if (!startDate || !endDate) return

        const start = Math.floor(new Date(startDate).getTime() / 1000)
        const end = Math.floor(new Date(endDate).getTime() / 1000)

        try {
            setHistoryLoading(true)
            const res = await axios.get(
                "https://api.openweathermap.org/data/2.5/air_pollution/history",
                {
                    params: {
                        lat,
                        lon,
                        start,
                        end,
                        appid: apiKey,
                    },
                }
            )
            console.log("dta", res)
            setHistoryData(res.data.list)
            setAqiHistoryPage(true)
            setHistoryLoading(false)
        } catch (err) {
            console.log("AQI history error", err)
            setHistoryLoading(false)
        }
    }
    useEffect(() => {
        if (historyData.length > 0 && historyRef.current) {
            historyRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [historyData])

    useEffect(() => {
        if (startDate && endDate) {
            getAQIHistory()
        }
    }, [lat, lon])


    useEffect(() => {
        getCurrentAQI()
    }, [latitude, longitude])

    /* ---------------- AQI LABEL ---------------- */
    const getAqiInfo = (aqi) => {
        switch (aqi) {
            case 1: return { label: "Good", color: "bg-green-500" }
            case 2: return { label: "Fair", color: "bg-lime-500" }
            case 3: return { label: "Moderate", color: "bg-yellow-500" }
            case 4: return { label: "Poor", color: "bg-red-500" }
            case 5: return { label: "Very Poor", color: "bg-red-800" }
            default: return { label: "-", color: "bg-gray-400" }
        }
    }

    if (!aqiData) {
        return <div className="p-6">Loading AQI...</div>
    }

    const aqiInfo = getAqiInfo(aqiData.main.aqi)

    return (
        <div className="w-full min-h-screen bg-gray-100 container mx-auto">
            <h1 className="text-2xl font-bold mb-6">Air Quality Dashboard</h1>

            {/* DATE FILTER */}
            <div className="flex flex-wrap gap-4 mb-6 bg-white p-4 rounded-xl shadow">
                <div>
                    <label className="text-sm text-gray-600">Start Date</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="block border rounded px-3 py-2"
                    />
                </div>

                <div>
                    <label className="text-sm text-gray-600">End Date</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="block border rounded px-3 py-2"
                    />
                </div>

                <button
                    onClick={getAQIHistory}
                    className="self-end bg-teal-600 text-white px-5 py-2 rounded hover:bg-teal-700 cursor-pointer"
                >
                    {historyLoading ? <span className="loading loading-spinner loading-sm"></span> : "Apply Filter"}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* LEFT SIDE – DATA */}
                <div className="lg:col-span-1 space-y-6">

                    {/* AQI CARD */}
                    <div className={`p-6 rounded-xl text-white shadow-lg ${aqiInfo.color}`}>
                        <p className="text-sm opacity-80">Current AQI</p>
                        <h2 className="text-4xl font-bold mt-2">
                            {aqiData.main.aqi}
                        </h2>
                        <p className="mt-1 text-lg">{aqiInfo.label}</p>
                    </div>

                    {/* POLLUTANTS */}
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            ["PM2.5", aqiData.components.pm2_5],
                            ["PM10", aqiData.components.pm10],
                            ["CO", aqiData.components.co],
                            ["NO₂", aqiData.components.no2],
                            ["O₃", aqiData.components.o3],
                            ["SO₂", aqiData.components.so2],
                        ].map(([label, value]) => (
                            <div
                                key={label}
                                className="bg-white p-4 rounded-xl shadow"
                            >
                                <p className="text-xs text-gray-500">{label}</p>
                                <p className="text-lg font-semibold">{value}</p>
                                <p className="text-xs text-gray-400">µg/m³</p>
                            </div>
                        ))}
                    </div>

                    <GetCurrentLocation />
                </div>

                {/* RIGHT SIDE – MAP */}
                <div className="lg:col-span-2 ">
                    <div className="w-full h-[350px] lg:h-[550px] rounded-xl overflow-hidden shadow-lg">
                        <MapContainer
                            center={[lat, lon]}
                            zoom={11}
                            className="w-full h-full z-10"
                        >
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                            <Circle
                                center={[lat, lon]}
                                radius={6000}
                                pathOptions={{
                                    color: "#ef4444",
                                    fillOpacity: 0.25,
                                }}
                            />

                            <Marker position={[lat, lon]}>
                                <Popup>
                                    <strong>AQI:</strong> {aqiData.main.aqi}<br />
                                    {aqiInfo.label}<br />
                                    <hr />
                                    PM2.5: {aqiData.components.pm2_5}<br />
                                    PM10: {aqiData.components.pm10}
                                </Popup>
                            </Marker>
                        </MapContainer>
                    </div>
                </div>
            </div>
            {aqiHistoryPage && (
                <div ref={historyRef} className="mt-8">
                    <WeatherAQIHistory data={historyData} />
                </div>
            )}

        </div>
    )
}

export default WeatherReport
