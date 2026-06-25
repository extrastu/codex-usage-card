export type Locale = "en" | "zh" | "ja"

export const LOCALES: { code: Locale; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "zh", label: "中文" },
  { code: "ja", label: "日本語" },
]

export function detectLocale(): Locale {
  if (typeof navigator === "undefined") return "en"
  const langs = navigator.languages?.length
    ? navigator.languages
    : [navigator.language]
  for (const l of langs) {
    const lower = l.toLowerCase()
    if (lower.startsWith("zh")) return "zh"
    if (lower.startsWith("ja")) return "ja"
    if (lower.startsWith("en")) return "en"
  }
  return "en"
}

type Dict = {
  pageTitle: string
  customize: string
  avatar: string
  avatarPreviewAlt: string
  upload: string
  remove: string
  username: string
  totalTokenField: string
  peakTokenField: string
  currentStreakField: string
  longestStreakField: string
  randomStreak: string
  random: string
  save: string
  copy: string
  copied: string
  // card labels
  cardTotalToken: string
  cardPeakDay: string
  cardCurrentStreak: string
  cardLongestStreak: string
  shareText: (tokens: string) => string
  footerNote: string
  viewSource: string
  followOnX: string
}

export const DICT: Record<Locale, Dict> = {
  en: {
    pageTitle: "Share your activity",
    customize: "Customize card",
    avatar: "Avatar",
    avatarPreviewAlt: "Avatar preview",
    upload: "Upload",
    remove: "Remove",
    username: "Username",
    totalTokenField: "Total Tokens",
    peakTokenField: "Peak Day Tokens",
    currentStreakField: "Current streak",
    longestStreakField: "Longest streak",
    randomStreak: "Random streak",
    random: "Randomize",
    save: "Save",
    copy: "Copy",
    copied: "Copied",
    cardTotalToken: "Total Tokens",
    cardPeakDay: "Peak Day",
    cardCurrentStreak: "Current Streak",
    cardLongestStreak: "Longest Streak",
    shareText: (t) => `I've used ${t} tokens on Codex!`,
    footerNote: "An unofficial fan-made project, not affiliated with OpenAI.",
    viewSource: "Source",
    followOnX: "Follow on X",
  },
  zh: {
    pageTitle: "分享你的活动",
    customize: "自定义卡片",
    avatar: "头像",
    avatarPreviewAlt: "头像预览",
    upload: "上传图片",
    remove: "移除",
    username: "用户名",
    totalTokenField: "累计 Token",
    peakTokenField: "峰值日 Token",
    currentStreakField: "当前连续天数",
    longestStreakField: "最长连续天数",
    randomStreak: "随机连续天数",
    random: "随机",
    save: "保存",
    copy: "复制",
    copied: "已复制",
    cardTotalToken: "累计 Token",
    cardPeakDay: "峰值日",
    cardCurrentStreak: "当前连续天数",
    cardLongestStreak: "最长连续使用...",
    shareText: (t) => `我在 Codex 累计使用了 ${t} tokens！`,
    footerNote: "非官方，粉丝作品，与 OpenAI 无关。",
    viewSource: "源码",
    followOnX: "在 X 上关注",
  },
  ja: {
    pageTitle: "アクティビティを共有",
    customize: "カードをカスタマイズ",
    avatar: "アバター",
    avatarPreviewAlt: "アバタープレビュー",
    upload: "アップロード",
    remove: "削除",
    username: "ユーザー名",
    totalTokenField: "累計トークン",
    peakTokenField: "ピーク日トークン",
    currentStreakField: "現在の連続日数",
    longestStreakField: "最長連続日数",
    randomStreak: "連続日数をランダム",
    random: "ランダム",
    save: "保存",
    copy: "コピー",
    copied: "コピー済み",
    cardTotalToken: "累計トークン",
    cardPeakDay: "ピーク日",
    cardCurrentStreak: "現在の連続日数",
    cardLongestStreak: "最長連続日数",
    shareText: (t) => `Codex で ${t} トークン使いました！`,
    footerNote: "非公式のファン制作プロジェクトであり、OpenAI とは無関係です。",
    viewSource: "ソース",
    followOnX: "X でフォロー",
  },
}

// Locale-aware compact number formatting.
export function formatNumber(n: number, locale: Locale): string {
  if (!isFinite(n) || n <= 0) return "0"
  const trim = (v: number) => {
    const r = Math.round(v * 10) / 10
    return Number.isInteger(r) ? String(r) : r.toFixed(1)
  }
  if (locale === "en") {
    if (n >= 1e9) return `${trim(n / 1e9)}B`
    if (n >= 1e6) return `${trim(n / 1e6)}M`
    if (n >= 1e3) return `${trim(n / 1e3)}K`
    return String(Math.round(n))
  }
  // zh / ja share the 万/亿(億) system
  const yi = locale === "ja" ? "億" : "亿"
  const wan = "万"
  if (n >= 1e8) return `${trim(n / 1e8)}${yi}`
  if (n >= 1e4) return `${trim(n / 1e4)}${wan}`
  return String(Math.round(n))
}

// Locale-aware day count formatting.
export function formatDays(n: number, locale: Locale): string {
  if (locale === "en") return `${n} ${n === 1 ? "day" : "days"}`
  if (locale === "ja") return `${n} 日`
  return `${n} 天`
}
