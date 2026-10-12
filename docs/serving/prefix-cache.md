---
title: Prefix Cache
description: 共享前缀的计算复用
tags: [serving, caching]
order: 3
---

# Prefix Cache

多个请求若拥有相同的前缀，服务系统可以复用已经计算的部分状态。需要检查匹配粒度、缓存生命周期、内存回收，以及前缀相同但请求后续不同的隔离边界。

它依赖 [KV Cache](../inference/kv-cache.md) 的存储管理；具体实现与命中条件应以目标系统代码为准。
