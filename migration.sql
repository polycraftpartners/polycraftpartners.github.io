import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { DIMENSION_LABELS } from '../lib/questions'
import { CLASSIFICATION_SERVICE_MAP } from '../lib/scoring'
import type { Classification, ProspectTag } from '../lib/types'

interface AssessmentRow {
  id: string
  created_at: string
  name: string
  company: string
  email: string
  country: string
  industry: string
  company_size: string
  growth_objective: string
  founder_involvement: string
  open_response: string | null
  response_tags: string[] | null
  source: string
  score_opportunity: number
  score_consistency: number
  score_independence: number
  score_visibility: number
  score_readiness: number
  total_score: number
  growth_score: number
  classification: Classification
  critical_flag: boolean
  flagged_dimension: string | null
  prospect_tag: ProspectTag
}

const RESPONSE_TAG_OPTIONS = [
  'Founder dependency',
  'Pipeline visibility',
  'Sales process',
  'Lead generation',
  'Team capability',
  'Market expansion',
  'Forecasting',
  'Customer retention',
  'Pricing and positioning',
  'Other'
]

const PROSPECT_TAG_COLORS: Record<ProspectTag, string> = {
  Hot: 'bg-gold/20 text-gold border-gold/40',
  Warm: 'bg-blue/20 text-blue border-blue/40',
  Watch: 'bg-textMuted/20 text-textMuted border-textMuted/40'
}

/**
 * Simple password gate. This is NOT a substitute for proper auth.
 *
 * The anon key used here has SELECT access on founder_assessments
 * (granted deliberately in the v1 migration for simplicity). The only
 * thing protecting participant data is this password and the secrecy
 * of the /admin URL. Do not share this URL or password with anyone you
 * don't want reading full submission data, including emails and open
 * responses. See README for how to upgrade to a hardened approach
 * (service role key behind a server route, or Supabase Auth) later.
 */
function useAdminGate() {
  const [unlocked, setUnlocked] = useState(false)
  const [input, setInput] = useState('')

  function attempt() {
    const expected = import.meta.env.VITE_ADMIN_PASSWORD as string | undefined
    if (expected && input === expected) {
      setUnlocked(true)
      sessionStorage.setItem('fgb_admin_unlocked', 'true')
    }
  }

  useEffect(() => {
    if (sessionStorage.getItem('fgb_admin_unlocked') === 'true') {
      setUnlocked(true)
    }
  }, [])

  return { unlocked, input, setInput, attempt }
}

export default function AdminPage() {
  const { unlocked, input, setInput, attempt } = useAdminGate()
  const [rows, setRows] = useState<AssessmentRow[]>([])
  const [loading, setLoading] = useState(true)
  const [filterTag, setFilterTag] = useState<ProspectTag | 'All'>('All')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!unlocked) return

    async function fetchRows() {
      setLoading(true)
      const { data, error } = await supabase
        .from('founder_assessments')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        setError(error.message)
      } else {
        setRows(data as AssessmentRow[])
      }
      setLoading(false)
    }

    fetchRows()
  }, [unlocked])

  const filteredRows = useMemo(() => {
    if (filterTag === 'All') return rows
    return rows.filter((r) => r.prospect_tag === filterTag)
  }, [rows, filterTag])

  const counts = useMemo(() => {
    return {
      total: rows.length,
      hot: rows.filter((r) => r.prospect_tag === 'Hot').length,
      warm: rows.filter((r) => r.prospect_tag === 'Warm').length,
      watch: rows.filter((r) => r.prospect_tag === 'Watch').length
    }
  }, [rows])

  async function updateResponseTags(rowId: string, tags: string[]) {
    setRows((prev) =>
      prev.map((r) => (r.id === rowId ? { ...r, response_tags: tags } : r))
    )
    await supabase.from('founder_assessments').update({ response_tags: tags }).eq('id', rowId)
  }

  function exportCsv() {
    const headers = [
      'created_at',
      'name',
      'company',
      'email',
      'country',
      'industry',
      'company_size',
      'growth_objective',
      'founder_involvement',
      'source',
      'score_opportunity',
      'score_consistency',
      'score_independence',
      'score_visibility',
      'score_readiness',
      'total_score',
      'growth_score',
      'classification',
      'critical_flag',
      'flagged_dimension',
      'prospect_tag',
      'response_tags',
      'open_response'
    ]

    const lines = [headers.join(',')]

    for (const row of rows) {
      const values = headers.map((h) => {
        const value = (row as unknown as Record<string, unknown>)[h]
        const stringValue = Array.isArray(value) ? value.join('; ') : String(value ?? '')
        return `"${stringValue.replace(/"/g, '""')}"`
      })
      lines.push(values.join(','))
    }

    const csv = lines.join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `founder-growth-benchmark-export-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!unlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-sm w-full">
          <h1 className="font-display text-2xl font-bold text-textPrimary mb-6">Admin access</h1>
          <input
            type="password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && attempt()}
            placeholder="Password"
            className="w-full px-5 py-3 rounded-lg border border-border bg-surface text-textPrimary placeholder:text-textMuted focus:outline-none focus:border-gold transition-colors mb-4"
          />
          <button
            type="button"
            onClick={attempt}
            className="w-full px-5 py-3 bg-gold text-bg font-display font-bold rounded-lg hover:bg-goldDark transition-colors"
          >
            Enter
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-6 py-8 md:px-12">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h1 className="font-display text-2xl font-bold text-textPrimary">
          Founder Growth Benchmark - Admin
        </h1>
        <button
          type="button"
          onClick={exportCsv}
          className="px-4 py-2 rounded-lg border border-border bg-surface text-textSecondary hover:border-gold hover:text-textPrimary transition-colors text-sm font-medium"
        >
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total submissions', value: counts.total, tag: 'All' as const },
          { label: 'Hot prospects', value: counts.hot, tag: 'Hot' as const },
          { label: 'Warm prospects', value: counts.warm, tag: 'Warm' as const },
          { label: 'Watch', value: counts.watch, tag: 'Watch' as const }
        ].map((stat) => (
          <button
            key={stat.label}
            type="button"
            onClick={() => setFilterTag(stat.tag)}
            className={`text-left p-4 rounded-lg border transition-colors ${
              filterTag === stat.tag ? 'border-gold bg-surfaceAlt' : 'border-border bg-surface'
            }`}
          >
            <div className="text-2xl font-display font-bold text-textPrimary">{stat.value}</div>
            <div className="text-xs text-textMuted mt-1">{stat.label}</div>
          </button>
        ))}
      </div>

      {loading && <p className="text-textMuted">Loading submissions...</p>}
      {error && <p className="text-critical">{error}</p>}

      {!loading && !error && (
        <div className="space-y-4">
          {filteredRows.map((row) => (
            <div key={row.id} className="border border-border bg-surface rounded-lg p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-bold text-textPrimary">{row.name}</h3>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full border ${PROSPECT_TAG_COLORS[row.prospect_tag]}`}
                    >
                      {row.prospect_tag}
                    </span>
                    {row.critical_flag && (
                      <span className="text-xs px-2 py-0.5 rounded-full border border-critical/40 bg-critical/20 text-critical">
                        Critical: {DIMENSION_LABELS[row.flagged_dimension ?? '']}
                      </span>
                    )}
                  </div>
                  <p className="text-textMuted text-sm">
                    {row.company} | {row.email} | {row.country}
                  </p>
                  <p className="text-textMuted text-xs mt-1">
                    {row.industry} | {row.company_size} employees | {row.growth_objective} |
                    source: {row.source}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-display text-2xl font-bold text-gold">
                    {row.growth_score}
                  </div>
                  <div className="text-xs text-textMuted">{row.classification}</div>
                </div>
              </div>

              <div className="grid grid-cols-5 gap-2 mb-4">
                {[
                  ['Opportunity', row.score_opportunity],
                  ['Consistency', row.score_consistency],
                  ['Independence', row.score_independence],
                  ['Visibility', row.score_visibility],
                  ['Readiness', row.score_readiness]
                ].map(([label, value]) => (
                  <div key={label as string} className="text-center bg-bg rounded-md py-2">
                    <div className="text-textPrimary font-bold">{value}/12</div>
                    <div className="text-textMuted text-[10px] mt-0.5">{label}</div>
                  </div>
                ))}
              </div>

              <p className="text-xs text-textMuted mb-2">
                Suggested entry point: {CLASSIFICATION_SERVICE_MAP[row.classification]}
              </p>

              {row.open_response && (
                <div className="bg-bg rounded-md p-3 mb-3">
                  <p className="text-textSecondary text-sm italic">"{row.open_response}"</p>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {RESPONSE_TAG_OPTIONS.map((tag) => {
                  const isActive = (row.response_tags ?? []).includes(tag)
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        const current = row.response_tags ?? []
                        const next = isActive
                          ? current.filter((t) => t !== tag)
                          : [...current, tag]
                        updateResponseTags(row.id, next)
                      }}
                      className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                        isActive
                          ? 'border-gold bg-gold/10 text-gold'
                          : 'border-border text-textMuted hover:text-textSecondary'
                      }`}
                    >
                      {tag}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
