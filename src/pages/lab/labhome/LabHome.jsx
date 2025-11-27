// src/pages/lab/labhome/LabHome.jsx
import React from 'react'
import UploadLabPrescrotpion from './UploadLabPrescrotpion'
import LabHero from './LabHero'
import LabPopularPackages from './LabPopularPackages'
import TestByCategory from './TestByCategory'
import Testimonial from '../../../component/Testomonial'
import TestByVitalOrganList from './TestByVitalOrganList'

function LabHome() {
  return (
    <div className='h-screen container mx-2 md:mx-auto overflow-y-auto hide-scrollbar'>
      <LabHero />
      <UploadLabPrescrotpion />
      <TestByCategory />
      <LabPopularPackages />
      <TestByVitalOrganList/>
      <Testimonial/>

    </div>
  )
}

export default LabHome