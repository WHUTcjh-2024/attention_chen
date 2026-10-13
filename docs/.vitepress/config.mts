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
      { text: '知识地图', link: '/' }
    ],
    sidebar: [
      {
        text: '首页',
        items: [{ text: '知识地图', link: '/' }]
      },
      {
        text: '知识结构',
        items: [
          { text: 'Foundations · 基础概念' },
          { text: 'Inference · 推理流程' },
          { text: 'KV Cache · 缓存机制' },
          { text: 'Kernels · 算子优化' },
          { text: 'Serving · 推理服务' },
          { text: 'Systems · 系统实现' }
        ]
      }
    ],
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
