/*  Next.js'in bizim için hazırladığı Jest uyumluluk aracını çağırıyoruz.
 Bu araç, TypeScript kodlarımızı Jest'in anlayacağı dile otomatik çevirir. */
import nextJest from 'next/jest.js'

/*  Next.js'e projemizin kök dizininin burası ('./') olduğunu söylüyoruz. */
const createJestConfig = nextJest({
  dir: './',
})

// Jest'in ana ayarları
/** @type {import('jest').Config} */
const config = {
  /* Test ortamı olarak tarayıcı simülasyonunu (jsdom) kullan diyoruz.
  Çünkü bileşenlerimiz sanki bir ekranda çalışıyormuş gibi test edilecek. */
  testEnvironment: 'jest-environment-jsdom',
  
  /*  Testler başlamadan hemen önce, ekrandaki butonları tanımamızı sağlayacak
   o gözlük dosyasını (setup dosyasını) okumasını istiyoruz. */
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
}

/*  Hazırladığımız bu ayarları dışarı aktarıyoruz. */
export default createJestConfig(config)