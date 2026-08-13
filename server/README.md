# KULLANILAN PAKETLER
 1. SIFRE HASH: BCRYPT







# USER olmayanlar

🔹eventlari listeleyebilicek

# USER / organizator

**EVENT**

🔹event CRUD (kendi eventinin tüm crud islemlerini yapabilir.)(dogrulama gerekir.)
🔹mevcut eventa katilabilicek / katilimi iptal edebilicek
🔹tüm eventlari listeleyebilicek. read yapabilicek(detay sayfasi)
🔹likelama ve kayit islemi yapabilicek. 

**FORUM**

🔹forum title acabilir. CRUD islemlerini yapabilir
🔹tüm forum title larini goruntuleyebilir. read yapabilir.
🔹title a yorum yapabilir, 
🔹yorum lara cevap verebilir, likelayabilir, unlikelyabilir..

**ACTIVITY**

🔹activity olusturabilir,(dogrulama gerekir) crud islemlerini yapabilir. kendisininkilerin.
🔹tüm activityleri gorebilir, read yapabilir.
🔹likelayabilir, kayit edebilir.




# SORULCAKLAR

🔹odeme sistemi koyalim mi eventlar icin yoksa direk organizatorunn kendi sayfasina mi yonlendirelim?
🔹kategoriler i ayri tabloda mi tutalim.

# Brachlaramizi actik


### YAPILANLAR

 1.  BCRYPT  PAKETI KULLANILDI SIFRE HASHLEME ICIN :



bcrypt Kullan Eğer:
✅ Hızlı deployment gerekirse
✅ Basit kurulum/maintenance istersen
✅ Paylaşılan hosting kullanıyorsan
✅ Serverless ortam (Lambda, Vercel, Netlify)
✅ Ekip deneyimi bcrypt'te fazlaysa
✅ Enterprise compatibility önemliyse
Argon2 Kullan Eğer:
✅ Maksimum güvenlik istersen (banking, healthcare)
✅ Uzun vadeli security gerekirse
✅ Dedicated server/container kullanıyorsan
✅ Modern stack (Node 12+) varsa
✅ OWASP compliance zorunlu
✅ AWS/GCP managed services kullanıyorsan

2. USER tablosuna username bilgisi eklendi
3. 




 ### YAPILACAKLAR
 1. auth(login/register/logout) durumunu yapacagiz
    1.1. registerda mail dogrulama (mail hesabi acmaliyiz)
    1.2. loginde password unuttum olaylari
    1.3. loginde isEmailVerified kontrolü
    1.4. isActive mi kontrolu yapilacak
 2. jwt islemlerini yapmak
 3. authentication midleware olusturalim
 4. permissionlari role bazli olusturalim
 5. Organizatör basvurusu endpoitlerini yazmamiz lazim model/controller/routelari olusturmmaiz lazim
    5.1. Institution model
    5.2. Başvuru endpoint'i (POST /institutions/apply)
    5.3. Admin onay/red endpoint'leri
    5.4. notAlreadyApplied middleware (çift başvuru engeli)
    5.5. checkOrganizerApproved middleware
 6. Normal user icin model/controller/route/jwt olaylairni yapmmaiz lazim
 
 



 10.Like olaylari yapilacak event category ve forumlar icin 
    post islemi: event/id/postlike post islemi olacak bu bu sekile bir route oluisturulacak buraya istek atildiginda leki icinde user id sini kaldirip koyacak 
    getislemi :getlike yapacagiz events/id/getlike route olusturulacak. Burdada bir evente de ait tüm likelarini getirecegiz.



1.(a)
    1.1. registerda mail gönderme welcome to kindora (mail hesabi acmaliyiz)
    1.2. loginde password unuttum olaylari login rest
    1.3. admin/user controller /router eklenecek
    1.4. Admin onay/red endpoint'leri(organizatör olayi icin)

  

 3(d). Organizatör basvurusu endpoitlerini yazmamiz lazim model/controller/routelari olusturmmaiz lazim
  + 3.1. Institution model
    3.2. Başvuru endpoint'i (POST /institutions/apply)
    3.3. Admin onay/red endpoint'leri
    3.4. notAlreadyApplied middleware (çift başvuru engeli)
    3.5. checkOrganizerApproved middleware
    3.6. isEmailverified organitör form gönderdiginde mail gidecek



