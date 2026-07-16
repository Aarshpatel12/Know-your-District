import re

# Update ChatWidget.jsx
with open('src/components/ChatWidget.jsx', 'r', encoding='utf-8') as f:
    chat_content = f.read()

# Add useLanguage import
chat_content = chat_content.replace(
    "import { MessageCircle, X, Send, User, Bot, Loader2, Volume2, VolumeX } from 'lucide-react';",
    "import { MessageCircle, X, Send, User, Bot, Loader2, Volume2, VolumeX } from 'lucide-react';\nimport { useLanguage } from '../context/LanguageContext';"
)

# Add useLanguage hook inside ChatWidget
chat_content = chat_content.replace(
    "export default function ChatWidget() {\n  const [isOpen, setIsOpen] = useState(false);",
    "export default function ChatWidget() {\n  const { t, currentLang } = useLanguage();\n  const [isOpen, setIsOpen] = useState(false);"
)

# Update Welcome Message
chat_content = chat_content.replace(
    "text: 'Hello! I am your AI Citizen Assistant. How can I help you with government services in Ludhiana?'",
    "text: t('chat_welcome')"
)

# Update TTS language
chat_content = chat_content.replace(
    'sourceLanguage: "pa" // Punjabi',
    'sourceLanguage: currentLang'
)

# Update error fallback
chat_content = chat_content.replace(
    'const fallbackText = "Sorry, I couldn\'t connect to the server. Please try again later.";',
    "const fallbackText = t('chat_error');"
)

# Update Title
chat_content = chat_content.replace(
    '<h3 className="font-semibold text-lg">AI Citizen Assistant</h3>',
    '<h3 className="font-semibold text-lg">{t(\'chat_title\')}</h3>'
)

# Update Mute/Enable Voice
chat_content = chat_content.replace(
    'title={voiceMode ? "Mute Voice" : "Enable Voice"}',
    "title={voiceMode ? t('chat_mute') : t('chat_enable')}"
)

# Update Speaking...
chat_content = chat_content.replace(
    '<span className="text-[10px] text-green-600 ml-1 leading-none">Speaking...</span>',
    '<span className="text-[10px] text-green-600 ml-1 leading-none">{t(\'chat_speaking\')}</span>'
)

# Update Placeholder
chat_content = chat_content.replace(
    'placeholder="Ask a question..."',
    'placeholder={t(\'chat_placeholder\')}'
)

with open('src/components/ChatWidget.jsx', 'w', encoding='utf-8') as f:
    f.write(chat_content)

print("ChatWidget updated!")

# Update MapSidebar.jsx
with open('src/components/MapSidebar.jsx', 'r', encoding='utf-8') as f:
    map_content = f.read()

# Add useLanguage import
if "import { useLanguage }" not in map_content:
    map_content = map_content.replace(
        "import Tesseract from 'tesseract.js';",
        "import Tesseract from 'tesseract.js';\nimport { useLanguage } from '../context/LanguageContext';"
    )

def inject_hook(func_name, code):
    return re.sub(
        rf"(function {func_name}\([^)]*\)\s*{{)",
        r"\1\n  const { t } = useLanguage();",
        code
    )

map_content = inject_hook("KanungoCard", map_content)
map_content = inject_hook("PatwariCard", map_content)
map_content = inject_hook("BookingQueueWidget", map_content)
map_content = inject_hook("DocumentScannerWidget", map_content)
map_content = inject_hook("SewaKendraCard", map_content)
map_content = inject_hook("HospitalCard", map_content)
map_content = inject_hook("AwcCard", map_content)
map_content = inject_hook("BloCard", map_content)

map_content = re.sub(
    r"(export default function MapSidebar\([^)]*\)\s*{)",
    r"\1\n  const { t, currentLang } = useLanguage();",
    map_content
)

# Replace category config labels
map_content = map_content.replace("label: 'Patwari Directory'", "label: 'dir_patwari'")
map_content = map_content.replace("label: 'Kanungo Directory'", "label: 'dir_kanungo'")
map_content = map_content.replace("label: 'Sewa Kendra Directory'", "label: 'dir_sewakendra'")
map_content = map_content.replace("label: 'Govt Health Facilities'", "label: 'dir_hospital'")
map_content = map_content.replace("label: 'Anganwadi Centers'", "label: 'dir_awc'")
map_content = map_content.replace("label: 'BLO Directory'", "label: 'dir_blo'")

map_content = map_content.replace(
    "const cfg   = CATEGORY_CONFIG[category] || { label: `${category} Directory`, color: 'green', icon: null };",
    "const cfgRaw   = CATEGORY_CONFIG[category] || { label: `${category} Directory`, color: 'green', icon: null };\n  const cfg = { ...cfgRaw, label: CATEGORY_CONFIG[category] ? t(CATEGORY_CONFIG[category].label) : cfgRaw.label };"
)

# Replace specific strings
map_content = map_content.replace("📍 {item.tehsil} Tehsil", "📍 {item.tehsil} {t('lbl_tehsil')}")
map_content = map_content.replace('<span className="font-semibold">Circles: </span>', '<span className="font-semibold">{t("lbl_circles")}: </span>')
map_content = map_content.replace('<span className="text-[11px] font-semibold text-gray-700">Live Queue:</span>', '<span className="text-[11px] font-semibold text-gray-700">{t("queue_live")}:</span>')
map_content = map_content.replace("🔴 Crowded", "🔴 {t('queue_crowded')}")
map_content = map_content.replace("🟢 Moderate", "🟢 {t('queue_moderate')}")
map_content = map_content.replace(" waiting)", " {t('queue_waiting')})")
map_content = map_content.replace("📅 Book a Slot (Free Token)", "📅 {t('btn_book_slot')}")
map_content = map_content.replace("Your Digital Token", "{t('lbl_digital_token')}")
map_content = map_content.replace("Show this QR at the counter to skip the queue.", "{t('lbl_qr_desc')}")
map_content = map_content.replace("Pre-Verify Your Document", "{t('scan_title')}")
map_content = map_content.replace("Upload an image of your document to have AI quickly verify if it meets the requirements before you visit the center.", "{t('scan_desc')}")
map_content = map_content.replace("Snap Document to Verify", "{t('scan_btn')}")
map_content = map_content.replace("'Initializing AI Scanner...'", "t('scan_init')")
map_content = map_content.replace("`Scanning Document... ${Math.round(m.progress * 100)}%`", "`${t('scan_progress')} ${Math.round(m.progress * 100)}%`")
map_content = map_content.replace("✅ Verified", "✅ {t('scan_verified')}")
map_content = map_content.replace("❌ Unrecognized", "❌ {t('scan_rejected')}")

map_content = map_content.replace('<option value="">All Assemblies</option>', '<option value="">{t("filter_all_assemblies")}</option>')
map_content = map_content.replace('<option value="">All Part Nos</option>', '<option value="">{t("filter_all_parts")}</option>')
map_content = map_content.replace("🔍 Don't know your Part No.? Find it using your EPIC No.", "🔍 {t('btn_eci_search')}")
map_content = map_content.replace('placeholder="🪪 Find by Part No."', 'placeholder={t("search_part")}')
map_content = map_content.replace('placeholder={getPlaceholder()}', 'placeholder={t("search_loc")}')
map_content = map_content.replace("💬 Share via WhatsApp", "💬 {t('btn_share')}")

# Update bhashini source language
map_content = map_content.replace('sourceLanguage: "pa" // Punjabi', 'sourceLanguage: currentLang')

with open('src/components/MapSidebar.jsx', 'w', encoding='utf-8') as f:
    f.write(map_content)

print("MapSidebar updated!")
