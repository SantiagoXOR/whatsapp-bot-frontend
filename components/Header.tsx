'use client'

import { useState, useEffect } from 'react'

export default function Header() {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      const dark = savedTheme === 'dark'
      setIsDark(dark)
      document.documentElement.classList.toggle('dark', dark)
    }
  }, [])

  const toggleTheme = () => {
    const newIsDark = !isDark
    setIsDark(newIsDark)
    document.documentElement.classList.toggle('dark', newIsDark)
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light')
  }

  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <i className="fab fa-whatsapp text-white text-xl"></i>
            </div>
            <div>
              <h1 className="text-2xl font-bold">WhatsApp Bot</h1>
              <p className="text-sm text-muted-foreground">Envío automatizado de mensajes</p>
            </div>
          </div>
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-border hover:bg-accent transition-colors"
          >
            <i className={`fas ${isDark ? 'fa-sun' : 'fa-moon'} text-lg`}></i>
          </button>
        </div>
      </div>
    </header>
  )
}
