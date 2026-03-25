// --- サービスワーカー強制停止・キャッシュ削除スクリプト ---

self.addEventListener('install', (e) => {
  // 新しいサービスワーカーを待機させずにすぐアクティブにする
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    // 全てのキャッシュを物理的に削除する
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          console.log('Deleting cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      // 制御を即座に開始し、クライアント（index.html）をリロードさせる準備
      return self.clients.claim();
    })
  );
});

// 何もキャッシュせず、常にネットワークへ直接見に行くようにする
self.addEventListener('fetch', (e) => {
  return; 
});
