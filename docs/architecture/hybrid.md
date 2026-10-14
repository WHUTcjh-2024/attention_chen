---
title: Hybrid Architecture Attention
description: Dense、Linear、Sparse 与 SSM 的组合方式
---

# Hybrid Architecture Attention

这一分类不指向单独一种注意力公式，而是把不同机制组合在同一架构中。原笔记列出三个方向：

| 组合 | 连接的主题 |
| --- | --- |
| Dense + Linear | [标准 Dense Attention](./standard-transformer.md) 与 [Linear Attention](./long-context.md) |
| Dense + Sparse | 标准 Dense Attention 与 [Sparse Attention](./long-context.md) |
| Attention + SSM | Attention 与状态空间模型 |

判断一种混合结构时，可以依次问：各层分别使用什么机制、信息在层间如何传递、[Prefill](../runtime/prefill.md) 与 [Decode](../runtime/decode.md) 的执行成本如何变化。原笔记尚未展开具体模型实例，这里先保留分类位置。
