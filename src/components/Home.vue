<script setup lang="ts">
import { ref } from 'vue';
import { createEvent } from '../services/EventService';
import type { EventModel } from '../models/EventModel';
import { useToast } from "vue-toastification";
import { useRouter } from 'vue-router';

const newEvent = ref('');
const toast = useToast();
const router = useRouter();

const handleCreateEvent = async () => {
  if (newEvent.value.trim() !== '') {
    try {
      const event: EventModel = {
        name: newEvent.value,
        description: '',
      };

      const result = await createEvent(event);
      const uid = result.id;

      toast.success('Evento creado con éxito', {
        toastClassName: 'bg-gray-800 text-white rounded-lg shadow-lg p-4 flex items-center',
      });

      router.push({ name: 'EventDetail', params: { uid } });

    } catch (error) {
      console.error('Error al crear el evento:', error);
      toast.error(error, {
        toastClassName: 'bg-rose-700 text-white rounded-lg shadow-lg p-4 flex items-center',
      });
    }
  } else {
    toast.error('El campo de evento no puede estar vacío', {
      toastClassName: 'bg-rose-700 text-white rounded-lg shadow-lg p-4 flex items-center',
    });
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