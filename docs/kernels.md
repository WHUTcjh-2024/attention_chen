# Kernels · 算子优化

Kernel 层关注 Attention 如何真正落到 GPU 上执行。优化前先建立 `baseline → correctness → benchmark → profiler → hypothesis → change → benchmark again` 的闭环。

## Attention Kernel

Naive Attention 往往会显式产生 `QKᵀ` 的 score matrix，再执行 softmax 和 `PV`。真实高性能实现通常通过 tiling、fusion 和 online softmax 减少中间结果写回 HBM。

## FlashAttention

FlashAttention 的关键收益来自 **IO-aware**：把 Q/K/V 分块搬入更快的片上存储，在 block 内完成 score、softmax 与 value accumulation，避免完整 attention matrix 在 HBM 中反复读写。

## Triton

用 Triton 学 Attention 时优先关注 program id 如何映射到 tile、block pointer / load-store、mask、数据布局，以及一个 program 实际负责哪部分 Q/K/V。

## 性能分析

先用 Nsight Systems / PyTorch Profiler 判断时间花在 CPU、GPU、memcpy、kernel gap、NCCL 还是同步，再决定是否进入 Nsight Compute。进入 kernel 层后再看 memory bandwidth、Tensor Core、occupancy、stall、register pressure 和 shared memory。
