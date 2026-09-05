## [KTZ-136-ADMİN-ROUTE-GUARD](https://dygcankurt17.atlassian.net/browse/KTZ-136)

- **Durum:** In Progress
- **Jira Kartı:** `KTZ-136`
- **Mimari Kararlar & Ne Yaptım:**

1. Client tarafında yaptıgım route kısmını degıstırdm.Admin klasoru actıgım için.Dolayısyla yollar degıstı.
2. admin ve (admin) klasorlerı clıent tarafındaydı ,admın katmanında routta gereksiz durdugu ıcın kaldırdm
3. Kök layout’tan font / QueryProvider kalıbını aldım, üstüne tüm app’i RequireAuth roles="admin" ile sardım. Client kök layout tüm siteyi kilitlemez. : chrome kopyası + admin-only guard.
4. client tarafında olusturdugum api ve types dosyalarını tasıdım.
5. Admin kisinin login olabilmesi için [](./providers/query-provider.tsx)

- Backend'e gidip gizli çerezlerdeki (cookie) Refresh Token'ı kullanarak "Bu adam sayfayı yeniledi ama hala bizden biri mi? Öyleyse bana yeni bir Access Token ver" demek için
  setAccessToken: varsaZustand buraya kaydeder
  En alttaki return bloğu ise, oluşturduğumuz bu Query Client (Veri Çekme Motoru) altyapısını bir battaniye gibi tüm çocuk bileşenlerin ({children}) üzerine örterek onların React Query özelliklerini kullanabilmesini sağlar.
- Login client’ta; admin’e gelince access token memory’de yok. HttpOnly refresh cookie (CORS + credentials: "include") ile POST /api/v1/auth/refresh çağrılıyor. Bu yüzden bu dosya 136’nın parçası: guard’ın “kim var?” sorusunu cevaplamak.

5. Test için config dosyalar olusturdm.Test sırasında Next.js ve Typescript hatalarından kaynaklı

- [](./features/auth/components/RequireAuth.tsx) burda ben test kosullarımı yazdım aslında kullanıcıcn rolune gore senaryolarım
  isReady: false (Sistem henüz hazır değil): Zustand ilk ayağa kalktığında bu bayrak kapalıdır. Güvenlik şefine (RequireAuth) şu mesajı verir: "Bekle! Token null görünüyor olabilir ama belki kullanıcı F5 atmıştır. Ben şu an arka planda Backend'e soruyorum (refresh). Ben sana haber verene kadar kapıyı kimseye açma, kimseyi de kovma!" (Testin 1. senaryosu isReady: false iken ekrana hiçbir şey basmadm, sebebi tam olarak budur).
- setIsReady (Telsiz Düğmesi): Bu fonksiyon, Resepsiyonun (QueryProvider) güvenlik şefine telsizden haber verme tuşudur.
  setIsReady(true) (Sistem Hazır!): QueryProvider backend'den cevabı alır (olumlu veya olumsuz). Yeni token'ı kasaya koyar ve en son .finally() bloğunda telsize basıp setIsReady(true) der. Yani şefe: "İşim bitti, herkesin gerçek kimliği kasada güncellendi. Artık kurallarını uygulayabilirsin!" der.
  Bu mantıga gore test dosyamda Zustandın Nextin ve JSDOM’da window.location.assign güvenilir değil diye redirectExternal sarmalayıp onu mock’ladım. Zustand + useCurrentUser da mock.
  FE kapı UX; asıl isAdmin backend’de.

[KTZ-134](https://dygcankurt17.atlassian.net/browse/KTZ-134)

- **Durum:** In Progress
- **Jira Kartı:** `KTZ-134`
- **Mimari Kararlar & Ne Yaptım:**

1. Sidebar için Shadcn Tooltip kullanarak custom css vererek yuzen bır sıdebar mantıgı olusturdum
2. Navbar için client taki yapıyı kopyaladım

3. Logout yazılmadı logout kısmı yazılmalı
4. Organizator Basvurulari sayfasini yaparken su mantigi olusturdum \_
5. Shared klasoru olusturdum componentlerimi orda olusturdum ve reusable yapmak adina yine shared klasorunde olusturdugum propsları vererek dınamık hale getırdım.
6. PageHeader kısmı için su yollardan gecti.

## 6.1 Bileşen olusturdum ve types kısmında oluturdugum propsları yolladım.[pageheader-shared](./components/shared/PageHeader.tsx)

- Olusturdugum bu bileşeni [organizatorboard](./features/admin/components/organizer-applications/OrganizerApplicationBoard.tsx) bu dosyada cagırdım sayfaya yerleştırırken ve propslara ıstedıgım degerlerı vererek kullandım

7.  FilterandSearch için de aynı sekılde SHADCN kullanarak ıskeletını yaptıktan sonra [FilterandSearch](./components/shared/FilterAndSearch.tsx) yıne aynı mantıkta InputGroup ve Popover kullanarak olusturdugum bu ıskeletı kullanabılır hale getırmek olacak : gelecek taskta olusturdugum bu popover yapısı altında status ,asıgnee,priorty sort gıbı fıltreleme fonksıyonları eklemek ıcın ıhtıyac duyulacak propsları olusturup props olarak gonderdım yıne aynı mantıkta board sayfasına cagırırkende propsları gondermıs oldum.
    selectedVlaues: Bunu bir "Alışveriş Sepeti" gibi düşün.

        Ne işe yarar? Kullanıcı açılır menüden bir şey seçtiğinde (örneğin "Status" ve "Priority"), bu kelimeleri içinde tutar: ["status", "priority"].

export interface FilterAndSearchProps {
searchValue: string; // Arama kutusunda ne yazıyor?
onSearchChange: (val: string) => void; // Arama kutusu değişince Panoya haber ver
selectedValues: string[]; // Hangi filtreler seçili? (Panodan gelecek)
onFilterSelect: (val: string) => void; // Filtre seçilince Panoya haber ver
}

"Seçenekler Listesi" (filterOptions) için de type tanımlaması yaptım

Sayfadakı bagımsız Search inputu (Shadncn InputGroup için props larım da export interface SearchInputProps {
placeholder: string;
value: string;
onChange: (value: string) => void;
}) bu sekılde

8. KanbanKolumn sayfasını da aynı mantıkla ıskeletını olusturdum [kanbancolumn](./components/shared/KanbanColumn.tsx)
   export default function KanbanColumn({
   title,
   count,
   dotColor,
   children,
   }: KanbanColumnProps) aladıgı propslar bu sekılde ve [boardsayfam](./features/admin/components/organizer-applications/OrganizerApplicationBoard.tsx) 3 adet kolon oldugu için bu sekılde her kolona props degerlerını ve ıcınde kanban kartı yerlestırmıs oldum

9. KanbanKard kısmını da aynı mantıkta tasarladım [kanbancard](./components/shared/KanbanCard.tsx)
   export interface KanbanCardProps {
   id: string;
   title: string;
   category?: string;
   time: string;
   description?: string;
   status: string;
   onEdit?: (id: string) => void;
   onDelete?: (id: string) => void;
   onReview?: (id: string) => void;
   } bu sekılde types larını tanıttm sonra organızator basvurusu için kard yapısı olusturcgm için card bılesenı olusturup backenddeki DTO yapısından faydalanarak gercek gelecek verilerle birlestirp card bileşenini organızatore cevırmıs oldum

10. Sayfa yuklenırken kullanıcıya yuklenıyor hıssı veren ve hata akısında ekrana hata oldgunu basan bılsenelerı de tasarlayıp board sayfasında cagırdm bu sekılde board kısmını tamamladım

11. ## FILTERPILLS CATEGORI FILTER MANTIGININ KURULMASI :

Bu mantıgı kurarken beyın olan board sayfasında useState ile

- const [aktifKategori, SetAktifKategori] = useState("Tümü"); baslangıcta hafızada Tümü olsun seklınde olusturdum.
- useOrganızasyon hook ıle cektıgım verilerden categoryi ayıkladım ve dızıye attım .burda soyle bır olay vardı backendde event gıbı categorıler ayrı model altında tutlmuyor organızer modelıne embedded olarak eklenmıs ve endpoint olmadıgı ıcın de categorlerı ayrı cekemedım bu yuzden her fıltre butonuna bastıgımda verıler render oldugu ıcın sadece ılgılı fıltrenın butonu kalıyor .Bunu sormam lazım bılınclı bır tercıh mı bu yaklasım
  kategoriler (Dizi): Butonların üzerine yazılacak metinler (Örn: ["Tümü", "Eğitim", "Sanat"]). Bu sayede yarın Etkinlik sayfasında kullanırken farklı bir dizi gönderebilir.

aktifKategori (Metin): Şu an hangi butonun seçili olduğu bilgisini dışarıdan alacak (Rengini kırmızı yapmak için).

onKategoriSec (Fonksiyon): Bir butona tıklandığında onClick içinde çalıştıracağı ve tıklanan kategorinin adını üst bileşene fırlatan bir "Haberci" fonksiyon.

bunları board sayfasında yapıp verileri props olarak FilterPills bilesenime yolladm.

- Ayrıca board sayfasında cagırdıgım hook 'a da parametre olarak verdım kı useOrganizerApplications(aktifKategori) , querykeyde ıkıncı bır parametre olarak sadece ılgılı kategorının verısnı ceksın dıye queryKey dizisine bu sekılde ekledım["organizer-applications", kategori]

12. Daha sonra verılerı kartlara lımıtlı bır sekılde cekıp basmak ıcın pagınatıon kısmına baktım Akıs su sekılde :
1. Oncelıkle burda bır page degerı ve lımıt degerınden Tanstack ın haberının olması gerekır.Bu yuzden page ve lımıt degerını hooka parametre olarak vermem gerekır.
1. const { data, isLoading, isError, refetch } = useOrganizerApplications({
   secilenKategori: aktifKategori,
   page: page,
   limit: limit
   });
   Burda sımdıye kadar kullandıgım useQuery mantıgını useInfiniteQuery Mantıgına cevrdım.

- Faz 1: API fonksiyonunu page ve limit alacak şekilde güncellemek. : Burda JS in URLSearch metodunu kullandm ve urlden eger bır query varsa bunu bılecek ve endpoint ona gore sekıllenecek

```js
const params = new URLSearchParams();

// Eğer kategori Tümü değilse parametrelere ekle:
if (secilenKategori && secilenKategori !== "Tümü") {
  params.append("category", secilenKategori);
}

// Eğer page varsa parametrelere ekle:
if (page) {
  params.append("page", page.toString());
}

// Parametreleri URL'in sonuna bağla:
const queryString = params.toString(); // "category=Art&page=1" çıktısı verir
const endpoint = queryString ? `${BASE}?${queryString}` : BASE;
```

Beyin (TanStack Query): useInfiniteQuery kancası, panoda kullanıcı aşağı kaydırdıkça Yeni sayfa lazım. Gidip API fonksiyonuna page: 2 diyeyim" diyecek.

Paketleyici (URLSearchParams): API fonksiyonum, TanStack'ten gelen bu page: 2 bilgisini alacak. URLSearchParams kullanarak endpoint URL'i oluşturacak: /api/applications?page=2

İşçi (Backend / Server-Side): Bu URL backend'e gidecek. Senin daha önce Node.js/Express'te yazdığın Query Handler (Sorgu İşleyici) bu URL'i okuyacak, veritabanından sadece 2. sayfaya ait 10 veriyi süzüp sana geri yollayacak.

```js


// 1. Arayüze (Interface) yeni parametreleri ekliyorum
interface ListOrganizerApplicationsParams {
  secilenKategori: string | undefined;
  page?: number;   // Opsiyonel (varsa eklenecek)
  limit?: number;  // Opsiyonel (varsa eklenecek)
}

export async function listOrganizerApplications(
  { secilenKategori, page, limit }: ListOrganizerApplicationsParams,
): Promise<ListOrganizerApplicationsResponse> {

  //  paketleyicimizi çağırıyoruz
  const params = new URLSearchParams();

  // Kategori kuralımız (Eskisiyle aynı mantık, sadece append ile ekliyoruz)
  if (secilenKategori && secilenKategori !== "Tümü") {
    params.append("category", secilenKategori);
  }

  // Eğer page gönderildiyse pakete ekle (Sayıyı metne çevirerek)
  if (page) {
    params.append("page", page.toString());
  }

  // Eğer limit gönderildiyse pakete ekle
  if (limit) {
    params.append("limit", limit.toString());
  }

  // Paketi kapat ve metne çevir (Örn: "category=Art&page=1&limit=10")
  const queryString = params.toString();

  // Eğer paket doluysa sonuna ekle, boşsa sadece BASE kalsın
  const endpoint = queryString ? `${BASE}?${queryString}` : BASE;

  // Trene bindirip yolluyoruz!
  return apiFetch<ListOrganizerApplicationsResponse>(endpoint, { method: "GET" });
}
```

Faz 2: Hook'u useQuery'den useInfiniteQuery'e çevirmek.
[hook](./features/admin/hooks/useOrganizerApplications.ts)

- hook ta Panodan limit değerini de alıyorum
- secılenkategori ,limit degerlerini querykeye verıyorm
  -queryFn: ({ pageParam = 1 }) =>
  listOrganizerApplications({
  secilenKategori,
  page: pageParam,
  limit
  }), pageParam ı page olarak yolluyrom
  kategori değiştiğinde panonun eski verileri silinip yeni kategorinin 1. sayfası temiz bir şekilde gelecek.

- queryFn Bağlantısı: Senin mükemmel yazdığın API fonksiyonuna secilenKategori, pageParam ve limit değerlerini birleştirip yolladık.

- getNextPageParam Mantığı: Backend'in cevabını okuduk. Eğer backend'den gelen başvuru sayısı bizim limitimizden (örn: 10) daha azsa (örn: 7 tane geldiyse), sistem "Tamam, veritabanının dibini sıyırdık, başka sayfa kalmadı" diyerek undefined dönüyor ve sonsuz kaydırmayı durduruyor.

Faz 3: Kanban Panosunda sayfa sayfa gelen verileri "düzleştirip" (Flattening) sütunlara dağıtmak.
fetchNextPage, // Sonraki sayfayı çeken tetikleyici
hasNextPage, // Sonraki sayfa var mı? (Boolean)
isFetchingNextPage // Şu an yeni sayfa yükleniyor mu?

- Tanstack ten bu fonksıyonları cagırdım.
- Burda flatMap mantıgını kullandım tanstack klasor seklınde cektıgı ıcın nested verıyı duzlestırdm

