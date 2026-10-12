---
title: PyTorch
description: Attention 语义与算子对照
tags: [systems, pytorch]
order: 1
---

# PyTorch

用 PyTorch 明确输入形状、mask、dtype 和期望输出，再与 [CUDA](../kernels/cuda.md) 或 [Triton](../kernels/triton.md) 实现对照。

记录所用 PyTorch 版本与实际调用路径，避免把 Python 层 API 当作固定的底层 kernel。
