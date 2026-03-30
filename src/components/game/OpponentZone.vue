<template>
  <NCard
    title="Adversaire"
    style="width: 100%"
    size="small"
    :bordered="false"
    :segmented="{
      content: 'soft',
      footer: 'soft',
    }"
  >
    <template #header-extra>
      <NText type="primary">Score: {{ opponentBoard?.score || 0 }}</NText>
    </template>

    <div style="text-align: center">
      <div v-if="opponentBoard?.activeCard" style="margin-bottom: 16px">
        <img
          :src="opponentBoard.activeCard.imgUrl"
          :alt="opponentBoard.activeCard.name"
          style="height: 140px; margin-bottom: 12px"
        />
        <NSpace vertical :size="8" style="justify-items: center">
          <NText strong>
            {{ opponentBoard.activeCard.name }}
          </NText>
          <NProgress
            :percentage="hpPercentage"
            indicator-placement="inside"
            :show-indicator="false"
            style="margin: 0 auto; max-width: 200px"
          />
          <NText depth="3" style="font-size: 12px">
            {{ opponentBoard.activeCard.currentHp }}/{{
              opponentBoard.activeCard.hp
            }}
          </NText>
        </NSpace>
      </div>
      <NEmpty v-else description="Aucune carte active" />
    </div>
  </NCard>
</template>

<script setup lang="ts">
import { NCard, NEmpty, NProgress, NSpace, NText } from 'naive-ui'
import { computed } from 'vue'

import { useGameStore } from '@/store/game'

const gameStore = useGameStore()

const opponentBoard = computed(() => gameStore.opponentBoard)

const hpPercentage = computed(() => {
  if (!opponentBoard.value?.activeCard) return 0
  return (
    (opponentBoard.value.activeCard.currentHp /
      opponentBoard.value.activeCard.hp) *
    100
  )
})
</script>

<style scoped></style>
