<template>
  <div class="container">
    <NSpace vertical :size="24" style="width: 100%">
      <NSpace justify="space-between" align="center" style="width: 100%">
        <NText h2>Deck : {{ deck?.name ?? '...' }}</NText>
        <NSpace>
          <NButton
            type="primary"
            :disabled="loading || !deck"
            @click="goToEdit"
          >
            Modifier
          </NButton>
          <NButton @click="goHome">Retour</NButton>
        </NSpace>
      </NSpace>

      <div v-if="loading">
        <NSpin />
      </div>

      <div v-else-if="deck">
        <CardGrid :cards="cards" :selectable="false" :size="'md'" />
      </div>

      <div v-else>
        <NEmpty description="Deck introuvable" />
      </div>
    </NSpace>
  </div>
</template>

<script setup lang="ts">
import { useMessage } from 'naive-ui'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import CardGrid from '@/components/cards/CardGrid.vue'
import { useApi } from '@/composables/useApi'
import type { Card, Deck } from '@/types'

const route = useRoute()
const router = useRouter()
const api = useApi()
const message = useMessage()

const loading = ref(true)
const deck = ref<Deck | null>(null)
const cards = ref<Card[]>([])

const deckId = computed(() => route.params.id?.toString() ?? '')

const loadDeck = async () => {
  loading.value = true
  try {
    const [fetchedDeck, allCards] = await Promise.all([
      api.getDeck(deckId.value),
      api.getCards(),
    ])

    deck.value = fetchedDeck

    const cardIds = new Set(fetchedDeck.cards.map((c) => c.cardId))
    cards.value = allCards.filter((card) => cardIds.has(card.id))
  } catch (error) {
    if (error instanceof Error) message.error(error.message)
  } finally {
    loading.value = false
  }
}

const goHome = () => router.push('/')
const goToEdit = () => {
  if (deck.value) router.push(`/decks/${deck.value.id}/edit`)
}

onMounted(loadDeck)
</script>
