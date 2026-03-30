<template>
  <NSpace vertical :size="12" style="width: 100%">
    <NText strong>Main du joueur</NText>
    <NSpace
      :size="8"
      :wrap-item="false"
      style="width: 100%; justify-content: center"
    >
      <div
        v-for="(card, index) in myBoard?.hand || []"
        :key="card.id"
        class="card-container"
        :class="{ disabled: !canPlayCard }"
        @click="playCard(index)"
      >
        <img :src="card.imgUrl" :alt="card.name" class="card-image" />
        <NText class="card-name">{{ card.name }}</NText>
      </div>
    </NSpace>

    <NDivider style="margin: 8px 0" />

    <NText depth="3">
      Cartes restantes dans le deck: {{ myBoard?.deck?.length || 0 }}
    </NText>
  </NSpace>
</template>

<script setup lang="ts">
import { NDivider, NSpace, NText } from 'naive-ui'
import { computed } from 'vue'

import { useGameStore } from '@/store/game'

const gameStore = useGameStore()

const myBoard = computed(() => gameStore.myBoard)

const canPlayCard = computed(() => {
  return gameStore.isMyTurn && !myBoard.value?.activeCard
})

const playCard = (index: number) => {
  if (canPlayCard.value) {
    gameStore.playCard(index)
  }
}
</script>

<style scoped>
.card-container {
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.card-container:hover:not(.disabled) {
  border-color: var(--n-border-color);
  transform: translateY(-4px);
}

.card-container.disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.card-image {
  height: 84px;
  display: block;
  margin-bottom: 4px;
}

.card-name {
  font-size: 12px;
  text-align: center;
  display: block;
}
</style>
