<template>
  <div class="container">
    <div v-if="loading">
      <NSpin />
    </div>

    <div v-else-if="deck">
      <DeckForm
        title="Modifier le deck"
        submit-label="Enregistrer"
        :initial-name="deck.name"
        :initial-selected="selectedCardIds"
        :cards="cards"
        :submitting="saving"
        @submit="handleSubmit"
      />
    </div>

    <div v-else>
      <NEmpty description="Deck introuvable" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMessage } from 'naive-ui'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import DeckForm from '@/components/decks/DeckForm.vue'
import { useApi } from '@/composables/useApi'
import type { Card, Deck } from '@/types'

const route = useRoute()
const router = useRouter()
const message = useMessage()
const api = useApi()

const loading = ref(true)
const saving = ref(false)
const deck = ref<Deck | null>(null)
const cards = ref<Card[]>([])

const deckId = computed(() => route.params.id?.toString() ?? '')

const selectedCardIds = computed(
  () => deck.value?.cards.map((c) => c.cardId) ?? [],
)

const loadDeck = async () => {
  loading.value = true
  try {
    const [fetchedDeck, allCards] = await Promise.all([
      api.getDeck(deckId.value),
      api.getCards(),
    ])

    deck.value = fetchedDeck
    const cardIds = new Set(fetchedDeck.cards.map((c) => c.cardId))
    cards.value = allCards

    // Ensure selected cards are still available in the card list
    if (!cards.value.some((card) => cardIds.has(card.id))) {
      cards.value = allCards
    }
  } catch (error) {
    if (error instanceof Error) message.error(error.message)
  } finally {
    loading.value = false
  }
}

const handleSubmit = async ({
  name,
  cards: selected,
}: {
  name: string
  cards: number[]
}) => {
  if (!deck.value) return

  saving.value = true
  try {
    await api.updateDeck(deck.value.id, { name, cards: selected })
    message.success('Deck mis à jour.')
    router.push(`/decks/${deck.value.id}`)
  } catch (error) {
    if (error instanceof Error) message.error(error.message)
  } finally {
    saving.value = false
  }
}

onMounted(loadDeck)
</script>
