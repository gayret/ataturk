const CACHE_VERSION = 'ataturk-pwa-v1'
const PAGE_CACHE = `${CACHE_VERSION}-pages`
const ASSET_CACHE = `${CACHE_VERSION}-assets`
const CORE_URLS = ['/', '/manifest.webmanifest', '/apple-icon', '/icon']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(PAGE_CACHE).then((cache) => {
      return cache.addAll(CORE_URLS)
    }),
  )

  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => ![PAGE_CACHE, ASSET_CACHE].includes(key))
          .map((key) => caches.delete(key)),
      )
    }),
  )

  self.clients.claim()
})

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

self.addEventListener('fetch', (event) => {
  const { request } = event

  if (request.method !== 'GET') {
    return
  }

  const url = new URL(request.url)
  const isSameOrigin = url.origin === self.location.origin
  const isStaticAsset =
    isSameOrigin &&
    (url.pathname.startsWith('/_next/static/') ||
      url.pathname.startsWith('/images/') ||
      url.pathname.startsWith('/icons/') ||
      url.pathname.startsWith('/sounds/') ||
      url.pathname.startsWith('/data/') ||
      url.pathname.startsWith('/widget/') ||
      url.pathname.startsWith('/pwa-icons/') ||
      url.pathname === '/apple-icon' ||
      url.pathname === '/icon')

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const responseClone = response.clone()

          caches.open(PAGE_CACHE).then((cache) => {
            cache.put(request, responseClone)
          })

          return response
        })
        .catch(async () => {
          const cachedResponse = await caches.match(request)

          if (cachedResponse) {
            return cachedResponse
          }

          return caches.match('/')
        }),
    )

    return
  }

  if (!isStaticAsset) {
    return
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        void fetch(request)
          .then((response) => {
            if (!response || response.status !== 200) {
              return response
            }

            return caches.open(ASSET_CACHE).then((cache) => {
              cache.put(request, response.clone())
              return response
            })
          })
          .catch(() => undefined)

        return cachedResponse
      }

      return fetch(request).then((response) => {
        if (!response || response.status !== 200) {
          return response
        }

        const responseClone = response.clone()

        caches.open(ASSET_CACHE).then((cache) => {
          cache.put(request, responseClone)
        })

        return response
      })
    }),
  )
})
