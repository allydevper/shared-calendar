<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import VueTailwindDatepicker from 'vue-tailwind-datepicker';
import { createAvailability } from '../services/AvailabilityService';
import type { AvailabilityModel } from '../models/AvailabilityModel';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { v4 as uuidv4 } from 'uuid';

dayjs.extend(customParseFormat);

let user = localStorage.getItem('userId');
if (!user) {
  user = uuidv4();
  localStorage.setItem('userId', user);
}

const route = useRoute();
const uid = route.params.uid as string;
console.log(uid);

const eventDate = ref('');
const formatter = ref({
  date: 'DD/MM/YYYY',
  month: 'MMM',
})

const i18n = ref('es-PE')

const currentYear = new Date().getFullYear();

const options = ref({
  shortcuts: {
    today: 'Hoy',
    yesterday: 'Ayer',
    past: (period: number) => `Últimos ${period} días`,
    currentMonth: 'Mes actual',
    pastMonth: 'Mes anterior'
  },
  footer: {
    apply: 'Aplicar',
    cancel: 'Cancelar'
  }
})

const dDate = (date: Date) => {
  return date.getFullYear() < currentYear || date.getFullYear() > currentYear
}

const handleAddDate = async () => {
  if (!eventDate.value) {
    return;
  }

  const [startDate, endDate] = eventDate.value.split('~').map(date => dayjs(date.trim(), 'DD/MM/YYYY').toDate());
  const dateIni = startDate;
  const dateEnd = endDate;

  console.log({ dateIni, dateEnd });

  try {
    const newAvailability: AvailabilityModel = {
      start_date: dateIni,
      end_date: dateEnd,
      participant_id: user,
      event_id: uid
    };

    await createAvailability(newAvailability);
    eventDate.value = ''; // Limpiar el campo después de crear
  } catch (error) {
    console.error('Error al crear disponibilidad:', error);
  }
}
</script>

<style scoped>
.rotate {
  transition: transform 0.5s;
  transform: rotate(360deg);
}
</style>

<template>
  <div class="flex items-center justify-center h-screen">
    <div class="max-w-6xl mx-auto p-8 bg-white text-black shadow-md border-4 border-black">
      <div class="flex items-center justify-between space-x-4 mb-4">
        <vue-tailwind-datepicker v-model="eventDate" :formatter="formatter" :i18n="i18n" :options="options"
          placeholder="Selecciona una fecha" :disable-date="dDate"
          input-classes="border-4 border-black px-4 py-2 w-full focus:outline-none focus:ring-black" />
        <button @click="handleAddDate"
          class="border-4 border-black px-8 py-2 bg-black text-white shadow hover:bg-white hover:text-black font-bold">Agregar</button>
      </div>

      <div class="grid grid-cols-3 gap-4">
        <div class="col-span-1 bg-black text-white p-4 border-4 border-black">
          <h3 class="text-lg font-bold mb-6">Mis Fechas</h3>
          <ul class="space-y-6">
            <li class="mb-4">
              <div class="flex items-center justify-between">
                <span class="text-gray-300 mr-1">01/01/2025 <span class="font-bold mx-2">-</span> 02/01/2025</span>
                <button aria-label="Eliminar fecha"
                  class="text-white-500 hover:text-white-700 flex items-center justify-end ml-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor"
                    class="icon icon-tabler icons-tabler-filled icon-tabler-square-rounded-minus">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path
                      d="M12 2l.324 .001l.318 .004l.616 .017l.299 .013l.579 .034l.553 .046c4.785 .464 6.732 2.411 7.196 7.196l.046 .553l.034 .579c.005 .098 .01 .198 .013 .299l.017 .616l.005 .642l-.005 .642l-.017 .616l-.013 .299l-.034 .579l-.046 .553c-.464 4.785 -2.411 6.732 -7.196 7.196l-.553 .046l-.579 .034c-.098 .005 -.198 .01 -.299 .013l-.616 .017l-.642 .005l-.642 -.005l-.616 -.017l-.299 -.013l-.579 -.034l-.553 -.046c-4.785 -.464 -6.732 -2.411 -7.196 -7.196l-.046 -.553l-.034 -.579a28.058 28.058 0 0 1 -.013 -.299l-.017 -.616c-.003 -.21 -.005 -.424 -.005 -.642l.001 -.324l.004 -.318l.017 -.616l.013 -.299l.034 -.579l.046 -.553c.464 -4.785 2.411 -6.732 7.196 -7.196l.553 -.046l.579 -.034c.098 -.005 .198 -.01 .299 -.013l.616 -.017c.21 -.003 .424 -.005 .642 -.005zm3 9h-6l-.117 .007a1 1 0 0 0 .117 1.993h6l.117 -.007a1 1 0 0 0 -.117 -1.993z" />
                  </svg>
                </button>
              </div>
            </li>
            <!-- Repite para otros elementos de la lista -->
          </ul>
        </div>

        <div class="col-span-2 p-4 bg-white border-4 border-black">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-bold">Fechas disponibles del {{ currentYear }}</h3>
            <button aria-label="Recargar fechas"
              class="text-black-500 hover:text-black-700 flex items-center justify-end ml-auto">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                class="icon icon-tabler icons-tabler-outline icon-tabler-rotate-clockwise">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M4.05 11a8 8 0 1 1 .5 4m-.5 5v-5h5" />
              </svg>
            </button>
          </div>
          <ul class="space-y-4">
            <li class="text-gray-700 flex">
              <span class="font-bold w-32">- Enero '25</span>
              <span class="font-bold mx-2">:</span>
              <span>1, 2, 3, 4</span>
            </li>
            <!-- Repite para otros elementos de la lista -->
          </ul>
        </div>
      </div>

      <p class="text-center text-gray-500 text-sm mt-8">Creado por allydevper</p>
    </div>
  </div>
</template>