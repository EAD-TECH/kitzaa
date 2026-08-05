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