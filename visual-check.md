# Görsel Doğrulama Notları

## 13 Ağustos 2026

Masaüstü görünümünde üç parçalı çalışma yüzeyi dengeli çalışıyor: solda klasör ağacı, ortada koyu monospace editör, sağda seçili not bilgisi. Koyu editör, referans ekranın terminal karakterini korurken üstteki kırık beyaz yardımcı arayüz modern ve okunaklı bir katman oluşturuyor. Seçili not satırı ve yeşil durum ışıkları odak durumunu netleştiriyor.

Mobil görünümde sağ bilgi rayı gizleniyor, klasör ağacı çekmece davranışına geçiyor ve editör tam genişlikte kalıyor. Üst eylemler ikon ağırlıklı hale geldiği için dar ekranda taşma oluşmuyor. Metin alanı yatay taşmayı içeride tutuyor; uzun satırlar için bu, terminal tarzı düzenleme davranışıyla uyumlu.

Derleme ve TypeScript kontrolü başarılı. Üretim derlemesinde yalnızca dışarıdan servis edilen görsel varlıkların build zamanında çözümlenmediğine ilişkin beklenen uyarılar ve bundle boyutu uyarısı bulunuyor; uygulama çalışma zamanında bu görselleri `/manus-storage/` adreslerinden yüklüyor.

## Özellik güncellemesi

Masaüstü görünümünde klasik File/Edit/View/Task/Help menüleri artık açılır eylem listeleri gösteriyor. Markdown araç çubuğu, Yaz/Önizleme sekmeleri, Dışa aktar menüsü ve etiket rayı merkez editör çevresinde tek bir araç katmanı olarak hizalandı. Etiketler sol ağaçta renkli filtreler olarak, seçili not bilgi kartında da kapatılabilir rozetler olarak görünüyor. Mevcut localStorage notları için eski veri göçü eklendi; yeni sürüm ilk yüklemede seed etiketleri eşleştiriyor.
