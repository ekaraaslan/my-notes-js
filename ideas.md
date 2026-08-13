# My Notes — Tasarım Kararları

## Referans ve yerleşik gerçeklik

Bu proje, kullanıcının paylaştığı eski VB ile yazılmış **My Notes** masaüstü uygulamasını görsel ve davranışsal referans kabul eder. Referansın ayırt edici özellikleri; üstte klasik menü çubuğu, solda klasör ve not ağacı, sağda koyu terminal benzeri metin alanı, ince gri pencere çerçevesi ve yoğun bilgi sunan yardımcı araç hissidir. Yeni sürüm bu dili kopyalamak yerine tarayıcıya uyarlayacak; klasör ağacı, seçili not, not düzenleme ve yerel kayıt davranışını koruyacaktır.

## Seçilen yaklaşım: Archive Desktop / Modern Legacy Utility

**Design Movement:** 1990'lar masaüstü yardımcı programları ile çağdaş editoryal yazılım arayüzünün birleşimi.

**Core Principles:** Bilgi yoğunluğunu kontrollü tutmak; eski uygulamanın tanıdık navigasyonunu korumak; koyu editör alanını odak bölgesi yapmak; her eylemi doğrudan ve geri bildirimli kılmak.

**Color Philosophy:** Kırık beyaz ve sıcak gri yüzeyler eski ofis yazılımının fiziksel hissini taşır. Grafit editör bölgesi düşünme ve yazma alanını ayırır. Zümrüt yeşili, referans ekranın terminal metnini modern markanın imza rengine dönüştürür; hardal sarısı ise klasör ve uyarı gibi ikincil işaretlerde düşük dozda kullanılır.

**Layout Paradigm:** Merkezlenmiş bir landing page yerine sabit sol arşiv ağacı, esnek editör kanvası ve dar sağ bilgi rayından oluşan masaüstü çalışma yüzeyi. Dar ekranlarda bu yapı, sol ağacı açılır panel ve sağ rayı alt bilgi kartı olarak yeniden düzenler.

**Signature Elements:** Klasör ağacında ince bağlantı çizgileri ve dosya rozetleri; editörde yeşil monospace metin ile satır numarası şeridi; başlık alanlarında küçük büyük harfli, arşiv fişi hissi veren etiketler.

**Interaction Philosophy:** Hızlı, görünür ve geri alınabilir. Seçim anında vurgulanır, kaydetme durumu her zaman görünür, klavye kısayolları gerçek bir avantaj sağlar. Menüde henüz işlevsiz öğe bırakılmaz; her kontrol ya çalışır ya da açıkça açıklanır.

**Animation:** Girişte yalnızca hafif opacity ve translate ile 30–60 ms kademeli görünme; ağaç satırlarında 160 ms ease-out vurgu; buton basımında kısa scale(0.97). Yazma ve klavye kısayolları animasyonsuz tutulur. `prefers-reduced-motion` durumunda tüm dekoratif hareketler kapatılır.

**Typography System:** Arayüz metni için `IBM Plex Sans`; editör, yol bilgisi, kısayol ve terminal içeriği için `IBM Plex Mono`. Başlıklar 700 ağırlıkta sıkı; yardımcı etiketler 11–12 px uppercase ve harf aralığı artırılmış; not metni 14–15 px monospace.

**Brand Essence:** Klasör karmaşasını sessiz, hızlı ve sahiplenilebilir bir çalışma yüzeyine dönüştüren kişisel arşiv; kişisel notlarını düzenli tutmak isteyen geliştirici ve üretkenlik meraklıları için. **Sakin, sistematik, biraz nostaljik.**

**Brand Voice:** Başlıklar kısa ve işlevsel; CTA'lar eylemi doğrudan söyler; mikro metinler teknik ama insancıl. Örnekler: “Notu kaydet”, “Arşivde ara”.

**Wordmark & Logo:** Metin yerine, üst üste duran iki not sayfasının oluşturduğu katmanlı bir işaret; öndeki sayfanın içindeki negatif alan küçük bir onay imi gibi çalışır. Markanın yazı karakteri logodan ayrı tutulur.

**Signature Brand Color:** `#2f8f68` — terminal yeşilinin daha olgun, okunaklı ve kendi başına tanınabilir versiyonu.

