// src/LandingPage.jsx
import React from 'react'
import Hero from './component/Hero'
import UploadPrescription from './component/UploadPrescription'
import OurServices from './component/OurServices'
import UpcommingStaus from './component/UpcommingStaus'
import HealthRecords from './component/HealthRecords'
import Testimonial from './component/Testomonial'
import UserBMI from './component/UserBMI'
import WeatherReport from './component/WeatherReport'

function LandingPage() {
    return (
        <div className="w-full    mx-auto">
            {/* Main Container */}
            <div className=" mx-auto ">
                {/* Hero Section */}
                <section className="">
                    <Hero />
                </section>

                {/* Upload Prescription */}
                <section className="py-2 sm:py-10  ">
                    <UploadPrescription />
                </section>

                {/* Our Services */}
                <section className="py-2 sm:py-10 ">
                    <OurServices />
                </section>

                {/* Upcoming Status */}
                {/* <section className="py-2 sm:py-10 ">
                    <UpcommingStaus />
                </section> */}

                {/* Health Records */}
                <section className="py-2 sm:py-10 ">
                    <HealthRecords />
                </section>
                <section className='py-2 sm:py-10'>
                    <UserBMI />
                </section>
                <section className='py-2 sm:py-10 '>
                    <WeatherReport />
                </section>
                {/* <section className="py-2 sm:py-10 ">
                    <Testimonial/>
                </section> */}
            </div>
        </div>
    )
}

export default LandingPage
