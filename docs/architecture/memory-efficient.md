---
title: Memory Efficient Attention
description: FlashAttention 的计算优化与 MLA 的 KV 压缩
---

# Memory Efficient Attention

原分类把 **FlashAttention** 和 **MLA** 放在这一标题下。它们关注不同成本：前者优化 Dense Attention 的计算与数据搬运，后者优化 KV 的存储方式。

## FlashAttention

FlashAttention 使用分块计算，避免把完整的注意力矩阵反复写入和读出高带宽显存；它仍计算精确的 Dense Attention。

| 版本 | 原分类中的重点 |
| --- | --- |
| FlashAttention 1 | Tiling、Online Softmax，减少 HBM 访问并保持数学结果正确 |
| FlashAttention 2 | Block 并行、Warp 间工作划分，以及 Reduction、Softmax 效率 |
| FlashAttention 3 | Tensor Core、Warp Specialization、异步流水和 FP8 |
| FlashAttention 4 | 原笔记标为“待补充” |

分块不等于减少需要关注的 token 数量；想改变关注范围，可继续看 [Long Context Attention](./long-context.md) 中的 Sparse Attention。

## MLA

Multi-head Latent Attention（MLA）将 KV 信息压缩为低维 latent vector，并缓存该表示。它要解决的是 [KV Cache](../runtime/decode.md) 的容量与读取成本问题，属于模型结构设计，与 FlashAttention 的计算优化是不同维度。

在[按照推理阶段分类](../runtime/)中，FlashAttention 出现在 Prefill 条目，KV Cache 则连接 Prefill 与 Decode。
