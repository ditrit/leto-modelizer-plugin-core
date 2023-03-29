<template>
  <div>
    <div>
      <h1>Demo of default drawing in leto-modelizer</h1>
    </div>
    <div>
      <button @click="savePosition">Save position</button>
    </div>
    <div id='root' style="border: 1px solid black;"></div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import resources from './assets/resources';
import DemoPlugin from '@/DemoPlugin';
import { ComponentDrawOption, FileInput } from 'leto-modelizer-plugin-core';

function next(data) {
  console.log(data);
}

function savePosition() {
  const configuration = new FileInput({ path: 'localstorage', content: '' });
  plugin.render(configuration);
  window.localStorage.setItem('configuration', configuration.content);
}

const plugin = new DemoPlugin(next);
const defaultConfiguration = JSON.stringify({
  demo: {
    internal1: new ComponentDrawOption({
      x: 42,
      y: 666,
      width: 242,
      height: 50,
    }),
  }
});

plugin.init();

plugin.initResources(resources);

onMounted(() => {
  plugin.parse(new FileInput({
    path: 'localstorage',
    content: window.localStorage.getItem('configuration') || defaultConfiguration,
  }));
  plugin.draw('root');
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
.disabled{
  opacity: 0.5;
  cursor: not-allowed;
}

#root {
  width: 80vw;
  height: 60vh;
}
</style>
