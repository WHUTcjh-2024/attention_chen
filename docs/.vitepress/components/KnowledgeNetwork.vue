<script setup lang="ts">
import { withBase } from 'vitepress'
import { knowledgeMap } from '../data/knowledge-map'
</script>

<template>
  <main class="knowledge-network">
    <header class="network-hero">
      <p class="network-eyebrow">PERSONAL KNOWLEDGE NETWORK</p>
      <h1>Attention<span class="network-period">.</span></h1>
      <p class="network-lead">
        从模型结构到推理阶段，沿着清晰的母子关系，建立自己的 Attention 知识网。
      </p>
      <div class="network-counts" aria-label="知识网规模">
        <span>2 条分类主线</span>
        <span class="network-count-divider" aria-hidden="true"></span>
        <span>6 个核心主题</span>
      </div>
    </header>

    <div class="network-stem" aria-hidden="true"></div>

    <div class="network-branches">
      <details
        v-for="branch in knowledgeMap"
        :key="branch.link"
        class="network-branch"
        open
      >
        <summary class="branch-heading">
          <span class="branch-number">{{ branch.index }}</span>
          <span class="branch-heading-copy">
            <span class="branch-title">{{ branch.title }}</span>
            <span class="branch-description">{{ branch.description }}</span>
          </span>
          <span class="branch-toggle" aria-hidden="true"></span>
        </summary>

        <div class="branch-topics" :class="{ 'branch-topics-short': branch.topics.length === 2 }">
          <a
            v-for="topic in branch.topics"
            :key="topic.link"
            class="topic-card"
            :href="withBase(topic.link)"
          >
            <span class="topic-topline">
              <span class="topic-index">{{ branch.index }} / {{ topic.index }}</span>
              <span class="topic-arrow" aria-hidden="true">↗</span>
            </span>
            <strong>{{ topic.title }}</strong>
            <span class="topic-description">{{ topic.description }}</span>
          </a>
        </div>
        <a class="branch-overview" :href="withBase(branch.link)">
          查看分类总览 <span aria-hidden="true">→</span>
        </a>
      </details>
    </div>

    <p class="network-hint">点击分类标题可折叠；点击主题进入对应笔记。</p>
  </main>
</template>
