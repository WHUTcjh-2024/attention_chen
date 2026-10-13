import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: 'Attention KB',
  description: 'Attention 与大模型推理优化知识库',
  base: '/attention_chen/',
  appearance: false,
  cleanUrls: true,
  head: [['meta', { name: 'theme-color', content: '#ffffff' }]],
  themeConfig: {
    siteTitle: 'Attention KB',
    nav: [
      { text: '知识地图', link: '/' },
      { text: '文档', link: '/foundations' }
    ],
    sidebar: [
      {
        text: '首页',
        items: [{ text: '知识地图', link: '/' }]
      },
      {
        text: '文档',
        items: [
          { text: 'Foundations · 基础概念', link: '/foundations' },
          { text: 'Inference · 推理流程', link: '/inference' },
          { text: 'KV Cache · 缓存机制', link: '/kv-cache' },
          { text: 'Kernels · 算子优化', link: '/kernels' },
          { text: 'Serving · 推理服务', link: '/serving' },
          { text: 'Systems · 系统实现', link: '/systems' }
        ]
      }
    ],
    outline: { level: [2, 3], label: '本页' },
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
