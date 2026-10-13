# KV Cache · 缓存机制

KV Cache 是大模型 autoregressive inference 的关键状态：它保存历史 token 的 Key / Value，使 decode 不必每一步都重新计算整个 prefix。

## 基本机制

在第 `t` 个 decode step，只计算当前 token 的 Q/K/V，将新的 K/V 追加到 cache；Attention 使用当前 Q 与历史 K/V 完成计算。

因此 KV Cache 同时影响 **显存容量、HBM 访问、batch capacity、调度策略和长上下文性能**。

## PagedAttention

PagedAttention 的核心不是改变 Attention 数学公式，而是改变 KV Cache 的内存管理方式：将逻辑连续的 token KV 映射到固定大小的物理 blocks/pages，减少连续大块显存分配带来的碎片和浪费。

在系统里重点追踪：logical block table、physical block、block allocation/free，以及 kernel 如何根据映射读取 KV。

## Prefix Cache

Prefix Cache 让多个请求复用相同前缀已经计算好的 KV。收益取决于 prefix 重复率、匹配粒度、cache 命中率和淘汰策略。

## Memory Management

排查 KV Cache 问题时优先观察：总显存、可用 KV blocks、cache utilization、请求 sequence length、并发量、block fragmentation 和 eviction。不要只看 GPU utilization。
