<template>
  <main>
    <div>
      <h1>
        Demo of default drawing in leto-modelizer
      </h1>
    </div>
    <div>
      <button @click="savePosition">
        Save position
      </button>
      <button
        class="reset-btn"
        @click="reset"
      >
        Reset UI
      </button>
      <button
        id="add-component-button"
        @click="addComponent"
      >
        Add component
      </button>
      <button
          id="automatic-layout-button"
          @click="automaticLayout"
      >
        Automatic layout
      </button>
      <button
        id="export-svg-button"
        @click="exportSvg"
      >
        Export svg
      </button>
      <label for="read-only-checkbox">
        Read-only ?
      </label>
      <input
        id="read-only-checkbox"
        v-model="readOnly"
        type="checkbox"
        @change="reset"
      >
      <div
        v-if="readOnly"
        id="read-only-size"
      >
        <div>
          <span>
            Width:
          </span>
          <input
            v-model="width"
            type="number"
          >
        </div>
        <div>
          <span>
            Height:
          </span>
          <input
            v-model="height"
            type="number"
          >
        </div>
      </div>
    </div>
    <div style="display: flex;">
      <fieldset style="margin-right: 15px;">
        <legend>
          Drop component
        </legend>
        <div>
          <span>
            X position :
          </span>
          <input
            id="position-x-input"
            v-model="position.x"
            type="number"
          >
        </div>
        <div style="margin-top: 5px;">
          <span>
            Y position :
          </span>
          <input
            id="position-y-input"
            v-model="position.y"
            type="number"
          >
        </div>
        <div style="display: flex;justify-content:center;margin-top: 5px;">
          <button
            id="drop-button"
            @click="dropComponent"
          >
            Drop
          </button>
        </div>
      </fieldset>
      <fieldset>
        <legend>
          Rename a component ID
        </legend>
        <span>
          Choose an ID:
        </span>
        <select
          id="component-id"
          v-model="selectedId"
          name="ids"
        >
          <option value="">
            --select an id--
          </option>
          <option
            v-for="id in componentsIds"
            :key="id"
            :value="id"
          >
            {{ id }}
          </option>
        </select>
        <div style="margin-top: 5px;">
          <span>
            New ID
          </span>
          <input
            id="rename-input"
            v-model="renamedExternalId"
            type="text"
          >
        </div>
        <div style="display: flex;justify-content:center;margin-top: 5px;">
          <button
            id="rename-component"
            :disabled="!(selectedId && renamedExternalId)"
            @click="renameComponent"
          >
            Save
          </button>
        </div>
      </fieldset>
    </div>
    <div style="padding: 50px; width: 100%; height: 100%">
      <div
        id="view-port"
        :style="readOnly ? { width: `${width}px`, height: `${height}px` } : {}"
      />
    </div>
  </main>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import {
  ComponentDrawOption,
  FileInput,
  FileInformation,
} from 'leto-modelizer-plugin-core';
import resources from './assets/resources';
import DemoPlugin from '@/DemoPlugin';

const readOnly = ref(false);
const width = ref(400);
const height = ref(400);
const componentsIds = ref([]);
const selectedId = ref('');
const renamedExternalId = ref('');
const position = ref({
  x: 0,
  y: 0,
});

const watchEvents = ['delete', 'add'];
let plugin;

function updateComponentsIds() {
  componentsIds.value = plugin.data.components.map(({ id }) => id);
}

function next(data) {
  console.log(...Object.keys(data.event)
    .map((key) => data.event[key])
    .filter((value) => !!value));
  if (watchEvents.includes(data.event.action)) {
    updateComponentsIds();
  }
}

plugin = new DemoPlugin(next);
const defaultConfiguration = JSON.stringify({
  diagram: {
    demo: {
      internal1: new ComponentDrawOption({
        x: 42,
        y: 550,
        width: 170,
        height: 50,
      }),
      network2: new ComponentDrawOption({
        x: 400,
        y: 150,
        width: 250,
        height: 312,
      }),
    },
  },
});

function savePosition() {
  const configuration = new FileInput({
    path: 'localstorage',
    content: '',
  });

  plugin.render(new FileInformation({ path: 'diagram' }), configuration);
  window.localStorage.setItem('configuration', configuration.content);
}

function automaticLayout() {
  plugin.arrangeComponentsPosition(null, false);
  plugin.draw();
}

function reset() {
  plugin.initDrawer('view-port', readOnly.value);
  plugin.draw();
}

/**
 * Add a component to the model and update the view.
 */
function addComponent() {
  plugin.addComponent(null, plugin.data.__laptopDefinition, 'diagram');
  plugin.arrangeComponentsPosition(null, true);
  plugin.draw();
}

function renameComponent() {
  plugin.data.renameComponentExternalId(selectedId.value, renamedExternalId.value);
  plugin.draw();
  updateComponentsIds();
  selectedId.value = '';
  renamedExternalId.value = '';
}

function dropComponent() {
  const id = plugin.addComponent(null, plugin.data.__serverDefinition, 'diagram');

  plugin.arrangeComponentsPosition(null, true);

  const component = plugin.data.getComponentById(id);

  component.drawOption.x = position.value.x;
  component.drawOption.y = position.value.y;

  plugin.draw();
}

function exportSvg() {
  const content = plugin.exportSvg('view-port');
  const blob = new Blob([content], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');

  a.href = url;
  a.download = 'diagram.svg';

  document.body.appendChild(a);

  a.click();

  document.body.removeChild(a);

  URL.revokeObjectURL(url);
}

onMounted(() => {
  plugin.init();
  plugin.initResources(resources);

  plugin.parse(new FileInformation({ path: 'diagram' }), new FileInput({
    path: 'localstorage',
    content: window.localStorage.getItem('configuration') || defaultConfiguration,
  }));

  plugin.initDrawer('view-port', false);

  plugin.arrangeComponentsPosition(null, true);
  plugin.draw();

  updateComponentsIds();
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

main {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

#view-port {
  width: 100%;
  height: 100%;

  border: 1px solid black;
  overflow: hidden;
}

button, span {
  margin-right: 10px;
}
fieldset {
  padding: 5px;
}
#read-only-size span {
  display: inline-block;
  width: 75px;
  margin-right: 15px;
  text-align: left;
}
</style>
