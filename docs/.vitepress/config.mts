import { defineConfig } from 'vitepress'
import { sidebar } from './sidebar'

export default defineConfig({
  lang: 'zh-CN',
  title: 'Attention KB',
  description: 'Attention 与大模型推理优化知识库',
  base: '/attention_chen/',
  appearance: false,
  cleanUrls: true,
  themeConfig: {
    sidebar,
    search: { provider: 'local' },
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
