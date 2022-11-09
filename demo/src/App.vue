<template>
  <div>
    <div>
      <h1>Demo of default drawing in leto-modelizer</h1>
    </div>
    <div id='root' style="border: 1px solid black;">
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import resources from './assets/resources';
import DemoPlugin from '@/DemoPlugin';

function onSelect({ isSelected, id }) {
  console.log('Select event', id, isSelected);
}
function onEdit({ id }) {
  console.log('Edit event', id);
}
function onDelete({ id }) {
  console.log('Delete event', id);
}

const plugin = new DemoPlugin();

plugin.init({
  SelectEvent: { next: onSelect },
  EditEvent: { next: onEdit },
  DeleteEvent: { next: onDelete },
});

plugin.initResources(resources);

onMounted(() => {
  plugin.parse();
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
