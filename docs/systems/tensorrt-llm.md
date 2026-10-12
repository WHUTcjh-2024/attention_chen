---
title: TensorRT-LLM
description: 推理引擎的源码阅读入口
tags: [systems, inference]
order: 4
---

# TensorRT-LLM

从模型构建、运行时执行与 attention backend 三层分开阅读。先记录目标版本、模型配置和设备，再验证实际 dispatch、正确性与性能。
