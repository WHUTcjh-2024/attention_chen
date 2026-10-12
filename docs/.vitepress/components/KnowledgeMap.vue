<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { withBase } from 'vitepress'
import { knowledgeMap, type KnowledgeNode } from '../data/knowledge-map'
import { edgePath, layoutMap, NODE_HEIGHT, NODE_WIDTH } from './map-layout'
import KnowledgeTree from './KnowledgeTree.vue'

const expanded = ref(new Set(['attention']))
const selectedId = ref('attention')
const layout = computed(() => layoutMap(knowledgeMap, expanded.value))
const viewport = ref<HTMLElement | null>(null)
const transform = ref({ x: 0, y: 0, scale: 1 })
const dragging = ref(false)
let resizeObserver: ResizeObserver | undefined
let dragStart: { x: number; y: number; offsetX: number; offsetY: number } | undefined

function findNode(node: KnowledgeNode, id: string): KnowledgeNode | undefined {
  if (node.id === id) return node
  for (const child of node.children ?? []) {
    const found = findNode(child, id)
    if (found) return found
  }
}

const selected = computed(() => findNode(knowledgeMap, selectedId.value))

function fit() {
  if (!viewport.value?.clientWidth || !viewport.value.clientHeight) return
  const { width, height } = layout.value
  const viewWidth = viewport.value.clientWidth
  const viewHeight = viewport.value.clientHeight
  const scale = Math.max(
    0.35,
    Math.min(1.15, (viewWidth - 40) / width, (viewHeight - 40) / height)
  )
  const scaledWidth = width * scale
  const scaledHeight = height * scale
  transform.value = {
    scale,
    x: scaledWidth > viewWidth ? 0 : (viewWidth - scaledWidth) / 2,
    y: scaledHeight > viewHeight ? 12 : (viewHeight - scaledHeight) / 2
  }
}

function toggle(node: KnowledgeNode) {
  selectedId.value = node.id
  if (!node.children?.length) return
  const next = new Set(expanded.value)
  if (next.has(node.id)) next.delete(node.id)
  else next.add(node.id)
  expanded.value = next
  nextTick(fit)
}

function visit(node: KnowledgeNode, action: (node: KnowledgeNode) => void) {
  action(node)
  node.children?.forEach((child) => visit(child, action))
}

function expandAll() {
  const next = new Set<string>()
  visit(knowledgeMap, (node) => next.add(node.id))
  expanded.value = next
  nextTick(fit)
}

function collapseAll() {
  expanded.value = new Set()
  nextTick(fit)
}

function zoom(factor: number, x?: number, y?: number) {
  if (!viewport.value) return
  const current = transform.value
  const next = Math.min(2.5, Math.max(0.3, current.scale * factor))
  const centerX = x ?? viewport.value.clientWidth / 2
  const centerY = y ?? viewport.value.clientHeight / 2
  transform.value = {
    scale: next,
    x: centerX - ((centerX - current.x) / current.scale) * next,
    y: centerY - ((centerY - current.y) / current.scale) * next
  }
}

function onWheel(event: WheelEvent) {
  if (!viewport.value) return
  const bounds = viewport.value.getBoundingClientRect()
  zoom(event.deltaY < 0 ? 1.1 : 1 / 1.1, event.clientX - bounds.left, event.clientY - bounds.top)
}

function onPointerDown(event: PointerEvent) {
  if ((event.target as Element).closest('.map-node')) return
  dragStart = {
    x: event.clientX,
    y: event.clientY,
    offsetX: transform.value.x,
    offsetY: transform.value.y
  }
  dragging.value = true
  viewport.value?.setPointerCapture(event.pointerId)
}

function onPointerMove(event: PointerEvent) {
  if (!dragStart) return
  transform.value = {
    ...transform.value,
    x: dragStart.offsetX + event.clientX - dragStart.x,
    y: dragStart.offsetY + event.clientY - dragStart.y
  }
}

function onPointerEnd() {
  dragStart = undefined
  dragging.value = false
}

onMounted(() => {
  resizeObserver = new ResizeObserver(fit)
  if (viewport.value) resizeObserver.observe(viewport.value)
  nextTick(fit)
})

onBeforeUnmount(() => resizeObserver?.disconnect())
</script>

<template>
  <div class="knowledge-map">
    <div class="map-toolbar" role="toolbar" aria-label="知识地图控制">
      <span class="map-count">{{ layout.nodes.length }} 个可见节点</span>
      <button type="button" @click="expandAll">展开全部</button>
      <button type="button" @click="collapseAll">收起全部</button>
      <span class="map-divider map-desktop-control" aria-hidden="true"></span>
      <button class="map-desktop-control" type="button" aria-label="缩小地图" @click="zoom(1 / 1.2)">−</button>
      <button class="map-desktop-control" type="button" aria-label="放大地图" @click="zoom(1.2)">＋</button>
      <button class="map-desktop-control" type="button" @click="fit">适应</button>
    </div>

    <div
      ref="viewport"
      class="map-viewport"
      :class="{ dragging }"
      aria-label="可拖动的多级知识地图"
      @wheel.prevent="onWheel"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerEnd"
      @pointercancel="onPointerEnd"
    >
      <div
        class="map-canvas"
        :style="{
          width: `${layout.width}px`,
          height: `${layout.height}px`,
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`
        }"
      >
        <svg
          class="map-edges"
          :viewBox="`0 0 ${layout.width} ${layout.height}`"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path v-for="edge in layout.edges" :key="edge[1].node.id" :d="edgePath(edge[0], edge[1])" />
        </svg>
        <div
          v-for="item in layout.nodes"
          :key="item.node.id"
          class="map-node"
          :class="{ root: item.depth === 0, selected: selectedId === item.node.id }"
          :style="{
            left: `${item.x}px`,
            top: `${item.y}px`,
            width: `${NODE_WIDTH}px`,
            height: `${NODE_HEIGHT}px`
          }"
        >
          <button
            type="button"
            :aria-expanded="item.node.children?.length ? expanded.has(item.node.id) : undefined"
            :aria-label="`${item.node.title}，${item.node.children?.length ? (expanded.has(item.node.id) ? '收起' : '展开') : '查看关联'}`"
            @click="toggle(item.node)"
          >
            <span>{{ item.node.title }}</span>
            <span v-if="item.node.children?.length" class="map-toggle" aria-hidden="true">{{ expanded.has(item.node.id) ? '−' : '+' }}</span>
          </button>
          <a
            v-if="item.node.link"
            :href="withBase(item.node.link)"
            :aria-label="`阅读 ${item.node.title}`"
            title="阅读文档"
          >↗</a>
        </div>
      </div>
    </div>

    <div class="map-mobile-tree" aria-label="可展开的知识地图">
      <KnowledgeTree
        :nodes="[knowledgeMap]"
        :expanded="expanded"
        :selected-id="selectedId"
        @toggle="toggle"
      />
    </div>

    <p class="map-hint">点击节点展开或选中；桌面可拖动画布移动，滚轮或按钮缩放。</p>
    <p v-if="selected?.related?.length" class="map-related">
      <strong>{{ selected.title }} 的关联：</strong>
      <a v-for="item in selected.related" :key="item.link" :href="withBase(item.link)">{{ item.title }}</a>
    </p>
  </div>
</template>

<style scoped>
.knowledge-map { margin: 24px 0; }
.map-toolbar { display: flex; align-items: center; flex-wrap: wrap; gap: 5px; margin-bottom: 10px; }
.map-count { margin-right: auto; color: #71717a; font-size: 12px; }
.map-toolbar button { padding: 5px 8px; border: 1px solid transparent; border-radius: 6px; background: transparent; color: #52525b; font-size: 12px; cursor: pointer; }
.map-toolbar button:hover { border-color: #e4e4e7; background: #fafafa; }
.map-toolbar button:focus-visible, .map-node button:focus-visible, .map-node a:focus-visible { outline: 2px solid #2563eb; outline-offset: 2px; }
.map-divider { height: 17px; border-left: 1px solid #e4e4e7; }
.map-viewport { position: relative; height: 520px; overflow: hidden; border: 1px solid #e4e4e7; border-radius: 8px; background: #fff; cursor: grab; touch-action: none; }
.map-viewport.dragging { cursor: grabbing; }
.map-canvas { position: absolute; inset: 0 auto auto 0; transform-origin: 0 0; }
.map-edges { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
.map-edges path { fill: none; stroke: #d4d4d8; stroke-width: 1.5; }
.map-node { position: absolute; display: flex; align-items: stretch; overflow: hidden; border: 1px solid #d4d4d8; border-radius: 7px; background: #fff; color: #27272a; }
.map-node:hover, .map-node.selected { border-color: #a1a1aa; }
.map-node.root { border-color: #18181b; background: #18181b; color: #fff; }
.map-node button { display: flex; flex: 1; min-width: 0; align-items: center; justify-content: space-between; gap: 6px; padding: 0 10px; border: 0; background: transparent; color: inherit; text-align: left; font-size: 12px; cursor: pointer; }
.map-node button span:first-child { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.map-node a { display: grid; width: 27px; flex: 0 0 27px; place-items: center; border-left: 1px solid #e4e4e7; color: inherit; font-size: 13px; text-decoration: none; }
.map-node.root a { border-left-color: #52525b; }
.map-node a:hover { background: #f4f4f5; }
.map-node.root a:hover { background: #3f3f46; }
.map-toggle { color: #71717a; font-size: 15px; }
.map-node.root .map-toggle { color: #d4d4d8; }
.map-hint { margin: 8px 0 0; color: #71717a; font-size: 12px; }
.map-related { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin: 14px 0 0; font-size: 13px; }
.map-related strong { font-weight: 600; }
.map-mobile-tree { display: none; }
@media (max-width: 640px) {
  .map-count { flex-basis: 100%; }
  .map-viewport, .map-desktop-control { display: none; }
  .map-mobile-tree { display: block; padding: 0 10px; border: 1px solid #e4e4e7; border-radius: 8px; }
}
</style>
