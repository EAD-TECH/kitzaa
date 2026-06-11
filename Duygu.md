## 👤 Register’da User Role Bilgisi Nasıl Alınmalı?
> [!IMPORTANT]
> **Önerilen yaklaşım:**  
> Kullanıcı kayıt olurken herkes varsayılan olarak `parent` rolüyle sisteme alınmalıdır.

### ✅ Neden önce `parent`?

- Kullanıcıyı sisteme almak daha kolay olur.
- Register formu sade kalır.
- Organizer olmak isteyen kullanıcı sonradan başvuru yapar.
- Admin bu başvuruyu onayladıktan sonra kullanıcının rolü yükseltilir.

> [!TIP]
> Bu model Airbnb, Etsy ve Udemy gibi platformlarda da kullanılan daha güvenli ve ölçeklenebilir bir yaklaşımdır.
🛣️ Kod akisi su sekil olur
Kayıt → parent
   └─ İstediği zaman → "Organizer Başvurusu" formu doldurur
         └─ Admin onaylar
               └─ role: organizer, status: approved

Organizer başvurusunda kullanıcı şunu diyebilmeli:

"Ben Max Müller'im, Spielhaus Berlin adına etkinlik düzenliyorum."

Yani kişisel kimlik (User) ile kurumsal kimlik (OrganizerProfile) ayrı şeyler. Biri zaten var, diğeri başvuruyla oluşur.
User
├── email: max@gmail.com      ← kişisel, login için
└── OrganizerProfile
    ├── organizationName: "Spielhaus Berlin"
    ├── contactEmail: info@spielhaus-berlin.de   ← halka gösterilen
    └── website, phone, description...
