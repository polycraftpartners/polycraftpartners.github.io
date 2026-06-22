import type { DiagnosticQuestion, ProfileQuestion } from './types'

export const PROFILE_QUESTIONS: ProfileQuestion[] = [
  {
    id: 'industry',
    text: 'Which best describes your business?',
    options: [
      { label: 'B2B Services', value: 'B2B Services' },
      { label: 'Technology / SaaS', value: 'Technology / SaaS' },
      { label: 'Manufacturing', value: 'Manufacturing' },
      { label: 'Distribution / Wholesale', value: 'Distribution / Wholesale' },
      { label: 'Professional Services', value: 'Professional Services' },
      { label: 'Engineering / Technical Services', value: 'Engineering / Technical Services' },
      { label: 'Logistics / Transportation', value: 'Logistics / Transportation' },
      { label: 'Healthcare / Medical', value: 'Healthcare / Medical' },
      { label: 'Construction', value: 'Construction' },
      { label: 'Other', value: 'Other' }
    ]
  },
  {
    id: 'company_size',
    text: 'How many people work in your business?',
    options: [
      { label: '1 to 5', value: '1-5' },
      { label: '6 to 10', value: '6-10' },
      { label: '11 to 25', value: '11-25' },
      { label: '26 to 50', value: '26-50' },
      { label: '51 to 100', value: '51-100' },
      { label: '100+', value: '100+' }
    ]
  },
  {
    id: 'growth_objective',
    text: 'What best describes your current primary objective?',
    options: [
      { label: 'Stabilise current operations', value: 'Stabilise current operations' },
      { label: 'Grow revenue', value: 'Grow revenue' },
      { label: 'Improve profitability', value: 'Improve profitability' },
      { label: 'Build leadership and team capacity', value: 'Build leadership and team capacity' },
      { label: 'Expand into new markets', value: 'Expand into new markets' }
    ]
  },
  {
    id: 'founder_involvement',
    text: 'How involved are you personally in day-to-day revenue generation?',
    options: [
      { label: 'I personally drive most or all sales', value: 'I personally drive most or all sales' },
      { label: 'I am involved in most key opportunities', value: 'I am involved in most key opportunities' },
      { label: 'Sales is shared across me and the team', value: 'Sales is shared across me and the team' },
      { label: 'Sales operates largely without me', value: 'Sales operates largely without me' }
    ]
  }
]

export const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  // Dimension 1: Opportunity Generation
  {
    id: 'd1',
    dimension: 'opportunity',
    text: 'How would you describe the consistency of new opportunities entering your pipeline?',
    options: [
      { label: 'We rarely have enough opportunities coming in', value: 1 },
      { label: 'Opportunities come in but inconsistently', value: 2 },
      { label: 'We have a reasonable flow but quality varies', value: 3 },
      { label: 'We have a consistent flow of well-qualified opportunities', value: 4 }
    ]
  },
  {
    id: 'd2',
    dimension: 'opportunity',
    text: 'How clear is your team on who your ideal client is?',
    options: [
      { label: 'There is no defined ideal client profile', value: 1 },
      { label: 'We have a rough idea but it is not documented', value: 2 },
      { label: 'We have a profile but it is not consistently applied', value: 3 },
      { label: 'We have a clear documented profile that guides all outreach', value: 4 }
    ]
  },
  {
    id: 'd3',
    dimension: 'opportunity',
    text: 'How does most new business currently reach you?',
    options: [
      { label: 'Mostly by chance or word of mouth with no system behind it', value: 1 },
      { label: 'Referrals and network but no proactive outreach', value: 2 },
      { label: 'A mix of inbound and some structured outreach', value: 3 },
      { label: 'A defined outreach system that runs consistently', value: 4 }
    ]
  },

  // Dimension 2: Sales Consistency
  {
    id: 'd4',
    dimension: 'consistency',
    text: 'How would you describe your sales process?',
    options: [
      { label: 'There is no defined process, each deal is handled differently', value: 1 },
      { label: 'There is an informal process but it depends on the person', value: 2 },
      { label: 'There is a process but it is not consistently followed', value: 3 },
      { label: 'There is a clear documented process followed consistently', value: 4 }
    ]
  },
  {
    id: 'd5',
    dimension: 'consistency',
    text: "How confident are you in your team's ability to handle a sales conversation without your involvement?",
    options: [
      { label: 'Not confident, I need to be involved in almost every conversation', value: 1 },
      { label: 'Somewhat confident for early stages but I close most deals', value: 2 },
      { label: 'Fairly confident but complex deals still need me', value: 3 },
      { label: 'Very confident, the team handles the full cycle independently', value: 4 }
    ]
  },
  {
    id: 'd6',
    dimension: 'consistency',
    text: 'How do you currently track and manage open opportunities?',
    options: [
      { label: 'We do not track them formally', value: 1 },
      { label: 'We use spreadsheets or informal notes', value: 2 },
      { label: 'We use a CRM but it is not consistently updated', value: 3 },
      { label: 'We use a CRM consistently and it reflects reality accurately', value: 4 }
    ]
  },

  // Dimension 3: Commercial Independence
  {
    id: 'd7',
    dimension: 'independence',
    text: 'What happens to revenue generation when you step away from the business for two or more weeks?',
    options: [
      { label: 'Everything slows down or stops', value: 1 },
      { label: 'Things continue but key decisions wait for me', value: 2 },
      { label: 'Most things continue but some gaps appear', value: 3 },
      { label: 'The business runs without any meaningful disruption', value: 4 }
    ]
  },
  {
    id: 'd8',
    dimension: 'independence',
    text: 'How much of your client relationships are held personally by you rather than the business?',
    options: [
      { label: 'Almost all client relationships depend on me personally', value: 1 },
      { label: 'Most key relationships are mine but some are shared', value: 2 },
      { label: 'Relationships are partly institutionalised but still founder-heavy', value: 3 },
      { label: 'Relationships are held by the business, not by me personally', value: 4 }
    ]
  },
  {
    id: 'd9',
    dimension: 'independence',
    text: 'If you were to bring in a new commercial hire today, how ready is the business to onboard and enable them?',
    options: [
      { label: 'There is nothing documented for them to follow', value: 1 },
      { label: 'There are some basics but nothing structured', value: 2 },
      { label: 'There is partial documentation and some process', value: 3 },
      { label: 'There is a clear playbook, process, and onboarding structure ready', value: 4 }
    ]
  },

  // Dimension 4: Revenue Visibility
  {
    id: 'd10',
    dimension: 'visibility',
    text: "How accurately can you forecast next quarter's revenue?",
    options: [
      { label: 'I have no reliable way to forecast', value: 1 },
      { label: 'I make rough estimates based on gut feel', value: 2 },
      { label: 'I can forecast with moderate confidence but often miss by more than 20%', value: 3 },
      { label: 'I can forecast with high confidence based on pipeline data', value: 4 }
    ]
  },
  {
    id: 'd11',
    dimension: 'visibility',
    text: 'How clear is your visibility into where deals are being lost and why?',
    options: [
      { label: 'We have no visibility into this', value: 1 },
      { label: 'We have a rough sense but nothing tracked', value: 2 },
      { label: 'We track some loss reasons but the data is incomplete', value: 3 },
      { label: 'We have clear data on loss points and use it to improve', value: 4 }
    ]
  },
  {
    id: 'd12',
    dimension: 'visibility',
    text: 'How would you describe your revenue trend over the past 12 months?',
    options: [
      { label: 'Declining', value: 1 },
      { label: 'Flat or unpredictable', value: 2 },
      { label: 'Growing but inconsistently', value: 3 },
      { label: 'Growing consistently and predictably', value: 4 }
    ]
  },

  // Dimension 5: Growth Readiness
  {
    id: 'd13',
    dimension: 'readiness',
    text: 'If your revenue doubled in the next 12 months, how ready is your commercial infrastructure to handle it?',
    options: [
      { label: 'It would break, we are not ready', value: 1 },
      { label: 'We would struggle significantly', value: 2 },
      { label: 'We could manage but it would expose gaps', value: 3 },
      { label: 'We are ready and the systems could scale', value: 4 }
    ]
  },
  {
    id: 'd14',
    dimension: 'readiness',
    text: 'How clearly defined is accountability for commercial outcomes in your business?',
    options: [
      { label: 'There is no clear accountability, it defaults to me', value: 1 },
      { label: 'There is some accountability but it is informal', value: 2 },
      { label: 'Accountability is defined but not consistently enforced', value: 3 },
      { label: 'Accountability is clear, documented, and tracked', value: 4 }
    ]
  },
  {
    id: 'd15',
    dimension: 'readiness',
    text: 'How would you describe your current approach to entering new markets or segments?',
    options: [
      { label: 'We have no approach, we react to opportunities', value: 1 },
      { label: 'We explore occasionally but without a structured method', value: 2 },
      { label: 'We have some structure but it is not consistently applied', value: 3 },
      { label: 'We have a clear market entry process we apply consistently', value: 4 }
    ]
  }
]

export const DIMENSION_LABELS: Record<string, string> = {
  opportunity: 'Opportunity Generation',
  consistency: 'Sales Consistency',
  independence: 'Commercial Independence',
  visibility: 'Revenue Visibility',
  readiness: 'Growth Readiness'
}

export const DIMENSION_DESCRIPTIONS: Record<string, string> = {
  opportunity: 'How consistently the right opportunities enter your pipeline.',
  consistency: 'Whether a repeatable process converts opportunities reliably.',
  independence: 'How independently your business generates revenue without relying on you personally.',
  visibility: 'How clearly you can see what is happening and what is coming.',
  readiness: 'Whether the business is structurally ready to grow without breaking.'
}
