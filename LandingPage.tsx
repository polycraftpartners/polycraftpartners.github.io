export type DimensionKey =
  | 'opportunity'
  | 'consistency'
  | 'independence'
  | 'visibility'
  | 'readiness'

export interface DiagnosticOption {
  label: string
  value: 1 | 2 | 3 | 4
}

export interface DiagnosticQuestion {
  id: string // d1 ... d15
  dimension: DimensionKey
  text: string
  options: DiagnosticOption[]
}

export interface ProfileOption {
  label: string
  value: string
}

export interface ProfileQuestion {
  id: 'industry' | 'company_size' | 'growth_objective' | 'founder_involvement'
  text: string
  options: ProfileOption[]
}

export type Classification =
  | 'Critical'
  | 'Developing'
  | 'Functional'
  | 'Strong'
  | 'Exceptional'

export type ProspectTag = 'Hot' | 'Warm' | 'Watch'

export interface DimensionScores {
  opportunity: number
  consistency: number
  independence: number
  visibility: number
  readiness: number
}

export interface ScoreResult {
  dimensionScores: DimensionScores
  totalScore: number // out of 60
  growthScore: number // out of 100
  classification: Classification
  criticalFlag: boolean
  flaggedDimension: DimensionKey | null
  prospectTag: ProspectTag
}

export interface AssessmentAnswers {
  industry: string
  company_size: string
  growth_objective: string
  founder_involvement: string
  diagnostic: Record<string, 1 | 2 | 3 | 4> // keyed by d1..d15
  open_response: string
}

export interface ContactDetails {
  name: string
  company: string
  email: string
  country: string
  consent_data: boolean
  consent_email: boolean
}

export interface SubmissionPayload extends ContactDetails {
  industry: string
  company_size: string
  growth_objective: string
  founder_involvement: string
  d1: number
  d2: number
  d3: number
  d4: number
  d5: number
  d6: number
  d7: number
  d8: number
  d9: number
  d10: number
  d11: number
  d12: number
  d13: number
  d14: number
  d15: number
  open_response: string
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
