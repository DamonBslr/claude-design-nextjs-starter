// Clears a stale service worker left by another app on localhost:3000.
self.addEventListener("install", () => {
  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  event.waitUntil(self.registration.unregister())
})
