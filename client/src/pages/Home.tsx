// Style note: Archive Desktop — classic utility chrome, graphite editor focus, emerald archive signal.
import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, FormEvent, ReactNode } from "react";
import { toast } from "sonner";
import type { LucideIcon } from "lucide-react";
import {
  Archive,
  Bold,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock3,
  Code2,
  Download,
  Eye,
  FileCode2,
  FilePlus2,
  FileText,
  Folder,
  FolderOpen,
  FolderPlus,
  HardDrive,
  Heading2,
  Italic,
  Keyboard,
  LayoutGrid,
  List,
  ListOrdered,
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

type TagItem = { id: string; label: string; color: string };
type Note = { id: string; title: string; folder: string; body: string; updatedAt: string; pinned?: boolean; tags: string[] };
type FolderSection = { title: string; icon: LucideIcon; items: Array<{ label: string; noteId?: string; icon: LucideIcon; kind?: "folder" | "note" }> };
type MenuId = "file" | "edit" | "view" | "task" | "help";

const defaultTags: TagItem[] = [
  { id: "kişisel", label: "kişisel", color: "#2f8f68" },
  { id: "sistem", label: "sistem", color: "#627c9a" },
  { id: "iş", label: "iş", color: "#c58b3b" },
  { id: "fikir", label: "fikir", color: "#93699b" },
];
const tagColors = ["#2f8f68", "#627c9a", "#c58b3b", "#93699b", "#a75b4b", "#588d93"];

function makeNote(id: string, title: string, body: string, updatedAt: string, tags: string[] = [], pinned = false): Note {
  return { id, title, folder: "Notlarım", body, updatedAt, tags, pinned };
}

const seedNotes: Note[] = [
  makeNote("hatirlatmalar", "Hatırlatmalar", `email listesine eklenecekler...
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
— Canon EOS350D Photo's                                      OK`, "13 Ağu 2026, 12:11", ["kişisel", "sistem"], true),
  makeNote("program-hatalari", "Program Hataları ve Ek Özellikler", `# Program Hataları ve Ek Özellikler

1. Arama alanı açıkken yeni not oluşturulunca liste sıfırlanmalı.
2. Editör kaydında son düzenleme tarihi görünür olmalı.
3. Klasör ağacı klavye ile gezinilebilir olmalı.
4. Dışa aktarma işlemi seçili notla sınırlı kalmalı.

## Bir sonraki sürüm

- Etiket filtresi
- Notlar arası hızlı bağlantı
- Markdown önizleme`, "12 Ağu 2026, 16:40", ["iş", "fikir"]),
  makeNote("adresler", "Adresler", `# Adres defteri

## Ev
- İnternet sağlayıcı paneli
- Apartman yönetimi

## İş
- İç ağ / ekip paylaşımı
- Yedek sunucu

> Hassas bilgileri bu tarayıcı demosuna kaydetmeyin.`, "10 Ağu 2026, 09:18", ["kişisel"]),
  makeNote("my-memo", "My Memo", `# Bugün aklımda kalanlar

- Eski uygulamanın sadeliği hâlâ hızlı hissettiriyor.
- Klasör ağacı, notların nerede olduğunu unutmamayı sağlıyor.
- Yeni sürümde arama ve yerel kayıt ilk sınıf davranış olmalı.`, "08 Ağu 2026, 18:03", ["fikir"]),
  makeNote("diger-2", "Diğer 2", "Geçici notlar\n— Fotoğraf arşivi\n— Evrak düzeni\n— Yeni araç fikirleri", "07 Ağu 2026, 11:44"),
  makeNote("diger", "Diğer", "Çeşitli notlar.\n\nBu alan kısa, serbest biçimli notlar için ayrıldı.", "05 Ağu 2026, 14:12"),
  makeNote("toki-notlari", "TOKİ Notları", "# TOKİ notları\n\nTakip edilecek belgeler:\n- Başvuru\n- Sözleşme\n- Teslim bilgileri", "02 Ağu 2026, 10:31", ["iş"]),
  makeNote("kantin-borclari", "Kantin Borçları", "# Kantin borçları\n\nAy sonu kontrol listesi.", "29 Tem 2026, 17:20", ["iş"]),
  makeNote("organizyon", "Organizasyon Değişiklikleri", "# Organizasyon değişiklikleri\n\nToplantı akışı ve sorumluluklar.", "28 Tem 2026, 15:52", ["iş"]),
  makeNote("alisveris-listeleri", "Alış-Veriş Listeleri", "# Alış-Veriş Listeleri\n\n- [ ] Kablo düzenleyici\n- [ ] Arşiv klasörü\n- [ ] Mürekkep", "25 Tem 2026, 09:04", ["kişisel"]),
  makeNote("toki-bilgi", "TOKİ Bilgi Ekranı Notları", "Bilgi ekranı notları\n\nGüncel ekran metinleri ve kontrol maddeleri.", "21 Tem 2026, 13:25"),
  makeNote("china", "Alışveriş from China", "# Alışveriş from China\n\nÜrün karşılaştırma notları.", "18 Tem 2026, 20:10", ["kişisel"]),
  makeNote("photoshop-effect", "Photoshop Effect", "# Photoshop Effect\n\nKatman, maske ve renk notları.", "16 Tem 2026, 12:42", ["fikir"]),
  makeNote("backup-server", "Backup Server", "# Backup Server\n\nYedekleme kontrolü\n- Günlük\n- Haftalık\n- Aylık", "12 Tem 2026, 08:27", ["sistem"]),
  makeNote("konut", "Başkanlık Konut Üretim Raporu", "# Başkanlık Konut Üretim Raporu\n\nRapor başlıkları ve teslim tarihleri.", "10 Tem 2026, 17:02", ["iş"]),
  makeNote("photoshop-styles", "Photoshop Styles", "Photoshop stilleri, preset notları ve renk paletleri.", "07 Tem 2026, 10:03", ["fikir"]),
  makeNote("satis-isleri", "Satış İşleri", "# Satış İşleri\n\nTakip edilecek satış işlemleri.", "03 Tem 2026, 09:12", ["iş"]),
  makeNote("security-codes", "Security Codes", "Hassas kodları bu örnek alana yazmayın.", "30 Haz 2026, 16:51", ["sistem"]),
];

const sections: FolderSection[] = [
  { title: "Notlarım", icon: FolderOpen, items: [
    ["Hatırlatmalar", "hatirlatmalar"], ["Program Hataları ve Ek Özellikler", "program-hatalari"], ["Adresler", "adresler"], ["My Memo", "my-memo"], ["Diğer 2", "diger-2"], ["Diğer", "diger"], ["TOKİ Notları", "toki-notlari"], ["Kantin Borçları", "kantin-borclari"], ["Organizasyon Değişiklikleri", "organizyon"], ["Alış-Veriş Listeleri", "alisveris-listeleri"], ["TOKİ Bilgi Ekranı Notları", "toki-bilgi"], ["Alışveriş from China", "china"], ["Photoshop Effect", "photoshop-effect"], ["Backup Server", "backup-server"], ["Başkanlık Konut Üretim Raporu", "konut"], ["Photoshop Styles", "photoshop-styles"], ["Satış İşleri", "satis-isleri"], ["Security Codes", "security-codes"],
  ].map(([label, noteId]) => ({ label, noteId, icon: FileText, kind: "note" as const })) },
  { title: "Codes", icon: Code2, items: ["Visual Basic Codes", "Excel VBA Codes", "Other Codes", "PowerShell & VBS Scripts", "Arduino"].map((label) => ({ label, icon: Folder, kind: "folder" as const })) },
  { title: "Other", icon: Archive, items: [{ label: "Dualar", icon: FolderOpen, kind: "folder" as const }] },
];

const starterBody = `# Yeni notunu buraya yaz

Fikirlerini **kalın**, *italik* veya listelerle düzenleyebilirsin.

- Klasör ağacını kullan
- Etiket ekle
- Ctrl + S ile kaydet`;

function normalizeNotes(raw: unknown): Note[] {
  if (!Array.isArray(raw)) return seedNotes;
  return raw.map((item, index) => {
    const candidate = item as Partial<Note>;
    const legacyTags = seedNotes.find((seed) => seed.id === candidate.id)?.tags ?? [];
    return {
      id: String(candidate.id ?? `note-${index}`), title: String(candidate.title ?? "Adsız not"), folder: String(candidate.folder ?? "Notlarım"),
      body: String(candidate.body ?? ""), updatedAt: String(candidate.updatedAt ?? "Henüz kaydedilmedi"), pinned: Boolean(candidate.pinned),
      tags: Array.isArray(candidate.tags) ? candidate.tags.map(String) : legacyTags,
    };
  });
}

function loadNotes() {
  try { return normalizeNotes(JSON.parse(window.localStorage.getItem("my-notes-js/notes") ?? "null")); } catch { return seedNotes; }
}

function formatNow() {
  return new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date());
}

function slugify(value: string) {
  return value.toLocaleLowerCase("tr-TR").replace(/[^a-z0-9ğüşöçıİĞÜŞÖÇ]+/gi, "-").replace(/^-|-$/g, "") || "my-note";
}

function downloadFile(content: string, fileName: string, mime: string) {
  const blob = new Blob([content], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url; anchor.download = fileName; anchor.click();
  URL.revokeObjectURL(url);
}

function inlineMarkdown(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\(https?:\/\/[^)]+\))/g).filter(Boolean);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={index}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*")) return <em key={index}>{part.slice(1, -1)}</em>;
    if (part.startsWith("`") && part.endsWith("`")) return <code key={index}>{part.slice(1, -1)}</code>;
    const link = part.match(/^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/);
    if (link) return <a key={index} href={link[2]} target="_blank" rel="noreferrer">{link[1]}</a>;
    return <span key={index}>{part}</span>;
  });
}

function markdownPreview(markdown: string): ReactNode[] {
  const lines = markdown.split("\n");
  const blocks: ReactNode[] = [];
  let index = 0;
  const isBlockStart = (line: string) => /^(#{1,3}\s|[-*+]\s|\d+\.\s|>\s|```)/.test(line);
  while (index < lines.length) {
    const line = lines[index];
    if (!line.trim()) { index += 1; continue; }
    if (line.startsWith("```")) {
      const language = line.slice(3).trim(); const code: string[] = []; index += 1;
      while (index < lines.length && !lines[index].startsWith("```")) { code.push(lines[index]); index += 1; }
      index += 1; blocks.push(<pre key={`code-${index}`}><code data-language={language}>{code.join("\n")}</code></pre>); continue;
    }
    const heading = line.match(/^(#{1,3})\s+(.+)/);
    if (heading) { const Heading = `h${heading[1].length}` as "h1" | "h2" | "h3"; blocks.push(<Heading key={`heading-${index}`}>{inlineMarkdown(heading[2])}</Heading>); index += 1; continue; }
    if (/^[-*+]\s/.test(line)) { const items: string[] = []; while (index < lines.length && /^[-*+]\s/.test(lines[index])) { items.push(lines[index].replace(/^[-*+]\s/, "")); index += 1; } blocks.push(<ul key={`ul-${index}`}>{items.map((item, itemIndex) => <li key={itemIndex}>{inlineMarkdown(item)}</li>)}</ul>); continue; }
    if (/^\d+\.\s/.test(line)) { const items: string[] = []; while (index < lines.length && /^\d+\.\s/.test(lines[index])) { items.push(lines[index].replace(/^\d+\.\s/, "")); index += 1; } blocks.push(<ol key={`ol-${index}`}>{items.map((item, itemIndex) => <li key={itemIndex}>{inlineMarkdown(item)}</li>)}</ol>); continue; }
    if (/^>\s/.test(line)) { const quote: string[] = []; while (index < lines.length && /^>\s/.test(lines[index])) { quote.push(lines[index].replace(/^>\s/, "")); index += 1; } blocks.push(<blockquote key={`quote-${index}`}>{quote.map((item, itemIndex) => <div key={itemIndex}>{inlineMarkdown(item)}</div>)}</blockquote>); continue; }
    const paragraph: string[] = []; while (index < lines.length && lines[index].trim() && !isBlockStart(lines[index])) { paragraph.push(lines[index]); index += 1; }
    blocks.push(<p key={`paragraph-${index}`}>{inlineMarkdown(paragraph.join(" "))}</p>);
  }
  return blocks;
}

export default function Home() {
  const [notes, setNotes] = useState<Note[]>(loadNotes);
  const [availableTags, setAvailableTags] = useState<TagItem[]>(() => { try { const saved = JSON.parse(window.localStorage.getItem("my-notes-js/tags") ?? "null"); return Array.isArray(saved) ? saved : defaultTags; } catch { return defaultTags; } });
  const [selectedId, setSelectedId] = useState("hatirlatmalar");
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showInspector, setShowInspector] = useState(true);
  const [previewMode, setPreviewMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState<MenuId | null>(null);
  const [tagPanelOpen, setTagPanelOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [newTagLabel, setNewTagLabel] = useState("");
  const [newTagColor, setNewTagColor] = useState(tagColors[0]);
  const [lastSaved, setLastSaved] = useState("12:11");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const selectedNote = notes.find((note) => note.id === selectedId) ?? notes[0];
  const filteredQuery = query.trim().toLocaleLowerCase("tr-TR");
  const noteMap = useMemo(() => new Map(notes.map((note) => [note.id, note])), [notes]);
  const selectedTags = selectedNote?.tags ?? [];
  const tagMap = useMemo(() => new Map(availableTags.map((tag) => [tag.id, tag])), [availableTags]);
  const tagCounts = useMemo(() => new Map(availableTags.map((tag) => [tag.id, notes.filter((note) => note.tags.includes(tag.id)).length])), [availableTags, notes]);
  const noteCount = notes.length;
  const lineCount = selectedNote?.body.split("\n").length ?? 1;

  const visibleSections = useMemo(() => {
    const knownIds = new Set(sections[0].items.map((item) => item.noteId));
    const extraNotes = notes.filter((note) => !knownIds.has(note.id)).map((note) => ({ label: note.title, noteId: note.id, icon: FileText, kind: "note" as const }));
    const matches = (item: { label: string; noteId?: string }) => {
      const note = item.noteId ? noteMap.get(item.noteId) : undefined;
      const searchMatch = !filteredQuery || item.label.toLocaleLowerCase("tr-TR").includes(filteredQuery);
      const tagMatch = !activeTag || Boolean(note?.tags.includes(activeTag));
      return searchMatch && tagMatch;
    };
    return sections.map((section, sectionIndex) => ({ ...section, items: [...(sectionIndex === 0 ? extraNotes : []), ...section.items].filter(matches) }));
  }, [activeTag, filteredQuery, noteMap, notes]);

  useEffect(() => { window.localStorage.setItem("my-notes-js/notes", JSON.stringify(notes)); }, [notes]);
  useEffect(() => { window.localStorage.setItem("my-notes-js/tags", JSON.stringify(availableTags)); }, [availableTags]);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") { event.preventDefault(); handleSave(); }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") { event.preventDefault(); document.querySelector<HTMLInputElement>(".search-box input")?.focus(); }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "e") { event.preventDefault(); downloadNote("md"); }
      if (event.key === "Escape") { setMenuOpen(null); setTagPanelOpen(false); setExportOpen(false); setHelpOpen(false); }
    };
    window.addEventListener("keydown", onKeyDown); return () => window.removeEventListener("keydown", onKeyDown);
  });

  function updateSelectedNote(patch: Partial<Note>) {
    if (!selectedNote) return;
    setNotes((current) => current.map((note) => note.id === selectedNote.id ? { ...note, ...patch } : note));
  }

  function handleSave() {
    const now = formatNow();
    setNotes((current) => current.map((note) => note.id === selectedId ? { ...note, updatedAt: now } : note));
    setLastSaved(now.split(", ").pop() ?? now);
    toast.success("Not kaydedildi", { description: "Değişiklikler bu tarayıcıda saklandı." });
  }

  function handleCreateNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const title = newTitle.trim();
    if (!title) { toast.error("Bir not adı yazın"); return; }
    const id = `note-${Date.now()}`;
    setNotes((current) => [{ id, title, folder: "Notlarım", body: starterBody, updatedAt: formatNow(), tags: ["fikir"] }, ...current]);
    setSelectedId(id); setNewTitle(""); setIsCreating(false); setSidebarOpen(false); toast.success("Yeni not oluşturuldu", { description: `${title} arşive eklendi.` });
  }

  function insertMarkdown(prefix: string, suffix = prefix) {
    const textarea = textareaRef.current; if (!textarea || !selectedNote) return;
    const start = textarea.selectionStart; const end = textarea.selectionEnd; const selected = selectedNote.body.slice(start, end) || "metin";
    const nextBody = `${selectedNote.body.slice(0, start)}${prefix}${selected}${suffix}${selectedNote.body.slice(end)}`;
    updateSelectedNote({ body: nextBody });
    requestAnimationFrame(() => { textarea.focus(); textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length); });
  }

  function insertList(ordered = false) {
    const textarea = textareaRef.current; if (!textarea || !selectedNote) return;
    const start = textarea.selectionStart; const end = textarea.selectionEnd; const selected = selectedNote.body.slice(start, end) || "liste öğesi";
    const lines = selected.split("\n").map((line, index) => `${ordered ? `${index + 1}.` : "-"} ${line}`);
    const replacement = lines.join("\n");
    updateSelectedNote({ body: `${selectedNote.body.slice(0, start)}${replacement}${selectedNote.body.slice(end)}` });
    requestAnimationFrame(() => { textarea.focus(); textarea.setSelectionRange(start, start + replacement.length); });
  }

  function downloadNote(format: "txt" | "md") {
    if (!selectedNote) return;
    const extension = format === "md" ? "md" : "txt";
    downloadFile(selectedNote.body, `${slugify(selectedNote.title)}.${extension}`, format === "md" ? "text/markdown" : "text/plain");
    setExportOpen(false); setMenuOpen(null); toast.success(`${extension.toUpperCase()} dışa aktarıldı`, { description: `${selectedNote.title}.${extension} indirilmeye hazır.` });
  }

  function toggleTag(tagId: string) {
    if (!selectedNote) return;
    const nextTags = selectedTags.includes(tagId) ? selectedTags.filter((id) => id !== tagId) : [...selectedTags, tagId];
    updateSelectedNote({ tags: nextTags });
  }

  function createTag(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const label = newTagLabel.trim(); const id = slugify(label);
    if (!label) { toast.error("Etiket adı yazın"); return; }
    if (availableTags.some((tag) => tag.id === id)) { toast.error("Bu etiket zaten var"); return; }
    setAvailableTags((current) => [...current, { id, label, color: newTagColor }]);
    updateSelectedNote({ tags: [...selectedTags, id] }); setNewTagLabel(""); toast.success("Etiket oluşturuldu", { description: `#${label} seçili nota eklendi.` });
  }

  function handleMenuAction(action: () => void) { action(); setMenuOpen(null); }

  const menuItems: Record<MenuId, Array<{ label: string; icon: LucideIcon; action: () => void }>> = {
    file: [
      { label: "Yeni not", icon: FilePlus2, action: () => setIsCreating(true) },
      { label: "Notu kaydet", icon: Save, action: handleSave },
      { label: "Markdown dışa aktar", icon: FileCode2, action: () => downloadNote("md") },
      { label: "TXT dışa aktar", icon: Download, action: () => downloadNote("txt") },
    ],
    edit: [
      { label: "Başlığa odaklan", icon: Heading2, action: () => document.querySelector<HTMLInputElement>(".note-title-input")?.focus() },
      { label: "Editöre odaklan", icon: Code2, action: () => { setPreviewMode(false); requestAnimationFrame(() => textareaRef.current?.focus()); } },
      { label: "Kalın biçim ekle", icon: Bold, action: () => insertMarkdown("**") },
      { label: "İtalik biçim ekle", icon: Italic, action: () => insertMarkdown("*") },
    ],
    view: [
      { label: previewMode ? "Düzenleyiciye dön" : "Markdown önizleme", icon: previewMode ? Code2 : Eye, action: () => setPreviewMode((current) => !current) },
      { label: showInspector ? "Bilgi rayını gizle" : "Bilgi rayını göster", icon: LayoutGrid, action: () => setShowInspector((current) => !current) },
      { label: sidebarOpen ? "Klasörleri kapat" : "Klasörleri aç", icon: PanelLeft, action: () => setSidebarOpen((current) => !current) },
    ],
    task: [
      { label: selectedNote?.pinned ? "Sabitlemeyi kaldır" : "Notu sabitle", icon: Pin, action: () => updateSelectedNote({ pinned: !selectedNote?.pinned }) },
      { label: "Etiket panelini aç", icon: Tag, action: () => setTagPanelOpen(true) },
      { label: "Kayıt durumunu göster", icon: Check, action: () => toast.success("Kayıt açık", { description: "Notlar bu tarayıcıda otomatik olarak saklanıyor." }) },
    ],
    help: [
      { label: "Klavye kısayolları", icon: Keyboard, action: () => setHelpOpen(true) },
      { label: "Markdown söz dizimi", icon: CircleHelp, action: () => setHelpOpen(true) },
      { label: "My Notes hakkında", icon: Sparkles, action: () => toast.info("My Notes", { description: "Kişisel arşiv için yerel, hızlı ve düzenlenebilir bir çalışma alanı." }) },
    ],
  };

  return (
    <div className="my-notes-app">
      <header className="app-header">
        <div className="window-strip"><div className="window-identity"><img className="brand-mark brand-mark--tiny" src="/manus-storage/my-notes-mark_4aa7b77d.png" alt="My Notes işareti" /><span>My Notes</span><span className="window-version">v3.4.12</span></div><div className="window-path">D:\Other\ertan.xml</div><div className="window-system">Local archive <span aria-hidden="true">•</span> 12:11</div></div>
        <nav className="menu-strip" aria-label="Uygulama menüsü">
          {(["file", "edit", "view", "task", "help"] as MenuId[]).map((id) => <div className="menu-wrap" key={id}><button className={`menu-link ${menuOpen === id ? "menu-link--open" : ""}`} aria-expanded={menuOpen === id} onClick={() => setMenuOpen((current) => current === id ? null : id)}><span className="menu-key">{id.slice(0, 1).toUpperCase()}</span>{id[0].toUpperCase() + id.slice(1)}<ChevronDown size={11} /></button>{menuOpen === id && <div className="menu-popover" role="menu">{menuItems[id].map(({ label, icon: Icon, action }) => <button key={label} role="menuitem" onClick={() => handleMenuAction(action)}><Icon size={14} /><span>{label}</span></button>)}</div>}</div>)}
          <div className="menu-spacer" /><button className="menu-icon-button" aria-label="Klavye kısayolları" onClick={() => setHelpOpen(true)}><Keyboard size={15} /></button><button className="menu-icon-button" aria-label="My Notes hakkında" onClick={() => toast.info("My Notes", { description: "Tarayıcıda çalışan kişisel arşiv." })}><MoreHorizontal size={17} /></button>
        </nav>
        <div className="brand-strip"><div className="brand-lockup"><img className="brand-mark" src="/manus-storage/my-notes-mark_4aa7b77d.png" alt="" /><div><div className="brand-name">MY NOTES</div><div className="brand-subtitle">kişisel arşiv / browser edition</div></div></div><div className="brand-actions"><button className="quiet-button mobile-toggle" onClick={() => setSidebarOpen(true)} aria-label="Klasör ağacını aç"><PanelLeft size={16} /><span>Klasörler</span></button><button className="quiet-button" onClick={() => setIsCreating(true)}><Plus size={16} /><span>Yeni not</span></button><button className="save-button" onClick={handleSave}><Save size={16} /> Kaydet <kbd>⌘S</kbd></button></div></div>
      </header>

      <div className={`workspace-frame ${showInspector ? "" : "workspace-frame--no-inspector"}`}>
        <aside className={`sidebar ${sidebarOpen ? "sidebar--open" : ""}`} aria-label="Not klasörleri">
          <div className="sidebar-mobile-head"><span>Arşiv ağacı</span><button className="icon-button" onClick={() => setSidebarOpen(false)} aria-label="Klasör ağacını kapat"><X size={16} /></button></div>
          <div className="sidebar-heading"><div><div className="eyebrow">WORKSPACE</div><h1>Arşiv ağacı</h1></div><button className="icon-button icon-button--accent" onClick={() => toast.info("Klasör oluşturma", { description: "Yeni klasör akışı bir sonraki sürümde." })} aria-label="Yeni klasör"><FolderPlus size={16} /></button></div>
          <label className="search-box"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Arşivde ara" aria-label="Arşivde ara" /><kbd>⌘K</kbd></label>
          <div className="sidebar-tags"><div className="sidebar-subheading"><span>ETİKETLER</span><button className="tree-more" onClick={() => setTagPanelOpen(true)} aria-label="Etiketleri yönet"><Plus size={14} /></button></div><button className={`tag-filter ${activeTag === null ? "tag-filter--active" : ""}`} onClick={() => setActiveTag(null)}><span className="tag-swatch tag-swatch--all" />Tüm notlar<span>{noteCount}</span></button>{availableTags.map((tag) => <button key={tag.id} className={`tag-filter ${activeTag === tag.id ? "tag-filter--active" : ""}`} onClick={() => setActiveTag((current) => current === tag.id ? null : tag.id)}><span className="tag-swatch" style={{ background: tag.color }} />{tag.label}<span>{tagCounts.get(tag.id) ?? 0}</span></button>)}</div>
          <div className="tree-scroll">{visibleSections.map((section, sectionIndex) => { const SectionIcon = section.icon; return <section className="tree-section" key={section.title}><div className="tree-section-heading"><div className="tree-section-name"><SectionIcon size={15} /><span>{section.title}</span></div><button className="tree-more" aria-label={`${section.title} seçenekleri`} onClick={() => toast.info(section.title, { description: "Klasör seçenekleri" })}><MoreHorizontal size={14} /></button></div><div className="tree-items">{section.items.length === 0 ? <div className="tree-empty">Eşleşen not yok</div> : section.items.map((item, index) => { const ItemIcon = item.icon; const isSelected = item.noteId === selectedId; const isFolder = item.kind === "folder"; const itemTags = item.noteId ? noteMap.get(item.noteId)?.tags.slice(0, 1) ?? [] : []; return <button key={item.noteId ?? item.label} className={`tree-item ${isSelected ? "tree-item--selected" : ""} ${isFolder ? "tree-item--folder" : ""}`} onClick={() => item.noteId ? (setSelectedId(item.noteId), setSidebarOpen(false)) : toast.info(`${item.label} klasörü`, { description: "Bu klasör navigasyon için hazır." })} style={{ "--item-index": index } as CSSProperties}><span className="tree-branch" aria-hidden="true">{sectionIndex === 0 && <span>{index === section.items.length - 1 ? "└" : "├"}</span>}</span><ItemIcon size={15} className="tree-file-icon" /><span className="tree-label">{item.label}</span>{itemTags.map((tagId) => <span key={tagId} className="tree-note-dot" style={{ background: tagMap.get(tagId)?.color }} />)}{isSelected && <span className="tree-current-dot" aria-label="seçili" />}</button>; })}</div></section>; })}</div>
          <div className="sidebar-footer"><div className="storage-line"><HardDrive size={14} /><span>Tarayıcı arşivi</span><strong>Yerel</strong></div><div className="storage-meter"><span style={{ width: "34%" }} /></div><div className="storage-caption">{noteCount} not · otomatik kayıt açık</div></div>
        </aside>

        <main className="editor-workspace">
          <div className="editor-toolbar"><div className="breadcrumb"><span className="breadcrumb-muted">{selectedNote?.folder}</span><ChevronRight size={14} /><span>{selectedNote?.title}</span></div><div className="toolbar-actions"><div className="tag-panel-wrap"><button className={`toolbar-button ${tagPanelOpen ? "toolbar-button--active" : ""}`} onClick={() => setTagPanelOpen((current) => !current)}><Tag size={15} /> Etiketle</button>{tagPanelOpen && <div className="tag-popover"><div className="tag-popover-heading"><span>NOT ETİKETLERİ</span><button className="icon-button" onClick={() => setTagPanelOpen(false)} aria-label="Etiket panelini kapat"><X size={14} /></button></div><div className="tag-choices">{availableTags.map((tag) => <button key={tag.id} className={`tag-choice ${selectedTags.includes(tag.id) ? "tag-choice--selected" : ""}`} onClick={() => toggleTag(tag.id)}><span className="tag-swatch" style={{ background: tag.color }} />{tag.label}{selectedTags.includes(tag.id) && <Check size={13} />}</button>)}</div><form className="new-tag-form" onSubmit={createTag}><div className="new-tag-fields"><input value={newTagLabel} onChange={(event) => setNewTagLabel(event.target.value)} placeholder="Yeni etiket" aria-label="Yeni etiket adı" /><button className="icon-button icon-button--accent" type="submit" aria-label="Etiket oluştur"><Plus size={15} /></button></div><div className="color-choice-row">{tagColors.map((color) => <button type="button" key={color} className={`color-choice ${newTagColor === color ? "color-choice--selected" : ""}`} style={{ background: color }} onClick={() => setNewTagColor(color)} aria-label={`${color} rengini seç`} />)}</div></form></div>}</div><div className="export-wrap"><button className="toolbar-button" onClick={() => setExportOpen((current) => !current)}><Download size={15} /> Dışa aktar <ChevronDown size={12} /></button>{exportOpen && <div className="export-popover"><button onClick={() => downloadNote("md")}><FileCode2 size={14} /> Markdown (.md)</button><button onClick={() => downloadNote("txt")}><FileText size={14} /> Düz metin (.txt)</button></div>}</div><button className="toolbar-button toolbar-button--icon" onClick={() => updateSelectedNote({ pinned: !selectedNote?.pinned })} aria-label="Notu sabitle"><Pin size={15} fill={selectedNote?.pinned ? "currentColor" : "none"} /></button></div></div>
          <div className="editor-heading"><div className="heading-kicker"><span className="status-led" /> EDITOR / MARKDOWN <span className="heading-divider">/</span> {selectedNote?.folder}</div><input className="note-title-input" value={selectedNote?.title ?? ""} onChange={(event) => updateSelectedNote({ title: event.target.value })} aria-label="Not başlığı" /><div className="note-meta"><span><Clock3 size={13} /> Son düzenleme: {selectedNote?.updatedAt}</span><span>UTF-8</span><span>Markdown</span><span>{selectedTags.length} etiket</span></div></div>
          <div className="format-toolbar"><div className="editor-mode-toggle"><button className={!previewMode ? "is-active" : ""} onClick={() => setPreviewMode(false)}><Code2 size={14} /> Yaz</button><button className={previewMode ? "is-active" : ""} onClick={() => setPreviewMode(true)}><Eye size={14} /> Önizleme</button></div><span className="format-divider" /><button title="Kalın" onClick={() => insertMarkdown("**")}><Bold size={15} /></button><button title="İtalik" onClick={() => insertMarkdown("*")}><Italic size={15} /></button><button title="Başlık" onClick={() => insertMarkdown("## ", "")}><Heading2 size={15} /></button><button title="Madde işaretli liste" onClick={() => insertList(false)}><List size={15} /></button><button title="Numaralı liste" onClick={() => insertList(true)}><ListOrdered size={15} /></button></div>
          <div className="editor-panel"><div className="editor-panel-topline"><span><TerminalSquareIcon /> {selectedNote?.title?.toLowerCase().replaceAll(" ", "-")}.md</span><span className="editor-mode"><span className="live-dot" /> {previewMode ? "markdown preview" : "local edit mode"}</span></div>{previewMode ? <article className="markdown-preview">{markdownPreview(selectedNote?.body ?? "")}</article> : <div className="code-editor"><div className="line-numbers" aria-hidden="true">{Array.from({ length: lineCount }, (_, index) => <span key={index}>{String(index + 1).padStart(2, "0")}</span>)}</div><textarea ref={textareaRef} value={selectedNote?.body ?? ""} onChange={(event) => updateSelectedNote({ body: event.target.value })} spellCheck={false} aria-label="Markdown not içeriği" /></div>}<div className="editor-statusbar"><span><Check size={13} /> {previewMode ? "Markdown önizleme açık" : "Değişiklikler yerel olarak saklanıyor"}</span><span>{selectedNote?.body.length ?? 0} karakter · {lineCount} satır</span></div></div>
          <div className="editor-footer"><div className="footer-status"><span className="status-dot" /> Otomatik kayıt açık <span className="footer-separator">•</span> son kayıt {lastSaved}</div><div className="shortcut-row"><span><kbd>⌘</kbd><kbd>S</kbd> kaydet</span><span><kbd>⌘</kbd><kbd>K</kbd> ara</span><span><kbd>⌘</kbd><kbd>E</kbd> dışa aktar</span></div></div>
        </main>

        {showInspector && <aside className="inspector" aria-label="Not bilgisi"><div className="inspector-topline"><span className="eyebrow">NOT BİLGİSİ</span><button className="icon-button" onClick={() => setShowInspector(false)} aria-label="Bilgi rayını kapat"><X size={15} /></button></div><div className="inspector-card inspector-card--primary"><div className="inspector-icon"><FileText size={18} /></div><div className="inspector-card-title">{selectedNote?.title}</div><div className="inspector-card-subtitle">{selectedNote?.folder} / markdown</div><div className="inspector-rule" /><dl className="meta-list"><div><dt>Durum</dt><dd><span className="mini-led" /> Kaydedildi</dd></div><div><dt>Boyut</dt><dd>{selectedNote?.body.length ?? 0} B</dd></div><div><dt>Satır</dt><dd>{lineCount}</dd></div><div><dt>Etiket</dt><dd>{selectedTags.length}</dd></div></dl><div className="inspector-tags">{selectedTags.length ? selectedTags.map((tagId) => <button key={tagId} className="tag-chip" onClick={() => toggleTag(tagId)}><span className="tag-swatch" style={{ background: tagMap.get(tagId)?.color }} />{tagMap.get(tagId)?.label ?? tagId}<X size={11} /></button>) : <span className="empty-tags">Henüz etiket eklenmedi</span>}</div></div><div className="inspector-card inspector-card--hint"><div className="hint-heading"><Sparkles size={15} /> Küçük not</div><p>Markdown ile notlarını biçimlendir; etiketlerle arşivi filtrele. Dışa aktar menüsüyle dosyanı bilgisayarına al.</p><div className="hint-art"><img src="/manus-storage/my-notes-index-card_6c2e1b7c.png" alt="Krem kâğıt kartları illüstrasyonu" /></div></div><div className="inspector-actions"><button onClick={() => setIsCreating(true)}><FilePlus2 size={15} /> Yeni not oluştur</button><button onClick={() => setTagPanelOpen(true)}><Tag size={15} /> Etiketleri yönet</button><button onClick={() => setShowInspector(false)}><PanelLeft size={15} /> Bilgi rayını gizle</button></div></aside>}
      </div>

      <div className="app-statusbar"><span><span className="status-dot status-dot--green" /> My Notes hazır</span><span className="statusbar-center">Copyright © All Rights Reserved 2014–2026 · Ertan KARAAŞLAN</span><span>Yerel çalışma alanı</span></div>
      {sidebarOpen && <button className="sidebar-scrim" aria-label="Klasör ağacını kapat" onClick={() => setSidebarOpen(false)} />}
      {isCreating && <div className="modal-backdrop" role="presentation" onMouseDown={() => setIsCreating(false)}><form className="new-note-modal" onSubmit={handleCreateNote} onMouseDown={(event) => event.stopPropagation()}><div className="modal-topline"><div><span className="eyebrow">ARCHIVE / NEW ITEM</span><h2>Yeni not oluştur</h2></div><button type="button" className="icon-button" onClick={() => setIsCreating(false)} aria-label="Pencereyi kapat"><X size={17} /></button></div><p>Notun başlığını yazın. İçerik alanı Markdown destekler.</p><label className="modal-label" htmlFor="new-note-title">Başlık</label><input id="new-note-title" autoFocus value={newTitle} onChange={(event) => setNewTitle(event.target.value)} placeholder="Örn. Yeni proje fikirleri" /><div className="modal-actions"><button type="button" className="quiet-button" onClick={() => setIsCreating(false)}>Vazgeç</button><button type="submit" className="save-button"><Plus size={15} /> Notu oluştur</button></div></form></div>}
      {helpOpen && <div className="modal-backdrop" role="presentation" onMouseDown={() => setHelpOpen(false)}><div className="new-note-modal help-modal" onMouseDown={(event) => event.stopPropagation()}><div className="modal-topline"><div><span className="eyebrow">MY NOTES / HELP</span><h2>Kısa kullanım rehberi</h2></div><button className="icon-button" onClick={() => setHelpOpen(false)} aria-label="Yardımı kapat"><X size={17} /></button></div><p>Menüler ve kısayollar, notları düzenlerken hızlı kalmanız için gerçek eylemlere bağlıdır.</p><div className="help-grid"><span><kbd>⌘</kbd><kbd>S</kbd> Notu kaydet</span><span><kbd>⌘</kbd><kbd>K</kbd> Arşivde ara</span><span><kbd>**</kbd> Kalın metin</span><span><kbd>*</kbd> İtalik metin</span><span><kbd>-</kbd> Madde listesi</span><span><kbd>1.</kbd> Numaralı liste</span></div><div className="modal-actions"><button className="save-button" onClick={() => setHelpOpen(false)}>Anladım</button></div></div></div>}
    </div>
  );
}

function TerminalSquareIcon() { return <span className="terminal-square-icon" aria-hidden="true"><span>&gt;_</span></span>; }
