
# yaptiklarim

1. auth routelari olusturdum.
2. zod yükledim. 
3. validation klasoru olusturdum zod schemalari icin. 
4. schemalarin validation i icin validateBody midleware olusturdum. 
5. userschemda parent rolunu user la degistirdim. her kullanici parent olmak zorunda degil.
6. tüm dosyalardaki require importlarini düzelttim. config dosyalarin ve digerinde.
7. cookie parser paketi yukledim. daha guvenli olmasi icin refreshtoken i cookie icinde gonderdim.access tokeni response la. access token i headers bearer ile alicaz. 
8. authenticaion middleware i  ekledim
9. permissions middleware i ekledim. (permissonlarda isLogin kismini kaldirdim. cunku authentication da ayni islemi yapiyor. sadece admin ve ya organizer gereken yerlere bu permissinolari koyucam.)
10. useer islemlerinde response da user bilgilerini gonderirken, merkezi bir fonksiyon olusturdum. helpers/toUserDTO.js
11. password update islemi icin ayri bir endpoint olusturdum. update isleminin karmasik olmamasi ve guvenlik acisindan daha iyi olmasi icin.



# anlamadiklarim

```javascript

export const createEventSchema = baseEventSchema
  .strict()
  .refine((data) => data.isFree || !!data.price, {    // burasi ne anlam geliyor !!.
    message: 'Price is required for paid events',
    path: ['price'],
  });  

```



# fikirler

1. frontend de location kismini user dan alirken, locationinizi girerseniz yakininizdaki etkinliklerden haberdar olabilirsiniz gibi birsey yazalim. bu kisim opsionel.


# password reset algoritmasi

Kullanıcı
    │
    │ 1. "Şifremi Unuttum" butonuna basar
    ▼
POST /auth/forgot-password
    │
    │ Kullanıcı bulunursa
    │
    ├── Rastgele token oluştur
    ├── Token'ın hash'ini DB'ye kaydet
    ├── Expire time kaydet (15 dk)
    └── Mail gönder

Mail:

https://example.com/reset-password?token=abcdef123456.....

↓

Kullanıcı linke tıklar

↓

Frontend açılır

↓

Yeni şifre ister

↓

POST /auth/reset-password

{
   token,
   password
}

↓

Backend

- token hashle
- DB'de ara
- expire geçmiş mi?
- kullanılmış mı?
- yeni şifreyi hashle
- kullanıcı şifresini değiştir
- token sil

↓

Bitti.



 1. schemaya passwordResetToken(mail icin üretilen ve hashlenen token) ve PasswordResetExp(token ne kadar süre gecerli olucak)  

 2. forgot password icin root olusturdum. POST /auth/forgot-password



# mail gonderme

1. env. dosyasina mail icin gerekli key ler girilir
2. src/services/mail.service.ts dosyasi olusturulur. icerisine service modulu yazilir.
3. server.ts dosyasina import edildi.


----------------------------------------------------------------------------------------------------------

pre('save') ne zaman çalışır, ne zaman çalışmaz

pre('save') hook'u sadece .save() metodu çağrıldığında tetiklenir — hem yeni döküman oluştururken (create) hem de var olan bir dökümanı .save() ile güncellerken çalışır

# ornek event update pre('save') hooku ile

export const updateEvent = catchAsync<{ id: string }, {}, UpdateEventInput>(
  async (req, res: Response) => {
    const event = await Event.findById(req.params.id);

    if (!event) {
      throw new CustomError('Event nicht gefunden.', 404);
    }

    Object.assign(event, req.body);
    await event.save(); // ← pre('save') burada tetiklenir, slug güncellenir

    res.status(200).json({ status: 'success', data: event });
  }
);

----------------------------------------------------------------------------------------------------------





# category ile ilgili hersey

1. user sadece read ve list yapabiliyor. admin hepsini.




# event ile ilgili hersey

1.router.route("/:slug").get(read);  frontendde event read edilirken id ile degil slug ile cagrilicak, SEO acisidnan iyi olmasi icin.

2. Admin - incelenecek bekleyen etkinlikleri listele endpoint ile yapmiycaz. filter sorgusu ile yapicaz.

3. update ve delete lerde forum ve eventi req.resource icinden alicaz. cunku permissions larda isOwnerOrAdmin middlewareinde bu dokumani cagiriyoruz. tekrar sorgu yazip documani cagirmamiza gerek yok.

4. frontendde event create ederken isFree kismini biz true ya da false gondericez. organizerse false, degilse true gibi. bir de ucret ekleme kismi userlarda hic cikmiycak. organizatorlerde goruunucek sadece

5. organization etkinlik olustururken organizayson onaylandi mi diye ekstra controller da kontrol etmeye gerek yok. cünkü zaten role degisince logout oluyor ve organizator olarak yeniden login olmasi gerekiyor.

6. ilk event create edildiginde pending olarak controllerda yazmaya gerek yok. cunku schema da default:pending. ve zod schmaadan da bunu almadigimiz icin user tarafindan böyle bir alan gelmesine izin vermiyoruz. o yüzden güvenli.

7. JOIN / LEAVE / LIKE  gibi controllerlarda save() degil findByIdAndUpdate kullandim. cünkü save() de ayni anda farkli kisiler basarsa karisiklik olusabilir.kapasite de. likeda da ayni anda 2 kisi basarsa birininki digerini ezebilir

8. admin tüm eventlerin katilimcilarini görebilicek. user ve organizator sadece kendininkileri.




# Uploadthing uygulama

