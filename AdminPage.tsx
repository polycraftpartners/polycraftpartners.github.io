import { supabase } from './supabaseClient'
import { scoreAssessment } from './scoring'
import type { AssessmentAnswers, ContactDetails, SubmissionPayload, ScoreResult } from './types'

/**
 * Reads the UTM source parameter from the current URL.
 * Falls back to "direct" if none is present.
 */
export function getSourceFromUrl(): string {
  if (typeof window === 'undefined') return 'direct'
  const params = new URLSearchParams(window.location.search)
  const source = params.get('source')
  return source && source.trim().length > 0 ? source.trim().toLowerCase() : 'direct'
}

function buildPayload(
  answers: AssessmentAnswers,
  contact: ContactDetails,
  score: ScoreResult,
  source: string
): SubmissionPayload {
  return {
    ...contact,
    industry: answers.industry,
    company_size: answers.company_size,
    growth_objective: answers.growth_objective,
    founder_involvement: answers.founder_involvement,
    d1: answers.diagnostic.d1,
    d2: answers.diagnostic.d2,
    d3: answers.diagnostic.d3,
    d4: answers.diagnostic.d4,
    d5: answers.diagnostic.d5,
    d6: answers.diagnostic.d6,
    d7: answers.diagnostic.d7,
    d8: answers.diagnostic.d8,
    d9: answers.diagnostic.d9,
    d10: answers.diagnostic.d10,
    d11: answers.diagnostic.d11,
    d12: answers.diagnostic.d12,
    d13: answers.diagnostic.d13,
    d14: answers.diagnostic.d14,
    d15: answers.diagnostic.d15,
    open_response: answers.open_response,
    source,
    score_opportunity: score.dimensionScores.opportunity,
    score_consistency: score.dimensionScores.consistency,
    score_independence: score.dimensionScores.independence,
    score_visibility: score.dimensionScores.visibility,
    score_readiness: score.dimensionScores.readiness,
    total_score: score.totalScore,
    growth_score: score.growthScore,
    classification: score.classification,
    critical_flag: score.criticalFlag,
    flagged_dimension: score.flaggedDimension,
    prospect_tag: score.prospectTag
  }
}

export interface SubmitResult {
  success: boolean
  score: ScoreResult
  error?: string
}

/**
 * Full submission pipeline:
 * 1. Score the assessment
 * 2. Insert into Supabase
 * 3. Fire confirmation + admin notification emails via serverless API routes
 *
 * Email failures do not block submission success - the data is already
 * saved at that point, which is the priority. Errors are logged.
 */
export async function submitAssessment(
  answers: AssessmentAnswers,
  contact: ContactDetails
): Promise<SubmitResult> {
  const score = scoreAssessment(answers)
  const source = getSourceFromUrl()
  const payload = buildPayload(answers, contact, score, source)

  const { error } = await supabase.from('founder_assessments').insert(payload)

  if (error) {
    return { success: false, score, error: error.message }
  }

  // Fire-and-forget email notifications. Do not block the UI on these.
  void sendEmails(payload)

  return { success: true, score }
}

async function sendEmails(payload: SubmissionPayload): Promise<void> {
  try {
    await fetch('/api/send-confirmation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Confirmation email failed to send', err)
  }

  try {
    await fetch('/api/notify-admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Admin notification email failed to send', err)
  }
}

/**
 * Fetches the live participation count via the RPC function defined
 * in the Supabase migration. Returns 0 on error rather than throwing,
 * since this powers a non-critical UI element.
 */
export async function getParticipationCount(): Promise<number> {
  const { data, error } = await supabase.rpc('get_participation_count')
  if (error || typeof data !== 'number') {
    return 0
  }
  return data
}
