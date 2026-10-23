// Lưu web vào máy để mở được cả khi không có mạng.
// Lúc cài chỉ lưu sẵn phần khung nhẹ; mẫu 3D, ảnh, nhạc (hàng chục MB) được lưu dần khi trang thật sự tải tới
// (xem 'fetch' bên dưới) — tránh bắt máy người xem tải hết một lúc ngay lần đầu vào.
const CACHE = 'cat-tuong-tu-v27';
const ASSETS = [
  './', 'index.html', 'trang-chu.html', 'thap-huong-3d.html', 'manifest.json', 'pwa.js',
  'fonts/thu-phap.css', 'lib/three.min.js', 'lib/OrbitControls.js', 'lib/RoomEnvironment.js',
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
  const save = res => { if (res.ok || res.type === 'opaque'){ const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)) } return res };
  // trang web (mở trang, bấm link): lấy bản mới trên mạng trước để sửa trang là người xem thấy ngay;
  // mất mạng mới dùng bản đã lưu
  if (req.mode === 'navigate'){
    e.respondWith(fetch(req).then(save).catch(() => caches.match(req, { ignoreSearch: true }).then(hit => hit || caches.match('index.html'))));
    return;
  }
  // mẫu 3D, ảnh, thư viện: dùng bản đã lưu nếu có (nặng, ít đổi; đổi CACHE để làm mới)
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then(hit => hit || fetch(req).then(save).catch(() => caches.match('index.html')))
  );
});
