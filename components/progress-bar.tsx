"use client"

interface ProgressBarProps {
  progress: number
  label?: string
}

export default function ProgressBar({ progress, label }: ProgressBarProps) {
  return (
    <div className="space-y-3">
      {label && (
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-foreground">{label}</p>
          <span className="text-sm font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{progress}%</span>
        </div>
      )}
      <div className="w-full h-3 rounded-full bg-border overflow-hidden shadow-sm">
        <div
          className="h-full bg-gradient-to-r from-primary via-accent to-primary rounded-full transition-all duration-500 ease-out shadow-lg shadow-primary/40"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
