---
title: Triton
description: Triton kernel 实现与验证入口
tags: [kernels, triton]
order: 4
---

# Triton

Triton 以 program 为单位组织 tile 计算。阅读 attention kernel 时，重点检查 program id 到张量区域的映射、mask、布局、数值精度和编译期参数。

## 对照

与 [CUDA](./cuda.md) 版本对照时，先确保同一算子语义与测试输入，再分别记录编译配置和目标设备的实测耗时。
