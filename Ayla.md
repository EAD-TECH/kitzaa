
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



# yapilcaklar

1. admin icin user crud islemleri icin ayri bir endpoint olustur. /api/v1/admin/users/



# fikirler

1. frontend de location kismini user dan alirken, locationinizi girerseniz yakininizdaki etkinliklerden haberdar olabilirsiniz gibi birsey yazalim. bu kisim opsionel.



# bakilcaklar

refresh databaseden siliniyor mu bak


bu deneme