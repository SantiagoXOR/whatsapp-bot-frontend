'use client'

interface BotStats {
  total_contacts: number
  messages_sent: number
  current_contact: string
  status: string
}

interface ControlPanelProps {
  botStats: BotStats
  botRunning: boolean
  onStart: () => void
  onStop: () => void
}

export default function ControlPanel({ botStats, botRunning, onStart, onStop }: ControlPanelProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'idle': return 'bg-gray-500'
      case 'starting': return 'bg-yellow-500'
      case 'running': return 'bg-green-500'
      case 'completed': return 'bg-blue-500'
      case 'error': return 'bg-red-500'
      case 'stopped': return 'bg-orange-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'idle': return 'Inactivo'
      case 'starting': return 'Iniciando...'
      case 'running': return 'Ejecutándose'
      case 'completed': return 'Completado'
      case 'error': return 'Error'
      case 'stopped': return 'Detenido'
      default: return 'Desconocido'
    }
  }

  const progress = botStats.total_contacts > 0 
    ? (botStats.messages_sent / botStats.total_contacts) * 100 
    : 0

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <i className="fas fa-info-circle mr-2 text-primary"></i>
          Estado
        </h2>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Estado:</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(botStats.status)}`}>
              {getStatusText(botStats.status)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Contactos:</span>
            <span>{botStats.total_contacts}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Enviados:</span>
            <span>{botStats.messages_sent}</span>
          </div>
          {botStats.current_contact && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Actual:</span>
              <span className="text-sm truncate max-w-32">{botStats.current_contact}</span>
            </div>
          )}
        </div>
        
        {/* Progress Bar */}
        {botStats.total_contacts > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Progreso</span>
              <span className="text-sm font-medium">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div 
                className="progress-bar bg-primary h-2 rounded-full transition-all duration-300" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
      
      {/* Control Buttons */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <i className="fas fa-play-circle mr-2 text-primary"></i>
          Control
        </h2>
        
        <div className="space-y-3">
          {!botRunning ? (
            <button 
              onClick={onStart}
              className="btn-success w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
            >
              <i className="fas fa-play mr-2"></i>
              Iniciar Bot
            </button>
          ) : (
            <button 
              onClick={onStop}
              className="btn-danger w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
            >
              <i className="fas fa-stop mr-2"></i>
              Detener Bot
            </button>
          )}
          
          <button 
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
            onClick={() => alert('Función de prueba de conexión')}
          >
            <i className="fas fa-wifi mr-2"></i>
            Probar Conexión
          </button>
        </div>
      </div>
    </div>
  )
}
