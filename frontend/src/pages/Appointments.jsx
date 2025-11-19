import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

export default function Appointments(){
  const [appts, setAppts] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(null)

  const loadAppointments = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(import.meta.env.VITE_API_URL + '/api/appointments/my', { 
        headers: { Authorization: 'Bearer '+token }
      })
      setAppts(res.data)
    } catch(err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(()=>{
    loadAppointments()
  }, [])

  const handleCancel = async (appointmentId) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return
    
    setCancelling(appointmentId)
    try {
      const token = localStorage.getItem('token')
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/appointments/cancel/${appointmentId}`,
        {},
        { headers: { Authorization: 'Bearer '+token }}
      )
      // Reload appointments
      await loadAppointments()
    } catch(err) {
      console.error(err)
      alert('Failed to cancel appointment')
    } finally {
      setCancelling(null)
    }
  }

  const getStatusClass = (status) => {
    const classes = {
      requested: 'status-badge status-pending',
      confirmed: 'status-badge status-confirmed',
      completed: 'status-badge status-completed',
      cancelled: 'status-badge status-cancelled'
    }
    return classes[status] || 'status-badge bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="container-max py-12">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-600">Loading appointments...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50 py-12">
      <div className="container-max">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">My Appointments</h1>
            <p className="text-slate-600">Manage and track your medical appointments</p>
          </div>
          <Link 
            to="/book-appointment"
            className="px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Book New
          </Link>
        </div>

        {/* Empty State */}
        {appts.length === 0 && (
          <div className="card text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-emerald-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No Appointments Yet</h3>
            <p className="text-slate-600 mb-6">You haven't booked any appointments. Find a doctor and schedule your first visit!</p>
            <Link 
              to="/book-appointment"
              className="inline-block px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white font-medium rounded-lg transition-colors"
            >
              Find a Doctor
            </Link>
          </div>
        )}

        {/* Appointments Table */}
        {appts.length > 0 && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-sky-500 to-cyan-500 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Doctor</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Date & Time</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Reason</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {appts.map((a, idx) => (
                    <tr key={a._id} className="hover:bg-sky-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-cyan-500 flex items-center justify-center text-white font-semibold">
                            {(a.doctor?.name || a.doctor?.user?.name)?.charAt(0)?.toUpperCase() || 'D'}
                          </div>
                          <div>
                            <div className="font-medium text-slate-900">
                              {a.doctor?.name || a.doctor?.user?.name || 'Doctor'}
                            </div>
                            <div className="text-sm text-slate-500">
                              {a.doctor?.specialization || 'General'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-slate-900 font-medium">
                          {new Date(a.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </div>
                        <div className="text-sm text-slate-500">
                          {new Date(a.date).toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-slate-600">{a.reason || '—'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={getStatusClass(a.status)}>
                          {a.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button className="px-3 py-1 text-sm text-sky-600 hover:bg-sky-50 rounded transition-colors">
                            View
                          </button>
                          {a.status === 'requested' && (
                            <button 
                              onClick={() => handleCancel(a._id)}
                              disabled={cancelling === a._id}
                              className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                            >
                              {cancelling === a._id ? 'Cancelling...' : 'Cancel'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-slate-200">
              {appts.map(a => (
                <div key={a._id} className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-400 to-cyan-500 flex items-center justify-center text-white font-semibold">
                      {(a.doctor?.name || a.doctor?.user?.name)?.charAt(0)?.toUpperCase() || 'D'}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-900">
                        {a.doctor?.name || a.doctor?.user?.name || 'Doctor'}
                      </div>
                      <div className="text-sm text-slate-500">{a.doctor?.specialization || 'General'}</div>
                      <span className={getStatusClass(a.status) + ' mt-2'}>
                        {a.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm space-y-1 text-slate-600">
                    <div>📅 {new Date(a.date).toLocaleDateString()}</div>
                    <div>🕐 {new Date(a.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                    {a.reason && <div>📝 {a.reason}</div>}
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button className="flex-1 px-3 py-2 text-sm bg-sky-50 text-sky-600 font-medium rounded">View</button>
                    {a.status === 'requested' && (
                      <button 
                        onClick={() => handleCancel(a._id)}
                        disabled={cancelling === a._id}
                        className="px-3 py-2 text-sm text-red-600 border border-red-200 rounded disabled:opacity-50"
                      >
                        {cancelling === a._id ? 'Cancelling...' : 'Cancel'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
