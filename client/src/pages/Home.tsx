// Style note: Archive Desktop — asymmetric file tree, terminal editor, restrained paper texture, no generic dashboard cards.
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { LucideIcon } from "lucide-react";
import {
  Archive,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock3,
  Code2,
  Command,
  Download,
  FilePlus2,
  FileText,
  Folder,
  FolderOpen,
  FolderPlus,
  HardDrive,
  Keyboard,
  LayoutGrid,
  Menu,
  MoreHorizontal,
  PanelLeft,
  Pin,
  Plus,
  Save,
  Search,
  Settings2,
  Sparkles,
  Tag,
  X,
} from "lucide-react";

type Note = {
  id: string;
  title: string;
  folder: string;
  body: string;
  updatedAt: string;
  pinned?: boolean;
};

type FolderSection = {
  title: string;
  icon: LucideIcon;
  items: Array<{ label: string; noteId?: string; icon: LucideIcon; kind?: "folder" | "note" }>;
};

const seedNotes: Note[] = [
  {
    id: "hatirlatmalar",
    title: "Hatırlatmalar",
    folder: "Notlarım",
    pinned: true,
    updatedAt: "13 Ağu 2026, 12:11",
    body: `email listesine eklenecekler...
*.digital-photography-school.com
*.azureedge.net
*.investaz.net
*.tumblr.com
*.msecnd.net
*.ubi.com

--------------------------------------------------------------------------
— XML Oku-Yaz
— Kod Bank
— ASP database
— ASP.NET
— ASP.NET MVC
— Lightroom
— Edius
— AutoCad
— Arduino

--------------------------------------------------------------------------
— Oracle İhalesi Kıymetli Evrakları İMD'ye gönder...        OK
— Mevzuat - Palmiye Yazılım Ödeme Yazısı                     OK
— Oracle Destek Talep Yazısı                                 OK
— Personel Dairesi Yetki Listesi                             OK
— Canon EOS350D Photo's                                      OK`,
  },
  {
    id: "program-hatalari",
    title: "Program Hataları ve Ek Özellikler",
    folder: "Notlarım",
    updatedAt: "12 Ağu 2026, 16:40",
    body: `// Program Hataları ve Ek Özellikler

1. Arama alanı açıkken yeni not oluşturulunca liste sıfırlanmalı.
2. Editör kaydında son düzenleme tarihi görünür olmalı.
3. Klasör ağacı klavye ile gezinilebilir olmalı.
4. Dışa aktarma işlemi seçili notla sınırlı kalmalı.

// Bir sonraki sürüm
— Etiket filtresi
— Notlar arası hızlı bağlantı
— Markdown önizleme`,
  },
  {
    id: "adresler",
    title: "Adresler",
    folder: "Notlarım",
    updatedAt: "10 Ağu 2026, 09:18",
    body: `Adres defteri

Ev:
  — İnternet sağlayıcı paneli
  — Apartman yönetimi

İş:
  — İç ağ / ekip paylaşımı
  — Yedek sunucu

Not: Hassas bilgileri bu tarayıcı demosuna kaydetmeyin.`,
  },
  {
    id: "my-memo",
    title: "My Memo",
    folder: "Notlarım",
    updatedAt: "08 Ağu 2026, 18:03",
    body: `Bugün aklımda kalanlar

• Eski uygulamanın sadeliği hâlâ hızlı hissettiriyor.
• Klasör ağacı, notların nerede olduğunu unutmamayı sağlıyor.
• Yeni sürümde arama ve yerel kayıt ilk sınıf davranış olmalı.`,
  },
  {
    id: "diger-2",
    title: "Diğer 2",
    folder: "Notlarım",
    updatedAt: "07 Ağu 2026, 11:44",
    body: `Geçici notlar
— Fotoğraf arşivi
— Evrak düzeni
— Yeni araç fikirleri`,
  },
  {
    id: "diger",
    title: "Diğer",
    folder: "Notlarım",
    updatedAt: "05 Ağu 2026, 14:12",
    body: `Çeşitli notlar.

Bu alan kısa, serbest biçimli notlar için ayrıldı.`,
  },
  {
    id: "toki-notlari",
    title: "TOKİ Notları",
    folder: "Notlarım",
    updatedAt: "02 Ağu 2026, 10:31",
    body: `TOKİ notları

Takip edilecek belgeler:
— Başvuru
— Sözleşme
— Teslim bilgileri`,
  },
  {
    id: "kantin-borclari",
    title: "Kantin Borçları",
    folder: "Notlarım",
    updatedAt: "29 Tem 2026, 17:20",
    body: `Kantin borçları

Ay sonu kontrol listesi.`,
  },
  {
    id: "organizyon",
    title: "Organizasyon Değişiklikleri",
    folder: "Notlarım",
    updatedAt: "28 Tem 2026, 15:52",
    body: `Organizasyon değişiklikleri

Toplantı akışı ve sorumluluklar.`,
  },
  {
    id: "alisveris-listeleri",
    title: "Alış-Veriş Listeleri",
    folder: "Notlarım",
    updatedAt: "25 Tem 2026, 09:04",
    body: `Alış-Veriş Listeleri

□ Kablo düzenleyici
□ Arşiv klasörü
□ Mürekkep`,
  },
  {
    id: "toki-bilgi",
    title: "TOKİ Bilgi Ekranı Notları",
    folder: "Notlarım",
    updatedAt: "21 Tem 2026, 13:25",
    body: `Bilgi ekranı notları

Güncel ekran metinleri ve kontrol maddeleri.`,
  },
  {
    id: "china",
    title: "Alışveriş from China",
    folder: "Notlarım",
    updatedAt: "18 Tem 2026, 20:10",
    body: `Alışveriş from China

Ürün karşılaştırma notları.`,
  },
  {
    id: "photoshop-effect",
    title: "Photoshop Effect",
    folder: "Notlarım",
    updatedAt: "16 Tem 2026, 12:42",
    body: `Photoshop Effect

Katman, maske ve renk notları.`,
  },
  {
    id: "backup-server",
    title: "Backup Server",
    folder: "Notlarım",
    updatedAt: "12 Tem 2026, 08:27",
    body: `Backup Server

Yedekleme kontrolü
— Günlük
— Haftalık
— Aylık`,
  },
  {
    id: "konut",
    title: "Başkanlık Konut Üretim Raporu",
    folder: "Notlarım",
    updatedAt: "10 Tem 2026, 17:02",
    body: `Başkanlık Konut Üretim Raporu

Rapor başlıkları ve teslim tarihleri.`,
  },
  {
    id: "photoshop-styles",
    title: "Photoshop Styles",
    folder: "Notlarım",
    updatedAt: "07 Tem 2026, 10:03",
    body: `Photoshop Styles

Kullanılan stiller ve preset notları.`,
  },
  {
    id: "satis-isleri",
    title: "Satış İşleri",
    folder: "Notlarım",
    updatedAt: "03 Tem 2026, 09:12",
    body: `Satış İşleri

Takip edilecek satış işlemleri.`,
  },
  {
    id: "security-codes",
    title: "Security Codes",
    folder: "Notlarım",
    updatedAt: "30 Haz 2026, 16:51",
    body: `Security Codes

Hassas kodları bu örnek alana yazmayın.`,
  },
];

const sections: FolderSection[] = [
  {
    title: "Notlarım",
    icon: FolderOpen,
    items: [
      { label: "Hatırlatmalar", noteId: "hatirlatmalar", icon: FileText, kind: "note" },
      { label: "Program Hataları ve Ek Özellikler", noteId: "program-hatalari", icon: FileText, kind: "note" },
      { label: "Adresler", noteId: "adresler", icon: FileText, kind: "note" },
      { label: "My Memo", noteId: "my-memo", icon: FileText, kind: "note" },
      { label: "Diğer 2", noteId: "diger-2", icon: FileText, kind: "note" },
      { label: "Diğer", noteId: "diger", icon: FileText, kind: "note" },
      { label: "TOKİ Notları", noteId: "toki-notlari", icon: FileText, kind: "note" },
      { label: "Kantin Borçları", noteId: "kantin-borclari", icon: FileText, kind: "note" },
      { label: "Organizasyon Değişiklikleri", noteId: "organizyon", icon: FileText, kind: "note" },
      { label: "Alış-Veriş Listeleri", noteId: "alisveris-listeleri", icon: FileText, kind: "note" },
      { label: "TOKİ Bilgi Ekranı Notları", noteId: "toki-bilgi", icon: FileText, kind: "note" },
      { label: "Alışveriş from China", noteId: "china", icon: FileText, kind: "note" },
      { label: "Photoshop Effect", noteId: "photoshop-effect", icon: FileText, kind: "note" },
      { label: "Backup Server", noteId: "backup-server", icon: FileText, kind: "note" },
      { label: "Başkanlık Konut Üretim Raporu", noteId: "konut", icon: FileText, kind: "note" },
      { label: "Photoshop Styles", noteId: "photoshop-styles", icon: FileText, kind: "note" },
      { label: "Satış İşleri", noteId: "satis-isleri", icon: FileText, kind: "note" },
      { label: "Security Codes", noteId: "security-codes", icon: FileText, kind: "note" },
    ],
  },
  {
    title: "Codes",
    icon: Code2,
    items: [
      { label: "Visual Basic Codes", icon: Folder, kind: "folder" },
      { label: "Excel VBA Codes", icon: Folder, kind: "folder" },
      { label: "Other Codes", icon: Folder, kind: "folder" },
      { label: "PowerShell & VBS Scripts", icon: Folder, kind: "folder" },
      { label: "Arduino", icon: Folder, kind: "folder" },
    ],
  },
  {
    title: "Other",
    icon: Archive,
    items: [
      { label: "Dualar", icon: FolderOpen, kind: "folder" },
    ],
  },
];

const starterBody = `Yeni notunu buraya yaz.

— Fikirleri kısa satırlarda tut
— Klasör ağacını kullan
— Ctrl + S ile kaydet`;

function formatNow() {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
}

export default function Home() {
  const [notes, setNotes] = useState<Note[]>(() => {
    try {
      const saved = window.localStorage.getItem("my-notes-js/notes");
      return saved ? JSON.parse(saved) : seedNotes;
    } catch {
      return seedNotes;
    }
  });
  const [selectedId, setSelectedId] = useState("hatirlatmalar");
  const [query, setQuery] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [lastSaved, setLastSaved] = useState("12:11");

  const selectedNote = notes.find((note) => note.id === selectedId) ?? notes[0];
  const filteredQuery = query.trim().toLocaleLowerCase("tr-TR");
  const noteCount = notes.length;

  const visibleSections = useMemo(
    () => {
      const knownIds = new Set(sections[0].items.map((item) => item.noteId));
      const extraNotes = notes
        .filter((note) => !knownIds.has(note.id))
        .map((note) => ({ label: note.title, noteId: note.id, icon: FileText, kind: "note" as const }));
      return sections.map((section, index) => ({
        ...section,
        items: [...(index === 0 ? extraNotes : []), ...section.items].filter((item) => {
          if (!filteredQuery) return true;
          return item.label.toLocaleLowerCase("tr-TR").includes(filteredQuery);
        }),
      }));
    },
    [filteredQuery, notes],
  );

  useEffect(() => {
    window.localStorage.setItem("my-notes-js/notes", JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        handleSave();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  function updateSelectedNote(patch: Partial<Note>) {
    if (!selectedNote) return;
    setNotes((current) => current.map((note) => (note.id === selectedNote.id ? { ...note, ...patch } : note)));
  }

  function handleSave() {
    setNotes((current) => current.map((note) => (note.id === selectedId ? { ...note, updatedAt: `13 Ağu 2026, ${formatNow().split(" ").slice(-1)[0]}` } : note)));
    setLastSaved(formatNow().split(" ").slice(-1)[0]);
    toast.success("Not kaydedildi", { description: "Değişiklikler bu tarayıcıda saklandı." });
  }

  function handleCreateNote(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = newTitle.trim();
    if (!title) {
      toast.error("Bir not adı yazın");
      return;
    }
    const id = `note-${Date.now()}`;
    const newNote: Note = {
      id,
      title,
      folder: "Notlarım",
      body: starterBody,
      updatedAt: `13 Ağu 2026, ${formatNow().split(" ").slice(-1)[0]}`,
    };
    setNotes((current) => [newNote, ...current]);
    setSelectedId(id);
    setNewTitle("");
    setIsCreating(false);
    setSidebarOpen(false);
    toast.success("Yeni not oluşturuldu", { description: `${title} arşive eklendi.` });
  }

  function selectNote(noteId: string) {
    setSelectedId(noteId);
    setSidebarOpen(false);
  }

  const lineCount = selectedNote?.body.split("\n").length ?? 1;

  return (
    <div className="my-notes-app">
      <header className="app-header">
        <div className="window-strip">
          <div className="window-identity">
            <img className="brand-mark brand-mark--tiny" src="/manus-storage/my-notes-mark_4aa7b77d.png" alt="My Notes işareti" />
            <span>My Notes</span>
            <span className="window-version">v3.4.12</span>
          </div>
          <div className="window-path">D:\Other\ertan.xml</div>
          <div className="window-system">Local archive <span aria-hidden="true">•</span> 12:11</div>
        </div>

        <nav className="menu-strip" aria-label="Uygulama menüsü">
          {[
            { label: "File", icon: FilePlus2 },
            { label: "Edit", icon: Settings2 },
            { label: "View", icon: LayoutGrid },
            { label: "Task", icon: Clock3 },
            { label: "Help", icon: CircleHelp },
          ].map(({ label }) => (
            <button key={label} className="menu-link" onClick={() => toast.info(`${label} menüsü hazır`, { description: "Klavye kısayolları ve temel eylemler aktif." })}>
              <span className="menu-key">{label.slice(0, 1)}</span>{label}
            </button>
          ))}
          <div className="menu-spacer" />
          <button className="menu-icon-button" aria-label="Yardım" onClick={() => toast.info("Kısayol: Ctrl + S", { description: "Notu kaydetmek için Ctrl + S kullanabilirsiniz." })}><Keyboard size={15} /></button>
          <button className="menu-icon-button" aria-label="Daha fazla seçenek" onClick={() => toast.info("My Notes", { description: "Tarayıcıda çalışan kişisel arşiv." })}><MoreHorizontal size={17} /></button>
        </nav>

        <div className="brand-strip">
          <div className="brand-lockup">
            <img className="brand-mark" src="/manus-storage/my-notes-mark_4aa7b77d.png" alt="" />
            <div>
              <div className="brand-name">MY NOTES</div>
              <div className="brand-subtitle">kişisel arşiv / browser edition</div>
            </div>
          </div>
          <div className="brand-actions">
            <button className="quiet-button mobile-toggle" onClick={() => setSidebarOpen(true)} aria-label="Klasör ağacını aç"><PanelLeft size={16} /> <span>Klasörler</span></button>
            <button className="quiet-button" onClick={() => setIsCreating(true)}><Plus size={16} /> <span>Yeni not</span></button>
            <button className="save-button" onClick={handleSave}><Save size={16} /> Kaydet <kbd>⌘S</kbd></button>
          </div>
        </div>
      </header>

      <div className="workspace-frame">
        <aside className={`sidebar ${sidebarOpen ? "sidebar--open" : ""}`} aria-label="Not klasörleri">
          <div className="sidebar-mobile-head">
            <span>Arşiv ağacı</span>
            <button className="icon-button" onClick={() => setSidebarOpen(false)} aria-label="Klasör ağacını kapat"><X size={16} /></button>
          </div>
          <div className="sidebar-heading">
            <div>
              <div className="eyebrow">WORKSPACE</div>
              <h1>Arşiv ağacı</h1>
            </div>
            <button className="icon-button icon-button--accent" onClick={() => toast.info("Klasör oluşturma", { description: "Yeni klasör akışı bir sonraki sürümde." })} aria-label="Yeni klasör"><FolderPlus size={16} /></button>
          </div>
          <label className="search-box">
            <Search size={16} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Arşivde ara" aria-label="Arşivde ara" />
            <kbd>⌘K</kbd>
          </label>

          <div className="tree-scroll">
            {visibleSections.map((section, sectionIndex) => {
              const SectionIcon = section.icon;
              return (
                <section className="tree-section" key={section.title}>
                  <div className="tree-section-heading">
                    <div className="tree-section-name"><SectionIcon size={15} /><span>{section.title}</span></div>
                    <button className="tree-more" aria-label={`${section.title} seçenekleri`} onClick={() => toast.info(section.title, { description: "Klasör seçenekleri" })}><MoreHorizontal size={14} /></button>
                  </div>
                  <div className="tree-items">
                    {section.items.length === 0 ? <div className="tree-empty">Eşleşen not yok</div> : section.items.map((item, index) => {
                      const ItemIcon = item.icon;
                      const isSelected = item.noteId === selectedId;
                      const isFolder = item.kind === "folder";
                      return (
                        <button key={item.noteId ?? item.label} className={`tree-item ${isSelected ? "tree-item--selected" : ""} ${isFolder ? "tree-item--folder" : ""}`} onClick={() => item.noteId ? selectNote(item.noteId) : toast.info(`${item.label} klasörü`, { description: "Bu klasör navigasyon için hazır." })} style={{ "--item-index": index } as React.CSSProperties}>
                          <span className="tree-branch" aria-hidden="true">{sectionIndex === 0 && <span>{index === section.items.length - 1 ? "└" : "├"}</span>}</span>
                          <ItemIcon size={15} className="tree-file-icon" />
                          <span className="tree-label">{item.label}</span>
                          {isSelected && <span className="tree-current-dot" aria-label="seçili" />}
                        </button>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>

          <div className="sidebar-footer">
            <div className="storage-line"><HardDrive size={14} /><span>Tarayıcı arşivi</span><strong>Yerel</strong></div>
            <div className="storage-meter"><span style={{ width: "34%" }} /></div>
            <div className="storage-caption">{noteCount} not · otomatik kayıt açık</div>
          </div>
        </aside>

        <main className="editor-workspace">
          <div className="editor-toolbar">
            <div className="breadcrumb"><span className="breadcrumb-muted">Notlarım</span><ChevronRight size={14} /><span>{selectedNote?.title}</span></div>
            <div className="toolbar-actions">
              <button className="toolbar-button" onClick={() => toast.info("Etiketler", { description: "Not etiketleri yakında." })}><Tag size={15} /> Etiketle</button>
              <button className="toolbar-button toolbar-button--icon" onClick={() => toast.info("Dışa aktarma", { description: "Metin kopyalamaya hazır." })} aria-label="Dışa aktar"><Download size={15} /></button>
              <button className="toolbar-button toolbar-button--icon" onClick={() => updateSelectedNote({ pinned: !selectedNote?.pinned })} aria-label="Notu sabitle"><Pin size={15} fill={selectedNote?.pinned ? "currentColor" : "none"} /></button>
            </div>
          </div>

          <div className="editor-heading">
            <div className="heading-kicker"><span className="status-led" /> EDITOR / PLAIN TEXT <span className="heading-divider">/</span> {selectedNote?.folder}</div>
            <input className="note-title-input" value={selectedNote?.title ?? ""} onChange={(event) => updateSelectedNote({ title: event.target.value })} aria-label="Not başlığı" />
            <div className="note-meta"><span><Clock3 size={13} /> Son düzenleme: {selectedNote?.updatedAt}</span><span>UTF-8</span><span>Satır sonu: LF</span></div>
          </div>

          <div className="editor-panel">
            <div className="editor-panel-topline"><span><TerminalSquareIcon /> {selectedNote?.title?.toLowerCase().replaceAll(" ", "-")}.txt</span><span className="editor-mode"><span className="live-dot" /> local edit mode</span></div>
            <div className="code-editor">
              <div className="line-numbers" aria-hidden="true">{Array.from({ length: lineCount }, (_, index) => <span key={index}>{String(index + 1).padStart(2, "0")}</span>)}</div>
              <textarea value={selectedNote?.body ?? ""} onChange={(event) => updateSelectedNote({ body: event.target.value })} spellCheck={false} aria-label="Not içeriği" />
            </div>
            <div className="editor-statusbar"><span><Check size={13} /> Değişiklikler yerel olarak saklanıyor</span><span>{selectedNote?.body.length ?? 0} karakter · {lineCount} satır</span></div>
          </div>

          <div className="editor-footer">
            <div className="footer-status"><span className="status-dot" /> Otomatik kayıt açık <span className="footer-separator">•</span> son kayıt {lastSaved}</div>
            <div className="shortcut-row"><span><kbd>⌘</kbd><kbd>S</kbd> kaydet</span><span><kbd>⌘</kbd><kbd>K</kbd> ara</span></div>
          </div>
        </main>

        <aside className="inspector" aria-label="Not bilgisi">
          <div className="inspector-topline"><span className="eyebrow">NOT BİLGİSİ</span><button className="icon-button" onClick={() => toast.info("Görünüm", { description: "Yan ray açık tutuldu." })} aria-label="Görünüm seçenekleri"><MoreHorizontal size={16} /></button></div>
          <div className="inspector-card inspector-card--primary">
            <div className="inspector-icon"><FileText size={18} /></div>
            <div className="inspector-card-title">{selectedNote?.title}</div>
            <div className="inspector-card-subtitle">{selectedNote?.folder} / plain text</div>
            <div className="inspector-rule" />
            <dl className="meta-list">
              <div><dt>Durum</dt><dd><span className="mini-led" /> Kaydedildi</dd></div>
              <div><dt>Boyut</dt><dd>{selectedNote?.body.length ?? 0} B</dd></div>
              <div><dt>Satır</dt><dd>{lineCount}</dd></div>
              <div><dt>Etiket</dt><dd>kişisel</dd></div>
            </dl>
          </div>

          <div className="inspector-card inspector-card--hint">
            <div className="hint-heading"><Sparkles size={15} /> Küçük not</div>
            <p>Bu arşiv, notları sunucuya göndermeden tarayıcında tutar. Fikirlerini hızlıca bırak, sonra klasör ağacından geri dön.</p>
            <div className="hint-art"><img src="/manus-storage/my-notes-index-card_6c2e1b7c.png" alt="Krem kâğıt kartları illüstrasyonu" /></div>
          </div>

          <div className="inspector-actions">
            <button onClick={() => setIsCreating(true)}><FilePlus2 size={15} /> Yeni not oluştur</button>
            <button onClick={() => toast.info("Klasör görünümü", { description: "Ağaç düzeni varsayılan olarak açık." })}><PanelLeft size={15} /> Ağacı düzenle</button>
          </div>
        </aside>
      </div>

      <div className="app-statusbar"><span><span className="status-dot status-dot--green" /> My Notes hazır</span><span className="statusbar-center">Copyright © All Rights Reserved 2014–2026 · Ertan KARAAŞLAN</span><span>Yerel çalışma alanı</span></div>

      {sidebarOpen && <button className="sidebar-scrim" aria-label="Klasör ağacını kapat" onClick={() => setSidebarOpen(false)} />}

      {isCreating && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setIsCreating(false)}>
          <form className="new-note-modal" onSubmit={handleCreateNote} onMouseDown={(event) => event.stopPropagation()}>
            <div className="modal-topline"><div><span className="eyebrow">ARCHIVE / NEW ITEM</span><h2>Yeni not oluştur</h2></div><button type="button" className="icon-button" onClick={() => setIsCreating(false)} aria-label="Pencereyi kapat"><X size={17} /></button></div>
            <p>Notun başlığını yazın. İçerik alanı, kaydettikten sonra düzenlenebilir.</p>
            <label className="modal-label" htmlFor="new-note-title">Başlık</label>
            <input id="new-note-title" autoFocus value={newTitle} onChange={(event) => setNewTitle(event.target.value)} placeholder="Örn. Yeni proje fikirleri" />
            <div className="modal-actions"><button type="button" className="quiet-button" onClick={() => setIsCreating(false)}>Vazgeç</button><button type="submit" className="save-button"><Plus size={15} /> Notu oluştur</button></div>
          </form>
        </div>
      )}
    </div>
  );
}

function TerminalSquareIcon() {
  return <span className="terminal-square-icon" aria-hidden="true"><span>&gt;_</span></span>;
}
