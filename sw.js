var cacheName = "v1";
self.addEventListener("install", event => {
  console.log("install event");

  event.waitUntil(
    caches.open("v1").then(cache => {
      return cache.addAll(["./offline.html", "./not-found.html", "./main.css"]);
    })
  );
});

self.addEventListener("active", event => {
  console.log("active event");
});

self.addEventListener("fetch", event => {
  console.log("fetch url", event.request.url);

  event.respondWith(
    caches.match(event.request).then(resp => {
      return (
        resp ||
        fetch(event.request)
          .then(response => {
            if (response.ok) {
              return caches.open(cacheName).then(cache => {
                cache.put(event.request, response.clone());
                return response;
              });
            }
            //404
            return caches.match("./not-found.html");
          })
          .catch(error => {
            // 500
            return caches.match("./offline.html");
          })
      );
    })
  );
});
