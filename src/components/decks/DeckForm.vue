<template>
  <NCard :title="title">
    <NForm ref="formRef" :model="form" :rules="rules">
      <NFormItem label="Nom du deck" path="name">
        <NInput v-model:value="form.name" placeholder="Ex: Flammes du désert" />
      </NFormItem>

      <NFormItem label="Cartes sélectionnées">
        <NSpace align="center" justify="space-between" style="width: 100%">
          <NText>
            {{ selectedIds.length }} / {{ maxCards }}
            <span v-if="selectedIds.length !== maxCards"
              >(doit être exactement {{ maxCards }})</span
            >
          </NText>
          <NButton
            v-if="selectedIds.length"
            size="small"
            text
            @click="clearSelection"
          >
            Tout désélectionner
          </NButton>
        </NSpace>
      </NFormItem>

      <NFormItem>
        <NButton
          type="primary"
          :disabled="!canSubmit"
          :loading="submitting"
          block
          @click="submit"
        >
          {{ submitLabel }}
        </NButton>
      </NFormItem>

      <CardGrid
        v-model:model-value="selectedIds"
        :cards="cards"
        :max-selection="maxCards"
        :size="cardSize"
        :selectable="true"
      />
    </NForm>
  </NCard>
</template>

<script setup lang="ts">
import { type FormInst, useMessage } from 'naive-ui'
import { computed, onMounted, ref, watch } from 'vue'

import CardGrid from '@/components/cards/CardGrid.vue'
import { useApi } from '@/composables/useApi'
import type { Card } from '@/types'

const props = defineProps<{
  title: string
  submitLabel: string
  initialName?: string
  initialSelected?: number[]
  maxCards?: number
  cardSize?: 'sm' | 'md'
  submitting?: boolean
  cards?: Card[]
}>()

const emits = defineEmits<{
  (e: 'submit', payload: { name: string; cards: number[] }): void
  (e: 'loaded', cards: Card[]): void
}>()

const api = useApi()
const message = useMessage()

const maxCards = computed(() => props.maxCards ?? 10)
const cardSize = computed(() => props.cardSize ?? 'md')

const formRef = ref<FormInst | null>(null)
const form = ref({ name: props.initialName ?? '' })
const selectedIds = ref<number[]>([...(props.initialSelected ?? [])])

const submitting = computed(() => props.submitting ?? false)

const rules = {
  name: [{ required: true, message: 'Le nom est requis', trigger: 'blur' }],
}

const cards = ref<Card[]>(props.cards ?? [])

const canSubmit = computed(
  () => !!form.value.name.trim() && selectedIds.value.length === maxCards.value,
)

const loadCards = async () => {
  if (cards.value.length) return
  try {
    console.log('Loading cards...')
    cards.value = await api.getCards()
    console.log('Cards loaded:', cards.value.length)
    emits('loaded', cards.value)
  } catch (error) {
    console.error('Error loading cards:', error)
    if (error instanceof Error) message.error(error.message)
  }
}

const clearSelection = () => {
  selectedIds.value = []
}

const submit = async () => {
  await formRef.value?.validate()
  if (!canSubmit.value) return

  emits('submit', {
    name: form.value.name.trim(),
    cards: selectedIds.value,
  })
}

onMounted(loadCards)

watch(
  () => props.initialSelected,
  (next) => {
    if (next) selectedIds.value = [...next]
  },
)

watch(
  () => props.initialName,
  (next) => {
    if (next !== undefined) form.value.name = next
  },
)

watch(selectedIds, (newIds) => {
  console.log('Selected IDs changed:', newIds)
})
</script>
