---
title: Prefill
description: 输入序列的首次计算
tags: [inference, attention]
order: 1
---

# Prefill

Prefill 对输入 prompt 建立初始状态，并产生后续 [Decode](./decode.md) 所需的 [KV Cache](./kv-cache.md)。

## 观察点

记录 prompt 长度、batch、首 token 延迟，以及 attention kernel 的实际选择。它与单步 decode 的输入形状不同，benchmark 应分开记录。
