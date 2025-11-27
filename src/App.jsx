// src/App.jsx
import React, { useEffect } from 'react'
import Header from './component/Header'
import Footer from './component/Footer'
import Router from './router/Router'
import { useAuth } from './Authorization/AuthContext'
import Login from './component/Login'

function App() {
  const { authModal, setAuthModal } = useAuth()
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);


  return (
    // <div className='bg-[#f3f3f2] select-none'>
    <div className='bg-[#f3f3f2] '>
      <Header />
      <Router />
      <Footer />

      {authModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-brightness-50 p-4">
          <div
            className=" w-4xl bg-white " >
            <Login
              onClose={() => setAuthModal(false)}
              onLoginSuccess={() => setAuthModal(false)}
            />
          </div>
        </div>
      )}




    </div>
  )
}

export default App
