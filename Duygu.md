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










> [!WARNING]
> Dikkat
 savedEvents / savedActivities büyüme riski
Bunu önceki analizde de söyledim — bu array'ler User dökümanı içinde büyüdükçe sorun çıkarır. Ama bu ayrı bir karar, şimdilik not olarak geçelim.

---

## 🗂️ Sprint 1 — Organizatör Başvuru Görevlerim (BE-017 → BE-026)

**Tasarım kararı:** İki model → `OrganizerApplication` (başvuru = state machine) + `Institution` (onayda oluşur). Backlog'daki `/institutions/apply` yerine kendi tasarımımızla (`/organizer-applications`) devam ediyoruz. "e" kişisi olmadığı için admin onay/red görevleri (BE-024/025/026) de bende.

**İşaretleme:** `- [x]` tamamlandı · `- [ ]` yapılacak

### ✅ Tamamlananlar
- [x] `src/types/organizerApplication.types.ts` — başvuru tipleri (IOrganizerApplication, IInstitutionData, IStatusHistory, enum'lar, model/document tipleri)
- [x] `src/models/organizerApplicationModel.ts` — başvuru şeması (state machine alanları, statusHistory, gömülü alt-şemalar, generic bağlama)
- [x] **BE-017** — Institution model + tipler (`institution.types.ts`, `institutionModel.ts`) + ERD güncellemesi

### ⏳ Yapılacaklar
- [ ] **BE-027** — Zod şemaları: başvuru + admin aksiyonları (`organizerApplication.schema.ts`) 👈 SIRADA
- [ ] `req.user` tiplemesi (`src/types/express.d.ts`)
- [ ] **BE-022** — `isEmailVerified` middleware (başvurudan önce zorunlu)
- [ ] **BE-020** — `notAlreadyApplied` middleware (çift başvuru engeli)
- [ ] **BE-021** — `checkOrganizerApproved` middleware
- [ ] State machine helper — `assertTransition(from, to)` (izinli geçişler)
- [ ] **BE-018 / BE-019** — başvuru controller + router (`POST /organizer-applications` apply, `GET /my`)
- [ ] **BE-023** — başvuru sonrası bilgilendirme maili
- [ ] **BE-024** — admin: başvuruyu onaylama endpoint'i
- [ ] **BE-025** — admin: başvuruyu reddetme (opsiyonel sebep)
- [ ] **BE-026** — onaydan sonra kullanıcı rol/status güncelleme (organizer + refreshToken sıfırlama)
- [ ] Test: başvur → admin onayla → kullanıcı organizer oldu mu, institution oluştu mu, yeniden login token role=organizer mi