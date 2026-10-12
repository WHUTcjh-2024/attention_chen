---
title: Naive Attention
description: Attention 的直接实现与正确性基线
tags: [kernels, attention]
order: 1
---

# Naive Attention

将 score、mask、softmax、与 V 相乘拆成明确步骤，便于检查形状和数值结果。作为优化基线时，应固定输入分布、dtype、mask 与容差。

## 对照

[FlashAttention](./flash-attention.md) 改变数据流和中间结果的存放方式。比较时要分别验证输出正确性和目标设备上的耗时，不要把减少内存访问直接当作实测加速。
