import React, { useEffect, useState } from 'react'
import axios from '../api'
import { Link } from 'react-router-dom'

export default function MyReports(){
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    const load = async ()=>{
      try {
        const res = await axios.get('/api/reports/my')
        setReports(res.data)
      } catch(err) {
        console.error('Failed to load reports:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="container-max py-12">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-600">Loading reports...</p>
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
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Medical Reports</h1>
            <p className="text-slate-600">Access and manage your medical documents</p>
          </div>
          <Link 
            to="/upload-report" 
            className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            + Upload Report
          </Link>
        </div>

        {/* Empty State */}
        {reports.length === 0 && (
          <div className="card text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No Reports Yet</h3>
            <p className="text-slate-600 mb-6">Upload your medical reports to access AI-powered insights and keep them organized.</p>
            <Link 
              to="/upload-report" 
              className="inline-block px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg transition-colors"
            >
              Upload Your First Report
            </Link>
          </div>
        )}

        {/* Reports Grid */}
        {reports.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map(r => (
              <div key={r._id} className="card-hover">
                {/* Report Icon & Type */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 mb-1 truncate">
                      {r.filename || 'Medical Report'}
                    </h3>
                    <div className="text-sm text-slate-500">
                      {new Date(r.createdAt).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </div>
                  </div>
                </div>

                {/* Analysis Status */}
                {r.analysis ? (
                  <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <div className="flex items-center gap-2 text-emerald-700 text-sm font-medium mb-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      AI Analysis Available
                    </div>
                    <p className="text-xs text-emerald-600 line-clamp-2">{r.analysis}</p>
                  </div>
                ) : (
                  <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-center gap-2 text-amber-700 text-sm font-medium">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      No analysis yet
                    </div>
                  </div>
                )}

                {/* File Info */}
                <div className="space-y-2 mb-6 text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <span>{r.contentType || 'PDF Document'}</span>
                  </div>
                  {r.size && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>{(r.size / 1024).toFixed(2)} KB</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <a 
                    href={r.url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex-1 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white text-center font-medium rounded-lg transition-colors"
                  >
                    View
                  </a>
                  <Link 
                    to={`/analyze/${r._id}`} 
                    className="px-4 py-2 border-2 border-purple-500 text-purple-600 hover:bg-purple-50 font-medium rounded-lg transition-colors"
                  >
                    Analyze
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
