// src/router/Router.jsx
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import MedicineHome from '../pages/medicine/MedicineHome'
import LandingPage from '../LandingPage'
import Login from '../component/Login'

function Router() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/medicine/delivery' element={<MedicineHome />} />
        <Route path='/login' element={<Login/>}/>
      </Routes>
    </div>
  )
}

export default Router