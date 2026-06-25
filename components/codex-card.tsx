"use client"

import { forwardRef, useMemo } from "react"
import { GRID_COLS, HEATMAP_COLORS, generateHeatmap } from "@/lib/codex"
import { DICT, type Locale, formatDays, formatNumber } from "@/lib/i18n"

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
    <div className="flex shrink-0 items-center gap-1.5 text-[#5f5b57] sm:gap-2">
      <img
        src="/codex-logo.png"
        alt="Codex"
        crossOrigin="anonymous"
        className="size-7 object-contain sm:size-10"
      />
      <span className="text-lg font-semibold tracking-tight sm:text-2xl">Codex</span>
    </div>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center px-0.5 text-center sm:px-1">
      <span className="text-lg font-semibold text-[#2a2722] sm:text-2xl md:text-[28px]">{value}</span>
      <span className="mt-1 w-full truncate text-[11px] text-[#9a948c] sm:text-sm">{label}</span>
    </div>
  )
}

export const CodexCard = forwardRef<
  HTMLDivElement,
  { data: CardData; locale: Locale }
>(function CodexCard({ data, locale }, ref) {
  const t = DICT[locale]
  const cells = useMemo(
    () => generateHeatmap(data.username || "user", data.token),
    [data.username, data.token],
  )

    return (
      <div
        ref={ref}
        className="w-full rounded-[24px] bg-[#f9f9f7] p-5 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.18)] sm:rounded-[28px] sm:p-7 md:p-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3 sm:gap-3.5">
            <img
              src={data.avatar || "/avatar.png"}
              alt={`${data.username} ${t.avatar}`}
              crossOrigin="anonymous"
              className="size-11 shrink-0 rounded-full object-cover sm:size-14"
            />
            <div className="min-w-0 leading-tight">
              <div className="truncate text-lg font-bold text-[#1f1c18] sm:text-2xl">
                {data.username || "user"}
              </div>
              <div className="truncate text-sm text-[#a39d95] sm:text-base">
                @{data.username || "user"}
              </div>
            </div>
          </div>
          <CodexLogo />
        </div>

        {/* Heatmap */}
        <div
          className="mt-5 grid gap-1 sm:mt-6 sm:gap-[6px]"
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
        <div className="mt-5 flex items-stretch sm:mt-7">
          <Stat value={formatNumber(data.token, locale)} label={t.cardTotalToken} />
          <div className="w-px self-stretch bg-[#ededea]" />
          <Stat value={formatNumber(data.peakToken, locale)} label={t.cardPeakDay} />
          <div className="w-px self-stretch bg-[#ededea]" />
          <Stat value={formatDays(data.currentStreak, locale)} label={t.cardCurrentStreak} />
          <div className="w-px self-stretch bg-[#ededea]" />
          <Stat value={formatDays(data.longestStreak, locale)} label={t.cardLongestStreak} />
        </div>
      </div>
    )
  },
)
