

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