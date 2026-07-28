#!/usr/bin/env node
/**
 * Otimiza a mídia bruta para os formatos servidos em produção.
 *
 *   node scripts/optimize-media.mjs "../uploads"
 *
 * Imagens  → WebP em public/media/{produtos,categorias,unidades}
 * Vídeos   → MP4 H.264 720p + poster JPG em public/media/video (requer ffmpeg no PATH)
 *
 * Rode isto sempre que adicionar um produto novo. Depois registre o produto em
 * src/data/products.ts apontando `image` para /media/produtos/<id>.webp.
 *
 * `sharp` vem instalado junto com o Next (é o otimizador de imagens dele).
 */
import { spawn } from 'node:child_process'
import { mkdir, readdir, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUT = path.join(ROOT, 'public', 'media')

const IMAGE_EXT = new Set(['.png', '.jpg', '.jpeg', '.webp'])
const VIDEO_EXT = new Set(['.mp4', '.mov', '.m4v', '.webm'])

/** Regras por pasta de origem: para onde vai e com que largura máxima. */
const IMAGE_RULES = [
  { match: /produtos/i, dir: 'produtos', width: 1024, quality: 80 },
  { match: /^cat-/i, dir: 'categorias', width: 1000, quality: 78 },
  { match: /^unidade-/i, dir: 'unidades', width: 900, quality: 78 },
]

function ruleFor(relPath, fileName) {
  return (
    IMAGE_RULES.find((r) => r.match.test(relPath) || r.match.test(fileName)) ?? {
      dir: '',
      width: 1400,
      quality: 80,
    }
  )
}

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) yield* walk(full)
    else yield full
  }
}

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: ['ignore', 'ignore', 'pipe'] })
    let stderr = ''
    child.stderr.on('data', (chunk) => (stderr += chunk))
    child.on('error', reject)
    child.on('close', (code) =>
      code === 0 ? resolve() : reject(new Error(stderr.trim() || `${cmd} saiu com código ${code}`)),
    )
  })
}

async function optimizeImage(sharp, src, srcRoot) {
  const rel = path.relative(srcRoot, src)
  const name = path.basename(src, path.extname(src))
  const rule = ruleFor(rel, path.basename(src))
  const destDir = path.join(OUT, rule.dir)
  await mkdir(destDir, { recursive: true })
  const dest = path.join(destDir, `${name}.webp`)

  const before = (await stat(src)).size
  await sharp(src)
    // `withoutEnlargement` evita upscale de arte já pequena.
    .resize({ width: rule.width, withoutEnlargement: true })
    .webp({ quality: rule.quality, effort: 6 })
    .toFile(dest)
  const after = (await stat(dest)).size

  return { rel, before, after, dest: path.relative(ROOT, dest) }
}

async function optimizeVideo(src) {
  const name = path.basename(src, path.extname(src))
  const destDir = path.join(OUT, 'video')
  await mkdir(destDir, { recursive: true })
  const dest = path.join(destDir, `${name}.mp4`)
  const poster = path.join(destDir, `poster-${name.replace(/^banner-/, '')}.jpg`)

  const before = (await stat(src)).size
  await run('ffmpeg', [
    '-y', '-loglevel', 'error', '-i', src,
    '-an',                                    // hero é mudo: descarta o áudio
    '-vf', 'scale=1280:-2',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '28',
    '-profile:v', 'high', '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart',                // moov no início: começa a tocar antes de baixar tudo
    dest,
  ])
  await run('ffmpeg', [
    '-y', '-loglevel', 'error', '-ss', '0.5', '-i', src,
    '-frames:v', '1', '-vf', 'scale=1280:-2', '-q:v', '6', poster,
  ])
  const after = (await stat(dest)).size

  return { rel: path.basename(src), before, after, dest: path.relative(ROOT, dest) }
}

const mb = (n) => `${(n / 1024 / 1024).toFixed(2)} MB`

async function main() {
  const srcRoot = path.resolve(ROOT, process.argv[2] ?? '../uploads')

  try {
    await stat(srcRoot)
  } catch {
    console.error(`Pasta de origem não encontrada: ${srcRoot}`)
    process.exit(1)
  }

  const { default: sharp } = await import('sharp')

  let totalBefore = 0
  let totalAfter = 0
  let failures = 0

  for await (const file of walk(srcRoot)) {
    const ext = path.extname(file).toLowerCase()
    const isImage = IMAGE_EXT.has(ext)
    const isVideo = VIDEO_EXT.has(ext)
    if (!isImage && !isVideo) continue

    try {
      const r = isImage
        ? await optimizeImage(sharp, file, srcRoot)
        : await optimizeVideo(file)
      totalBefore += r.before
      totalAfter += r.after
      console.log(`✓ ${r.rel}  ${mb(r.before)} → ${mb(r.after)}  (${r.dest})`)
    } catch (err) {
      failures += 1
      console.error(`✗ ${path.relative(srcRoot, file)}: ${err.message}`)
    }
  }

  if (totalBefore === 0) {
    console.log('Nenhuma mídia encontrada.')
    return
  }

  const saved = (1 - totalAfter / totalBefore) * 100
  console.log(`\nTotal: ${mb(totalBefore)} → ${mb(totalAfter)}  (-${saved.toFixed(1)}%)`)
  if (failures > 0) {
    console.error(`${failures} arquivo(s) falharam.`)
    process.exit(1)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
