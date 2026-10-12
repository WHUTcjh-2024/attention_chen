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
  link: '/foundations/attention.html',
  children: [
    {
      id: 'foundations',
      title: 'Foundations',
      link: '/foundations/',
      children: [
        { id: 'qkv', title: 'Q / K / V', link: '/foundations/qkv.html' },
        { id: 'mha', title: 'MHA', link: '/foundations/mha.html' },
        { id: 'mqa', title: 'MQA', link: '/foundations/mqa.html' },
        { id: 'gqa', title: 'GQA', link: '/foundations/gqa.html' }
      ]
    },
    {
      id: 'inference',
      title: 'Inference',
      link: '/inference/',
      children: [
        { id: 'prefill', title: 'Prefill', link: '/inference/prefill.html' },
        { id: 'decode', title: 'Decode', link: '/inference/decode.html' },
        {
          id: 'kv-cache',
          title: 'KV Cache',
          link: '/inference/kv-cache.html',
          related: [
            { title: 'PagedAttention', link: '/serving/paged-attention.html' },
            { title: 'Decode', link: '/inference/decode.html' }
          ]
        }
      ]
    },
    {
      id: 'kernels',
      title: 'Kernels',
      link: '/kernels/',
      children: [
        { id: 'naive', title: 'Naive Attention', link: '/kernels/naive-attention.html' },
        { id: 'flash', title: 'FlashAttention', link: '/kernels/flash-attention.html' },
        { id: 'cuda', title: 'CUDA', link: '/kernels/cuda.html' },
        { id: 'triton', title: 'Triton', link: '/kernels/triton.html' }
      ]
    },
    {
      id: 'serving',
      title: 'Serving',
      link: '/serving/',
      children: [
        {
          id: 'paged',
          title: 'PagedAttention',
          link: '/serving/paged-attention.html',
          related: [
            { title: 'KV Cache', link: '/inference/kv-cache.html' },
            { title: 'Decode', link: '/inference/decode.html' }
          ]
        },
        {
          id: 'batching',
          title: 'Continuous Batching',
          link: '/serving/continuous-batching.html'
        },
        { id: 'prefix', title: 'Prefix Cache', link: '/serving/prefix-cache.html' }
      ]
    },
    {
      id: 'systems',
      title: 'Systems',
      link: '/systems/',
      children: [
        { id: 'pytorch', title: 'PyTorch', link: '/systems/pytorch.html' },
        { id: 'vllm', title: 'vLLM', link: '/systems/vllm.html' },
        { id: 'sglang', title: 'SGLang', link: '/systems/sglang.html' },
        { id: 'tensorrt-llm', title: 'TensorRT-LLM', link: '/systems/tensorrt-llm.html' }
      ]
    }
  ]
}
