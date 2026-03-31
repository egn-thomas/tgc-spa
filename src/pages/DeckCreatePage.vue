<template>
  <div class="page">
    <div class="page__header">
      <NButton text class="page__back" @click="router.back()"> Retour </NButton>
      <NText class="page__title" h2> Créer un deck </NText>
    </div>

    <div class="page__content">
      <DeckForm
        title="Créer un nouveau deck"
        submit-label="Créer"
        :submitting="loading"
        @submit="handleSubmit"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { NButton, NText, useMessage } from 'naive-ui'
import { ref } from 'vue'
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
    message.success('Deck créé avec succès.')
    router.push(`/decks/${deck.id}`)
  } catch (error) {
    if (error instanceof Error) message.error(error.message)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.page {
  max-width: 100%;
  margin: 0 auto;
  padding: 16px;
}

@media (min-width: 768px) {
  .page {
    max-width: 980px;
    padding: 24px 0;
  }
}

.page__header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.page__back {
  min-width: 100px;
}

.page__title {
  flex: 1;
}

.page__content {
  background: #f6f8fa;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.06);
}
</style>
