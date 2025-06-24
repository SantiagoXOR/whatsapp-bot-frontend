'use client'

interface Notification {
  id: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
}

interface NotificationsProps {
  notifications: Notification[]
  onRemove: (id: string) => void
}

export default function Notifications({ notifications, onRemove }: NotificationsProps) {
  const getNotificationStyles = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-500'
      case 'error': return 'bg-red-500'
      case 'warning': return 'bg-yellow-500'
      case 'info': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return 'fa-check-circle'
      case 'error': return 'fa-exclamation-circle'
      case 'warning': return 'fa-exclamation-triangle'
      case 'info': return 'fa-info-circle'
      default: return 'fa-bell'
    }
  }

  if (notifications.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`${getNotificationStyles(notification.type)} text-white p-4 rounded-lg shadow-lg flex items-center space-x-3 notification-enter`}
        >
          <i className={`fas ${getNotificationIcon(notification.type)}`}></i>
          <span className="flex-1 text-sm">{notification.message}</span>
          <button 
            className="text-white hover:text-gray-200 ml-2"
            onClick={() => onRemove(notification.id)}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      ))}
    </div>
  )
}
