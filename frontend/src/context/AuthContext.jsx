import React, { createContext, useState, useEffect } from 'react'

export const AuthContext = createContext()

export function AuthProvider({ children }){
  const [user, setUser] = useState(() => {
    try{ return JSON.parse(localStorage.getItem('user')) }catch(e){ return null }
  })

  useEffect(()=>{
    if(user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user')
  }, [user])

  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>
}
