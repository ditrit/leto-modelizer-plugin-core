<template>
  <div>
    <div>
      <h1>Demo of default drawing in leto-modelizer</h1>
    </div>
    <div>
      <svg id='root' width='80vw' height='80vh' style='border: 1px solid black'></svg>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { DefaultDrawer } from 'leto-modelizer-plugin-core';
import resources from './assets/resources';
import plugin from './assets/data';

const drawer = new DefaultDrawer(resources, 'root');

onMounted(() => {
  drawer.draw(plugin.components);
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

#viewport {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>