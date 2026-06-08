interface TickerSectionProps {
  phrases?: string[]
}

export default function TickerSection({ phrases = [] }: TickerSectionProps) {
  if (phrases.length === 0) return null

  const items = [...phrases, ...phrases]

  return (
    <div className="bg-crimson py-5 md:py-6 overflow-hidden border-y border-crimson-800/20">
      <div className="ticker-track">
        {items.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className={`inline-block px-6 md:px-10 font-display font-black text-lg md:text-2xl tracking-wider whitespace-nowrap ${
              i % 2 === 0 ? 'text-cream/25 italic' : 'text-cream/90'
            }`}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
