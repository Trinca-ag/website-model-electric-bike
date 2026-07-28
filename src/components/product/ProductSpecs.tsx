import Reveal from '@/components/ui/Reveal'

interface ProductSpecsProps {
  specs: Readonly<Record<string, string>>
}

/**
 * Ficha técnica como lista de definições: o original usava divs soltas, mas
 * `<dl>` descreve exatamente a relação rótulo → valor sem mudar o visual.
 */
export default function ProductSpecs({ specs }: ProductSpecsProps) {
  const entries = Object.entries(specs)
  if (entries.length === 0) return null

  return (
    <Reveal className="pd-spec-table">
      <dl>
        {entries.map(([label, value]) => (
          <div className="pd-spec-row rev" key={label}>
            <dt className="pd-spec-lbl">{label}</dt>
            <dd className="pd-spec-val">{value}</dd>
          </div>
        ))}
      </dl>
    </Reveal>
  )
}
