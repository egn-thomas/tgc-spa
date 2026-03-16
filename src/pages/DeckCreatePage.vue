<template>
  <div class="container">
    <DeckForm
      title="Créer un nouveau deck"
      submit-label="Créer"
      :submitting="loading"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { useMessage } from 'naive-ui'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import DeckForm from '@/components/decks/DeckForm.vue'
import { useApi } from '@/composables/useApi'

const router = useRouter()
const message = useMessage()
const api = useApi()

const loading = ref(false)

const handleSubmit = async ({
  name,
  cards,
}: {
  name: string
  cards: number[]
}) => {
  loading.value = true
  try {
    const deck = await api.createDeck({ name, cards })
    console.log('Deck created:', deck)
    message.success('Deck créé avec succès.')
    router.push(`/decks/${deck.id}`)
  } catch (error) {
    if (error instanceof Error) message.error(error.message)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  console.log('DeckCreatePage mounted')
})
</script>
