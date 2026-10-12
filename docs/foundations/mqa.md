---
title: MQA
description: Multi-Query Attention
tags: [attention, kv-cache]
order: 4
---

# MQA

Multi-Query Attention 让多个 query head 共享一组 K/V head。它减少每个 token 需要缓存的 K/V 数据量；阅读实现时要核对 head 映射、广播方式和对应的模型配置。

## 对比

[MHA](./mha.md) 保留每个 query head 对应的 K/V head；[GQA](./gqa.md) 则在两者之间使用多个 K/V 组。缓存大小还受序列长度、层数、精度和 head dimension 影响。
