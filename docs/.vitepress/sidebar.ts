import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { DefaultTheme } from 'vitepress'

const docsRoot = fileURLToPath(new URL('..', import.meta.url))

const sections = [
  ['foundations', 'Foundations'],
  ['inference', 'Inference'],
  ['kernels', 'Kernels'],
  ['serving', 'Serving'],
  ['systems', 'Systems'],
  ['distributed', 'Distributed'],
  ['experiments', 'Experiments'],
  ['papers', 'Papers'],
  ['map', 'Knowledge Map']
] as const

function metadata(file: string) {
  const source = readFileSync(file, 'utf8')
  const frontmatter = source.match(/^---\s*\n([\s\S]*?)\n---/)
  const title = frontmatter?.[1].match(/^title:\s*['"]?(.+?)['"]?\s*$/m)?.[1]
  const order = Number(frontmatter?.[1].match(/^order:\s*(\d+)\s*$/m)?.[1] ?? 999)
  return { title, order }
}

function pageLink(file: string) {
  const path = relative(docsRoot, file).replaceAll('\\', '/').replace(/\.md$/, '')
  return '/' + path.replace(/\/index$/, '/')
}

function pages(directory: string): DefaultTheme.SidebarItem[] {
  return readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const path = join(directory, entry.name)
      if (entry.isFile() && entry.name.endsWith('.md') && entry.name !== 'index.md') {
        const { title, order } = metadata(path)
        return [{
          order,
          item: {
            text: title ?? entry.name.replace(/\.md$/, '').replaceAll('-', ' '),
            link: pageLink(path)
          }
        }]
      }
      if (entry.isDirectory()) {
        const children = pages(path)
        if (children.length === 0) return []
        const index = join(path, 'index.md')
        const { title, order } = existsSync(index) ? metadata(index) : { title: undefined, order: 999 }
        return [{
          order,
          item: {
            text: title ?? entry.name.replaceAll('-', ' '),
            link: existsSync(index) ? pageLink(index) : undefined,
            collapsed: true,
            items: children
          }
        }]
      }
      return []
    })
    .sort((a, b) => a.order - b.order || (a.item.text ?? '').localeCompare(b.item.text ?? ''))
    .map(({ item }) => item)
}

export const sidebar: DefaultTheme.SidebarItem[] = sections
  .filter(([directory]) => existsSync(join(docsRoot, directory, 'index.md')))
  .map(([directory, label]) => ({
    text: label,
    link: `/${directory}/`,
    collapsed: true,
    items: pages(join(docsRoot, directory))
  }))
