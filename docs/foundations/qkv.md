---
title: Q / K / V
description: Attention 的输入张量与 head 维度
tags: [attention, tensor-shape]
order: 2
---

# Q / K / V

Q（query）决定当前 token 查询什么，K（key）用于匹配，V（value）提供加权后的内容。阅读实现时先写清 batch、sequence、head、head dimension 四个维度，再核对转置与广播。

## 推理时的形状

[Prefill](../inference/prefill.md) 通常同时处理多个 query；[Decode](../inference/decode.md) 通常每步处理新 token 的 query，并读取历史 [KV Cache](../inference/kv-cache.md)。具体布局以所读实现为准。

## 相关

[MHA](./mha.md) 为不同 query head 提供对应的 K/V head；[MQA](./mqa.md) 与 [GQA](./gqa.md) 改变这种对应关系。
