import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import UploadReport from './pages/UploadReport'
import MyReports from './pages/MyReports'
import AnalyzeReport from './pages/AnalyzeReport'
import Chat from './pages/Chat'
import Payments from './pages/Payments'
import DoctorsList from './pages/DoctorsList'
import DoctorProfile from './pages/DoctorProfile'
import Dashboard from './pages/Dashboard'
import Appointments from './pages/Appointments'
import BookAppointment from './pages/BookAppointment'
import Navbar from './components/Navbar'
import { ToastProvider } from './context/ToastContext'

export default function App(){
  return (
    <ToastProvider>
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <main>
          <Routes>
            <Route path="/login" element={<Login/>} />
            <Route path="/register" element={<Register/>} />
            <Route path="/doctors" element={<DoctorsList/>} />
            <Route path="/doctors/:id" element={<DoctorProfile/>} />
            <Route path="/book-appointment" element={<BookAppointment/>} />
            <Route path="/dashboard" element={<Dashboard/>} />
            <Route path="/appointments" element={<Appointments/>} />
            <Route path="/upload-report" element={<UploadReport/>} />
            <Route path="/my-reports" element={<MyReports/>} />
            <Route path="/analyze/:id" element={<AnalyzeReport/>} />
            <Route path="/chat" element={<Chat/>} />
            <Route path="/payments" element={<Payments/>} />
            <Route path="/" element={<Dashboard/>} />
          </Routes>
        </main>
      </div>
    </ToastProvider>
  )
}
