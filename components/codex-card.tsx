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
  token: number
  peakToken: number
  currentStreak: number
  longestStreak: number
}

function CodexLogo() {
  return (
    <div className="flex items-center gap-2 text-[#5f5b57]">
      <span className="flex size-9 items-center justify-center rounded-[40%] bg-[#ecebe8] text-[#6b6660]">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M4 7l5 5-5 5"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M12 17h8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      </span>
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
              src="/avatar.png"
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
