<template>
  <NSpace vertical :size="24" style="width: 100%">
    <div style="max-width: 900px; margin: 0 auto; width: 100%">
      <Lobby />
    </div>

    <div style="max-width: 900px; margin: 0 auto; width: 100%">
      <DeckList />
    </div>
  </NSpace>
</template>

<script setup lang="ts">
import { NSpace } from 'naive-ui'

import DeckList from '@/components/decks/DeckList.vue'
import Lobby from '@/components/game/Lobby.vue'
</script>
