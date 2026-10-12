---
title: PagedAttention
description: 大模型服务中的分页 KV Cache 管理
tags: [serving, kv-cache]
order: 1
---

# PagedAttention

PagedAttention 将逻辑连续的 [KV Cache](../inference/kv-cache.md) 映射到物理块，减少服务时因连续分配造成的内存浪费。阅读实现时区分块表、块分配与 attention kernel 中的地址计算。

## 系统关联

[Prefill](../inference/prefill.md) 写入初始 K/V；[Decode](../inference/decode.md) 读取并追加。请求调度由 [Continuous Batching](./continuous-batching.md) 处理，缓存分配与调度共同影响可并发的请求数。

参考：[vLLM / PagedAttention 论文](https://arxiv.org/abs/2309.06180)。
