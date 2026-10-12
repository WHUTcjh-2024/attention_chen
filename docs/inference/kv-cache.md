---
title: KV Cache
description: 自回归推理中的历史 K/V 缓存
tags: [attention, inference, memory]
order: 3
---

# KV Cache

自回归生成时，保留历史 token 的 K/V，可避免每一步重复计算这些投影。[Prefill](./prefill.md) 建立缓存，[Decode](./decode.md) 持续读取并追加。

## 在系统中的位置

`request → scheduler → model executor → attention → KV Cache → decode`

## 工程检查点

缓存占用由层数、序列长度、K/V head 数、head dimension 与元素精度共同决定。分析实现时，要分清逻辑 token 位置与物理存储位置；后者可能由 [PagedAttention](../serving/paged-attention.md) 的块表管理。

## 相关

[GQA](../foundations/gqa.md) 改变 K/V head 数；[Prefix Cache](../serving/prefix-cache.md) 关注共享前缀的复用。
