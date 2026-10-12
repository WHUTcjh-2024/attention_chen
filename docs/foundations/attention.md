---
title: Attention
description: Scaled dot-product attention 的计算边界
tags: [attention, foundations]
order: 1
---

# Attention

Scaled dot-product attention 根据 Q 与 K 的相似度给 V 加权。计算形式为 `softmax(QKᵀ / √dₖ)V`；实际实现还要处理 mask、布局、精度与批维。

## 工程边界

一次 Attention 计算涉及输入投影、score、softmax、与 V 相乘。推理中还要区分 [Prefill](../inference/prefill.md) 和 [Decode](../inference/decode.md)：两者的 query 长度与访存形态不同。

## 延伸

- [Q / K / V](./qkv.md)：形状和数据流。
- [Naive Attention](../kernels/naive-attention.md)：直接实现的基线。
- [FlashAttention](../kernels/flash-attention.md)：减少中间结果的外存读写。

参考：[Attention Is All You Need](https://arxiv.org/abs/1706.03762)。
