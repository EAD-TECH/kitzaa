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
