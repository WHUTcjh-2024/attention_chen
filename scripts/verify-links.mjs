import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'docs', '.vitepress', 'dist')
const base = '/attention_chen/'
const failures = new Set()

function outputCandidates(pathname) {
  if (!pathname.startsWith(base)) return []
  const relativePath = decodeURIComponent(pathname.slice(base.length))

  if (!relativePath) return [join(dist, 'index.html')]
  if (relativePath.endsWith('/')) return [join(dist, relativePath, 'index.html')]

  return [
    join(dist, relativePath),
    join(dist, `${relativePath}.html`),
    join(dist, relativePath, 'index.html')
  ]
}

function verifyLink(link, source) {
  if (!link.startsWith(base)) return
  const pathname = new URL(link, 'https://example.test').pathname
  const candidates = outputCandidates(pathname)
  if (candidates.length && !candidates.some((file) => existsSync(file))) {
    failures.add(`${source}: ${link}`)
  }
}

function visit(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) visit(path)
    else if (entry.name.endsWith('.html')) {
      const html = readFileSync(path, 'utf8')
      for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
        verifyLink(match[1], path)
      }
    }
  }
}

if (!existsSync(dist)) throw new Error('Build the site before checking links.')
visit(dist)

if (failures.size) {
  for (const failure of [...failures].sort()) console.error(failure)
  process.exitCode = 1
} else {
  console.log('Built site links resolve.')
}
