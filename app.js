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

const nodes = new Map()
const parents = new Map()
const expandableIds = new Set()

function indexTree(node, parent = null) {
  nodes.set(node.id, node)
  if (parent) parents.set(node.id, parent.id)
  if (node.children?.length) {
    expandableIds.add(node.id)
    node.children.forEach((child) => indexTree(child, node))
  }
}

indexTree(tree)

const expanded = new Set(['attention', 'architecture', 'runtime', 'standard', 'decode'])
let selectedId = tree.id
const map = document.querySelector('#mind-map')
const scroller = document.querySelector('#map-scroll')
const outline = document.querySelector('#outline')
const search = document.querySelector('#node-search')
const searchResults = document.querySelector('#search-results')
const svgNamespace = 'http://www.w3.org/2000/svg'

function icon(name) {
  const svg = document.createElementNS(svgNamespace, 'svg')
  svg.classList.add('icon')
  svg.setAttribute('aria-hidden', 'true')
  const use = document.createElementNS(svgNamespace, 'use')
  use.setAttribute('href', `#icon-${name}`)
  svg.append(use)
  return svg
}

function drawConnector() {
  const svg = map.querySelector('.map-connectors')
  if (!svg) return
  svg.replaceChildren()
  if (window.matchMedia('(max-width: 760px)').matches) return

  const root = map.querySelector('.node-level-0')
  const branches = [...map.querySelectorAll('.node-level-1')]
  if (!root || !branches.length) return

  const mapRect = map.getBoundingClientRect()
  const centerX = (rect) => rect.left + rect.width / 2 - mapRect.left
  const rootRect = root.getBoundingClientRect()
  const branchRects = branches.map((branch) => branch.getBoundingClientRect())
  const startY = rootRect.bottom - mapRect.top
  const endY = branchRects[0].top - mapRect.top
  const junctionY = startY + (endY - startY) / 2
  const xValues = branchRects.map(centerX)
  const segments = [`M ${centerX(rootRect)} ${startY} V ${junctionY}`]
  if (xValues.length > 1) segments.push(`M ${xValues[0]} ${junctionY} H ${xValues.at(-1)}`)
  xValues.forEach((x) => segments.push(`M ${x} ${junctionY} V ${endY}`))

  svg.setAttribute('viewBox', `0 0 ${mapRect.width} ${mapRect.height}`)
  const path = document.createElementNS(svgNamespace, 'path')
  path.setAttribute('d', segments.join(' '))
  svg.append(path)
}

function renderNode(node, depth) {
  const item = document.createElement('li')
  item.className = `tree-item${depth === 1 ? ` lane lane-${node.id}` : ''}`
  const hasChildren = Boolean(node.children?.length)
  const isExpanded = hasChildren && expanded.has(node.id)
  const card = document.createElement(hasChildren ? 'button' : 'div')
  card.className = `node node-level-${Math.min(depth, 3)}${hasChildren ? ' node-clickable' : ' node-leaf'}${selectedId === node.id ? ' is-selected' : ''}`
  card.dataset.nodeId = node.id

  if (hasChildren) {
    card.type = 'button'
    card.setAttribute('aria-expanded', String(isExpanded))
    if (isExpanded) card.setAttribute('aria-controls', `children-${node.id}`)
    card.setAttribute('aria-label', `${node.title}，${isExpanded ? '收起' : '展开'}子节点`)
  }

  const mark = document.createElement('span')
  mark.className = 'node-mark'
  mark.append(icon(depth === 0 ? 'book' : depth === 1 ? node.id === 'runtime' ? 'clock' : 'layers' : 'file'))
  card.append(mark)

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

  if (hasChildren) {
    const count = document.createElement('span')
    count.className = 'node-count'
    count.textContent = node.children.length
    count.setAttribute('aria-hidden', 'true')
    card.append(count)
    const toggle = document.createElement('span')
    toggle.className = 'node-toggle'
    toggle.textContent = isExpanded ? '−' : '+'
    toggle.setAttribute('aria-hidden', 'true')
    card.append(toggle)
  }
  item.append(card)

  if (isExpanded) {
    const children = document.createElement('ul')
    children.id = `children-${node.id}`
    children.className = 'tree-level'
    node.children.forEach((child) => children.append(renderNode(child, depth + 1)))
    item.append(children)
  }
  return item
}

function renderOutlineNode(node, depth = 0) {
  const item = document.createElement('li')
  item.className = 'outline-item'
  const row = document.createElement('div')
  row.className = `outline-row${selectedId === node.id ? ' is-current' : ''}`
  row.style.setProperty('--depth', depth)

  if (node.children?.length) {
    const toggle = document.createElement('button')
    toggle.type = 'button'
    toggle.className = 'outline-toggle'
    toggle.dataset.toggleId = node.id
    toggle.textContent = expanded.has(node.id) ? '⌄' : '›'
    toggle.setAttribute('aria-label', `${expanded.has(node.id) ? '收起' : '展开'}${node.title}`)
    row.append(toggle)
  } else {
    const spacer = document.createElement('span')
    spacer.className = 'outline-spacer'
    row.append(spacer)
  }

  const link = document.createElement('button')
  link.type = 'button'
  link.className = 'outline-link'
  link.dataset.selectId = node.id
  if (selectedId === node.id) link.setAttribute('aria-current', 'location')
  link.append(icon(depth < 2 ? 'map' : 'file'))
  const label = document.createElement('span')
  label.textContent = node.title
  link.append(label)
  row.append(link)
  item.append(row)

  if (node.children?.length && expanded.has(node.id)) {
    const children = document.createElement('ul')
    children.className = 'outline-children'
    node.children.forEach((child) => children.append(renderOutlineNode(child, depth + 1)))
    item.append(children)
  }
  return item
}

function updatePath() {
  document.querySelector('#current-path').textContent = selectedId === tree.id ? '知识导图' : nodes.get(selectedId).title
}

function render(focusId = null, scrollToId = null) {
  const list = document.createElement('ul')
  list.className = 'tree-level tree-root'
  list.append(renderNode(tree, 0))
  const svg = document.createElementNS(svgNamespace, 'svg')
  svg.classList.add('map-connectors')
  svg.setAttribute('aria-hidden', 'true')
  map.replaceChildren(svg, list)

  const outlineList = document.createElement('ul')
  outlineList.className = 'outline-list'
  outlineList.append(renderOutlineNode(tree))
  outline.replaceChildren(outlineList)
  updatePath()

  requestAnimationFrame(() => {
    drawConnector()
    if (scrollToId) map.querySelector(`[data-node-id="${scrollToId}"]`)?.scrollIntoView({ block: 'center', inline: 'center' })
    if (focusId) map.querySelector(`button[data-node-id="${focusId}"]`)?.focus({ preventScroll: true })
  })
}

function expandAncestors(id) {
  let parentId = parents.get(id)
  while (parentId) {
    expanded.add(parentId)
    parentId = parents.get(parentId)
  }
}

function selectNode(id) {
  if (!nodes.has(id)) return
  expandAncestors(id)
  selectedId = id
  render(null, id)
}

map.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-node-id]')
  if (!button) return
  const id = button.dataset.nodeId
  if (expanded.has(id)) expanded.delete(id)
  else expanded.add(id)
  selectedId = id
  render(id)
})

outline.addEventListener('click', (event) => {
  const toggle = event.target.closest('button[data-toggle-id]')
  if (toggle) {
    const id = toggle.dataset.toggleId
    if (expanded.has(id)) expanded.delete(id)
    else expanded.add(id)
    selectedId = id
    render()
    return
  }
  const link = event.target.closest('button[data-select-id]')
  if (link) selectNode(link.dataset.selectId)
})

document.querySelector('#expand-all').addEventListener('click', () => {
  expandableIds.forEach((id) => expanded.add(id))
  render()
})

document.querySelector('#collapse-all').addEventListener('click', () => {
  expanded.clear()
  expanded.add(tree.id)
  selectedId = tree.id
  render(null, tree.id)
})

function hideSearch() {
  searchResults.hidden = true
  search.setAttribute('aria-expanded', 'false')
}

function showSearch() {
  const query = search.value.trim().toLocaleLowerCase()
  searchResults.replaceChildren()
  if (!query) return hideSearch()

  const matches = [...nodes.values()].filter((node) =>
    `${node.title} ${node.description || ''}`.toLocaleLowerCase().includes(query)
  ).slice(0, 10)
  if (!matches.length) {
    const empty = document.createElement('p')
    empty.className = 'search-empty'
    empty.textContent = '没有找到匹配的节点'
    searchResults.append(empty)
  }
  for (const node of matches) {
    const button = document.createElement('button')
    button.type = 'button'
    button.dataset.searchId = node.id
    const title = document.createElement('strong')
    title.textContent = node.title
    const description = document.createElement('span')
    description.textContent = node.description || ''
    button.append(title, description)
    searchResults.append(button)
  }
  searchResults.hidden = false
  search.setAttribute('aria-expanded', 'true')
}

search.addEventListener('input', showSearch)
search.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') hideSearch()
  if (event.key === 'Enter') {
    const first = searchResults.querySelector('button[data-search-id]')
    if (first) {
      selectNode(first.dataset.searchId)
      hideSearch()
    }
  }
})
searchResults.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-search-id]')
  if (!button) return
  selectNode(button.dataset.searchId)
  hideSearch()
})
document.addEventListener('pointerdown', (event) => {
  if (!event.target.closest('.search-wrap')) hideSearch()
})
document.addEventListener('keydown', (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    search.focus()
    search.select()
  }
})

render()
window.addEventListener('resize', drawConnector)
document.fonts.ready.then(drawConnector)
