// src/component/WeatherAQIHistory.jsx
import axios from "axios"
import React, { useEffect, useState } from "react"
import { useAuth } from "../Authorization/AuthContext"
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line,
  AreaChart, Area, RadialBarChart, RadialBar
} from 'recharts'
import { 
  FiBarChart2, FiList, FiTrendingUp, FiDownload, 
  FiFilter, FiCalendar, FiRefreshCw, FiInfo,
  FiChevronRight, FiGlobe, FiWind, FiDroplet
} from 'react-icons/fi'
import { TbCloud, TbTemperature } from 'react-icons/tb'

const API_KEY = "582efd0c9dcd41be3e80decbe4bd53e2"

const AQIHistoryReport = ({ data }) => {
    const [history, setHistory] = useState(data || [])
    const [viewMode, setViewMode] = useState('table')
    const [selectedPollutant, setSelectedPollutant] = useState('pm2_5')
    const [timeRange, setTimeRange] = useState('all')
    const [isLoading, setIsLoading] = useState(false)
    
    console.log("history", data)

    const formatDate = (dt) => {
        return new Date(dt * 1000).toLocaleString("en-IN", {
            weekday: "short",
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const formatDateShort = (dt) => {
        return new Date(dt * 1000).toLocaleString("en-IN", {
            month: "short",
            day: "2-digit",
            hour: "2-digit",
        })
    }

    const getAqiColor = (aqi) => {
        switch (aqi) {
            case 1: return { bg: "bg-gradient-to-r from-green-50 to-emerald-50", text: "text-green-700", border: "border-green-200" }
            case 2: return { bg: "bg-gradient-to-r from-lime-50 to-green-50", text: "text-lime-700", border: "border-lime-200" }
            case 3: return { bg: "bg-gradient-to-r from-yellow-50 to-amber-50", text: "text-yellow-700", border: "border-yellow-200" }
            case 4: return { bg: "bg-gradient-to-r from-red-50 to-orange-50", text: "text-red-700", border: "border-red-200" }
            case 5: return { bg: "bg-gradient-to-r from-red-100 to-rose-50", text: "text-red-900", border: "border-red-300" }
            default: return { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200" }
        }
    }

    const getAqiGradientColor = (aqi) => {
        switch (aqi) {
            case 1: return ["#10b981", "#34d399"]
            case 2: return ["#84cc16", "#a3e635"]
            case 3: return ["#f59e0b", "#fbbf24"]
            case 4: return ["#ef4444", "#f97316"]
            case 5: return ["#dc2626", "#ef4444"]
            default: return ["#9ca3af", "#d1d5db"]
        }
    }

    const getAqiLabel = (aqi) => {
        switch (aqi) {
            case 1: return "Excellent"
            case 2: return "Good"
            case 3: return "Moderate"
            case 4: return "Poor"
            case 5: return "Hazardous"
            default: return "Unknown"
        }
    }

    const getPollutantColor = (pollutant) => {
        const colors = {
            pm2_5: ['#8884d8', '#a78bfa'],
            pm10: ['#82ca9d', '#4ade80'],
            co: ['#ffc658', '#fbbf24'],
            no2: ['#ff8042', '#fb923c'],
            o3: ['#0088fe', '#3b82f6'],
            so2: ['#ff6b6b', '#ef4444']
        }
        return colors[pollutant] || ['#8884d8', '#a78bfa']
    }

    const getPollutantIcon = (pollutant) => {
        switch(pollutant) {
            case 'pm2_5': return <TbCloud className="w-4 h-4" />
            case 'pm10': return <FiGlobe className="w-4 h-4" />
            case 'co': return <TbTemperature className="w-4 h-4" />
            case 'no2': return <FiWind className="w-4 h-4" />
            case 'o3': return <FiDroplet className="w-4 h-4" />
            case 'so2': return <div className="w-4 h-4 rounded-full bg-red-500" />
            default: return <FiInfo className="w-4 h-4" />
        }
    }

    const prepareBarChartData = () => {
        return history.slice(0, 12).map(item => ({
            timestamp: formatDateShort(item.dt),
            date: new Date(item.dt * 1000),
            pm2_5: item.components.pm2_5,
            pm10: item.components.pm10,
            co: item.components.co,
            no2: item.components.no2,
            o3: item.components.o3,
            so2: item.components.so2,
            aqi: item.main.aqi,
            aqiColor: getAqiGradientColor(item.main.aqi)[0]
        })).sort((a, b) => a.date - b.date)
    }

    const preparePieChartData = () => {
        if (history.length === 0) return []
        
        const lastReading = history[history.length - 1]
        return [
            { name: 'PM2.5', value: lastReading.components.pm2_5, color: '#8884d8', icon: getPollutantIcon('pm2_5') },
            { name: 'PM10', value: lastReading.components.pm10, color: '#82ca9d', icon: getPollutantIcon('pm10') },
            { name: 'CO', value: lastReading.components.co, color: '#ffc658', icon: getPollutantIcon('co') },
            { name: 'NO₂', value: lastReading.components.no2, color: '#ff8042', icon: getPollutantIcon('no2') },
            { name: 'O₃', value: lastReading.components.o3, color: '#0088fe', icon: getPollutantIcon('o3') },
            { name: 'SO₂', value: lastReading.components.so2, color: '#ff6b6b', icon: getPollutantIcon('so2') }
        ].filter(item => item.value > 0)
    }

    const prepareRadialChartData = () => {
        if (history.length === 0) return []
        
        const latest = history[history.length - 1]
        return [
            { name: 'AQI', value: latest.main.aqi * 20, max: 100, color: getAqiGradientColor(latest.main.aqi)[0] },
            { name: 'PM2.5', value: Math.min(latest.components.pm2_5 * 2, 100), max: 100, color: '#8884d8' },
            { name: 'O₃', value: Math.min(latest.components.o3, 100), max: 100, color: '#0088fe' },
            { name: 'NO₂', value: Math.min(latest.components.no2, 100), max: 100, color: '#ff8042' }
        ]
    }

    const calculateAqiDistribution = () => {
        const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        
        history.forEach(item => {
            if (distribution[item.main.aqi] !== undefined) {
                distribution[item.main.aqi]++
            }
        })
        
        return Object.entries(distribution).map(([aqi, count]) => ({
            name: getAqiLabel(parseInt(aqi)),
            value: count,
            aqi: parseInt(aqi),
            fill: getAqiGradientColor(parseInt(aqi))[0]
        }))
    }

    const calculateStats = () => {
        if (history.length === 0) return {}
        
        const latest = history[history.length - 1]
        const avgPm25 = history.reduce((sum, item) => sum + item.components.pm2_5, 0) / history.length
        const maxPm25 = Math.max(...history.map(item => item.components.pm2_5))
        const minPm25 = Math.min(...history.map(item => item.components.pm2_5))
        
        return {
            avgPm25: avgPm25.toFixed(1),
            maxPm25: maxPm25.toFixed(1),
            minPm25: minPm25.toFixed(1),
            latestAqi: latest.main.aqi,
            latestAqiLabel: getAqiLabel(latest.main.aqi)
        }
    }

    const barChartData = prepareBarChartData()
    const pieChartData = preparePieChartData()
    const radialChartData = prepareRadialChartData()
    const aqiDistributionData = calculateAqiDistribution()
    const stats = calculateStats()

    const exportData = () => {
        const csv = [
            ['Timestamp', 'AQI', 'PM2.5', 'PM10', 'CO', 'NO₂', 'O₃', 'SO₂'],
            ...history.map(item => [
                formatDate(item.dt),
                item.main.aqi,
                item.components.pm2_5,
                item.components.pm10,
                item.components.co,
                item.components.no2,
                item.components.o3,
                item.components.so2
            ])
        ].map(row => row.join(',')).join('\n')
        
        const blob = new Blob([csv], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `aqi-history-${new Date().toISOString().split('T')[0]}.csv`
        a.click()
    }

    const renderTableView = () => (
        <div className="space-y-4 animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Detailed Readings</h2>
                <button 
                    onClick={exportData}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                >
                    <FiDownload />
                    <span>Export CSV</span>
                </button>
            </div>
            
            {history.map((item, index) => {
                const colors = getAqiColor(item.main.aqi)
                return (
                    <div
                        key={index}
                        className={`${colors.bg} ${colors.border} rounded-2xl shadow-lg p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border`}
                    >
                        <div className="flex-1">
                            <div className="flex items-center space-x-4">
                                <div className={`w-3 h-3 rounded-full ${colors.text.replace('text-', 'bg-')}`}></div>
                                <p className="text-lg font-semibold text-gray-800">
                                    {formatDate(item.dt)}
                                </p>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">
                                Air Quality: <span className={`font-bold ${colors.text}`}>
                                    {getAqiLabel(item.main.aqi)}
                                </span>
                            </p>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className={`px-6 py-3 rounded-full text-base font-bold shadow-md ${colors.border} ${colors.text} backdrop-blur-sm bg-white/70`}>
                                AQI {item.main.aqi}
                            </div>
                            <FiChevronRight className="text-gray-400" />
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {[
                                { label: 'PM2.5', value: item.components.pm2_5.toFixed(1), color: 'text-purple-600' },
                                { label: 'PM10', value: item.components.pm10.toFixed(1), color: 'text-green-600' },
                                { label: 'CO', value: item.components.co.toFixed(1), color: 'text-yellow-600' },
                                { label: 'NO₂', value: item.components.no2.toFixed(1), color: 'text-orange-600' },
                                { label: 'O₃', value: item.components.o3.toFixed(1), color: 'text-blue-600' },
                                { label: 'SO₂', value: item.components.so2.toFixed(1), color: 'text-red-600' }
                            ].map((pollutant, idx) => (
                                <div key={idx} className="text-center">
                                    <p className="text-xs text-gray-500">{pollutant.label}</p>
                                    <p className={`text-lg font-bold ${pollutant.color}`}>{pollutant.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            })}
        </div>
    )

    const renderGraphView = () => (
        <div className="space-y-6 animate-fadeIn">
            {/* First Row: Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm opacity-90">Current AQI</p>
                            <p className="text-3xl font-bold mt-2">{stats.latestAqi || 'N/A'}</p>
                            <p className="text-sm mt-1">{stats.latestAqiLabel || 'No Data'}</p>
                        </div>
                        <div className="text-4xl opacity-80">🌤️</div>
                    </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm opacity-90">Avg PM2.5</p>
                            <p className="text-3xl font-bold mt-2">{stats.avgPm25 || 'N/A'}</p>
                            <p className="text-sm mt-1">μg/m³</p>
                        </div>
                        <div className="text-4xl opacity-80">💨</div>
                    </div>
                </div>
                
                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm opacity-90">Min/Max PM2.5</p>
                            <p className="text-3xl font-bold mt-2">{stats.minPm25 || 'N/A'}/{stats.maxPm25 || 'N/A'}</p>
                            <p className="text-sm mt-1">Range</p>
                        </div>
                        <div className="text-4xl opacity-80">📊</div>
                    </div>
                </div>
                
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm opacity-90">Total Readings</p>
                            <p className="text-3xl font-bold mt-2">{history.length}</p>
                            <p className="text-sm mt-1">Data Points</p>
                        </div>
                        <div className="text-4xl opacity-80">📈</div>
                    </div>
                </div>
            </div>

            {/* Second Row: Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left: Pollutant Trends */}
                <div className="bg-white rounded-2xl shadow-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">Pollutant Trends</h3>
                            <p className="text-gray-600">Real-time variations</p>
                        </div>
                        <div className="flex space-x-2">
                            {['pm2_5', 'pm10', 'o3', 'no2'].map(pollutant => (
                                <button
                                    key={pollutant}
                                    onClick={() => setSelectedPollutant(pollutant)}
                                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${selectedPollutant === pollutant 
                                        ? 'bg-blue-100 text-blue-700 shadow-inner' 
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                >
                                    {getPollutantIcon(pollutant)}
                                    <span className="text-xs font-medium">{pollutant.toUpperCase()}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={barChartData}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={getPollutantColor(selectedPollutant)[0]} stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor={getPollutantColor(selectedPollutant)[0]} stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis 
                                    dataKey="timestamp" 
                                    angle={-45}
                                    textAnchor="end"
                                    height={50}
                                    tick={{ fill: '#6b7280' }}
                                />
                                <YAxis tick={{ fill: '#6b7280' }} />
                                <Tooltip 
                                    contentStyle={{ 
                                        borderRadius: '12px',
                                        border: 'none',
                                        boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                                    }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey={selectedPollutant} 
                                    stroke={getPollutantColor(selectedPollutant)[0]} 
                                    strokeWidth={3}
                                    fill="url(#colorValue)"
                                    activeDot={{ r: 8, strokeWidth: 2 }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Right: Pollutant Distribution */}
                <div className="bg-white rounded-2xl shadow-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">Pollutant Distribution</h3>
                            <p className="text-gray-600">Latest reading composition</p>
                        </div>
                        <div className="text-gray-400">
                            <FiInfo />
                        </div>
                    </div>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieChartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    labelLine={false}
                                >
                                    {pieChartData.map((entry, index) => (
                                        <Cell 
                                            key={`cell-${index}`} 
                                            fill={entry.color}
                                            stroke="#fff"
                                            strokeWidth={2}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ 
                                        borderRadius: '12px',
                                        border: 'none',
                                        boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                                    }}
                                    formatter={(value) => [`${value.toFixed(2)} μg/m³`, 'Value']}
                                />
                                <Legend 
                                    verticalAlign="bottom" 
                                    height={36}
                                    formatter={(value, entry) => (
                                        <span style={{ color: '#6b7280', fontSize: '12px' }}>{value}</span>
                                    )}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Third Row: AQI Distribution and Radial Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left: AQI Distribution */}
                <div className="bg-white rounded-2xl shadow-xl p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">AQI Level Distribution</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={aqiDistributionData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis 
                                    dataKey="name" 
                                    tick={{ fill: '#6b7280' }}
                                />
                                <YAxis tick={{ fill: '#6b7280' }} />
                                <Tooltip 
                                    contentStyle={{ 
                                        borderRadius: '12px',
                                        border: 'none',
                                        boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                                    }}
                                    formatter={(value) => [`${value} readings`, 'Count']}
                                />
                                <Bar 
                                    dataKey="value" 
                                    radius={[8, 8, 0, 0]}
                                    barSize={40}
                                >
                                    {aqiDistributionData.map((entry, index) => (
                                        <Cell 
                                            key={`cell-${index}`} 
                                            fill={entry.fill}
                                            className="hover:opacity-80 transition-opacity duration-200"
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Right: Radial Performance */}
                <div className="bg-white rounded-2xl shadow-xl p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">Air Quality Metrics</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadialBarChart 
                                innerRadius="20%" 
                                outerRadius="100%" 
                                data={radialChartData}
                                startAngle={180}
                                endAngle={0}
                            >
                                <RadialBar
                                    minAngle={15}
                                    background
                                    clockWise={true}
                                    dataKey="value"
                                    cornerRadius={10}
                                >
                                    {radialChartData.map((entry, index) => (
                                        <Cell 
                                            key={`cell-${index}`} 
                                            fill={entry.color}
                                            fillOpacity={0.8}
                                        />
                                    ))}
                                </RadialBar>
                                <Tooltip 
                                    contentStyle={{ 
                                        borderRadius: '12px',
                                        border: 'none',
                                        boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                                    }}
                                    formatter={(value, name) => [`${value.toFixed(1)}%`, name]}
                                />
                                <Legend 
                                    iconSize={10}
                                    layout="vertical"
                                    verticalAlign="middle"
                                    align="right"
                                    wrapperStyle={{ paddingLeft: '20px' }}
                                />
                            </RadialBarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    )

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                            Air Quality History Dashboard
                        </h1>
                        <p className="text-gray-600">
                            Comprehensive analysis of air pollution data over time
                        </p>
                    </div>
                    
                    {/* Control Panel */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="inline-flex rounded-xl bg-white/80 backdrop-blur-sm shadow-lg p-1">
                            <button
                                onClick={() => setViewMode('table')}
                                className={`flex items-center space-x-3 px-6 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${viewMode === 'table' 
                                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg' 
                                    : 'text-gray-700 hover:bg-gray-100'}`}
                            >
                                <FiList className="w-5 h-5" />
                                <span>Table View</span>
                            </button>
                            <button
                                onClick={() => setViewMode('graph')}
                                className={`flex items-center space-x-3 px-6 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${viewMode === 'graph' 
                                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg' 
                                    : 'text-gray-700 hover:bg-gray-100'}`}
                            >
                                <FiBarChart2 className="w-5 h-5" />
                                <span>Graph View</span>
                            </button>
                        </div>
                        
                        <button 
                            onClick={exportData}
                            className="flex items-center justify-center space-x-2 px-6 py-3 bg-white text-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
                        >
                            <FiDownload className="w-5 h-5" />
                            <span className="font-medium">Export Data</span>
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-blue-100 rounded-xl">
                                <FiCalendar className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Time Range</p>
                                <p className="text-lg font-bold text-gray-900">
                                    {history.length > 0 
                                        ? `${formatDateShort(history[0].dt)} - ${formatDateShort(history[history.length - 1].dt)}`
                                        : 'No Data'
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-green-100 rounded-xl">
                                <FiTrendingUp className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Avg PM2.5</p>
                                <p className="text-lg font-bold text-gray-900">
                                    {stats.avgPm25 || 'N/A'} μg/m³
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-purple-100 rounded-xl">
                                <FiFilter className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Total Readings</p>
                                <p className="text-lg font-bold text-gray-900">{history.length}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-red-100 rounded-xl">
                                <FiRefreshCw className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Latest AQI</p>
                                <p className="text-lg font-bold text-gray-900">
                                    {stats.latestAqi || 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="animate-fadeIn">
                {viewMode === 'table' ? renderTableView() : renderGraphView()}
            </div>

            {/* Footer Legend */}
            <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex flex-wrap gap-4 justify-center">
                    {[1, 2, 3, 4, 5].map(aqi => {
                        const colors = getAqiColor(aqi)
                        return (
                            <div key={aqi} className="flex items-center space-x-2">
                                <div className={`w-3 h-3 rounded-full ${colors.text.replace('text-', 'bg-')}`}></div>
                                <span className="text-sm text-gray-700">
                                    AQI {aqi}: {getAqiLabel(aqi)}
                                </span>
                            </div>
                        )
                    })}
                </div>
                <p className="text-center text-gray-500 text-sm mt-4">
                    Data updates in real-time • Last updated: {history.length > 0 ? formatDate(history[history.length - 1].dt) : 'N/A'}
                </p>
            </div>
        </div>
    )
}

export default AQIHistoryReport