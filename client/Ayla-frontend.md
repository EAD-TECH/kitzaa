

# Thema degisimi

themayi su kodla direk degistirebiliyoruz

```javascript

"use client";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      Tema değiştir
    </button>
  );
}


```

# global css dekilerin anlamlari

---@theme bloğu, Tailwind'e "şu değişkenlere göre yeni class'lar üret" diyor.
---@theme inline diyince Tailwind'e "bu değeri build anında sabitleme, class'ı üret ama gerçek değeri tarayıcıda, o an CSS değişkeninin ne olduğuna bakarak çöz" diyorsun. Yani bg-primary class'ı üretiliyor ama içindeki gerçek renk, tarayıcı sayfayı render ederken .dark class'ı var mı yok mu diye bakıp o anda karar veriyor. @theme bunu runtime da yapamiyor. dark mode calismaz sadece @theme yazarsak.

--------------

components/ = görsel parçalar
features/ = işe özel kod (component + state + hook bir arada)
lib/ = saf mantık, fonksiyon — ne görsel ne de bir işe özel, sadece "yardımcı işlev

------------


# next-themes kütüphanesi

Kullanıcı bir butona tıkladığında, <html>'e class="dark" ekle ya da çıkar.
Kullanıcı sayfayı yenilediğinde, "az önce dark mode'daydı" bilgisini hatırla, tekrar class="dark" ekle.
Kullanıcı hiç seçim yapmadıysa, işletim sisteminin (Windows/Mac) "koyu tema" ayarına bak, ona göre başla.

Bunların hepsini elle kendin yazabilirsin (localStorage'a kaydet, useEffect ile oku, document.documentElement.classList.add("dark") gibi kodlarla) ama bu epey tekrar eden, hataya açık bir iş. next-themes, tam olarak bu işi senin yerine yapan bir kütüphane.

--- provider olarak bir yerde tanimliyoruz ve layout,tsx i bununla sarmanliyoruz.

"use client" Zorunluluğu: next-themes kütüphanesi kullanıcı tercihlerine (localStorage, system preference) eriştiği için bir Client Component olmak zorundadır.

Mimarinin Korunması: Eğer layout.tsx dosyasının en üstüne "use client" ekleyip NextThemesProvider'ı doğrudan orada kursaydık, tüm layout'u ve altındaki tüm sayfaları Client Component'e dönüştürmüş olurduk.


# Register

- zip kodundan sehir ve eyaleti otomatik getirmesi icin **Zippopotam.us API** kullandim.
- sehir zip kodu ve eyalet girmesi zorunlu.
- stepper kullandim **reui.io** kutuphanesinden



***********************

nextjs in loading yapisi sadece server komponentlerde calisiyor. fech islemi serverda yapiliyor. ordaki hatalari yakaliyor

Bir Server Component async function Page() { const data = await fetch(...); ... } şeklinde yazılabiliyor — React bu await'i "suspend" olarak görüyor, loading.tsx devreye giriyor.
Fetch/DB sorgusu throw ederse, bu render'ı kırıyor, error.tsx yakalıyor.
Client Component'lerde ise normal useState/useEffect/useQuery ile veri çekmek bu mekanizmayı tetiklemiyor — çünkü veri component mount olduktan sonra, render bittikten sonra geliyor; hiçbir şey "suspend" olmuyor, sadece state güncelleniyor ve component yeniden render oluyor. Senin useMutation/useQuery kullanımın (register, login) tam olarak bu — render'ı hiç suspend etmiyor, o yüzden loading.tsx/error.tsx'in haberi bile olmuyor.

***********************

**********************

```javascript

<form onSubmit= {form.handleSubmit(onSubmit)}></form>

```
Kullanıcı submit'e basar
   ↓
form.handleSubmit(onSubmit) devreye girer
   ↓
preventDefault() otomatik çağrılır + validation çalışır
   ↓
Validation geçerse → senin onSubmit(data) fonksiyonun, doğrulanmış data ile çağrılır

**********************



# Filter 

```javascript

const pathname = usePathname()    // Şu an hangi sayfadasın, onu verir.
const searchParams = useSearchParams()   //  Şu anki URL'deki ?kategoriler=Natur&mesafe=25 kısmını okumak için kullanılan araç.

const params = searchParams.get(key)   // . Örnek: URL ?mesafe=25 ise:  getParam('mesafe') // "25" döner
const params = searchParams.getAll(key)   // Bazı param'lar birden fazla değer alabilir. getAll('kategoriler') // ["Natur", "Sport"] döner (dizi olarak). getParam sadece ilk değeri verirdi, getAll hepsini verir.

params.delete(key)   // o key'i URL'den tamamen siliyor

if (Array.isArray(value)) {
  value.filter(Boolean).forEach((v) => params.append(key, v))  //  Eğer value bir dizi ise (örn. ["Natur", "Sport"]), her birini tek tek URL'e ekliyor → ?kategoriler=Natur&kategoriler=Sport.  
  // .filter(Boolean) kısmı: dizide null, undefined, "" gibi "boş" değerler varsa onları atıyor, sadece gerçek değerleri ekliyor.


params.set(key, value)   // Var olan değeri değiştirir / üzerine yazar. Aynı key'i birden fazla kez set edersen, sadece son değer kalır. 
params.append(key, value)     //Ekler, üzerine yazmaz. Aynı key'i birden fazla kez append edersen, hepsi URL'de birikir.


searchParams.toString()   // Bu, o obje içindeki param'ları düz bir metin (string) haline çeviriyor. 


```


*****

router.replace(`${pathname}?${params.toString()}`, { scroll: false })

**Neden push değil replace**

Next.js'te router.push yeni bir URL'e gidildiğinde tarayıcı geçmişine (history'ye) yeni bir kayıt ekler. router.replace ise mevcut kaydın üzerine yazar, yeni kayıt eklemez.

Eğer push kullansaydık: kullanıcı 10 tane checkbox'a art arda tıklarsa, tarayıcı geçmişine 10 farklı adım eklenir. Kullanıcı "geri" tuşuna bastığında, her tıklama için ayrı ayrı geri gitmesi gerekir — çok can sıkıcı olurdu.

replace ile: checkbox'lara kaç kere tıklarsan tıkla, geçmişte tek bir kayıt kalır (sayfaya ilk girdiğin an). Kullanıcı "geri" tuşuna basınca direkt bir önceki sayfaya gider, filtre adımları arasında tek tek gezmez.

*****

**CHECKBOX AKISI**

A) Sayfa ilk açıldığında

options = categories.map(...) çalışır → categories prop'undaki (backend'den gelen kategori listesi) her elemandan {label: c.name, value: c.slug} çifti üretir. Örn: {label: "Sport", value: "sport"}.
useQueryParams() çağrılır → getAll ve setParam fonksiyonlarını verir (bunlar URL'i okuyup yazan araçlar, useQueryParams.ts'de tanımlı).
selected = getAll("category") çalışır → tarayıcının o anki adres çubuğuna bakar. URL'de ?category=sport&category=musik varsa ["sport", "musik"] döner; hiç yoksa boş dizi [] döner.
return (...) çalışır, FilterCheckboxGroup'a üç şey prop olarak geçilir: options (ne gösterilecek), selected (hangisi işaretli görünecek), onChange (tıklanınca çağrılacak fonksiyon — henüz çalışmadı, sadece "hazırda bekliyor").
FilterCheckboxGroup içeride options.map() ile her biri için bir checkbox çizer; her checkbox'ın işaretli olup olmadığı selected.includes(option.value) ile belirlenir.
B) Kullanıcı bir checkbox'a tıkladığında

FilterCheckboxGroup içindeki toggle(value) çalışır: tıklanan value zaten selected içindeyse çıkarır, yoksa ekler → yeni bir dizi (next) oluşturur.
onChange(next) çağrılır → bu, senin CategoryFilter'da yazdığın (slugs) => setParam("category", slugs) fonksiyonudur. slugs = adım 6'daki yeni dizi.
setParam çalışır (hook'un içinde): mevcut URL parametrelerini kopyalar, eski category değerlerini siler, yeni slugs dizisindeki her elemanı ?category=... olarak tekrar ekler, sonra router.replace(...) ile sayfayı yenilemeden tarayıcı URL'ini değiştirir.
URL değiştiği için Next.js, useSearchParams() kullanan bileşenleri (yani useQueryParams'ı kullandığı için CategoryFilter'ı) otomatik yeniden render eder.
Yeniden render'da 3. adım (selected = getAll("category")) tekrar çalışır — bu sefer URL güncel olduğu için selected yeni değerleri içerir → checkbox'lar buna göre işaretli/işaretsiz görünür.
Özet: state React'in kendi hafızasında (useState) değil, URL'de tutuluyor; tıklama → URL güncellenir → bileşen URL'i tekrar okur → ekran güncellenir şeklinde bir döngü var.


*****

**PAGE:TSX DE SEARCHPARAMS ALMAK**

page.tsx'e neden searchParams alıp awaitleyip EventList'e geçirdiğimizin özeti: Next.js, URL'deki query string'i (?category=sport) sadece page.tsx'e otomatik olarak (bir Promise şeklinde) veriyor, bu yüzden önce await ile çözüyoruz. EventList ise bir Server Component olduğu için useSearchParams() gibi hook'ları kullanamıyor — dolayısıyla URL bilgisini kendi başına okuyamıyor. Bu yüzden page.tsx'te çözdüğümüz searchParams'ı elle (prop drilling) EventList'e geçiriyoruz ki, o da backend'den doğru filtrelenmiş event'leri sunucu tarafında çekebilsin.

******

**ORGANISATOR FILTER**

OrganisatorFilter.tsx — zaten {label: 'Organisationen', value: 'organisation'} / {label: 'Privat', value: 'privat'} şeklinde value'ları var. useState yerine useQueryParams'a bağla: getAll('organisator') / setParam('organisator', values) — tıpkı CategoryFilter'daki gibi.

eventApi.server.ts → buildEventQuery — category için yaptığımız gibi, organisator param'ını da comma-joined string olarak backend'e geçir (params.set("organisator", values.join(","))).

eventController.ts → list — req.query.organisator'ı oku, "organisation" → "organizer", "privat" → "user" rolüne çevir, sonra User.find({role: {$in: roles}}).select("_id") ile eşleşen kullanıcı id'lerini bul, customFilter.createdBy = {$in: userIds} olarak ekle. Bunun için dosyanın başına import User from "../../models/userModel.js"; eklemen gerekecek (şu an import edilmemiş).


******

**LOCATION FILTER**

1. Kullanıcının konum belirtmesinin üç yolu var
Bu üç yoldan biri çalıştığında hep aynı sonuca varılıyor: URL'e lat, lng, radius yazılması.

a) Şehir/PLZ yazmak
Kullanıcı input'a "Düsseldorf" yazar. Her tuş vuruşunda hemen bir şey yapılmıyor — 500ms bekleniyor (debounce), yazmayı bırakınca kendi backend'imizdeki /api/geocode endpoint'ine istek atılıyor. O da bunu OpenStreetMap'in Nominatim servisine iletip "Düsseldorf" için koordinat (lat, lng) istiyor, sonucu bize dönüyor.

b) "Konumu kullan" butonuna tıklamak
Tarayıcının kendi navigator.geolocation API'sine "konumu ver" deniyor. Tarayıcı kullanıcıya izin sorusu gösteriyor, izin verilirse cihazın gerçek koordinatları elde ediliyor — hiçbir dış servise gerek yok.

c) Hiç konum yokken direkt slider'ı sürüklemek
Bunu da (b) ile aynı sonuca bağladık: eğer henüz hiçbir konum girilmemişse, slider'ı bırakınca sistem otomatik olarak (b)'deki gibi tarayıcıdan konum istiyor — kullanıcı ayrıca butona basmak zorunda kalmıyor.

2. Koordinat bulununca ne oluyor
Hangi yoldan gelirse gelsin (a, b veya c), sonuç aynı yere gidiyor: lat, lng ve radius (km) tek seferde tarayıcının adres çubuğundaki URL'e yazılıyor (?lat=...&lng=...&radius=...). Üçünü aynı anda yazmamızın sebebi: birini yazıp diğerini unutursak (örn. sadece lat/lng yazılıp radius unutulursa) filtre yarım kalır, hiç çalışmaz.

3. Slider'ın kendine özgü bir detayı var
Slider'ı sürüklerken her an URL'i güncellemiyoruz — bu saniyede onlarca kez URL değiştirip sayfayı yavaşlatırdı. Bunun yerine sürüklerken sadece görsel pozisyon (local, geçici bir değer) güncelleniyor; kullanıcı parmağını/mouse'u bıraktığı an gerçek URL güncellemesi bir kere yapılıyor.

4. URL değişince arka planda ne oluyor
URL değiştiği an, sayfa bu yeni parametreleri (lat, lng, radius, ve diğer tüm filtreleri) alıp kendi backend'imize (/api/v1/events) bir istek atıyor. Backend, bu koordinat + yarıçapı MongoDB'nin coğrafi sorgu özelliğine ($geoWithin + $centerSphere) çeviriyor — "etkinliğin konumu, bu merkez noktadan şu km içinde mi" diye veritabanına soruyor. Sadece bu şarta uyan (ve aynı zamanda diğer aktif filtrelere de uyan) etkinlikler dönüyor, ekrana onlar basılıyor.

5. Temizleme
Input'ta yazı varken veya bir konum ayarlıyken, sağda bir "×" butonu beliriyor. Tıklanınca: yazılan şehir metni siliniyor, hata mesajı varsa temizleniyor, ve lat/lng/radius üçü birden URL'den kaldırılıyor — slider da otomatik olarak varsayılan 25'e dönüyor, sistem "hiç konum filtresi yokmuş" haline geri geliyor.

6. Hata durumları
Kullanıcı konum iznini reddederse, cihazda konum bulunamazsa, işlem çok uzun sürerse, ya da yazılan şehir bulunamazsa — her durumda ekranın altında kırmızı bir uyarı metni gösteriliyor, sessizce başarısız olunmuyor.


-----------------

Kullandığımız teknolojiler/servisler: tarayıcının Geolocation API'si (konumu kullan butonu için), OpenStreetMap Nominatim (şehir adını koordinata çevirmek için, ücretsiz dış servis), MongoDB'nin $geoWithin/$centerSphere coğrafi sorgu operatörleri (zaten var olan 2dsphere index'i kullanarak), ve daha önce kurduğumuz URL tabanlı filtre sistemi (useQueryParams).

Dosya dosya, sırayla ne yaptık:

1. client/features/events/hooks/useQueryParams.ts (var olan dosya, güncellendi)
Mevcut setParam (tekil) fonksiyonunun yanına setParams (çoğul) eklendi — birden fazla URL parametresini (lat, lng, radius) tek seferde, tek bir router.replace ile yazabilmek için.

2. client/app/api/geocode/route.ts (yeni dosya oluşturuldu)
Next.js'in "Route Handler" özelliğiyle kendi backend endpoint'imizi yazdık: GET /api/geocode?q=Düsseldorf isteği alıyor, Nominatim'e (gerekli User-Agent header'ıyla) iletiyor, dönen sonuçtan lat/lng'i alıp sadeleştirip geri döndürüyor. (İlk başta yanlışlıkla [locale] klasörünün içine konulmuştu, sonra doğru yere — app/api/ altına — taşındı.)

3. client/features/events/components/filterSidebar/LocationFilter.tsx (var olan dosya, en çok değişen)

Radius artık local useState değil, URL'den (useQueryParams) okunuyor.
Şehir input'u yazılabilir hale getirildi; yazmayı bırakınca (debounce) /api/geocode'a istek atıp gelen koordinatı URL'e yazan bir useEffect eklendi.
useCurrentLocation fonksiyonu yazıldı — tarayıcıdan konum isteyip başarı/hata durumlarını yönetiyor.
Slider'ın performans sorunu çözüldü: sürüklerken sadece görsel (liveRadius) güncelleniyor, bırakınca (onValueCommitted) URL'e yazılıyor.
Slider'ı konum yokken bırakınca otomatik useCurrentLocation tetiklenmesi eklendi.
Temizleme butonu (clearLocation) ve "×" ikonu eklendi.
spellCheck/autoCorrect kapatıldı (tarayıcının kırmızı alt çizgisi için).
4. client/features/events/api/eventApi.server.ts (var olan dosya, güncellendi)
buildEventQuery fonksiyonuna, URL'deki lat/lng/radius'un üçü birden varsa bunları backend'e giden isteğe ekleyen bir blok eklendi.

5. server/src/controllers/user/eventController.ts (var olan dosya, güncellendi)
list handler'ına, gelen lat/lng/radius'u doğrulayıp (Number.isFinite, aralık kontrolleri), geçerliyse km'yi radyana çevirip customFilter["location.coordinates"] = {$geoWithin: {$centerSphere: [...]}} olarak ekleyen blok eklendi — bu da diğer filtrelerle (kategori, yaş, organizatör) aynı customFilter mekanizmasına katılıyor.

Akışın özeti (dosyalar arası): LocationFilter.tsx (konum alır) → URL güncellenir → eventApi.server.ts (URL'i backend isteğine çevirir) → eventController.ts (MongoDB sorgusuna çevirir) → sonuç EventList'e döner.

-----------

Proxy = aracı demek.

Senin Next.js sunucun burada aracı görevi görüyor:

Tarayıcı → Next.js sunucu → Nominatim
Tarayıcı Next.js'e istek atar
Next.js o isteği alır, Nominatim'e iletir
Nominatim'den cevap gelir, Next.js tarayıcıya iletir. Nominatim, OpenStreetMap'in ücretsiz geocoding servisi.
Yani Next.js burada proxy oluyor. Tarayıcı ile Nominatim arasında postacı gibi davranıyor.


******



# useCallBack

useCallback neden kullanıyoruz?

Normalde bir component her render olduğunda, içindeki her fonksiyon yeniden oluşturulur — yani bellekte yeni bir nesne olur.

useCallback şunu der: "Bu fonksiyonu sadece bağımlılıklar değiştiğinde yeniden oluştur, gereksiz yere tekrar oluşturma."






# Loading.tsx

loading.tsx yokken hiç boundary yok → tamamen "all-or-nothing", hiçbir şey/boş ekran
loading.tsx varken ama lokal <Suspense> yokken → "hepsi ya da hiçbiri" değil ama tek parça — tüm sayfa aynı anda tek bir skeleton'a dönüşüyor (senin yaşadığın)
Lokal <Suspense>'ler eklenince → her parça bağımsız, granular
loading.tsx bu yüzden zaten faydalı bir "güvenlik ağı" (fallback için varsayılan) — ama her component'e özel boundary koymadıkça hepsini tek potada eritiyor.
