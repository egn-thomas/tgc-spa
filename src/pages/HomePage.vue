<template>
  <NSpace vertical :size="24" style="width: 100%">
    <div class="page-section">
      <Lobby />
    </div>

    <div class="page-section">
      <DeckList />
    </div>
  </NSpace>
</template>

<script setup lang="ts">
import { NSpace } from 'naive-ui'

import DeckList from '@/components/decks/DeckList.vue'
import Lobby from '@/components/game/Lobby.vue'
</script>

<style scoped>
.page-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

@media (min-width: 768px) {
  .page-section {
    padding: 0;
  }
}
</style>
