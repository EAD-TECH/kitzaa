### NOTIFICATIONS TYPE TANIMLAMA :
recipientId:Types.ObjectId   // bıldırımı  
title:string  // bıldırımın baslıgı
isRead:false  // kullanıcı okudumu bıldırımını
dataPayload:string    /* postid veya eventid neredeyse kullanıcı bıldırıme tıklayacak ve sayfaya yonlendırlıck bu bılgıyı burdan cekmem lazım */ kızlar bunu ıkı farklı sekılde tutulack sekılde kurgulamıs lınk ve relatedId diye muhtemelen frontend rotası olck relatedId de types.object kullanarak ref verecek
message:bıldırımın ıcerıgı olacak

bildirimin bir type ı olabilir begeni mi yorummu  veya sıstem tarafından mı bıldırım aldı baska ne olabilir ?

admin: admınn kuyrugunda bekleyen meselabır organızator basvurusunu admın onayladı bunu type eklemem lazım
adminin gormesigereken bir yaklasan yenı bır event varsa bunun bıldırımının admıne mı gıtmesı lazım (bu bıldırım mail ile mı oluyor ? erd ye bak yıne)

uyelere eventtan bır gun once bıldırım at katılmayı unutmus olmaları ıhtımalıne karsı

nearby_event: yakınlarda yaklasan bır event yaklasıyorsa kullanıcılar notification alacak

bir kullanıcı bır kullanıcının postuna yorum attıysa postun sahıbıne gıdecek bıldırım eger kı kullanıcı tıklarsa bıldırıme navigate edilck corespan edilen yoruma


eger kı bır event cancel a duserse sıte uyelerıne bıldırm at 

Description

Create Notification model/schema (recipientId ref, type, title, message, link, relatedId, isRead) + indexes(aramayı kolaylastırmak adına ındex tanılamayı unutma)