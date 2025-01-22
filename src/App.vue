<script setup lang="ts">
</script>

<template>
  <div class="flex items-center justify-center h-screen">
    <div class="flex items-center border-2 border-black">
      <!-- Input del nuevo evento -->
      <input type="text" placeholder="Nuevo Evento" class="input-box px-4 py-2 w-60 focus:outline-none">
      <!-- Botón de Crear -->
      <button class="create-button px-6 py-2 font-bold">Crear</button>
    </div>
  </div>
</template>

<style scoped>

.input-box {
  border: 2px solid black;
}

.create-button {
  background-color: black;
  color: white;
  border: 2px solid black;
}

.create-button:hover {
  background-color: white;
  color: black;
}


</style>
