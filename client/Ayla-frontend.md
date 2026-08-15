

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

