### NOTIFICATIONS TYPE TANIMLAMA :

recipientId:Types.ObjectId // bıldırımı  
title:string // bıldırımın baslıgı
isRead:false // kullanıcı okudumu bıldırımını
dataPayload:string /_ postid veya eventid neredeyse kullanıcı bıldırıme tıklayacak ve sayfaya yonlendırlıck bu bılgıyı burdan cekmem lazım _/ kızlar bunu ıkı farklı sekılde tutulack sekılde kurgulamıs lınk ve relatedId diye muhtemelen frontend rotası olck relatedId de types.object kullanarak ref verecek
message:bıldırımın ıcerıgı olacak

bildirimin bir type ı olabilir begeni mi yorummu veya sıstem tarafından mı bıldırım aldı baska ne olabilir ?

admin: admınn kuyrugunda bekleyen mesela bır organızator basvurusunu admın onayladı bunu type eklemem lazım
adminin gormesigereken bir yaklasan yenı bır event varsa bunun bıldırımının admıne mı gıtmesı lazım (bu bıldırım mail ile mı oluyor ? erd ye bak yıne)

uyelere eventtan bır gun once bıldırım at katılmayı unutmus olmaları ıhtımalıne karsı

nearby_event: yakınlarda yaklasan bır event yaklasıyorsa kullanıcılar notification alacak

bir kullanıcı bır kullanıcının postuna yorum attıysa postun sahıbıne gıdecek bıldırım eger kı kullanıcı tıklarsa bıldırıme navigate edilck corespan edilen yoruma

gi
eger kı bır event cancel a duserse sıte uyelerıne bıldırm at

Description

Create Notification model/schema (recipientId ref, type, title, message, link, relatedId, isRead) + indexes(aramayı kolaylastırmak adına ındex tanılamayı unutma)

\*\*\* Types kısmını baz alarak model olustrdum

\*\*\* sımdıde createNotification helper fonksıyonunu olusturucm bunu olusturmamın sebebi su :
dıyelım kullanıcı yorum yaptı
req.body aldı bunu zod valıdasyonundan gectı
controller burda benım ascım garson buna yorumu getırdı bu da db ye kaydettı sonra helpera ıhtıyacım var cunku controller kısının yaptıgı yorumu comment tablosuna kaydettım dedı ve bıldırım attırmak ıcın helper elcısını cagırdı verıyı verdi bıldırımı olusturtuck ,pekı controller hangı verılerı verecek de fe gıtsın dıye: yorumun tıtle bılgısı ,mesaj ıcerıgı ,linknotification ve related id yi opsiyonel(?) tanımlamıstm types ta bunları ınterface olarak olusturdm ılk asama :

Express v5 ile async hatalar yakalanıyor ama sessizce fırlatıldıgı ıcın burda notıfıcatıon bır yan etkı aslında asıl olay on tarafta commment lıke vs olayları bu sebeple kullanıcı yorum yaptı ama db baglantısı kesıldı dırekt hata alıck yorumum gıtmedı zannedıp db ye tekrar ıstek atıck bunu onlemek adına try -catch kullanabılırm hatayı loglamak ıcın.
props olarak aldım verımı ve Notification modelimi cagırarak bu modelın create metodu yardımıyla olusturdm fonksıyonmu

````markdown
## TASKA BAŞLARKEN BUNLARI SOR SÜREKLİ KENDİNE

```
Tetikleyici Kim? (Kullanıcı mı, Zaman mı, Admin mi?)

Veri Hacmi Ne? (Bu işlem aynı anda 1 kişi için mi çalışacak, 5.000 kişi için mi?)

Kalkanlarım Neler? (Spam'i, çifte tıklamayı veya yetkisiz işlemi nasıl engelliyorum?)

Ya Çökerse? (İşlem yarıda kesilirse, sistem ertesi gün nerede kaldığını hatırlıyor mu?)
Felaket Senaryosu (Fault Tolerance): Sunucu tam gece 00:00'da bakıma girerse ve sabah 05:00'te açılırsa ne olur? Benim sorgum "Tam olarak 00:00 olanları bul" mu diyor, yoksa "Son 24 saat içinde olanları bul" gibi esnek bir pencereye mi sahip?

Anti-Spam (Idempotency): Bu motor aynı veriyi iki kere okursa, aynı kişiye ikinci mesajı atar mı? (İşte o konuştuğumuz systemNotificationsSent dizisi bu yüzden hayati bir zırhtır).

Büyük Veri (Memory Leak): Ya o gün 10.000 tane etkinlik varsa? Event.find() dediğimde 10.000 kaydı aynı anda RAM'e çekersem Node.js çöker mi? (Bunu insertMany ile optimize ediyorsun, ancak okurken de veriyi parçalayarak almak -pagination/cursor- gerekebilir).
Sorman Gereken "Kriz" Soruları:

    Çifte Tıklama (Race Condition): Kullanıcı interneti yavaşken "Etkinliğe Katıl" butonuna art arda 5 kere basarsa ne olur? Kapasiteyi yanlışlıkla 5 mi artırırım, yoksa veritabanında "Bu adam zaten katıldı" kalkanım (unique index veya find kontrolü) var mı?

    Geri Alma (Undo): Beğeniyi geri çekerse, bildirim tablosundaki o bildirimi de silecek miyim, yoksa "okunmadı" olarak mı bırakacağım? (KTZ-59'daki soft-delete like/unlike mantığın bunu harika çözüyordu).

    Sessiz Çöküş (Fire & Forget): Yorum veritabanına kaydedildi ama bildirim servisi çöktü. Kullanıcıya "Yorum yapılamadı" hatası dönmeli miyim? (Hayır, asıl iş olan yorum başarılıysa HTTP 201 dönmeli, bildirim arka planda sessizce hata loglamalı).
```
````

---

## [KTZ-57-NOT-016 - Notifications / Event reminder](https://dygcankurt17.atlassian.net/browse/KTZ-57)

- **Durum:** In Progress
- **Jira Kartı:** `KTZ-57`
- **Mimari Kararlar & Ne Yaptım:**

1. Adım-1 : Yarınki etkinlikleri bul

- Event modeline gidildi Schedule.startDate tam olarak yarın olan tüm etkinlikleri getir.

2. Adım-2 : Etkinlikleri bulurken participantlerde cekıldi.O etkinliğe kaydolmus kısıler
3. Adım-3 : Buldugum herbir etkinlik ve o etkinliğin içindeki herbir katılımcı ıcın bir bildirim objesi paketi hazrıladım.
   Notification a eklemek için(type:event_reminder,message,relatedId)
4. Adım-4Hazırladıgım bu bildirim paketini InsertMany ile veri tabanına kaydettim

Bu taskı gerceklestirirken 2 secenek vardı; yarınkı eventları cekıp zaman aralıgını cron jobs ıcın JS kodlarıyla hesaplamaktı.
Diğer secenek js() paketi ile zaman aralıgını daha kıs kodlarla ve zaman kayması sorunlarına sebep vermeyecek sekılde(UTC) kaynaklı
arka planda kendısı hespaldıgı ıcın bunu tercih ettim.
Mantıgı :

- .dayjs():Sisteme su ankı zamanı al dıyorum
- .utc():Bu zamanı yerel saatten cıkar evrensel saate cevir
- .add(1,'day'):1 miktar day ise birimi (Bu sayede yarına git demiş oluyorum)
- .startOf('day'): Gidilen günün en başına yani gece yarısı 00:00:00 git demiş oldum
- .toDate(): bu metot ile tüm hesaplamaları yaptıktan sonra Mongoose'a istek attıgımda JS objesıne donustur demıs oluyorum
  CONTROLLER VE ROUTE tanımlamalarımı gerceklestırmıstım. KTZ-63-feat-create-not-dto-helper branch inde

1. Controllerda refactor oncesınde veriyi data:{payload: gonderecegım data seklınde gondermıstım}
   DTO formatını eklemeden once notification.types.ts te 2 eksıgım vardı
   1.1. Veri tabanından gelen ham veriyi temsıl etmesi adına Mongoose un Hydreteddocumentıne ihtiyacım vardı bunu gerceklestırdım .export type NotificationDocument=<Hydrated>
   1.2. Frontende gonderecegım tabagın seklını hangı verilerin gıdecegının template ini olusturdum.
2. controller sayfasında list ve path fonksiyonlarında DB den cektıgım verıyı notificationDTO ya teslim ettim

## [KTZ-56- create toNotificationDTO helper](https://dygcankurt17.atlassian.net/browse/KTZ-56)

- **Durum:** In Progress
- **Jira Kartı:** `KTZ-56`
- **Mimari Kararlar & Ne Yaptım:**
  - Model içerinde ve types alanlarında tanımladıgım enum bildirim tiplerinden bu type için gerekli olan organizer_application
    ve event_review type ları eksik oldugu ıcın onlar eklendı:chore ile commit edildi .
- [admin.notificationController.ts](./src/controllers/admin/admin.notificationController.ts) olusturuldu.
  - Bu taskın amacı adminin onune rastgele bildirimlerin değil aksiyon alınması gereken bildirimlerin dusmesı(onay/red)
  -
  - Admin kuyruğu için `customFilter` yapısını spesifik olarak adminController sayfasında yazacagım customFilter içerisine
    mongoose un `$in` key i ile sadece organızator veya etkilnlik incelemesı olanları getır dedim.
- sonrasında isRead=false olanlarda istenirse bu dinamik kısım da eklenmıs olacak

- Verinin DTO dan gecerek sanitize edilmesi ve onyuze gıtmesı gereken cleanveri formatında gıtmesı ıcın types sayfasına admine ekstra kullanması gereken recipientId yi ekledim. [notification.types.ts](./src/types/notifications.types.ts)

- toNotficationDTO sayfasında ise tekrar fonksıyon tanımlamak yerıne toNotificationDTO yu cagırdım.Temel bilidrim verisini çektim
- Admin DTO fonksiyonu içinde yeni suslu parantez actım ve içine ...toNotificationDTO(notification) diyerek yaydım
- hemen yanına ekstra tanımladıgım recipientId yi tanımladım

- Bu noktada populate manatıgını atladıgım ıcın ilk once notification kısmına senderId:object olacak ssekılde tanımladım.
- [notification.types.ts](./src/types/notifications.types.ts) sayfasına da populate edebilmem için sender ve event detaylarını ekledım
  -FRONTEND e gıdecek detaylar ıcın eventSummary ve senderData ile hangi verileri gondermek ıstedıgımı tipleriyle belirttm
- SenderId olmadıgı için admin gelen bildirimlerin kimden geldiğini goremeyecek bu yuzden modele bu fielde- eklemem lazım :senderId ekledim [notificationModel.ts](./src/models/notificationModel.ts)

- Son olarak da veriyi yollarken populate ederek veritabanından cektım

- **Ne Öğrendim:**
  - toNotificationDTO ve toAdminNotificationDTO helper fonksiyonlarıyla Controller katmanını veri biçimlendirmeyi kavradım.
  -

## [[KTZ-58-NOT-017] - Notifications / Nearby events](https://dygcankurt17.atlassian.net/browse/KTZ-58)

- **Durum:** In Progress
- **Jira Kartı:** `KTZ-58`
- **Mimari Kararlar & Ne Yaptım:**

- Bu taskta cron gibi zaman güdümlü değil, doğrudan olaya (Event) güdümlü bir mantık işlettik.

- Daha önce tekil bildirimler için helper/createNotification fonksiyonunu oluşturmuştum. Ancak bu taskta aynı şehirdeki birçok kullanıcıya bildirim atacağımız için o fonksiyonu kullanmak, her bildirim için DB'ye ayrı ayrı istek atılmasına (performans kaybına) neden olacaktı. Sistemi yormamak ve toplu kayıt yapabilmek için helpers/ altında sendBulkNotifications.ts adında yeni bir veritabanı motoru/şablonu oluşturdum (insertMany kullanıldı).

- Normal akışta, "yakın çevredeki kullanıcıları bulma ve filtreleme" işlemlerini doğrudan eventController içine yazabilirdim. Ancak bu durum controller sayfasını kalabalıklaştıracak (Fat Controller) ve Single Responsibility (Tek Sorumluluk) prensibini ihlal edecekti.

- Bu nedenle projeye "Best Practice" standartlarına uygun bir ara katman (Service) kazandırma kararı aldım. Veritabanı sorgularını ve iş mantığını notificationService.ts dosyasında gerçekleştirdim.

- Kullanıcılar hangi şehirde yaşıyor? Bildirim izinleri açık mı? Etkinliğin kapasitesi doldu mu? Bu gibi sorular "İş Mantığı" (Business Logic) olarak adlandırılır. Projenin kurallarını içerir.

  Bu tarz filtrelemeler, karmaşık sorgular ve kimin neyi göreceğine karar verme işlemleri Service katmanında yapılmalı best practice. "nearbyUsers" bulma işlemi tam olarak bir iş mantığı oldugu için bu sekılde insiyatif aldım

- Son olarak, eventController içerisindeki create metodunda bu servis fonksiyonunu çağırdım. Kritik Mimari Karar: Etkinliği oluşturan kullanıcıyı, arka plandaki bildirim atılma süreci boyunca bekletmemek adına servisi başına await koymadan (Fire and Forget mantığıyla) asenkron olarak tetikledim. Böylece response süresi uzamadan kullanıcıya anında başarılı yanıtı dönülmüş oldu.

## [[KTZ-61-NOT-019] - Notifications / Nearby events](https://dygcankurt17.atlassian.net/browse/KTZ-61)

- **Durum:** In Progress
- **Jira Kartı:** `KTZ-61`
- **Mimari Kararlar & Ne Yaptım:**
  - Yeni Bildirim Servisi: notificationService.ts dosyası içerisine, iptal edilen etkinliklerin katılımcılarını bilgilendirmek amacıyla notifyUsersForCancelledEvent fonksiyonu inşa edildi.

  - Sorgu (Query) Optimizasyonu: Servis mimarisi, parametre olarak doğrudan iptal edilen event objesini (ve içindeki participants dizisini) alacak şekilde kurgulandı. Bu sayede veritabanına atılacak ekstra ve gereksiz bir sorgunun (I/O maliyeti) önüne geçildi.

  - Defansif Programlama (Early Return): Fonksiyonun başlangıcına, event.participants dizisinin boş olması durumunda bildirim motorunu hiç meşgul etmeden return null ile süreci sonlandıran bir güvenlik kalkanı eklendi.

  - Veri Manipülasyonu: Katılımcıların olduğu senaryoda, .map() metodu kullanılarak obje içerisindeki veriler filtrelendi ve toplu bildirim motorunun ihtiyaç duyduğu saf userId dizisi (array) oluşturuldu.

  - Bulk Motoru Entegrasyonu: Elde edilen ID dizisi, sendBulkNotifications yardımcı fonksiyonuna iletilerek event_cancelled tipinde, dinamik iptal sebebini (cancelledReason) barındıran bildirim paketleri ateşlendi.

  - Controller Entegrasyonu: Yazılan servis, eventController.ts içerisindeki iptal akışına dahil edildi. State Machine güvenlik duvarı (assertValidTransition) geçilip veri tabanına kayıt (await event.save()) yapıldıktan hemen sonra "Ateşle ve Unut (Fire & Forget)" asenkron mantığıyla konumlandırıldı.

  ## [[KTZ-70-NOT-019] - Notifications / Organizer prep event](https://dygcankurt17.atlassian.net/browse/KTZ-70)

- İlk olarak organizerPrepJob dosyasını actım
- Bir sonrakı gun olucak olan Eventları çektım
- Organızatorlere bildirim atmak için buldugum etkinlik dızısı uzerınde map ile donerek her etkinliğin katılımcısının sayısını buldum
- message kısımları ıcın ne yazacagımı bılmedıgımden bu sekılde bır test mesaj yazdm
- sonrasında return ıle bıldırım paketimin kutusunu olusturup InsertMany ile DB ye kaydediyorum.
- Aslında toplu ve teklı bıldırımler ıcın helper dosyasında bıldırım paketı template lerı olusturmustum ama etkınlıklerın kısı sayıları vs her etkınlıgın farklı bır kıtlesı oldugu ıcın burda kendım olusturdm
- Jobs kısmını normalde server/index içinde cagırıp tetıklemek gerekıyor ama sonrakı tasklar ıcın index sayfasını sısırmemek adına jobs ıcınde ayrı ındex acıp onu ana indexe import ettm.Basta su geldı aklıma : mesela farklı bıldırımlerın saatlerı aynı olabılır nasıl olur dıye ? Node.js in asenktron calısma mantıgı bunları single thread olarak sıraya alıp db den once hangı yanıt gelırse onu calıstırıyor.ms farkıyla db den yanıt geldıgı ıcın kodların calısmasında sorun yok ama bd ye atılan sorgular darbogaz olusturmasın dıye bır tanesını 5 dk olacak sekılde tetıkledım.
- Bu taskı sonradan ekledıgım ıcın bildirim tipine "organizer_prep_summary", bu kısmı ekledım.
- Manuel olarak da route sayfasına kod blogu yapıstırp manuel testını yaptım
- refPath mantıgını kullandıgm ıcın createHelper fonksıyonunu bu sekılde guncellemeyı unuttugm ıcın burda guncelldım bu kısmı da

- Test kodu

```js
router.get("/test-cron", async (req, res) => {
  console.log("🛠️ Manuel cron testi başlatılıyor...");

  try {
    // Fonksiyonları manuel olarak çalıştırıyoruz
    await sendOrganizerPrepSummary();
    await sendRemindersForTomorrow();

    console.log(" Manuel cron testi başarıyla tamamlandı!");
    res.status(200).json({
      success: true,
      message:
        "Zamanlanmış görevler manuel olarak tetiklendi ve hatasız çalıştı.",
    });
  } catch (error) {
    console.error(" Cron testi sırasında hata oluştu:", error);
    res.status(500).json({
      success: false,
      message: "Görevler çalışırken bir hata oluştu.",
    });
  }
});
```

## [[KTZ-71-NOT-020] - Notifications / Organizer prep event](https://dygcankurt17.atlassian.net/browse/KTZ-71)

- **Durum:** Done
- **Jira Kartı:** `KTZ-71`
- **Mimari Kararlar & Ne Yaptım:**

Görev Amacı ve Mimari Kararlar

Bu taskın temel amacı; organizatörlerin etkinlik katılım oranları az olduğunda onları platforma tekrar bağlamak, etkileşimi artırmak ve müşteri memnuniyeti sağlamak adına teşvik edici bir hatırlatma ("Kapasiteni doldurmak ister misin?") bildirimi göndermektir.

Bunu kurgularken, geçmişte KTZ-70'te gözden kaçan "Felaket Senaryosu" (Fault Tolerance) ve "Spam Koruması" (Idempotency) konularını merkeze alarak Best Practice standartlarında bir mimari tasarladım:

1.  Esnek Zaman Penceresi (Felaket Senaryosuna Karşı)
    Diyelim ki bir şeyler ters gitti ve sunucu o gece çöktüğü için Cron Job hiç çalışmadı. Eğer kurgumu "Sadece tam 3 gün kalan etkinlikleri bul" şeklinde kesin ve dar bir pencerede yapsaydım, o günkü bildirimler tamamen yanacaktı.
    Bunun yerine zaman penceresini esnettim: Yarından itibaren 3. günün sonuna kadar olanları getir. Böylece sunucu ertesi gün düzelse bile, aradan kaçan (2 gün veya 1 gün kalmış) etkinlikler ağa yakalanarak telafi edilebilecek.

2.  Anti-Spam (Idempotency) Kalkanı ve Schema Bloat Önlemi
    Genişleyen bu zaman ağına takılan etkinliklere her gece tekrar tekrar aynı bildirimi atmamak (Spam koruması) için Event şemasına bir "Bayrak" (Flag) sistemi kurmam gerekti.
    Ancak her yeni bildirim senaryosu (3 gün kala, 1 gün kala, etkinlik sonu vb.) için veritabanına yeni bir boolean alan açsaydım veritabanı şişecekti (Schema Bloat). Bunun yerine systemNotificationSent adında tek bir dizi (Array of Strings) tutmaya karar verdim.

        Esnek ve genişleyebilir bir yapı için TypeScript ve Mongoose katmanlarını şu şekilde senkronize ettim:

TypeScript

systemNotificationSent?: (
| "organizer_prep_1day"
| "low_capacity_3day"
| "post_event_summary"
| "event_reminder_2hour"
)[];

- MongoDB Operatörleri ve İyileştirmeler (Code Review Sonrası)

Bu taskta klasik find() sorgularının ötesine geçerek MongoDB'nin performanslı operatörlerini kullandım:

    $expr (Expression) Operatörü:
    Normalde MongoDB'de bir arama yaparken bir alanı sabit bir sayıyla kıyaslarız (Örn: capacity.max < 50). Ancak benim senaryomda iki dinamik alanı kendi içinde kıyaslamam gerekiyordu (Mevcut kapasite, maksimum kapasiteden küçük mü?).
    $expr: { $lt: ["$capacity.current", "$capacity.max"] } yazarak bu karmaşık filtrelemeyi doğrudan veritabanı sunucusunda çözdüm. (Buradaki $ işareti alanı bir metin olarak değil, dokümanın içindeki gerçek bir değer olarak alması gerektiğini belirtir).

    $nin (Not In) Operatörü ($ne yerine):
    Sorgumun Anti-Spam kısmında "Bu bildirimi daha önce almamış olanları getir" demek için önceden $ne (Eşit Değil) kullanmıştım. Ancak systemNotificationSent alanı bir dizi (Array) olduğu için, dizilerde "İçinde Yok" anlamına gelen ve semantik olarak çok daha doğru olan $nin operatörüne geçiş yaptım:
    systemNotificationSent: { $nin: ["low_capacity_3day"] }

    $addToSet Operatörü ($push yerine - Çakışma Önleyici):
    Bildirimi attığım etkinlikleri damgalarken $push kullanmıştım. Ancak olası bir "Race Condition" (Cron job'ın bir hatayla anlık olarak iki kere çalışması) durumunda, $push aynı bayrağı diziye mükerrer olarak iki kere ekleyecekti. Bunu, tıpkı kümeler mantığıyla çalışan ve "Sadece içeride daha önceden yoksa ekle" diyen $addToSet operatörüyle güncelledim.

- Performans Odaklı Akış (Core Flow)

Core akış şu şekilde tamamen tutarlı hale getirildi: Sorgu → Paket → insertMany → Flag (updateMany)

    Erken Dönüş (Early Return): eventsToNotify.length === 0 kontrolü ile eğer o gün şartlara uyan etkinlik yoksa, sistemi boş yere .map() ve veritabanı yazma süreçlerine sokmadan zarifçe durdurduk.

    Toplu İşlemler (Bulk Operations): Hem bildirimleri fırlatırken insertMany kullandık, hem de spam bayraklarını işlerken (eğer 1000 etkinlik varsa 1000 kere DB'ye gitmek yerine) updateMany ile tek bir seferde işaretleme yaptık.

- Test Ortamı

Cron job'ı beklemeden sistemi izole bir şekilde test etmek için routes içerisine şu geçici endpoint'i bağladım:
TypeScript

router.get("/test-low-capacity", async (req, res) => {
await sendLowCapacityPrompts();
res.status(200).json({ error: false, message: "KTZ-71 job ran" });
});

Teknik (Technical Debt - Gelecek Görevler)

Geçmiş tasklardaki mimari eksiklikleri düzenli bir şekilde refactor etmek için şu taskı açmam lazım:
KTZ-?: Bildirim Motorları İçin İyileştirme ve Standartlaştırma

    [ ] Hatırlatıcı saatlerini 00:00'dan (Gece yarısı UX'i bozduğu için) sabah 10:00'a çekilecek.

    [ ] KTZ-70 ve diğer tüm bildirim tiplerine systemNotificationSent (Anti-Spam Idempotency) bayrağı kalkanı entegre edilecek.

    [ ] Eski zaman pencereleri "kesin gün" (dar pencere) mantığından, sunucu çökmesine karşı "esnek gün" mantığına çevrilecek.

## [[KTZ-59-NOT-018] - Notifications / Post Comment](https://dygcankurt17.atlassian.net/browse/KTZ-59)

- **Durum:** In Progress
- **Jira Kartı:** `KTZ-59`
- **Mimari Kararlar & Ne Yaptım:**

- Service klasorunde yorumlar için dosya actım.Gerekli bilgilleri user Yorumu yapan kişi ;kendi kendinemi yorum yaptı kalkanında gonderı sahıbı ıle karsılastırdıgım kısım bu.ValidatedData bunun ıcınden parentCommentId sini almak ıcın ,post ve newCommentId yi cektim .
- post.authorId :Gonderinin sahibi Hedefdeki kişi bildirimi alan recipientId
  -validatedData.parentCommentId(Ust yorumun id si ):Burası da benım filtre kalkanım.Eğer bir ID varsa(eger biri yoruma yanıt verıyorsa ) if blogu bısey yapmadan duruck
- newCommentId (Oluşturulan Yeni Yorumun ID'si) & post.\_id: Bunlar sadece Frontend ekibi için kullandığımız yönlendirme tabelalarıdır. Uygulamanın o gönderiyi bulup ilgili yoruma kayabilmesi (scroll yapabilmesi) için linkNotification içine yerleştirdiğimiz koordinatlardır.
- Agacın Govdesi : Gonderim (POST)
- ANA DALLAR : Gonderiye yapılan ilk yorumlar
- Yapraklar: Yorumlara verilen yanıtlar(Replies)
  Veritabanında yorum olusturulurken sisteme sunu soruyorm: Bu yorum kımın cocugu. Bir parentı varmı
  Eger birisi benin postuma yorum yapıyorsa (AnaDal) bu yorumun parentı yok.FE bana parentId null atıcak
- Eğer biri bennim yorumuma "Kesinlikle katılıyorum" diye yanıt veriyorsa (Küçük Yaprak), bu yorumun bir babası vardır. Frontend bana babanın ID'sini parentCommentId: "65b" şeklinde gönderir.
  !validatedData.parentCommentId = bu bossa yorumun herhangı bır parentı yoksa bunu true dondum
  sonuc true bıldırım atacak ama FE dolu yollarsa false olucagından bıldırm atmıycm
- Service katmanında sorgularımı yapıp Helperdakı fonskıyonumu cagırdım bıldırm paketını olusturp db ye kaydetmıs oldum.

## [[KTZ-72-NOT-021] - eVENT SUMMARY](https://dygcankurt17.atlassian.net/browse/KTZ-72)

- **Durum:** In Progress
- **Jira Kartı:** `KTZ-72`
- **Mimari Kararlar & Ne Yaptım:**

Amacım : Bir etkinlik bittikten tam 2 saat sonra organizatöre "Etkinlik nasıldı? Hadi fotoğraf paylaş!" demek.

- Sistemde gece 00:00'da çalışan başka bir motor (eventStatus.job) var. O motor gece uyanıp bitmiş etkinlikleri completed yapıyor.
  Senaryo: Etkinlik akşam 23:00'te bitti. Bizim motor 2 saat sonra (01:00'de) bildirim atmak için uyanacak. Bu yuzden $in["approved","completed"] olarak arattım

elimde Anti-Spam bayrağı ($nin: ["post_event_summary"]) var, Üzerinden en az 2 saat geçmiş olan ve son 7 gün içinde bitmiş olan herkesi getir Zaten bayrağı alanlar eleneceği için kimseye çift gitmez, sunucu 3 gün kapalı kalsa bile açıldığında geriye dönük herkesi telafi eder.

Bildirimleri insertMany ile veritabanına yazdım (Başarılı). Tam o sırada veritabanı bağlantısı koptu ve bayrakları çakan updateMany kodu çalışamadı.TRY-CATCH uyguladm

endDate Yoksa Ne Olacak?

Eğer organizatör etkinlik oluştururken bir bitiş tarihi girmemişse (null), sistem çöker veya onu pas geçer.
Çözüm: $or operatörüyle "Bitiş tarihi varsa ona bak, yoksa başlangıç tarihine bak" demeliyiz.

## Test

```js
router.get("/test-post-event-summary", async (_req, res) => {
  await sendPostEventSummaries();
  res.status(200).json({ error: false, message: "KTZ-72 job ran" });
});
```

## [[KTZ-109] - reply-comment](https://dygcankurt17.atlassian.net/browse/KTZ-109)

- **Durum:** In Progress
- **Jira Kartı:** `KTZ-109`
- **Mimari Kararlar & Ne Yaptım:**

- bu task 59 taskıyla kardestir. 59 taskında posta yapılan bır yorum varsa frontend bana parentId null atıyordu boylelıkle ben bunun poata atılmıs parentı olmayan bır yorum oldugunu anlayaıp bıldırım atıyordm burda ıse mantık akısı su

POST (SAHİP:A)
|
|-- YORUM(B) : BURDA BILDIRIM A YA GIDECEK KTZ-59
|
|--YORUM (C) : BURDA DA BILDIRIM B YE GIDECK KTZ-109

- Bu nedenle ilk olarak notification model ve types dosyasına bu taskın amaci olan bildirim type ini ekliyorum (post_reply) Ilk baslrken forum_reply demiştim yanlıslıkla bu taskta type guncel ve dogru olarak gırdım .
- SenderId olarak User tablosundan referans aldıgım object ID nın notification controller kısmında populate ve create fonksiyonunda veritabanına yazılması ıcın gereklı eklemelrı yaptım.Reply oncesi yapılan işlem bu.
- Swegar dokumanına taskın amacı olan type tuu eklendı
- post_reply işlemi için ["SocialPostcommentNotification"](../server/src/services/socialPostCommentNotification.ts)
  dosyasında daha top-level için bildirim olusturmustum.Bu dosyayı su yapıya cevirdim DB ye sorgu atıp findOne ile parentId parentCommetnt olarak değişkene atadm yi çektim prop olarak almadım. sonrasında if bloklarıyla kısının parentccommentinde author id varsa bu bir replydir diyip create fonksıyonunu cagırarak bıldırm attım aynı mantıkta zaten oncesınde task 59 ıcın yapmıstm top-level yorum bildirimi için.

- Burda ogrendiğim Mongoose un equal metodu ile karsılastırma yapmanın tıp guvenlıgı acısından daha efektif olması sebebi ile bu yontemle karsılastrıma yaptm

## [[KTZ-110] - @mentioned](https://dygcankurt17.atlassian.net/browse/KTZ-110)

- **Durum:** In Progress
- **Jira Kartı:** `KTZ-110`
- **Mimari Kararlar & Ne Yaptım:**

- @mentioned yaklaşımı

[ FRONTEND KATMANI - KULLANICI ARAYÜZÜ ]

1. Yorum/Post kutusuna "@" yazılır.
   │
2. UI, Autocomplete (Otomatik Tamamlama) menüsünü açar. (GET /users/search?q=...)
   |
3. Kullanıcı listeden "Duygu"yu seçsin.
   │
4. State Güncellemesi:
   ├─ Görünür Metin (Text): "Merhaba @duygu"
   └─ Gizli Hafıza (Array): mentionedUserIds = ["64f..."]
   │
5. Form Gönderilir (Submit):
   └─ Payload: { text: "...", mentionedUserIds: ["64f..."] }

----------------API SINIRI----------------------

[ BACKEND KATMANI - GÜVENLİK VE İŞ MANTIKLARI ] 6. Endpoint İsteği Karşılar (Zod Validasyonu)
└─ mentionedUserIds dizisi opsiyonel olarak kabul edilir.
│ 7. Güvenlik Filtreleri (Sanitization):
├─ Benzersiz (Unique) yap: Aynı ID dizide 2 kere varsa tekilleştir.
└─ Self-Mention Koruması: İşlemi yapan kişinin ID'sini diziden çıkar.
│ 8. Veritabanı Doğrulaması (DB Validation):
└─ Kalan ID'ler gerçekten veritabanında var mı? (Aktif kullanıcılar mı?)
│ 9. Yorum/Post Veritabanına Kaydedilir.
│ 10. Bildirim Motoru Tetiklenir (Event-Driven):
└─ Onaylanmış ID listesi (Mentions) .map() ile dönülür.
└─ Her kullanıcı için "mention" tipinde paket hazırlanır.
└─ insertMany ile veritabanına tek seferde yazılır.

--YAPMAM GEREKEN---

1. YORUM VE POST OLUSTURMA SEMALARINA mnetionedUserIDs alanını ekle.Bu alan array of string |optional|varsayılan []bos dızı olmalı
2. fFILTER DUVARI : SERVİCE DOSYAI ICINDE GELEN DIZIYI ONCE SET ICINE ALIP DUPLICATE OLANAIR TEMIZLIYCM
3. DIZIYI FILTERLAYARAK ISLEM YAPAN KISININ ID SINI TEMIZLEYECM KENDI KENDINI ETIKETLEMESIN.
4. ELIMDE KALAN CLEANDIZI FİND METODUNU KULLANARAK DB YE SORUCM SADECE OLAN KULLANICILARI HEDEF OLARAK BULUCM
5. HAZIRLADIGIM BILDIRIM PAKETINI BU KISILERE TYPE."MENTION" OLARAK BILDIRIMI FIRLATICM
6. BACKEND TARAFINDA ID ILE TARAYIP DIZIDE TUTUP BILDIRM ATMA OLAYINI GERCEKLESTIRDM AMA FRONTENDDE REGEX KISMI DEVREYE GIRECEK(Kullanıcı klavyede @ tuşuna basıp peşine ar... yazdığı anda, Frontend'deki Regex devreye girer. "Kullanıcı şu an birini etiketlemeye çalışıyor!" der ve hemen sana o küçük açılır menüyü (Autocomplete) gösterir.

Sen menüden kişiyi seçtiğinde, Frontend yine Regex sayesinde o metni mavi renge boyar ki kullanıcı etiketlediğini gözüyle görsün.)



## [[KTZ-65] - SOCKET-IO](https://dygcankurt17.atlassian.net/browse/KTZ-65)

-----------------SOCKET IO --------------------------


```JS KAVRAMLAR
SOCKET.IO= JAVASCRIPT KUTUPHANESI
WEBSOCKET = HTTP MANTIGINDA CALISAN PROTOKOL

## WEBSOCKET

Tarayıcı ile sunucu arasında TCP bağlantısını sürekli açık tutarak her iki tarafın da dilediği an veri gönderebilmesini sağlayan bir ağ protokolüdür (ws:// veya wss://).

```


## Socket.io

WebSocket protokolünü temel alan, ancak üzerine kopan bağlantıları otomatik yeniden deneme (reconnection), oda (room) yönetimi, broadcast (herkese duyuru) ve paket kaybı yönetimi gibi kritik katmanlar ekleyen bir yazılım kütüphanesidir.

- NODE.JS NORMALDE PORTA GELEN VERI ICIN ISLETIM SISTEMINE DIYOR KI BANA BIR PORT NUMARASI VER BEN
  HTTP İLE BANA GELECEK OLAN ISTEKLERI ORDA TUTAYIM. BIZ NODE JS OGRENIRKEN VERILERIN BYTE HALINDE GELIP OZEL BIR FONKSIYONLA CHUNKLAR HALINDE 0 VE 1 LERDEN OLUSAN BYTE LAR HALINDEKI VERIYI ALIP JSON FORMATINA GETIRIP KODLAMA YAPARKEN REQ RES GIBI METOTLARLA ISLEYIP KULLANIYORDUK.
- SONRA BU HAM VE KARMASIK ISLERI BIZIM ICIN ARKA TARAFTA YAPAN BİR KUTUPHANE OGRENDIK.EXPRESSI
  INDIRDIK VE GELEN VERILERI EXPRESS BIZIM ICIN ARKA PLANDA GIDIP NODE.JS IN MOTORUNU CALISTRP KUYRUKTAKI VERİYİ ALIP JSON FORMATINA CEVIRIYORU VE BIZ DE SADECE BIR SATIRLA O KOD YIGINLARINDAN KURTULMUSTUK.
- NODE JS , EXPRESSI GELEN HTTP ISTEKLERI ICIN TRAFIK POLISI OLARAK KAPIYA DIKIYOR.O AYRILAN OZEL ALANDAKI 3000 PORTU DIYELIM SADECE HTTP FORMATINDA GELEN VERILERI KABUL EDIYOR.BU TEK YONLU BIR ISLEM VERI GELDI EXPRESS ALDI ISLEDIK YANITI DONDUK OLAY BITTI.
  app.listen(3000) dediğinde, Express.js gizlice Node.js'in http motorunu çalıştırır ve işletim sistemine şu emri verir: "Bana 3000 numaralı kapıyı tut! Oradan gelen sadece HTTP şeklindeki metinleri içeri al."

- REALTIME CIFT YONLU BIR VERI AKISI OLAYI ICIN JAVASCRİPT KUTUPHANESI OLAN SOCKET.IO VE SOCKET IO NUN DA KULLANDIGI WEBSOCKET PROTOKOLU VAR. BURDA TEK SEFERLIK BIR VERI TRANSFERI YOK.PORTA ULASTIKTAN SONRA DUREKLIACIK OLAN BIR KANAL OLUSTURMAK ISTER.

- TAM DA BU NOKTADA NODE.JSIN TEMEL HTTP SUNUCUSUNU EXPRESIN KONTROLUNDEN CIKARIP YINE NODE JS IN KONTROLUNE VERMEK GEREKIYOR. BU SAYEDE NODE.JS GELEN ISTEKLERI KARSILARKEN HANGISININ API HANGSININ IO ISLEMI OLDUGUNU BILIR.BU ISLEME WRAP DENILIYOR

express(): Bizim katı HTTP bekçimiz.

createServer(): Node.js'in çekirdeğindeki saf, ilkel ağ motoru.

createServer(app): Express'i alıp, saf ağ motorunun içine hapsediyoruz. Artık kapıda Express değil, server adını verdiğimiz bu yeni yapı duruyor. Socket.io ancak bu server objesine tutunarak çalışabilir.
const httpServer = createServer(app);
// 3. Artık app.listen() yerine, sarmaladığımız httpServer'ı dinliyorum //
httpServer.listen(PORT, () => {
console.log(`Server is running on port ${PORT}`);
});

- **Durum:** In Progress
- **Jira Kartı:** `KTZ-110`
- **Mimari Kararlar & Ne Yaptım:**

- socket.io indirildi
- index.ts dosyasında En tepeye, Node.js'in çekirdeğinde zaten var olan http modülünü dahil et:
  import { createServer } from "http";
- const app = express(); tanımının hemen bir alt satırına geçerek Express uygulamamı yeni ağ motorunun içine hapsettim:
  const httpServer = createServer(app);
- app.listen(...) Artık kapıyı dinleyen Express (app) değil, sarmaladığımız yeni sunucu olacak sekılde değiştirdim
  httpServer.listen(...)

- index dosyasında basit bir test olusturdm :

yazdıgım koddakı metotların ne ıse yaradıkları

## io

Ana Merkez (Server) Bütün Socket.io sistemini, tüm odaları ve bağlı olan herkesi temsil eder. Binanın güvenlik şefidir.

## socket

    Bireysel Hat (Client)	Sadece tek bir kullanıcıyla (örneğin Ahmet'in tarayıcısıyla) sunucu arasındaki o özel, kopmaz "boruyu" temsil eder. Her bağlanan kişinin eşsiz bir socket.id değeri vardır.

.on() vs .emit()

Olay tabanlı (Event-Driven) mimarinin iletişim araçlarıdır. Socket.io'da HTTP'deki gibi GET/POST yoktur, sadece dinlemek ve konuşmak vardır.

    .on('olay_adi', fonksiyon) (Kulak): "Dinle" demektir. Karşı taraftan olay_adi etiketiyle bir veri gelirse uyan ve içindeki fonksiyonu çalıştır.

    .emit('olay_adi', veri) (Ağız): "Fırlat" demektir. Karşı tarafa olay_adi etiketiyle bir paket gönder.

```js io.on
 io.on("connection", (socket) => { ... })

Burada "Ana Merkez" (io), kapıyı sürekli dinler (on). Biri gelip içeri girdiğinde (yani connection olayı gerçekleştiğinde), o yeni kişiye özel bir iletişim hattı (socket) yaratılır ve bu hat fonksiyonun içine alınır.

*************
Müşteriyi Dinlemek
socket.on("ping", (mesaj) => { ... })

******
Artık io ile değil, sadece o an içeri giren müşteriyle (socket) ilgileniyoruz. Diyoruz ki: "Eğer bu müşteri kendi kanalından bize 'ping' adında bir paket fırlatırsaydı, onu yakala ve içindeki veriyi mesaj olarak oku."
----********
Müşteriye Cevap Vermek
JavaScript

socket.emit("pong", "Backend'den selamlar!");
Müşteri bize bir şey söyledi, şimdi ona cevap veriyoruz. Yine sadece o müşterinin kanalını (socket) kullanarak, "pong" etiketiyle ona bir metin fırlatıyoruz (emit).

```
