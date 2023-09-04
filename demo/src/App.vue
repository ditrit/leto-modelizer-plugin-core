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
      <button @click="gherkinTestsToConsole">
        Log components position
      </button>
      <label for="read-only-checkbox">Read-only ?</label>
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
          <label>Width:</label>
          <input
            v-model="width"
            type="number"
          >
        </div>
        <div>
          <label>Height:</label>
          <input
            v-model="height"
            type="number"
          >
        </div>
      </div>
    </div>
    <div id="fieldset-container">
      <fieldset>
        <legend>
          Rename a component ID
        </legend>
        <label>Choose an ID:</label>
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
        <div>
          <label>New ID</label>
          <input
            id="rename-input"
            v-model="renamedId"
            type="text"
          >
        </div>
        <button
          id="rename-component"
          :disabled="!(selectedId && renamedId)"
          @click="renameComponent"
        >
          Save
        </button>
      </fieldset>

      <fieldset>
        <legend>
          Rearrange components
        </legend>
        <label>Parent component:</label>
        <select
          id="automatic-layout-children-input"
          v-model="selectedAutoLayoutId"
          name="idsAutomaticLayout"
        >
          <option value="">
            (Rearrange everything)
          </option>
          <option
            v-for="id in componentsIds"
            :key="'autoLayout_'+id"
            :value="id"
          >
            {{ id }}
          </option>
        </select>
        <br>
        <button
          id="automatic-layout-children-button"
          @click="automaticLayoutOfChildren"
        >
          Rearrange
        </button>
      </fieldset>
      <fieldset>
        <legend>
          Drop component
        </legend>
        <div>
          <label>X position :</label>
          <input
            id="position-x-input"
            v-model="position.x"
            type="number"
          >
        </div>
        <div>
          <label>Y position :</label>
          <input
            id="position-y-input"
            v-model="position.y"
            type="number"
          >
        </div>
        <button
          id="drop-button"
          @click="dropComponent"
        >
          Drop
        </button>
      </fieldset>
    </div>
    <div
      id="root"
      :style="readOnly ? { width: `${width}px`, height: `${height}px` } : {}"
    />
  </main>
</template>

<script setup>
/* eslint no-console: 0 */

import { onMounted, ref } from 'vue';
import { ComponentDrawOption, FileInput, FileInformation } from 'leto-modelizer-plugin-core';
import resources from './assets/resources';
import DemoPlugin from '@/DemoPlugin';

const readOnly = ref(false);
const width = ref(400);
const height = ref(400);
const componentsIds = ref([]);
const selectedId = ref('');
const renamedId = ref('');
const selectedAutoLayoutId = ref('');
const position = ref({
  x: 0,
  y: 0,
});

const watchEvents = ['delete', 'add'];

/**
 * Callback for DemoPlugin instance.
 * @param {*} data - The data to be logged.
 */
function next(data) {
  console.log(data);
  if (watchEvents.includes(data.event.action)) {
    // eslint-disable-next-line no-use-before-define
    updateComponentsIds();
  }
}

const plugin = new DemoPlugin(next);
const defaultConfiguration = JSON.stringify({
  diagram: {
    demo: {
      internal1: new ComponentDrawOption({
        x: 42,
        y: 666,
        width: 242,
        height: 50,
      }),
    },
  },
});

plugin.init();

plugin.initResources(resources);

/**
 * Save position.
 */
function savePosition() {
  const configuration = new FileInput({ path: 'localstorage', content: '' });

  plugin.render(new FileInformation({ path: 'diagram' }), configuration);
  window.localStorage.setItem('configuration', configuration.content);
}

/**
 * Rearrange children of a given component, or all of them.
 */
async function automaticLayoutOfChildren() {
  await plugin.arrangeComponentsPosition(selectedAutoLayoutId.value === ''
    ? undefined
    : selectedAutoLayoutId.value);
  plugin.draw('root', readOnly.value);
}

/**
 * Reset the view.
 */
function reset() {
  document.querySelector('#root').innerHTML = '';
  plugin.draw('root', readOnly.value);
}

/**
 * Rename a component.
 */
function renameComponent() {
  plugin.data.renameComponentId(selectedId.value, renamedId.value);
  plugin.draw('root', readOnly.value);
  // eslint-disable-next-line no-use-before-define
  updateComponentsIds();
  selectedId.value = '';
  renamedId.value = '';
}

/**
 * Update components identifiers.
 */
function updateComponentsIds() {
  componentsIds.value = plugin.data.components.map(({ id }) => id);
}

onMounted(() => {
  plugin.parse(new FileInformation({ path: 'diagram' }), new FileInput({
    path: 'localstorage',
    content: window.localStorage.getItem('configuration') || defaultConfiguration,
  }));
  plugin.draw('root');
  updateComponentsIds();
});

/**
 * Add a component to the model and update the view.
 */
function addComponent() {
  const id = plugin.addComponent('root', plugin.data.__laptopDefinition);

  // As of now, we need to draw the component before repositioning it.
  // That is because we need the component drawOption property to be defined.
  plugin.draw('root');

  plugin.repositionComponent(id);
  plugin.draw('root');
}

/**
 * Drop a new component at the given coordinates.
 */
function dropComponent() {
  const definition = plugin.data.__serverDefinition;
  const drawOption = new ComponentDrawOption({
    x: position.value.x,
    y: position.value.y,
    needsResizing: true,
  });

  plugin.addComponent(
    'root',
    definition,
    undefined,
    undefined,
    drawOption,
  );

  plugin.draw('root');
}

/**
 * Log components position to the browser console.
 */
function gherkinTestsToConsole() {
  console.log('-------------------- Start log position');
  plugin.data.components
    .map(({ id }) => document.querySelector(`g #${id}`))
    .map((e) => {
      if (e.attributes.x === undefined || e.attributes.y === undefined) {
        return `'${e.id}' does not have valid position`;
      }

      return `And I expect "#${e.id}" to be at position`
          + ` ${e.attributes.x.nodeValue},${e.attributes.y.nodeValue}\n`;
    })
    .forEach((line) => console.log(line));

  console.log('-------------------- End log position');
}
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
  display: flex;
  flex-direction: column;
  align-items: center;
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

button, label {
  margin-right: 10px;
}

#read-only-size label {
  display: inline-block;
  width: 75px;
  margin-right: 15px;
  text-align: left;
}

#fieldset-container {
  display:flex;
  flex-direction: row;
}

fieldset {
  margin: 5px;
  padding: 5px;
}
</style>
