const NOTIFICATION_ARRIVED = 'flutterfly:notification-arrived';

// App.jsx calls this for every notification the server pushes, so pages that show data a notification is about
// (e.g. the admin's review lists) can reload it
export const announceNotification = (notification) => {
    window.dispatchEvent(new CustomEvent(NOTIFICATION_ARRIVED, { detail: notification }));
}

// Calls callback(notification) whenever a new notification arrives. Returns a function that stops listening.
export const onNotification = (callback) => {
    const listener = (event) => callback(event.detail);
    window.addEventListener(NOTIFICATION_ARRIVED, listener);
    return () => window.removeEventListener(NOTIFICATION_ARRIVED, listener);
}
