<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { withBase } from 'vitepress'
import { knowledgeMap, type KnowledgeNode } from '../data/knowledge-map'
import { edgePath, layoutMap, NODE_HEIGHT, NODE_WIDTH } from './map-layout'
import KnowledgeTree from './KnowledgeTree.vue'

function expandableIds(node: KnowledgeNode, ids = new Set<string>()) {
  if (node.children?.length) {
    ids.add(node.id)
    node.children.forEach((child) => expandableIds(child, ids))
  }
  return ids
}

const expanded = ref(expandableIds(knowledgeMap))
const selectedId = ref('attention')
const layout = computed(() => layoutMap(knowledgeMap, expanded.value))
const viewport = ref<HTMLElement | null>(null)
const transform = ref({ x: 0, y: 0, scale: 1 })
const dragging = ref(false)
let resizeObserver: ResizeObserver | undefined
let dragStart: { x: number; y: number; offsetX: number; offsetY: number } | undefined

function fit() {
  if (!viewport.value?.clientWidth || !viewport.value.clientHeight) return
  const { width, height } = layout.value
  const viewWidth = viewport.value.clientWidth
  const viewHeight = viewport.value.clientHeight
  const scale = Math.max(0.48, Math.min(1.08, (viewWidth - 48) / width, (viewHeight - 48) / height))
  const scaledWidth = width * scale
  const scaledHeight = height * scale
  transform.value = {
    scale,
    x: scaledWidth > viewWidth ? 18 : (viewWidth - scaledWidth) / 2,
    y: scaledHeight > viewHeight ? 18 : (viewHeight - scaledHeight) / 2
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

function expandAll() {
  expanded.value = expandableIds(knowledgeMap)
  nextTick(fit)
}

function collapseAll() {
  expanded.value = new Set(['attention'])
  nextTick(fit)
}

function zoom(factor: number, x?: number, y?: number) {
  if (!viewport.value) return
  const current = transform.value
  const next = Math.min(2.2, Math.max(0.38, current.scale * factor))
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
      <div>
        <strong>总览</strong>
        <span class="map-count">{{ layout.nodes.length }} 个可见节点</span>
      </div>
      <button type="button" @click="expandAll">展开全部</button>
      <button type="button" @click="collapseAll">收起分支</button>
      <span class="map-divider map-desktop-control" aria-hidden="true"></span>
      <button class="map-desktop-control" type="button" aria-label="缩小地图" @click="zoom(1 / 1.18)">−</button>
      <button class="map-desktop-control" type="button" aria-label="放大地图" @click="zoom(1.18)">＋</button>
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
        <svg class="map-edges" :viewBox="`0 0 ${layout.width} ${layout.height}`" preserveAspectRatio="none" aria-hidden="true">
          <path
            v-for="edge in layout.edges"
            :key="edge[1].node.id"
            :class="edge[1].tone ? `tone-${edge[1].tone}` : undefined"
            :d="edgePath(edge[0], edge[1])"
          />
        </svg>

        <div
          v-for="item in layout.nodes"
          :key="item.node.id"
          class="map-node"
          :class="[
            { root: item.depth === 0, selected: selectedId === item.node.id },
            item.tone ? `tone-${item.tone}` : ''
          ]"
          :style="{
            left: `${item.x}px`,
            top: `${item.y}px`,
            width: `${NODE_WIDTH}px`,
            height: `${NODE_HEIGHT}px`
          }"
        >
          <a v-if="item.node.link" class="map-node-link" :href="withBase(item.node.link)" :title="`打开 ${item.node.title} 文档`">
            <span class="doc-mark" aria-hidden="true">▤</span>
            <span>{{ item.node.title }}</span>
          </a>
          <span v-else class="map-node-label">{{ item.node.title }}</span>

          <button
            v-if="item.node.children?.length"
            class="map-toggle"
            type="button"
            :aria-expanded="expanded.has(item.node.id)"
            :aria-label="`${expanded.has(item.node.id) ? '收起' : '展开'} ${item.node.title}`"
            @click="toggle(item.node)"
          >{{ expanded.has(item.node.id) ? '−' : '+' }}</button>
        </div>
      </div>
    </div>

    <div class="map-mobile-tree" aria-label="可展开的知识地图">
      <KnowledgeTree :nodes="[knowledgeMap]" :expanded="expanded" :selected-id="selectedId" @toggle="toggle" />
    </div>

    <p class="map-hint">节点标题直接进入文档；`+ / −` 控制分支。桌面端可拖动画布，滚轮或按钮缩放。</p>
  </div>
</template>

<style scoped>
.knowledge-map { margin: 22px 0 0; }
.map-toolbar { display: flex; align-items: center; gap: 6px; margin-bottom: 12px; min-height: 34px; }
.map-toolbar > div:first-child { display: flex; align-items: baseline; gap: 9px; margin-right: auto; }
.map-toolbar strong { color: #18181b; font-size: 13px; }
.map-count { color: #a1a1aa; font-size: 12px; }
.map-toolbar button { padding: 6px 9px; border: 1px solid transparent; border-radius: 7px; background: transparent; color: #52525b; font-size: 12px; cursor: pointer; }
.map-toolbar button:hover { border-color: #e4e4e7; background: #fafafa; }
.map-toolbar button:focus-visible, .map-node a:focus-visible, .map-node button:focus-visible { outline: 2px solid #2563eb; outline-offset: 2px; }
.map-divider { height: 17px; border-left: 1px solid #e4e4e7; }
.map-viewport { position: relative; height: 820px; overflow: hidden; border: 1px solid #e4e4e7; border-radius: 14px; background: linear-gradient(180deg, #fff 0%, #fdfdfd 100%); cursor: grab; touch-action: none; }
.map-viewport.dragging { cursor: grabbing; }
.map-canvas { position: absolute; inset: 0 auto auto 0; transform-origin: 0 0; }
.map-edges { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
.map-edges path { fill: none; stroke: #d4d4d8; stroke-width: 1.5; }
.map-edges path.tone-blue { stroke: #93c5fd; }
.map-edges path.tone-violet { stroke: #c4b5fd; }
.map-edges path.tone-green { stroke: #86efac; }
.map-edges path.tone-orange { stroke: #fdba74; }
.map-edges path.tone-pink { stroke: #f9a8d4; }
.map-edges path.tone-indigo { stroke: #a5b4fc; }
.map-node { position: absolute; display: flex; align-items: stretch; overflow: hidden; border: 1px solid #d4d4d8; border-radius: 9px; background: #fff; color: #27272a; box-shadow: 0 1px 2px rgba(24, 24, 27, 0.035); }
.map-node:hover, .map-node.selected { border-color: #a1a1aa; box-shadow: 0 4px 14px rgba(24, 24, 27, 0.07); }
.map-node.tone-blue { border-color: #bfdbfe; background: #f8fbff; }
.map-node.tone-violet { border-color: #ddd6fe; background: #fbfaff; }
.map-node.tone-green { border-color: #bbf7d0; background: #f7fdf9; }
.map-node.tone-orange { border-color: #fed7aa; background: #fffaf5; }
.map-node.tone-pink { border-color: #fbcfe8; background: #fff9fc; }
.map-node.tone-indigo { border-color: #c7d2fe; background: #fafaff; }
.map-node.root { border-color: #18181b; background: #18181b; color: #fff; box-shadow: 0 6px 20px rgba(24, 24, 27, 0.12); }
.map-node-link, .map-node-label { display: flex; flex: 1; min-width: 0; align-items: center; gap: 7px; padding: 0 11px; color: inherit; font-size: 12px; font-weight: 560; text-decoration: none; }
.map-node-link span:last-child, .map-node-label { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.map-node-link:hover { color: #111827; }
.doc-mark { flex: 0 0 auto; color: #60a5fa; font-size: 12px; }
.map-node.tone-violet .doc-mark { color: #8b5cf6; }
.map-node.tone-green .doc-mark { color: #22c55e; }
.map-node.tone-orange .doc-mark { color: #f97316; }
.map-node.tone-pink .doc-mark { color: #ec4899; }
.map-node.tone-indigo .doc-mark { color: #6366f1; }
.map-toggle { display: grid; width: 34px; flex: 0 0 34px; place-items: center; border: 0; border-left: 1px solid rgba(161, 161, 170, 0.25); background: transparent; color: #71717a; font-size: 15px; cursor: pointer; }
.map-toggle:hover { background: rgba(255, 255, 255, 0.72); color: #18181b; }
.map-node.root .map-toggle { border-left-color: #3f3f46; color: #d4d4d8; }
.map-node.root .map-toggle:hover { background: #27272a; color: #fff; }
.map-hint { margin: 9px 2px 0; color: #71717a; font-size: 12px; }
.map-mobile-tree { display: none; }
@media (max-width: 760px) {
  .map-toolbar { flex-wrap: wrap; }
  .map-toolbar > div:first-child { flex-basis: 100%; }
  .map-viewport, .map-desktop-control { display: none; }
  .map-mobile-tree { display: block; padding: 0 10px; border: 1px solid #e4e4e7; border-radius: 10px; }
}
</style>
