---
title: Attention 知识库
description: Attention 与大模型推理优化的工程笔记
aside: false
---

# Attention

大模型 Attention 与推理优化知识库。按系统对象查找概念、实现、实验与论文；每篇笔记保留可追溯的参考资料和相邻主题链接。

## Core Concepts

- [Attention](./foundations/attention.md) · 计算目标与基本公式
- [Q / K / V](./foundations/qkv.md) · 张量形状与输入输出
- [MHA](./foundations/mha.md) · 多头注意力
- [MQA](./foundations/mqa.md) · 共享 K/V
- [GQA](./foundations/gqa.md) · 分组 K/V

## Inference

- [Prefill](./inference/prefill.md) · 处理输入序列
- [Decode](./inference/decode.md) · 逐 token 生成
- [KV Cache](./inference/kv-cache.md) · 历史 K/V 的存储与读取

## Kernels

- [Naive Attention](./kernels/naive-attention.md) · 基线实现
- [FlashAttention](./kernels/flash-attention.md) · IO 感知的分块计算
- [CUDA](./kernels/cuda.md) / [Triton](./kernels/triton.md) · 实现路径

## Serving

- [PagedAttention](./serving/paged-attention.md) · KV Cache 的分页管理
- [Continuous Batching](./serving/continuous-batching.md) · 请求调度
- [Prefix Cache](./serving/prefix-cache.md) · 复用共享前缀

## Systems & Engineering

- [Systems](./systems/) · PyTorch、vLLM、SGLang、TensorRT-LLM
- [Distributed](./distributed/) · 跨设备通信与执行
- [Experiments](./experiments/) · 实验、benchmark、profiling
- [Papers](./papers/) · 论文阅读入口
- [Knowledge Map](./map/) · 查看概念之间的位置与关联
