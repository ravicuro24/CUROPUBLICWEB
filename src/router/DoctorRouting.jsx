// src/router/DoctorRouting.jsx
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import DoctorHome from '../pages/doctor/doctorHome/DoctorHome'

function DoctorRouting() {
    return (
        <div>
            <Routes>
                <Route path='/doctor' element={<DoctorHome />} />
            </Routes>
        </div>
    )
}

export default DoctorRouting