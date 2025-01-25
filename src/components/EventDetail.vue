<template>
  <div class="event-detail">
    <h1>Detalles del Evento</h1>
    <p>ID del Evento: {{ uid }}</p>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps<{
  uid: string;
}>();

console.log(props.uid);
</script>

<style scoped>
.event-detail {
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
}
</style> 