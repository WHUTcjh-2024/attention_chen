---
title: GQA
description: Grouped-Query Attention
tags: [attention, kv-cache]
order: 5
---

# GQA

Grouped-Query Attention 将多个 query head 映射到同一个 K/V head；K/V head 数量通常介于 [MQA](./mqa.md) 与 [MHA](./mha.md) 之间。

## 实现检查点

检查 query head 到 K/V head 的分组关系，以及 [Decode](../inference/decode.md) 中缓存读取与 kernel 的 head 索引。不要只看模型配置中的 head 数，还要看实际张量布局。

参考：[GQA 论文](https://arxiv.org/abs/2305.13245)。
