// キャッシュファイルの指定
const CACHE_NAME = 'pwa-sample-caches';
const urlsToCache = [
  "./",
  "./index.html",
  "./dist/prod/bundle.js"
];

// インストール処理
self.addEventListener('install', async event => {
  console.log('install event');
  const cache = await caches.open(CACHE_NAME);
  cache.addAll(urlsToCache);
  // event.waitUntil(
  //   caches
  //     .open(CACHE_NAME)
  //     .then(function (cache) {
  //       return cache.addAll(urlsToCache);
  //     })
  // );
});

// リソースフェッチ時のキャッシュロード処理
self.addEventListener('fetch', async event => {
  console.log('fetch event');
  console.log(event);

  const req = event.request;
  // respondWith()を使うことで、
  // 既定の fetch ハンドリングを抑止して、
  // 自分で Response用のPromiseを引数で指定できる
  event.respondWith(cacheFirst(req));


  // event.respondWith(
  //   caches
  //     .match(event.request)
  //     .then(function (response) {
  //       return response || fetch(event.request);
  //     })
  // );
});

/**
 * 指定のリクエストの結果が
 * キャッシュに存在する場合はキャッシュを返し、
 * キャッシュに存在しない場合はfetchでリクエストした結果を返す
 * 
 * 今回の場合だと、"./",　"./styles.css",　"./app.js" へのリクエストが発生するとキャッシュから表示
 * それ以外のAjaxやimgなどのリクエストの場合はfetchしてそのままのレスポンスを表示する
 *
 * @param {RequestInfo} req
 * @returns {Promise<Response>}
 */
async function cacheFirst(req) {
  const cachedResponse = await caches.match(req)
  return cachedResponse || fetch(req)
}