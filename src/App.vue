<script setup lang="ts">
import { ref } from 'vue';
import { createEvent } from './services/EventService';
import type { EventModel } from './models/EventModel';

const newEvent = ref('');

const handleCreateEvent = async () => {
  if (newEvent.value.trim() !== '') {
    try {

      const event: EventModel = {
        name: newEvent.value,
        description: '',
      };

      await createEvent(event);

      alert('Evento creado con éxito');
    } catch (error) {
      console.error('Error al crear el evento:', error);
      alert('Hubo un error al crear el evento');
    }
  } else {
    alert('El campo de evento no puede estar vacío');
  }
};
</script>

<template>
  <div class="flex items-center justify-center h-screen">
    <div class="flex items-center border-2 border-black">
      <input type="text" placeholder="Nuevo Evento" class="input-box px-4 py-2 w-60 focus:outline-none"
        v-model="newEvent">
      <button class="black-button px-6 py-2 font-bold" @click="handleCreateEvent">
        Crear
      </button>
    </div>
  </div>
</template>

<style scoped></style>
