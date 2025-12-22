// src/component/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/logo.png"; // Update path to your logo
import { FaFacebook, FaInstagram, FaWhatsapp, FaLinkedin, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";  // Twitter X icon

function Footer() {
  return (
    <footer className="bg-gradient-to-r from-teal-50 via-white to-teal-50  py-10 px-6 md:px-12 lg:px-20 dark:bg-gray-500">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 items-start">

        {/* Left Section - Info */}
        <div className="text-center md:text-left">
          <img
            src={Logo}
            alt="PharmaConnect Logo"
            className="w-32 md:w-40 drop-shadow-md hover:scale-105 transition-transform duration-300"
          />

          <p className="text-gray-500 text-sm leading-6 mt-2">
            Your trusted partner for medicines, diagnostics, and pharmacy solutions.
          </p>
          <p className="text-gray-400 text-xs mt-4">
            © {new Date().getFullYear()} Curo24 digital health services pvt Ltd. All rights reserved.
          </p>
        </div>

        {/* Center Section - Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:col-span-3">
          
          {/* Services Column */}
          <div>
            <h3 className="text-gray-800 font-semibold mb-3 text-sm uppercase">Services</h3>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li><Link to="/medicine/delivery" className="hover:text-teal-700 transition">Medicine Delivery</Link></li>
              <li><Link to="/doctor" className="hover:text-teal-700 transition">Doctor Consultation</Link></li>
              <li><Link to="/lab" className="hover:text-teal-700 transition">Lab Tests</Link></li>
              <li><Link to="/ambulance" className="hover:text-teal-700 transition">Ambulance Booking</Link></li>
              <li><Link to="/blood" className="hover:text-teal-700 transition">Blood Bank</Link></li>
              <li><Link to="/emergency-services" className="hover:text-teal-700 transition">Emergency Services</Link></li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h3 className="text-gray-800 font-semibold mb-3 text-sm uppercase">Support</h3>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li><Link to="/help-center" className="hover:text-teal-700 transition">Help Center</Link></li>
              <li><Link to="/contactUs" className="hover:text-teal-700 transition">Contact Us</Link></li>
              <li><Link to="/track-order" className="hover:text-teal-700 transition">Track Order</Link></li>
              <li><Link to="/insurance" className="hover:text-teal-700 transition">Insurance Claims</Link></li>
              <li><Link to="/medicine/delivery" className="hover:text-teal-700 transition">Prescription Upload</Link></li>
              <li><Link to="/emergency-helpline" className="hover:text-teal-700 transition">Emergency Helpline</Link></li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="text-gray-800 font-semibold mb-3 text-sm uppercase">Company</h3>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li><Link to="/contactUs" className="hover:text-teal-700 transition">About Us</Link></li>
              <li><Link to="/careers" className="hover:text-teal-700 transition">Careers</Link></li>
              <li><Link to="/partner-with-us" className="hover:text-teal-700 transition">Partner with Us</Link></li>
              <li><Link to="/press-media" className="hover:text-teal-700 transition">Press & Media</Link></li>
              <li><Link to="/investor-relations" className="hover:text-teal-700 transition">Investor Relations</Link></li>
              <li><Link to="/corporate-health" className="hover:text-teal-700 transition">Corporate Health</Link></li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="text-gray-800 font-semibold mb-3 text-sm uppercase">Legal</h3>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li><Link to="/privacy_policy" className="hover:text-teal-700 transition">Privacy Policy</Link></li>
              <li><Link to="/return_refund_policies" className="hover:text-teal-700 transition">Terms of Service</Link></li>
              <li><Link to="" className="hover:text-teal-700 transition">HIPAA Compliance</Link></li>
              <li><Link to="/return_refund_policies" className="hover:text-teal-700 transition">Refund Policy</Link></li>
              <li><Link to="/licensing" className="hover:text-teal-700 transition">Licensing</Link></li>
            </ul>
          </div>

        </div>

        {/* Social Icons Row - Full width below */}
        <div className="md:col-span-4 flex flex-col items-center gap-4 mt-8 pt-8 border-t border-gray-300">
          <p className="text-lg font-bold uppercase">Our Social Platform</p>

          <div className="grid grid-cols-5 gap-6 mt-2">
            <a href="https://www.facebook.com/profile.php?id=61574058501599" target="_blank" rel="noopener noreferrer" className="flex justify-center text-gray-600 text-2xl hover:text-teal-700 transition">
              <FaFacebook className="text-blue-500" />
            </a>
            <a href="https://www.instagram.com/curo24_healthtech/" target="_blank" rel="noopener noreferrer" className="flex justify-center text-gray-600 text-2xl hover:text-teal-700 transition">
              <FaInstagram className="text-pink-600" />
            </a>
            <a href="https://x.com/24Curo" target="_blank" rel="noopener noreferrer" className="flex justify-center text-gray-600 text-2xl hover:text-teal-700 transition">
              <FaXTwitter className="text-black" />
            </a>
            <a href="https://www.linkedin.com/company/curo24/" target="_blank" rel="noopener noreferrer" className="flex justify-center text-gray-600 text-2xl hover:text-teal-700 transition">
              <FaLinkedin className="text-blue-600" />
            </a>
            <a
              href="https://www.youtube.com/@curo24"
              target="_blank"
              rel="noopener noreferrer"
              className="flex justify-center text-gray-600 text-2xl hover:text-red-600 transition"
            >
              <FaYoutube className="text-red-500" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;