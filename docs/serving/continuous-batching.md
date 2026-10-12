---
title: Continuous Batching
description: 生成服务中的动态请求批处理
tags: [serving, scheduling]
order: 2
---

# Continuous Batching

服务系统可在生成过程中让请求进入、继续或退出执行批次。分析时把调度策略与模型 kernel 分开：前者决定哪些请求本轮执行，后者执行这些请求的计算。

## 观察点

同时记录首 token 延迟、token 间延迟、吞吐量，以及 [KV Cache](../inference/kv-cache.md) 的内存压力；这些指标可能互相牵制。
