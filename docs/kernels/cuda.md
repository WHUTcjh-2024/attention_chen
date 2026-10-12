---
title: CUDA
description: GPU kernel 实现与验证入口
tags: [kernels, cuda]
order: 3
---

# CUDA

阅读 CUDA attention kernel 时，先画清线程块负责的输出区域，再检查全局内存访问、共享内存布局、同步与边界条件。

## 验证顺序

从小形状的正确性开始，覆盖非整除 tile、不同 mask 和 dtype；再在目标 GPU 上做 benchmark 与 profiling。记录编译目标架构和实际运行设备。
