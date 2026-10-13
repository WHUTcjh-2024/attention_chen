import { readFileSync, readdirSync } from 'node:fs'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { DefaultTheme } from 'vitepress'

const docsRoot = fileURLToPath(new URL('..', import.meta.url))

function label(name: string): string {
  return name.replace(/\.md$/, '').replace(/[-_]/g, ' ')
}

function title(file: string): string {
  const source = readFileSync(file, 'utf8')
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)
  const configured = frontmatter?.[1].match(/^title:\s*(.+?)\s*$/m)?.[1]
  const heading = source.match(/^#\s+(.+?)\s*$/m)?.[1]
  return configured?.replace(/^['"]|['"]$/g, '') ?? heading ?? label(file.split(/[\\/]/).at(-1)!)
}

function link(file: string): string {
  const path = relative(docsRoot, file).replaceAll('\\', '/').replace(/\.md$/, '')
  return '/' + path.replace(/(^|\/)index$/, '$1')
}

function items(directory: string): DefaultTheme.SidebarItem[] {
  return readdirSync(directory, { withFileTypes: true })
    .filter((entry) => !entry.name.startsWith('.'))
    .sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'))
    .flatMap((entry) => {
      const path = join(directory, entry.name)

      if (entry.isDirectory()) {
        const children = items(path)
        return children.length
          ? [{ text: label(entry.name), collapsed: true, items: children }]
          : []
      }

      if (!entry.isFile() || !entry.name.endsWith('.md') || path === join(docsRoot, 'index.md')) {
        return []
      }

      return [{ text: title(path), link: link(path) }]
    })
}

export const sidebar: DefaultTheme.SidebarItem[] = items(docsRoot)
