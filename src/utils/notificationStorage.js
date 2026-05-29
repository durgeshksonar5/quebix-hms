/**
 * Shared Notification Storage Utility for Quebix HMS
 */

export const getNotifications = () => {
  const data = localStorage.getItem('quebix_notifications');
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
};

export const saveNotifications = (notifications) => {
  localStorage.setItem('quebix_notifications', JSON.stringify(notifications));
  window.dispatchEvent(new Event('notificationsUpdated'));
};

export const addNotification = (notification) => {
  const notifications = getNotifications();
  
  // Prevent duplicates
  if (notification.id && notifications.some(n => n.id === notification.id)) {
    return null;
  }

  const newNotif = {
    id: notification.id || `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title: notification.title,
    message: notification.message,
    type: notification.type || 'info',
    date: notification.date || new Date().toLocaleDateString(),
    read: false
  };
  notifications.unshift(newNotif);
  saveNotifications(notifications);
  return newNotif;
};

export const markNotificationAsRead = (id) => {
  const notifications = getNotifications();
  const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
  saveNotifications(updated);
};

export const deleteNotification = (id) => {
  const notifications = getNotifications();
  const updated = notifications.filter(n => n.id !== id);
  saveNotifications(updated);
};

export const clearAllNotifications = () => {
  saveNotifications([]);
};
