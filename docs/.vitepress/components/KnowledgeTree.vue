<script setup lang="ts">
import { withBase } from 'vitepress'
import type { KnowledgeNode } from '../data/knowledge-map'

defineProps<{
  nodes: KnowledgeNode[]
  expanded: ReadonlySet<string>
  selectedId: string
}>()

const emit = defineEmits<{ toggle: [node: KnowledgeNode] }>()
</script>

<template>
  <ul class="tree-level">
    <li v-for="node in nodes" :key="node.id">
      <div class="tree-row" :class="{ selected: selectedId === node.id }">
        <button
          type="button"
          :aria-expanded="node.children?.length ? expanded.has(node.id) : undefined"
          :aria-label="`${node.title}，${node.children?.length ? (expanded.has(node.id) ? '收起' : '展开') : '查看关联'}`"
          @click="emit('toggle', node)"
        >
          <span class="tree-marker" aria-hidden="true">{{ node.children?.length ? (expanded.has(node.id) ? '▾' : '▸') : '·' }}</span>
          {{ node.title }}
        </button>
        <a v-if="node.link" :href="withBase(node.link)" :aria-label="`阅读 ${node.title}`">阅读</a>
      </div>
      <KnowledgeTree
        v-if="node.children?.length && expanded.has(node.id)"
        :nodes="node.children"
        :expanded="expanded"
        :selected-id="selectedId"
        @toggle="emit('toggle', $event)"
      />
    </li>
  </ul>
</template>

<style scoped>
.tree-level { margin: 0; padding: 0; list-style: none; }
.tree-level .tree-level { margin-left: 20px; padding-left: 12px; border-left: 1px solid #e4e4e7; }
.tree-row { display: flex; align-items: center; min-height: 42px; border-bottom: 1px solid #f1f1f1; }
.tree-row.selected { background: #fafafa; }
.tree-row button { display: flex; flex: 1; gap: 8px; align-items: center; min-width: 0; padding: 9px 4px; border: 0; background: transparent; color: #27272a; text-align: left; font-size: 14px; cursor: pointer; }
.tree-row a { flex: 0 0 auto; padding: 6px 4px; color: #2563eb; font-size: 12px; text-decoration: none; }
.tree-row button:focus-visible, .tree-row a:focus-visible { outline: 2px solid #2563eb; outline-offset: 2px; }
.tree-marker { width: 15px; color: #71717a; text-align: center; }
</style>
