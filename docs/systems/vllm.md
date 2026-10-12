---
title: vLLM
description: 大模型服务系统的源码阅读入口
tags: [systems, serving]
order: 2
---

# vLLM

源码阅读从请求、调度、模型执行到 attention backend 逐层追踪。将 [PagedAttention](../serving/paged-attention.md) 的逻辑块映射与实际 kernel 实现分开记录。

笔记应注明代码版本、入口文件、关键调用链、测试和运行环境；性能结论需要目标硬件测量。
