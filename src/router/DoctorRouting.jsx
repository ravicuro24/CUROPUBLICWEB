// src/router/DoctorRouting.jsx
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import DoctorHome from '../pages/doctor/doctorHome/DoctorHome'
import DoctorHero from '../pages/doctor/doctorHome/DoctorHero'
import DoctorCategory from '../pages/doctor/doctorHome/DoctorCategory'
import DoctorList from '../pages/doctor/doctorHome/doctors/DoctorList'
import ViewDoctorDetails from '../pages/doctor/doctorHome/doctors/ViewDoctorDetails'
import BookAppoitment from '../pages/doctor/doctorHome/doctors/BookAppoitment'
import QuickConsultDoctorPayment from '../pages/doctor/doctorHome/quickConsult/QuickConsultDoctorPayment'
import QuickConsultHome from '../pages/doctor/doctorHome/quickConsult/QuickConsultHome'
import PaymentSuccessScreen from '../pages/doctor/doctorHome/quickConsult/PaymentSuccessScreen'
import PendingConsultDoctor from '../pages/doctor/doctorHome/quickConsult/PendingConsultDoctor'
import CompleteConsult from '../pages/doctor/doctorHome/quickConsult/CompleteConsult'
import QuickViewDoctorDetails from '../pages/doctor/doctorHome/quickConsult/QuickViewDoctorDetails'
import DoctorNotification from '../pages/doctor/DoctorNotification'
import SearchedDoctor from '../pages/doctor/doctorHome/doctors/SearchedDoctor'

function DoctorRouting() {
    return (
        <div>
            <Routes>
                {/* <Route path='/doctor' element={<DoctorHome />} /> */}
                <Route path='/doctor' element={<DoctorHero />} />
                <Route path='/doctor-category' element={<DoctorCategory />} />
                <Route path='/doctor/allDoctor' element={<DoctorList />} />
                <Route path='/doctor/doctor-details' element={<ViewDoctorDetails />} />
                <Route path='/doctor/quick/doctor-details' element={<QuickViewDoctorDetails />} />
                <Route path='/doctor-book-appoitment' element={<BookAppoitment />} />
                <Route path='/doctor/quick-consult/payment' element={<QuickConsultDoctorPayment />} />
                <Route path='/doctor/quick-consult' element={<QuickConsultHome />} />
                <Route path='/doctor/payment-success' element={<PaymentSuccessScreen />} />
                <Route path='/doctor/pendingConsultDoctor' element={<PendingConsultDoctor />} />
                <Route path='/doctor/complete/consult' element={<CompleteConsult />} />
                <Route path='/doctor/doctor/notifications' element={<DoctorNotification />} />
                <Route path='/doctor/doctor/search' element={<SearchedDoctor />} />
            </Routes>
        </div>
    )
}

export default DoctorRouting