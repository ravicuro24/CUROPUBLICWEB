// src/App.jsx
import React from 'react'
import Header from './component/Header'
import Footer from './component/Footer'
import Router from './router/Router'
import { useAuth } from './Authorization/AuthContext'
import Login from './component/Login'

function App() {
  const { authModal, setAuthModal } = useAuth()

  return (
    <div className='bg-[#f3f3f2]'>
      <Header />

      <Router />

      <Footer />

      {authModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-brightness-50 p-4">
          <div
            className="
              w-full 
              max-w-md 
              sm:max-w-lg 
              md:max-w-xl 
              lg:w-[30%]
              bg-white 
              rounded-md 
              shadow-xl 
              overflow-y-auto 
              max-h-[90vh]
            "
          >
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
