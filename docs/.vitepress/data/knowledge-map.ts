export interface KnowledgeNode {
  id: string
  title: string
  link?: string
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
      children: [
        { id: 'qkv', title: 'Q / K / V' },
        { id: 'mha', title: 'MHA' },
        { id: 'mqa', title: 'MQA' },
        { id: 'gqa', title: 'GQA' }
      ]
    },
    {
      id: 'inference',
      title: 'Inference',
      children: [
        { id: 'prefill', title: 'Prefill' },
        { id: 'decode', title: 'Decode' },
        { id: 'kv-cache', title: 'KV Cache' }
      ]
    },
    {
      id: 'kernels',
      title: 'Kernels',
      children: [
        { id: 'naive', title: 'Naive Attention' },
        { id: 'flash', title: 'FlashAttention' },
        { id: 'cuda', title: 'CUDA' },
        { id: 'triton', title: 'Triton' }
      ]
    },
    {
      id: 'serving',
      title: 'Serving',
      children: [
        { id: 'paged', title: 'PagedAttention' },
        { id: 'batching', title: 'Continuous Batching' },
        { id: 'prefix', title: 'Prefix Cache' }
      ]
    },
    {
      id: 'systems',
      title: 'Systems',
      children: [
        { id: 'pytorch', title: 'PyTorch' },
        { id: 'vllm', title: 'vLLM' },
        { id: 'sglang', title: 'SGLang' },
        { id: 'tensorrt-llm', title: 'TensorRT-LLM' }
      ]
    }
  ]
}
