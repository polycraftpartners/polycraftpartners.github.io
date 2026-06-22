interface ProgressBarProps {
  current: number
  total: number
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percent = Math.min(100, Math.round((current / total) * 100))

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-textMuted font-medium tracking-wide uppercase">
          Question {current} of {total}
        </span>
        <span className="text-xs text-gold font-medium">{percent}%</span>
      </div>
      <div className="w-full h-1.5 bg-surfaceAlt rounded-full overflow-hidden">
        <div
          className="h-full bg-gold rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
