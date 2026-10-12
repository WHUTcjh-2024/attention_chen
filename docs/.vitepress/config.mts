import { defineConfig } from 'vitepress'
import { sidebar } from './sidebar'

export default defineConfig({
  lang: 'zh-CN',
  title: 'Attention',
  description: 'Attention 与大模型推理优化知识库',
  base: '/attention_chen/',
  appearance: false,
  head: [['meta', { name: 'theme-color', content: '#ffffff' }]],
  themeConfig: {
    siteTitle: 'Attention',
    nav: [
      { text: '首页', link: '/' },
      { text: 'Knowledge Map', link: '/map/' }
    ],
    sidebar,
    outline: { level: [2, 3], label: '本页目录' },
    search: {
      provider: 'local',
      options: {
        detailedView: true,
        locales: {
          root: {
            translations: {
              button: { buttonText: '搜索', buttonAriaLabel: '搜索文档' },
              modal: {
                displayDetails: '切换摘要',
                noResultsText: '没有找到结果',
                resetButtonTitle: '清空搜索',
                backButtonTitle: '关闭搜索',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                  closeText: '关闭'
                }
              }
            }
          }
        }
      }
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/WHUTcjh-2024/attention_chen' }
    ],
    docFooter: { prev: '上一篇', next: '下一篇' },
    sidebarMenuLabel: '目录',
    returnToTopLabel: '返回顶部',
    skipToContentLabel: '跳转到正文',
    externalLinkIcon: true
  }
})
