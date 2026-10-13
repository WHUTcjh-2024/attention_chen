export type KnowledgeTone = 'blue' | 'violet' | 'green' | 'orange' | 'pink' | 'indigo'

export interface KnowledgeNode {
  id: string
  title: string
  link?: string
  tone?: KnowledgeTone
  related?: { title: string; link: string }[]
  children?: KnowledgeNode[]
}

export const knowledgeMap: KnowledgeNode = {
  id: 'attention',
  title: 'Attention',
  children: [
    {
      id: 'foundations',
      title: 'Foundations',
      tone: 'blue',
      children: [
        { id: 'self-attention', title: 'Self-Attention 基本公式' },
        { id: 'qkv', title: 'Q / K / V' },
        { id: 'mha-mqa-gqa', title: 'MHA / MQA / GQA' },
        { id: 'attention-variants', title: 'Attention 变体' }
      ]
    },
    {
      id: 'inference',
      title: 'Inference',
      tone: 'violet',
      children: [
        { id: 'train-infer', title: '训练 vs 推理' },
        { id: 'prefill-decode', title: 'Prefill / Decode' },
        { id: 'decoding', title: 'Decoding Strategy' },
        { id: 'attention-flow', title: 'Attention 计算流程' }
      ]
    },
    {
      id: 'kv-cache',
      title: 'KV Cache',
      tone: 'green',
      children: [
        { id: 'kv-mechanism', title: 'KV Cache 基本机制' },
        { id: 'paged', title: 'PagedAttention' },
        { id: 'prefix', title: 'Prefix Cache' },
        { id: 'memory', title: 'Memory Management' }
      ]
    },
    {
      id: 'kernels',
      title: 'Kernels',
      tone: 'orange',
      children: [
        { id: 'kernel-flow', title: 'Attention Kernel 计算流程' },
        { id: 'flash', title: 'FlashAttention' },
        { id: 'triton', title: 'Triton 实现' },
        { id: 'kernel-opt', title: '算子优化与性能分析' }
      ]
    },
    {
      id: 'serving',
      title: 'Serving',
      tone: 'pink',
      children: [
        { id: 'frameworks', title: 'vLLM / SGLang / TensorRT-LLM' },
        { id: 'batching', title: 'Continuous Batching' },
        { id: 'scheduler', title: '调度与内存管理' },
        { id: 'advanced-serving', title: '量化 / Speculative Decoding' }
      ]
    },
    {
      id: 'systems',
      title: 'Systems',
      tone: 'indigo',
      children: [
        { id: 'distributed', title: '分布式与多机推理' },
        { id: 'communication', title: 'NCCL / RDMA / InfiniBand' },
        { id: 'architecture', title: '推理系统架构' },
        { id: 'observability', title: '监控与可观测性' }
      ]
    }
  ]
}
