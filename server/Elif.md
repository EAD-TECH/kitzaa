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
