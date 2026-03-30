<template>
  <NSpace vertical :size="24" style="width: 100%">
    <NText h2>Lobby</NText>

    <NAlert
      v-if="gameStore.errorMessage"
      type="error"
      :title="gameStore.errorMessage"
    />

    <div v-if="!gameStore.socketId">
      <NSpin />
      <NText>Connexion au serveur de jeu...</NText>
    </div>

    <NSpace v-else vertical :size="16" style="width: 100%">
      <NSpace vertical :size="8">
        <NText strong>Choisissez un deck</NText>
        <NSelect
          v-model:value="selectedDeckId"
          :options="deckOptions"
          placeholder="Sélectionnez un deck"
        />
      </NSpace>

      <div v-if="selectedDeckId" style="width: 100%">
        <NButton type="primary" :disabled="!selectedDeckId" @click="createRoom">
          Créer une room
        </NButton>

        <NSpace vertical :size="16" style="width: 100%; margin-top: 16px">
          <NText strong>Rooms disponibles</NText>
          <div v-if="gameStore.rooms.length === 0">
            <NEmpty description="Aucune room disponible" />
          </div>
          <NSpace v-else vertical :size="8">
            <NButton
              v-for="room in gameStore.rooms"
              :key="room.id"
              :disabled="!selectedDeckId"
              @click="joinRoom(room.id)"
            >
              Rejoindre Room {{ room.id }}
            </NButton>
          </NSpace>
        </NSpace>
      </div>
    </NSpace>
  </NSpace>
</template>

<script setup lang="ts">
import {
  NAlert,
  NButton,
  NEmpty,
  NSelect,
  NSpace,
  NSpin,
  NText,
  type SelectOption,
  useMessage,
} from 'naive-ui'
import { computed, onMounted, ref } from 'vue'

import { useApi } from '@/composables/useApi'
import { useGameStore } from '@/store/game'
import type { Deck } from '@/types'

const message = useMessage()
const gameStore = useGameStore()

const selectedDeckId = ref<number | null>(null)
const decks = ref<Deck[]>([])

const deckOptions = computed<SelectOption[]>(() =>
  decks.value.map((deck) => ({
    label: deck.name,
    value: deck.id,
  })),
)

// Charger les decks de l'utilisateur
const loadDecks = async () => {
  try {
    const api = useApi()
    decks.value = await api.getMyDecks()
  } catch (error) {
    if (error instanceof Error) {
      message.error(error.message)
    }
  }
}

const createRoom = () => {
  if (selectedDeckId.value) {
    gameStore.createRoom(selectedDeckId.value)
  }
}

const joinRoom = (roomId: number) => {
  if (selectedDeckId.value) {
    gameStore.joinRoom(roomId, selectedDeckId.value)
  }
}

onMounted(() => {
  gameStore.connect()
  loadDecks()
})
</script>

<style scoped></style>
