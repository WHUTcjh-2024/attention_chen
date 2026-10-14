---
title: Decode Attention
description: 逐 token 生成、KV Cache 与服务调度
---

# Decode Attention

Decode 每步生成一个新 token，读取已有 KV Cache，并将新 token 的 K、V 追加进去。随着上下文增长，缓存的读取和管理变得重要。

## 原分类中的方法

- **KV Cache Attention**：复用历史 K、V，避免每步重新计算全部历史投影。
- **PagedAttention**：以分块映射的方式管理和访问 KV Cache。
- **Sparse Decode Attention**：在 Decode 中只读取或计算选定的上下文位置；对应 [Long Context Attention](../architecture/long-context.md)。
- **Continuous Batching Attention**：原笔记列在此处；它主要描述多个生成请求的连续调度。

Decode 通常更偏向显存带宽或 KV 读取限制；具体瓶颈会随模型、上下文长度、并发量和硬件改变。

**与结构分类的连接：**[MHA、MQA、GQA](../architecture/standard-transformer.md) 和 [MLA](../architecture/memory-efficient.md) 决定 KV 的组织和容量；PagedAttention 则关注这些缓存如何被管理。
