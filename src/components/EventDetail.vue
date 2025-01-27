<script setup lang="ts">
import { reactive, ref, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import VueTailwindDatepicker from 'vue-tailwind-datepicker';
import { createAvailability, deleteAvailability, getAvailabilityByEventId } from '../services/AvailabilityService';
import type { AvailabilityModel } from '../models/AvailabilityModel';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from "vue-toastification";
import { getEventById, updateEvent } from '../services/EventService';
import { getCommonDateList } from '../factory/EventDateFactory';

dayjs.extend(customParseFormat);

const route = useRoute();
const router = useRouter();
const datesList = reactive<AvailabilityModel[]>([]);
const allDatesList = reactive<AvailabilityModel[]>([]);
const commonDatesList = reactive<AvailabilityModel[]>([]);
const loading = ref(false);
const participants = ref(0);
const eventTitle = ref('');
const previousTitle = ref('');
const isAdmin = ref(false);

let uid = route.params.uid as string;
let user = localStorage.getItem('userId') as string;

watchEffect(async () => {
  if (!user) {
    user = uuidv4();
    localStorage.setItem('userId', user);
  }

  if (uid) {
    try {
      loading.value = true;
      const event = await getEventById(uid);

      if (!event) {
        throw new Error('No se encontró el evento');
      }

      eventTitle.value = event.name;
      previousTitle.value = event.name;
      isAdmin.value = event.admin_id == user;

      const availability = await getAvailabilityByEventId(uid);
      allDatesList.push(...availability);
      datesList.push(...availability.filter(f => f.participant_id == user));

      updateParticipantsAndCommonDates(availability);

    } catch (err) {
      console.error('Error al obtener el evento:', err);
      router.push({ name: 'Home' });
    } finally {
      loading.value = false;
    }
  }
});

const toast = useToast();

const eventDate = ref({
  startDate: "",
  endDate: "",
});
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
  if (!eventDate.value.startDate) {
    return;
  }
  const { startDate, endDate } = eventDate.value;
  const dateIni = dayjs(startDate, 'DD/MM/YYYY').toDate();
  const dateEnd = dayjs(endDate, 'DD/MM/YYYY').toDate();

  try {
    const newAvailability: AvailabilityModel = {
      start_date: dateIni,
      end_date: dateEnd,
      participant_id: user,
      event_id: uid
    };

    const availability = await createAvailability(newAvailability);
    datesList.push(availability);
    allDatesList.push(availability);

    updateParticipantsAndCommonDates(allDatesList);

    eventDate.value = {
      startDate: "",
      endDate: "",
    };

    toast.success('Rango de fechas agregadas con éxito', {
      toastClassName: 'bg-gray-800 text-white rounded-lg shadow-lg p-4 flex items-center',
    });
  } catch (error) {
    console.error('Error al crear disponibilidad:', error);
    toast.error(error, {
      toastClassName: 'bg-rose-700 text-white rounded-lg shadow-lg p-4 flex items-center',
    });
  }
}

const formatDate = (date: Date) => {
  return dayjs(date).format('DD/MM/YYYY');
}

const handleDeleteDate = async (dateId?: string) => {
  if (!dateId) {
    return;
  }

  try {
    await deleteAvailability(dateId);
    datesList.splice(0, datesList.length, ...datesList.filter(date => date.id !== dateId));
    allDatesList.splice(0, allDatesList.length, ...allDatesList.filter(date => date.id !== dateId));

    updateParticipantsAndCommonDates(allDatesList);

    toast.success('Rango de fechas eliminados con éxito', {
      toastClassName: 'bg-gray-800 text-white rounded-lg shadow-lg p-4 flex items-center',
    });
  } catch (error) {
    console.error('Error al eliminar disponibilidad:', error);
    toast.error(error, {
      toastClassName: 'bg-rose-700 text-white rounded-lg shadow-lg p-4 flex items-center',
    });
  }
}

const updateParticipantsAndCommonDates = (availabilityList: AvailabilityModel[]) => {
  const participantsGroup = availabilityList.reduce((acc, current) => {
    if (!acc[current.participant_id]) {
      acc[current.participant_id] = [];
    }
    acc[current.participant_id].push(current);
    return acc;
  }, {} as Record<string, AvailabilityModel[]>);

  participants.value = Object.keys(participantsGroup).length;
  commonDatesList.splice(0, commonDatesList.length,
    ...getCommonDateList(participants.value > 1 ? availabilityList : []));
}

const handleUpdateEventTitle = async () => {
  try {
    if (previousTitle.value && eventTitle.value) {
      await updateEvent(uid, { name: eventTitle.value });
      toast.success('Título del evento actualizado con éxito', {
        toastClassName: 'bg-gray-800 text-white rounded-lg shadow-lg p-4 flex items-center',
      });
      previousTitle.value = eventTitle.value;
    }
  } catch (error) {
    console.error('Error al actualizar el título del evento:', error);
    toast.error('Error al actualizar el título del evento', {
      toastClassName: 'bg-rose-700 text-white rounded-lg shadow-lg p-4 flex items-center',
    });
  }
};
</script>

<style scoped>
.rotate {
  transition: transform 0.5s;
  transform: rotate(360deg);
}
</style>

<template>
  <div class="flex items-center justify-center h-screen">
    <div
      :class="['max-w-6xl mx-auto p-8 bg-white text-black shadow-md border-4 border-black', { 'opacity-50 cursor-not-allowed': loading }]">
      <div v-if="isAdmin" class="flex items-center justify-center">
        <input v-model="eventTitle" type="text"
          class="uppercase text-center text-2xl font-bold mb-4 border-black focus:outline-none focus:border-black"
          @blur="handleUpdateEventTitle">
      </div>
      <h1 v-else class="uppercase text-center text-2xl font-bold mb-4">{{ eventTitle }}</h1>
      <div class="flex items-center justify-between space-x-4 mb-4">
        <vue-tailwind-datepicker v-model="eventDate" :formatter="formatter" :i18n="i18n" :options="options"
          placeholder="Selecciona una fecha" :disable-date="dDate"
          input-classes="border-4 border-black px-4 py-2 w-full focus:outline-none focus:ring-black" />
        <button @click="handleAddDate"
          class="border-4 border-black px-8 py-2 bg-black text-white shadow hover:bg-white hover:text-black font-bold">Agregar</button>
      </div>

      <div class="grid grid-cols-3 gap-4">
        <div
          class="col-span-1 bg-black text-white p-4 border-4 border-black min-w-[250px] max-h-[300px] overflow-y-auto">
          <h3 v-if="datesList.length > 0" class="text-lg font-bold mb-6">Mis Fechas Propuestas</h3>
          <h3 v-else class="text-lg font-bold mb-6">No hay fechas ingresadas</h3>
          <ul class="space-y-4">
            <li v-for="date in datesList" :key="date.id">
              <div class="flex items-center justify-between">
                <span class="text-gray-300 mr-1">
                  {{ formatDate(date.start_date) }} <span class="font-bold mx-2">-</span> {{ formatDate(date.end_date)
                  }}
                </span>
                <button aria-label="Eliminar fecha" @click="handleDeleteDate(date.id)"
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
          </ul>
        </div>

        <div class="col-span-2 p-4 bg-white border-4 border-black">
          <div class="flex justify-between items-center mb-6">
            <h3 v-if="commonDatesList.length > 0" class="text-lg font-bold">Fechas disponibles del {{ currentYear }} de
              {{ participants }} participantes
            </h3>
            <h3 v-else class="text-lg font-bold">No hay relacionadas</h3>
            <!-- <button aria-label="Recargar fechas"
              class="text-black-500 hover:text-black-700 flex items-center justify-end ml-auto">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                class="icon icon-tabler icons-tabler-outline icon-tabler-rotate-clockwise">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M4.05 11a8 8 0 1 1 .5 4m-.5 5v-5h5" />
              </svg>
            </button> -->
          </div>
          <ul class="space-y-4">
            <li v-for="date in commonDatesList" class="text-gray-700 flex">
              <span>{{ formatDate(date.start_date) }} - {{ formatDate(date.end_date) }}</span>
            </li>
          </ul>
        </div>
      </div>

      <p class="text-center text-gray-500 text-sm mt-8">Creado por allydevper</p>
    </div>
  </div>
</template>