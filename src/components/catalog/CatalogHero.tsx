import Image from 'next/image'
import Link from 'next/link'

import type { Category } from '@/types/product'

interface HeroBackground {
  src: string
  alt: string
  /**
   * Enquadramento do recorte (`object-position`). A faixa é bem mais larga que
   * alta, então o `cover` sempre descarta parte da altura — o padrão `center`
   * corta topo e base por igual. Use `center top` quando o que interessa está
   * na metade de cima da foto.
   */
  position?: string
}

interface CatalogHeroProps {
  /** Primeira linha do H1 (a segunda sai em neon). */
  titleTop: string
  titleBottom: string
  subtitle: string
  /** Presente só nas rotas de categoria — vira o último item do breadcrumb. */
  category?: Category
  /**
   * Foto de fundo da faixa. Vem como prop em vez de sair da `category` porque
   * /produtos também tem a sua, e ali não existe categoria.
   */
  background?: HeroBackground
}

/** Cabeçalho compartilhado pelas duas rotas do catálogo. */
export default function CatalogHero({
  titleTop,
  titleBottom,
  subtitle,
  category,
  background,
}: CatalogHeroProps) {
  return (
    <div className={`page-hero${background ? ' has-bg' : ''}`}>
      {background ? (
        <>
          {/* Elemento de LCP da rota: por isso `priority` e `sizes="100vw"`.
              A faixa ocupa a largura toda em qualquer breakpoint. */}
          <Image
            src={background.src}
            alt={background.alt}
            fill
            sizes="100vw"
            priority
            className="page-hero-img"
            style={{ objectPosition: background.position ?? 'center' }}
          />
          {/* Véu escuro fixo (não segue o tema): o texto fica branco sobre foto
              nos dois temas, e o gradiente é mais forte à esquerda, onde o
              título e o subtítulo ficam. */}
          <div className="page-hero-veil" aria-hidden />
        </>
      ) : null}

      <div className="page-hero-content">
        <nav className="breadcrumb" aria-label="Trilha de navegação">
          <Link href="/">Início</Link>
          <span className="sep" aria-hidden>
            /
          </span>
          {category ? (
            <>
              <Link href="/produtos">Produtos</Link>
              <span className="sep" aria-hidden>
                /
              </span>
              <span className="cur" aria-current="page">
                {category.label}
              </span>
            </>
          ) : (
            <span className="cur" aria-current="page">
              Produtos
            </span>
          )}
        </nav>

        <h1>
          {titleTop}
          <br />
          <span className="hl">{titleBottom}</span>
        </h1>
        <p>{subtitle}</p>
      </div>
    </div>
  )
}
