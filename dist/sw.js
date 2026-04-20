self.addEventListener('push', function(event) {
  const options = {
    body: 'You still have tasks to finish today! 🚀',
    icon: '/logo192.png',
    badge: '/logo192.png',
    vibrate: [100, 50, 100],
    data: { url: 'https://your-vercel-link.app' }
  };

  event.waitUntil(
    self.registration.showNotification('Task Tracker Reminder', options)
  );
});