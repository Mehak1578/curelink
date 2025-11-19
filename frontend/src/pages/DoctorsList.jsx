import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

export default function DoctorsList(){
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(()=>{
    const load = async ()=>{
      try {
        const res = await axios.get(import.meta.env.VITE_API_URL + '/api/doctors')
        setDoctors(res.data)
      } catch(err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  },[])

  if (loading) {
    return (
      <div className="container-max py-12">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-600">Loading doctors...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50 py-12">
      <div className="container-max">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Our Doctors</h1>
          <p className="text-xl text-slate-600">Experienced healthcare professionals ready to help you</p>
        </div>

        {/* Empty State */}
        {doctors.length === 0 && (
          <div className="card text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-sky-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No Doctors Found</h3>
            <p className="text-slate-600 mb-6">No doctors are currently available. Please check back later.</p>
          </div>
        )}

        {/* Doctors Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {doctors.map(d => (
            <div key={d._id} className="card-hover">
              {/* Doctor Avatar */}
              <div className="flex items-start gap-4 mb-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-sky-400 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                  {d.user?.name?.charAt(0)?.toUpperCase() || 'D'}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-slate-900 mb-1 truncate">
                    {d.user?.name || 'Doctor'}
                  </h3>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-sky-100 text-sky-700">
                    {d.specialization}
                  </span>
                </div>
              </div>

              {/* Doctor Details */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-slate-600">
                  <svg className="w-5 h-5 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{d.experience || 0} years experience</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-semibold text-slate-900">${d.fees || '—'} consultation fee</span>
                </div>
                {d.verified && (
                  <div className="flex items-center gap-2 text-emerald-600">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium">Verified Doctor</span>
                  </div>
                )}
              </div>

              {/* Bio */}
              {d.bio && (
                <p className="text-slate-600 text-sm mb-6 line-clamp-2">{d.bio}</p>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <Link 
                  to={`/doctors/${d._id}`} 
                  className="flex-1 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white font-medium rounded-lg text-center transition-colors"
                >
                  View Profile
                </Link>
                <Link 
                  to="/book-appointment"
                  state={{ doctor: d }}
                  className="px-4 py-2 border-2 border-sky-500 text-sky-600 hover:bg-sky-50 font-medium rounded-lg transition-colors"
                >
                  Book
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
