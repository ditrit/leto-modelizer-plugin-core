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

function onSelect({ isSelected, id }) {
  console.log('Select event', id, isSelected);
}
function onEdit({ id }) {
  console.log('Edit event', id);
}
function onDelete({ id }) {
  console.log('Delete event', id);
}
function savePosition() {
  const configuration = new FileInput({ path: 'localstorage', content: '' });
  plugin.render(configuration);
  window.localStorage.setItem('configuration', configuration.content);
}

const plugin = new DemoPlugin();
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

plugin.init({
  SelectEvent: { next: onSelect },
  EditEvent: { next: onEdit },
  DeleteEvent: { next: onDelete },
});

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
</style>
