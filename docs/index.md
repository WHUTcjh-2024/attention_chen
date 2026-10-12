---
layout: home
title: Attention 工程知识库
description: 从 Attention 基础到大模型推理优化的工程知识库

hero:
  name: Attention Engineering
  text: 从注意力机制走到真实推理系统
  tagline: 围绕 execution path 理解 Q/K/V、KV Cache、GPU Kernel、Serving 与分布式推理，用实验、benchmark 和源码建立工程 mental model。
  actions:
    - theme: brand
      text: 从 Attention 开始
      link: /foundations/attention
    - theme: alt
      text: 查看 Knowledge Map
      link: /map/
    - theme: alt
      text: 浏览实验记录
      link: /experiments/

features:
  - title: Foundations
    details: 从 Q / K / V、MHA、MQA、GQA 出发，建立 Attention 的张量形状、数据流与计算直觉。
    link: /foundations/attention
    linkText: 进入基础主线
  - title: Inference Path
    details: 沿 Prefill → Decode → KV Cache 理解一个 request 在大模型推理阶段如何真正执行。
    link: /inference/
    linkText: 查看推理链路
  - title: GPU Kernels
    details: 从 Naive Attention 到 FlashAttention、CUDA 与 Triton，关注 IO、tiling、带宽和 kernel 边界。
    link: /kernels/
    linkText: 进入算子层
  - title: Serving Systems
    details: 理解 PagedAttention、Continuous Batching、Prefix Cache，以及吞吐、延迟与显存之间的 trade-off。
    link: /serving/
    linkText: 进入 Serving
  - title: Distributed Inference
    details: 把 TP / PP / EP、NCCL 与跨 GPU 通信放回完整 execution path 中理解，而不是孤立记概念。
    link: /distributed/
    linkText: 查看分布式
  - title: Experiments & Papers
    details: 用 benchmark、profiling、最小实验和论文阅读验证性能判断，沉淀可复用的工程结论。
    link: /experiments/
    linkText: 查看实验入口
---

<div class="home-shell">
  <section class="home-section home-section--path">
    <div class="home-section__heading">
      <span class="home-kicker">EXECUTION PATH</span>
      <h2>把知识放回一条真实执行链路</h2>
      <p>不是按名词背诵，而是追踪 request、tensor、cache 和 kernel 在系统里的位置与相互影响。</p>
    </div>

    <div class="execution-path">
      <a class="path-node" href="./foundations/qkv">
        <span class="path-node__index">01</span>
        <strong>Q / K / V</strong>
        <small>张量与 Attention 输入</small>
      </a>
      <span class="path-arrow">→</span>
      <a class="path-node" href="./inference/prefill">
        <span class="path-node__index">02</span>
        <strong>Prefill</strong>
        <small>处理完整输入序列</small>
      </a>
      <span class="path-arrow">→</span>
      <a class="path-node" href="./inference/kv-cache">
        <span class="path-node__index">03</span>
        <strong>KV Cache</strong>
        <small>保存历史 K / V</small>
      </a>
      <span class="path-arrow">→</span>
      <a class="path-node" href="./inference/decode">
        <span class="path-node__index">04</span>
        <strong>Decode</strong>
        <small>逐 token 生成</small>
      </a>
      <span class="path-arrow">→</span>
      <a class="path-node" href="./serving/continuous-batching">
        <span class="path-node__index">05</span>
        <strong>Serving</strong>
        <small>调度、批处理与吞吐</small>
      </a>
    </div>
  </section>

  <section class="home-section">
    <div class="home-section__heading">
      <span class="home-kicker">ENGINEERING LOOP</span>
      <h2>所有性能结论都应该能被验证</h2>
      <p>这套知识库更关心“如何证明”，而不是只记录“是什么”。</p>
    </div>

    <div class="engineering-loop">
      <div class="loop-card">
        <span>01</span>
        <h3>Baseline</h3>
        <p>先明确 workload、correctness 和基准性能。</p>
      </div>
      <div class="loop-card">
        <span>02</span>
        <h3>Observe</h3>
        <p>从 latency、throughput、显存、GPU 与通信行为缩小范围。</p>
      </div>
      <div class="loop-card">
        <span>03</span>
        <h3>Hypothesis</h3>
        <p>针对 bottleneck 提出可证伪的最小假设。</p>
      </div>
      <div class="loop-card">
        <span>04</span>
        <h3>Experiment</h3>
        <p>控制变量修改实现或配置，再次 benchmark / profile。</p>
      </div>
    </div>
  </section>

  <section class="home-section home-start">
    <div>
      <span class="home-kicker">START HERE</span>
      <h2>第一次进入，建议先抓主干</h2>
      <p>先理解 Attention → Prefill / Decode → KV Cache，再进入 FlashAttention、PagedAttention 和 Serving。</p>
    </div>
    <div class="home-start__actions">
      <a class="home-link home-link--primary" href="./foundations/attention">开始主线</a>
      <a class="home-link" href="./map/">打开知识地图</a>
    </div>
  </section>
</div>
