self.addEventListener("install", () => {
  console.log("Service Worker Dakarbusinesse installé");
});

self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request));
});
