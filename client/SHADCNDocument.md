
DROPDOWN MANTIGI : 


```powershell
cat package.json | grep -i "base-ui\|radix"

1.package.jsonda hangi primitive kullandıgımı gosterır.buna gore componentlerı yorumlarım
2.Base UI mi Radix UI mi kullandığını gösterir — dokümandaki hangi sekmeyi (Base UI/React Aria/Radix UI) referans almanız gerektiğini belirler.
```

## base ui site ve pratik yapmak için gidecegm siteler
[text](https://base-ui.com/react/components/separator)
├── Anatomy         → İskelet: hangi parça hangisinin içinde
├── Examples         → Hazır, çalışan kod örnekleri (kopyala-yapıştır)
└── API reference     → Her parçanın TÜM prop'ları, tablo halinde


Her tabloda 3 sütun var: Prop / Type / Default. Örnek — Positioner:

Prop	Type	Default	Siz bunu nasıl okursunuz
side	Side	'bottom'	"Vermezsem otomatik aşağı açılır"
align	Align	'center'	"Vermezsem trigger'a ortalanır"
sideOffset	number	0	"Trigger ile menü arası boşluk, px"
[text](https://stackblitz.com/run?file=demo.css)
shadcn dokümanı (görsel örnek + hangi bileşeni nereye koyacağınızı gösterir) → kendi dosyanız (hangi prop'ları destekliyor, hangi primitive'e sarılı) → primitive'in resmi dokümanı (tam API referansı)

** bu bilgilere indirdiğim shadcn componentine tıklayarak ınceledıgm kodlardan base ui ı kullanıldıgını ve sıtesıne gıttıgımde menu tabını ınceledıgmde kullanılan prop ve default degeryıle beraber praıtk yaptm



## DROPDOWN MENUDE OGRENDIKLERIM
1. Trigger'ın children'ı. Base UI, render'da verilen elementi (Button) klonlayıp üstüne davranışını (onClick, aria-*, ref) enjekte ediyor, Trigger altında rendera Butonu verdıgınde shadcne dıyorsun kı sen kendı cocugunu degıl sana render altında verdıgım cocugu render etmenı ıstıyorm bu sayede Zıl iconumu render ettim 

2 Base UI, Trigger veya Item gibi bileşenleri normalde bir <button> elementi olarak render eder.
Base UI, nativeButton={true} (varsayılan) olduğunda bu native davranışları native <button> semantiğine göre ayarlar.
Base UI, nativeButton={true} kalırsa hâlâ butonmuş gibi keyboard/ARIA davranışı uygulamaya çalışır — ama render edilen şey aslında bir link olduğu için bu davranış yanlış/tutarsız olur (örn. Space tuşuna basınca sayfa scroll olur ama link tetiklenmez, ya da ekran okuyucu "button" der ama tıklayınca sayfa değiştirir, kullanıcı şaşırır).

3. nativeButton={false} denildiğinde Base UI'ye şunu söylüyoruz: "Ben artık native bir <button> render etmiyorum, davranışını ona göre ayarla" — bu sayede doğru klavye etkileşimi ve doğru ARIA rolü uygulanır Eger bir link tetiklemek istiyorsam yanı render altında link i render edeceksem nativeButton false demem lazım.