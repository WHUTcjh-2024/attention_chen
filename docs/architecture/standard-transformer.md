---
title: Standard Transformer Attention
description: MHA、MQA 与 GQA 的 KV 头组织方式
---

# Standard Transformer Attention

标准缩放点积注意力从 Q、K、V 出发，计算分数、执行 Softmax，再对 V 加权：

<div class="attention-formula" aria-label="Attention 等于 softmax 括号 Q K 转置除以根号 d k 括号乘以 V">
  <span>Attention(Q, K, V)</span>
  <span>= softmax(QK<sup>T</sup> / √d<sub>k</sub>)V</span>
</div>

## MHA、MQA、GQA

| 方法 | Query 头与 KV 头的关系 | 关注点 |
| --- | --- | --- |
| MHA | 每个 Query 头有对应的 KV 头 | 标准多头结构 |
| MQA | 多个 Query 头共享一组 KV | 最大程度减少 KV 头数 |
| GQA | 一组 Query 头共享一组 KV | 位于 MHA 与 MQA 之间 |

这三个名称描述的是**模型结构**。KV 头数改变后，[Decode](../runtime/decode.md) 阶段需要读取的 KV Cache 大小也会改变。

## 张量与成本

以自注意力为例，Q、K、V 通常可表示为 `[B, H, T, d]` 一类的张量；`[B, H, T, T]` 描述的是每个头的注意力分数矩阵。直接构造完整分数矩阵时，序列长度为 `T` 的计算量和该矩阵的存储量都随 `T²` 增长。

接下来可读：[Memory Efficient Attention](./memory-efficient.md)，了解如何优化计算和 KV 存储。
