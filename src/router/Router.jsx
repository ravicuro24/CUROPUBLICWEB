// src/router/Router.jsx
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import MedicineHome from '../pages/medicine/MedicineHome'
import LandingPage from '../LandingPage'
import Login from '../component/Login'
import MyProfile from '../component/profile/Profile'
import MedicneSUbcategoryProduct from '../pages/medicine/MedicneSUbcategoryProduct'
import MedicineCartItems from '../pages/medicine/MedicineCartItems'
import ShopByHealthConcernMedicne from '../pages/medicine/ShopByHealthConcernMedicne'
import MedicineDetails from '../pages/medicine/MedicineDetails'
import MedicineCheckout from '../pages/medicine/MedicineCheckout'
import MedicinePaymentMethod from '../pages/medicine/MedicinePaymentMethod'
import MedicneOrderConfirm from '../pages/medicine/MedicneOrderConfirm'
import SubCategoryMedicineDetails from '../pages/medicine/SubCategoryMedicineDetails'
import FamilyMedicalHIstory from '../component/familyMedical/FamilyMedicalHIstoryWrapper'
import MedicineOrder from '../pages/medicine/MedicineOrder'
import LabRouting from './LabRouting'
import ManageProfile from '../component/profile/ManageProfile'
import MedicineTrackorder from '../pages/medicine/MedicineTrackorder'

function Router() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/medicine/delivery' element={<MedicineHome />} />
        <Route path='/login' element={<Login />} />
        <Route path='/profile' element={<MyProfile />} />
        <Route path='/manage_profile' element={<ManageProfile />} />
        <Route path='/medicine/category/subcategory/product/:id' element={<MedicneSUbcategoryProduct />} />
        <Route path='/medicine/cart' element={<MedicineCartItems />} />
        <Route path='/medicine/shopbyhealthconcern/medicine/:name' element={<ShopByHealthConcernMedicne />} />
        <Route path='/medicine/shopbyhealthconcern/medicine_details' element={<MedicineDetails />} />
        <Route path='/medicine/subCategory/medicine_details' element={<SubCategoryMedicineDetails />} />
        <Route path='/medicine/checkout' element={<MedicineCheckout />} />
        <Route path='/medicine/payemnt' element={<MedicinePaymentMethod />} />
        <Route path='/medicine/checkout/order-confirm' element={<MedicneOrderConfirm />} />
        <Route path='/familyMedical_history' element={<FamilyMedicalHIstory />} />
        <Route path='/medicine/order' element={<MedicineOrder />} />
        <Route path='/medicine_trackOrder' element={<MedicineTrackorder />} />
        
      </Routes>
      <LabRouting />
    </div>
  )
}

export default Router