
import React from 'react'
import { Routes,Route } from 'react-router-dom'
import InsuranceHome from '../pages/insurance/InsuranceHome'

function InsuranceRouting() {
    return (
        <>
            <Routes>
                <Route path='/insurance' element={<InsuranceHome />} />
            </Routes>
        </>
    )
}

export default InsuranceRouting