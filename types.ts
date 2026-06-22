import type {
  AssessmentAnswers,
  Classification,
  DimensionKey,
  DimensionScores,
  ProspectTag,
  ScoreResult
} from './types'

/**
 * Dimension scores are each the sum of 3 questions, each scored 1-4.
 * Range per dimension: 3 to 12.
 */
function calculateDimensionScores(diagnostic: Record<string, 1 | 2 | 3 | 4>): DimensionScores {
  const d = diagnostic
  return {
    opportunity: d.d1 + d.d2 + d.d3,
    consistency: d.d4 + d.d5 + d.d6,
    independence: d.d7 + d.d8 + d.d9,
    visibility: d.d10 + d.d11 + d.d12,
    readiness: d.d13 + d.d14 + d.d15
  }
}

/**
 * Total score out of 60, converted to growth score out of 100.
 */
function calculateTotalAndGrowthScore(dimensionScores: DimensionScores): {
  totalScore: number
  growthScore: number
} {
  const totalScore =
    dimensionScores.opportunity +
    dimensionScores.consistency +
    dimensionScores.independence +
    dimensionScores.visibility +
    dimensionScores.readiness

  const growthScore = Math.round((totalScore / 60) * 100)

  return { totalScore, growthScore }
}

/**
 * Classification bands based on growth score out of 100.
 */
function classify(growthScore: number): Classification {
  if (growthScore <= 39) return 'Critical'
  if (growthScore <= 59) return 'Developing'
  if (growthScore <= 74) return 'Functional'
  if (growthScore <= 89) return 'Strong'
  return 'Exceptional'
}

/**
 * Floor logic: if any single dimension scores 4 or below out of 12
 * (average of 1 to 1.33 per question), raise a critical flag regardless
 * of total score. Records which dimension triggered it.
 */
function checkCriticalFlag(dimensionScores: DimensionScores): {
  criticalFlag: boolean
  flaggedDimension: DimensionKey | null
} {
  const FLOOR_THRESHOLD = 4
  const entries = Object.entries(dimensionScores) as [DimensionKey, number][]

  // If multiple dimensions are at or below the floor, flag the lowest one.
  const belowFloor = entries
    .filter(([, score]) => score <= FLOOR_THRESHOLD)
    .sort((a, b) => a[1] - b[1])

  if (belowFloor.length === 0) {
    return { criticalFlag: false, flaggedDimension: null }
  }

  return { criticalFlag: true, flaggedDimension: belowFloor[0][0] }
}

/**
 * Prospect tagging logic, agreed and locked:
 *
 * Hot:   total growth score < 60 AND growth objective is "Grow revenue" or
 *        "Expand into new markets" AND independence dimension score < 6 (out of 12)
 * Warm:  growth score < 75 AND growth objective is "Grow revenue", "Expand into
 *        new markets", or "Improve profitability"
 * Watch: growth score >= 75 OR growth objective is "Stabilise current operations"
 */
function calculateProspectTag(
  growthScore: number,
  independenceScore: number,
  growthObjective: string
): ProspectTag {
  const isStrongIntent =
    growthObjective === 'Grow revenue' || growthObjective === 'Expand into new markets'

  const isModerateIntent =
    isStrongIntent || growthObjective === 'Improve profitability'

  if (growthScore < 60 && isStrongIntent && independenceScore < 6) {
    return 'Hot'
  }

  if (growthScore < 75 && isModerateIntent) {
    return 'Warm'
  }

  return 'Watch'
}

/**
 * Full scoring pipeline. Call this once at submission time with the
 * complete set of answers. Output feeds directly into the Supabase
 * insert payload and the on-screen confirmation experience.
 */
export function scoreAssessment(answers: AssessmentAnswers): ScoreResult {
  const dimensionScores = calculateDimensionScores(answers.diagnostic)
  const { totalScore, growthScore } = calculateTotalAndGrowthScore(dimensionScores)
  const classification = classify(growthScore)
  const { criticalFlag, flaggedDimension } = checkCriticalFlag(dimensionScores)
  const prospectTag = calculateProspectTag(
    growthScore,
    dimensionScores.independence,
    answers.growth_objective
  )

  return {
    dimensionScores,
    totalScore,
    growthScore,
    classification,
    criticalFlag,
    flaggedDimension,
    prospectTag
  }
}

/**
 * Classification to PolyCraft service mapping. Internal use only,
 * surfaced in the admin view, never shown to participants.
 */
export const CLASSIFICATION_SERVICE_MAP: Record<Classification, string> = {
  Critical: 'Revenue Bottleneck Audit ($500) - immediate diagnostic needed',
  Developing: 'Revenue Bottleneck Audit leading to Pipeline Builder',
  Functional: 'Pipeline Builder ($1,500) or Commercial Advisory ($500/month)',
  Strong: 'Commercial Advisory or S3 retainer (EUR 7,500+/month)',
  Exceptional: 'Market entry services S1 or S2 if expansion is the objective'
}
