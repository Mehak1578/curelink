import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function Navbar(){
  const { user, setUser } = useContext(AuthContext)
  const logout = () => { localStorage.removeItem('token'); setUser(null) }

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-slate-100">
        <div className="container-max">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-sky-600 to-cyan-600 bg-clip-text text-transparent">CureLink</span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-slate-700 hover:text-sky-600 font-medium transition-colors">Home</Link>
              <Link to="/doctors" className="text-slate-700 hover:text-sky-600 font-medium transition-colors">Doctors</Link>
              <Link to="/appointments" className="text-slate-700 hover:text-sky-600 font-medium transition-colors">Appointments</Link>
              <Link to="/my-reports" className="text-slate-700 hover:text-sky-600 font-medium transition-colors">Reports</Link>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-cyan-400 flex items-center justify-center text-white font-medium text-sm">
                      {user.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <span className="text-slate-700 font-medium">{user.name}</span>
                  </div>
                  <button onClick={logout} className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="px-4 py-2 text-sm font-medium text-sky-600 hover:bg-sky-50 rounded-lg transition-colors">
                    Login
                  </Link>
                  <Link to="/register" className="px-4 py-2 text-sm font-medium bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors shadow-sm">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
  )
}
