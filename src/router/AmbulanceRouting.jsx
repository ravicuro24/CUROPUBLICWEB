// src/router/AmbulanceRouting.jsx
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Ambulance from '../pages/ambulance/ambulanceHome/AmbulanceHome'

function AmbulanceRouting() {
    return (
        <div>
            <Routes>
                <Route path='/ambulance' element={<Ambulance />} />
            </Routes>
        </div>
    )
}

export default AmbulanceRouting