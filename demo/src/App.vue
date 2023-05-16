<template>
  <main>
    <div>
      <h1>Demo of default drawing in leto-modelizer</h1>
    </div>
    <div>
      <button @click="savePosition">Save position</button>
      <button class="reset-btn" @click="reset">Reset UI</button>
      <label for="read-only-checkbox">Read-only ?</label>
      <input
        id="read-only-checkbox"
        type="checkbox"
        v-model="readOnly"
        @change="reset"
      />
    </div>
    <div id='root'></div>
  </main>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import resources from './assets/resources';
import DemoPlugin from '@/DemoPlugin';
import { Component, ComponentDrawOption, FileInput } from 'leto-modelizer-plugin-core';

const readOnly = ref(false);

function next(data) {
  console.log(data);
}

function savePosition() {
  const configuration = new FileInput({ path: 'localstorage', content: '' });
  plugin.render(configuration);
  window.localStorage.setItem('configuration', configuration.content);
}

function reset() {
  document.querySelector('#root').innerHTML = '';
  plugin.draw('root', readOnly.value);
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
*, *::before, *::after {
  margin: 0;
  padding: 0;

  box-sizing: border-box;
}

body {
  height: 100vh;

  overflow: hidden;
}
#app {
  color: #2c3e50;
  text-align: center;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

main {
  height: 100vh;

  display: grid;
  grid-template-rows: 2.5em 1.5em 1fr;
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
  width: 100%;
  height: 100%;

  border: 1px solid black;
}
</style>
