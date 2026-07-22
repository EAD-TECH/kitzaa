
# yaptiklarim

1. auth routelari olusturdum.
2. zod yükledim. 
3. validation klasoru olusturdum zod schemalari icin. 
4. schemalarin validation i icin validateBody midleware olusturdum. 
5. userschemda parent rolunu user la degistirdim. her kullanici parent olmak zorunda degil.
6. tüm dosyalardaki require importlarini düzelttim. config dosyalarin ve digerinde.
7. cookie parser paketi yukledim. daha guvenli olmasi icin refreshtoken i cookie icinde gonderdim. access token i headers ile
8. authenticaion middleware i  ekledim
9. permissions middleware i ekledim. (permissonlarda isLogin kismini kaldirdim. cunku authentication da ayni islemi yapiyor. sadece admin ve ya organizer gereken yerlere bu permissinolari koyucam.)
10. useer islemlerinde response da user bilgilerini gonderirken, merkezi bir fonksiyon olusturdum. helpers/toUserDTO.js
11. password update islemi icin ayri bir endpoint olusturdum. update isleminin karmasik olmamasi ve guvenlik acisindan daha iyi olmasi icin.



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



# event ve forum icin slug pre hook u

import { generateUniqueSlug } from '../helpers/slugify.js';
import Event from './eventModel.js';

eventSchema.pre('save', async function (this: EventDocument) {
  if (this.isModified('title')) {
    this.slug = await generateUniqueSlug(this.title, async (slug) => {
      const existing = await Event.findOne({ slug, _id: { $ne: this._id } });
      return !!existing;
    });
  }
});



forumPostSchema.pre('save', async function (this: ForumPostDocument) {
  if (this.isModified('title')) {
    this.slug = await generateUniqueSlug(this.title, async (slug) => {
      const existing = await ForumPost.findOne({ slug, _id: { $ne: this._id } });
      return !!existing;
    });
  }
});


