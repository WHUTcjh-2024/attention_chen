---
title: FlashAttention
description: IO 感知的精确 Attention 算法
tags: [kernels, attention, memory]
order: 2
---

# FlashAttention

FlashAttention 通过分块计算和在线 softmax，减少 attention 中间矩阵往返高带宽内存的读写。它仍计算精确 attention，而非近似注意力。

## 阅读路径

先看 [Naive Attention](./naive-attention.md) 的数据流，再跟踪 Q/K/V tile、softmax 的归一化状态和输出累加。评估性能时记录序列长度、head dimension、dtype、mask、GPU 与具体实现版本。

参考：[FlashAttention 论文](https://arxiv.org/abs/2205.14135)。
