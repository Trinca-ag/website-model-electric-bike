interface LogoProps {
  /** `nav-logo` na navbar, `flogo` no rodapé — controlam o tamanho. */
  className: string
}

/**
 * Wordmark do site, em texto.
 *
 * Sendo texto e não imagem, ele acompanha o tema pelo `currentColor`, não
 * precisa de duas variantes de arquivo, não pesa nada no carregamento e é
 * lido corretamente por leitores de tela sem depender de `alt`.
 */
export default function Logo({ className }: LogoProps) {
  return (
    <span className={`${className} wordmark`}>
      Web Site <span className="wordmark-accent">Model</span>
    </span>
  )
}
