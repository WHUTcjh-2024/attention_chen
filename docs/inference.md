# Inference · 推理流程

把 Attention 放回真实 LLM execution path：`request → tokenizer → scheduler → batching → model executor → prefill → decode → sampling → response`。

## Training vs Inference

训练通常一次处理完整序列并保留中间激活用于反向传播；在线推理则围绕请求调度、KV Cache、逐 token decode、latency 与 throughput 展开。二者虽然调用相似的模型算子，但 workload 和 bottleneck 很不一样。

## Prefill / Decode

**Prefill** 一次处理 prompt 中的大量 token，矩阵规模大，更容易表现为 compute-bound；**Decode** 每轮通常只生成一个新 token，需要反复读取历史 KV，常见瓶颈更偏 memory bandwidth、调度与 kernel launch overhead。

判断性能问题时必须先区分当前是在分析 prefill 还是 decode，否则很多结论会混在一起。

## Decoding Strategy

Greedy、sampling、beam search、speculative decoding 等策略发生在 logits 之后，但会反向影响 batch 行为、请求完成时间和服务系统的调度方式。

## Attention Execution Path

一次 decode 中与 Attention 最相关的路径可以简化为：

`current hidden state → Q/K/V projection → append K/V to cache → load historical K/V → attention kernel → output projection`

下一步可以结合 [KV Cache](/kv-cache) 和 [Kernels](/kernels) 分别看“数据放在哪里”和“GPU 上怎么计算”。
