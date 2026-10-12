---
title: Profiling
description: 性能瓶颈定位
tags: [experiments, performance]
order: 2
---

# Profiling

先确认测量边界和实际运行的 kernel，再看耗时、访存、occupancy 等指标。将 profiler 观察与优化假设分开记录；改动后仍需用 [Benchmark](./benchmark.md) 验证。
