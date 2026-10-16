const state = {
  tree: null,
  version: null,
  token: null,
  selectedId: 'architecture',
  dirty: false,
  busy: false,
  lastAction: '已加载'
}

const elements = {
  treeList: document.querySelector('#tree-list'),
  count: document.querySelector('#node-count'),
  breadcrumb: document.querySelector('#breadcrumb'),
  title: document.querySelector('#node-title'),
  description: document.querySelector('#node-description'),
  saveState: document.querySelector('#save-state'),
  message: document.querySelector('#message'),
  save: document.querySelector('#save'),
  publish: document.querySelector('#publish'),
  addChild: document.querySelector('#add-child'),
  moveUp: document.querySelector('#move-up'),
  moveDown: document.querySelector('#move-down'),
  deleteNode: document.querySelector('#delete-node')
}

function locate(id, node = state.tree, parent = null, depth = 0, path = []) {
  if (!node) return null
  const nextPath = [...path, node]
  if (node.id === id) {
    return { node, parent, depth, path: nextPath, index: parent?.children.indexOf(node) ?? 0 }
  }
  for (const child of node.children || []) {
    const found = locate(id, child, node, depth + 1, nextPath)
    if (found) return found
  }
  return null
}

function countNodes(node) {
  return 1 + (node.children || []).reduce((count, child) => count + countNodes(child), 0)
}

function setMessage(message, isError = false) {
  elements.message.textContent = message
  elements.message.classList.toggle('is-error', isError)
}

function markDirty() {
  state.dirty = true
  state.lastAction = '未保存'
  updateControls()
  setMessage('更改还在编辑页中；点击“保存草稿”或“保存并发布”。')
}

function updateControls() {
  const current = locate(state.selectedId)
  const available = Boolean(current) && !state.busy
  elements.title.disabled = !available
  elements.description.disabled = !available
  elements.save.disabled = !state.tree || state.busy || !state.dirty
  elements.publish.disabled = !state.tree || state.busy
  elements.addChild.disabled = !available || current.depth === 0 || current.depth >= 3
  elements.deleteNode.disabled = !available || current.depth < 2
  elements.moveUp.disabled = !available || current.depth < 2 || current.index === 0
  elements.moveDown.disabled = !available || current.depth < 2 || current.index === current.parent.children.length - 1
  elements.saveState.textContent = state.busy ? '正在处理…' : state.dirty ? '未保存' : state.lastAction
  elements.saveState.classList.toggle('is-dirty', state.dirty)
}

function renderTree() {
  if (!state.tree) return
  const oldScroll = elements.treeList.scrollTop

  function makeList(node) {
    const item = document.createElement('li')
    const button = document.createElement('button')
    button.type = 'button'
    button.className = `tree-node${node.id === state.selectedId ? ' is-selected' : ''}`
    button.dataset.nodeId = node.id
    button.setAttribute('aria-current', node.id === state.selectedId ? 'true' : 'false')

    const dot = document.createElement('span')
    dot.className = 'node-dot'
    dot.setAttribute('aria-hidden', 'true')
    const title = document.createElement('span')
    title.textContent = node.title || '未命名节点'
    button.append(dot, title)
    item.append(button)

    if (node.children?.length) {
      const children = document.createElement('ul')
      node.children.forEach((child) => children.append(makeList(child)))
      item.append(children)
    }
    return item
  }

  const list = document.createElement('ul')
  list.append(makeList(state.tree))
  elements.treeList.replaceChildren(list)
  elements.treeList.scrollTop = oldScroll
  elements.count.textContent = `${countNodes(state.tree)} 个节点`
}

function renderSelection() {
  const current = locate(state.selectedId)
  if (!current) return
  elements.breadcrumb.textContent = current.path.map((node) => node.title || '未命名节点').join('  /  ')
  elements.title.value = current.node.title
  elements.description.value = current.node.description || ''
  renderTree()
  updateControls()
}

elements.treeList.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-node-id]')
  if (!button) return
  state.selectedId = button.dataset.nodeId
  renderSelection()
})

elements.title.addEventListener('input', () => {
  const current = locate(state.selectedId)
  if (!current) return
  current.node.title = elements.title.value
  elements.breadcrumb.textContent = current.path.map((node) => node.title || '未命名节点').join('  /  ')
  renderTree()
  markDirty()
})

elements.description.addEventListener('input', () => {
  const current = locate(state.selectedId)
  if (!current) return
  current.node.description = elements.description.value
  markDirty()
})

elements.addChild.addEventListener('click', () => {
  const current = locate(state.selectedId)
  if (!current || current.depth === 0 || current.depth >= 3) return
  let id
  do {
    id = `node-${crypto.randomUUID().slice(0, 12)}`
  } while (locate(id))
  const child = { id, title: '', description: '' }
  current.node.children ||= []
  current.node.children.push(child)
  state.selectedId = id
  renderSelection()
  markDirty()
  elements.title.focus()
})

elements.deleteNode.addEventListener('click', () => {
  const current = locate(state.selectedId)
  if (!current || current.depth < 2) return
  const descendants = countNodes(current.node) - 1
  const detail = descendants ? `及其 ${descendants} 个子节点` : ''
  if (!window.confirm(`确定删除「${current.node.title || '未命名节点'}」${detail}吗？`)) return
  current.parent.children.splice(current.index, 1)
  state.selectedId = current.parent.id
  renderSelection()
  markDirty()
})

function moveSelected(offset) {
  const current = locate(state.selectedId)
  if (!current || current.depth < 2) return
  const siblings = current.parent.children
  const target = current.index + offset
  if (target < 0 || target >= siblings.length) return
  const moved = siblings[current.index]
  siblings[current.index] = siblings[target]
  siblings[target] = moved
  renderSelection()
  markDirty()
}

elements.moveUp.addEventListener('click', () => moveSelected(-1))
elements.moveDown.addEventListener('click', () => moveSelected(1))

function hasEmptyTitle(node) {
  return !node.title.trim() || (node.children || []).some(hasEmptyTitle)
}

async function submit(action) {
  if (!state.tree || state.busy) return
  if (hasEmptyTitle(state.tree)) {
    setMessage('请先给所有新节点填写标题。', true)
    return
  }
  state.busy = true
  updateControls()
  setMessage(action === 'publish' ? '正在保存并推送到 GitHub，请稍候…' : '正在保存草稿…')

  try {
    const response = await fetch(`/api/${action}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Editor-Token': state.token },
      body: JSON.stringify({ tree: state.tree, version: state.version })
    })
    const result = await response.json()
    if (result.saved || response.ok) {
      state.version = result.version
      state.dirty = false
      state.lastAction = action === 'publish' && response.ok ? '已发布' : '已保存到本机'
    }
    if (!response.ok) throw new Error(result.error || '操作失败')
    setMessage(result.commit ? `${result.message} 提交：${result.commit.slice(0, 7)}` : result.message)
  } catch (error) {
    setMessage(error.message, true)
  } finally {
    state.busy = false
    updateControls()
  }
}

elements.save.addEventListener('click', () => submit('save'))
elements.publish.addEventListener('click', () => submit('publish'))

window.addEventListener('beforeunload', (event) => {
  if (!state.dirty) return
  event.preventDefault()
  event.returnValue = ''
})

async function load() {
  try {
    const response = await fetch('/api/tree', { cache: 'no-store' })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || '导图加载失败')
    state.tree = data.tree
    state.version = data.version
    state.token = data.token
    state.lastAction = data.unpublished ? '本机草稿' : '已加载'
    renderSelection()
    setMessage(data.unpublished
      ? '当前有尚未发布的本机草稿；预览无误后可点击“保存并发布”。'
      : '选择左侧节点开始编辑。保存草稿只修改本机；发布会提交并推送到 GitHub。')
  } catch (error) {
    elements.treeList.textContent = '导图加载失败'
    setMessage(error.message, true)
  }
}

load()
