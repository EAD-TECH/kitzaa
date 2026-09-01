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

## [KTZ-132-FE-033-T1](https://dygcankurt17.atlassian.net/browse/KTZ-132)

- **Durum:** In Progress
- **Jira:** `KTZ-138`
- **Puan:** 3
- **Amaç:** Overlay panel versıyonuna cevırmek ve okundu olarak ısretlemek ve deeep link olayını gerceklemek

1. Test amaclı basladıgım KTZ-138 lıst dosyasını sımdılık bosluga tasıdım
2. Onun yerıne overlay panel yapacagım ıcın drpdownmenu mantıgını kullanaak oncelıkle bır page yapıcm son bır aylık verılerı orda lıstelıycem en yenı gelenlerı de css stılllendırmesı ıle daha koyu renklı tarıhlerı olacak sekılde yapıcm
3. Bildirimin link kaynagına yonlendiricem
4. Bir aylık verileri getirmek için mongoose da degısıklık yapmam lazım

[SHADCN DOKUMANTASYON](./SHADCNDocument.md)

5. CSS Kısmını yazdıktan sonra veri manipulasyonu ıcın react table ile hooklarımı yazdım.burda bildirim i client tarafta react query ile cachleyip cagırmak next js e gore daha mantıklı cunku anlık olarak degısen bır olay oldugu ıcın clıent tarafında bıldırm olayı tetıklendı dıyelım o sıra next js server tarafta ıslem yapıyosa db guncellenmemıs halını cekebılir bu yuzden tercihm tanstack query.
6. hookkları olustururken queryKey:["notifications","unread-count"], bu sekılde tanımlamıstm daha sonra patch ıslemını yaparken mutation ıslemınde tekrar zil ikonunu guncellemek ıcın tekrar unread-coun tu cagırıp guncellememe gerek kalmadı cunku bu olay soyle : queryKey olarak tanımladıgm sey aslında notifikasyon dolabı ve bu dolabın bır rafını da unread-count olarak ayırmıstm .bu sayede mutation işleminde tanstack notification ı gordugunde otomatık olarak dolabın unread rafını da kendısı guncelleıyor
7. son olarak son 1 aylık veriler için queryfilterdan cekmeden once helperdan bır fonksıyon olusturdm ıslem yapılack tarıhten 1 ay oncesını kapayack zamanı cagırıyor.Sonrasında controllerda createdAt: { $gte: getOneMonthAgo( } bu sekılde yazarak fıltre etmıs oldum


## [KTZ-180](https://dygcankurt17.atlassian.net/browse/KTZ-180)

- **Durum:** In Progress
- **Jira:** `KTZ-180`
- **Puan:** 3
- **Amaç:**

1. Bu taskta amacım 

bu taskın amacı client tarafında socket baglantısını login ile token ı dogrulayıp baglantıyı kurmak ve logout ıle koparmak tı deilmi socket baglantısını projenın tum sayfaları haberdar olsun dıye provıder context yapısını kullanarak socket baglantımı kurdum ve bunu app altında layout a bıldırdm kı socketten herkes haberdar olsun bu task aslında gelecektıkı realtıme bıldırımlerın kullanıcıya f5 yaomadan gıtmesi için bır altyapımı olusturmaktı .



