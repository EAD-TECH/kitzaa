# Kitzaa – Bitirme sunumu kaynak analizi

Sunum slaytı değildir. NotebookLM’e yüklenecek ayrıntılı Türkçe kaynaktır. Slayt sırası `KITZAA_SLIDE_PLAN_TR.md` içindedir. Ekran çekimleri `KITZAA_SCREENSHOT_CHECKLIST_TR.md` içindedir.

Dil Türkçedir. Aynı içerik daha sonra Almancaya uyarlanabilir.

İnceleme: 24 Ekim 2026 kod okuması, 25 Ekim 2026’da client ve server ile yeniden hizalandı.  
Jira: `https://dygcankurt17.atlassian.net`, proje anahtarı `KTZ`.  
Git uzak adresi: `https://github.com/EAD-TECH/kitzaa-backend.git`.  
İncelenen uç: yerel dal `KTZ-219-pay-stripe-paid-event-checkout`. Bu dalın `dev` üzerinde kendine ait commit’i yoktur (`git log dev..HEAD` boş). Anlatılan kod, `dev` ile aynı geçmiştedir.

Sunum planı 39 slayttır. AI Event Search slayt 34–38’dir. Süre sabitlenmez. Yeni slayt, bu dosyada doğrulanmamış bir özellik eklemez.

## Bu sunumda anlatılanlar

Client uygulaması ve kullanıcının çağırdığı server API’si:

- Kayıt, e-posta, parola ile giriş, JWT yenileme, Google girişi, eksik profil.
- Etkinlik modeli, liste, filtre, sonsuz kaydırma, detay, katılım, oluşturma sihirbazı.
- Profil sekmeleri.
- Sosyal akış, yorum, intercepting route.
- Organizatör başvurusu ve kurum ucu.
- Doğal dilde etkinlik aramasının mimarisi.

## Bu sunumda anlatılmayanlar

Kodda duran ama bu sunumun konusu olmayan işler:

- Admin panelinin sayfaları, Kanban’ı, kullanıcı yönetimi ve onay ekranları. Onayın admin API’sinde olduğu bir cümleyle söylenir. Ekran ve soket ayrıntısı yok.
- Bildirim modeli, cron, zil ve Socket.IO bildirim akışı.
- Destek sohbeti, `SupportChat` ve Groq destek ajanı.

`client/app/[locale]/(site)/layout.tsx` hâlâ `{modal}` ve `SupportChat` basar. Modal bu sunumdadır. Destek paneli slayta alınmaz.

Stripe, checkout ve ödeme alma kodda yoktur. Jira `KTZ-219` In Progress’tir. Fiyat alanı ve “ücretli etkinliği organizatör açar” kuralı vardır. Katılım ödeme istemez.

## Kaynak sınırı

- Ürün davranışı çalışan kaynak dosyalardan okundu.
- Jira durumları Atlassian üzerinden `project = KTZ` sorgusuyla alındı. Son kayıt `KTZ-251`. Numaralar kesintisiz değildir.
- Pull request numaraları yalnızca yerel merge commit mesajlarından gelir. GitHub üzerindeki review yorumları, onaylayan kişiler ve PR açıklama metinleri açılmadı.
- Gizli ortam değişkenlerinin değerleri yazılmamıştır.
- Çalışma ağacında commitlenmemiş değişiklikler vardır: `client/messages/de.json`, `client/messages/en.json`, `server/src/configs/dbConnection.ts`. Bunlar yeni ürün özelliği olarak anlatılmamıştır.
- Eski `KITZAA_PROJECT_OVERVIEW.md` Google girişini yok sayar. Güncel kodda Google girişi vardır. Bu doküman güncel koda uyar.

---

# Bölüm 1 – Kitzaa’ya genel bakış

## 1. Kitzaa nedir?

Kitzaa, ailelerin yakınlarındaki etkinlikleri bulduğu ve organizatörlerin etkinlik yayımladığı bir keşif ve organizasyon platformudur.

Arayüzün Almanca varsayılan metni bunu doğrudan söyler:

- Ana sayfa başlığı: “Entdecke familienfreundliche Events in deiner Nähe” (`client/messages/de.json`, `HomePage.heroTitle`).
- Site açıklaması: “Veranstaltungs-Entdeckungs- und Organisationsplattform” (`Metadata.description`).
- Sayfa başlığı: `Kitzaa` (`client/app/[locale]/layout.tsx`).

Kod üç npm workspace paketinden oluşur (`package.json`): `client`, `server`, `admin`. Birlikte `npm run dev` ile `concurrently` üzerinden kalkar. Bu sunum `client` ve `server` içindir.

## 2. Hangi problemi çözmek için geliştirildi?

Aile, yaş, şehir, tarih ve fiyat gibi koşullarla etkinlik arar. Etkinliği oluşturan kişi ise kaydın yayımlanması, kapasitenin dolmaması ve katılımın tek bir yerde durmasıyla ilgilenir.

Kodun çözdüğü işler:

- Onaylı etkinlikleri listelemek, filtrelemek ve slug ile açmak.
- Yaş grubu, kategori, tarih aralığı, mekân tipi, organizatör rolü ve yarıçap ile aramak.
- Doğal dilde bir cümleyi bu filtrelere çevirip veritabanından eşleştirmek.
- Kapasiteyi atomik katılım güncellemesiyle korumak.
- Ailelerin katıldığı, kaydettiği ve oluşturduğu etkinlikleri profilde tutmak.
- Organizatör olmak için başvuru toplamak; onay sonrası kurum profili açmak.
- Etkinlik hakkında gönderi, yorum ve bildirim bırakmak.

## 3. Hedef kullanıcıları kimler?

`server/src/models/userModel.ts` üç rol tanımlar: `user`, `organizer`, `admin`. Yeni hesap `user` olur.

| Kim | Kodda karşılığı |
| --- | --- |
| Ziyaretçi | Oturum yok. Onaylı etkinlikleri, kategorileri ve herkese açık gönderileri okur. Yapay zekâ aramasını kullanır. |
| Aile / katılımcı | `role: "user"`. Profil, katılım, beğeni, kayıt, gönderi ve organizatör başvurusu. |
| Organizatör | Onaylı başvurudan sonra `organizer`. Kurum profilini görür ve günceller. Ücretli etkinliği yalnızca bu rol oluşturabilir. |
| Yönetici | `admin`. Ayrı uygulamadadır. Bu sunumda anlatılmaz. Giriş sonrası kod, yöneticiyi `NEXT_PUBLIC_ADMIN_URL` adresine gönderir. |

Arayüz dilleri `de` ve `en`. Varsayılan `de`. İngilizcede önek vardır, Almancada yoktur (`client/i18n/routing.ts`, `localePrefix: "as-needed"`).

## 4. Aileler platformda neler yapabiliyor?

Doğrulanmış kullanıcı akışları:

- İki adımlı kayıt, e-posta doğrulama mektubu, giriş, çıkış, şifremi unuttum ve şifre sıfırlama.
- Google ile giriş veya kayıt. Profil eksikse kullanıcı adı ve Almanya adresi tamamlama.
- Ana sayfada yaklaşan etkinlikler ve yapay zekâ araması.
- Etkinlik listesi, filtreler, metin araması, detay, katılma, ayrılma, beğenme ve kaydetme.
- Ücretsiz etkinlik oluşturma. Ücretli etkinlik `user` rolüne kapalıdır.
- Sosyal akış: gönderi, beğeni, yorum ve bir yoruma tek seviye yanıt.
- Profil: kişisel bilgi, fotoğraf, şifre, kendi etkinlikleri, katıldığı etkinlikler, kayıtlı etkinlikler, kendi gönderileri.
- Organizatör başvurusu. Başvuru e-posta doğrulanmadan kabul edilmez.
- Bildirim zili ve destek sohbeti kodda vardır. Bu sunumun slaytları onları anlatmaz.

## 5. Organizatörler hangi işlemleri gerçekleştirebiliyor?

Kullanıcı tarafında, admin paneline girmeden:

- Başvuru formu gönderir: `POST /api/v1/organizer-applications`.
- Kendi başvurularını okur: `GET /api/v1/organizer-applications/me`.
- Onaydan sonra kurum kaydını okur ve günceller: `GET/PUT /api/v1/institutions/me`. Bu uç `isOrganizer` ister.
- Etkinlik oluşturur, düzenler, iptal eder, kapağını yükler.
- Ücretli etkinlik fiyatını girebilir. `user` rolü bunu yapamaz (`eventController.create`).
- Katılımcı listesini ve kapasiteyi görür.

Başvurunun onaylanması, kurum belgesinin oluşması ve rolün `organizer` olması admin API’sindedir. Kullanıcı yeni rolü mevcut access token’da görmez; rol değişince model refresh token’ı temizler (`userModel` pre-save). Yeniden giriş gerekir.

## 6. Klasik etkinlik listesinden ayıran, gerçekten var olan özellikler

- Yaş grubu modeli: `0-3`, `4-6`, `7-10`, `10-14`, `parents`, `all-ages`.
- Doğal dilde etkinlik araması. Model filtre üretir; eşleştirme MongoDB sorgusudur.
- Organizatör başvurusu ve kurum profili. Herkes doğrudan organizatör olamaz.
- Kapasite, kişi sayısı ve yarış durumuna karşı atomik katılım.
- Sosyal gönderi ve iki seviyeli yorum. Gönderi etkinliğe bağlanabilir. Detay hem pencere hem gerçek adrestir.
- Almanca ve İngilizce arayüz.
- Google hesabı ve eksik profil tamamlama.
- Bildirim ve destek sohbeti kodda vardır. Bu sunumda özellik listesine konmaz.

Bunlar pazarlama cümlesi değildir; ilgili dosyalar sonraki bölümlerde gösterilir.

## 7. Örnek kullanım senaryosu

Senaryo kurgudur. Sonuç listesi gerçek veritabanı kaydı gibi sunulmamalıdır.

1. Ziyaretçi ana sayfayı açar. Hero, yapay zekâ alanı, yaklaşan etkinlikler ve organizatör bölümünü görür (`client/app/[locale]/(site)/page.tsx`).
2. “Bu hafta sonu Berlin’de 6 yaş için ücretsiz atölye” yazar. Eksik alan varsa sistem takip sorusu döner. Alanlar tamamsa onaylı etkinlikler listelenir.
3. Bir karta tıklar. Adres `/events/[slug]` olur.
4. Katılmak için giriş gerekir. Hesabı yoksa iki adımlı kayıt formunu doldurur. Başarı ekranı e-postayı doğrulamasını söyler.
5. Doğrulama bağlantısı API’dedir. Başarılı olursa tarayıcı site ana sayfasına yönlenir ve refresh çerezi yazılır.
6. Girişten sonra access token bellekte durur. Kullanıcı etkinliğe kişi sayısıyla katılır. Kontenjan doluysa 409 alır.
7. Etkinlik hakkında sosyal akışa gönderi bırakır. Gönderiye tıklayınca adres `/posts/[id]` olur ve akışın üstünde pencere açılır.
8. Daha sonra organizatör başvurusu yapar. Durum `pending` kalır. Onay bu uygulamanın ekranında verilmez.

## Kodda olup sunumda abartılmaması gerekenler

| Konu | Gerçek durum |
| --- | --- |
| Forum ve Activity | `server/README.md` planıdır. Model, controller ve route yoktur. `users.savedActivities` hâlâ `Activity` koleksiyonuna referans verir; `Activity` modeli yoktur. Bildirim ayarında `forumReplies` alanı durur. |
| Ödeme | Jira `KTZ-219` “Stripe — paid event checkout”, durum In Progress. Kaynakta Stripe, checkout veya ödeme alma yoktur. Fiyat alanı ve “ücretli etkinliği organizatör açar” kuralı vardır. Katılım ödeme istemez. |
| E-posta doğrulanmadan giriş | `authController.login` içindeki `isEmailVerified` kontrolü yorum satırındadır. Doğrulanmamış hesap giriş yapabilir. Organizatör başvurusu doğrulama ister. |
| Bekleme listesi | Jira `KTZ-240` To Do. Kodda yok. |
| Canlı harita | Detay sayfası sabit `public` görseli gösterir ve gerçek koordinatla Google Maps yol tarifi açar (`Standort.tsx`). Etkileşimli harita yoktur. Jira `KTZ-238` To Do. |
| Yakın etkinlik ayrı ekranı | `GET /events/nearby` vardır. Liste sayfası yarıçapı asıl liste ucuna (`lat`, `lng`, `radius`) verir. Jira `KTZ-236`, nearby listesinin ayrı arayüzü olmadığını To Do olarak tutar. |
| Tekrarlayan etkinlik motoru | Form `isRecurring` ve `recurrenceRule` kaydeder. İleriki tarihleri üreten bir iş bulunmadı. |
| Bire bir mesajlaşma | Jira `KTZ-218` Canceled. |
| Backend cevaplarının tamamı iki dil | Jira `KTZ-64` To Do. API mesajları karışıktır. |
| Redux | `client/package.json` içinde `@reduxjs/toolkit` ve `react-redux` vardır. Uygulama kodunda store yoktur. Oturum ve kayıtlı etkinlikler Zustand’dadır. Jira `KTZ-85` tarihsel olarak Done görünür. |

---

# Bölüm 2 – Geliştirme süreci: Jira ve GitHub

## Süreç nasıl ilerledi?

İlk commit 9 Haziran 2026: `1a0f3dd`, Duygu cankurt, `add initial commit`. Aynı gün Express iskeleti geldi (`f236c38`, `add: setup express server and middleware configuration`). 10 Haziran’da Elif kullanıcı modelini (`c61672f`, `feat(user):add user model`), Ayla şema dışa aktarımını ekledi.

Temmuz sonunda sosyal modeller, etkinlik modeli ve bildirim modelleri ayrıştı. Ağustos’ta Socket.IO ve bildirim işleri eklendi. Eylül ve Ekim’de arayüz özellikleri `dev` üzerinden birleşti. 5 Ekim 2026’da doğal dil araması, 23 Ekim 2026’da Google girişi `dev` geçmişine girdi.

Erken commit’lerde uzak depo adı `kindora` geçer (`e08d6bf`, Ayla, 1 Ekim 2026). Güncel `origin` `kitzaa-backend` deposudur. Ürün adı arayüzde Kitzaa’dır.

## Dal stratejisi

Gözlenen dallar:

- `main` ve `dev`. Özellikler `dev` üzerinde birleşir. `dev` ile `main` birbirine merge edilmiştir (`62d0d64`, `Merge branch 'main' into dev`, 13 Ekim 2026; `89e82eb`, PR #188, `dev`).
- Erken kişisel dallar: `duygu`, `ayla`, `elif`. İlk PR: #1 `duygu`, #2 `ayla`.
- Jira anahtarlı iş dalları: `KTZ-117/fe-010/...`, `KTZ-139/fe-008/...`, `KTZ-247-register-and-sign-in-with-google`.
- Kısa özellik dalları: `feat/ai-event-search-foundation`, `feat/i18n-coverage-de-en`, `event-bugs`.

Akış: iş dalı açılır, commit atılır, GitHub pull request’i merge commit’iyle birleşir. En yüksek görülen PR numarası #201’dir.

## Commit mesajı kuralları

Tek bir yazılı kural dosyası bulunmadı. Geçmişten çıkan düzen:

- Yeni işlerde Conventional Commits: `feat`, `fix`, `chore`, `refactor`, `docs`.
- Kapsam parantez içinde: `feat(auth):`, `feat(ai):`, `fix(realtime):`.
- Jira anahtarı dal adında, bazen mesajda: `[KTZ-246]`, `refs:KTZ-243`, `refs:KTZ-58`.
- Merge satırı sabittir: `Merge pull request #201 from EAD-TECH/KTZ-247-register-and-sign-in-with-google`.
- Haziran 2026 mesajları daha serbesttir: `add: setup express server...`.

## Pull request

Yerel geçmişte görülen örnekler:

| PR | Dal | Merge | Tarih |
| --- | --- | --- | --- |
| #1 | `duygu` | `496bbc1` Aylaataydir | 2026-06-09 |
| #24 | `feat/event-controller` | `557f44c` cankurtduygu | 2026-07-27 |
| #177 | `feat/ai-event-search-foundation` | `fdb7aa6` cankurtduygu | 2026-10-05 |
| #183 | `event-bugs` | `77d1319` Aylaataydir | 2026-10-07 |
| #189 | `feat/i18n-coverage-de-en` | `672ee86` cankurtduygu | 2026-10-13 |
| #196 | `KTZ-245-like_notification` | `ff72210` ELİF YÜZER | 2026-10-19 |
| #201 | `KTZ-247-register-and-sign-in-with-google` | `bbf4335` cankurtduygu | 2026-10-23 |

Review yorumu ve zorunlu onay kuralı bu kayıtlardan çıkmaz. Sunumda “PR açıp `dev`’e merge ettik” denebilir. “Her PR’de üç kişilik review vardı” denemez.

## Üç kişinin alanları

Git yazar adları ve Jira hesapları:

| Kişi | Git | Jira görünen ad |
| --- | --- | --- |
| Duygu | `Duygu cankurt`; merge’lerde `cankurtduygu` | `dyg.cankurt17` |
| Ayla | `Aylaataydir` | `Ayla Ataydir` |
| Elif | `Elif Yuzer`, `ELİF YÜZER` | `Elifyzr` |

`git shortlog -sn --all` merge’ler dahil: Elif Yuzer 216, Aylaataydir 150, cankurtduygu 126, Duygu cankurt 104, ELİF YÜZER 47. Bu sayılar özellik büyüklüğü değildir. Satır sayımı bu doküman için yeniden üretilmedi.

Entegrasyon, aynı `dev` dalına merge ve paylaşılan sözleşmelerle olur: `/api/v1`, Zod şemaları, DTO’lar, access token ve refresh çerezi. Bir kişi etkinlik API’sini, diğeri sosyal API’yi, diğeri bildirim ve soketi yazmıştır. Arayüz bunları `client/lib/api/client.ts` üzerinden çağırır.

## Somut Jira ve Git örnekleri

Katkı sütunu yalnızca Jira atananı veya commit yazarı doğrulandığında doldurulmuştur.

| Jira | Başlık ve durum | Dal | Commit veya PR | Teknik iş | Katkı |
| --- | --- | --- | --- | --- | --- |
| KTZ-6 | Create Social Post model/schema. Done | `feature/KTZ-6_create-social-post-model` uzak dalda duruyor | Model `server/src/models/postModel.ts` | Gönderi şeması ve indeksler | Jira: dyg.cankurt17 |
| KTZ-35 | Event status state machine. Done | `KTZ-35-evt-014-event-status-helper` | `server/src/helpers/eventStateMachine.ts` | `pending → approved/rejected/cancelled` geçişleri | Jira: Ayla Ataydir |
| KTZ-38 | Event geo search. Done | `KTZ-38/evt-027/event-geo-search` | `eventController.list` içinde `$geoWithin` | 2dsphere ve en fazla 50 km | Jira: Ayla Ataydir |
| KTZ-65 | Socket.IO server setup. Done | `KTZ-65-SCK-001/socket-io-server-setup-and-http-wrap` | `server/index.ts` `createServer` + `initSocket` | HTTP sunucusunun Socket.IO ile sarılması | Jira: Elifyzr |
| KTZ-93 | Register wizard UI. Done | `KTZ-93/fe-003/register-ui-rhf-zod-shadcn` | `client/features/auth/components/registerForm.tsx` | İki adım, RHF, Zod, shadcn | Jira: Ayla Ataydir |
| KTZ-94 | Login page UI. Done | `KTZ-94/fe-004/t1/login-page-ui` | `client/features/auth/components/loginForm.tsx` | Giriş formu | Jira: dyg.cankurt17 |
| KTZ-139 | API client refreshes expired access tokens. Done | `KTZ-139/fe-008/api-client-refreshes-expired-access-token` | `client/lib/api/client.ts` | 401 sonrası tek yenileme ve isteği tekrarlama | Jira: dyg.cankurt17 |
| KTZ-152 | Organizer application form UI. Done | `KTZ-152/fe-020/t-1-organizer-application-form-ui` | `OrganizerApplicationForm.tsx` | Başvuru formu | Jira: dyg.cankurt17 |
| KTZ-157 | Create-event wizard UI. Done | `KTZ-157/fe-021/create-event-ui` | `CreateEventWizard.tsx` | Üç adımlı etkinlik formu | Jira: Ayla Ataydir |
| KTZ-161 | Create post UI. Done | `KTZ-161/fe-031/t1/create-post-ui` | `CreatePostDialog.tsx` | Gönderi oluşturma arayüzü | Jira: dyg.cankurt17 |
| KTZ-247 | Register and sign in with Google. Done | `KTZ-247-register-and-sign-in-with-google` | `02c734a` Duygu cankurt, 2026-10-23. PR #201 | Google ID token, nonce, profil tamamlama | Jira: dyg.cankurt17. Commit: Duygu cankurt |
| KTZ-219 | Stripe — paid event checkout. In Progress | Yerel dal adı aynı, `dev`’den ileri commit yok | Ödeme kodu yok | Fiyat alanı var, tahsilat yok | Jira: dyg.cankurt17 |

Ek doğrulanmış işler, tabloyu şişirmemek için burada kısadır:

- `7ad4ef8`, Duygu cankurt, 2026-10-05, `feat(ai): add natural-language event search`. PR #177.
- `b5c19da`, Aylaataydir, 2026-07-27, `feat(event): implement event controller functions`. PR #24.
- `ba4989c`, Elif Yuzer, 2026-10-22, `fix(realtime): harden socket cleanup and notification synchronization`. PR #199, Jira `KTZ-249`.
- `d702768`, Elif Yuzer, 2026-10-12, destek sohbetini katlanır panele çevirir. Jira `KTZ-244`, PR #187.

## Jira hiyerarşisi ve sprint

Doğrulanan birim Jira anahtarıdır: `KTZ-157`, `KTZ-247`. Dal adlarında ara kod görülür: `KTZ-93/fe-003/...`, `KTZ-139/fe-008/...`, `KTZ-157/fe-021/...`. Bu `fe-` parçası işin arayüz grubuna bağlandığını gösterir. Epic, Story ve Task etiketlerinin Jira’daki resmi tür adları bu depodan okunmadı. Sunumda “her işin bir KTZ anahtarı ve çoğu zaman bir `fe-` veya `evt-` ara kodu var” denir. “Şu epic’in altında şu story vardı” denmez; o ağaç ekran görüntüsünde görünüyorsa karedeki adlar kullanılır, ezberlenmiş hiyerarşi uydurulmaz.

Sprint adı, sprint tarihi ve story point bu repoda tek bir takvim dosyası olarak durmaz. Kişisel notlarda puan geçen kartlar vardır. Sunum cümlesi: “İş panoda bitti, dal açıldı, PR ile `dev`’e girdi.” Sprint panosu çekilecekse karedeki sprint adı söylenir. Olmayan sprint numarası yazılmaz.

## Ekran görüntüsü önerisi

Ürün ekranı slaytta `[EKRAN GÖRÜNTÜSÜ EKLENECEK]` ile işaretlenir. Çekim listesi checklist dosyasındadır.

AI Event Search slaytlarında ekran görüntüsü yoktur. Yeni kare de, eski ana sayfa karesi de konmaz. Anlatı diyagramdadır. Sonuç kartına uydurma etkinlik adı yazılmaz.

Bildirim zili ve destek sohbeti için kare istenmez.

---

# Bölüm 3 – Proje yapısı

Kök bir npm workspace’tir. `admin` bu sunumda açılmaz.

```text
kitzaa/
├── package.json                 # workspaces: client, server, admin
├── client/                      # Next.js arayüzü
│   ├── app/
│   │   ├── [locale]/(auth)/     # login, register, verify, reset, complete-profile
│   │   ├── [locale]/(site)/     # ana sayfa, events, social, posts, profile
│   │   │   └── @modal/(.)posts/ # intercepting route
│   │   └── api/                 # geocode ve places proxy
│   ├── features/                # auth, events, social, ai, profile, institution, notifications, socket, home, organizer-application
│   ├── components/              # layout ve shadcn ui
│   ├── lib/api/                 # apiFetch, sunucu fetch, sayfalama
│   ├── i18n/                    # next-intl routing
│   ├── messages/                # de.json, en.json
│   ├── providers/
│   └── proxy.ts                 # next-intl middleware
└── server/
    ├── index.ts                 # HTTP, Mongo, Redis, cron, Socket.IO
    ├── server.ts                # Express uygulaması
    └── src/
        ├── routes/              # auth, user, ai; admin ayrı klasör
        ├── controllers/
        ├── services/
        ├── models/
        ├── middlewares/
        ├── validations/
        ├── helpers/
        ├── sockets/
        ├── jobs/
        ├── mail/
        ├── configs/
        └── agent/               # destek sohbeti ajanı
```

`client` altında `src`, `hooks`, `store`, `services` klasörleri yoktur. Hook’lar ilgili `features/*/hooks` içindedir. Zustand dosyaları `features/auth/store` ve `features/events/store` altındadır. API çağrıları `features/*/api` ve `lib/api` içindedir.

## Sorumluluk ayrımı

| Katman | Sorumluluk |
| --- | --- |
| `client/app` | URL, düzen, paralel modal yuvası |
| `client/features` | Form, liste, önbellek, özellik API’si |
| `client/lib/api/client.ts` | Access token, çerez, 401 yenileme |
| `server/server.ts` | Helmet, CORS, limit, UploadThing, Swagger, çerez, queryHandler |
| `server/src/routes` | HTTP yolu ve middleware sırası |
| Controller | İstek ve yanıt |
| Service | Yapay zekâ, arama, e-posta, bildirim, Google hesabı |
| Model | MongoDB şeması, indeks, pre-save |
| Zod | İstek gövdesi ve yapay zekâ çıktısı |

Sunum karesi: Cursor veya VS Code Explorer’da `client/app`, `client/features`, `client/lib` ve `server/src` açık; `admin` ve `node_modules` kapalı.

---

# Bölüm 4 – Frontend teknolojileri

Sürümler `client/package.json` içindedir. Aralık (`^`) yazan paketlerde kurulan yama, kilit dosyasına bakılmadan sabitlenmemiştir.

| Teknoloji | package.json | Ne işe yarar? | Kitzaa’da neden? | Nerede? | Dosya |
| --- | --- | --- | --- | --- | --- |
| Next.js | `16.3.1` | App Router, sunucu bileşeni, önbellek | Sayfa URL’i ve ilk etkinlik listesi sunucuda | Tüm sayfalar, `revalidate: 60` | `client/app`, `features/events/api/eventApi.server.ts` |
| React | `19.2.8` | Arayüz | Next 16 ile birlikte | Tüm bileşenler | `features/**` |
| TypeScript | `^5` | Derleme zamanı tipleri | API cevapları ve formlar tipli | `tsconfig.json` | feature `types/` |
| Tailwind CSS | `^4` | Biçim | Hızlı, tutarlı düzen | Sınıflar bileşenlerde | `postcss.config.mjs`, `app/globals.css` |
| shadcn/ui | `shadcn` `^4.16.2` | Kopyalanan UI bileşenleri | Form, dialog, buton | `components.json` stili `base-maia` | `client/components/ui/*` |
| Base UI | `@base-ui/react` `^1.7.0` | Headless kontrol | shadcn tabanı | Tooltip ve benzeri | `components/ui/tooltip.tsx` |
| Radix Slot | `^1.3.3` | `asChild` | Buton çokbiçimliliği | UI | `components/ui` |
| TanStack Query | `^5.101.4` | Sunucu durumu, sonsuz sayfa | Liste ve mutasyon önbelleği | Etkinlik, sosyal, bildirim | `providers/query-provider.tsx` |
| Zustand | `^5.0.14` | Küçük istemci durumu | Access token bellekte | Oturum, kayıtlı etkinlik, destek sohbeti | `features/auth/store/authStore.ts` |
| React Hook Form | `^7.85.0` | Form durumu | Çok adımlı formlar | Kayıt, giriş, etkinlik, gönderi | `registerForm.tsx` |
| Zod | `^4.4.3` | Şema | Aynı kurallar sunucuda da var | `@hookform/resolvers` | `features/**/validations` |
| next-intl | `^4.13.7` | DE/EN | Sunum dili Almanca, kod iki dilli | `[locale]`, `proxy.ts` | `i18n/routing.ts` |
| next-themes | `^0.4.6` | Açık/koyu | Tema | Kök layout | `providers/theme-provider.tsx` |
| Axios | `^1.19.0` | HTTP istemcisi | Pakette durur | Güncel `apiFetch` `fetch` kullanır | `lib/api/client.ts` |
| Tiptap | `^3.31.2` | Zengin metin | Etkinlik açıklaması | Editör | `components/ui/rich-text-editor.tsx` |
| sanitize-html | `^2.18.0` | HTML temizliği | Zengin metni basmadan önce | Çıktı | `lib/sanitizeRichText.ts` |
| UploadThing | `^7.7.4` | Dosya yükleme | Profil, etkinlik, gönderi görseli | İstemci yükleme | `lib/uploadthing.ts` |
| socket.io-client | `^4.8.3` | Gerçek zaman | Bildirim ve destek | Bağlantı token ile | `features/socket/socket.ts` |
| Sonner | `^2.0.8` | Toast | Hata ve bildirim | Kök layout | `components/ui/sonner.tsx` |
| date-fns | `^4.4.0` | Tarih | Etkinlik takvimi | Form | `EventScheduleStep.tsx` |
| lucide-react | `^1.30.0` | İkon | Hero, filtre, yapay zekâ | Birçok bileşen | `Hero.tsx` |
| Google font | `next/font` | Fraunces ve Manrope | Başlık ve gövde | Kök layout | `app/[locale]/layout.tsx` |

## Sonsuz kaydırma

Ayrı bir `react-infinite-scroll` paketi yoktur. TanStack `useInfiniteQuery` ve `IntersectionObserver` kullanılır.

Etkinlik hibrittir. `EventsPage` ilk sayfayı sunucuda, `revalidate: 60` ve `events` etiketiyle alır. `useInfiniteEvents` `initialPageParam` olarak bir sonraki sayfayı kullanır. `enabled`, ilk yanıt “sonraki sayfa yok” diyorsa kapalıdır. `queryKey` içinde URL’nin tamamı vardır. Filtre değişince liste baştan başlar. `getNextPageParam`, `details.pages.next` yoksa `undefined` döner. Listenin sonundaki gözlemci `fetchNextPage` çağırır. `isFetchingNextPage` ikinci isteği keser. Sıra `schedule.startDate`, `startTime`, `_id`. `_id` aynı günkü kartların sayfalar arasında kaybolmasını engeller.

Sosyal tam istemci listesidir. `usePosts` anahtarı `["social-posts", { city, eventId, sort, search }]`. Sayfa boyutu 5. Gözlemci `rootMargin: 300px`. Beğeni `setQueryData` ile aynı önbelleği yerinde günceller. Hata olursa önceki dizi geri yazılır.

Profildeki kendi etkinlikler, katıldıkları ve kayıtlılar da `useInfiniteQuery` kullanır. Bildirim listesi bu sunumda anlatılmaz.

## Parallel ve intercepting routes

`client/app/[locale]/(site)/layout.tsx` hem `children` hem `modal` alır. `@modal/(.)posts/[postId]/page.tsx` akışın üstüne `PostDetailDialog` koyar. Doğrudan `/posts/[postId]` tam sayfadır. Ayrıntı Bölüm 11’dedir.

### Next.js routing animasyonu

Dört kutu, iki şerit. Üst şerit akıştayken tıklamadır. Alt şerit aynı adresi yeni sekmede açmaktır.

1. **Klasör** – `[locale]`, `(site)`, `(auth)`, `@modal`. Parantez URL’ye girmez. `@modal` paralel yuvadır.
2. **Akış** – `/social` `children` içindedir. `modal` yuvası `default.tsx` ile boştur.
3. **Yakala** – `(.)posts/[postId]` aynı seviyedeki `posts` segmentini keser. URL `/posts/[id]` olur. Feed unmount olmaz. Dialog `PostDetailView` kullanır.
4. **Geri** – `router.back()`. Yakalama kalkar. `@modal/default.tsx` `null` basar.
5. **Doğrudan** – Yenileme veya yeni sekme intercept etmez. `posts/[postId]/page.tsx` tam sayfadır. Aynı görünüm bileşeni.
6. **Kaçak** – `@modal/[...catchAll]` eşleşmeyen modal URL’sini yutar.

Animasyon tıklamayla bir kutu açar. Feed kutusu hiç kaybolmaz. URL kutusu üçüncü adımda değişir.

## Öne çıkan beş frontend kararı

1. **App Router ve locale segmenti.** URL dili ve sayfa düzeni framework’tedir. Ayrı bir React Router yoktur.
2. **Özellik klasörleri.** Etkinlik, sosyal ve kimlik birbirinin içine gömülmez. Yeni iş `features/<ad>` altına girer.
3. **Sunucu durumu Query’de, oturum Zustand’da.** Access token sayfa yenilenince `/refresh` ile gelir; Query önbelleği etkinlik listesini tutar.
4. **Filtreler URL’de.** `buildEventQuery` aramayı, yaşı, tarihi ve yarıçapı query string yapar. Paylaşılabilir adres oluşur.
5. **Modal için intercepting route.** Sosyal detay hem pencere hem gerçek URL’dir. Paylaşım ve geri tuşu çalışır.

---

# Bölüm 5 – Backend teknolojileri

Sürümler `server/package.json` içindedir.

| Teknoloji | package.json | Amaç | Neden bu projede | Dosya |
| --- | --- | --- | --- | --- |
| Node.js + TypeScript | `tsx` geliştirme, `typescript` 6 serisi paketi | API süreci | Tip ve ESM (`"type": "module"`) | `index.ts`, `server.ts` |
| Express | `^5.2.1` | HTTP | Async hatalar error handler’a düşer | `server.ts` |
| MongoDB / Mongoose | `mongoose` `^9.6.3` | Kalıcı veri | Esnek etkinlik, kullanıcı, gönderi belgeleri | `src/models/*`, `configs/dbConnection.ts` |
| Redis | `redis` `^6.3.0` | Konuşma durumu | Yapay zekâ aramasının 30 dakikalık hali | `services/ai/conversationState.service.ts` |
| JWT | `jsonwebtoken` `^9.0.3` | Kimlik | Access 1 gün, refresh 7 gün | `helpers/generateJwt.ts` |
| bcrypt | `^6.0.0` | Parola özeti | Maliyet 12 | `helpers/authCredentials.ts` |
| Zod | `^4.4.3` | Girdi ve model çıktısı | Controller ham gövdeye güvenmez | `middlewares/validateBody.ts` |
| Socket.IO | `^4.8.3` | Anlık olay | Bildirim ve destek odası | `src/sockets/index.ts` |
| Nodemailer | `10.1.0` | İş e-postası | Karşılama, sıfırlama, başvuru | `src/mail/mail.service.ts` |
| UploadThing | `^7.7.4` | Görsel | `/api/uploadthing`, `/api/v1` dışında | `configs/uploadthing.ts` |
| Google Auth Library | `^11.3.1` | ID token doğrulama | Google girişinin sunucu tarafı | `services/auth/googleOAuth.ts` |
| Vercel AI SDK | `ai` `^7.0.127` | `generateText`, `Output.object` | Yapılandırılmış filtre | `services/ai/ai.service.ts` |
| Google sağlayıcı | `@ai-sdk/google` `^4.0.87` | Gemini | Etkinlik araması modeli `gemini-3.5-flash-lite` | aynı dosya |
| Groq sağlayıcı | `@ai-sdk/groq` `^4.0.52` | Metin modeli | Etkinlik risk kararı ve destek ajanı, model `openai/gpt-oss-120b` | `aiRiskAnalysisForEvenrs.ts`, `agent/run.ts` |
| Helmet, CORS, compression, cookie-parser, morgan | ilgili sürümler | Güvenlik başlığı, çerez, log | Tarayıcı kimlik bilgisiyle CORS | `server.ts` |
| express-rate-limit | `^8.5.2` | Kota | API, Google ve yapay zekâ araması ayrı limit | `server.ts`, `ai.routes.ts` |
| node-cron | `^4.6.0` | Zamanlanmış iş | Etkinlik durumu, hatırlatma | `src/jobs` |
| swagger-ui-express | `^5.0.1` | API dokümanı | `/api-docs` | `server.ts` |
| Laminar | `@lmnr-ai/lmnr` | Ajan değerlendirmesi | `npm run eval` | `agent/run.ts` |

`@ai-sdk/openai` ve `@google/generative-ai` bağımlılık listesindedir. Etkinlik araması `@ai-sdk/google` ile, risk ve destek ajanı Groq ile gider. Sunumda “her yapay zekâ Gemini” denmez.

Redis bu projede genel önbellek değildir. Anahtarı `conversation:<id>`, süresi 30 dakikadır.

---

# Bölüm 6 – Full stack sistem mimarisi

## Üst düzey

```text
Tarayıcı
  Next.js client
  Zustand access token + httpOnly refresh çerezi
        │  HTTPS JSON, credentials: include
        │  Socket.IO
        ▼
Express 5
  helmet, cors, rate limit, cookie, queryHandler
  /api/v1/...
        │
        ├── MongoDB (Mongoose)
        ├── Redis (yalnız yapay zekâ konuşması)
        ├── SMTP (Nodemailer)
        ├── UploadThing
        ├── Google ID token doğrulama
        ├── Gemini (etkinlik araması)
        └── Groq (risk kararı ve destek ajanı)

Next.js /api/geocode ve /api/places
  → Nominatim proxy (anahtar tarayıcıya konmaz)
```

## Tek istek: etkinliğe katılma

1. Kullanıcı detay kartında katıl der (`EventRegistrationCard.tsx`, `useJoinEvent`).
2. `apiFetch` `POST /api/v1/events/:id/join` gönderir. Gövde kişi sayısıdır. Başlık `Authorization: Bearer <access>`. Çerezler dahildir.
3. `server.ts` JSON, CORS, çerez ve `queryHandler` çalışır. Katılım queryHandler sonucunu kullanmaz; middleware yine de globaldir.
4. `eventRoute` sırası: `validateObjectIdParam`, sonra `authentication`, `requireCompleteProfile`, `validateBody(joinEventSchema)`.
5. `authentication` Bearer token’ı `ACCESS_KEY` ile doğrular, kullanıcıyı yükler, aktif değilse 403 verir.
6. `requireCompleteProfile` kullanıcı adı ve Almanya adresini arar. Eksikse 403.
7. `eventController.join` onaylı etkinliği ve mevcut katılımı kontrol eder. Asıl yazma `findOneAndUpdate` içindedir: kapasite ifadesi ve “bu kullanıcı yok” filtresi aynı anda aranır. `$inc` ile `capacity.current` artar.
8. MongoDB güncellenmiş belgeyi döner. `toEventDTO` ham belgeyi dışarı vermez.
9. İstemci Query önbelleğini günceller. Access token Zustand’da kalır.

## Ortak cevap biçimi

Başarı çoğunlukla `{ error: false, ... }`. Beklenen hata `CustomError(message, statusCode)`. Express 5 bunu `errorHandler`’a bırakır.

Liste uçları `res.getModelList` ve `res.getModelListDetails` kullanır. Varsayılan sayfa 1, limit 6 (`queryHandler.ts`). Sosyal istemci limit’i 5 gönderir.

## Sunum diyagramları

**Diyagram A – sistem.** Tarayıcı, Next.js, Express, MongoDB, Redis, SMTP, UploadThing, Google, Gemini, Groq. Okların üstünde protokol yazsın.

**Diyagram B – bir istek.** Katıl düğmesi → `apiFetch` → route middleware zinciri → `join` → `findOneAndUpdate` → DTO → Query. 401 dalı ayrı bir okla `/auth/refresh`’e gitsin; ayrıntı Bölüm 8’dedir.

Animasyon sırası, her tıklamada bir kutu:

1. Kart ve kişi sayısı.
2. `apiFetch`: Bearer, `credentials: include`.
3. Express: JSON, CORS, çerez, rate limit.
4. Route: ObjectId, `authentication`, `requireCompleteProfile`, Zod.
5. `findOneAndUpdate`: onaylı, kullanıcı yok, kapasite ifadesi, `$inc`.
6. `toEventDTO`.
7. Query önbelleği ve kapasite metni.
8. Kesik ok: 401 ise Bölüm 8 animasyonu, sonra aynı istek bir kez.

401 kutusunu ana yola yapıştırma. Ayrı dal olarak belirsin.

---

# Bölüm 7 – Kayıt, e-posta ve giriş

## İki adımlı kayıt

Kullanıcı `/register` görür. Sol form, geniş ekranda sağ görsel (`register/page.tsx`).

Adım 1, kişisel veri ve hesap: ad, soyad, kullanıcı adı, e-posta, telefon, parola. Adım 2, konum: ülke kodu varsayılan `+49`, eyalet, şehir, posta kodu. Posta kodu Almanya sorgusuyla şehir ve eyaleti doldurur (`useGermanZipLookup`).

İleri, yalnızca adım 1 alanlarını `form.trigger` ile doğrular. Gönderim tüm şemayı çalıştırır ve `POST /api/v1/auth/register` çağırır.

Sunucu `createUserSchema` ile gövdeyi doğrular. E-posta veya kullanıcı adı varsa 409. `User.create` parola özetini pre-save sırasında bcrypt 12 ile yazar. 24 saatlik doğrulama token’ı yalnızca özeti olarak saklanır. Mektup konusu “Willkommen bei Kitzaa”. Bağlantı API’dedir: `${API_URL}/api/v1/auth/verify-email/${rawToken}`. Mektup gidemese de hesap oluşur; hata loglanır, istek 201 döner.

Başarıda form aynı sayfada kalır ve başarı metnini gösterir. Otomatik giriş yoktur.

## E-posta doğrulama

`GET /api/v1/auth/verify-email/:token`. Token özeti ve süresi tutuyorsa `isEmailVerified = true`, token temizlenir, refresh çerezi yazılır, tarayıcı `${CLIENT_URL}/` adresine 302 ile gider. Access token bu yanıtta yoktur. Ana sayfa açılınca istemci `/refresh` ile alır.

`/verify-email` ve `/verify-email/[token]` sayfaları da vardır. Asıl mektup bağlantısı API’dir.

## Giriş

`/login`. Alanlar kullanıcı adı veya e-posta ve paroladır. Google düğmesi aynı sayfadadır.

`POST /api/v1/auth/login`. Kullanıcı yoksa veya parolası yoksa aynı 401 metni döner; hesap sayımı yapılmasın diye. Parola uyuşmazsa kod 404 ve “Invalid email or password.” döner. Aktif değilse 401. E-posta doğrulama kontrolü kapalıdır (yorum satırı).

Başarı: access token gövdede, refresh çerezi, `toUserDTO`. `useLogin` token’ı Zustand’a, kullanıcıyı Query `currentUser` anahtarına, kayıtlı etkinlikleri `EventStore`’a yazar. Yönetici ayrı uygulamaya gider. Diğer roller `/` alır.

## Çıkış

`POST /api/v1/auth/logout`, authentication zorunlu. Çerez silinir, veritabanındaki refresh token `null` olur. İstemci token’ı temizleyip `/` açar.

## Şifremi unuttum ve sıfırlama

`/forgot-password` → `POST /api/v1/auth/forgot-password`. Hesap yoksa da aynı 200 metni: “Falls die E-Mail-Adresse existiert...”. Varsa 30 dakikalık token. Bağlantı `${CLIENT_URL}/reset-password/${rawToken}`. Mektup gitmezse token geri alınır ve 500 döner.

`/reset-password/[token]` → `POST /api/v1/auth/reset-password/:token`. Süre ve özet tutmazsa 400. Parola değişir, refresh çerezi silinir. İstemci `/login` açar.

## Google

Düğme Google Identity Services bileşenidir (`GoogleSignInButton.tsx`). Akış:

1. `GET /api/v1/auth/google/nonce`. Köken izinli değilse 401. Nonce httpOnly çereze yazılır.
2. Google `credential` (ID token) üretir.
3. `POST /api/v1/auth/google` gövdesinde `credential` ve `locale`. Sunucu nonce’u çerezden okur ve siler. `verifyGoogleIdToken` imzayı ve nonce’u kontrol eder.
4. `googleSub` varsa o kullanıcı. E-posta başka hesapta varsa `409 oauth_use_password`; parola hesabı sessizce Google’a bağlanmaz.
5. Yeni kullanıcıda parola ve kullanıcı adı yoktur. `isEmailVerified` true olur. Konum boş kalabilir.
6. Refresh çerezi ve access token döner.
7. `profileCompleted === false` ise `/complete-profile`. Değilse `/`.

## Complete profile

`/complete-profile`. Form kullanıcı adı, posta kodu, şehir ve eyalet ister. `POST /api/v1/auth/complete-profile`, authentication ve `completeProfileSchema`. Posta kodu `resolveGermanAddress` ile doğrulanır. Kullanıcı adı doluysa 409. Başarıda yeni access token ve `/`.

Profil tamamı: kullanıcı adı, posta kodu, şehir, eyalet (`profileCompletion.ts`). Google kullanıcısında bunlar zorunlu alan değildir; korumalı işlem `requireCompleteProfile` ile 403 verir.

## Görseller ve sunum cümleleri

| Görsel | Ne söylenir? |
| --- | --- |
| Kayıt adım 1 | “Hesap bilgisi ile konum ayrı adım. İleri, yalnızca bu adımı Zod ile doğrular.” |
| Kayıt adım 2 | “Beş haneli Alman posta kodu şehri doldurur. Kayıt tek `POST /auth/register` ile biter.” |
| Doğrulama mektubu | “Bağlantı API’dedir. Ham token veritabanında durmaz; özeti durur.” |
| Giriş | “Access token gövdede, refresh çerezi httpOnly. Yönetici bu ekrandan ayrı uygulamaya gider.” |
| Google | “Google şifremizi görmez. Biz ID token ve nonce doğrularız. Aynı e-posta parola hesabındaysa birleştirme yok.” |
| Complete profile | “Google kaydı eksik profille oturum açar. Katılım ve başvuru profil bitmeden 403 alır.” |

---

# Bölüm 8 – Authentication ve JWT

## Token’lar nerede?

| Parça | Yer | Süre | İçerik |
| --- | --- | --- | --- |
| Access token | Zustand belleği. `localStorage` yok | 1 gün (`expiresIn: '1d'`) | `_id`, `username`, `isActive`, `role`, `institutionId` |
| Refresh token | httpOnly çerez `refreshToken` ve kullanıcı belgesinde `select: false` | 7 gün | Yalnızca `id` |
| Google nonce | Kısa ömürlü httpOnly çerez | Google akışı | Tek kullanımlık |

httpOnly çerez, sayfa betiğinin refresh token’ı okumasını engeller. Üretimde `secure: true` ve `sameSite: "none"` (`authController.refreshCookieBase`). Geliştirmede `secure: false`, `sameSite: "lax"`. Bu, arayüz ve API ayrı kökteyse çerezin gitmesi içindir (`8a83191`).

Access token her istekte `Authorization: Bearer` olur. Sunucu çerezdeki access token’a bakmaz.

## Süre dolunca

1. Korumalı istek 401 döner.
2. `apiFetch`, bellektekiler için tek bir `refreshPromise` tutar.
3. `POST /api/v1/auth/refresh`. Bu çağrıda Bearer gönderilmez ve yeniden 401 yenilemesi kapalıdır.
4. Sunucu çerezi `REFRESH_KEY` ile doğrular, belgedeki değerle karşılaştırır, hesabın aktif olduğunu kontrol eder.
5. Yeni access ve yeni refresh üretilir. Eski refresh artık geçersizdir (rotation).
6. İstemci yeni access token’ı yazar ve asıl isteği bir kez yineler.
7. Yenileme düşerse token silinir ve tarayıcı `/login` adresine gider.

`finally` bloğu `refreshPromise` değerini her çağrı sonunda temizler. Aynı anda gelen 401’ler söz verilmeden önce aynı promise’i paylaşır. İlk yenileme bitince söz silinir. Sunucu refresh token’ı döndürdüğü için geç kalan ikinci yenileme eski çerezle 401 alabilir. Tek uçuş niyeti kodda vardır; `finally` yalnızca sözün sahibine bağlı değildir.

## Backend doğrulama ve rol

`authentication` token’ı doğrular, kullanıcıyı veritabanından yeniden yükler. Token’daki rol tek başına yeterli değildir; belge vardır ve `isActive` true olmalıdır. `requireCompleteProfile` bundan sonra çalışır. Rol kapıları `permissions.ts` içindedir: `isOrganizer`, `isOwnerOrAdmin`.

Rol değişince pre-save refresh token’ı `null` yapar. Eski oturum yenilenemez.

## Google akışının kimlik parçası

Ayrıntı Bölüm 7’dedir. JWT üretimi parola girişiyle aynıdır. Fark, kullanıcının Google `sub` ile bulunması ve eksik profilde `username` alanının boş kalabilmesidir. Access token o anda boş kullanıcı adı taşır. Korumalı uçlar profil bitmeden reddeder.

## NotebookLM animasyon taslakları

Bunlar video dosyası değildir. Sunumda adım adım beliren kutulardır.

### Animasyon 1 – Access token yenileme

Kutular soldan sağa, her tıklamada bir ok.

1. **Giriş** – “Parola doğru.”
2. **Access bellek / Refresh çerez** – “Kısa ömürlü anahtar bellekte. Uzun anahtar httpOnly.”
3. **API isteği** – “Katıl. Başlıkta Bearer.”
4. **401** – “Access süresi doldu.”
5. **Tek refresh** – “Bekleyen istekler aynı yenilemeyi bekler.”
6. **Yeni çift** – “Sunucu eski refresh’i değiştirir.”
7. **İstek yinelenir** – “Kullanıcı formu yeniden göndermez.”
8. **Olmazsa giriş** – “Çerez yoksa veya eşleşmezse `/login`.”

### Animasyon 2 – Google

1. **Google düğmesi** – “Identity Services.”
2. **Nonce** – “Sunucu tek kullanımlık değer verir, çereze koyar.”
3. **ID token** – “Google imzalar. Parola bize gelmez.”
4. **Doğrulama** – “İmza, nonce, köken.”
5. **Hesap kararı** – “`sub` varsa gir. E-posta parola hesabındaysa 409.”
6. **Kitzaa JWT** – “Aynı access ve refresh.”
7. **İki çıkış** – “Profil tam ise ana sayfa. Değilse complete profile.”

---

# Bölüm 9 – Etkinlik sistemi

## Liste

`/events`. Üç sütun: masaüstünde filtre, liste, etkinlik oluştur kartı. Dar ekranda filtre `EventSheet` içindedir.

İlk sayfa sunucuda, `revalidate: 60` (`eventApi.server.ts`). Sonraki sayfalar `useInfiniteEvents`. Sıra `schedule.startDate`, sonra `startTime`, sonra `_id`. `_id` vardır çünkü aynı tarihli kayıtlar sayfalar arasında yer değiştirmesin.

Herkese açık liste yalnız `status: "approved"` döner.

## Filtre ve arama

`buildEventQuery.ts` şunları yazar:

- `search[title]`
- `filter[locationType]`
- `filter[ageRanges]`
- `filter[schedule.startDate][$gte]` ve `[$lte]`
- `category` (slug, virgülle)
- `organisator` (`user` veya `organizer`)
- `lat`, `lng`, `radius`

`queryHandler` search’i büyük-küçük harf duyarsız regex yapar. `filter` Mongo sorgusuna karışır. Kategori ve organizatör `eventController.list` içinde özel çözülür. Yarıçap 0 ile 50 km arasındaysa `$geoWithin` / `$centerSphere` uygulanır. İndeks: `location.coordinates` `2dsphere`.

## Detay

`/events/[slug]`. `read` görüntülenmeyi `$inc` ile artırır. Yalnız onaylı slug açılır. Kartta içerik, yer, düzenleyen, katılımcı avatarları ve katılım kartı vardır.

Yer kutusu sabit görsel ve Google Maps bağlantısıdır.

## Katılım, kapasite, beğeni, kayıt

Uçlar authentication ve tam profil ister:

- `POST /events/:id/join` gövde `participantCount`
- `POST /events/:id/leave`
- `POST /events/:id/like`
- `POST /events/:id/Save`
- `GET /events/my-events`, `/my-participations`, `/saved-events`
- `GET /events/:id/edit`, `PUT /events/:id`, `DELETE /events/:id` sahip veya admin

Katılım kuralları: etkinlik onaylı, kullanıcı zaten yok, `current + participantCount <= max`. Yazma tek `findOneAndUpdate`. İkinci istek 409: “This event is full or you have already joined.”

Ayrılma, katılımcının `participantCount` değerini kapasiteden düşer.

Oluşturma: `user` ücretli etkinlik açamaz. Yönetici olmayan kayıtta Groq risk analizi `approved`, `pending` veya `rejected` dönebilir. Servis hata verirse durum `pending` kalır. Durum gövdeden gelmez.

Durum makinesi `eventStateMachine.ts`: `pending`, `approved`, `rejected`, `cancelled`, `completed`. Kullanıcı kendi bekleyen veya onaylı etkinliğini iptal edebilir. Onaylı kayıt düzenlenince yeniden incelemeye dönebilir (`approved → pending` izinli).

Yaş grupları `all-ages` ile diğer grupların karışmasını şema reddeder. Fiyat `isFree` ise `null`. Para birimi EUR.

Tekrarlayan alan formda seçilir ve belgeye yazılır. Ayrı occurrence üretimi bulunmadı.

## Oluşturma sihirbazı

Sayfa `/profile/events-erstellen`. Düzenleme `/profile/events-bearbeiten/[id]`. İkisi de `CreateEventWizard`.

Üç adım, `components/reui/stepper`:

1. Ayrıntı: başlık, kategori, mekân tipi, yaş grupları, açıklama. Görseller UploadThing `eventImage`. En fazla 5 görsel, görsel başına 8 MB. İlk adres kapak olur.
2. Zaman ve yer: başlangıç, isteğe bağlı bitiş, saat, tekrar alanları, adres. Şehir değişince `/api/geocode` koordinat yazar. Koordinat şehir merkezidir. Sokak adresi Nominatim’de çoğu zaman çözülmez. Bu sınır kod yorumunda durur.
3. Ücret: `isFree` ve EUR tutarı. `user` rolü ücretli gönderemez. Sunucu aynı kuralı `eventController.create` içinde tekrarlar.

İleri, yalnız o adımın alanlarını `form.trigger` ile doğrular. Son adım `POST /api/v1/events` çağırır. Gövde durum taşımaz. Yönetici değilse Groq risk servisi `approved`, `pending` veya `rejected` dönebilir. Servis düşerse durum `pending` kalır. Başarıda `EventCreatedDialog` ve `/profile/meine-events`.

Jira `KTZ-157`, dal `KTZ-157/fe-021/create-event-ui`, atanan Ayla Ataydir. Bu arayüzdür. Model ve controller daha önceki event commit’lerindedir.

## Görseller

| Görsel | Adres | Görünmesi gerekenler |
| --- | --- | --- |
| Liste | `/events` | Kartlar, yaş şeridi, arama |
| Filtre açık | `/events` masaüstü veya sheet | Kategori, yaş, tarih, mekân, organizatör, yarıçap |
| Filtre sonucu | `/events?ageRange=7-10&category=...` | URL ve daralmış liste |
| Detay | `/events/<gerçek-slug>` | Başlık, kapasite, fiyat veya ücretsiz, katıl |
| Katılım | Aynı detay, oturum açık | Kişi sayısı ve doluysa hata. Ödeme ekranı yok |

---

# Bölüm 10 – Yapay zekâ ile etkinlik araması

Ana sayfadaki `AiEventSearch` doğal dil alır. Uç herkese açıktır: `POST /api/v1/ai/event-search`. 15 dakikada 20 istek.

## Sorumluluk bölünmesi

Model yalnız tercih çıkarır. Etkinlik seçmez.

1. İstek Zod ile doğrulanır: `message`, isteğe bağlı `conversationId`.
2. Redis’ten önceki durum okunur. Bozuk JSON silinir.
3. `generateText` + `Output.object`. Sağlayıcı Google, model `gemini-3.5-flash-lite`, sıcaklık 0, zaman aşımı 20 saniye, en fazla 2 deneme.
4. Çıktı `aiEventSearchOutputSchema`: `childAges`, `datePreference`, `specificDate`, `environment`, `timePreference`, `cities`, `maxPrice`.
5. `getMissingRequiredField` sırayla çocuk yaşı, tarih tercihi, belirli gün ve şehir arar. Biri yoksa yanıt `type: "question"` olur. Durum 30 dakika saklanır.
6. Hepsi varsa `buildAiEventSearchFilter` Mongo filtresini kurar. `searchEvents` onaylı etkinlikleri arar. `toEventDTO` döner. Konuşma silinir. Yanıt `type: "ready"`.

`maxPrice === 0` ücretsiz anlamına gelir. “today”, “tomorrow”, “weekend”, “thisMonth” Berlin tarihine göre çözülür. Model şehir veya yaş uydurmamalıdır; yönerge bunu yazar. Asıl garanti, eksik zorunlu alanda soru dönülmesi ve sorgunun kodla kurulmasıdır.

Risk analizi bu akış değildir. O, etkinlik oluştururken Groq ile çalışır.

## Örnek konuşma

Bu örnek öğretmek içindir. Kartlarda gerçek etkinlik adı yazılmamalıdır.

1. Kullanıcı: “6 yaşındaki çocuğum için bir şey arıyorum.”
2. Sistem `childAges: [6]` saklar. Tarih ve şehir yok. Soru: tarih.
3. Kullanıcı: “Bu hafta sonu, şehir fark etmez.”
4. `datePreference: "weekend"`, `cities: ["any"]`. Zorunlu alan bitti.
5. Sunucu hafta sonu aralığını ve yaş grubunu sorguya çevirir. Ücret ve mekân “any” kaldıysa filtreye girmez.
6. Ekranda bulunan onaylı etkinlikler, yoksa boş durum.

Arayüzdeki örnek cümleler `de.json` / `en.json` içindeki `example1`–`example3` anahtarlarıdır. Takip sorusu metni `questions.childAges`: “Wie alt ist dein Kind beziehungsweise wie alt sind deine Kinder?”

## Doğrulanan işlem sırası

Bu sıra `ai.controller.ts` içindeki çağrı sırasıdır. Redis, Zod ve Gemini yer değiştirmesin.

1. İstek Zod’u, Redis’ten ve Gemini’den önce. `aiEventSearchRequestSchema`: `message` 1–500 karakter, `conversationId` isteğe bağlı UUID, `.strict()`. Hata 400. Model çağrılmaz.
2. `conversationId` gövdede yoksa `randomUUID()`.
3. Redis okuma, Gemini’den önce. Anahtar `conversation:<id>`. Kayıt yoksa önceki durum `null`.
4. Kayıt varsa aynı çıktı şemasıyla `safeParse`. JSON bozuksa veya şema tutmazsa anahtar silinir ve durum `null` sayılır. Konuşma baştan başlar.
5. Redis okuma hatası 503: “AI search is temporarily unavailable.” Gemini’ye gidilmez.
6. `getAiResponse(message, previousState)`. İçeride `generateText`, `Output.object({ schema: aiEventSearchOutputSchema })`. Şema, üretim sırasında Vercel AI SDK tarafından uygulanır. Ayrı bir “önce serbest metin, sonra elle Zod” adımı yoktur.
7. Üretim hatası iki denemeden sonra 503. Mongo sorgusu yoktur.
8. `getMissingRequiredField` kodda çalışır. Sıra: `childAges`, `datePreference`, `specific` ise `specificDate`, `cities`. `environment`, `timePreference` ve `maxPrice` zorunlu değildir.
9. Eksik alan varsa durum Redis’e yazılır (`EX` 1800 saniye) ve HTTP 200 `type: "question"` döner. `searchEvents` çağrılmaz.
10. Alanlar tamsa `buildAiEventSearchFilter` Mongo sorgusunu kurar. `searchEvents` çalışır. `toEventDTO` döner. HTTP 200 `type: "ready"`.
11. Silme yalnız gövdede `conversationId` geldiyse yapılır. Silme hatası sonucu bozmaz. İlk mesajda her şey tamsa Redis’e hiç yazılmadığı için silinecek anahtar da yoktur.

## Prompt

Sistem metni `ai.service.ts` içindeki `instructions` sabitidir. Kullanıcı metni `buildPrompt` ile eklenir.

Sabit kurallar:

- Almanca, İngilizce veya Türkçe metinden tercih çıkar.
- Önceki durumdaki değeri, yeni mesaj açıkça değiştirmedikçe koru.
- Önceki durumda ve yeni mesajda olmayan tercihi uydurma.
- Bilinmeyen değer `null`. `"any"` yalnız kullanıcı tercihi olmadığını açıkça söylerse.
- `childAges` söylenen her yaşı tutar. Yaş yoksa `null`.
- `cities` söylenen her şehri tutar. Şehir yoksa `null`. Şehir fark etmezse `["any"]`.
- “today”, “tomorrow”, “weekend”, “this month”, “bu ay”, “diesen Monat” `datePreference` olur. `specificDate` bu durumda `null`.
- Adı geçen takvim günü `specific` ve `YYYY-MM-DD`. Yıl yoksa içinde bulunulan yıl. Berlin tarihi prompt’a `berlinNow()` ile yazılır.
- Belirli ama adı verilmeyen gün: `specific` ve `specificDate: null`. Kod bu yüzden tarih sorar.
- “free”, “kostenlos”, “ücretsiz” `maxPrice` 0 demektir.
- `environment`, `timePreference` ve `maxPrice` ilgisiz sözden çıkarılmaz.

Üretim ayarı: model `gemini-3.5-flash-lite`, `temperature: 0`, `maxOutputTokens: 500`, SDK `maxRetries: 0`, `timeout: 20_000`. Dış döngü en fazla 2 deneme. Paketler sunucudadır: `ai` `^7.0.127`, `@ai-sdk/google` `^4.0.87`. İstemcide bu paketler yoktur. API anahtarı kaynak dosyaya yazılmaz.

Birleştirme JavaScript’te alan alan yapılmaz. Önceki durum JSON olarak prompt’a konur. Koruma, model yönergesidir. Model bir alanı düşürürse kod, dönen şemaya güvenir. Eski JSON ile yeni JSON’u kendisi birleştirmez.

## Şema

`aiEventSearchOutputSchema`:

- `childAges`: 0–17 arası tam sayı, 1–10 eleman, ya da `null`.
- `datePreference`: `today | tomorrow | weekend | thisMonth | specific | any | null`.
- `specificDate`: gerçek `YYYY-MM-DD` ya da `null`.
- `environment`: `indoor | outdoor | online | any | null`.
- `timePreference`: `morning | afternoon | evening | any | null`.
- `cities`: 1–5 şehir, her biri en fazla 100 karakter, ya da `null`.
- `maxPrice`: 0–10000 sonlu sayı ya da `null`.

İstemci tipi `client/features/ai/types/aiEventSearch.types.ts` aynı şekli elle yazar. Ayrı bir çalışma zamanı şeması istemcide yoktur.

## Takip sorusu

Soru cümlesini Gemini yazmaz. Sunucu `missingField` anahtarını döner: `childAges`, `datePreference`, `specificDate` veya `cities`.

Arayüz `de.json` / `en.json` içinden sabit metni seçer. Almanca anahtarlar:

- `questions.childAges`: “Wie alt ist dein Kind beziehungsweise wie alt sind deine Kinder?”
- `questions.datePreference`: “Wann möchtet ihr etwas unternehmen – heute, morgen, am Wochenende oder an einem bestimmten Tag?”
- `questions.specificDate`: “An welchem Datum genau?”
- `questions.cities`: “In welcher Stadt sucht ihr?”

Kısmi filtreler soru kartında çip olarak gösterilmez. Çipler yalnız `type: "ready"` iken `getFilterChips` ile çizilir. `null` ve `"any"` çip olmaz.

## Redis

`conversationState.service.ts`. Süre her eksik turda yeniden 30 dakikadır.

- `saveConversationState`: `SET` ve `EX: 1800`. Yalnız eksik alanda.
- `getConversationState`: Gemini’den önce.
- `deleteConversationState`: başarılı aramada ve yalnız istemci bir konuşma kimliği gönderdiyse.

Konuşma kimliği tarayıcıda `useState` içindedir. `localStorage` yoktur. Sayfa yenilenirse istemci kimliği kaybeder. Redis kaydı süre dolana kadar durabilir. Yeni istek o kimliği göndermez.

Soru cevabında kimlik saklanır. `type: "ready"` olunca kimlik `undefined` yapılır. Sonraki metin yeni aramadır. Örnek cümle düğmesi de kimliği temizler. Yorum bunun nedenini yazar: bitmiş aramadan sonra model eski filtreyi korumasın.

## Deterministik sorgu

`buildAiEventSearchFilter` her zaman `status: "approved"` yazar. Varsayılan tarih, Berlin’de bugünün başından itibaren `schedule.startDate` alt sınırıdır.

- Yaş, çocukların yaş aralıklarının kesişimidir. Bantlar 0–3, 4–6, 7–10 ve 10–14’tür. Her yaşa `all-ages` de eklenir. 15–17 yalnız `all-ages` üretir. Birden fazla çocukta ortak kalan bantlar `$in` ile aranır. Eski kayıtlarda `ageRanges` yok, `null` veya boş dizi ise koşula girer.
- Şehir, büyük-küçük harf duyarsız tam eşleşmedir. `"any"` ve boş değer atılır. Yarıçap sorgusu bu yolda yoktur.
- `indoor`, `outdoor`, `online` `locationType` olur. `any` ve `null` filtreye girmez.
- `today`, `tomorrow`, `weekend`, `thisMonth` ve `specific` tarih aralığını Berlin gününe çevirip `schedule.startDate` alanının üzerine yazar. `thisMonth` ayın ilk gününden değil, bugünün başından ay sonuna kadardır. Pazar günü “weekend” yalnız o pazarı kapsar.
- Saat: sabah `05:00`–`12:00`, öğleden sonra `12:00`–`17:00`, akşam `17:00`–`23:59`. `"any"` saat filtresi koymaz.
- `maxPrice === 0` yalnız `isFree: true`. Pozitif üst sınır ücretsiz kayıtları da alır, ücretliyse `price.amount` küçük eşittir. `null` fiyat filtresi koymaz.

`searchEvents` `Event.find`, `schedule.startDate` artan, limit 20. `categoryId` ve `createdBy` populate edilir. Liste ucundaki coğrafi filtre burada kullanılmaz.

DTO’da boş `ageRanges` yanıtta `["all-ages"]` yapılır. Bu, sorguya sonradan eklenen bir koşul değildir.

## Frontend

Ana sayfa sırası `HeroSection`, `AiEventSearch`, `UpcomingEvents`, `OrganizerSection`. Bileşen `client/features/ai/components/AiEventSearch.tsx`.

- State: `message`, `conversationId`, `result`. Sunucu önbelleği yok. İstek `@tanstack/react-query` `useMutation`.
- `aiEventSearchApi` `apiFetch` ile `POST /api/v1/ai/event-search`.
- Enter gönderir. Shift+Enter satır kırar. `maxLength` 500.
- Uç kimlik istemez. Route’ta `authentication` yoktur.
- 429 için kancada sabit Almanca toast. 400 ve bilinmeyen hata: “Die Suche konnte nicht verarbeitet werden…”. Bunun dışındaki `ApiError` sunucu mesajını gösterir. 503 bu yola girer.
- `AiSearchErrorBoundary` yalnız sonuç kartlarının render hatasını tutar. Formu ve oturumu yenilemez.
- Örnek cümleler `example1`–`example3`. Bunlar prompt örneği değildir. Düğme metnidir.

## Hata tablosu

| Durum | Ne olur | Mongo |
| --- | --- | --- |
| Gövde Zod hatası | 400 | Hayır |
| 15 dakikada 20 istek üstü | 429, controller’dan önce | Hayır |
| Redis okunamaz veya yazılamaz | 503 | Hayır |
| Gemini iki denemede de düşer | 503 | Hayır |
| Zorunlu alan eksik | 200 `question` | Hayır |
| Redis’teki eski JSON bozuk | Anahtar silinir, durum `null`, akış sürer | Eksikse hayır |
| Sorgu hazır, Redis silinemez | 200 `ready`, hata loglanır | Evet |
| Kayıt yok | 200 `ready`, `events: []` | Evet |

## PDF diyagramları

Gerçek Kitzaa ekranı bu bölümde kullanılmaz. PDF hareketli animasyon taşımayabilir. Her slayt, aynı iskeletin numaralı aşamalarıdır. Ok yönü soldan sağa. Gemini kutusundan MongoDB’ye ok çizilmez.

**Aşama şeridi 1 – Uç.** Kullanıcı metni, `AiEventSearch` state, `useMutation`, hız sınırı, istek Zod’u. Gemini kutusu soluk.

**Aşama şeridi 2 – Prompt ve şema.** `instructions`, önceki JSON, yeni mesaj, Berlin tarihi, `generateText`, `Output.object`. Çıktı yedi alanlı kutudur. Serbest etkinlik adı yoktur.

**Aşama şeridi 3 – Filtre.** Yedi alan solda. Sağda `buildAiEventSearchFilter` ürünü: `status`, tarih, yaş kesişimi, şehir regex’i, saat, fiyat. Ortada “kod üretir” yazılır.

**Aşama şeridi 4 – Konuşma.** İki tur. Tur 1 eksik: Redis `SET`. Tur 2 tam: Mongo, sonra `DEL`. Soru metni `de.json` kutusundan gelir, Gemini kutusundan değil.

**Aşama şeridi 5 – Sınır.** Üst şerit Gemini’de biter. Alt şerit Express’ten MongoDB’ye gider. Kesik çizgi “model veritabanını görmez”.

## Görseller

Bu bölüm için ekran görüntüsü istenmez. Ana sayfa karesi de bu slaytlara konmaz. Kart başlığı uydurulmaz. Anlatı diyagramdadır.

---

# Bölüm 11 – Social feed

## Ne var?

- Liste: `GET /api/v1/posts` herkese açık. Şehir, etkinlik, arama ve sıralama.
- Oluşturma, güncelleme, silme, beğeni: authentication ve tam profil. Güncelleme ve silme `authorId` sahibi veya admin.
- Yorum: `GET/POST /api/v1/comments`. Yorum listesi de authentication ister (`socialPostCommentRoute` başında `router.use`).
- `parentCommentId` null ise üst yorum. Doluysa yanıt. Üst yorumun kendisi yanıtsa 400: “Cannot reply to a reply”.
- Üst yorum silinince yanıtlar da soft-delete olur.
- Beğeni bildirimi ayrı iştir (`KTZ-245`).

Gönderi görseli UploadThing `socialImage` rotasındadır.

## Sonsuz kaydırma ve önbellek

`usePosts` anahtarı `["social-posts", { city, eventId, sort, search }]`. `useInfiniteQuery`. Beğeni mutasyonu `["social-posts"]` ile başlayan sonsuz veriyi `setQueryData` ile günceller. Hata olursa önceki önbellek geri yazılır (`socialHooks.ts`).

## Parallel ve intercepting routes

```text
(site)/layout.tsx
  children = sosyal sayfa
  modal    = @modal yuvası

Akıştayken karta tıklama
  @modal/(.)posts/[postId]  → PostDetailDialog
  URL /posts/[postId] olur
  alttaki feed unmount olmaz

Doğrudan URL veya yenileme
  posts/[postId]/page.tsx    → tam sayfa PostDetailView
  intercept çalışmaz

Pencere kapanınca
  Dialog onOpenChange → router.back()
  @modal/default.tsx         → null
```

`@modal/[...catchAll]` eşleşmeyen modal URL’lerini yakalar.

## Diyagram

İki şerit. Üst şerit: feed sabit, modal belirir, URL değişir, geri ile modal gider. Alt şerit: aynı URL’yi yeni sekmede açınca tam sayfa. Ortak kutu: `PostDetailView`.

## Görseller

- `/social` birkaç gönderi ve alttaki yükleme gözlemcisi.
- Yeni gönderi penceresi.
- Gönderi modalı ve adres çubuğunda `/posts/...`.
- Yorum ve bir yanıt. Üçüncü seviye yoktur.
- Aynı URL’nin tam sayfa hali. İki kare yan yana konur.

Jira `KTZ-186` “Social experience is completed” hâlâ To Do. `KTZ-192` modal cilası, `KTZ-193` URL’de etkinlik filtresi ve `KTZ-194` kendi gönderisini düzenleme de To Do görünür. Kodda modal, düzenleme ve silme vardır (`KTZ-163`, `KTZ-165` Done). Sunumda “Jira’da açık cila maddeleri var; temel akış kodda çalışıyor” denir. Bitmiş ürün cilası iddia edilmez.

---

# Bölüm 11b – Profil

`/profile` ve alt yolları `profile/layout.tsx` ile sarılıdır. `isReady` false iken yönlendirme yoktur. Refresh bitip kullanıcı yoksa `/login`. Bu koruma dashboard sekmelerinin dışında durur. `events-erstellen` sekme çubuğu istemez ama girişi miras alır.

Dashboard sayfası kişisel kart ve `OrganizerApplicationCard` basar. Sekmeler:

- `/profile` kişisel bilgi ve başvuru kartı
- `/profile/sicherheit` şifre
- `/profile/meine-events` oluşturulan etkinlikler
- `/profile/registrierte-events` katılınanlar
- `/profile/gespeicherte-events` kaydedilenler
- `/profile/meine-beitraege` kendi gönderileri

Fotoğraf `useUploadProfileImage`, UploadThing `profileImage`, en fazla 4 MB, tek dosya. Eski avatar anahtarı silinir.

Kayıtlı etkinlik kimliği Zustand `EventStore` içindedir. Login ve refresh cevabındaki kullanıcı bu kümeyi doldurur. Çıkışta küme temizlenir. Kalp `setQueryData` değil, kümenin yeni bir `Set` kopyasıdır. Eski kümeyi yerinde değiştirmek ekranı güncellemez.

# Bölüm 12 – Organizatör işlemleri

Admin paneli olmadan.

## Başvuru

Form `OrganizerApplicationForm`. Şema kurum adı, açıklama, adres, telefon, site, kategori ve mesajı doğrular.

`POST /organizer-applications`:

- Giriş ve tam profil.
- Rol `user` değilse 403.
- E-posta doğrulanmamışsa 403.
- `pending`, `under_review` veya `needs_more_info` başvuru varsa 409.
- Groq risk özeti `aiAnalysis` alanına yazılır. Başvuru durumu kodda yine `pending` başlar. Otomatik onay yoktur.
- Kullanıcıya “Organisator-Antrag eingegangen” mektubu. Mektup hatası başvuruyu geri almaz.
- Yöneticilere bildirim gider.

`GET /organizer-applications/me` kullanıcının başvurularını yeniye göre sıralar. Kart `OrganizerApplicationCard`.

Durumlar modelde: `pending`, `under_review`, `approved`, `rejected`, `needs_more_info`. Geçmiş `statusHistory` içindedir.

Jira `KTZ-173` profilde başvuru durumu bloğunu Canceled işaretler. Başvuru durumu API’si ve kart bileşeni durur. Profilde ayrı bir “iptal edilmiş blok” varmış gibi anlatılmaz. Ekran görüntüsü çekilirken kartın gerçekten hangi sayfada göründüğü kontrol edilir.

## Kurum

Onaydan sonra `GET/PUT /institutions/me`. Middleware `isOrganizer`. Form `InstitutionForm`. Kullanıcı kendi kurumunun sahibi değilse bu uç açılmaz.

## Etkinlik yetkisi

Oturum açmış ve profili tam her kullanıcı ücretsiz etkinlik taslağı oluşturabilir. Ücretli etkinlik yalnız `organizer` (ve yönetici). Oluşan kayıt yönetici değilse risk servisinden geçer; sonuç `approved`, `pending` veya `rejected` olabilir. Hata durumunda `pending`.

Düzenleme ve iptal `isOwnerOrAdmin`. Başka kullanıcının etkinliği bu uçlardan değişmez.

Kullanıcı kendi etkinliklerini `/profile/meine-events`, katıldıklarını `/profile/registrierte-events` altında görür.

---

# Bölüm 13 – Teknik zorluklar ve kararlar

## Seçilen dört konu

### 1. Yenileme sırasında eşzamanlı istekler

**Problem.** Access bitince birden fazla istek 401 alır.  
**Zorluk.** Her biri ayrı refresh çağırırsa sunucu token’ı döndürdüğü için ikincisi eski çerezi reddeder.  
**Çözüm.** `apiFetch` tek `refreshPromise` paylaşır, refresh’te Bearer göndermez, sonra isteği bir kez yineler. Sunucu çerezi belgedeki değerle karşılaştırır.  
**Kazanım.** Kullanıcı formu yeniden doldurmaz.  
**Sınır.** `finally` sözü her çağrı sonunda siler. Bu, çok geç gelen ikinci yenilemede hâlâ yarış bırakabilir.

### 2. Etkinlik kapasitesi

**Problem.** İki katılım aynı anda son kontenjanı alabilir.  
**Zorluk.** Önce oku, sonra yaz, arada başka istek sığar.  
**Çözüm.** `findOneAndUpdate` filtresinde durum, kullanıcı ve `$expr` kapasite koşulu. Artış `$inc`.  
**Kazanım.** Yarış kaybeden istek 409 alır, kontenjan eksiye düşmez. Ayrılma da aynı katılımcıyı bularak düşer.

### 3. Google kullanıcısında opsiyonel alanlar

**Problem.** Google ad, soyad ve e-posta verir. Kullanıcı adı, parola ve Almanya adresi vermez.  
**Zorluk.** Parola hesabında bu alanlar zorunlu. Hepsini opsiyonel yapmak o hesapları bozar.  
**Çözüm.** `username` ve `password` zorunluluğu `googleSub` yoksa geçerli. `username` unique ve sparse. Konum Google kaydında zorunlu değil. `requireCompleteProfile` katılım, gönderi ve başvuruda tamamı ister. Aynı e-posta parola hesabındaysa hesap birleştirilmez.  
**Kazanım.** İki kayıt yolu aynı `users` koleksiyonunda durur. Eksik profil korumalı iş yapamaz.

### 4. Yapay zekâ aramasında durum ve deterministik sorgu

**Problem.** Tek cümlede yaş, gün ve şehir eksik kalır.  
**Zorluk.** Modeli ikinci turda unutmamak ve modeli etkinlik uydurtmamak.  
**Çözüm.** Zorunlu alan kodla seçilir. Ara durum Redis’te 30 dakika, şema ile yeniden okunur. Önceki durum prompt’a JSON olarak girer. Alanları birleştiren ayrı bir fonksiyon yoktur. Sorgu `buildAiEventSearchFilter` içindedir. Ayrıntı Bölüm 10’dadır.  
**Kazanım.** Takip sorusu mümkündür. Sonuçlar onaylı koleksiyonun gerçek kayıtlarıdır.

## Diğer doğrulanmış kararlar

- **Paralel modal.** Feed durumu kaybolmasın, URL paylaşılabilsin diye intercepting route.
- **Sonsuz liste sırası.** Etkinlik sıralamasına `_id` eklenir; aynı günkü kayıtlar sayfada tekrarlanmasın veya kaybolmasın.
- **DTO.** Ham Mongoose belgesi ve `select: false` alanlar yanıta girmez.
- **Parola sıfırlama.** Var olmayan e-posta da aynı 200’ü alır. Token’ın özeti saklanır.
- **Mongo indeksleri.** E-posta ve kullanıcı adı unique. Etkinlik koordinatı 2dsphere. Yorum `{ postId, parentCommentId, createdAt }`.
- **Form doğrulama.** İstemci Zod kullanıcıyı erken uyarır. Sunucu Zod aynı kapının arkasındadır. İstemci atlanırsa sunucu reddeder.
- **Zengin metin.** Tiptap girer, `sanitize-html` çıkar.
- **Risk analizi hatası.** Groq düşerse etkinlik `pending` kalır; istek çökmez.

---

# Bölüm 14 – Ekip katkıları

Admin paneli Elif’in ayrı sunumudur. Aşağısı client ve kullanıcı backend’i içindir. Ortak dosyaya sonradan elle dokunmak, özelliği o kişiye mal etmez.

## Duygu

Doğrulanan işler:

- Express iskeleti, 9 Haziran 2026.
- Giriş, JWT yardımcısı ve access token’ın bellekte tutulması (`KTZ-77`, `KTZ-94`, `KTZ-95`).
- Şifre sıfırlama arayüzü (`KTZ-79`, `KTZ-98`, `KTZ-99`).
- 401 yenileme istemcisi (`KTZ-139`) ve üretim çerezi (`8a83191`, 14 Ekim 2026).
- Sosyal model, DTO, controller ve arayüz (`KTZ-6`–`KTZ-30`, `KTZ-114`, `KTZ-146`, `KTZ-147`, `KTZ-161`–`KTZ-166`).
- Organizatör başvuru formu ve kurum kartı (`KTZ-145`, `KTZ-152`, `KTZ-154`, `KTZ-172`).
- Doğal dil araması, 5 Ekim 2026, `7ad4ef8`.
- Google giriş ve profil tamamlama, 23 Ekim 2026, `02c734a`, PR #201, `KTZ-247`.
- `next-intl` temeli (`KTZ-86`) ve sonraki çeviri PR’ı #189 (merge `cankurtduygu`).

`cankurtduygu` hesabı birçok pull request’i merge etmiştir. Özellik yazarı olarak `Duygu cankurt` commit’leri esas alınır.

## Ayla

- İlk kullanıcı şeması düzeltmesi ve erken `dev` birleştirmeleri.
- Kayıt sihirbazı ve kayıt API’si (`KTZ-78`, `KTZ-91`, `KTZ-93`). E-posta doğrulama sayfaları (`KTZ-81`, `KTZ-101`, `KTZ-102`).
- Navbar (`KTZ-88`).
- Etkinlik modeli, controller (`b5c19da`, PR #24), durum makinesi (`KTZ-35`), coğrafi arama (`KTZ-38`), kapak görseli (`KTZ-62`).
- Etkinlik listesi, filtre, detay, katıl, ayrıl, beğen, kaydet (`KTZ-112`, `KTZ-113`, `KTZ-123`–`KTZ-131`, `KTZ-184`).
- Etkinlik oluşturma sihirbazı (`KTZ-151`, `KTZ-155`–`KTZ-160`).
- Profil düzeni ve kullanıcının etkinlik listeleri (`KTZ-167`, `KTZ-170`, `KTZ-171`). Kişisel bilgi ve avatar görevleri Jira’da Ayla adınadır (`KTZ-168`); profil kartı ve fotoğrafın sonraki işleri Jira’da Duygu adınadır (`KTZ-233`, `KTZ-234`). Bu alan ortaktır.
- Etkinlik hata düzeltmeleri PR #180–#183, Ekim 2026, yazar Aylaataydir.

## Elif

Bildirim, soket ve destek sohbeti kodda Elif’in işidir. Slaytlar bu ayrıntıyı açmaz. Sunuma giren pay ilk kullanıcı modeli ve etkinlik risk kararıdır. Aşağıdaki liste slaytta kullanılmayan işleri de tutar, çünkü katkı kaydıdır:

- Kullanıcı modelinin ilk hali, 10 Haziran 2026.
- Bildirim modeli, liste, okunmamış sayı, yorum yanıtı ve mention (`KTZ-40`–`KTZ-47`, `KTZ-59`, `KTZ-109`, `KTZ-110`).
- Socket.IO kurulumu, kimlik, oda ve emit (`KTZ-65`–`KTZ-68`, `KTZ-150`, `KTZ-179`–`KTZ-182`).
- Hatırlatma, yakındaki etkinlik, düşük kontenjan ve organizatör özeti işleri (`KTZ-57`, `KTZ-58`, `KTZ-70`–`KTZ-72`).
- Navbar’da okunmamış rozet ve REST yedeği (`KTZ-199`).
- Destek sohbeti paneli (`KTZ-244`) ve ajan modülü (`KTZ-246`). Model Groq.
- Etkinlik oluştururken risk kararı (`KTZ-242` ile ilişkili commit `3976daf`). Başvuruya risk özeti yazılması da bu çalışmadır. Onay ekranı admin sunumuna bırakılır.
- Beğeni bildirimi (`KTZ-245`, `92c3132`).
- Gerçek zaman sertleştirmesi (`KTZ-249`, `ba4989c`).

## Ortak iş

- Kullanıcı modeli: Elif başlattı, Ayla TypeScript ve kayıtla büyüttü, Duygu Google alanlarını ekledi.
- Kimlik: Duygu giriş ve refresh, Ayla kayıt ve doğrulama mektubu, Elif soket kimliği.
- Etkinlik: Ayla CRUD ve liste, Duygu yapay zekâ araması, Elif bildirim ve risk kararı.
- Sosyal: Duygu gönderi ve yorum, Elif yorum bildirimi ve beğeni bildirimi.
- Çeviri: Duygu `de`/`en` temelini kurdu. Ayla ve Elif kendi ekranlarının metin görevlerini taşıdı (`KTZ-127`, `KTZ-131`, `KTZ-133`, `KTZ-160`).
- Birleştirme: üç hesap da PR merge etmiştir. Ortak hat `dev`.

Code review’un içeriği GitHub’dan okunmadı. Görülen kanıt merge commit’leridir.

---

# Slayt haritası

39 slayt. Ayrıntılı konuşma `KITZAA_SLIDE_PLAN_TR.md` dosyasındadır. Çekimler `KITZAA_SCREENSHOT_CHECKLIST_TR.md` dosyasındadır.

1–4 ürün ve sınır. 5–9 Jira, sprint, Git, ekip. 10 yapı. 11–12 frontend. 13–14 backend. 15–16 mimari ve istek. 17–22 kimlik ve Google. 23–27 etkinlik ve oluşturma. 28 profil. 29–31 sosyal ve routing. 32–33 başvuru ve ücret kuralı. 34–38 AI Event Search, ekran görüntüsü yok. 39 karar ve kapanış.

# Doğrulanması gerekenler

- GitHub PR açıklamaları, review yorumları ve “kim approve etti” bu dosyada yoktur.
- Jira’da bazı Done kayıtların kodu sonra değişmiştir. Örnek: `KTZ-85` Redux Done, güncel store Zustand. `KTZ-192` To Do, modal kodu var.
- `KTZ-173` Canceled. Başvuru kartının profilde mi ayrı sayfada mı durduğu slayt çekilirken ekrandan teyit edilmelidir. Bileşen vardır: `OrganizerApplicationCard.tsx`.
- Tekrarlayan etkinlik kuralının liste ve hatırlatma işlerinde dikkate alınıp alınmadığı ayrıca okunmadı. Üretim motoru bulunmadı.
- Sunucu portu kodda `process.env.PORT || 3000`. Gerçek yerel port ortam dosyasındadır ve buraya yazılmamıştır. Client Next varsayılanı 3000’dir. İkisi aynı portu seçerse çakışır.
- Axios paketi duruyor; güncel çağrı yolu `fetch`. Eski bir Axios sarmalayıcısı kalmış olabilir, sunumda kullanılan istemci `apiFetch` olmalıdır.
- `KTZ-251` bildirim linki Jira’da In Progress. Hatanın giderilip giderilmediği bu dokümanda kapatılmadı.
- Çalışma ağacındaki üç kirli dosyanın sunum davranışını değiştirip değiştirmediği diff ile ayrıca bakılmalıdır.
- E-posta şablonunun görsel hali için gerçek mektup veya `src/mail/templates/welcome.template.ts` önizlemesi gerekir. Şifre ve token kopyalanmaz.
