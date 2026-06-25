"use client"

import { forwardRef, useMemo } from "react"
import {
  GRID_COLS,
  HEATMAP_COLORS,
  formatCn,
  generateHeatmap,
} from "@/lib/codex"

export type CardData = {
  username: string
  avatar: string
  token: number
  peakToken: number
  currentStreak: number
  longestStreak: number
}

function CodexLogo() {
  return (
    <div className="flex items-center gap-2 text-[#5f5b57]">
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <title>Codex (OpenAI)</title>
        <path
          d="M8.086.457a6.105 6.105 0 013.046-.415c1.333.153 2.521.72 3.564 1.7a.117.117 0 00.107.029c1.408-.346 2.762-.224 4.061.366l.063.03.154.076c1.357.703 2.33 1.77 2.918 3.198.278.679.418 1.388.421 2.126a5.655 5.655 0 01-.18 1.631.167.167 0 00.04.155 5.982 5.982 0 011.578 2.891c.385 1.901-.01 3.615-1.183 5.14l-.182.22a6.063 6.063 0 01-2.934 1.851.162.162 0 00-.108.102c-.255.736-.511 1.364-.987 1.992-1.199 1.582-2.962 2.462-4.948 2.451-1.583-.008-2.986-.587-4.21-1.736a.145.145 0 00-.14-.032c-.518.167-1.04.191-1.604.185a5.924 5.924 0 01-2.595-.622 6.058 6.058 0 01-2.146-1.781c-.203-.269-.404-.522-.551-.821a7.74 7.74 0 01-.495-1.283 6.11 6.11 0 01-.017-3.064.166.166 0 00.008-.074.115.115 0 00-.037-.064 5.958 5.958 0 01-1.38-2.202 5.196 5.196 0 01-.333-1.589 6.915 6.915 0 01.188-2.132c.45-1.484 1.309-2.648 2.577-3.493.282-.188.55-.334.802-.438.286-.12.573-.22.861-.304a.129.129 0 00.087-.087A6.016 6.016 0 015.635 2.31C6.315 1.464 7.132.846 8.086.457z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <path
          d="M7.6 9.2 11 12l-3.4 2.8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12.8 15h4.2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
      <span className="text-2xl font-semibold tracking-tight">Codex</span>
    </div>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center px-1 text-center">
      <span className="text-2xl font-semibold text-[#2a2722] md:text-[28px]">{value}</span>
      <span className="mt-1 w-full truncate text-sm text-[#9a948c]">{label}</span>
    </div>
  )
}

export const CodexCard = forwardRef<HTMLDivElement, { data: CardData }>(
  function CodexCard({ data }, ref) {
    const cells = useMemo(
      () => generateHeatmap(data.username || "user", data.token),
      [data.username, data.token],
    )

    return (
      <div
        ref={ref}
        className="w-full rounded-[28px] bg-white p-7 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.18)] md:p-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <img
              src={data.avatar || "/avatar.png"}
              alt={`${data.username} 头像`}
              crossOrigin="anonymous"
              className="size-14 rounded-full object-cover"
            />
            <div className="leading-tight">
              <div className="text-2xl font-bold text-[#1f1c18]">
                {data.username || "user"}
              </div>
              <div className="text-base text-[#a39d95]">
                @{data.username || "user"}
              </div>
            </div>
          </div>
          <CodexLogo />
        </div>

        {/* Heatmap */}
        <div
          className="mt-6 grid gap-[6px]"
          style={{ gridTemplateColumns: `repeat(${GRID_COLS}, minmax(0, 1fr))` }}
        >
          {cells.map((level, i) => (
            <div
              key={i}
              className="aspect-square w-full rounded-[5px]"
              style={{ backgroundColor: HEATMAP_COLORS[level] }}
            />
          ))}
        </div>

        {/* Stats */}
        <div className="mt-7 flex items-stretch">
          <Stat value={formatCn(data.token)} label="累计 Token" />
          <div className="w-px self-stretch bg-[#ededea]" />
          <Stat value={formatCn(data.peakToken)} label="峰值日" />
          <div className="w-px self-stretch bg-[#ededea]" />
          <Stat value={`${data.currentStreak} 天`} label="当前连续天数" />
          <div className="w-px self-stretch bg-[#ededea]" />
          <Stat value={`${data.longestStreak} 天`} label="最长连续使用..." />
        </div>
      </div>
    )
  },
)
