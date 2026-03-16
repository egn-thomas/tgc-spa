<template>
  <NCard
    :class="cardClass"
    :bordered="true"
    :hoverable="!isDisabled"
    @click="handleClick"
  >
    <div class="card-item__image">
      <img :src="card.imgUrl" :alt="card.name" />
    </div>

    <div class="card-item__content">
      <div class="card-item__header">
        <div class="card-item__title">
          <span class="card-item__number">#{{ card.pokedexNumber }}</span>
          <span class="card-item__name">{{ card.name }}</span>
        </div>
        <NTag
          :style="{ backgroundColor: typeColor }"
          size="small"
          type="default"
        >
          {{ card.type }}
        </NTag>
      </div>

      <div class="card-item__stats">
        <div class="card-item__stat">
          <NText depth="2">HP</NText>
          <NText>{{ card.hp }}</NText>
        </div>
        <div class="card-item__stat">
          <NText depth="2">ATK</NText>
          <NText>{{ card.attack }}</NText>
        </div>
      </div>

      <div v-if="hasHpBar" class="card-item__hp">
        <div class="card-item__hp-bar">
          <div
            class="card-item__hp-fill"
            :style="{ width: `${hpPercent}%`, backgroundColor: currentHpColor }"
          />
        </div>
        <span class="card-item__hp-label">{{ currentHp }} / {{ card.hp }}</span>
      </div>
    </div>
  </NCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { useColors } from '@/composables/useColors'
import type { Card } from '@/types'

const props = defineProps<{
  card: Card
  size?: 'sm' | 'md'
  selectable?: boolean
  selected?: boolean
  disabled?: boolean
  currentHp?: number
}>()

const emits = defineEmits<(e: 'click') => void>()

const { getTypeColor, hpColor } = useColors()

const typeColor = computed(() => getTypeColor(props.card.type))
const isDisabled = computed(() => !!props.disabled)
const isSelected = computed(() => !!props.selected)

const cardClass = computed(() => [
  'card-item',
  `card-item--${props.size ?? 'md'}`,
  {
    'card-item--selected': isSelected.value,
    'card-item--disabled': isDisabled.value,
  },
])

const hasHpBar = computed(() => props.currentHp !== undefined)
const hpPercent = computed(() => {
  if (props.currentHp === undefined) return 0
  return Math.max(0, Math.min(100, (props.currentHp / props.card.hp) * 100))
})
const currentHpColor = computed(() => {
  if (props.currentHp === undefined) return '#d9d9d9'
  return hpColor(hpPercent.value)
})

const currentHp = computed(() => props.currentHp)

const handleClick = () => {
  console.log(
    'Card clicked:',
    props.card.id,
    'disabled:',
    isDisabled.value,
    'selectable prop:',
    props.selectable,
    'typeof selectable:',
    typeof props.selectable,
  )
  if (isDisabled.value || props.selectable === false) return
  emits('click')
}
</script>

<style scoped>
.card-item {
  cursor: pointer;
  transition:
    transform 160ms ease,
    box-shadow 160ms ease;
  user-select: none;
}

.card-item--sm {
  width: 160px;
}

.card-item--md {
  width: 220px;
}

.card-item--selected {
  border-color: var(--n-color-primary);
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  transform: translateY(-2px);
}

.card-item--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.card-item__image {
  width: 100%;
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.02);
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.card-item__image img {
  height: 100%;
  width: auto;
  object-fit: contain;
}

.card-item__content {
  padding: 12px;
}

.card-item__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.card-item__title {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.card-item__number {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.5);
}

.card-item__name {
  font-weight: 600;
  font-size: 14px;
}

.card-item__stats {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.card-item__stat {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
}

.card-item__hp {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.card-item__hp-bar {
  width: 100%;
  height: 8px;
  background: rgba(0, 0, 0, 0.08);
  border-radius: 4px;
  overflow: hidden;
}

.card-item__hp-fill {
  height: 100%;
  transition: width 200ms ease;
}

.card-item__hp-label {
  font-size: 11px;
  color: rgba(0, 0, 0, 0.6);
}
</style>
