import React, { useEffect, useState, useRef } from 'react'
import { io } from 'socket.io-client'

export default function Chat(){
  const [socket, setSocket] = useState(null)
  const [text, setText] = useState('')
  const [messages, setMessages] = useState([])
  const [darkMode, setDarkMode] = useState(false)
  const [replyTo, setReplyTo] = useState(null)
  const messagesEndRef = useRef(null)

  useEffect(()=>{
    const s = io(import.meta.env.VITE_API_URL?.replace('http','ws') || 'http://localhost:5000')
    setSocket(s)
    s.on('connect', ()=> console.log('connected', s.id))
    s.on('chat:message', (msg) => setMessages(m=>[...m, msg]))
    return ()=> s.disconnect()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  const send = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (!user?.id) return alert('Login first')
    const payload = { 
      from: user.id, 
      to: user.id, 
      text,
      replyTo: replyTo?.text || null
    }
    socket.emit('chat:message', payload)
    setText('')
    setReplyTo(null)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div className="smart-chat-container" style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      color: 'var(--text)',
      transition: 'background-color 0.25s ease, color 0.25s ease'
    }}>
      {/* Header */}
      <div className="smart-chat-header" style={{
        width: '100%',
        background: 'var(--header-bg)',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#ffffff',
          margin: 0
        }}>SmartChat</h1>
        
        {/* Theme Toggle Button */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: darkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.25s ease',
            color: '#ffffff'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = darkMode ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.12)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = darkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)'
          }}
        >
          {darkMode ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          )}
        </button>
      </div>

      {/* Messages Container */}
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '20px',
        height: 'calc(100vh - 200px)',
        overflowY: 'auto'
      }}>
        {messages.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: darkMode ? '#9aa0b5' : '#7a7a7a'
          }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: '0 auto 16px' }}>
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <p style={{ fontSize: '18px', fontWeight: '500' }}>No messages yet</p>
            <p style={{ fontSize: '14px', marginTop: '8px' }}>Start a conversation!</p>
          </div>
        ) : (
          messages.map((m, i) => (
            <div key={i} style={{
              marginBottom: '16px',
              padding: '12px 16px',
              background: darkMode ? '#1c2333' : '#f8f9fa',
              borderRadius: '12px',
              transition: 'background-color 0.25s ease'
            }}>
              {m.replyTo && (
                <div style={{
                  padding: '8px 12px',
                  marginBottom: '8px',
                  borderLeft: '3px solid #7a5cff',
                  background: darkMode ? 'rgba(122, 92, 255, 0.1)' : 'rgba(122, 92, 255, 0.05)',
                  borderRadius: '6px',
                  fontSize: '13px',
                  color: darkMode ? '#9aa0b5' : '#7a7a7a'
                }}>
                  Replying to: {m.replyTo}
                </div>
              )}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '8px'
              }}>
                <strong style={{ color: '#7a5cff', fontSize: '14px' }}>{m.from}</strong>
                <button
                  onClick={() => setReplyTo(m)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: darkMode ? '#9aa0b5' : '#7a7a7a',
                    fontSize: '12px',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent'
                  }}
                >
                  Reply
                </button>
              </div>
              <div style={{ color: 'var(--text)', fontSize: '15px', lineHeight: '1.5' }}>
                {m.text}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'var(--bg)',
        borderTop: `1px solid ${darkMode ? '#2a3142' : '#e5e7eb'}`,
        padding: '16px',
        transition: 'all 0.25s ease'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          {replyTo && (
            <div style={{
              padding: '8px 12px',
              marginBottom: '8px',
              background: darkMode ? '#1c2333' : '#f8f9fa',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '13px'
            }}>
              <span style={{ color: darkMode ? '#9aa0b5' : '#7a7a7a' }}>
                Replying to: {replyTo.text.substring(0, 50)}...
              </span>
              <button
                onClick={() => setReplyTo(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: darkMode ? '#9aa0b5' : '#7a7a7a',
                  fontSize: '18px',
                  padding: '0 8px'
                }}
              >
                ×
              </button>
            </div>
          )}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <input
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              style={{
                flex: 1,
                padding: '14px 16px',
                background: 'var(--input-bg)',
                color: 'var(--input-text)',
                border: `1px solid ${darkMode ? '#2a3142' : '#e5e7eb'}`,
                borderRadius: '12px',
                fontSize: '15px',
                outline: 'none',
                transition: 'background-color 0.25s ease, color 0.25s ease, border-color 0.25s ease'
              }}
            />
            <button
              onClick={send}
              style={{
                padding: '14px 24px',
                background: 'linear-gradient(to right, #7a5cff, #b374ff)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontSize: '15px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(122, 92, 255, 0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              Send
            </button>
          </div>
        </div>
      </div>

      {/* Global Styles */}
      <style>{`
        :root {
          --bg: #ffffff;
          --text: #111;
          --header-bg: linear-gradient(to right, #7a5cff, #b374ff);
          --input-bg: #ffffff;
          --input-text: #000;
        }

        [data-theme='dark'] {
          --bg: #0f1624;
          --text: #fff;
          --header-bg: linear-gradient(to right, #5a3aff, #9d6cff);
          --input-bg: #1c2333;
          --input-text: #fff;
        }

        input::placeholder {
          color: ${darkMode ? '#9aa0b5' : '#7a7a7a'};
        }

        .smart-chat-container * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  )
}
