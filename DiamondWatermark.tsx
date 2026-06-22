interface ChoiceOption {
  label: string
  value: string | number
}

interface QuestionCardProps {
  questionNumber: number
  text: string
  options: ChoiceOption[]
  selectedValue: string | number | null
  onSelect: (value: string | number) => void
}

export default function QuestionCard({
  text,
  options,
  selectedValue,
  onSelect
}: QuestionCardProps) {
  return (
    <div className="fade-up">
      <h2 className="font-display text-2xl md:text-3xl font-bold text-textPrimary leading-tight mb-8">
        {text}
      </h2>
      <div className="flex flex-col gap-3">
        {options.map((option) => {
          const isSelected = selectedValue === option.value
          return (
            <button
              key={String(option.value)}
              type="button"
              onClick={() => onSelect(option.value)}
              className={`w-full text-left px-5 py-4 rounded-lg border transition-all duration-150 ${
                isSelected
                  ? 'border-gold bg-surfaceAlt text-textPrimary'
                  : 'border-border bg-surface text-textSecondary hover:border-goldDark hover:text-textPrimary'
              }`}
            >
              <span className="flex items-center gap-3">
                <span
                  className={`flex-shrink-0 w-4 h-4 rounded-full border-2 transition-colors ${
                    isSelected ? 'border-gold bg-gold' : 'border-border'
                  }`}
                />
                {option.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
