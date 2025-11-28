// src/router/LabRouting.jsx
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import LabHome from '../pages/lab/labhome/LabHome'
import LabPackageDetails from '../pages/lab/labhome/LabPackageDetails'
import TestByCategoryTestList from '../pages/lab/labhome/TestByCategoryTestList'
import LabCartItems from '../pages/lab/labhome/LabCartItems'
import SelectSlot from '../pages/lab/labhome/SelectSlot'
import LabAppointmentConfirm from '../pages/lab/labhome/LabAppoitmentConfirm'
import LabCollectionType from '../pages/lab/labhome/LabCollectionType'
import LabCollectionTypeSinglePackage from '../pages/lab/labhome/LabCollectionTypeSinglePackage'
import LabVitalOrganListApi from '../pages/lab/labhome/TestByVitalOrganListApi'

function LabRouting() {
  return (
    <div>
      <Routes>
        <Route path='/lab' element={<LabHome />} />
        <Route path='/lab_cartitems' element={<LabCartItems />} />
        <Route path='/labPackage_details' element={<LabPackageDetails />} />
        <Route path='/lab/package/Alltests' element={<TestByCategoryTestList />} />
        <Route path='/lab/package/selectSlot' element={<SelectSlot />} />
        <Route path='/lab/package/typeCollection' element={<LabCollectionType />} />
        <Route path='/lab/package/single/package' element={<LabCollectionTypeSinglePackage />} />
        <Route path='/lab/appointment/confirm' element={<LabAppointmentConfirm />} />
        <Route path='/lab/vital/organlist' element={<LabVitalOrganListApi />} />
      </Routes>
    </div>
  )
}

export default LabRouting