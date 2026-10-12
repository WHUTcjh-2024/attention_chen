---
title: MHA
description: Multi-Head Attention
tags: [attention, heads]
order: 3
---

# MHA

Multi-Head Attention 将表示拆分到多个 head 中分别计算 attention，再合并输出。阅读 kernel 时要确认 head 数、head dimension、Q/K/V 的布局与 causal mask。

## 对比

从 [MHA](./mha.md) 转向 [MQA](./mqa.md) 或 [GQA](./gqa.md)，关键变化是 query head 与 K/V head 的数量关系，这会影响 [KV Cache](../inference/kv-cache.md) 的存储与读取。
