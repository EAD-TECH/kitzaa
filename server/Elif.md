🎉 Event Platform — Backend Yol Haritası
Stack: Node.js · Express · MongoDB · Mongoose · JWT
Auth: Access Token (15dk) + Refresh Token (1gün, httpOnly cookie)
Roller: parent · organizer · admin

📁 Proje Klasör Yapısı
server/
├── index.js
├── .env
├── package.json
└── src/
├── constants/
│ ├── roles.js ← ROLES sabiti
│ ├── permissions.js ← PERMISSIONS tablosu
│ └── index.js ← tek export noktası
├── config/
│ └── dbConnection.js
├── models/
│ ├── userModel.js
│ ├── tokenModel.js ← (S3'te eklenir, refreshToken DB'de)
│ ├── organizerRequestModel.js
│ ├── institutionModel.js
│ ├── eventModel.js
│ ├── activityModel.js
│ ├── forumModel.js
│ ├── commentModel.js
│ └── eventCategoryModel.js
├── controllers/
│ ├── authController.js
│ ├── userController.js
│ ├── organizerRequestController.js
│ ├── eventController.js
│ ├── activityController.js
│ ├── forumController.js
│ └── commentController.js
├── middlewares/
│ ├── authentication.js ← verifyJWT + authorize
│ ├── queryHandler.js ← filter/search/sort/pagination
│ └── errorHandler.js
├── helpers/
│ ├── customError.js
│ └── tokenHelper.js
└── routes/
├── index.js
├── authRoute.js
├── userRoute.js
├── organizerRequestRoute.js
├── eventRoute.js
├── activityRoute.js
├── forumRoute.js
└── commentRoute.js
👥 Roller & Yetkiler
const ROLES = Object.freeze({
PARENT: "parent", // default — kayıt olan herkes
ORGANIZER: "organizer", // admin onaylı etkinlik organizatörü
ADMIN: "admin", // sistem yöneticisi
});
Permission → Rol eşleşmesi:

Permission Kimin erişebileceği
auth:refresh, auth:logout isActive: true herkes
user:readSelf, user:updateSelf isActive: true herkes
user:readAll, user:readOther, user:delete, user:ban, user:setRole Sadece isAdmin: true
organizerRequest:create, organizerRequest:readOwn isActive: true herkes
organizerRequest:readAll, organizerRequest:approve, organizerRequest:reject Sadece isAdmin: true
🔄 Model Bağımlılık Sırası

1. User → bağımsız (temel model)
2. Institution → bağımsız (organizer onayında oluşur)
3. OrganizerRequest → User'a bağlı
4. EventCategory → bağımsız
5. Event → User + EventCategory'e bağlı
6. Activity → Event'e bağlı
7. Forum → Event + User'a bağlı
8. Comment → Forum + User'a bağlı
   🗓️ SESSION PLANI
   SESSION 1 — Proje İskeleti + Altyapı
   Hedef: Sunucu ayağa kalksın, DB bağlansın, hata yönetimi çalışsın.

Yapılacaklar:

[ ] npm init → express, mongoose, dotenv, cors, helmet kur
[ ] index.js → Express sunucusu
[ ] src/config/dbConnection.js → MongoDB bağlantısı
[ ] src/middlewares/errorHandler.js → Global hata yakalayıcı
[ ] src/helpers/customError.js → Özel hata sınıfı
[ ] src/constants/roles.js + permissions.js + index.js
[ ] GET / → { message: "Welcome to Event Platform API" }
[ ] .env dosyası
PORT=8000
MONGODB=mongodb://127.0.0.1:27017/eventPlatform
ACCESS_TOKEN_SECRET=yourAccessSecret
REFRESH_TOKEN_SECRET=yourRefreshSecret
ACCESS_TOKEN_EXPIRE=15m
REFRESH_TOKEN_EXPIRE=1d
CLIENT_URL=http://localhost:5173
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=yourmail@gmail.com
EMAIL_PASS=yourAppPassword
** Test:** GET / → welcome mesajı dönüyor mu?

SESSION 2 — User Modeli + Register (Temel)
Hedef: Kullanıcı kaydı çalışsın, şifre hash'lensin, temel validasyon hazır olsun.

Yapılacaklar:

[ ] src/models/userModel.js
[ ] src/helpers/tokenHelper.js → generateAccessToken, generateRefreshToken
[ ] src/controllers/authController.js → sadece register
[ ] src/routes/authRoute.js → POST /auth/register
[ ] src/routes/index.js → route bağlama
User model alanları:

{
username: { type: String, required: true, unique: true, trim: true },
firstName: { type: String, required: true },
lastName: { type: String, required: true },
email: { type: String, required: true, unique: true, lowercase: true },
password: { type: String, required: true }, // bcrypt pre-save hook
role: { type: String, enum: ["parent","organizer","admin"], default: "parent" },
location: { type: String },
isActive: { type: Boolean, default: true },
isAdmin: { type: Boolean, default: false },
isEmailVerified: { type: Boolean, default: false },

// Token alanları (S3'te kullanılacak, şimdi tanımla)
refreshToken: { type: String, default: null, select: false },
emailVerificationToken: { type: String, default: null, select: false },
emailVerificationExpire: { type: Date, default: null },
resetPasswordToken: { type: String, default: null, select: false },
resetPasswordExpire: { type: Date, default: null },

// İlişkiler
institutionId: { type: ObjectId, ref: "Institution", default: null },
lastLoginAt: { type: Date, default: null },
loginAttempts: { type: Number, default: 0 },
// timestamps: true
}
** Güvenlik kuralı:** isAdmin, role body'den gelse bile görmezden gel:

// authController.js register:
const { username, firstName, lastName, email, password, location } = req.body;
// isAdmin ve role body'den ALINMIYOR
await User.create({ username, firstName, lastName, email, password, location });
** Test:** POST /auth/register → kullanıcı oluşuyor, şifre hashlenmiş mi?

SESSION 3 — Login + Token Sistemi + Logout
Hedef: JWT access/refresh token akışı, httpOnly cookie, gerçek logout.

Yapılacaklar:

[ ] authController.js → login, logout, refresh ekle
[ ] src/middlewares/authentication.js → verifyJWT + authorize
[ ] authRoute.js → POST /auth/login, GET /auth/logout, POST /auth/refresh
[ ] Cookie parser paketi → npm install cookie-parser
Login response formatı:

{
"error": false,
"accessToken": "eyJ...",
"user": {
"\_id": "...",
"username": "johndoe",
"email": "john@mail.com",
"role": "parent",
"isAdmin": false,
"firstName": "John",
"lastName": "Doe"
}
}
Token stratejisi:

accessToken → 15dk → response body
refreshToken → 1gün → DB'ye kaydet + httpOnly cookie
Login akışı:

POST /auth/login
→ username/email + password al
→ User DB'de var mı?
→ isActive: false? → 401 (hesap banlandı)
→ bcrypt.compare → yanlış → 401
→ accessToken üret → body
→ refreshToken üret → user.refreshToken = token → DB kaydet
→ lastLoginAt güncelle
→ cookie set (httpOnly, secure, sameSite)
→ 200
Logout akışı:

GET /auth/logout (verifyJWT zorunlu)
→ user.refreshToken = null → DB kaydet
→ res.clearCookie("refreshToken")
→ 200
Refresh akışı:

POST /auth/refresh
→ req.cookies.refreshToken veya req.body.refreshToken
→ Token yok → 401
→ user.refreshToken ile eşleşiyor mu? → yok → 401
→ jwt.verify → süresi dolmuş → 401
→ user.isActive? → false → 401
→ Yeni accessToken → body → 200
authentication.js middleware:

// verifyJWT → req.user set eder
// authorize("user:readAll") → PERMISSIONS'dan kontrol eder
Public route'lar (token gerekmez):

GET /
POST /auth/register
POST /auth/login
POST /auth/refresh
POST /auth/forgot-password
PATCH /auth/reset-password
GET /auth/verify-email
** Test:** Login → accessToken al → korumalı endpoint'e istek at → 401 mi 200 mi?

SESSION 4 — Email Doğrulama + Şifre Sıfırlama
Hedef: Email servisi çalışsın, token tabanlı doğrulama/reset akışı tamamlansın.

Yapılacaklar:

[ ] npm install nodemailer (veya Resend SDK)
[ ] src/helpers/emailHelper.js → sendEmail fonksiyonu
[ ] authController.js → verifyEmail, resendVerification, forgotPassword, resetPassword
[ ] authRoute.js → ilgili endpoint'leri ekle
Email doğrulama akışı:

Register sonrası:
→ crypto.randomBytes(32).toString("hex") → token
→ user.emailVerificationToken = hash(token) ← DB'de hash sakla
→ user.emailVerificationExpire = now + 24saat
→ Mail gönder: GET /auth/verify-email?token=xxx

GET /auth/verify-email?token=xxx
→ hash(token) ile DB'de ara
→ Bulunamadı veya süresi geçti → 400
→ user.isEmailVerified = true
→ user.emailVerificationToken = null
→ user.emailVerificationExpire = null
→ 200
Şifre sıfırlama akışı:

POST /auth/forgot-password { email }
→ User var mı?
→ crypto.randomBytes(32) → token → hash → DB kaydet
→ resetPasswordExpire = now + 10dk
→ Mail gönder: PATCH /auth/reset-password?token=xxx
→ 200 (user var olsa da olmasa da aynı mesaj → güvenlik)

PATCH /auth/reset-password?token=xxx { password }
→ Token DB'de var mı + süresi geçmemiş mi?
→ user.password = yeniŞifre ← pre-save hook hashler
→ user.resetPasswordToken = null
→ user.resetPasswordExpire = null
→ user.refreshToken = null ← TÜM cihazlardan çıkış!
→ 200
Endpoint'ler:

POST /auth/forgot-password → mail gönder
PATCH /auth/reset-password → ?token=xxx ile yeni şifre
GET /auth/verify-email → ?token=xxx ile doğrula
POST /auth/resend-verification → doğrulama mailini tekrar gönder
** Test:** Register → mail geldi mi? Link çalışıyor mu? Şifre reset akışı tamamlandı mı?

SESSION 5 — User CRUD + Admin Panel (Kullanıcı Yönetimi)
Hedef: Kullanıcı kendi profilini yönetsin, admin tüm kullanıcıları yönetsin.

Yapılacaklar:

[ ] src/controllers/userController.js
[ ] src/middlewares/queryHandler.js → filter/search/sort/pagination
[ ] src/routes/userRoute.js → /users
[ ] Admin route'ları ekle → /admin/users
User Controller fonksiyonları:

getProfile → GET /users/profile (user:readSelf)
updateProfile → PUT /users/profile (user:updateSelf)
changePassword → PUT /users/change-password (user:updateSelf)
Admin Controller fonksiyonları:

getAllUsers → GET /admin/users (user:readAll)
getUserById → GET /admin/users/:id (user:readOther)
banUser → PUT /admin/users/:id/ban (user:ban)
unbanUser → PUT /admin/users/:id/unban (user:ban)
setRole → PUT /admin/users/:id/role (user:setRole)
deleteUser → DELETE /admin/users/:id (user:delete)
Ban işlemi:

// Soft delete — user silinmez
user.isActive = false;
user.refreshToken = null; // aktif oturumu kapat
await user.save();
Şifre değiştirme:

// PUT /users/change-password { currentPassword, newPassword }
// 1. currentPassword doğru mu? (bcrypt.compare)
// 2. user.password = newPassword (pre-save hash)
// 3. user.refreshToken = null → tüm cihazlardan çıkış (opsiyonel)
queryHandler response formatı:

{
"error": false,
"data": [...],
"details": {
"count": 25,
"pages": 3,
"currentPage": 1,
"limit": 10
}
}
** Test:** Admin login → GET /admin/users → tüm kullanıcılar listelenyor mu? Ban işlemi o kullanıcının session'ını kesiyor mu?

SESSION 6 — OrganizerRequest + Institution
Hedef: Organizer başvuru akışı uçtan uca çalışsın.

Yapılacaklar:

[ ] src/models/institutionModel.js
[ ] src/models/organizerRequestModel.js
[ ] src/controllers/organizerRequestController.js
[ ] src/routes/organizerRequestRoute.js
[ ] Admin route'larına organizer request endpoint'leri ekle
OrganizerRequest model:

{
userId: { type: ObjectId, ref: "User", required: true },
message: { type: String },
institutionData: {
name: { type: String, required: true },
address: { type: String },
phone: { type: String },
website: { type: String },
},
status: { type: String, enum: ["pending","approved","rejected"], default: "pending" },
rejectedReason: { type: String, default: null },
reviewedBy: { type: ObjectId, ref: "User", default: null },
reviewedAt: { type: Date, default: null },
// timestamps: true
}
Institution model:

{
name: { type: String, required: true },
address: { type: String },
phone: { type: String },
website: { type: String },
ownerId: { type: ObjectId, ref: "User" },
// timestamps: true
}
Başvuru oluşturma kuralları:

// POST /organizer-requests
// 1. role === "organizer" veya "admin" → 403 (zaten organizatör)
// 2. status: "pending" olan aynı başvuru var mı? → 409
// 3. OrganizerRequest.create({ userId: req.user.\_id, ...body })
Admin onaylama akışı:

// PUT /admin/organizer-requests/:id/approve
// 1. request.status = "approved"
// 2. user.role = "organizer"
// 3. user.refreshToken = null ← yeni rolle yeniden login zorunda!
// 4. Institution.create(request.institutionData)
// 5. user.institutionId = institution.\_id
// 6. request.reviewedBy = req.user.\_id
// 7. request.reviewedAt = new Date()
// 8. Hepsini kaydet
Admin reddetme:

// PUT /admin/organizer-requests/:id/reject { rejectedReason }
// 1. request.status = "rejected"
// 2. request.rejectedReason = body.rejectedReason
// 3. request.reviewedBy + reviewedAt kaydet
// (user.role değişmez, tekrar başvurabilir)
Endpoint'ler:

POST /organizer-requests → başvur (organizerRequest:create)
GET /organizer-requests/my → kendi başvurum (organizerRequest:readOwn)

GET /admin/organizer-requests → tüm başvurular (organizerRequest:readAll)
GET /admin/organizer-requests/:id → detay (organizerRequest:readAll)
PUT /admin/organizer-requests/:id/approve → onayla (organizerRequest:approve)
PUT /admin/organizer-requests/:id/reject → reddet (organizerRequest:reject)
** Test:** Başvur → admin onayla → kullanıcı logout oldu mu? Yeniden login → role: "organizer" token alıyor mu?

SESSION 7 — Event + EventCategory CRUD
Hedef: Etkinlikler oluşturulsun, kategori ile ilişkilendirilsin.

Yapılacaklar:

[ ] src/models/eventCategoryModel.js
[ ] src/models/eventModel.js
[ ] src/controllers/eventController.js
[ ] src/routes/eventRoute.js
EventCategory model:

{ name: String (unique), description: String }
Event model:

{
title: { type: String, required: true },
description: { type: String },
categoryId: { type: ObjectId, ref: "EventCategory", required: true },
organizerId: { type: ObjectId, ref: "User", required: true },
location: { type: String },
startDate: { type: Date, required: true },
endDate: { type: Date },
isPublished: { type: Boolean, default: false },
maxAttendees:{ type: Number },
image: { type: String },
// timestamps: true
}
Yetki kuralları:

GET /events → herkese açık (public)
GET /events/:id → herkese açık
POST /events → sadece organizer veya admin
PUT /events/:id → sadece kendi etkinliği (organizer) veya admin
DELETE /events/:id → sadece kendi etkinliği (organizer) veya admin

GET /event-categories → herkese açık
POST /event-categories → sadece admin
PUT /event-categories/:id → sadece admin
DELETE /event-categories/:id → sadece admin
** Test:** Organizer login → event oluştur → public olarak listele → admin kategorileri yönetiyor mu?

SESSION 8 — Activity + Forum + Comment
Hedef: Etkinliklere bağlı aktiviteler, forum ve yorumlar çalışsın.

Yapılacaklar:

[ ] src/models/activityModel.js
[ ] src/models/forumModel.js
[ ] src/models/commentModel.js
[ ] İlgili controller ve route'lar
Activity model:

{
eventId: { type: ObjectId, ref: "Event", required: true },
title: { type: String, required: true },
description: { type: String },
startTime: { type: Date },
endTime: { type: Date },
speaker: { type: String },
location: { type: String },
}
Forum model:

{
eventId: { type: ObjectId, ref: "Event", required: true },
authorId: { type: ObjectId, ref: "User", required: true },
title: { type: String, required: true },
content: { type: String, required: true },
isPinned: { type: Boolean, default: false },
}
Comment model:

{
forumId: { type: ObjectId, ref: "Forum", required: true },
authorId: { type: ObjectId, ref: "User", required: true },
content: { type: String, required: true },
parentId: { type: ObjectId, ref: "Comment", default: null }, // nested reply
}
Populate zincirleri:

// Forum listesi: authorId.username, authorId.firstName populate
// Comment listesi: authorId.username, parentId populate (reply için)
// Activity listesi: eventId.title populate
** Test:** Event'e bağlı aktiviteler listeleniyor mu? Forum'a yorum yapılabiliyor mu?

Her Model İçin Tekrar Eden Döngü

1. src/models/{model}.js → Schema tanımla
2. src/controllers/{model}.js → list, create, read, update, delete
3. src/routes/{model}.js → Router + middleware bağla
4. src/routes/index.js → Ana route'a ekle
   Session → Model Eşleşmesi
   Session Model(ler) Kritik İş Mantığı
   S1 — Altyapı, constants, hata yönetimi
   S2 User Register, bcrypt pre-save, güvenli alan filtresi
   S3 — Login/Logout/Refresh, JWT çift token, httpOnly cookie
   S4 — Email doğrulama, şifre reset, crypto token
   S5 — Profil CRUD, admin ban/rol, queryHandler
   S6 OrganizerRequest, Institution Başvuru → onay → rol güncelle + refreshToken sıfırla
   S7 EventCategory, Event Etkinlik CRUD, organizer yetki kontrolü
   S8 Activity, Forum, Comment İlişkili içerik, populate zincirleri, nested reply
   Session Sonrası Test Checklist
   Tamamlanan Test Et
   S1 GET / → 200
   S2 POST /auth/register → user oluştu, şifre hashli
   S3 Login → token al → logout → token geçersiz mi?
   S4 Register → mail geldi → link çalışıyor mu?
   S5 Admin → ban → o user logout oldu mu?
   S6 Başvur → onayla → role: organizer, yeniden login
   S7 Organizer → event oluştur → public görünüyor mu?
   S8 Forum → yorum → nested reply çalışıyor mu?
   Kritik Güvenlik Notları
   Konu Karar Neden
   refreshToken DB'de saklanır Gerçek logout, token çalınma koruması
   isAdmin register'da Body'den görmezden gelinir Güvenlik açığı önleme
   Organizer onayı refreshToken sıfırlanır Yeni rolle yeniden login zorunda
   Şifre reset refreshToken silinir Tüm cihazlardan çıkış
   Ban işlemi refreshToken silinir Aktif oturumu hemen keser
   accessToken süresi 15dk Çalınsa bile kısa ömürlü
   refreshToken süresi 1gün Kullanılabilirlik dengesi
   Email doğrulama token DB'de hash olarak saklanır Token çalınsa bile kullanılamaz
   Hızlı Başlangıç
   cd server
   npm init -y
   npm install express mongoose dotenv cors helmet cookie-parser bcrypt jsonwebtoken nodemailer crypto express-async-errors
   npm install -D nodemon

cp .env.sample .env

# .env içini doldur
