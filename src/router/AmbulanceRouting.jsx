// src/router/AmbulanceRouting.jsx
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Ambulance from '../pages/ambulance/ambulanceHome/AmbulanceHome'
import AmbulanceLandingPage from '../pages/ambulance/ambulanceHome/AmbulanceLandingPage'

function AmbulanceRouting() {
    return (
        <div>
            <Routes>
                <Route path='/ambulance' element={<AmbulanceLandingPage />} />
                {/* <Route path='/ambulance' element={<Ambulance />} /> */}
            </Routes>
        </div>
    )
}

export default AmbulanceRouting