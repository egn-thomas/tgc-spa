<template>
  <NSpace vertical :size="16" style="width: 100%; padding: 16px 0">
    <NSpace justify="center" style="width: 100%">
      <NText h3>
        {{ gameStore.isMyTurn ? 'Votre tour' : "Tour de l'adversaire" }}
      </NText>
    </NSpace>

    <NSpace justify="center" :size="16">
      <NButton :disabled="!canDraw" @click="drawCards"> Piocher </NButton>
      <NButton :disabled="!canAttack" @click="attack"> Attaquer </NButton>
      <NButton type="primary" :disabled="!gameStore.isMyTurn" @click="endTurn">
        Fin de tour
      </NButton>
    </NSpace>

    <NAlert
      v-if="gameStore.errorMessage"
      type="error"
      :title="gameStore.errorMessage"
      closable
    />
    <NAlert
      v-if="gameStore.message"
      type="info"
      :title="gameStore.message"
      closable
    />
  </NSpace>
</template>

<script setup lang="ts">
import { NAlert, NButton, NSpace, NText } from 'naive-ui'
import { computed } from 'vue'

import { useGameStore } from '@/store/game'

const gameStore = useGameStore()

const canDraw = computed(() => {
  const hand = gameStore.myBoard?.hand || []
  const deck = gameStore.myBoard?.deck || []
  return gameStore.isMyTurn && hand.length < 5 && deck.length > 0
})

const canAttack = computed(() => {
  return (
    gameStore.isMyTurn &&
    gameStore.myBoard?.activeCard &&
    gameStore.opponentBoard?.activeCard
  )
})

const drawCards = () => {
  if (canDraw.value) {
    gameStore.drawCards()
  }
}

const attack = () => {
  if (canAttack.value) {
    gameStore.attack()
  }
}

const endTurn = () => {
  if (gameStore.isMyTurn) {
    gameStore.endTurn()
  }
}
</script>

<style scoped></style>
