<template>
  <NSpace vertical :size="24" style="width: 100%">
    <NSpace justify="space-between" align="center" style="width: 100%">
      <NText h2>Mes decks</NText>
      <NButton type="primary" @click="createDeck">Créer un deck</NButton>
    </NSpace>

    <div
      v-if="loading"
      style="display: flex; justify-content: center; padding: 40px 0"
    >
      <NSpin />
    </div>

    <NGrid
      v-else-if="decks.length > 0"
      responsive="screen"
      cols="1 s:2 m:2 l:3"
      :x-gap="24"
      :y-gap="24"
    >
      <NGridItem v-for="deck in decks" :key="deck.id">
        <NCard :title="deck.name" segmented size="small" hoverable>
          <template #header-extra>
            <NDropdown :options="getDeckActions(deck.id)">
              <NButton text>⋮</NButton>
            </NDropdown>
          </template>

          <NSpace vertical :size="12" style="width: 100%">
            <div>
              <NText strong>{{ deck.cards.length }} cartes</NText>
            </div>
            <div class="deck-card-grid">
              <img
                v-for="card in getDeckCards(deck)"
                :key="card.id"
                :src="card.imgUrl"
                :alt="card.name"
                :title="card.name"
                class="deck-card-thumb"
              />
            </div>

            <NSpace horizontal :size="8" style="width: 100%; margin-top: 12px">
              <NButton size="small" type="primary" @click="viewDeck(deck.id)">
                Voir
              </NButton>
              <NButton size="small" @click="editDeck(deck.id)">
                Modifier
              </NButton>
            </NSpace>
          </NSpace>
        </NCard>
      </NGridItem>
    </NGrid>

    <div v-else style="display: flex; justify-content: center">
      <NEmpty description="Vous n'avez encore aucun deck. Créez-en un !" />
    </div>
  </NSpace>
</template>

<script setup lang="ts">
import {
  NButton,
  NCard,
  NGrid,
  NGridItem,
  NSpace,
  NSpin,
  useMessage,
  NDropdown,
  NText,
  NEmpty,
  type DropdownOption,
} from 'naive-ui'
import { h, onActivated, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useApi } from '@/composables/useApi'
import type { Card, Deck } from '@/types'

const router = useRouter()
const message = useMessage()
const api = useApi()

const loading = ref(false)
const decks = ref<Deck[]>([])
const cards = ref<Card[]>([])

const loadDecks = async () => {
  loading.value = true

  try {
    const [myDecks, allCards] = await Promise.all([
      api.getMyDecks(),
      api.getCards(),
    ])
    decks.value = myDecks
    cards.value = allCards
  } catch (error) {
    if (error instanceof Error) {
      message.error(error.message)
    }
  } finally {
    loading.value = false
  }
}

const getDeckCards = (deck: Deck) => {
  const cardIds = new Set(deck.cards.map((c) => c.cardId))
  return cards.value.filter((card) => cardIds.has(card.id)).slice(0, 5)
}

const getDeckActions = (deckId: number): DropdownOption[] => [
  {
    label: 'Voir',
    key: 'view',
    props: {
      onClick: () => viewDeck(deckId),
    },
  },
  {
    label: 'Modifier',
    key: 'edit',
    props: {
      onClick: () => editDeck(deckId),
    },
  },
  {
    type: 'divider',
    key: 'd1',
  },
  {
    label: 'Supprimer',
    key: 'delete',
    props: {
      onClick: () => handleDelete(deckId),
    },
  },
]

const handleDelete = async (deckId: number) => {
  const confirmed = window.confirm(
    'Supprimer ce deck ? Cette action est irréversible.',
  )
  if (!confirmed) return

  try {
    await api.deleteDeck(deckId)
    message.success('Deck supprimé avec succès.')
    loadDecks()
  } catch (error) {
    if (error instanceof Error) message.error(error.message)
  }
}

const createDeck = () => {
  router.push('/decks/new')
}

const viewDeck = (id: number) => router.push(`/decks/${id}`)
const editDeck = (id: number) => router.push(`/decks/${id}/edit`)

onMounted(loadDecks)
onActivated(loadDecks)
</script>

<style scoped>
.deck-card-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.deck-card-thumb {
  width: 40px;
  height: 40px;
  object-fit: contain;
  border-radius: 4px;
}
</style>
