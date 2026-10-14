import type { DefaultTheme } from 'vitepress'
import { knowledgeMap } from './data/knowledge-map'

export const sidebar: DefaultTheme.SidebarItem[] = [
  {
    text: 'Attention',
    link: '/',
    items: knowledgeMap.map((branch) => ({
      text: branch.title,
      link: branch.link,
      collapsed: false,
      items: branch.topics.map((topic) => ({
        text: topic.title,
        link: topic.link
      }))
    }))
  }
]
