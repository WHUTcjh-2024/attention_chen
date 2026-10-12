import { defineConfig } from 'vitepress'

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
      { text: '首页', link: '/' }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/WHUTcjh-2024/attention_chen' }
    ],
    returnToTopLabel: '返回顶部',
    skipToContentLabel: '跳转到正文',
    externalLinkIcon: true
  }
})
