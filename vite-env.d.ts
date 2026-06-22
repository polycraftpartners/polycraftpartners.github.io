import { useEffect, useState } from 'react'
import { getParticipationCount } from '../lib/submission'

const TARGET_PARTICIPANTS = 50

export default function ParticipationCounter() {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    let mounted = true
    getParticipationCount().then((c) => {
      if (mounted) setCount(c)
    })
    return () => {
      mounted = false
    }
  }, [])

  if (count === null) return null

  const remaining = Math.max(0, TARGET_PARTICIPANTS - count)

  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surfaceAlt border border-border text-sm text-textSecondary">
      <span className="w-2 h-2 rounded-full bg-gold" />
      {count === 0 ? (
        <span>Be among the first founders to participate.</span>
      ) : (
        <span>
          <span className="text-textPrimary font-medium">{count}</span> founders have already
          taken the assessment
          {remaining > 0 && (
            <>
              {' '}- <span className="text-textPrimary font-medium">{remaining}</span> more to
              publish the benchmark
            </>
          )}
        </span>
      )}
    </div>
  )
}
