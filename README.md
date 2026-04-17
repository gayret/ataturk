# Atatürk Kronolojisi

## Projenin hikayesi

<img width="508" height="854" alt="image" src="https://github.com/user-attachments/assets/1671330e-3898-4836-8f7b-131b824fc6a1" />

## Nasıl Katkı Sağlanır?

### Geliştiriciler için

1. Yapılacak işler için [Issues](https://github.com/gayret/ataturk/issues) bölümüne göz atın veya yeni bir issue oluşturun.
2. Bu repoyu forklayın.
3. Yeni bir branch oluşturun (`git checkout -b ozellik/yeni-ozellik`).
4. Değişikliklerinizi yapın ve commit edin (`git commit -m 'Yeni özellik eklendi'`).
5. Branch’i pushlayın (`git push origin ozellik/yeni-ozellik`).
6. Bir Pull Request açın.

### Gönüllü Çevirmenler için

Bu projede kabul ettiğimiz dil dosya formatı, ana dizindeki `data/events` klasörü altındaki dil klasörleri ve bu klasörlerin içindeki `.md` dosyalarıdır.
Gönüllü çevirmenlerden, çeviri katkılarını bu formatta hazırlamalarını bekliyoruz.

1. Çevirmek istediğiniz dilin kısa koduyla (Örneğin `tr`, `en`, `de`, `es`...) bir klasör oluşturun.
2. Dosyaları `data/events/{dil}/{id}.md` formatında hazırlayın.
3. Dosya başındaki frontmatter yapısını koruyun.
4. Çevrilebilir alanları çevirin: `title`, `images` içindeki `alt` metinleri ve varsa frontmatter sonrası gövde metni.
5. Yapısal alanları değiştirmeyin: `id`, `date`, `category`, `location`, `images.url`, `source`, `quotes`, `sounds`.
6. Görsel yollarını, koordinatları ve kaynak bağlantılarını olduğu gibi bırakın.
7. Çeviriyi tamamladıktan sonra değişiklikleri commit edip Pull Request açın.
8. Yedinci adım sizin için karmaşık görünüyorsa [buraya tıklayarak gönüllü bir yazılımcıdan yardım talep edebilirsiniz.](https://github.com/gayret/ataturk/issues/new?title=Haz%C4%B1rlad%C4%B1%C4%9F%C4%B1m%20%C3%A7eviriyi%20aktif%20etmek%20istiyorum&labels=Verilerle%20ilgili&body=Bir%20yaz%C4%B1l%C4%B1mc%C4%B1n%C4%B1n%20yard%C4%B1m%C4%B1na%20ihtiyac%C4%B1m%20var)

Örnek çeviri dosyası yapısı:

```text
data/events/tr/1.md
data/events/en/1.md
data/events/de/1.md
data/events/es/1.md
```

Önemli not: Mevcut olay numaralandırmasını (`id`) ve dosya adlarını koruyarak ilerleyin. Böylece diller arası eşleşme ve bakım süreci sorunsuz kalır.

### Gönüllü Tarihçiler için

Tarihsel içeriklerin doğruluğu ve zenginleştirilmesi konusunda katkı sağlamak isteyenler tarihçiler aşağıdaki yönergeleri takip edebilirler.

1. Yapılacak işler için [Issues](https://github.com/gayret/ataturk/issues?q=is%3Aissue%20state%3Aopen%20label%3A%22Verilerle%20ilgili%22) bölümüne göz atın veya yeni bir issue oluşturun.
2. Tespit ettiğiniz eksik veya hatalı bilgiler için Issues bölümünde [kayıt oluşturun](https://github.com/gayret/ataturk/issues/new?title=Tarih%20bilgim%20ile%20katk%C4%B1%20sa%C4%9Flamak%20istiyorum&labels=Verilerle+ilgili&body=Yard%C4%B1mc%C4%B1%20olabilece%C4%9Fim%20hususlar%20%C5%9Funlar%0A%0A1.).
3. Tarihi kaynaklar ve referans belgelerle desteklenmiş katkılarınızı ilgili Issue altında paylaşın.

## Lisans

Bu proje MIT lisansı ile korunmaktadır. Detaylar için `LICENSE` dosyasına bakabilirsiniz.
