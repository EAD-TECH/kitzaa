
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


# yeni ögrendiklerim / sonradan bakmak istediklerim


```javascript

const createdBy = event.createdBy as unknown as UserDocument;  
```

createdBy => objectId döner. bu userDocumentteki id ile uyusmayabilir. o yüzden önce bilinmeyen bir tipe ceviriyoruz, sonra userDocument ye ceviriyoruz



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

****************************

eventlar olduktan sonra event status u otomatik completed yapmak icin **node-cron** kütüphanesini kullandim.

Her gün (veya her saat)
        |
        ↓
Backend otomatik çalışır
        |
        ↓
Tarihi geçmiş eventleri bulur
        |
        ↓
Status = completed yapar


src
 |
 ├── jobs
       └── eventStatus.job.ts
 





# Uploadthing uygulama

Resmin kendisi backend'e hiç uğramıyor — doğrudan tarayıcıdan UploadThing'in deposuna gidiyor. Ama link iki yere birden geliyor, sırasıyla:

1. Kullanıcı "resim seç" dediğinde, tarayıcı önce senin backend'ine gidip "ben resim yükleyeceğim, izin ver" diyor.
2. Senin backend'in (bekçi kontrolünü yaptıktan sonra) UploadThing'e "tamam, bu kullanıcı için geçici bir yükleme izni ver" diye soruyor, UploadThing de geçici bir "buraya yükle" adresi veriyor.

3. Backend bu geçici adresi tarayıcıya geri yolluyor.

4. Tarayıcı, gerçek resmi doğrudan o geçici adrese, yani 
5. UploadThing'e yolluyor — senin backend'in araya girmiyor, resim baytları hiç senin sunucundan geçmiyor.
UploadThing resmi aldıktan sonra, kendi kendine, arka planda senin backend'ini arıyor: "bu kullanıcı için şu resmi kaydettim, işte linki" diye. Bu, tarayıcının tetiklediği bir şey değil — UploadThing'in sunucusu senin sunucunu çağırıyor (buna "webhook" deniyor, bir sunucunun başka bir sunucuyu bilgilendirmesi).

6. Aynı anda, tarayıcıdaki yükleme işlemi de bitince, tarayıcı da aynı linki kendi tarafında görüyor (kullanıcı arayüzünde "yüklendi" yazması için).

┌──────────┐         ┌─────────────────┐         ┌───────────────┐
│ Frontend │────1───→│ UploadThing      │────2───→│ Sizin Backend │
│          │  dosya   │ Sunucusu         │ "kontrol │ (middleware)  │
│          │←──5─────│                  │←───3────│               │
└──────────┘  sonuç   │                  │  onay   └───────────────┘
                      │                  │
                      │                  │────4───→┌───────────────┐
                      │                  │ "bitti"  │ Sizin Backend │
                      │                  │←────────│ (onUploadComplete)│
                      └─────────────────┘          └───────────────┘
                      

******************

mevcut authentication middleware'ini olduğu gibi bağlayamıyoruz çünkü UploadThing'in middleware sistemi Express'in middleware sisteminden farklı bir kalıpla çalışıyor:

authentication.ts' (req, res, next) — işi bitince req.user = user yapıp next() çağırıyor, Express'in route zincirine bağlı.
UploadThing'in .middleware()'i ise ({ req, res }) => { ... return metadata } şeklinde çalışıyor — next() diye bir şey yok, req.user'a bir şey atamıyorsun, bunun yerine bir obje return ediyorsun ve o obje onUploadComplete'e metadata olarak geçiyor. Çünkü /api/uploadthing isteği senin normal Express route zincirinden (app.use('/api/v1', ...)) geçmiyor — createRouteHandler kendi içinde ayrı bir yönlendirme yapıyor.

******************

frontendde update image durumunda backend yeni resmi otomatik update edicek. frontende url yine gidicek ama frontendin url i backende gondermesine gerek yok.
ama create de frontend urlleri gondermeli kayit icin




# event state maschine helper

Neden faydalı

1.Bir "durum makinesi", bir şeyin hangi durumdan hangi duruma geçebileceğini açıkça tanımlayan bir kural seti. Amaç: rastgele/mantıksız geçişleri engellemek.

2.Diyelim admin panelinde bir buton hatası oldu ve aynı "onayla" isteği iki kez arka arkaya gönderildi (çift tıklama, network retry). State machine olmadan, ikinci istek de sorunsuz çalışır, hiçbir hata vermez ama mantıksız (zaten onaylı bir şeyi tekrar onaylıyor). State machine ile, ikinci istek anlamlı bir hata verir: "Invalid transition from approved to approved" — bu hem debug'ı kolaylaştırır hem veri tutarlılığını garanti eder.

pending ──────► approved ──────► completed
         │               │
         │               └──────► cancelled
         │
         └──────► rejected




# geo search

MongoDB'nin "GeoJSON" diye bir standardı var. Dünyadaki çoğu harita sistemi bunu kullanıyor. Google Maps, OpenStreetMap, Mapbox, MongoDB hepsi aynı standardı destekliyor.

GeoJSON'da nokta şöyle yazılır:

```javascript

{
    "type": "Point",
    "coordinates": [7.5889, 50.3569]  // dizi halinde tutmaliyiz cünkü GeoJSON standardi böyle.  lng, lat.(longitude, latitude)
}


// eski schema - MongoDB'nin geospatial sorguları için uygun değil. MongoDB $near, $geoWithin gibi sorguları doğrudan bu formatta kullanamaz. bu yüzden mongodb nin anliycagi sekle donusturdum.

coordinates: {
    type: {
        lat: { type: Number },
        lng: { type: Number },
    },
    _id: false,
    default: null,
}

//  yeni schema

coordinates: {
    type: {
        type: String,
        enum: ["Point"],
        default: "Point",
    },

    coordinates: {
        type: [Number],
        required: true,
    },
}

eventSchema.index({
    "location.coordinates": "2dsphere",  //2dsphere MongoDB'ye "bu alan dünya üzerindeki koordinatları içeriyor" diyen özel bir geospatial index türü.Bu index sayesinde $near, $geoWithin, $maxDistance gibi konum sorguları hızlı ve doğru şekilde çalışır.
});

```

********** UYGULANISI ***************

1. frontendde adres bilgilerini alirken lat ve lng yi de belirliycez. bunun icin GEOCODING servisine ihtiyacimiz olucak. koordinantlari frontendde datayla göndermis olucaz.

Kullanıcı adresi girer
        │
        ▼
Frontend geocoding servisine adresi gönderir
        │
        ▼
Servis latitude & longitude döndürür
        │
        ▼
Frontend adres + koordinatları birlikte backend'e gönderir
        │
        ▼
Backend MongoDB'ye kaydeder

----------------------------------------

frontendden su sekilde gelicek 

```javascript

{
    "title": "Zoo",
    "coordinates": {
        "lat": 50.35,
        "lng": 7.58
    }
}

biz bunu zod semada bizim mongoDB formatina ceviricek .transform ozelligiyle.  

.transform(({ lat, lng }) => ({
            type: 'Point' as const,
            coordinates: [lng, lat] as [number, number],
        })),

```