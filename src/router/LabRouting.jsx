import React from 'react'
import { Route, Routes } from 'react-router-dom'
import LabHome from '../pages/lab/labhome/LabHome'

function LabRouting() {
  return (
    <div>
        <Routes>
            <Route path='/lab' element={<LabHome/>}/>
        </Routes>
    </div>
  )
}

export default LabRouting