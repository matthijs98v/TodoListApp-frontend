<script setup>
  import { RouterView } from 'vue-router'
  import { useWebsocketStore } from './stores/websocketStore';

  // Make connection with the websockets
  const websocketStore = useWebsocketStore();
  websocketStore.connect();
</script>

<template>
  <RouterView />
</template>