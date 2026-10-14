---
title: 按照推理阶段分类
description: 从 Prefill 到 Decode 理解 Attention 的执行过程
---

# 按照推理阶段分类

这条主线回答：**一次生成请求进行到哪一步，Attention 此时需要计算或读取什么？**

1. [Prefill Attention](./prefill.md)：处理输入序列，建立初始 KV Cache。
2. [Decode Attention](./decode.md)：逐 token 生成，读取并追加 KV Cache。

同一种方法可能同时出现在[模型结构分类](../architecture/)和某个推理阶段中。例如，FlashAttention 是计算优化方法，也可用于 Prefill。
