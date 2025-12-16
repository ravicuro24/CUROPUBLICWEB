import React from 'react'
import { Route, Routes } from 'react-router-dom'
import BloodBankHome from '../pages/bloodBank/BloodBankHome'

function BloodBankRouting() {
  return (
    <>
      <Routes>
        <Route path='/blood' element={<BloodBankHome />} />
      </Routes>

    </>
  )
}

export default BloodBankRouting