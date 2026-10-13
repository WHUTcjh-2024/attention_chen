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
        <a v-if="node.link" class="tree-link" :href="withBase(node.link)">{{ node.title }}</a>
        <span v-else class="tree-label">{{ node.title }}</span>
        <button
          v-if="node.children?.length"
          type="button"
          :aria-expanded="expanded.has(node.id)"
          :aria-label="`${expanded.has(node.id) ? '收起' : '展开'} ${node.title}`"
          @click="emit('toggle', node)"
        >{{ expanded.has(node.id) ? '−' : '+' }}</button>
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
.tree-level .tree-level { margin-left: 18px; padding-left: 12px; border-left: 1px solid #e4e4e7; }
.tree-row { display: flex; align-items: center; min-height: 42px; border-bottom: 1px solid #f4f4f5; }
.tree-row.selected { background: #fafafa; }
.tree-link, .tree-label { flex: 1; min-width: 0; padding: 9px 4px; color: #27272a; text-decoration: none; font-size: 14px; }
.tree-link:hover { color: #2563eb; }
.tree-row button { display: grid; width: 34px; height: 34px; place-items: center; border: 0; background: transparent; color: #71717a; cursor: pointer; }
.tree-row button:focus-visible, .tree-link:focus-visible { outline: 2px solid #2563eb; outline-offset: 2px; }
</style>
