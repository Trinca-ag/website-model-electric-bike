# WEB SITE MODEL — site institucional e catálogo

Site da **WEB SITE MODEL**, marca brasileira de mobilidade elétrica (bikes, patinetes e pranchas/jetboards),
com catálogo de produtos, páginas de detalhe, unidades físicas e conversão via WhatsApp.

Este repositório é a migração do site estático original (HTML/CSS/JS puro, três arquivos `.html`
com CSS duplicado) para **Next.js 16 com App Router**. Todo o conteúdo continua sendo estático —
não há banco de dados, CMS nem API: o catálogo inteiro vive em um arquivo TypeScript tipado.

---

## Stack

| Camada        | Escolha                                                        |
| ------------- | -------------------------------------------------------------- |
| Framework     | Next.js 16 (App Router, React Server Components)                 |
| Linguagem     | TypeScript em modo `strict` + `noUncheckedIndexedAccess`         |
| UI            | React 19                                                         |
| Estilo        | CSS puro com custom properties (`src/app/globals.css`) — sem Tailwind, sem CSS-in-JS |
| Fontes        | `next/font/google` (Bebas Neue, Barlow, Barlow Condensed), auto-hospedadas |
| Imagens       | `next/image` (AVIF + WebP, srcset automático)                    |
| SEO           | Metadata API, `sitemap.ts`, `robots.ts`, `manifest.ts`, OG gerado com `next/og` |
| Dependências  | **apenas** `next`, `react` e `react-dom` — nenhuma biblioteca de UI, ícones ou animação |

Os ícones são SVGs inline escritos à mão em `src/components/ui/Icons.tsx`; as animações são CSS
(`@keyframes` + IntersectionObserver em um único componente de cliente).

---

## Como rodar

Requer **Node.js 20+** (Next 16 não roda em versões anteriores).

```bash
npm install     # instala as dependências
npm run dev     # servidor de desenvolvimento em http://localhost:3000
```

Outros scripts:

```bash
npm run build      # build de produção (gera as páginas estáticas)
npm start          # sobe o build de produção localmente (rode `npm run build` antes)
npm run typecheck  # tsc --noEmit — checagem de tipos, sem emitir arquivos
npm run lint       # eslint . (next/core-web-vitals + next/typescript)
npm run analyze    # build com ANALYZE=true, para inspecionar o tamanho dos bundles
```

Antes de abrir um PR ou publicar, o mínimo é `npm run typecheck && npm run lint && npm run build`.

### Variáveis de ambiente

Copie `.env.example` para `.env.local`:

```bash
cp .env.example .env.local
```

A única variável é `NEXT_PUBLIC_SITE_URL` (URL canônica, sem barra final). Ela alimenta o
`metadataBase`, as tags Open Graph, o `sitemap.xml` e o `robots.txt`. Se não for definida, o
fallback é `https://exemplo.com.br`, declarado em `src/data/site.ts`.

---

## Estrutura de pastas

```
website-model/
├── public/
│   └── media/
│       ├── produtos/        # <id>.webp — 1024x1024, fundo transparente
│       ├── categorias/      # cat-bike.webp, cat-patinete.webp, cat-prancha.webp
│       ├── unidades/        # unidade-1.webp … unidade-4.webp
│       ├── video/           # banner-1..3.mp4 + poster-1..3.jpg (hero)
│       ├── logo.png         # 320x320 — favicon, apple-touch-icon e ícone do manifest
│       └── logo.webp
│
├── src/
│   ├── app/
│   │   ├── layout.tsx           # <html>/<body>, fontes, navbar, rodapé, FAB, metadata base
│   │   ├── globals.css          # design system: tokens, reset, botões, cards, seções
│   │   ├── page.tsx             # home
│   │   ├── produtos/            # catálogo completo e por categoria
│   │   ├── produto/[slug]/      # página de detalhe do produto
│   │   ├── not-found.tsx        # 404
│   │   ├── sitemap.ts           # /sitemap.xml
│   │   ├── robots.ts            # /robots.txt
│   │   ├── manifest.ts          # /manifest.webmanifest (PWA leve, instalável)
│   │   └── opengraph-image.tsx  # card social 1200x630, gerado no build
│   │
│   ├── components/
│   │   ├── layout/     # Navbar, Footer, ScrollProgress, WhatsappFab
│   │   ├── product/    # ProductCard e afins
│   │   └── ui/         # Icons (SVG inline), Reveal (scroll reveal)
│   │
│   ├── data/
│   │   ├── products.ts  # catálogo — fonte única de verdade
│   │   └── site.ts      # marca, WhatsApp, unidades, links do menu, slides do hero
│   │
│   ├── lib/
│   │   ├── format.ts    # brl(n), brlFull(n)
│   │   └── whatsapp.ts  # waLink(msg, phone?), productWaLink(product)
│   │
│   └── types/
│       └── product.ts   # Product, Category, CategoryId, RangeUnit
│
├── next.config.ts     # imagens, headers de cache, redirects das URLs antigas
├── eslint.config.mjs
├── tsconfig.json      # strict + noUncheckedIndexedAccess, alias @/* → ./src/*
└── .env.example
```

Regra geral do projeto: **Server Components por padrão**. `'use client'` só aparece nas folhas
que realmente precisam de estado ou evento (menu mobile, carrossel do hero, filtros do catálogo,
barra de progresso, scroll reveal).

---

## Como adicionar ou editar um produto

Só existem dois passos. Não é preciso criar página, rota nem componente: o catálogo, os filtros,
a home, o sitemap e as páginas de detalhe são todos derivados do array `PRODUCTS`.

### 1. Coloque a imagem em `public/media/produtos/`

- Formato **WebP**, quadrada, idealmente **1024x1024**, com **fundo transparente**.
- Nome do arquivo igual ao `id` do produto: `id: 'v40pro'` → `public/media/produtos/v40pro.webp`.

### 2. Adicione o objeto em `src/data/products.ts`

Acrescente uma entrada ao array `PRODUCTS`, no bloco da categoria correspondente:

```ts
{
  id: 'v50pro',                          // único; também é o nome do arquivo da imagem
  slug: 'v50-pro',                       // vira a URL /produto/v50-pro
  cat: 'bikes',                          // 'bikes' | 'patinetes' | 'pranchas'
  line: 'Linha V',                       // agrupador usado nos filtros do catálogo
  name: 'V50 Pro',
  image: '/media/produtos/v50pro.webp',  // caminho absoluto a partir de /public
  price: 12999,                          // preço cheio, em reais
  pricePix: 11699.1,                     // preço no PIX (é o que aparece em destaque)
  installment: 1083.25,                  // valor da parcela
  speed: 32,                             // km/h
  range: 60,                             // autonomia
  rangeUnit: 'km',                       // 'km' (bikes/patinetes) | 'min' (pranchas)
  power: '1000W',
  tag: 'Novidade',                       // selo no card; use `null` para não exibir
  desc: 'Descrição curta usada no card e na página do produto.',
  specs: {                               // tabela de especificações — chave: valor
    Motor: '1000 W – silencioso',
    Autonomia: 'Até 60 km',
  },
  // onRequest: true,                    // opcional: produto sob consulta, esconde o preço
}
```

Depois é só rodar `npm run typecheck` — o TypeScript reclama se faltar qualquer campo obrigatório.

**Detalhes que valem lembrar:**

- **Ordem importa.** A ordem do array é a ordem de exibição no catálogo e a ordem em que as
  "linhas" aparecem nos filtros (`LINES_BY_CATEGORY`).
- **Nunca monte o caminho da imagem na mão** nos componentes; use sempre `product.image`.
- **Trocar o `slug` quebra a URL** de um produto já indexado. Se precisar mudar, adicione um
  redirect 301 em `next.config.ts` do slug antigo para o novo.
- **Destaques da home**: edite o array `FEATURED_IDS` no fim de `src/data/products.ts`
  (são `id`s, não `slug`s).
- **Nova categoria**: exige mais que os dois passos acima — é preciso acrescentar o id em
  `CategoryId` (`src/types/product.ts`), em `CATEGORIES` e em `CATEGORY_IDS`
  (`src/data/products.ts`), além de uma imagem em `public/media/categorias/`.
- Remover um produto é simplesmente apagar o objeto do array; o sitemap se ajusta sozinho no
  próximo build. Se o produto era indexado, considere um redirect para a categoria.

---

## Como trocar o WhatsApp e as unidades

Tudo em **`src/data/site.ts`**.

### Número principal do WhatsApp

É o número usado no botão flutuante, nos CTAs e nos cards de produto:

```ts
export const SITE = {
  // ...
  whatsapp: '5511999999999', // só dígitos: 55 + DDD + número, sem +, espaço ou traço
} as const
```

As mensagens pré-preenchidas são montadas em `src/lib/whatsapp.ts` (`waLink` e `productWaLink`) —
mude o texto ali se quiser outro roteiro de abordagem.

### Unidades físicas

O array `UNITS` alimenta a seção de unidades da home. Cada unidade tem o próprio WhatsApp e o
próprio link de mapa:

```ts
{
  id: 'paulista',                         // usado como key/âncora
  name: 'Unidade Paulista',
  street: 'Av. Paulista, 1578, Bela Vista',
  city: 'São Paulo – SP, 01310-200',
  hours: 'Seg–Sex 09h–19h · Sáb 09h–17h',
  tags: ['Test Ride', 'Assistência', 'Financiamento'],
  whatsapp: '5511999999991',              // WhatsApp específico da loja
  mapsQuery: 'Av. Paulista, 1578, ...',   // endereço usado no link do Google Maps
  image: '/media/unidades/unidade-1.webp',
}
```

Para adicionar uma unidade, acrescente um objeto ao array e coloque a foto em
`public/media/unidades/` (**900x506**, WebP). O grid se ajusta sozinho.

Ainda em `site.ts`: `NAV_LINKS` (menu), `FOOTER_SECTIONS` (rodapé), `HERO_SLIDES` (vídeos do topo)
e os textos de marca (`name`, `tagline`, `description`).

---

## O que foi otimizado na migração

O site original entregava mídia bruta e três folhas de estilo praticamente idênticas. O que mudou:

- **Vídeos do hero: ~32 MB → ~4,4 MB.** Recodificados em H.264 a 1280px, com pôster JPG para o
  primeiro quadro. O vídeo só é baixado depois que o pôster já pintou.
- **Imagens: ~41 MB → ~2,2 MB.** Todo o catálogo foi convertido para WebP 1024x1024 com fundo
  transparente; unidades e categorias foram redimensionadas para o tamanho real de exibição.
  Em runtime, o `next/image` ainda serve **AVIF** quando o navegador aceita, com `srcset` gerado
  nas larguras dos breakpoints reais do layout (`next.config.ts`).
- **Fontes auto-hospedadas.** Bebas Neue, Barlow e Barlow Condensed passaram do
  `<link>` para `fonts.googleapis.com` para o `next/font`: os arquivos são servidos do próprio
  domínio, sem request de terceiro, sem CSS render-blocking e com fallback métrico (sem CLS).
- **CSS unificado.** O CSS duplicado em `index.html`, `produtos.html` e `produto.html` virou um
  único design system em `src/app/globals.css`, com tokens de cor, tipografia e espaçamento.
  Cada página carrega só o CSS extra que é realmente dela.
- **Páginas estáticas.** Home, catálogo, as 3 categorias e as 31 páginas de produto são
  pré-renderizadas no build (HTML pronto no CDN, sem execução de servidor por request).
- **Componentes de servidor.** A árvore inteira é Server Component por padrão; só quatro ou cinco
  folhas interativas viram JavaScript no cliente. O catálogo, os cards e as páginas de produto não
  enviam JS de aplicação para o navegador.
- **JavaScript enxuto.** O `produtos-data.js` que era baixado pelo navegador virou dado de build:
  o catálogo não trafega mais como script.
- **Cache e headers.** `/media/*` responde com `Cache-Control: immutable` por um ano; headers de
  segurança básicos (`X-Content-Type-Options`, `Referrer-Policy`) em todas as rotas.
- **URLs antigas preservadas.** `next.config.ts` redireciona com 301 as rotas do site estático
  (`/index.html`, `/produtos.html?cat=…`, `/produto.html?id=…`) para as rotas novas.
- **SEO e social.** `sitemap.xml` e `robots.txt` gerados a partir dos dados, canonical por página,
  card Open Graph 1200x630 gerado no build com `next/og` e manifest instalável (PWA leve).

> Nenhuma medição de Lighthouse ou Core Web Vitals foi registrada aqui — os números acima são
> tamanhos de arquivo antes/depois. Rode sua própria auditoria contra o deploy de produção.

---

## Deploy na Vercel

O projeto é um app Next.js padrão: a Vercel detecta tudo sozinha, sem `vercel.json`.

1. **Importe o repositório** em [vercel.com/new](https://vercel.com/new).
2. **Framework Preset**: Next.js (detectado automaticamente).
   - Root Directory: `website-model` — **importante** se o repositório tiver o site antigo na raiz.
   - Build Command: `next build` (padrão)
   - Output Directory: padrão (não mexer)
   - Install Command: `npm install` (padrão)
3. **Environment Variables** → adicione `NEXT_PUBLIC_SITE_URL` com a URL final do site
   (ex.: `https://exemplo.com.br`), sem barra no fim, no ambiente **Production**.
4. **Deploy.** Cada push na branch principal publica em produção; cada PR ganha um preview.
5. **Domínio**: Settings → Domains → adicione `exemplo.com.br` e siga as instruções de DNS.
   Depois de apontar o domínio, confirme que `NEXT_PUBLIC_SITE_URL` bate com ele e **refaça o
   deploy** — a URL entra no HTML durante o build (canonical, OG, sitemap).
6. **Pós-deploy**: verifique `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest` e
   `/opengraph-image` e cadastre o sitemap no Google Search Console.

Pela CLI, alternativamente:

```bash
npx vercel        # deploy de preview
npx vercel --prod # deploy de produção
```

O site não usa banco, autenticação nem rotas dinâmicas de servidor, então funciona igualmente bem
em qualquer host que suporte Next.js.

---

## Reotimizar mídia ao cadastrar produtos

```bash
npm run optimize:media -- ../uploads
```

Converte imagens para WebP em `public/media/{produtos,categorias,unidades}` e vídeos para
MP4 720p + poster JPG em `public/media/video`. Requer `ffmpeg` no PATH para vídeo (`sharp`,
usado nas imagens, já vem instalado com o Next). Depois, registre o produto em
`src/data/products.ts` apontando `image` para `/media/produtos/<id>.webp`.

## Notas de manutenção

- **`src/data/categories.ts` é separado de `products.ts` de propósito.** Componentes de
  **cliente** devem importar categorias de `@/data/categories`. Importar de `@/data/products`
  arrasta o array dos 31 produtos (~19 KB minificados) para o bundle do navegador.
- **`--neon` vs `--neon-ink`.** `--neon` é cor de preenchimento (fundo, borda, barra).
  Para **texto e ícone** use `--neon-ink`, que no tema claro vira um verde escuro legível.
  Quem fica sobre fundo escuro nos dois temas (`.hero`, `.catcard`) redeclara `--neon-ink`
  localmente.
- **O logo é texto, não imagem.** `src/components/layout/Logo.tsx` renderiza o wordmark
  "WEB SITE MODEL" (classe `.wordmark`, estilos em `globals.css`). Por ser texto, acompanha
  o tema por herança de cor, não pede variante clara/escura e não custa request. O favicon
  (`src/app/icon.tsx`) e a imagem de compartilhamento (`src/app/opengraph-image.tsx`) são
  gerados no build com `ImageResponse` — não há arquivo de logo em `public/`.
- **Foto de fundo das rotas de categoria.** Cada categoria em `src/data/categories.ts`
  aponta `heroImage` (e `heroAlt`) para uma imagem em `public/media/categorias/`.
  Ela é o elemento de LCP da rota — por isso leva `priority` e o primeiro card do
  catálogo NÃO leva, para não disputar preload. Ao trocar a foto, prefira algo escuro
  ou com área lisa à esquerda: o véu (`.page-hero-veil`) escurece esse lado, onde
  ficam o título e o subtítulo. A foto de `/produtos` (catálogo completo) fica em
  `CATALOG_HERO`, em `src/data/site.ts`.
- **`ID_TO_SLUG`** existe para os links antigos: `produto.html?id=ct20s` redireciona para
  `/produto/ct20-s`. Ao renomear um `slug`, mantenha o `id` — ele é o contrato com as URLs
  já indexadas.

## Pendências conhecidas

Levantadas na auditoria da migração e **não** corrigidas — nenhuma quebra funcionalidade:

- `CatalogView` renderiza os `ProductCard` no cliente, então os 31 cards viajam no payload
  RSC e viram JS. Passar os cards já renderizados como `children` (como já é feito com as
  pills) reduziria o bundle de `/produtos`. Refatoração de porte médio.
- A gaveta de filtros no mobile não prende o foco (`focus trap`) e o menu mobile fechado
  mantém os links na ordem de tabulação. Ambos pedem `inert` no conteúdo de trás.
- `/produtos` e as rotas de categoria não declaram `og:image`.
- O ano do rodapé é resolvido no build; só muda com um novo deploy.
- O bloco "Newsletter" do rodapé original foi removido (não havia backend para recebê-lo).
- O FAB do WhatsApp mantém o verde de marca `#25D366`, que fica abaixo de 3:1 de contraste
  para o ícone. O botão com texto nos cards usa `#128C7E`, que passa em AA.
