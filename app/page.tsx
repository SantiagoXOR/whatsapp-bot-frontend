'use client'

import { useState, useEffect } from 'react'
import { io, Socket } from 'socket.io-client'
import Header from '@/components/Header'
import FileUpload from '@/components/FileUpload'
import Configuration from '@/components/Configuration'
import ControlPanel from '@/components/ControlPanel'
import Notifications from '@/components/Notifications'

interface BotStats {
  total_contacts: number
  messages_sent: number
  current_contact: string
  status: string
}

interface Notification {
  id: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
}

export default function Home() {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [currentFile, setCurrentFile] = useState<string | null>(null)
  const [botRunning, setBotRunning] = useState(false)
  const [botStats, setBotStats] = useState<BotStats>({
    total_contacts: 0,
    messages_sent: 0,
    current_contact: '',
    status: 'idle'
  })
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [config, setConfig] = useState({
    limit: 50,
    delay: 20,
    message: 'Hola {nombre}, este es un mensaje automático.'
  })

  useEffect(() => {
    // Initialize socket connection
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'
    const newSocket = io(backendUrl)
    setSocket(newSocket)

    // Socket event listeners
    newSocket.on('bot_started', (data: BotStats) => {
      setBotRunning(true)
      setBotStats(data)
      addNotification('Bot iniciado exitosamente', 'success')
    })

    newSocket.on('status_update', (data: any) => {
      if (data.stats) {
        setBotStats(data.stats)
      }
      if (data.message) {
        addNotification(data.message, 'info')
      }
    })

    newSocket.on('bot_completed', (data: BotStats) => {
      setBotRunning(false)
      setBotStats(data)
      addNotification('Envío completado exitosamente', 'success')
    })

    newSocket.on('bot_stopped', () => {
      setBotRunning(false)
      addNotification('Bot detenido', 'warning')
    })

    newSocket.on('error', (data: { message: string }) => {
      setBotRunning(false)
      addNotification(data.message, 'error')
    })

    // Load saved configuration
    const savedConfig = localStorage.getItem('botConfig')
    if (savedConfig) {
      try {
        setConfig(JSON.parse(savedConfig))
      } catch (error) {
        console.error('Error loading saved config:', error)
      }
    }

    return () => {
      newSocket.close()
    }
  }, [])

  const addNotification = (message: string, type: Notification['type']) => {
    const id = Date.now().toString()
    setNotifications(prev => [...prev, { id, message, type }])
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id))
    }, 5000)
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const handleFileUploaded = (filename: string, contactCount: number) => {
    setCurrentFile(filename)
    setBotStats(prev => ({ ...prev, total_contacts: contactCount }))
    addNotification(`Archivo cargado: ${contactCount} contactos`, 'success')
  }

  const handleConfigChange = (newConfig: typeof config) => {
    setConfig(newConfig)
    localStorage.setItem('botConfig', JSON.stringify(newConfig))
  }

  const startBot = () => {
    if (!currentFile) {
      addNotification('Por favor selecciona un archivo de contactos', 'error')
      return
    }

    if (!socket) {
      addNotification('Error de conexión con el servidor', 'error')
      return
    }

    socket.emit('start_bot', {
      filename: currentFile,
      ...config
    })
  }

  const stopBot = () => {
    if (socket) {
      socket.emit('stop_bot')
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - File Upload & Configuration */}
          <div className="lg:col-span-2 space-y-6">
            <FileUpload 
              onFileUploaded={handleFileUploaded}
              currentFile={currentFile}
              onFileRemoved={() => setCurrentFile(null)}
            />
            
            <Configuration 
              config={config}
              onChange={handleConfigChange}
            />
          </div>
          
          {/* Right Column - Control Panel */}
          <div>
            <ControlPanel
              botStats={botStats}
              botRunning={botRunning}
              onStart={startBot}
              onStop={stopBot}
            />
          </div>
        </div>
      </main>

      <Notifications 
        notifications={notifications}
        onRemove={removeNotification}
      />
    </div>
  )
}
