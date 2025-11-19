import React, { useEffect, useState } from 'react'
import { io } from 'socket.io-client'

export default function Chat(){
  const [socket, setSocket] = useState(null)
  const [text, setText] = useState('')
  const [messages, setMessages] = useState([])

  useEffect(()=>{
    const s = io(import.meta.env.VITE_API_URL?.replace('http','ws') || 'http://localhost:5000')
    setSocket(s)
    s.on('connect', ()=> console.log('connected', s.id))
    s.on('chat:message', (msg) => setMessages(m=>[...m, msg]))
    return ()=> s.disconnect()
  }, [])

  const send = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (!user?.id) return alert('Login first')
    const payload = { from: user.id, to: user.id, text }
    socket.emit('chat:message', payload)
    setText('')
  }

  return (
    <div>
      <h2 className="text-lg font-semibold">Chat (demo)</h2>
      <div className="mt-3 p-3 border h-64 overflow-auto bg-white">
        {messages.map((m,i)=>(<div key={i}><strong>{m.from}</strong>: {m.text}</div>))}
      </div>
      <div className="mt-2 flex gap-2">
        <input className="flex-1 p-2 border" value={text} onChange={e=>setText(e.target.value)} />
        <button className="px-3 py-2 bg-blue-600 text-white" onClick={send}>Send</button>
      </div>
    </div>
  )
}
