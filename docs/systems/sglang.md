---
title: SGLang
description: 服务调度与缓存的源码阅读入口
tags: [systems, serving]
order: 3
---

# SGLang

阅读时先确定请求进入、调度、模型执行和输出返回的路径，再定位 [Prefix Cache](../serving/prefix-cache.md) 与 [KV Cache](../inference/kv-cache.md) 的具体实现。

记录仓库版本及启用的 backend，避免把某个配置下的行为推广到所有部署。
