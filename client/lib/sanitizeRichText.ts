import sanitizeHtml from "sanitize-html"

// Event açıklaması RichTextEditor'dan (TipTap StarterKit) HTML olarak geliyor ve backend her
// string'i kabul ediyor — yani API'ye doğrudan <script> / onerror="…" gönderilebilir (XSS).
// dangerouslySetInnerHTML'den önce SADECE editörün üretebildiği etiketlere izin veriyoruz;
// geri kalan her etiket ve attribute (style, on*, javascript: link'leri…) siliniyor.
// Editöre yeni bir extension eklenirse (ör. heading) buraya da eklenmeli.
const RICH_TEXT_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: ["p", "br", "strong", "b", "em", "i", "u", "s", "ul", "ol", "li", "a"],
  allowedAttributes: { a: ["href", "target", "rel"] },
  allowedSchemes: ["http", "https", "mailto"],
  // Dış linkler yeni sekmede açılsın; noopener açılan sayfanın window.opener ile bizim
  // sekmemize erişmesini engelliyor, nofollow spam link'lere SEO değeri vermiyor.
  transformTags: {
    a: sanitizeHtml.simpleTransform("a", { target: "_blank", rel: "noopener noreferrer nofollow" }),
  },
}

export function sanitizeRichText(html: string) {
  return sanitizeHtml(html, RICH_TEXT_OPTIONS)
}

// Editör eklenmeden önce oluşturulmuş event'lerin açıklaması düz metin (satırlar "\n" ile).
export function isHtml(value: string) {
  return /<\/?[a-z][^>]*>/i.test(value)
}
