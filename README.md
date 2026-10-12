# Attention 学习笔记（陈）

记录理论与实操，形成自己的知识网。

这是基于 VitePress 的 Attention / AI Infrastructure 工程知识库。Markdown 是内容来源，站点提供侧栏、站内搜索、页内目录与独立的 [Knowledge Map](docs/map/index.md)。阅读材料原始 PDF 不在仓库中。

## Local development

```sh
npm install
npm run docs:dev
```

## Build and preview

```sh
npm run docs:build
npm run docs:preview
```

推送到 `main` 后，GitHub Actions 自动构建并部署到 [GitHub Pages](https://whutcjh-2024.github.io/attention_chen/)。

## 添加笔记

在 `docs/foundations/`、`docs/inference/`、`docs/kernels/` 等目录中新增 Markdown 文件。侧栏会读取文件的 `title` 和可选的 `order` frontmatter，自动加入对应分类：

```yaml
---
title: KV Cache
description: Transformer 推理中的历史 K/V 缓存
tags: [attention, inference, memory]
order: 3
---
```

文档之间使用相对 Markdown 链接。知识地图节点维护在 `docs/.vitepress/data/knowledge-map.ts`，只作为导航；详细内容写在 Markdown 中。
