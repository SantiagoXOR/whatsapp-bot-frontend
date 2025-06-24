# WhatsApp Bot - Frontend

Interfaz web moderna para el bot de WhatsApp construida con Next.js y diseño inspirado en shadcn/ui.

## 🚀 Características

- ✨ Interfaz moderna con Tailwind CSS
- 🌙 Modo oscuro/claro
- 📱 Diseño responsive
- ⚡ Tiempo real con Socket.IO
- 🎯 Drag & drop para archivos
- 📊 Monitoreo en vivo del bot

## 🛠️ Tecnologías

- **Next.js 14** - Framework React
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utilitarios
- **Socket.IO** - Comunicación en tiempo real
- **Lucide React** - Iconos modernos

## 🏃‍♂️ Desarrollo Local

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tu URL del backend

# Ejecutar en desarrollo
npm run dev
```

## 🌐 Despliegue en Vercel

1. Conecta este repositorio a Vercel
2. Configura la variable de entorno:
   - `NEXT_PUBLIC_BACKEND_URL`: URL de tu backend en Railway
3. Despliega automáticamente

## 📝 Variables de Entorno

```bash
NEXT_PUBLIC_BACKEND_URL=https://web-production-131e5.up.railway.app
```

## 🎯 Estado del Proyecto

- ✅ **Backend**: Desplegado en Railway
- 🔄 **Frontend**: Configurado para Vercel

## 🔗 Backend

Este frontend se conecta con el backend Flask desplegado en Railway.
Repositorio del backend: [whatsapp-bot-backend](../whatsapp-bot-backend)

## 📄 Licencia

MIT License
