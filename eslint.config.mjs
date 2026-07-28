// eslint-config-next 16 já exporta flat config — usar FlatCompat aqui quebra
// com "Converting circular structure to JSON".
import coreWebVitals from 'eslint-config-next/core-web-vitals'
import typescript from 'eslint-config-next/typescript'

const config = [
  { ignores: ['.next/**', 'node_modules/**', 'next-env.d.ts', 'public/**'] },
  ...coreWebVitals,
  ...typescript,
]

export default config
