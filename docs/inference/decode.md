---
title: Decode
description: 自回归生成阶段
tags: [inference, kv-cache]
order: 2
---

# Decode

Decode 每一步生成新 token，并读取历史 [KV Cache](./kv-cache.md)。系统层面还要考虑多个请求的调度、完成与取消。

## 相邻主题

- [GQA](../foundations/gqa.md)：query head 与 K/V head 的对应关系。
- [PagedAttention](../serving/paged-attention.md)：服务系统管理历史 K/V 的方式。
- [Continuous Batching](../serving/continuous-batching.md)：不同请求在生成阶段如何共同执行。

## 度量

将每 token 延迟与吞吐量分别记录，并明确 batch、输入长度、输出长度和设备。
