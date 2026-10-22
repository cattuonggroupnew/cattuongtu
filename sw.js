// Lưu sẵn web vào máy để mở được cả khi không có mạng
const CACHE = 'cat-tuong-tu-v12';
const ASSETS = [
  './', 'index.html', 'thap-huong-3d.html', 'manifest.json', 'pwa.js',
  'fonts/thu-phap.css', 'images/chinh-dien-5.webp', 'images/dien-phat.jpg', 'images/ban-tho.jpg', 'images/textures.js',
  'lib/three.min.js', 'lib/OrbitControls.js', 'lib/RoomEnvironment.js', 'data/xam-quan-am.js', 'data/tuong-quan-am.js', 'data/tuong-phat.js', 'data/gia-nen.js', 'data/hoa-sen.js', 'images/qr-cong-duc.jpg', 'images/chinh-dien-thien-phat.webp',
  'icons/icon-192.png', 'icons/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  // nhạc nền phát theo từng đoạn (Range) → để trình duyệt tự tải
  if (req.method !== 'GET' || req.headers.has('range')) return;
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then(hit => hit || fetch(req).then(res => {
      if (res.ok || res.type === 'opaque'){ const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)) }
      return res;
    }).catch(() => caches.match('index.html')))
  );
});
