<template>
  <NModal
    v-model:show="showModal"
    :show-icon="false"
    preset="dialog"
    title="Partie terminée"
    :closable="false"
  >
    <NSpace vertical :size="16">
      <NAlert
        type="success"
        :title="isWinner ? 'Vous avez gagné !' : 'Vous avez perdu.'"
      />
      <NText v-if="gameStore.gameResult?.message">
        {{ gameStore.gameResult.message }}
      </NText>
    </NSpace>

    <template #action>
      <NButton @click="returnToLobby">Retour au lobby</NButton>
    </template>
  </NModal>
</template>

<script setup lang="ts">
import { NAlert, NButton, NModal, NSpace, NText } from 'naive-ui'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useGameStore } from '@/store/game'

const gameStore = useGameStore()
const router = useRouter()

const showModal = ref(true)

const isWinner = computed(() => {
  return gameStore.gameResult?.winner === gameStore.socketId
})

const returnToLobby = () => {
  gameStore.resetGame()
  router.push('/')
}
</script>

<style scoped></style>
