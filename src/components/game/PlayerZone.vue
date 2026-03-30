<template>
  <NCard
    title="Votre plateau"
    style="width: 100%"
    size="small"
    :bordered="false"
    :segmented="{
      content: 'soft',
      footer: 'soft',
    }"
  >
    <template #header-extra>
      <NText type="primary">Score: {{ myBoard?.score || 0 }}</NText>
    </template>

    <NSpace vertical :size="16">
      <div style="text-align: center">
        <div v-if="myBoard?.activeCard" style="margin-bottom: 16px">
          <img
            :src="myBoard.activeCard.imgUrl"
            :alt="myBoard.activeCard.name"
            style="height: 140px; margin-bottom: 12px"
          />
          <NSpace vertical :size="8" style="justify-items: center">
            <NText strong>
              {{ myBoard.activeCard.name }}
            </NText>
            <NProgress
              :percentage="hpPercentage"
              indicator-placement="inside"
              :show-indicator="false"
              style="margin: 0 auto; max-width: 200px"
            />
            <NText depth="3" style="font-size: 12px">
              {{ myBoard.activeCard.currentHp }}/{{ myBoard.activeCard.hp }}
            </NText>
          </NSpace>
        </div>
        <NEmpty v-else description="Aucune carte active" />
      </div>

      <PlayerHand />
    </NSpace>
  </NCard>
</template>

<script setup lang="ts">
import { NCard, NEmpty, NProgress, NSpace, NText } from 'naive-ui'
import { computed } from 'vue'

import PlayerHand from '@/components/game/PlayerHand.vue'
import { useGameStore } from '@/store/game'

const gameStore = useGameStore()

const myBoard = computed(() => gameStore.myBoard)

const hpPercentage = computed(() => {
  if (!myBoard.value?.activeCard) return 0
  return (
    (myBoard.value.activeCard.currentHp / myBoard.value.activeCard.hp) * 100
  )
})
</script>

<style scoped></style>
