/* 수업일지 알림 일꾼 (2026-11-25) — 「답글 안 단 리뷰」 휴대폰 알림만 받는다.
   화면·기록을 저장해 두는 일(캐시)은 하지 않는다: 앱이 뜨고 동기화되는 방식은 예전과 똑같다 */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('push', e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (x) { d = { title: '수업일지', body: e.data ? e.data.text() : '' }; }
  e.waitUntil(self.registration.showNotification(d.title || '수업일지', {
    body: d.body || '', icon: 'icon-192.png', badge: 'icon-192.png', tag: 'review', renotify: true,
    data: { url: d.url || './#reviews' }
  }));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = new URL((e.notification.data && e.notification.data.url) || './#reviews', self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => {
    for (const c of cs) { if (c.url.startsWith(self.registration.scope) && 'focus' in c) { c.postMessage({ go: 'reviews' }); return c.focus(); } }
    return self.clients.openWindow(url);
  }));
});
