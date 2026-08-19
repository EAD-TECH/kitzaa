#### Toekn Yenileme Mimarisi ####
![alt text](image-1.png)
Refresh başarılı olursa:
setAccessToken(data.accessToken);
queryClient.setQueryData(["currentUser"], data.user);
Böylece kullanıcı yeniden login olmuş gibi devam ediyor.

isReady neden var?

Sayfa ilk açıldığında frontend henüz refresh isteğinin sonucunu bilmiyor.

Başlangıçta:

isReady: false

Bu sırada RequireAuth kullanıcıyı hemen login sayfasına göndermiyor:

if (!isReady) return;

Refresh işlemi bittikten sonra:

setIsReady(true);

oluyor.

Ondan sonra karar veriliyor:

if (!user) {
  router.replace("/login");
}

Yani isReady şu anlama geliyor:

“Backend’e refresh isteğini attım ve kullanıcının oturumu var mı yok mu artık biliyorum.”

Bu doğru ve gerekli bir yaklaşım. Yoksa kullanıcı aslında giriş yapmış olsa bile sayfa yenilenirken kısa süreliğine /login sayfasına gönderilirdi.

### Sifremi unuttum ###
![alt text](image.png)