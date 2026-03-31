<template>
  <NSpace vertical :size="12" style="width: 100%; padding: 8px 0">
    <div class="game-zone">
      <OpponentZone />
    </div>
    <div class="action-zone">
      <ActionBar />
    </div>
    <div class="player-zone">
      <PlayerZone />
    </div>
    <GameEndModal v-if="gameStore.gameResult" />
  </NSpace>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { NSpace } from 'naive-ui'

import { useGameStore } from '@/store/game'
import ActionBar from '@/components/game/ActionBar.vue'
import GameEndModal from '@/components/game/GameEndModal.vue'
import OpponentZone from '@/components/game/OpponentZone.vue'
import PlayerZone from '@/components/game/PlayerZone.vue'

const gameStore = useGameStore()

onMounted(() => {
  // Le store est déjà connecté depuis le lobby
})
</script>

<style scoped>
.game-zone,
.action-zone,
.player-zone {
  padding: 0 12px;
}

@media (min-width: 768px) {
  .game-zone,
  .action-zone,
  .player-zone {
    padding: 0;
  }
}
</style>
