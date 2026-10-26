# Kitzaa – 39 slaytlık sunum planı

Dil: Türkçe. Süre sabit değildir. Slayt sayısı 39’dur. AI Event Search beş slayttır (34–38). Yeni slayt, `KITZAA_PRESENTATION_SOURCE_TR.md` içinde doğrulanmamış özellik eklemez.

Kapsam: `client` ve kullanıcının çağırdığı `server` API’si. Admin panelinin teknik ayrıntısı, bildirimler ve destek sohbeti yok. Stripe tamamlanmış özellik gibi anlatılmaz. AI Event Search slaytlarında ekran görüntüsü yoktur.

Her slaytta en fazla dört madde. Konuşmacı notu slayta yazılmaz.

---

## Slayt 1 – Kitzaa nedir?

**Ana mesaj:** Kitzaa, ailelerin yakınındaki etkinlikleri bulduğu ve organizatörlerin bu etkinlikleri yayımladığı platformdur.

**Maddeler:**

- Aile arar, katılır, kaydeder.
- Organizatör önce başvurur.
- Arayüz Almanca, İngilizce de vardır.
- Üç workspace vardır. Bu sunum client ve server.

**Görsel:** `[EKRAN GÖRÜNTÜSÜ EKLENECEK]` Ana sayfa hero, `/`. Metin: “Entdecke familienfreundliche Events in deiner Nähe”.

**Konuşmacı:** “Kitzaa bir ilan panosu değildir. Aile yaşına ve şehrine göre etkinlik bulur. Etkinliği açan kişi önce başvurur. Bugün bu iki yolun kodunu göstereceğiz. Yönetim panelini açmayacağız.”

---

## Slayt 2 – Problem ve hedef kitle

**Ana mesaj:** Aynı kayıtta arayan aile ile yayımlayan kişi farklı yetkilere sahiptir.

**Maddeler:**

- Ziyaretçi onaylı etkinliği ve gönderiyi okur.
- `user` katılır, gönderi yazar, başvurur.
- `organizer` kurumunu günceller ve ücretli etkinlik açabilir.
- `admin` ayrı uygulamadadır. Bu sunumda yoktur.

**Görsel:** Dört kutu. Kod: `userModel.ts` rol enum’u. Ürün ekranı şart değil.

**Konuşmacı:** “Yeni hesap user olur. Organizatörlük başvuruyla gelir. Ücretli etkinliği user açamaz. Yöneticiyi girişten sonra ayrı adrese gönderiyoruz. O uygulamayı bugün anlatmıyoruz.”

---

## Slayt 3 – Bir ailenin yolu

**Ana mesaj:** Ürün tek senaryoda anlatılır. Sonraki slaytlar bu adımların kodudur.

**Maddeler:**

- Ana sayfada cümleyle ara.
- Etkinlik detayına gir, kayıt ol, katıl.
- İstersen gönderi yaz.
- Kendi etkinliğini açmak için başvur.

**Görsel:** Dört ok: Ara, Detay, Katıl, Paylaş. Ayrı ekran şart değil.

**Konuşmacı:** “Bir veli hafta sonu için atölye arar. Cümle yazar, kartı açar, katılır. Beğenirse gönderi bırakır. Kendi etkinliğini açmak isterse başvuru formu vardır. Etkinlik adlarını veritabanından okumuş gibi söylemiyoruz.”

---

## Slayt 4 – Bu sunumun sınırı

**Ana mesaj:** Bitmeyen ve bu sunumun dışında kalan işleri baştan ayırıyoruz.

**Maddeler:**

- Admin ekranı, bildirim ve destek sohbeti kapsam dışıdır.
- Stripe kodu yoktur. `KTZ-219` In Progress’tir.
- Bekleme listesi ve canlı harita yoktur.
- Forum ve Activity modeli yoktur.

**Görsel:** `[EKRAN GÖRÜNTÜSÜ EKLENECEK]` Jira’da `KTZ-219` In Progress. Ödeme ekranı arama.

**Konuşmacı:** “Fiyat alanı vardır. Tahsilat yoktur. Katılırken kart istenmez. Bildirim ve sohbet kodda durur. Onları bu sunumda açmıyoruz. Harita sabit görseldir. Yol tarifi gerçek koordinatla Google Maps’e gider.”

---

## Slayt 5 – Jira’da iş nasıl duruyor?

**Ana mesaj:** Her işin bir `KTZ` anahtarı vardır. Dal adı bu anahtarı taşır.

**Maddeler:**

- Proje anahtarı `KTZ`.
- Örnekler: `KTZ-93` kayıt, `KTZ-157` etkinlik formu, `KTZ-247` Google.
- Dalda `fe-` veya `evt-` ara kodu görülür.
- Epic ağacı repoda yazılı değildir. Karede görüneni söyleriz.

**Görsel:** `[EKRAN GÖRÜNTÜSÜ EKLENECEK]` Jira panosu, Done sütununda `KTZ-93`, `KTZ-139`, `KTZ-157`, `KTZ-247`.

**Konuşmacı:** “Jira’da kartın türü Epic, Story veya Task olabilir. Depodan bu tür ağacını ezberlemedik. Gördüğümüz şey anahtar ve dal adıdır. `KTZ-157/fe-021` arayüz işidir. Tür etiketini uydurmuyoruz.”

---

## Slayt 6 – Sprint ve dal

**Ana mesaj:** İş panoda biter, dal açılır, kod `dev` üzerinde birleşir.

**Maddeler:**

- Sprint adı repoda takvim dosyası değildir.
- Dal örnekleri: `dev`, `main`, `KTZ-247-register-and-sign-in-with-google`.
- Erken dallar `duygu`, `ayla`, `elif`.
- Özellikler `dev`’e merge edilir.

**Görsel:** `[EKRAN GÖRÜNTÜSÜ EKLENECEK]` Varsa sprint panosu. Yoksa dal listesi. Sprint adı yalnızca karede yazıyorsa söylenir.

**Konuşmacı:** “Sprint numarası uydurmuyoruz. Karede bir sprint görünürse adını okuruz. Akış sabittir. Kart açılır, dal açılır, pull request `dev`’e girer.”

---

## Slayt 7 – Commit ve pull request

**Ana mesaj:** Commit ne yaptığını söyler. Pull request dalı `dev` ile birleştirir.

**Maddeler:**

- Düzen: `feat(kapsam):`, `fix`, `refactor`.
- Jira anahtarı bazen mesajda, çoğu zaman dalda.
- Merge satırı: `Merge pull request #201 from EAD-TECH/...`.
- Review yorumlarını GitHub’dan açmadık. Üç kişilik onay iddiası yok.

**Görsel:** `[EKRAN GÖRÜNTÜSÜ EKLENECEK]` PR #201 başlığı, dal adı ve merge durumu.

**Konuşmacı:** “Haziran mesajları daha serbesttir. Sonra conventional commit’e yaklaştık. PR #201 Google girişidir. Review metni yoksa yorum uydurmayız. Söylediğimiz şey merge commit’idir.”

---

## Slayt 8 – İki işin izi

**Ana mesaj:** Aynı süreç hem kimlikte hem etkinlikte görünür.

**Maddeler:**

- `KTZ-247`, PR #201, 23 Ekim 2026, Google.
- `KTZ-157`, dal `fe-021`, üç adımlı etkinlik formu.
- PR #24, 27 Temmuz 2026, event controller.
- PR #177, 5 Ekim 2026, doğal dil araması.

**Görsel:** `[EKRAN GÖRÜNTÜSÜ EKLENECEK]` Git graph’ta `dev` ve PR #201. İkinci küçük kare PR #177 olabilir.

**Konuşmacı:** “Google işi Duygu’nun kartı ve commit’idir. Etkinlik formu Ayla’nın kartıdır. Aramayı da aynı `dev` hattına PR ile aldık. Üç kişi aynı sözleşmede birleşti.”

---

## Slayt 9 – Üç kişinin işi

**Ana mesaj:** Alanlar ayrılır. Sözleşme ortaktır.

**Maddeler:**

- Duygu: login, sosyal, başvuru formu, Gemini araması, Google.
- Ayla: kayıt, etkinlik listesi, filtre, katılım, oluşturma.
- Elif: ilk kullanıcı modeli ve etkinlik risk kararı. Bildirim bu sunumda yok.
- Ortak hat: `/api/v1`, Zod, JWT, `dev`.

**Görsel:** Üç sütun. Altta `dev`. Ürün ekranı şart değil.

**Konuşmacı:** “Satır saymıyoruz. Ayla etkinliği yazdı. Ben aramayı onun liste ucuna bağladım. Elif oluşturulan etkinliğe risk özeti ekledi. Bildirim ve sohbet onun işidir. Onları bugün açmıyoruz.”

Konuşmacı “ben” yerine kendi adını kullansın.

---

## Slayt 10 – Depo nasıl duruyor?

**Ana mesaj:** Sayfa `app` içindedir. İş `features` içindedir. API route’tan modele iner.

**Maddeler:**

- `client/app`: URL, locale, modal yuvası.
- `client/features`: auth, events, social, ai, profile.
- `server/src`: route, controller, service, model.
- `admin` klasörü bu sunumda kapalıdır.

**Görsel:** `[EKRAN GÖRÜNTÜSÜ EKLENECEK]` Explorer. `client/app`, `client/features`, `server/src` açık. `node_modules` ve `.env` kapalı.

**Konuşmacı:** “Ayrı bir client/src yok. Hook özelliğin klasöründedir. Yeni iş yeni feature klasörüne girer. Etkinlik formu sosyal yorumun içine yazılmaz.”

---

## Slayt 11 – Frontend teknolojileri

**Ana mesaj:** Next.js 16 ve React 19 arayüzü kurar. Liste TanStack Query’de, oturum Zustand’dadır.

**Maddeler:**

- Next.js 16.3.1, React 19.2.8, TypeScript, Tailwind 4.
- shadcn/ui, React Hook Form, Zod, next-intl.
- TanStack Query sonsuz sayfa. Zustand access token.
- Redux pakette durur. Store olarak kullanılmaz.

**Görsel:** `[EKRAN GÖRÜNTÜSÜ EKLENECEK]` `client/package.json` satırları. Ürün ekranı koyma.

**Konuşmacı:** “Sürümleri paketten okuduk. Axios bağımlılığı durur. Güncel istek `apiFetch` ve `fetch` ile gider. Access token localStorage’da değildir.”

---

## Slayt 12 – Frontend’de beş karar

**Ana mesaj:** Araçlar özellik için seçildi.

**Maddeler:**

- Almanca öneksiz, İngilizce `/en`.
- Özellik klasörleri birbirine gömülmez.
- Filtreler URL’de, paylaşılır.
- İlk etkinlik sayfası sunucuda, devamı tarayıcıda.

**Görsel:** `[EKRAN GÖRÜNTÜSÜ EKLENECEK]` `/events` adres çubuğu, seçili bir filtre. Küçük kare yeter.

**Diyagram:** URL kutusu → `buildEventQuery` → `GET /events`.

**Konuşmacı:** “Filtreyi yalnızca React state’e gömseydik bağlantıyı paylaşamazdık. Adres çubuğu sorgunun kendisidir. Dil segmenti de URL’dedir. Ayrı bir React Router yoktur.”

---

## Slayt 13 – Backend teknolojileri

**Ana mesaj:** Express 5, MongoDB ve JWT çekirdektir. Redis yalnızca yapay zekâ konuşması içindir.

**Maddeler:**

- Express 5, Mongoose 9, Zod, bcrypt maliyet 12.
- JWT access 1 gün, refresh çerezi 7 gün.
- Nodemailer ve UploadThing.
- Gemini arama. Groq risk özeti. İkisi aynı iş değildir.

**Görsel:** `[EKRAN GÖRÜNTÜSÜ EKLENECEK]` `server/package.json`. Frontend slaytından ayrı.

**Konuşmacı:** “Redis tüm siteyi hızlandırmaz. Yarım kalan arama 30 dakika hatırlar. Görseller UploadThing’dedir. E-posta Nodemailer’dır. Kapı Express middleware’dir. Destek ajanını bu slaytta açmıyoruz.”

---

## Slayt 14 – Backend katmanları

**Ana mesaj:** Route yolu seçer. Controller yanıtlar. Model belgeyi tutar. Ham belge dışarı çıkmaz.

**Maddeler:**

- `validateBody` gövdeyi Zod ile değiştirir.
- `queryHandler` sayfa, limit, arama ve sıralamayı okur.
- DTO `select: false` alanları vermez.
- Hata `CustomError`. Express 5 onu error handler’a bırakır.

**Görsel:** Dört kutu: Route, Middleware, Controller, Model. Ürün ekranı şart değil.

**Konuşmacı:** “Varsayılan sayfa 1, limit 6’dır. Sosyal istemci 5 ister. Başarı çoğunlukla error false döner. Beklenen hata status code taşır. Parola ve refresh token şemada seçili değildir.”

---

## Slayt 15 – Sistem mimarisi

**Ana mesaj:** Tarayıcı Next’e, Next JSON ile Express’e, Express MongoDB’ye gider.

**Maddeler:**

- Access bellek, refresh httpOnly çerez.
- `/api/v1` iş uçları. UploadThing bu önekin dışındadır.
- Redis, SMTP, Google ve Gemini yan hizmettir.
- Geocode Next proxy’sinden Nominatim’e gider.

**Görsel:** Diyagram. Ürün ekranı şart değil.

**Diyagram:** Kutular sırayla belirsin. Tarayıcı, Next.js, Express, MongoDB. Yan oklar: Redis, SMTP, UploadThing, Google ID token, Gemini. Okun üstünde protokol yazılsın. Socket.IO ve admin kutusu koyma.

**Konuşmacı:** “Nominatim anahtarını tarayıcıya koymadık. Next aracıdır. UploadThing kendi kapısındadır. Yapay zekâ araması Gemini’ye gider. Etkinliği yine Mongo seçer.”

---

## Slayt 16 – Bir istek nasıl yürür?

**Ana mesaj:** Katıl düğmesi middleware zincirinden geçer ve tek Mongo komutuyla kontenjanı korur.

**Maddeler:**

- `apiFetch` Bearer ve çerez gönderir.
- Sıra: kimlik, tam profil, Zod.
- `join` tek `findOneAndUpdate` kullanır.
- Yanıt DTO’dur. Query önbelleği güncellenir.

**Görsel:** `[EKRAN GÖRÜNTÜSÜ EKLENECEK]` Etkinlik detayında katıl düğmesi. Diyagram asıl anlatımdır.

**Diyagram:** Sekiz kutu, tıklamayla. Kart, `apiFetch`, Express, route zinciri, `findOneAndUpdate`, DTO, ekran. 401 kesik okla slayt 20’ye gider. Ana yola yapıştırma.

**Konuşmacı:** “Kullanıcı kişi sayısını seçer. Sunucu önce token’ı, sonra profilin bittiğini, sonra gövdeyi kontrol eder. Kapasiteyi okuyup sonra yazmıyoruz. Koşul ve artış aynı komutta. Kaybeden istek 409 alır.”

---

## Slayt 17 – Kayıt iki adımdır

**Ana mesaj:** İki adım vardır. API çağrısı tektir. Otomatik giriş yoktur.

**Maddeler:**

- Adım 1 hesap. Adım 2 Almanya adresi.
- İleri yalnız ilk adımı doğrular.
- `POST /api/v1/auth/register`, 201.
- Parola bcrypt 12. Aynı e-posta 409.

**Görsel:** `[EKRAN GÖRÜNTÜSÜ EKLENECEK]` `/register` adım 1, boş form. İkinci kare adım 2, posta kodu.

**Konuşmacı:** “İleri tuşu bütün formu göndermez. Posta kodu Almanya sorgusuyla şehri doldurur. Gönder deyince tek istek gider. Başarı ekranı e-postayı doğrula der. Oturum açılmaz.”

---

## Slayt 18 – E-posta ve şifre sıfırlama

**Ana mesaj:** Ham token veritabanında durmaz. Mektup bağlantısı ile form bağlantısı farklı yerlerdedir.

**Maddeler:**

- Doğrulama bağlantısı API’dedir. Süre 24 saat.
- Başarıda refresh çerezi ve ana sayfaya 302.
- Şifrem yoksa hesap yoksa da aynı 200 metni.
- Sıfırlama 30 dakika. Bitince çerez silinir, `/login`.

**Görsel:** `[EKRAN GÖRÜNTÜSÜ EKLENECEK]` Karşılama mektubu. Konu “Willkommen bei Kitzaa”. Token’lı URL kırpılır.

**Konuşmacı:** “Mektuptaki link tarayıcı sayfası değildir. API doğrular, çerezi yazar, siteye yollar. Access token bu yanıtta yoktur. Ana sayfa onu refresh ile alır. Var olmayan e-postaya da aynı cümleyi veririz. Hesap sayımı yapmayız.”

---

## Slayt 19 – Parola ile giriş

**Ana mesaj:** Access token gövdededir. Refresh token httpOnly çerezdedir.

**Maddeler:**

- Alan kullanıcı adı veya e-postadır.
- Kullanıcı yoksa ve parola uyuşmazsa aynı 401 metni değildir. Uyuşmazlık 404’tür.
- E-posta doğrulama kontrolü girişte kapalıdır.
- Yönetici ayrı uygulamaya gider. Diğer roller ana sayfaya.

**Görsel:** `[EKRAN GÖRÜNTÜSÜ EKLENECEK]` `/login`, boş form ve Google düğmesi. Parola yazma.

**Konuşmacı:** “Doğrulama mektubu gider. Giriş şu an doğrulanmamış hesabı da kabul eder. Bunu saklamıyoruz. Organizatör başvurusu doğrulama ister. Access belleğe yazılır. Refresh çerezini JavaScript okuyamaz.”

---

## Slayt 20 – JWT ve yenileme

**Ana mesaj:** Access kısa ömürlüdür ve bellektedir. 401’de tek yenileme olur, istek kendi kendini tekrarlar.

**Maddeler:**

- Access 1 gün. İçinde rol ve kurum kimliği vardır.
- Refresh 7 gün. Sunucuda da kayıtlıdır. Döndürülür.
- Aynı anda gelen 401’ler tek `refreshPromise` paylaşır.
- Olmazsa token silinir ve `/login`.

**Görsel:** Animasyon. Ürün ekranı şart değil. İstersen slayt 19’daki giriş karesi küçük kalır.

**Diyagram:** Sekiz adım, tıklamayla. Giriş. Access bellek ve refresh çerez. API. 401. Tek refresh, Bearer yok. Yeni çift. İstek yinelenir. Çerez uyuşmazsa `/login`.

**Konuşmacı:** “Sunucu eski refresh’i yenisiyle değiştirir. Her 401 ayrı yenileme çağırırsa ikincisi eski çerezi reddeder. Bu yüzden istemcide tek bir söz vardır. `finally` bu sözü temizler. Çok geç kalan ikinci yenileme hâlâ yarışabilir. Bunu da söylüyoruz.”

---

## Slayt 21 – Google ile hesap

**Ana mesaj:** Google parola vermez. Biz ID token ve nonce doğrularız.

**Maddeler:**

- Önce `GET /auth/google/nonce`. Nonce httpOnly çerezdir.
- `POST /auth/google` credential ve locale alır.
- Aynı e-posta parola hesabındaysa 409. Birleştirme yok.
- Yeni hesapta kullanıcı adı boş kalabilir.

**Görsel:** `[EKRAN GÖRÜNTÜSÜ EKLENECEK]` Google hesap seçici. Gerçek e-posta kapatılır. Diyagram asıl anlatımdır.

**Diyagram:** Yedi adım. Düğme. Nonce. ID token. İmza ve nonce. Hesap kararı. Kitzaa JWT. İki çıkış: ana sayfa veya complete profile.

**Konuşmacı:** “Düğme Google’ın kendi bileşenidir. Sunucu kendi ürettiği nonce’u çerezden okur ve siler. Parola hesabını sessizce Google’a bağlamayız. Kullanıcı adı yoksa oturum açılır. Katılım henüz açılmaz.”

---

## Slayt 22 – Eksik profil

**Ana mesaj:** Google kaydı eksik profille oturum açar. Korumalı iş profil bitmeden 403 alır.

**Maddeler:**

- `/complete-profile` kullanıcı adı ve Almanya adresi ister.
- Posta kodu sunucuda da çözülür.
- Dolu kullanıcı adı 409.
- Başarıda yeni access token ve ana sayfa.

**Görsel:** `[EKRAN GÖRÜNTÜSÜ EKLENECEK]` `/complete-profile`, boş form.

**Konuşmacı:** “Parola hesabında bu alanlar kayıtta zorunludur. Google’da şemayı gevşettik. Kapıyı `requireCompleteProfile` ile geri koyduk. Katılım, gönderi ve başvuru bu kapıdan geçer.”

---

## Slayt 23 – Etkinlik modeli

**Ana mesaj:** Etkinlik onaylanmadan herkese görünmez. Durum gövdeden gelmez.

**Maddeler:**

- Durumlar: pending, approved, rejected, cancelled, completed.
- Yaş: `0-3` ile `all-ages`. `all-ages` diğerleriyle karışmaz.
- Yer GeoJSON noktasıdır. İndeks 2dsphere.
- Tekrar alanı yazılır. İleriki tarih üreten iş yoktur.

**Görsel:** Durum kutuları ve izinli oklar. `eventStateMachine.ts`. Ürün ekranı şart değil.

**Konuşmacı:** “Herkese açık liste yalnız approved döner. Kullanıcı kendi onaylı etkinliğini düzenlerse kayıt yeniden incelemeye dönebilir. Fiyat ücretsizse null’dur. Para birimi EUR’dur.”

---

## Slayt 24 – Liste ve filtre

**Ana mesaj:** Filtre adres çubuğundadır. Yarıçap MongoDB’nin coğrafi sorgusudur.

**Maddeler:**

- Yaş, kategori, tarih, mekân, organizatör rolü, metin.
- `lat`, `lng`, `radius` birlikte yazılır. Üst sınır 50 km.
- Kategori slug ile çözülür.
- Dar ekranda filtre sheet’tedir.

**Görsel:** `[EKRAN GÖRÜNTÜSÜ EKLENECEK]` `/events` liste. İkinci kare filtre açık ve adres çubuğu.

**Diyagram:** Filtre kutuları → query string → `list` → `$geoWithin`.

**Konuşmacı:** “Aile 7–10 yaş ve bir kategori seçer. Adres değişir, liste daralır. Şehir adı Nominatim’e Next üzerinden gider. Koordinat ve yarıçap aynı anda yazılmazsa filtre yarım kalır.”

---

## Slayt 25 – Sonsuz kaydırma

**Ana mesaj:** İlk etkinlik sayfası sunucudadır. Devamı tarayıcıdadır. Ayrı bir sonsuz kaydırma paketi yoktur.

**Maddeler:**

- İlk sayfa `revalidate: 60`.
- `useInfiniteEvents` sonraki sayfayı ister.
- URL `queryKey` içindedir. Filtre değişince liste sıfırlanır.
- `_id` sıralamada vardır. Aynı günkü kart kaybolmasın.

**Görsel:** `[EKRAN GÖRÜNTÜSÜ EKLENECEK]` `/events` sayfa sonu, yükleme gözlemcisi veya “daha fazla” hali.

**Konuşmacı:** “Sunucu yalnız ilk açılışta çalışır. Kaydırınca tarayıcıdayız. Gözlemci sonraki sayfayı ister. İstek yoldayken ikincisini keseriz. Sosyal liste de aynı kancayı kullanır. Onu birazdan ayıracağız. Orada ilk sayfa sunucuda değildir.”

---

## Slayt 26 – Detay ve katılım

**Ana mesaj:** Detay slug ile açılır. Kontenjan atomiktir. Ödeme ekranı yoktur.

**Maddeler:**

- Yalnız onaylı slug. Görüntülenme `$inc` ile artar.
- Katıl, ayrıl, beğen, kaydet. Tam profil gerekir.
- İki kişi son yere basarsa biri 409 alır.
- Yer kutusu sabit görseldir. Yol tarifi gerçek koordinattır.

**Görsel:** `[EKRAN GÖRÜNTÜSÜ EKLENECEK]` `/events/<gerçek-slug>`. İkinci kare oturumlu katıl. Ödeme ekranı bekleme.

**Konuşmacı:** “Kapasiteyi önce okuyup sonra yazmıyoruz. Filtrede onay, kullanıcı ve kapasite ifadesi vardır. Artış aynı komuttadır. Ayrılma o kişinin kişi sayısını düşer. Ücret yazısı görünse de kartla ödeme yoktur.”

---

## Slayt 27 – Etkinlik oluşturma

**Ana mesaj:** Üç adım vardır. Son adım tek API çağrısıdır. Durumu istemci seçmez.

**Maddeler:**

- Adım 1 içerik ve görsel. Adım 2 zaman ve yer. Adım 3 ücret.
- Görsel UploadThing. En fazla 5, görsel 8 MB.
- `user` ücretli gönderemez. Sunucu da reddeder.
- Yönetici değilse risk servisi durum önerebilir. Düşerse pending kalır.

**Görsel:** `[EKRAN GÖRÜNTÜSÜ EKLENECEK]` `/profile/events-erstellen` adım göstergesi. Ücret adımında “tahsilat yok” notu sözlüdür. Stripe ekranı yok.

**Konuşmacı:** “İleri yalnız o adımın alanlarını doğrular. Koordinat şehir merkezidir. Sokak her zaman çözülmez. Jira kartı KTZ-157’dir. Form Ayla’nın arayüz işidir. Model daha önce yazılmıştı.”

---

## Slayt 28 – Profil

**Ana mesaj:** Profil giriş ister. Sekmeler aynı kullanıcının etkinlik ve gönderi listesidir.

**Maddeler:**

- `isReady` bitmeden login’e atmayız.
- Sekmeler: bilgiler, güvenlik, kendi etkinlikler, katıldıklar, kayıtlılar, gönderiler.
- Fotoğraf tek dosya, 4 MB. Eski avatar silinir.
- Kayıtlı etkinlik kimliği Zustand kümesindedir. Çıkışta temizlenir.

**Görsel:** `[EKRAN GÖRÜNTÜSÜ EKLENECEK]` `/profile`, kişisel kart ve sekmeler. E-posta ve telefon gerekmiyorsa kapat.

**Konuşmacı:** “Etkinlik oluşturma bu sekme çubuğunun altında değildir. Yine de aynı layout girişi miras alır. Kayıtlı kalp sunucuya gider. Ekran yeni bir Set ile güncellenir. Eski kümeyi yerinde değiştirirsek React görmez.”

---

## Slayt 29 – Sosyal akış

**Ana mesaj:** Gönderi herkese açıktır. Yazmak ve yorumlamak giriş ve tam profil ister.

**Maddeler:**

- `GET /posts` herkese açık. Yorum listesi authentication ister.
- Üst yorum ve tek seviye yanıt. Yanıta yanıt 400’tür.
- Üst yorum silinince yanıtlar da soft-delete olur.
- Görsel UploadThing `socialImage`.

**Görsel:** `[EKRAN GÖRÜNTÜSÜ EKLENECEK]` `/social`, birkaç demo gönderi.

**Konuşmacı:** “Yorumun parent’ı yoksa gönderinin sahibine giden iş bu sunumda yok. Burada model yeter. İki seviye vardır. Üçüncü seviye controller’da kesilir. Şema tek başına bunu anlatmaz.”

---

## Slayt 30 – Sosyal liste ve beğeni

**Ana mesaj:** Sosyal liste baştan tarayıcıdadır. Beğeni önbelleği yerinde güncellenir.

**Maddeler:**

- Sayfa boyutu 5. Gözlemci 300 piksel önceden tetiklenir.
- Anahtar şehir, etkinlik, sıra ve aramayı taşır.
- Beğeni `setQueryData` kullanır.
- Hata olursa önceki dizi geri yazılır.

**Görsel:** `[EKRAN GÖRÜNTÜSÜ EKLENECEK]` `/social` sayfa sonu. İkinci kare yeni gönderi penceresi. Kişisel fotoğraf olmasın.

**Konuşmacı:** “Etkinlik listesinde ilk sayfa HTML’de gelir. Sosyalda gelmez. Feed sık değişir. Beğenide listeyi baştan çekmiyoruz. Aynı kartın like dizisini önbellekte değiştiriyoruz. İstek düşerse geri alıyoruz.”

---

## Slayt 31 – Parallel ve intercepting routes

**Ana mesaj:** Karta basınca adres değişir. Feed silinmez. Aynı adres yeni sekmede tam sayfadır.

**Maddeler:**

- Layout hem `children` hem `modal` alır.
- `(.)posts/[postId]` akışın üstüne dialog koyar.
- Geri tuşu `router.back()` ile pencereyi kapatır.
- Yenileme intercept etmez. Tam sayfa açılır.

**Görsel:** `[EKRAN GÖRÜNTÜSÜ EKLENECEK]` İki kare. Modal ve adres `/posts/<id>`. Aynı URL yeni sekmede tam sayfa.

**Diyagram:** İki şerit, tıklamayla. Üst: feed sabit, URL değişir, dialog belirir, geri ile dialog gider. Alt: aynı URL tam sayfa. Ortak kutu `PostDetailView`. Parantezli route grupları URL’ye girmez. `@modal` paralel yuvadır.

**Konuşmacı:** “Paylaşılabilir adres istedik. Feed’i de kaybetmek istemedik. Intercepting route ikisini birden verir. Bağlantıyı kopyalayan kişi pencere değil sayfa görür. Eşleşmeyen modal adresi catch-all yutar.”

---

## Slayt 32 – Organizatör başvurusu

**Ana mesaj:** Organizatörlük başvurudur. E-posta doğrulanmadan gitmez. Onay bu ekranda verilmez.

**Maddeler:**

- Form `/profile` kartındadır. `KTZ-152`.
- Rol user değilse 403. Açık başvuru varsa 409.
- Durum kodda `pending` başlar. Risk özeti otomatik onay değildir.
- `GET /organizer-applications/me` kendi kayıtlarını döner.

**Görsel:** `[EKRAN GÖRÜNTÜSÜ EKLENECEK]` `/profile` üzerinde boş başvuru formu. Varsa daha önce oluşmuş demo durum kartı. Sunum sırasında yeni başvuru yazmamaya çalış.

**Konuşmacı:** “Mektup gitmese de başvuru durur. Yöneticilere giden bildirim bu sunumda yok. Onay admin API’sindedir. Rol değişince refresh token temizlenir. Yeni rol için yeniden giriş gerekir. Onay ekranını açmıyoruz.”

---

## Slayt 33 – Kurum ve ücret kuralı

**Ana mesaj:** Kurum onaydan sonra açılır. Ücret alanı vardır. Tahsilat yoktur.

**Maddeler:**

- `GET/PUT /institutions/me` yalnız `organizer`.
- Ücretsiz etkinliği profili tam kullanıcı açabilir.
- Ücretli etkinlik user rolüne 403’tür.
- Stripe, checkout ve ödeme sayfası yoktur.

**Görsel:** `[EKRAN GÖRÜNTÜSÜ EKLENECEK]` Onaylı demo varsa kurum formu. Yoksa slayt 27’nin ücret adımı, “tahsilat yok” notuyla. Kurum karesini uydurma.

**Konuşmacı:** “Herkes organizatör doğmaz. Başvuru bekler. Onaylı hesap kurumunu günceller. Ücretli etkinliği ancak o rol tanımlar. Kartla ödeme KTZ-219’dadır ve bitmemiştir.”

---

## Slayt 34 – AI Event Search: amaç ve teknolojiler

**Ana mesaj:** Aile cümle yazar. Gemini tercihi çıkarır. Etkinliği Express, MongoDB’den seçer.

**Maddeler:**

- Ana sayfada `AiEventSearch`. Uç `POST /api/v1/ai/event-search`, oturum yok.
- Sunucu paketleri `ai` ve `@ai-sdk/google`. Model `gemini-3.5-flash-lite`.
- İstemci state’i `useState` ve `useMutation`. Konuşma `localStorage`’da durmaz.
- 15 dakikada 20 istek. Risk analizi bu slayt değildir. O Groq’dur.

**Teknik:** Bileşen `client/features/ai/components/AiEventSearch.tsx`. Controller `server/src/controllers/ai/ai.controller.ts`. Route `ai.routes.ts` içinde hız sınırından sonra controller’a girer. Kimlik middleware’i yoktur.

**Görsel:** Ekran görüntüsü yok. PDF için numaralı kutu şeridi.

**Diyagram:** Aşama 1’de kullanıcı, textarea ve `useMutation` görünür. Aşama 2’de hız sınırı ve istek Zod’u yanar. Gemini ve MongoDB soluk kalır. Ok, model kutusunda durur. Sahte etkinlik kartı çizilmez.

**Konuşmacı:** “Arama herkese açıktır. Kullanıcı en fazla 500 karakter yazar. Konuşma kimliği bellektekidir. Sayfa yenilenirse tarayıcı o kimliği unutur. Gemini burada etkinlik adı üretmez. Groq ile yapılan risk kararını bu akışla karıştırmıyoruz.”

---

## Slayt 35 – Prompt ve structured output

**Ana mesaj:** Model serbest metin değil, Zod şemasına uyan yedi alan döner.

**Maddeler:**

- Sistem metni önceki değeri korur ve eksik tercihi uydurmaz.
- `"any"` yalnız kullanıcı fark etmez derse gelir. Bilinmeyen değer `null` kalır.
- Üretim `temperature: 0`, 500 token, 20 saniye, SDK yeniden denemez.
- Dış döngü iki denemedir. İkisi de düşerse 503. Veritabanına gidilmez.

**Teknik:** `getAiResponse` önceki durumu JSON olarak prompt’a koyar ve Berlin tarihini ekler. `Output.object` şemayı üretim sırasında uygular. Şema `ai-event-search-output.validation.ts`. Alanlar `childAges`, `datePreference`, `specificDate`, `environment`, `timePreference`, `cities`, `maxPrice`. Birleştirme fonksiyonu yoktur.

**Görsel:** Ekran görüntüsü yok.

**Diyagram:** Aşama 1’de `instructions` kutusu. Aşama 2’de önceki JSON, yeni cümle ve `Europe/Berlin` tarihi. Aşama 3’te `generateText` ve yedi alanlı çıktı. Aşama 4’te geçersiz üretim 503 okuyla biter. MongoDB bu şeritte yoktur.

**Konuşmacı:** “Şema, model konuştuktan sonra elle yapıştırılmaz. SDK çıktıyı şemayla ister. Yaş 0 ile 17 arasındadır. Şehir en fazla beştir. Ücretsiz, kostenlos ve ücretsiz sıfır fiyat demektir. Ortam ve saat, ilgisiz cümleden çıkarılmaz.”

---

## Slayt 36 – Cümleden Mongo filtresine

**Ana mesaj:** Filtreyi model kurmaz. `buildAiEventSearchFilter` kurar.

**Maddeler:**

- Sorgu her zaman `status: "approved"` ve bugünden itibaren alt tarih sınırı taşır.
- Yaş, bantların kesişimidir. 15–17 yalnız `all-ages` olur.
- Şehir tam ve harf duyarsız eşleşir. `"any"` sorguya girmez.
- Sıfır fiyat yalnız ücretsiz kayıttır. Sonuç en fazla 20, tarihe göre artan.

**Teknik:** Tarih ve saat Berlin’dedir. `thisMonth` bugünden ay sonuna kadardır. Pazar günü hafta sonu yalnız o gündür. Saat sınırları 05:00, 12:00 ve 17:00. `searchEvents` coğrafi yarıçap kullanmaz. Boş yaş dizisi yanıt DTO’sunda `all-ages` yapılır. Bu, sorgu koşulu değildir.

**Görsel:** Ekran görüntüsü yok.

**Diyagram:** Solda yedi alan, sağda Mongo operatörleri. Ortada “kod”. Aşama 1 yaş kesişimi. Aşama 2 şehir regex’i ve atılan `"any"`. Aşama 3 tarih aralığının `schedule.startDate` üzerine yazılması. Aşama 4 `Event.find`, limit 20. Etkinlik başlığı yazılmaz.

**Konuşmacı:** “İki çocuk farklı yaş bandındaysa ortak bant kalır. Şehir araması harita yarıçapı değildir. Model Berlin saatini kendisi hesaplamaz. Tarihi biz gün aralığına çeviririz. Kayıt yoksa boş dizi döner. Bunu hata saymıyoruz.”

---

## Slayt 37 – Redis, eksik alan ve takip sorusu

**Ana mesaj:** Eksik zorunlu alanı kod seçer. Soru cümlesini çeviri dosyası söyler. Ara durumu Redis tutar.

**Maddeler:**

- Zorunlu sıra: yaş, tarih, belirli gün, şehir. Ortam ve fiyat zorunlu değildir.
- Eksikse Redis `SET`, 30 dakika, HTTP 200 `question`. Mongo çalışmaz.
- Soru anahtarı `missingField`. Metin `questions.*` altındadır.
- Tamamlanınca istemci konuşma kimliğini siler. Sonraki cümle yeni aramadır.

**Teknik:** Redis okuması Gemini’den öncedir. Bozuk JSON silinir ve durum `null` olur. Yazma yalnız eksik turda olur. Silme, istemci kimlik gönderdiyse ve arama bittiyse olur. Silme hatası 200 yanıtı bozmaz. Kimlik `useState` içindedir. Örnek düğmesi de kimliği temizler.

**Görsel:** Ekran görüntüsü yok.

**Diyagram:** İki tur, yan yana statik kare. Tur 1: cümle, Redis okuma boş, Gemini, eksik `cities`, `SET conversation:<id>`. Tur 2: aynı kimlik, Redis’ten önceki JSON, Gemini, alanlar tam, Mongo, `DEL`. Soru balonu Gemini’ye değil `de.json` kutusuna bağlıdır.

**Konuşmacı:** “Kullanıcı yalnız yaş söylerse tarih sorarız. Şehir fark etmez derse değer any olur ve şehir filtresi kurulmaz. Soru metnini model yazmaz. Almanca sabit cümle vardır. Sayfayı yenilerse tarayıcı kimliği unutur. Redis kaydı yarım saat durabilir ama yeni istek onu taşımaz.”

---

## Slayt 38 – Gemini, Express ve MongoDB sınırı

**Ana mesaj:** Model veritabanını görmez. Onaylı etkinliği yalnız Express sorgular.

**Maddeler:**

- İstek Zod’u ve Redis okuması, Gemini’den önce biter.
- Structured output, Gemini çağrısının içindedir. Ayrı serbest metin adımı yoktur.
- Eksik alanda akış Redis yazmada durur.
- Tam alanda sorgu kodu MongoDB’ye gider. Gemini’den veritabanına ok yoktur.

**Teknik:** Doğrulanan sıra controller’dadır: gövde şeması, UUID, `getConversationState`, `getAiResponse`, `getMissingRequiredField`, sonra ya `saveConversationState` ya `buildAiEventSearchFilter` ve `searchEvents`. Redis okuma/yazma ve Gemini hatası 503’tür. Hız sınırı controller’dan önce 429 döner.

**Görsel:** Ekran görüntüsü yok. Bu slayt kapanış şemasıdır. PDF’te dört aşama alt alta durabilir.

**Diyagram:** Aşama 1 tarayıcıdan Express’e, istek Zod’u. Aşama 2 Redis okuma ve şema. Aşama 3 Gemini, sıcaklık 0, Zod çıktı. Aşama 4 çatallanır: eksikse Redis yazma, tamsa MongoDB ve koşullu silme. Gemini ile MongoDB arasında çizgi yoktur. Kesik not: “model koleksiyonu okumaz”.

**Konuşmacı:** “Sırayı karıştırmıyoruz. Önce gövde doğrulanır. Sonra eski konuşma okunur. Sonra model çağrılır. Eksik alanda veritabanı hiç aranmaz. Tam alanda dönen kartlar onaylı kayıtlardır. Modelin uydurduğu bir etkinlik listesi yoktur.”

---

## Slayt 39 – Kararlar ve kapanış

**Ana mesaj:** Zor kararlar yenileme, kapasite, Google’ın eksik alanları ve yapay zekâyı sorgudan ayırmaktı.

**Maddeler:**

- Tek refresh sözü. Geç kalan ikinci yenileme hâlâ yarışabilir.
- Kapasite tek `findOneAndUpdate`.
- Google ve parola hesabı birleşmez. Eksik profil 403 alır.
- Bitmeyenler: Stripe, bekleme listesi, canlı harita, forum.

**Görsel:** Dört karar kutusu. Yeni ekran şart değil.

**Konuşmacı:** “Çalışan kısım arama, katılım, sosyal akış, profil ve iki dilli arayüzdür. Ödeme yok. Canlı harita yok. Bildirim ve destek sohbetini bugün açmadık. Soruda bir isteğin middleware’den MongoDB’ye nasıl gittiğini kodla gösterebiliriz.”

---

## Slayt sırası

| Slayt | Konu |
| ---: | --- |
| 1–4 | Ürün, kitle, senaryo, sınır |
| 5–9 | Jira, sprint, Git, ekip |
| 10–12 | Yapı ve frontend |
| 13–14 | Backend |
| 15–16 | Mimari ve istek |
| 17–22 | Kayıt, e-posta, JWT, Google |
| 23–27 | Etkinlik |
| 28 | Profil |
| 29–31 | Sosyal ve routing |
| 32–33 | Başvuru ve ücret |
| 34–38 | AI Event Search |
| 39 | Kapanış |

## Diyagramların yeri

- Slayt 15: sistem kutuları.
- Slayt 16: katılım yaşam döngüsü.
- Slayt 20: JWT yenileme.
- Slayt 21: Google OAuth.
- Slayt 31: Next.js parallel ve intercepting route.
- Slayt 34: istek, hız sınırı, istek Zod’u. Gemini ve Mongo soluk.
- Slayt 35: sistem metni, önceki JSON, Berlin tarihi, structured output.
- Slayt 36: yedi alandan `buildAiEventSearchFilter` çıktısına.
- Slayt 37: iki tur. Eksikte Redis `SET`. Tamamda Mongo, sonra `DEL`.
- Slayt 38: Gemini ile MongoDB arasında ok yok. Dört aşama alt alta.

## Söylenmeyecek cümleler

- “Ödeme alıyoruz.”
- “E-posta doğrulanmadan giriş yapılamaz.”
- “Canlı harita var.”
- “Forum ve activity hazır.”
- “Her yapay zekâ Gemini.” Risk özeti Groq’dur. Destek ajanı bu sunumda yoktur.
- “Redux ile state yönetiyoruz.”
- “Admin panelinde şunları yaptık.”
- “Bildirim zili ve destek sohbetini bugün anlattık.”
