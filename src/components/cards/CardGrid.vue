<template>
  <div class="card-grid">
    <CardItem
      v-for="card in cards"
      :key="card.id"
      :card="card"
      :size="size"
      :selectable="selectable"
      :selected="selectedSet.has(card.id)"
      :disabled="isCardDisabled(card)"
      :current-hp="currentHpMap?.[card.id]"
      @click="toggleSelection(card.id)"
    />
    <div v-if="cards.length === 0" class="card-grid__empty">
      <NEmpty description="Aucune carte disponible" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import type { Card } from '@/types'

import CardItem from './CardItem.vue'

const props = defineProps<{
  cards: Card[]
  modelValue?: number[]
  maxSelection?: number
  size?: 'sm' | 'md'
  selectable?: boolean
  currentHpMap?: Record<number, number>
}>()

const emits = defineEmits<(e: 'update:modelValue', value: number[]) => void>()

const maxSelection = computed(() => props.maxSelection ?? 10)
const selectedSet = computed(() => new Set(props.modelValue ?? []))

const selectionCount = computed(() => selectedSet.value.size)

const selectable = computed(() => {
  const val = props.selectable ?? true
  return val
})
const size = computed(() => props.size ?? 'md')

const isCardDisabled = (card: Card) => {
  if (!selectable.value) return false
  const alreadySelected = selectedSet.value.has(card.id)
  const reachedMax = selectionCount.value >= maxSelection.value
  return !alreadySelected && reachedMax
}

const toggleSelection = (cardId: number) => {
  const selected = new Set(selectedSet.value)
  if (selected.has(cardId)) {
    selected.delete(cardId)
  } else {
    if (selectionCount.value >= maxSelection.value) return
    selected.add(cardId)
  }
  emits('update:modelValue', Array.from(selected))
}
</script>

<style scoped>
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  align-items: start;
}

.card-grid__empty {
  grid-column: 1 / -1;
  display: flex;
  justify-content: center;
  padding: 40px 0;
}
</style>
