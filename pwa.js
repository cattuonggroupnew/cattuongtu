// "Thỉnh chùa về": cài web thành ứng dụng (PWA) trên máy tính / điện thoại
(function(){
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => {});

  const css = document.createElement('style');
  css.textContent = `
    .installed [data-install]{display:none!important}
    .pwa-modal{position:fixed;inset:0;z-index:300;display:grid;place-items:center;padding:16px;background:#000a}
    .pwa-card{max-width:420px;background:linear-gradient(#fbf3dc,#f1e2bd);color:#3a1d0b;border:3px solid #b3261e;border-radius:14px;
      padding:22px 22px 18px;text-align:center;font:400 .98rem/1.6 'Be Vietnam Pro',sans-serif;box-shadow:0 20px 50px #000c}
    .pwa-card img{width:72px;height:72px;border-radius:16px;margin-bottom:8px}
    .pwa-card h3{font-family:'Thu Phap Cat Tuong',cursive;font-weight:400;font-size:1.9rem;color:#8e1b1b;margin-bottom:6px}
    .pwa-card button{margin-top:14px;padding:9px 26px;border:0;border-radius:30px;cursor:pointer;font:600 .95rem 'Be Vietnam Pro',sans-serif;
      background:linear-gradient(135deg,#f3d27a,#d4a73a);color:#3a1d05}`;
  document.head.appendChild(css);

  const standalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone;
  if (standalone) document.documentElement.classList.add('installed');

  function show(html){
    const m = document.createElement('div'); m.className = 'pwa-modal';
    m.innerHTML = `<div class="pwa-card"><img src="icons/icon-192.png" alt=""><h3>Thỉnh chùa về</h3><p>${html}</p><button>Đã hiểu</button></div>`;
    m.onclick = e => { if (e.target === m || e.target.tagName === 'BUTTON') m.remove() };
    document.body.appendChild(m);
  }

  let deferred = null;
  addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferred = e });
  addEventListener('appinstalled', () => {
    deferred = null; document.documentElement.classList.add('installed');
    show('Đã thỉnh chùa về máy 🙏<br>Biểu tượng <b>Cát Tường Tự</b> đã có trên màn hình của bạn.');
  });

  document.addEventListener('click', async e => {
    const b = e.target.closest('[data-install]'); if (!b) return;
    e.preventDefault(); e.stopPropagation();
    if (deferred){ deferred.prompt(); await deferred.userChoice; deferred = null; return }
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    if (location.protocol === 'file:') show('Hãy mở web từ địa chỉ trên mạng (trang GitHub của chùa) rồi bấm nút này để cài ứng dụng.');
    else if (ios) show('Trên iPhone / iPad: bấm nút <b>Chia sẻ</b> (ô vuông có mũi tên ⬆) ở thanh Safari, rồi chọn <b>“Thêm vào MH chính”</b>.');
    else show('Trên máy tính: bấm biểu tượng <b>cài đặt ⊕</b> ở cuối thanh địa chỉ Chrome / Edge.<br>Trên Android: mở menu <b>⋮</b> rồi chọn <b>“Cài đặt ứng dụng”</b> hoặc <b>“Thêm vào màn hình chính”</b>.');
  }, true);
})();
