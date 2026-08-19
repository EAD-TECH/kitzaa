## [KTZ-136-ADMİN-ROUTE-GUARD](https://dygcankurt17.atlassian.net/browse/KTZ-136)

- **Durum:** In Progress
- **Jira Kartı:** `KTZ-136`
- **Mimari Kararlar & Ne Yaptım:**

1. Client tarafında yaptıgım route kısmını degıstırdm.Admin klasoru actıgım için.Dolayısyla yollar degıstı.
2. admin ve (admin) klasorlerı clıent tarafındaydı ,admın katmanında routta gereksiz durdugu ıcın kaldırdm
3. Kök layout’tan font / QueryProvider kalıbını aldım, üstüne tüm app’i RequireAuth roles="admin" ile sardım. Client kök layout tüm siteyi kilitlemez. : chrome kopyası + admin-only guard.
4. client tarafında olusturdugum api ve types dosyalarını tasıdım.
5. Admin kisinin login olabilmesi için [](./providers/query-provider.tsx)

- Backend'e gidip gizli çerezlerdeki (cookie) Refresh Token'ı kullanarak "Bu adam sayfayı yeniledi ama hala bizden biri mi? Öyleyse bana yeni bir Access Token ver" demek için
  setAccessToken: varsaZustand buraya kaydeder
  En alttaki return bloğu ise, oluşturduğumuz bu Query Client (Veri Çekme Motoru) altyapısını bir battaniye gibi tüm çocuk bileşenlerin ({children}) üzerine örterek onların React Query özelliklerini kullanabilmesini sağlar.
- Login client’ta; admin’e gelince access token memory’de yok. HttpOnly refresh cookie (CORS + credentials: "include") ile POST /api/v1/auth/refresh çağrılıyor. Bu yüzden bu dosya 136’nın parçası: guard’ın “kim var?” sorusunu cevaplamak.

5. Test için config dosyalar olusturdm.Test sırasında Next.js ve Typescript hatalarından kaynaklı

- [](./features/auth/components/RequireAuth.tsx) burda ben test kosullarımı yazdım aslında kullanıcıcn rolune gore senaryolarım
  isReady: false (Sistem henüz hazır değil): Zustand ilk ayağa kalktığında bu bayrak kapalıdır. Güvenlik şefine (RequireAuth) şu mesajı verir: "Bekle! Token null görünüyor olabilir ama belki kullanıcı F5 atmıştır. Ben şu an arka planda Backend'e soruyorum (refresh). Ben sana haber verene kadar kapıyı kimseye açma, kimseyi de kovma!" (Testin 1. senaryosu isReady: false iken ekrana hiçbir şey basmadm, sebebi tam olarak budur).
- setIsReady (Telsiz Düğmesi): Bu fonksiyon, Resepsiyonun (QueryProvider) güvenlik şefine telsizden haber verme tuşudur.
  setIsReady(true) (Sistem Hazır!): QueryProvider backend'den cevabı alır (olumlu veya olumsuz). Yeni token'ı kasaya koyar ve en son .finally() bloğunda telsize basıp setIsReady(true) der. Yani şefe: "İşim bitti, herkesin gerçek kimliği kasada güncellendi. Artık kurallarını uygulayabilirsin!" der.
  Bu mantıga gore test dosyamda Zustandın Nextin ve JSDOM’da window.location.assign güvenilir değil diye redirectExternal sarmalayıp onu mock’ladım. Zustand + useCurrentUser da mock.
 FE kapı UX; asıl isAdmin backend’de.
