const CACHE_NAME = 'player-v1';
const ASSETS = [
  './',
  './index.html'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});
// --- キャッシュ自動回避ハック ---
(function() {
    const currentVersion = "1.0.5"; // ← コードを書き換えたら、ここを 1.0.6 とかに変えるだけ！
    const savedVersion = localStorage.getItem('app_version');

    if (savedVersion !== currentVersion) {
        localStorage.setItem('app_version', currentVersion);
        // URLにランダムな数字を付けて、ブラウザのキャッシュを完全に破壊してリロード
        const newURL = window.location.pathname + '?v=' + Date.now();
        window.location.replace(newURL);
    }
})();
