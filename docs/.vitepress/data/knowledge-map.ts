export interface KnowledgeTopic {
  title: string
  description: string
  link: string
  index: string
}

export interface KnowledgeBranch {
  title: string
  description: string
  link: string
  index: string
  topics: KnowledgeTopic[]
}

export const knowledgeMap: KnowledgeBranch[] = [
  {
    title: '按照模型结构分类',
    description: '关注 Attention 的数学形式、信息组织方式与长上下文计算。',
    link: '/architecture/',
    index: '01',
    topics: [
      {
        title: 'Standard Transformer Attention',
        description: '从 MHA 到 MQA、GQA，理解 KV 头如何共享。',
        link: '/architecture/standard-transformer',
        index: '01'
      },
      {
        title: 'Memory Efficient Attention',
        description: 'FlashAttention 优化计算，MLA 压缩 KV 存储。',
        link: '/architecture/memory-efficient',
        index: '02'
      },
      {
        title: 'Long Context Attention',
        description: '用稀疏或线性形式控制长序列的计算成本。',
        link: '/architecture/long-context',
        index: '03'
      },
      {
        title: 'Hybrid Architecture Attention',
        description: '组合 Dense、Sparse、Linear 与 SSM。',
        link: '/architecture/hybrid',
        index: '04'
      }
    ]
  },
  {
    title: '按照推理阶段分类',
    description: '关注一次请求从输入处理到逐 token 生成的执行过程。',
    link: '/runtime/',
    index: '02',
    topics: [
      {
        title: 'Prefill Attention',
        description: '处理输入序列，生成初始 KV Cache。',
        link: '/runtime/prefill',
        index: '01'
      },
      {
        title: 'Decode Attention',
        description: '逐 token 生成，读取并追加 KV Cache。',
        link: '/runtime/decode',
        index: '02'
      }
    ]
  }
]
