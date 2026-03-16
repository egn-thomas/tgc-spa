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
      :row-key="(row: { id: BigInteger }) => row.id"
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
import type { Deck } from '@/types'

const router = useRouter()
const message = useMessage()
const api = useApi()

const loading = ref(false)
const decks = ref<Deck[]>([])

const loadDecks = async () => {
  loading.value = true
  try {
    decks.value = await api.getMyDecks()
  } catch (error) {
    if (error instanceof Error) {
      message.error(error.message)
    }
  } finally {
    loading.value = false
  }
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
    key: 'cardsCount',
    render: (row: Deck) => String(row.cards.length),
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
