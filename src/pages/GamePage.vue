<template>
  <NSpace vertical :size="16" style="width: 100%; padding: 16px 0">
    <OpponentZone />
    <ActionBar />
    <PlayerZone />
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

<style scoped></style>
