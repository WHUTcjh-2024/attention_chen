# Systems · 系统实现

当单卡已经不够时，Attention 与 KV Cache 会进入多 GPU / 多节点系统：并行策略、通信拓扑、网络与可观测性开始决定端到端性能。

## 分布式与多机推理

常见并行方式包括 TP、PP、DP、EP、CP。先明确每种并行“切的是什么 tensor / layer / request / expert / context”，再追踪它引入了哪些 collective communication。

## 通信

NCCL 提供 GPU collective；底层链路可能是 NVLink / NVSwitch、PCIe、RDMA / InfiniBand 或 Ethernet。分析通信瓶颈时，需要把消息大小、collective 类型、拓扑和 compute-communication overlap 一起看。

## 推理系统架构

系统级 execution path 可以继续向下展开为：`runtime → CUDA → GPU kernels → HBM → NCCL → interconnect → remote GPU/node`。Prefill-Decode 分离、disaggregated serving 等设计通常就是在这条链路上重新放置计算和状态。

## 监控与可观测性

服务侧至少同时观察 request throughput、tokens/s、TTFT、TPOT/ITL、p50/p95/p99、queue depth、GPU/SM/HBM、KV Cache utilization 与 NCCL/network bandwidth。没有 workload 与 baseline，不直接下优化结论。
