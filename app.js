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
const outline = document.querySelector('#outline')
const search = document.querySelector('#node-search')
const searchResults = document.querySelector('#search-results')
const svgNamespace = 'http://www.w3.org/2000/svg'

function drawConnector() {
  const svg = map.querySelector('.map-connectors')
  if (!svg) return
  svg.replaceChildren()

  if (window.matchMedia('(max-width: 760px)').matches) return

  const mapRect = map.getBoundingClientRect()
  const card = (id) => map.querySelector(`.node[data-node-id="${id}"]`)
  const centerX = (rect) => rect.left + rect.width / 2 - mapRect.left
  const topY = (rect) => rect.top - mapRect.top
  const bottomY = (rect) => rect.bottom - mapRect.top
  const addPath = (data, color) => {
    const path = document.createElementNS(svgNamespace, 'path')
    path.setAttribute('d', data)
    path.setAttribute('stroke', color)
    svg.append(path)
  }
  const addDot = (x, y, color) => {
    const dot = document.createElementNS(svgNamespace, 'circle')
    dot.setAttribute('cx', x)
    dot.setAttribute('cy', y)
    dot.setAttribute('r', '3.5')
    dot.setAttribute('fill', color)
    svg.append(dot)
  }
  const drawGroup = (parent, children, color) => {
    const parentCard = card(parent.id)
    const childCards = children.map((child) => card(child.id)).filter(Boolean)
    if (!parentCard || !childCards.length) return
    const parentRect = parentCard.getBoundingClientRect()
    const childRects = childCards.map((child) => child.getBoundingClientRect())
    const startX = centerX(parentRect)
    const startY = bottomY(parentRect)
    const childTops = childRects.map(topY)
    if (Math.max(...childTops) - Math.min(...childTops) > 30) {
      const railX = Math.min(...childRects.map((rect) => rect.left - mapRect.left)) - 12
      const endY = Math.max(...childRects.map((rect) => rect.top + rect.height / 2 - mapRect.top))
      let data = `M ${startX} ${startY} V ${startY + 12} H ${railX} V ${endY}`
      childRects.forEach((rect) => {
        const y = rect.top + rect.height / 2 - mapRect.top
        data += ` M ${railX} ${y} H ${rect.left - mapRect.left}`
      })
      addPath(data, color)
      childRects.forEach((rect) => addDot(rect.left - mapRect.left, rect.top + rect.height / 2 - mapRect.top, color))
      return
    }
    const endY = Math.min(...childTops)
    const junctionY = startY + (endY - startY) * .48
    const xs = childRects.map(centerX)
    let data = `M ${startX} ${startY} V ${junctionY}`
    if (xs.length > 1) data += ` M ${Math.min(...xs)} ${junctionY} H ${Math.max(...xs)}`
    childRects.forEach((rect) => {
      const x = centerX(rect)
      data += ` M ${x} ${junctionY} V ${topY(rect)}`
    })
    addPath(data, color)
    childRects.forEach((rect) => addDot(centerX(rect), topY(rect), color))
  }

  svg.setAttribute('viewBox', `0 0 ${mapRect.width} ${mapRect.height}`)

  const rootCard = card(tree.id)
  if (rootCard && expanded.has(tree.id)) {
    const branches = tree.children.filter((child) => card(child.id))
    if (branches.length) {
      const rootRect = rootCard.getBoundingClientRect()
      const branchRects = branches.map((branch) => card(branch.id).getBoundingClientRect())
      const startX = centerX(rootRect)
      const startY = bottomY(rootRect)
      const junctionY = startY + (Math.min(...branchRects.map(topY)) - startY) * .48
      if (window.matchMedia('(max-width: 1400px)').matches) {
        const railX = 3
        addPath(`M ${startX} ${startY} V ${junctionY} H ${railX} V ${topY(branchRects.at(-1)) - 20}`, '#647e98')
        branchRects.forEach((rect, index) => {
          const color = index === 0 ? '#a78376' : '#77988f'
          const turnY = topY(rect) - 20
          addPath(`M ${railX} ${turnY} H ${centerX(rect)} V ${topY(rect)}`, color)
          addDot(centerX(rect), topY(rect), color)
        })
      } else {
        addPath(`M ${startX} ${startY} V ${junctionY}`, '#647e98')
        branchRects.forEach((rect, index) => {
          const x = centerX(rect)
          const color = index === 0 ? '#a78376' : '#77988f'
          addPath(`M ${startX} ${junctionY} H ${x} V ${topY(rect)}`, color)
          addDot(x, topY(rect), color)
        })
      }
    }
  }

  for (const branch of tree.children) {
    if (!expanded.has(branch.id)) continue
    const color = branch.id === 'architecture' ? '#a78376' : '#77988f'
    if (branch.id === 'architecture' && branch.children.every((child) => card(child.id))) {
      const parentRect = card(branch.id).getBoundingClientRect()
      const topRects = branch.children.slice(0, 2).map((child) => card(child.id).getBoundingClientRect())
      const lowerRects = branch.children.slice(2).map((child) => card(child.id).getBoundingClientRect())
      const startX = centerX(parentRect)
      const startY = bottomY(parentRect)
      const topJunction = startY + (Math.min(...topRects.map(topY)) - startY) * .48
      const railX = Math.max(...topRects.map((rect) => rect.right - mapRect.left)) + 12
      const topXs = topRects.map(centerX)
      const lowerXs = lowerRects.map(centerX)
      const lowerJunction = Math.min(...lowerRects.map(topY)) - 16
      let data = `M ${startX} ${startY} V ${topJunction} M ${Math.min(...topXs)} ${topJunction} H ${railX} V ${lowerJunction} H ${Math.min(...lowerXs)}`
      topRects.forEach((rect) => {
        data += ` M ${centerX(rect)} ${topJunction} V ${topY(rect)}`
      })
      lowerRects.forEach((rect) => {
        data += ` M ${centerX(rect)} ${lowerJunction} V ${topY(rect)}`
      })
      addPath(data, color)
      topRects.concat(lowerRects).forEach((rect) => addDot(centerX(rect), topY(rect), color))
    } else {
      drawGroup(branch, branch.children, color)
    }

    for (const topic of branch.children) {
      if (expanded.has(topic.id)) drawGroup(topic, topic.children, color)
    }
  }
}

function renderNodeCard(node, depth) {
  const hasChildren = Boolean(node.children?.length)
  const isExpanded = hasChildren && expanded.has(node.id)
  const nodeElement = document.createElement(hasChildren ? 'button' : 'div')
  nodeElement.className = `node node-level-${Math.min(depth, 3)}${hasChildren ? ' node-clickable' : ''}${selectedId === node.id ? ' is-selected' : ''}`
  nodeElement.dataset.nodeId = node.id

  if (hasChildren) {
    nodeElement.type = 'button'
    nodeElement.setAttribute('aria-expanded', String(isExpanded))
    if (isExpanded) nodeElement.setAttribute('aria-controls', `children-${node.id}`)
    nodeElement.setAttribute('aria-label', `${node.title}，${isExpanded ? '收起' : '展开'}子节点`)
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
  nodeElement.append(copy)

  if (hasChildren) {
    const toggle = document.createElement('span')
    toggle.className = 'node-toggle'
    toggle.textContent = isExpanded ? '−' : '+'
    toggle.setAttribute('aria-hidden', 'true')
    nodeElement.append(toggle)
  }
  return nodeElement
}

function renderChildGrid(node) {
  const grid = document.createElement('div')
  grid.id = `children-${node.id}`
  grid.className = 'child-grid'
  node.children.forEach((child) => {
    const item = document.createElement('div')
    item.className = 'child-item'
    item.append(renderNodeCard(child, 3))
    grid.append(item)
  })
  return grid
}

function renderTopic(node, detachChildren = false) {
  const block = document.createElement('div')
  block.className = `topic-block topic-${node.id}`
  block.append(renderNodeCard(node, 2))
  if (expanded.has(node.id) && !detachChildren) block.append(renderChildGrid(node))
  return block
}

function renderBranch(node) {
  const branch = document.createElement('section')
  const isDetail = node.id === 'architecture'
    ? node.children.some((child) => child.id !== 'standard' && expanded.has(child.id))
    : expanded.has('prefill')
  branch.className = `map-branch lane-${node.id}${isDetail ? ' is-detail' : ''}`
  branch.append(renderNodeCard(node, 1))
  if (!expanded.has(node.id)) return branch

  const content = document.createElement('div')
  content.id = `children-${node.id}`
  content.className = 'branch-content'
  if (node.id === 'architecture') {
    node.children.forEach((child) => content.append(renderTopic(child)))
  } else {
    node.children.forEach((child) => content.append(renderTopic(child, child.id === 'decode' && !isDetail)))
    const decode = node.children.find((child) => child.id === 'decode')
    if (decode && expanded.has(decode.id) && !isDetail) {
      const children = renderChildGrid(decode)
      children.classList.add('decode-children')
      content.append(children)
    }
  }
  branch.append(content)
  return branch
}

function renderOutlineNode(node) {
  const item = document.createElement('li')
  const row = document.createElement('div')
  row.className = `outline-row${selectedId === node.id ? ' is-current' : ''}`

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
  const label = document.createElement('span')
  label.textContent = node.title
  link.append(label)
  row.append(link)
  item.append(row)

  if (node.children?.length && expanded.has(node.id)) {
    const children = document.createElement('ul')
    children.className = 'outline-children'
    node.children.forEach((child) => children.append(renderOutlineNode(child)))
    item.append(children)
  }
  return item
}

function updatePath() {
  document.querySelector('#current-path').textContent = selectedId === tree.id ? '知识导图' : nodes.get(selectedId).title
}

function render(focusId = null, scrollToId = null) {
  const layout = document.createElement('div')
  layout.className = 'map-layout'
  layout.append(renderNodeCard(tree, 0))
  if (expanded.has(tree.id)) {
    const branches = document.createElement('div')
    branches.id = `children-${tree.id}`
    branches.className = 'map-branches'
    tree.children.forEach((branch) => branches.append(renderBranch(branch)))
    layout.append(branches)
  }
  const svg = document.createElementNS(svgNamespace, 'svg')
  svg.classList.add('map-connectors')
  svg.setAttribute('aria-hidden', 'true')
  map.replaceChildren(svg, layout)

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

function collapseBranch(node) {
  expanded.delete(node.id)
  node.children?.forEach(collapseBranch)
}

map.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-node-id]')
  if (!button) return
  const id = button.dataset.nodeId
  if (expanded.has(id)) collapseBranch(nodes.get(id))
  else expanded.add(id)
  selectedId = id
  render(id)
})

outline.addEventListener('click', (event) => {
  const toggle = event.target.closest('button[data-toggle-id]')
  if (toggle) {
    const id = toggle.dataset.toggleId
    if (expanded.has(id)) collapseBranch(nodes.get(id))
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
