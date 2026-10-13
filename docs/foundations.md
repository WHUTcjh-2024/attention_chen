# Foundations · Attention 基础

这一页只保留后续理解推理系统所必需的 Attention 基础：**Q/K/V、Scaled Dot-Product Attention、MHA/MQA/GQA，以及常见 Attention 变体**。

## Self-Attention

对当前 token 的表示做线性投影得到 `Q`、`K`、`V`，使用 `QKᵀ` 计算相关性，再经过 scale、mask、softmax 后对 `V` 做加权求和。

$$
\mathrm{Attention}(Q,K,V)=\mathrm{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V
$$

工程上最重要的是把它看成两段：**score 计算 (`QKᵀ`)** 和 **value 聚合 (`PV`)**。FlashAttention 等 Kernel 优化主要改变这两段之间的数据搬运与中间结果物化方式。

## Q / K / V

- **Q (Query)**：当前 token 想从上下文中查询什么。
- **K (Key)**：历史 token 用什么特征参与匹配。
- **V (Value)**：匹配之后真正被聚合的信息。

在 autoregressive decode 中，新 token 只产生一组新的 Q/K/V；历史 K/V 通常直接从 [KV Cache](/kv-cache/) 读取。

## MHA / MQA / GQA

**MHA** 为每个 attention head 保存独立的 K/V；**MQA** 让多个 query head 共用一组 K/V；**GQA** 位于两者之间，让一组 query heads 共享一组 K/V。

推理时这个差异直接影响 KV Cache 大小、HBM 访问量和 decode 阶段的 memory bandwidth 压力。

## Attention Variants

后续遇到 RoPE、ALiBi、Sliding Window Attention、Sparse Attention 时，先判断它改变的是：位置编码、可见 token 范围、score 计算，还是 KV 的存储与访问方式。没有必要一开始把所有变体逐个学完。
