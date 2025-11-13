// src/LandingPage.jsx
import React from 'react'
import Hero from './component/Hero'
import UploadPrescription from './component/UploadPrescription'
import OurServices from './component/OurServices'
import UpcommingStaus from './component/UpcommingStaus'
import HealthRecords from './component/HealthRecords'

function LandingPage() {
    return (
        <div>
            <div className='min-h-screen'>
                <Hero />
                <UploadPrescription />
                <OurServices />
                <UpcommingStaus />
                <HealthRecords />
            </div>
        </div>
    )
}

export default LandingPage