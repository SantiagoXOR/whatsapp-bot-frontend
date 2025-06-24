'use client'

interface ConfigurationProps {
  config: {
    limit: number
    delay: number
    message: string
  }
  onChange: (config: { limit: number; delay: number; message: string }) => void
}

export default function Configuration({ config, onChange }: ConfigurationProps) {
  const handleChange = (field: keyof typeof config, value: string | number) => {
    onChange({
      ...config,
      [field]: value
    })
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <i className="fas fa-cog mr-2 text-primary"></i>
        Configuración
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Límite de Mensajes</label>
          <input 
            type="number" 
            value={config.limit}
            onChange={(e) => handleChange('limit', parseInt(e.target.value))}
            min="1" 
            max="1000" 
            className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Delay (segundos)</label>
          <input 
            type="number" 
            value={config.delay}
            onChange={(e) => handleChange('delay', parseInt(e.target.value))}
            min="5" 
            max="120" 
            className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>
      
      <div className="mt-4">
        <label className="block text-sm font-medium mb-2">Mensaje Personalizado</label>
        <textarea 
          value={config.message}
          onChange={(e) => handleChange('message', e.target.value)}
          rows={3} 
          placeholder="Hola {nombre}, este es un mensaje automático."
          className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Usa {'{nombre}'} para personalizar con el nombre del contacto
        </p>
      </div>
    </div>
  )
}
