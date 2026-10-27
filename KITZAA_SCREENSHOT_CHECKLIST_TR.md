# Kitzaa – Ekran görüntüsü planı

Bu liste 39 slaytlık sunum içindir. Slayt planı `KITZAA_SLIDE_PLAN_TR.md`. Teknik kaynak `KITZAA_PRESENTATION_SOURCE_TR.md`.

NotebookLM veya slayt aracı ekran uydurmasın. Her kare çalışan `client` uygulamasından, Jira’dan, GitHub’dan veya IDE’den alınsın. Slayt planında bu kareler `[EKRAN GÖRÜNTÜSÜ EKLENECEK]` diye işaretlidir.

Yerel arayüz Next varsayılanında `http://localhost:3000` olur. Almanca varsayılan olduğu için önek yoktur. İngilizce aynı yolun başına `/en` gelir.

Gizlenecekler: parola, access token, refresh çerezi, e-posta doğrulama ve sıfırlama token’ı, `GOOGLE_CLIENT_SECRET`, SMTP parolası, veritabanı bağlantı dizisi, başka kullanıcıların kişisel e-postası. Demo hesabı kullan.

Admin uygulaması, bildirim zili ve destek sohbeti bu listeye alınmadı. Onlar için kare çekilmez.

AI Event Search slaytları 34–38’dir. Bu slaytlar için ekran görüntüsü çekilmez. Eski ana sayfa karesi de bu slaytlara konmaz. Anlatı diyagramdadır.

## Çekim sırası

1. Kayıt ve giriş, çünkü oturumsuz kareler önce lazım.
2. Ana sayfa hero. Yapay zekâ için ayrı tur yok.
3. Etkinlik listesi, filtre, detay, oluşturma.
4. Sosyal akış ve modal.
5. Profil ve organizatör başvurusu.
6. IDE, Jira ve GitHub.

| Slayt | Görüntü adı | URL veya yer | Yapılacak işlem | Görünmesi gerekenler | Anlattığı teknik konu | İkinci kare | Gizle |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Ana sayfa hero | `/` | Hero tam görünsün. Kaydırma | “Entdecke familienfreundliche Events…”, navbar | Ürünün ne olduğu | Hayır | İstenmiyorsa oturumu kapat |
| 4 | Bitmeyen ödeme işi | Jira `KTZ-219` | In Progress kartını aç | Anahtar, başlık, durum | Stripe yok | İsteğe bağlı: `KTZ-240` To Do | E-posta |
| 5 | Jira panosu | `dygcankurt17.atlassian.net`, proje KTZ | Done sütunu | `KTZ-93`, `KTZ-139`, `KTZ-157`, `KTZ-247` | Anahtar ve iş | Hayır | E-posta. İsim yeter |
| 6 | Sprint veya dallar | Jira sprint panosu ya da IDE dal listesi | Karede yazan sprint adını kullan. Yoksa dal listesi | `main`, `dev`, bir `KTZ-` dalı | Süreç | Hayır | Olmayan sprint adı yazma |
| 7 | PR #201 | `github.com/EAD-TECH/kitzaa-backend/pull/201` | Başlık ve merge | Dal `KTZ-247-register-and-sign-in-with-google` | PR ile `dev` | Hayır | Boş review uydurma |
| 8 | Dal geçmişi | Git Graph veya `git log --oneline --graph` | `dev` ve PR #201 | Merge satırı | İkinci iz | İsteğe bağlı: PR #177 | Başka depo sekmesi |
| 10 | Proje ağacı | Explorer | `client/app`, `client/features`, `server/src` | Klasör adları | Monorepo | Hayır | `admin`, `node_modules`, `.env` kapalı |
| 11 | Frontend paketleri | `client/package.json` | Next, React, TanStack, Zustand, Zod, next-intl | Sürümler | Frontend slaytı | Hayır | — |
| 12 | Filtre adresi | `/events` ve bir filtre | Adres çubuğu görünsün | Query string | URL kararı | Hayır | — |
| 13 | Backend paketleri | `server/package.json` | express, mongoose, redis, jsonwebtoken, ai, uploadthing | Sürümler | Backend slaytı | Hayır | — |
| 16 | Katıl düğmesi | `/events/<gerçek-slug>`, oturumlu | Kişi sayısı ve katıl | Kapasite | İstek yaşam döngüsü | Hayır | Ödeme ekranı yok |
| 17 | Kayıt adım 1 | `/register` | Boş form | Ad, e-posta, parola, adım 1 | İki adım | Hayır | Parola yazma |
| 17 | Kayıt adım 2 | `/register` | Adım 1 geçerli, ileri | Posta kodu, şehir, eyalet | Almanya adresi | İsteğe bağlı: geçersiz posta kodu | Gerçek adres gerekmez |
| 18 | Doğrulama mektubu | E-posta istemcisi | Kitzaa karşılama | Konu “Willkommen bei Kitzaa” | Ham token saklanmaz | Hayır | Token’lı URL’yi kırp |
| 19 | Giriş | `/login` | Boş form | Kullanıcı adı veya e-posta, parola, Google | Access ve çerez | Hayır | Parola yok |
| 21 | Google hesap seçici | `/login`, düğme | Google penceresi | Hesap seçimi | ID token ve nonce | Hayır | Gerçek e-postayı kapat |
| 22 | Complete profile | `/complete-profile` | Yeni Google kullanıcısı | Kullanıcı adı ve posta kodu | `requireCompleteProfile` | Hayır | — |
| 24 | Etkinlik listesi | `/events` | Kayıtsız bak | Kart, yaş şeridi | Onaylı liste | Hayır | — |
| 24 | Filtre | `/events` | Kenar çubuğu veya sheet | Kategori, tarih, mekân, yarıçap | URL ve `$geoWithin` | Evet: uygulanmış URL | Konum iznini reddet |
| 25 | Sonsuz kaydırma | `/events` | Listenin sonu | Gözlemci veya sonraki kartlar | Hibrit sayfa | Hayır | — |
| 26 | Etkinlik detayı | `/events/<gerçek-slug>` | Onaylı kayıt | Başlık, kapasite, yer, katıl | Slug ve DTO | Hayır | Sabit görseli canlı harita diye anlatma |
| 27 | Etkinlik oluştur | `/profile/events-erstellen` | Adım göstergesi | Üç adım | Sihirbaz | İsteğe bağlı: ücret adımı | Stripe ekranı yok |
| 28 | Profil | `/profile` | Giriş yapmış demo | Kart ve sekmeler | Profil alanı | Hayır | Telefon ve e-postayı gerekmiyorsa kapat |
| 29 | Sosyal akış | `/social` | Birkaç demo gönderi | Kart, beğeni, yorum sayısı | Feed | Hayır | Başkasının özel bilgisi |
| 30 | Yeni gönderi | `/social` | Oluştur penceresi | Metin ve görsel alanı | `POST /posts` | Evet: sayfa sonu | Kişisel fotoğraf olmasın |
| 31 | Gönderi modalı | `/social` kartı | Adres `/posts/<id>`, feed arkada | Dialog ve URL | Intercepting route | Evet: aynı URL yeni sekmede tam sayfa | — |
| 31 | Yorum | Modal veya tam sayfa | Bir üst yorum ve bir yanıt | İki seviye | `parentCommentId` | Hayır | — |
| 32 | Başvuru formu | `/profile` | Kartın formu, göndermeden | Kurum alanları | `POST /organizer-applications` | Varsa eski demo durum kartı | Sunumda yeni başvuru yazmamaya çalış |
| 33 | Kurum veya ücret | Onaylı demo veya oluşturma adımı 3 | Kurum yoksa ücret adımı | Kurum adı veya EUR alanı | `isOrganizer` ve tahsilat yok | Hayır | Onaylı hesap yoksa kurum karesini atla |
| 34–38 | AI Event Search | Çekim yok | Diyagram | Numaralı aşama | Model veritabanını görmez | Hayır | Ekran karesi koyma |
| 39 | Kapanış | Çekim yok | Dört karar kutusu | Yenileme, kapasite, Google, yapay zekâ | Karar | Hayır | — |

Slayt 2, 3, 9, 14, 15, 20, 23, 34, 35, 36, 37, 38 ve 39 diyagramdır. Onlar için ürün ekranı şart değildir. AI slaytlarına ana sayfa görüntüsü de konmaz.

## Çekim notları

- Kayıt ve şifre sıfırlama gerçek e-posta üretiyorsa demo kutusu kullan. Token URL’si slayta tam yazılmasın.
- Katılım veritabanına yazar. Sunum hesabı dışında kayıt oluşturma.
- `KTZ-219` için ödeme ekranı arama. Yok.
- Harita karesi çekilecekse sabit görsel ve “Google Maps’te aç” birlikte görünsün.
- İki dil gerekirse `/events` ve `/en/events` küçük ikinci kare olur. Zorunlu değil.
- Sprint panosu yoksa slayt 6 dal listesiyle çekilir. Sprint adı uydurulmaz.
