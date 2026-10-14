---
title: Long Context Attention
description: Sparse Attention 与 Linear Attention 的长序列路径
---

# Long Context Attention

序列变长时，完整的 token 两两交互会带来更高成本。原分类在这里列出两条路径：**减少参与计算的位置**，或**改变注意力的计算形式**。

## Sparse Attention

Sparse Attention 不再让每个位置关注全部位置，常见范围包括：

- **Block Sparse**：按块选择参与计算的位置。
- **Sliding Window**：主要关注邻近位置。
- **Top-K Sparse**：选择部分重要位置。

它直接改变关注范围；具体稀疏模式决定哪些信息可以交互。

## Linear Attention

Linear Attention 通过 Feature Map 等形式避免显式构造 `T × T` 注意力矩阵。Recurrent State 则把历史信息汇入可持续更新的状态，适合从 [Decode](../runtime/decode.md) 的角度理解。

原笔记列出的具体方法有：Kernel Linear Attention、Feature Map Attention、Recurrent Linear Attention、Gated Linear Attention（GLA）、Retention Attention（RetNet）、Delta Rule Attention、DeltaNet 和 KDA。

这里的运算形式不是把含 Softmax 的标准注意力表达式直接交换括号；Feature Map 和状态更新属于新的计算定义。

继续阅读：[Hybrid Architecture Attention](./hybrid.md) 组合不同计算形式。
