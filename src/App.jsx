// src/App.jsx
import React from 'react'
import Header from './component/Header'
import Footer from './component/Footer'
import Router from './router/Router'


function App() {
  return (
    <>
      <Header />
      <Router />
      <Footer />
    </>
  )
}

export default App