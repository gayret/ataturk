# ÖNEMLİ
Mevcut dosyalar üzerinde işlem yaparken değiştirmediğimiz satırlarda '' ve "" kullanımını DEĞİŞTİRME!

Mevcut dosyalar üzerinde işlem yaparken değiştirmediğimiz satırlarda ; eklemeleri YAPMA!

YALNIZCA DEĞİŞİKLİK YAPTIĞIMIZ SATIRLARDA OYNAMALAR YAP.
BU KURALLAR YENİ AÇTIĞIMIZ DOSYALAR İÇİN GEÇERLİ DEĞİL.

# Sesli Okuma Özelliği Yol Haritası

## Gereksinim Özeti
- **Buton**: Ekranın sağ üst köşesinde sabit bir toggle; varsayılan durum sessiz (mute). Açık/kapalı için SVG ikonları kullanılacak: Volume UP `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M14 20.725v-2.05q2.25-.65 3.625-2.5t1.375-4.2t-1.375-4.2T14 5.275v-2.05q3.1.7 5.05 3.138T21 11.975t-1.95 5.613T14 20.725M3 15V9h4l5-5v16l-5-5zm11 1V7.95q1.175.55 1.838 1.65T16.5 12q0 1.275-.663 2.363T14 16"/></svg> / Volume Down `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="m19.8 22.6l-3.025-3.025q-.625.4-1.325.688t-1.45.462v-2.05q.35-.125.688-.25t.637-.3L12 14.8V20l-5-5H3V9h3.2L1.4 4.2l1.4-1.4l18.4 18.4zm-.2-5.8l-1.45-1.45q.425-.775.638-1.625t.212-1.75q0-2.35-1.375-4.2T14 5.275v-2.05q3.1.7 5.05 3.138T21 11.975q0 1.325-.363 2.55T19.6 16.8m-3.35-3.35L14 11.2V7.95q1.175.55 1.838 1.65T16.5 12q0 .375-.062.738t-.188.712M12 9.2L9.4 6.6L12 4z"/></svg>`.
- **Davranış**: Kapalıyken hiçbir çağrı yok. Açıkken mevcut olayın tarihi, başlığı ve açıklaması sesli okunur; olay değişirse eski ses hemen kesilir (tercihen fade-out) ve yeni ses başlar.
- **Seslendirme kuralları**: date + description kadın sesi; title erkek sesi. Metinler tarayıcının diliyle okunacak. Atatürk’ün ünlü sözleri/quotes seslendirilmeyecek.
- **Ek**: Ses aktifse seviye ayarlanabilir olmalı. AI ile ilgili kısımlar yok sayılacak. Geliştirme yeni bir branch’te yapılacak ve merge öncesi lokal test edilecek.

## Proje Yapısı Notları (İnceleme)
- **Veri**: Olaylar `app/json/events_*.json` içinden `useEventsData` ile geliyor; `language` query param’ı ve Zustand dili belirliyor. Tarih formatı `app/helpers/date.ts` içinden dil bazlı geliyor.
- **Navigasyon**: Olay seçimi `id` query param’ı ile yapılıyor; tetikleyiciler `Timeline`, `Search`, `SwipeWrapper`, `AutoPlay`, `Direction/StreetView` linkleri ve manuel URL değişiklikleri. `about` için özel view var.
- **Arayüz**: Hareketli kontrol grubu `ActionButtons` alt sağda; başlık `Header` sol üstte. Ses toggle için yeni sabit bir üst-sağ konteynere ihtiyaç var (mevcut CSS bunu karşılamıyor).
- **İçerik**: Ana metin `Content`’te render ediliyor; sayfa başlığı burada set ediliyor. Olaylarda ayrıca manuel `<audio>` blokları (sounds) bulunabiliyor; yeni TTS bunlardan bağımsız olmalı.
- **Otomatik akış**: `AutoPlay` olaylar arasında otomatik geçiş yapıyor, tam ekran kullanıyor ve klavye/klik ile durduruluyor; ses sistemi bu geçişleri takip etmeli.

## Teknik Tasarım
- **State yönetimi**: Yeni bir Zustand store (ör. `useVoiceStore`) ile `enabled`, `volume`, `preferredVoices` (kadın/erkek için id), `isSupported` ve son okunan `eventId` tutulacak; `persist` ile localStorage’a yazılacak. Varsayılan: `enabled=false`, `volume=0.8`.
- **Motor**: Web Speech API (`speechSynthesis`) kullanılacak; destek yoksa toggle disabled tooltip gösterecek. SSR ortamı için tüm kullanım client-only (`use client` + feature detection).
- **Ses seçimi**: Tarayıcı diline veya `currentLanguageCode`’a yakın `SpeechSynthesisVoice` seçilecek; cinsiyet bilgisi yoksa isimden/locale’den çıkarım + pitch ayarı (kadın: yüksek pitch, erkek: default/azaltılmış pitch). Seçimler kullanıcı aksiyonlarıyla güncellenebilir.
- **Metin hazırlama**: Sadece `formattedDate`, `title`, `description` okunacak; boş alanlar atlanacak. `quotes`, `images.alt` ve başka alanlar seslendirilmez. Tarihler `formatDate` ile lokalize edilip okunur.
- **Oynatma akışı**: Toggle açıldığında seçili olayı hemen okur. `id` değiştiğinde (URL, swipe, autoplay) mevcut `SpeechSynthesisUtterance` volume fade-out ile iptal edilip yenisi başlatılır. `about` sayfasında ve destek yoksa sessiz kalır.
- **Kontroller**: Üst-sağ buton açık/kapalı ikon değişimi, `aria-pressed` ve klavye desteği. Açıkken küçük bir panelde volume slider (0–1) ve opsiyonel “dili/voice’u yenile” eylemi. Fade süresi kısa (örn. 300–500ms) tutulacak ki hissedilir olsun ama geçişleri yavaşlatmasın.
- **Temizlik**: Dil değişimlerinde, sekme kapanırken veya `unmount` sırasında `speechSynthesis.cancel()` çağrısı yapılacak; tekrarlayan queue oluşumu engellenecek.

## Yapılacak İşler (Sıra)
1. **Altyapı**: `useVoiceStore` oluştur, persist ayarlarını yap; destek kontrolü helper’ı yaz (örn. `getSpeechVoices` ile async voice yükleme).
2. **Servis**: Ses oluşturma util’i ekle (`buildUtterances`), cinsiyet/pitch tercihleri, volume uygulaması ve fade-out iptali için küçük bir scheduler yaz.
3. **UI**: Üst-sağ sabit toggle + slider bileşeni ekle; mobilde de erişilebilir olacak şekilde konumlandır; tooltip/disable durumları eklensin.
4. **Etkileşim**: `Content` veya üst seviye bir client wrapper içinde `id` ve `language` değişimini dinleyip `playEvent(event)` tetikle; `AutoPlay`/`SwipeWrapper`/`Timeline` akışlarıyla aynı kaynak `events` datasını kullan.
5. **Kenar durumları**: `about` görünümünde veya destek yoksa otomatik olarak kapalı kal; mevcut `<audio>` çalarken bile TTS queue’su yönetilebilir olsun; hatalarda kullanıcıya kısa bir uyarı/snackbar gösterilebilir.
6. **Test planı**: Chrome/Firefox’ta toggle on/off, volume değişimi; farklı dillere geçişte doğru voice; AutoPlay açıkken olay geçişinde sesin kesilip yeniden başlaması; boş açıklamalı olaylarda sadece tarih+başlık okunması; mobile swipe ile geçiş testleri.


