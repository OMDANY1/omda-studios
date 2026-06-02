export default function TickerSection() {
  const items = [
    'RADICAL SIMPLICITY',
    'VISUAL AUTHORITY',
    'RADICAL SIMPLICITY',
    'VISUAL AUTHORITY',
    'RADICAL SIMPLICITY',
    'VISUAL AUTHORITY',
    'RADICAL SIMPLICITY',
    'VISUAL AUTHORITY',
  ]

  return (
    <div className="bg-crimson py-4 overflow-hidden">
      <div className="ticker-track">
        {items.map((item, i) => (
          <span
            key={i}
            className={`inline-block px-8 font-display font-black text-xl md:text-2xl tracking-wider whitespace-nowrap ${
              i % 2 === 0 ? 'text-cream/30 italic' : 'text-cream'
            }`}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
