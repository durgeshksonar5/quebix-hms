import React from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, Trash2, Eye, ShieldAlert, AlertTriangle, AlertCircle, Info, HeartPulse } from 'lucide-react';
import Button from '../../components/common/Button';

export default function NotificationsPage() {
  const {
    notifications,
    persistentNotifications,
    markNotificationRead,
    clearAllNotifications,
    addToast
  } = useApp();

  // Combine dynamic alerts (low stock, ICU, etc.) and persistent system notifications
  const allNotifications = [
    ...notifications.map(n => ({ ...n, read: false, persistent: false })),
    ...(persistentNotifications || []).map(n => ({ ...n, persistent: true }))
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center pb-4 border-b border-border">
        <div>
          <h2 className="text-lg font-bold text-text">Notification Center</h2>
          <p className="text-xs text-text-muted mt-0.5">Manage system alerts, medical warnings, and announcements.</p>
        </div>
        {(persistentNotifications?.length > 0 || notifications.length > 0) && (
          <Button variant="outline" size="sm" className="text-danger border-danger/20 hover:bg-danger/5" onClick={clearAllNotifications} icon={<Trash2 className="h-4 w-4" />}>
            Clear System Alerts
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {allNotifications.length > 0 ? (
          allNotifications.map((notif) => {
            const isDanger = notif.type === 'danger' || notif.title?.toLowerCase().includes('expiry') || notif.title?.toLowerCase().includes('expired');
            const isWarning = notif.type === 'warning' || notif.title?.toLowerCase().includes('low');
            const isCritical = notif.title?.toLowerCase().includes('icu');

            return (
              <div
                key={notif.id}
                className={`p-4 rounded-2xl border transition-all flex items-start gap-4 ${
                  isDanger
                    ? 'bg-red-50/60 border-red-200 dark:bg-red-950/10 dark:border-red-900/40'
                    : isWarning
                    ? 'bg-yellow-50/60 border-yellow-200 dark:bg-yellow-950/10 dark:border-yellow-900/40'
                    : isCritical
                    ? 'bg-orange-50/60 border-orange-200 dark:bg-orange-950/10 dark:border-orange-900/40'
                    : 'bg-card border-border'
                }`}
              >
                <div className={`p-2.5 rounded-xl ${
                  isDanger
                    ? 'bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400'
                    : isWarning
                    ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-950/40 dark:text-yellow-400'
                    : isCritical
                    ? 'bg-orange-100 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400'
                    : 'bg-primary/10 text-primary'
                }`}>
                  {isDanger ? (
                    <AlertCircle className="h-5 w-5 animate-pulse" />
                  ) : isWarning ? (
                    <AlertTriangle className="h-5 w-5" />
                  ) : isCritical ? (
                    <HeartPulse className="h-5 w-5 animate-pulse" />
                  ) : (
                    <Info className="h-5 w-5" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-sm text-text block leading-none">{notif.title}</span>
                    <span className="text-[10px] text-text-muted font-medium">{notif.date || 'Today'}</span>
                  </div>
                  <p className="text-xs text-text-muted mt-2 leading-relaxed">{notif.message}</p>
                </div>

                {notif.persistent && !notif.read && (
                  <Button variant="ghost" size="sm" className="text-primary p-1" onClick={() => {
                    markNotificationRead(notif.id);
                    addToast('Notification marked as read', 'info');
                  }}>
                    <Eye className="h-4 w-4" />
                  </Button>
                )}
              </div>
            );
          })
        ) : (
          <div className="p-16 text-center bg-card border border-border rounded-2xl shadow-sm space-y-3">
            <Bell className="h-10 w-10 text-text-muted mx-auto opacity-50" />
            <h4 className="text-xs font-bold text-text-muted">No Notifications Active</h4>
            <p className="text-[10px] text-text-muted">All clear! No current medicine stock alerts or warnings logged.</p>
          </div>
        )}
      </div>
    </div>
  );
}
