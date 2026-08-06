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

---

## [[NOT-016] - Notifications / Event reminder](https://dygcankurt17.atlassian.net/browse/KTZ-57)

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





- İlk olarak organizerPrepJob dosyasını actım
- Bir sonrakı gun olucak olan Eventları çektım
- Organızatorlere bildirim atmak için buldugum etkinlik dızısı uzerınde map ile donerek her etkinliğin katılımcısının sayısını buldum 
- message kısımları ıcın ne yazacagımı bılmedıgımden bu sekılde bır test mesaj yazdm
- sonrasında return ıle bıldırım paketimin kutusunu olusturup InsertMany ile DB ye kaydediyorum.
- Aslında toplu ve teklı bıldırımler ıcın helper dosyasında bıldırım paketı template lerı olusturmustum ama etkınlıklerın kısı sayıları vs her etkınlıgın farklı bır kıtlesı oldugu ıcın burda kendım olusturdm
- Jobs kısmını normalde server/index içinde cagırıp tetıklemek gerekıyor ama sonrakı tasklar ıcın index sayfasını sısırmemek adına jobs ıcınde ayrı ındex acıp onu ana indexe import ettm.Basta su geldı aklıma :  mesela farklı bıldırımlerın saatlerı aynı olabılır nasıl olur dıye ? Node.js in asenktron calısma mantıgı bunları single thread olarak sıraya alıp db den once hangı yanıt gelırse onu calıstırıyor.ms farkıyla db den yanıt geldıgı ıcın kodların calısmasında sorun yok ama bd ye atılan sorgular darbogaz olusturmasın dıye bır tanesını 5 dk olacak sekılde tetıkledım.
- Bu taskı sonradan ekledıgım ıcın bildirim tipine "organizer_prep_summary", bu kısmı ekledım.
- Manuel olarak da route sayfasına kod blogu yapıstırp manuel testını yaptım
- refPath mantıgını kullandıgm ıcın createHelper fonksıyonunu bu sekılde guncellemeyı unuttugm ıcın burda guncelldım bu kısmı da


- Test kodu 
``` js
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



   ## [[KTZ-59-NOT-018] - Notifications / Post Comment](https://dygcankurt17.atlassian.net/browse/KTZ-59)

- **Durum:** In Progress
- **Jira Kartı:** `KTZ-59`
- **Mimari Kararlar & Ne Yaptım:**

- Service klasorunde yorumlar için dosya actım.Gerekli bilgilleri user Yorumu yapan kişi ;kendi kendinemi yorum yaptı kalkanında gonderı sahıbı ıle karsılastırdıgım kısım bu.ValidatedData bunun ıcınden parentCommentId sini almak ıcın ,post ve newCommentId yi cektim .
- post.authorId :Gonderinin sahibi Hedefdeki kişi bildirimi alan recipientId
-validatedData.parentCommentId(Ust yorumun id si ):Burası da benım filtre kalkanım.Eğer bir ID varsa(eger biri yoruma yanıt verıyorsa ) if blogu bısey yapmadan duruck
- newCommentId (Oluşturulan Yeni Yorumun ID'si) & post._id: Bunlar sadece Frontend ekibi için kullandığımız yönlendirme tabelalarıdır. Uygulamanın o gönderiyi bulup ilgili yoruma kayabilmesi (scroll yapabilmesi) için linkNotification içine yerleştirdiğimiz koordinatlardır.
- Agacın Govdesi : Gonderim (POST)
- ANA DALLAR : Gonderiye yapılan ilk yorumlar
- Yapraklar: Yorumlara verilen yanıtlar(Replies)
Veritabanında yorum olusturulurken sisteme sunu soruyorm: Bu yorum kımın cocugu. Bir parentı varmı
Eger birisi benin postuma yorum yapıyorsa (AnaDal) bu yorumun parentı yok.FE bana parentId null atıcak
- Eğer biri bennim yorumuma "Kesinlikle katılıyorum" diye yanıt veriyorsa (Küçük Yaprak), bu yorumun bir babası vardır. Frontend bana babanın ID'sini parentCommentId: "65b" şeklinde gönderir.
 !validatedData.parentCommentId = bu bossa yorumun herhangı bır parentı yoksa bunu true dondum
 sonuc true bıldırım atacak ama FE dolu yollarsa false olucagından bıldırm atmıycm
- Service katmanında sorgularımı yapıp Helperdakı fonskıyonumu cagırdım bıldırm paketını olusturp db ye kaydetmıs oldum.





