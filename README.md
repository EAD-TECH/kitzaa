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
 1. Like olaylari yapilacak event category ve forumlar icin 
    post islemi: event/id/postlike post islemi olacak bu bu sekile bir route oluisturulacak buraya istek atildiginda leki icinde user id sini kaldirip koyacak 
    getislemi :getlike yapacagiz events/id/getlike route olusturulacak. Burdada bir evente de ait tüm likelarini getirecegiz.