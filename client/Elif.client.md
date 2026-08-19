## [KTZ-138-FE-033-T1](https://dygcankurt17.atlassian.net/browse/KTZ-138)

- **Durum:** In Progress
- **Jira:** `KTZ-138` — parent `KTZ-115` [FE-033]
- **Puan:** 3
- **Amaç:** Stub test sayfasını gerçek Inbox UI + navbar unread badge

### Ne hazır
- BE: GET /notifications, GET /notifications/unread-count (authentication)
- FE: features/notifications/api + types
- Navbar BellIcon (badge henüz sahte nokta)

### Kabul
- [ ] Inbox gerçek bildirimleri gösterir (test butonları yok)
- [ ] Navbar badge unread sayısını gösterir (0 ise gizli)
- [ ] Empty / loading / error

### Kapsam dışı
- mark-as-read / mark-all-read UI
- satır tıklayınca navigate
- socket
- admin notification queue
- Socket: BE emit var (KTZ-68). T1 REST only.
- Canlı badge ayrı ticket; T1 F5 / refetch ile doğru.

### Plan
1. hooks: useNotifications (list), useUnreadCount (navbar, enabled: !!user)
2. page.tsx: test butonlarını sil; result map; 3 state
3. navbar: count ile badge; Bell → /notifications; logout’ta fetch yok
4. (opsiyonel) NotificationRow — title, message, unread tint, createdAt

### API şekli
- List: { error: false, details, result: NotificationDTO[] }
- Unread: { error: false, data: { count: number } }

### Test
- Login → /notifications dolu liste
- Bildirim yok → empty
- Network kes → error
- Unread 3 → badge 3; 0 → nokta yok

Sene sonu sunum — ekran görüntüsü gerekir mi?
Evet, seçerek al. Her commit değil; hikâyeyi taşıyan 8–12 kare.

Al (şimdiden, unutursun):

Ne	Neden
Bugün: stub 3 buton
“önce API, UI yok”
Sonra: gerçek liste + empty + error
AC kanıtı
Navbar: sahte nokta → sayı
senin T1 farkın
Jira kartı / parent FE-033
süreç
15 sn ekran kaydı: login → çan → inbox
canlı demo yedeği
Alma: .env, token, Compass’ta kişisel mail, her PR diff’i.

Mantık: sunum ürün + senin katmanın. Notification modülü (BE senin, FE T1 senin) tek hikâye: model → API → stub → gerçek UI. Screenshot zaman çizelgesi; slaytta 3–4 yeter, gerisi yedek.

T1’i bitirince bir “before/after” klasörü (docs/demo/ktz-138/) yeter; md’ye path yaz, sunumda kopyala.

