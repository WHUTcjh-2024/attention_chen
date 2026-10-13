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
      link: '/foundations',
      tone: 'blue',
      children: [
        { id: 'self-attention', title: 'Self-Attention 基本公式', link: '/foundations#self-attention' },
        { id: 'qkv', title: 'Q / K / V', link: '/foundations#q-k-v' },
        { id: 'mha-mqa-gqa', title: 'MHA / MQA / GQA', link: '/foundations#mha-mqa-gqa' },
        { id: 'attention-variants', title: 'Attention 变体', link: '/foundations#attention-variants' }
      ]
    },
    {
      id: 'inference',
      title: 'Inference',
      link: '/inference',
      tone: 'violet',
      children: [
        { id: 'train-infer', title: '训练 vs 推理', link: '/inference#training-vs-inference' },
        { id: 'prefill-decode', title: 'Prefill / Decode', link: '/inference#prefill-decode' },
        { id: 'decoding', title: 'Decoding Strategy', link: '/inference#decoding-strategy' },
        { id: 'attention-flow', title: 'Attention 计算流程', link: '/inference#attention-execution-path' }
      ]
    },
    {
      id: 'kv-cache',
      title: 'KV Cache',
      link: '/kv-cache',
      tone: 'green',
      children: [
        { id: 'kv-mechanism', title: 'KV Cache 基本机制', link: '/kv-cache#基本机制' },
        { id: 'paged', title: 'PagedAttention', link: '/kv-cache#pagedattention' },
        { id: 'prefix', title: 'Prefix Cache', link: '/kv-cache#prefix-cache' },
        { id: 'memory', title: 'Memory Management', link: '/kv-cache#memory-management' }
      ]
    },
    {
      id: 'kernels',
      title: 'Kernels',
      link: '/kernels',
      tone: 'orange',
      children: [
        { id: 'kernel-flow', title: 'Attention Kernel 计算流程', link: '/kernels#attention-kernel' },
        { id: 'flash', title: 'FlashAttention', link: '/kernels#flashattention' },
        { id: 'triton', title: 'Triton 实现', link: '/kernels#triton' },
        { id: 'kernel-opt', title: '算子优化与性能分析', link: '/kernels#性能分析' }
      ]
    },
    {
      id: 'serving',
      title: 'Serving',
      link: '/serving',
      tone: 'pink',
      children: [
        { id: 'frameworks', title: 'vLLM / SGLang / TensorRT-LLM', link: '/serving#推理框架' },
        { id: 'batching', title: 'Continuous Batching', link: '/serving#continuous-batching' },
        { id: 'scheduler', title: '调度与内存管理', link: '/serving#调度与内存管理' },
        { id: 'advanced-serving', title: '量化 / Speculative Decoding', link: '/serving#进阶优化' }
      ]
    },
    {
      id: 'systems',
      title: 'Systems',
      link: '/systems',
      tone: 'indigo',
      children: [
        { id: 'distributed', title: '分布式与多机推理', link: '/systems#分布式与多机推理' },
        { id: 'communication', title: 'NCCL / RDMA / InfiniBand', link: '/systems#通信' },
        { id: 'architecture', title: '推理系统架构', link: '/systems#推理系统架构' },
        { id: 'observability', title: '监控与可观测性', link: '/systems#监控与可观测性' }
      ]
    }
  ]
}
