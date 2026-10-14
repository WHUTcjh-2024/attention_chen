---
title: 按照模型结构分类
description: Attention 的数学形式、信息组织方式与长上下文计算
---

# 按照模型结构分类

这条主线回答：**模型如何组织 Q、K、V，以及序列中的哪些位置参与计算？** 按原始分类，下面有四个主题。

1. [Standard Transformer Attention](./standard-transformer.md)：MHA、MQA、GQA。
2. [Memory Efficient Attention](./memory-efficient.md)：FlashAttention 与 MLA。
3. [Long Context Attention](./long-context.md)：Sparse Attention 与 Linear Attention。
4. [Hybrid Architecture Attention](./hybrid.md)：多种结构的组合。

另一条主线是[按照推理阶段分类](../runtime/)，关注这些方法在 Prefill 和 Decode 中如何使用。
