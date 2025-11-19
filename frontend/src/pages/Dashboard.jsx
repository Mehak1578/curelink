import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function Dashboard(){
  const { user } = useContext(AuthContext)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-sky-500 via-cyan-500 to-teal-500 text-white">
        <div className="container-max py-20">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Your Health, <br />Our Priority
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-sky-50">
              Connect with top doctors, manage appointments, and access your medical reports — all in one place.
            </p>
            <div className="flex gap-4">
              {user ? (
                <>
                  <Link to="/doctors" className="px-8 py-4 bg-white text-sky-600 font-semibold rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200">
                    Find a Doctor
                  </Link>
                  <Link to="/appointments" className="px-8 py-4 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 border-2 border-white/20">
                    My Appointments
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/register" className="px-8 py-4 bg-white text-sky-600 font-semibold rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200">
                    Get Started
                  </Link>
                  <Link to="/login" className="px-8 py-4 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 border-2 border-white/20">
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container-max py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Everything You Need</h2>
          <p className="text-xl text-slate-600">Comprehensive healthcare management at your fingertips</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1: Doctors */}
          <Link to="/doctors" className="group">
            <div className="card-hover text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-sky-400 to-cyan-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Find Doctors</h3>
              <p className="text-slate-600 leading-relaxed">
                Browse verified doctors across specializations. View profiles, experience, and book appointments instantly.
              </p>
              <div className="mt-4 text-sky-600 font-medium group-hover:gap-2 flex items-center justify-center gap-1 transition-all">
                Browse Doctors 
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Feature 2: Appointments */}
          <Link to="/appointments" className="group">
            <div className="card-hover text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Appointments</h3>
              <p className="text-slate-600 leading-relaxed">
                Schedule and manage your appointments effortlessly. Get reminders and track appointment status in real-time.
              </p>
              <div className="mt-4 text-emerald-600 font-medium group-hover:gap-2 flex items-center justify-center gap-1 transition-all">
                Manage Appointments
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Feature 3: Reports */}
          <Link to="/my-reports" className="group">
            <div className="card-hover text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Medical Reports</h3>
              <p className="text-slate-600 leading-relaxed">
                Upload, store, and access your medical reports securely. AI-powered insights help you understand your health better.
              </p>
              <div className="mt-4 text-purple-600 font-medium group-hover:gap-2 flex items-center justify-center gap-1 transition-all">
                View Reports
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-br from-slate-50 to-sky-50 py-16">
        <div className="container-max">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-sky-600 mb-2">500+</div>
              <div className="text-slate-600">Verified Doctors</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-emerald-600 mb-2">10k+</div>
              <div className="text-slate-600">Appointments Booked</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">50k+</div>
              <div className="text-slate-600">Reports Analyzed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-cyan-600 mb-2">98%</div>
              <div className="text-slate-600">Patient Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
