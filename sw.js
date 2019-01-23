importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

if (workbox){
    console.log(`Workbox berhasil dimuat`);
    workbox.precaching.precacheAndRoute([
      { url: '/', revision: '1' },
      { url: '/img/balll.png', revision: '1' },
      { url: '/img/empty_badge.svg', revision: '1' },
      { url: '/css/main.css', revision: '1' },
      { url: '/js/main.js', revision: '1' },
      { url: '/js/nav.js', revision: '1' },
      { url: '/js/api.js', revision: '1' },
      { url: '/js/idb.js', revision: '1' },
      { url: '/nav.html', revision: '1' },
      { url: '/index.html', revision: '1' },
      { url: '/nav.html', revision: '1' },
      { url: '/materialize/css/materialize.min.css', revision: '1' },
      { url: '/materialize/js/materialize.min.js', revision: '1' },
  ]);

  
  workbox.routing.registerRoute(
    /.*(?:png|gif|jpg|jpeg|svg)$/,
    workbox.strategies.cacheFirst({
      cacheName: 'imageFcache',
      plugins: [
        new workbox.cacheableResponse.Plugin({
          statuses: [0, 200]
        }),
        new workbox.expiration.Plugin({
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60,
        }),
      ]
    })
  );
  
  workbox.routing.registerRoute(
    new RegExp('https://api.football-data.org/v2/'),
    workbox.strategies.staleWhileRevalidate()
  )

  // Caching Google Fonts
  workbox.routing.registerRoute(
    /.*(?:googleapis|gstatic)\.com/,
    workbox.strategies.staleWhileRevalidate({
      cacheName: 'google-fonts-stylesheets',
    })
  );

}else{
  console.log(`Workbox gagal dimuat`);
}



self.addEventListener('push', function(event) {
  var body;
  if (event.data) {
    body = event.data.text();
  } else {
    body = 'Push message no payload';
  }
  var options = {
    body: body,
    icon: 'img/balll.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  event.waitUntil(
    self.registration.showNotification('Push Notification', options)
  );
});

// const CACHE_NAME = "JermanFootball";
// var urlsToCache = [
//   "/",
//   "/img/balll.png",
//   "/img/empty_badge.svg",
//   "/css/main.css", 
//   "/js/main.js", 
//   "/js/nav.js", 
//   "/js/api.js", 
//   "/js/idb.js", 
//   "/nav.html", 
//   "/index.html", 
//   "/materialize/css/materialize.min.css", 
//   "/materialize/js/materialize.min.js", 
// ]

// self.addEventListener("install", function(event){
//     event.waitUntil(
//         caches.open(CACHE_NAME).then(function(cache){
//             return cache.addAll(urlsToCache);
//         })
//     );
// });

// self.addEventListener("activate", function(event) {
//     event.waitUntil(
//       caches.keys().then(function(cacheNames) {
//         return Promise.all(
//           cacheNames.map(function(cacheName) {
//             if (cacheName != CACHE_NAME) {
//               console.log("ServiceWorker: cache " + cacheName + " dihapus");
//               return caches.delete(cacheName);
//             }
//           })
//         );
//       })
//     );
//   });

// self.addEventListener("fetch", function(event) {
//     event.respondWith(
//       caches
//         .match(event.request, { cacheName: CACHE_NAME })
//         .then(function(response) {
//           if (response) {
//             console.log("ServiceWorker: Mengguunakan aset dari cache: ", response.url);
//             return response;
//           }
   
//           console.log(
//             "ServiceWorker: Memuat aset dari server: ",
//             event.request.url
//           );
//           return fetch(event.request);
//         })
//     );
//   });

