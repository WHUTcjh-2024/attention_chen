---
title: Prefill Attention
description: 输入序列的 Attention 计算与初始 KV Cache
---

# Prefill Attention

Prefill 一次处理输入序列中的 token，计算它们的 Q、K、V，并为后续生成建立初始 KV Cache。

## 原分类中的方法

- **Full Sequence Attention**：对输入序列执行完整的注意力计算。
- **FlashAttention**：用分块与 Online Softmax 等方法优化 Dense Attention 的计算过程；对应 [Memory Efficient Attention](../architecture/memory-efficient.md)。
- **Chunk Attention**：将较长输入拆成块处理。

Prefill 通常更偏向计算密集；这是一种常见性能特征，实际瓶颈仍取决于序列长度、批量、模型和硬件。

**下一阶段：**[Decode Attention](./decode.md) 使用这里建立的 KV Cache 逐 token 生成。
