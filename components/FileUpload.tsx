'use client'

import { useState, useRef } from 'react'

interface Contact {
  nombre: string
  telefono: string
  mensaje?: string
}

interface FileUploadProps {
  onFileUploaded: (filename: string, contactCount: number) => void
  currentFile: string | null
  onFileRemoved: () => void
}

export default function FileUpload({ onFileUploaded, currentFile, onFileRemoved }: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [contactPreview, setContactPreview] = useState<Contact[]>([])
  const [fileStats, setFileStats] = useState<{ name: string; count: number } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      processFile(files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      processFile(files[0])
    }
  }

  const processFile = async (file: File) => {
    setUploading(true)
    
    const formData = new FormData()
    formData.append('file', file)

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'
      const response = await fetch(`${backendUrl}/api/upload`, {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (result.success) {
        setFileStats({ name: result.filename, count: result.contact_count })
        setContactPreview(result.preview || [])
        onFileUploaded(result.filename, result.contact_count)
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      alert('Error al subir archivo: ' + (error as Error).message)
    } finally {
      setUploading(false)
    }
  }

  const removeFile = () => {
    setFileStats(null)
    setContactPreview([])
    onFileRemoved()
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <i className="fas fa-upload mr-2 text-primary"></i>
        Archivo de Contactos
      </h2>
      
      {/* Drag & Drop Area */}
      <div 
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${
          dragActive ? 'drop-zone-active' : 'border-border hover:border-primary'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {!uploading ? (
          <div>
            <i className="fas fa-cloud-upload-alt text-4xl text-muted-foreground mb-4"></i>
            <p className="text-lg font-medium mb-2">Arrastra tu archivo aquí</p>
            <p className="text-sm text-muted-foreground mb-4">o haz clic para seleccionar</p>
            <button className="btn-primary bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
              <i className="fas fa-folder-open mr-2"></i>
              Seleccionar Archivo
            </button>
            <div className="mt-4 text-xs text-muted-foreground">
              Formatos soportados: .xlsx, .xls, .csv (máx. 16MB)
            </div>
          </div>
        ) : (
          <div>
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-sm text-muted-foreground">Procesando archivo...</p>
          </div>
        )}
      </div>
      
      <input 
        ref={fileInputRef}
        type="file" 
        className="hidden" 
        accept=".csv,.xlsx,.xls"
        onChange={handleFileSelect}
      />
      
      {/* File Info */}
      {fileStats && (
        <div className="mt-4 p-4 bg-accent rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <i className="fas fa-file-excel text-green-500 text-xl"></i>
              <div>
                <p className="font-medium">{fileStats.name}</p>
                <p className="text-sm text-muted-foreground">{fileStats.count} contactos</p>
              </div>
            </div>
            <button 
              onClick={removeFile}
              className="text-destructive hover:text-destructive/80"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
      )}
      
      {/* Contact Preview */}
      {contactPreview.length > 0 && (
        <div className="mt-4">
          <h3 className="font-medium mb-3">Vista Previa de Contactos</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {contactPreview.map((contact, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-background rounded border">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <i className="fas fa-user text-primary-foreground text-xs"></i>
                  </div>
                  <div>
                    <p className="font-medium text-sm">{contact.nombre}</p>
                    <p className="text-xs text-muted-foreground">{contact.telefono}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
