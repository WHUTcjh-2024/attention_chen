# Serving · 推理服务

Serving 层负责把单次模型执行变成能够承载大量真实请求的系统：调度、batching、KV Cache 管理、请求生命周期与性能指标都在这里交汇。

## 推理框架

vLLM、SGLang、TensorRT-LLM 的实现细节不同，但都可以沿统一路径阅读：`API/request → scheduler → batch → model executor → KV/cache manager → kernels → sampling`。

## Continuous Batching

Continuous Batching 不等待整个 batch 一起结束，而是在 decode iteration 边界持续移入、移出请求，从而提升 GPU 利用率与请求吞吐。

## 调度与内存管理

Scheduler 的决策会同时受 token budget、KV Cache capacity、请求优先级、prefill/decode workload 和并发目标影响。出现 latency 抖动时，要把 queueing time 与真正的 GPU execution time 分开。

## 进阶优化

Quantization 主要压缩权重/激活/KV 的表示成本；Speculative Decoding 尝试在一次验证中接受多个 token。评价它们时分别观察吞吐、TTFT、TPOT、显存与额外计算/验证开销。
