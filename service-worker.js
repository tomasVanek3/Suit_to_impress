// sw.js

const CACHE_NAME = 'my-site-cache-v2';
const DATA_CACHE_NAME = 'data-cache-v2';

// Seznam statických souborů k uložení­ do cache během instalace
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/app.js',
  '/css.css',
  '/icons',
  '/manifest.json'
];

// Instalace Service Workera a uloženĂí statických souborů do cache
self.addEventListener('install', function(evt) {
  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Soubory jsou ukládány do cache');
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Aktivace Service Workera a odstranění­ starých cache
self.addEventListener('activate', function(evt) {
  evt.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
            console.log('Odstraňování starých cache', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Zachytávání­ a obsluha fetch událostí­
self.addEventListener('fetch', function(evt) {
  const url = new URL(evt.request.url);

  // Kontrola, zda je poĹľadavek smÄ›rovĂˇn na OpenWeatherMap API
  if (url.origin === 'https://api.openweathermap.org') {
    evt.respondWith(
      fetch(evt.request)
        .then(networkResponse => {
          // Pokud je odpovÄ›ÄŹ ĂşspÄ›ĹˇnĂˇ, uloĹľ ji do cache a vraĹĄ uĹľivateli
          if (networkResponse.status === 200) {
            return caches.open(DATA_CACHE_NAME).then(cache => {
              cache.put(evt.request, networkResponse.clone());
              return networkResponse;
            });
          }
          // Pokud nenĂ­ odpovÄ›ÄŹ ĂşspÄ›ĹˇnĂˇ, pokus se zĂ­skat data z cache
          if (caches.match(evt.request)) {
            return caches.match(evt.request);
          } else {
            return "nenalezen záznam";
          }
        })
        .catch(() => {
          // Pokud sĂ­ĹĄovĂ˝ poĹľadavek selĹľe (napĹ™. offline), vratí data z cache
          return caches.match(evt.request);
        })
    );
    return;
  }

  // Obsluha ostatní­ch požadavků (statické soubory)
  evt.respondWith(
    caches.match(evt.request).then(response => {
      return response || fetch(evt.request);
    })
  );
});