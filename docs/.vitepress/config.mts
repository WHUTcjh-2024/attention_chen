import { defineConfig } from 'vitepress'
import { sidebar } from './sidebar'

export default defineConfig({
  lang: 'zh-CN',
  title: 'Attention 知识网',
  description: '从模型结构到推理阶段，系统理解 Attention',
  base: '/attention_chen/',
  appearance: false,
  cleanUrls: true,
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/attention_chen/favicon.svg' }]
  ],
  themeConfig: {
    siteTitle: 'Attention',
    nav: [
      { text: '知识网', link: '/' },
      { text: '模型结构', link: '/architecture/' },
      { text: '推理阶段', link: '/runtime/' }
    ],
    sidebar,
    outline: { label: '本页目录' },
    docFooter: { prev: '上一篇', next: '下一篇' },
    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索', buttonAriaLabel: '搜索文档' },
          modal: {
            displayDetails: '显示详细结果',
            resetButtonTitle: '清空搜索',
            backButtonTitle: '返回搜索',
            noResultsText: '没有找到结果',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭'
            }
          }
        }
      }
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/WHUTcjh-2024/attention_chen' }
    ],
    returnToTopLabel: '返回顶部',
    sidebarMenuLabel: '目录',
    darkModeSwitchLabel: '外观',
    skipToContentLabel: '跳转到正文',
    externalLinkIcon: true
  }
})
