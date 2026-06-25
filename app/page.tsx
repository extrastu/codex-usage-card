"use client"

import { useRef, useState } from "react"
import { toBlob } from "html-to-image"
import { CodexCard, type CardData } from "@/components/codex-card"
import { randomStreak } from "@/lib/codex"

function parseNum(v: string): number {
  const n = Number(v.replace(/[^0-9.]/g, ""))
  return isFinite(n) ? n : 0
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-[#6b6660]">{label}</span>
      {children}
    </label>
  )
}

const inputCls =
  "h-11 rounded-xl border border-[#e5e2de] bg-white px-3 text-base text-[#2a2722] outline-none transition focus:border-[#c06a3e] focus:ring-2 focus:ring-[#c06a3e]/20"

export default function Page() {
  const [data, setData] = useState<CardData>({
    username: "extrastu",
    avatar: "",
    token: 1_300_000_000,
    peakToken: 110_000_000,
    currentStreak: 0,
    longestStreak: 12,
  })
  const [saving, setSaving] = useState(false)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const update = (patch: Partial<CardData>) =>
    setData((d) => ({ ...d, ...patch }))

  function handleTilt(e: React.MouseEvent<HTMLDivElement>) {
    if (
      typeof window !== "undefined" &&
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches
    ) {
      return
    }
    const rect = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    const max = 10
    setTilt({ x: -py * max, y: px * max })
  }

  function randomizeAll() {
    const token = Math.floor(50_000_000 + Math.random() * 4_950_000_000)
    const peakToken = Math.floor(
      token * (0.04 + Math.random() * 0.12),
    )
    const longestStreak = randomStreak()
    const currentStreak = Math.floor(Math.random() * (longestStreak + 1))
    update({
      token,
      peakToken,
      currentStreak,
      longestStreak,
    })
  }

  function handleAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => update({ avatar: String(reader.result) })
    reader.readAsDataURL(file)
  }

  async function renderBlob(): Promise<Blob | null> {
    if (!cardRef.current) return null
    return toBlob(cardRef.current, {
      pixelRatio: 2,
      cacheBust: true,
    })
  }

  async function handleSave() {
    setSaving(true)
    try {
      const blob = await renderBlob()
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${data.username || "codex"}-activity.png`
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setSaving(false)
    }
  }

  function shareTo(network: "x" | "linkedin" | "reddit") {
    const text = encodeURIComponent(
      `我在 Codex 累计使用了 ${data.token.toLocaleString()} tokens！`,
    )
    const url = encodeURIComponent(
      typeof window !== "undefined" ? window.location.href : "",
    )
    const links: Record<string, string> = {
      x: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      reddit: `https://www.reddit.com/submit?url=${url}&title=${text}`,
    }
    window.open(links[network], "_blank", "noopener,noreferrer")
  }

  return (
    <main className="min-h-screen bg-[#f2f1ef] px-4 py-8 md:py-14">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-center text-2xl font-semibold text-[#2a2722] sm:text-3xl md:text-4xl">
          分享你的活动
        </h1>

        <div className="mt-7 grid gap-6 sm:mt-10 sm:gap-8 lg:grid-cols-[1fr_360px]">
          {/* Card + share */}
          <div className="flex flex-col items-center">
            <div
              className="w-full max-w-[640px]"
              style={{ perspective: "1000px" }}
              onMouseMove={handleTilt}
              onMouseLeave={() => setTilt({ x: 0, y: 0 })}
            >
              <div
                className="transition-transform duration-200 ease-out will-change-transform"
                style={{
                  transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                  transformStyle: "preserve-3d",
                }}
              >
                <CodexCard ref={cardRef} data={data} />
              </div>
            </div>

            <div className="mt-6 flex items-start justify-center gap-5 sm:mt-8 sm:gap-6">
              <ShareButton label="X" onClick={() => shareTo("x")}>
                <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
                </svg>
              </ShareButton>
              <ShareButton label="LinkedIn" onClick={() => shareTo("linkedin")}>
                <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
                  <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
                </svg>
              </ShareButton>
              <ShareButton label="Reddit" onClick={() => shareTo("reddit")}>
                <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
                  <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0Zm6.07 13.32c.03.21.04.43.04.65 0 3.32-3.86 6.01-8.62 6.01s-8.62-2.69-8.62-6.01c0-.22.01-.44.04-.66a1.93 1.93 0 1 1 2.4-2.9 9.4 9.4 0 0 1 4.84-1.53l.92-4.33a.4.4 0 0 1 .48-.31l3.05.65a1.35 1.35 0 1 1-.16.78l-2.73-.58-.82 3.86a9.4 9.4 0 0 1 4.78 1.53 1.93 1.93 0 1 1 2.4 2.9ZM8.1 12.9a1.35 1.35 0 1 0 2.7 0 1.35 1.35 0 0 0-2.7 0Zm6.06 3.6c-.74.74-2.27.8-2.72.8s-1.98-.06-2.72-.8a.3.3 0 0 0-.42.42c.93.93 2.71 1 3.14 1s2.21-.07 3.14-1a.3.3 0 0 0-.42-.42Zm-.7-2.25a1.35 1.35 0 1 0 0-2.7 1.35 1.35 0 0 0 0 2.7Z" />
                </svg>
              </ShareButton>
              <ShareButton label="保存" onClick={handleSave} disabled={saving}>
                <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </ShareButton>
            </div>
          </div>

          {/* Controls */}
          <div className="rounded-2xl border border-[#e8e5e1] bg-white p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-[#2a2722]">自定义卡片</h2>
            <div className="mt-5 flex flex-col gap-4">
              <Field label="头像">
                <div className="flex items-center gap-3">
                  <img
                    src={data.avatar || "/avatar.png"}
                    alt="头像预览"
                    className="size-12 rounded-full object-cover"
                  />
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatar}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="h-11 touch-manipulation rounded-xl border border-[#e5e2de] bg-white px-4 text-sm font-medium text-[#6b6660] transition hover:bg-[#f7f6f4] active:scale-[0.99]"
                  >
                    上传图片
                  </button>
                  {data.avatar ? (
                    <button
                      type="button"
                      onClick={() => update({ avatar: "" })}
                      className="text-sm text-[#a39d95] transition hover:text-[#6b6660]"
                    >
                      移除
                    </button>
                  ) : null}
                </div>
              </Field>
              <Field label="用户名">
                <input
                  className={inputCls}
                  value={data.username}
                  onChange={(e) => update({ username: e.target.value })}
                  placeholder="extrastu"
                />
              </Field>
              <Field label="累计 Token">
                <input
                  className={inputCls}
                  value={data.token}
                  onChange={(e) => update({ token: parseNum(e.target.value) })}
                  inputMode="numeric"
                />
              </Field>
              <Field label="峰值日 Token">
                <input
                  className={inputCls}
                  value={data.peakToken}
                  onChange={(e) => update({ peakToken: parseNum(e.target.value) })}
                  inputMode="numeric"
                />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="当前连续天数">
                  <input
                    className={inputCls}
                    value={data.currentStreak}
                    onChange={(e) =>
                      update({ currentStreak: Math.round(parseNum(e.target.value)) })
                    }
                    inputMode="numeric"
                  />
                </Field>
                <Field label="最长连续天数">
                  <input
                    className={inputCls}
                    value={data.longestStreak}
                    onChange={(e) =>
                      update({ longestStreak: Math.round(parseNum(e.target.value)) })
                    }
                    inputMode="numeric"
                  />
                </Field>
              </div>

              <button
                type="button"
                onClick={() =>
                  update({
                    currentStreak: randomStreak(),
                    longestStreak: randomStreak(),
                  })
                }
                className="mt-1 h-11 touch-manipulation rounded-xl bg-[#c06a3e] text-sm font-medium text-white transition hover:bg-[#a85a32] active:scale-[0.99]"
              >
                随机连续天数
              </button>

              <button
                type="button"
                onClick={randomizeAll}
                className="h-11 touch-manipulation rounded-xl border border-[#c06a3e] text-sm font-medium text-[#c06a3e] transition hover:bg-[#c06a3e]/10 active:scale-[0.99]"
              >
                随机
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

function ShareButton({
  label,
  children,
  onClick,
  disabled,
}: {
  label: string
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-label={label}
        className="flex size-12 touch-manipulation items-center justify-center rounded-full bg-[#2a2722] text-white transition hover:bg-[#3d3935] active:scale-95 disabled:opacity-50 sm:size-14"
      >
        {children}
      </button>
      <span className="text-sm text-[#8b857d]">{label}</span>
    </div>
  )
}
