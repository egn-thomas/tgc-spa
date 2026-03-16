<template>
  <NSpace vertical :size="24" style="width: 100%">
    <NSpace justify="space-between" align="center" style="width: 100%">
      <NText h2>Mes decks</NText>
      <NButton type="primary" @click="createDeck">Créer un deck</NButton>
    </NSpace>

    <NDataTable
      :columns="columns"
      :data="decks"
      :loading="loading"
      :pagination="false"
      :row-key="(row: Deck) => row.id"
    >
    </NDataTable>

    <div v-if="!loading && decks.length === 0">
      <NEmpty description="Vous n'avez encore aucun deck. Créez-en un !" />
    </div>
  </NSpace>
</template>

<script setup lang="ts">
import { type DataTableColumn, NButton, NSpace, useMessage } from 'naive-ui'
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
  return cards.value.filter((card) => cardIds.has(card.id))
}

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

const columns: DataTableColumn<Deck>[] = [
  {
    title: 'Nom',
    key: 'name',
  },
  {
    title: 'Cartes',
    key: 'cards',
    render: (row: Deck) =>
      h(
        'div',
        { class: 'deck-cards' },
        getDeckCards(row).map((card) =>
          h('img', {
            key: card.id,
            src: card.imgUrl,
            alt: card.name,
            title: card.name,
            class: 'deck-card-thumb',
            style: 'width: 40px; height: 40px; object-fit: contain;',
          }),
        ),
      ),
  },
  {
    title: 'Actions',
    key: 'actions',
    render: (row: Deck) =>
      h(
        NSpace,
        {},
        {
          default: () => [
            h(
              NButton,
              { size: 'small', text: true, onClick: () => viewDeck(row.id) },
              { default: () => 'Voir' },
            ),
            h(
              NButton,
              { size: 'small', text: true, onClick: () => editDeck(row.id) },
              { default: () => 'Modifier' },
            ),
            h(
              NButton,
              {
                size: 'small',
                text: true,
                type: 'error',
                onClick: () => handleDelete(row.id),
              },
              { default: () => 'Supprimer' },
            ),
          ],
        },
      ),
  },
]

onMounted(loadDecks)
onActivated(loadDecks)
</script>

<style scoped>
.deck-cards {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  align-items: center;
  max-width: 260px;
  max-height: 68px;
  overflow: hidden;
}
.deck-card-thumb {
  width: 30px;
  height: 30px;
  object-fit: contain;
  border-radius: 6px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}
</style>
