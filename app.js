const tree = {
  id: 'attention',
  title: 'Attention',
  description: '注意力机制',
  children: [
    {
      id: 'architecture',
      title: '模型结构',
      description: '数学形式、信息组织与长上下文',
      children: [
        {
          id: 'standard',
          title: 'Standard Transformer Attention',
          description: 'Q、K、V 与 KV 头共享',
          children: [
            { id: 'mha', title: 'MHA', description: '每个 Query 头对应一组 KV' },
            { id: 'mqa', title: 'MQA', description: '多个 Query 头共享一组 KV' },
            { id: 'gqa', title: 'GQA', description: '一组 Query 头共享一组 KV' }
          ]
        },
        {
          id: 'efficient',
          title: 'Memory Efficient Attention',
          description: '计算优化与 KV 存储压缩',
          children: [
            { id: 'flash', title: 'FlashAttention', description: '分块计算与 Online Softmax' },
            { id: 'mla', title: 'MLA', description: '压缩并缓存 KV latent' }
          ]
        },
        {
          id: 'long-context',
          title: 'Long Context Attention',
          description: '降低长序列计算成本',
          children: [
            { id: 'sparse', title: 'Sparse Attention', description: '只关注选定位置或区块' },
            { id: 'linear', title: 'Linear Attention', description: '改变计算形式，避免显式 T × T 矩阵' }
          ]
        },
        {
          id: 'hybrid',
          title: 'Hybrid Architecture Attention',
          description: '组合不同计算机制',
          children: [
            { id: 'dense-linear', title: 'Dense + Linear', description: '混合精确与线性注意力' },
            { id: 'dense-sparse', title: 'Dense + Sparse', description: '混合全局与选择性关注' },
            { id: 'attention-ssm', title: 'Attention + SSM', description: '结合注意力与状态空间模型' }
          ]
        }
      ]
    },
    {
      id: 'runtime',
      title: '推理阶段',
      description: '一次请求从输入到逐 token 生成',
      children: [
        {
          id: 'prefill',
          title: 'Prefill Attention',
          description: '处理输入，建立初始 KV Cache',
          children: [
            { id: 'full-sequence', title: 'Full Sequence Attention', description: '处理完整输入序列' },
            { id: 'chunk', title: 'Chunk Attention', description: '按块处理较长输入' },
            { id: 'prefill-flash', title: 'FlashAttention', description: '优化 Dense Attention 计算' }
          ]
        },
        {
          id: 'decode',
          title: 'Decode Attention',
          description: '逐 token 生成，读取并追加 KV Cache',
          children: [
            { id: 'kv-cache', title: 'KV Cache Attention', description: '复用历史 K、V' },
            { id: 'paged', title: 'PagedAttention', description: '分块管理 KV Cache' },
            { id: 'sparse-decode', title: 'Sparse Decode', description: '选择性读取上下文' },
            { id: 'batching', title: 'Continuous Batching', description: '连续调度多个生成请求' }
          ]
        }
      ]
    }
  ]
}

const expandableIds = new Set()

function collectExpandable(node) {
  if (!node.children) return
  expandableIds.add(node.id)
  node.children.forEach(collectExpandable)
}

collectExpandable(tree)

const expanded = new Set(['attention', 'architecture', 'runtime'])
const map = document.querySelector('#mind-map')

function renderNode(node, depth) {
  const item = document.createElement('li')
  item.className = 'tree-item'

  const hasChildren = Boolean(node.children?.length)
  const isExpanded = hasChildren && expanded.has(node.id)
  const card = document.createElement(hasChildren ? 'button' : 'div')
  card.className = `node node-level-${Math.min(depth, 3)}${hasChildren ? ' node-clickable' : ' node-leaf'}`

  if (hasChildren) {
    card.type = 'button'
    card.dataset.nodeId = node.id
    card.setAttribute('aria-expanded', String(isExpanded))
    card.setAttribute('aria-label', `${node.title}，${isExpanded ? '收起' : '展开'}子节点`)
  }

  const copy = document.createElement('span')
  copy.className = 'node-copy'

  const title = document.createElement('strong')
  title.className = 'node-title'
  title.textContent = node.title
  copy.append(title)

  if (node.description) {
    const description = document.createElement('span')
    description.className = 'node-description'
    description.textContent = node.description
    copy.append(description)
  }

  card.append(copy)

  const symbol = document.createElement('span')
  symbol.className = hasChildren ? 'node-toggle' : 'node-end'
  symbol.setAttribute('aria-hidden', 'true')
  symbol.textContent = hasChildren ? (isExpanded ? '−' : '+') : '•'
  card.append(symbol)
  item.append(card)

  if (hasChildren && isExpanded) {
    const children = document.createElement('ul')
    children.id = `children-${node.id}`
    children.className = 'tree-level'
    node.children.forEach((child) => children.append(renderNode(child, depth + 1)))
    item.append(children)
  }

  return item
}

function render(focusId) {
  const list = document.createElement('ul')
  list.className = 'tree-level tree-root'
  list.append(renderNode(tree, 0))
  map.replaceChildren(list)

  if (focusId) {
    map.querySelector(`[data-node-id="${focusId}"]`)?.focus({ preventScroll: true })
  }
}

map.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-node-id]')
  if (!button) return

  const id = button.dataset.nodeId
  if (expanded.has(id)) expanded.delete(id)
  else expanded.add(id)
  render(id)
})

document.querySelector('#expand-all').addEventListener('click', () => {
  expandableIds.forEach((id) => expanded.add(id))
  render()
})

document.querySelector('#collapse-all').addEventListener('click', () => {
  expanded.clear()
  expanded.add(tree.id)
  render()
})

render()
