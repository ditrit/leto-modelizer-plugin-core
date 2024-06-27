import * as d3 from 'd3';
import DeleteAction from './action/DeleteAction';
import DragComponentAction from './action/DragComponentAction';
import DragSceneAction from './action/DragSceneAction';
import LinkAction from './action/LinkAction';
import MenuAction from './action/MenuAction';
import ResizeComponentAction from './action/ResizeComponentAction';
import ToggleSelectionAction from './action/ToggleSelectionAction';
import DeselectionAllAction from './action/DeselectionAllAction';
import SelectionAllAction from './action/SelectionAllAction';
import ZoomAction from './action/ZoomAction';
import ComponentRenderer from './render/ComponentRenderer';
import LinkRenderer from './render/LinkRenderer';
import CustomLayout from './layout/CustomLayout';

/**
 * Class that draws a component in a graphical representation.
 */
class DefaultDrawer {
  /**
   * Default constructor
   * @param {DefaultData} pluginData - Plugin data storage.
   */
  constructor(pluginData) {
    /**
     * Plugin data storage.
     * @type {DefaultData}
     */
    this.pluginData = pluginData;

    /**
     * Component renderer.
     */
    this.componentRenderer = null;

    /**
     * Link renderer.
     */
    this.linkRenderer = null;

    /**
     * Plugin layout system.
     * @type {DefaultLayout}
     */
    this.layout = null;

    /**
     * D3 selection of the view port.
     * @type {Selection}
     */
    this.viewport = null;

    /**
     * D3 selection of the main scene.
     * @type {Selection}
     */
    this.scene = null;

    /**
     * D3 library.
     * @type {object}
     */
    this.d3 = d3;

    /**
     * Object to store all instances of actions.
     * @type {object}
     */
    this.actions = {
      deleteAction: null,
      dragComponent: null,
      dragScene: null,
      linkAction: null,
      menuAction: null,
      resizeComponent: null,
      toggleSelection: null,
      selectionAll: null,
      deselectionAll: null,
      zoom: null,
    };

    /**
     * Object to store all states of the scene.
     * @type {object}
     */
    this.states = {
      linking: false,
      menuOpening: false,
      moving: false,
      resizing: false,
      selection: false,
    };
    this.readOnly = false;
  }

  /**
   * Initialize drawing context.
   * @param {string} id - Html id of div that will be the drawing container.
   * @param {boolean} readOnly - Indicate if user can make action or modify the scene.
   */
  init(id, readOnly = false) {
    this.d3.select(`#${id}`).selectAll(null).remove();
    this.d3.select(`#${id}`).html('');
    this.viewport = this.d3.select(`#${id}`);

    this.componentRenderer = new ComponentRenderer(this.pluginData, this.viewport, readOnly);
    this.linkRenderer = new LinkRenderer(this.pluginData, this.viewport, readOnly);
    this.layout = new CustomLayout(
      this.pluginData,
      this.viewport,
    );
    this.readOnly = readOnly;
    this.clearActions();

    if (this.readOnly) {
      this.pluginData.scene.x = 0;
      this.pluginData.scene.y = 0;
      this.pluginData.scene.zoom = 1;
    }

    this.initActions();
    this.initScene();
  }

  /**
   * Remove all instances of actions and remove all set events.
   */
  clearActions() {
    this.actions.deleteAction = null;
    this.actions.dragComponent = null;
    this.actions.dragScene = null;
    this.actions.menuAction = null;
    this.actions.resizeComponent = null;
    this.actions.toggleSelection = null;
    this.actions.selectionAll = null;
    this.actions.deselectionAll = null;
    this.actions.zoom = null;

    this.viewport.on('wheel', null);
    this.d3.select('body')
      .on('keydown', null)
      .on('keyup', null);
    this.viewport.on('.drag', null);
  }

  /**
   * Initialize actions and set event on viewport and other.
   */
  initActions() {
    this.actions.selectionAll = new SelectionAllAction(this.pluginData, this.viewport, this.layout);
    this.actions.deleteAction = new DeleteAction(this.pluginData, this.viewport, this.layout);
    this.actions.dragScene = new DragSceneAction(this.pluginData, this.viewport, this.layout);
    this.actions.menuAction = new MenuAction(this.pluginData, this.viewport, this.layout);
    this.actions.link = new LinkAction(this.pluginData, this.viewport, this.layout);
    this.actions.zoom = new ZoomAction(this.pluginData, this.viewport, this.layout);
    this.actions.dragComponent = new DragComponentAction(
      this.pluginData,
      this.viewport,
      this.layout,
    );
    this.actions.resizeComponent = new ResizeComponentAction(
      this.pluginData,
      this.viewport,
      this.layout,
    );
    this.actions.toggleSelection = new ToggleSelectionAction(
      this.pluginData,
      this.viewport,
      this.layout,
    );
    this.actions.deselectionAll = new DeselectionAllAction(
      this.pluginData,
      this.viewport,
      this.layout,
    );

    this.viewport.on('wheel', (event) => {
      const haveToDraw = this.actions.zoom.execute(event);

      if (haveToDraw) {
        this.draw();
      }
    });

    if (!this.readOnly) {
      this.d3.select('body')
        .on('keydown', (event) => {
          let haveToDraw = false;

          if (this.pluginData.configuration.keysBinding.selection.includes(event.key)) {
            this.states.selection = true;
          }
          if (this.pluginData.configuration.keysBinding.deleteObject.includes(event.key)) {
            haveToDraw = this.actions.deleteAction.execute(event);
          }
          if (this.pluginData.configuration.keysBinding.selectAll.includes(event.key)) {
            haveToDraw = this.actions.selectionAll.execute(event);
          }
          if (this.pluginData.configuration.keysBinding.deselectAll.includes(event.key)) {
            haveToDraw = this.actions.deselectionAll.execute(event);
          }

          if (haveToDraw) {
            this.draw();
          }
        })
        .on('keyup', (event) => {
          let haveToDraw = false;

          if (this.pluginData.configuration.keysBinding.selection.includes(event.key)) {
            this.states.selection = false;
          }
          if (this.pluginData.configuration.keysBinding.deleteObject.includes(event.key)) {
            haveToDraw = this.actions.deleteAction.finalize(event);
          }
          if (this.pluginData.configuration.keysBinding.selectAll.includes(event.key)) {
            haveToDraw = this.actions.selectionAll.finalize(event);
          }
          if (this.pluginData.configuration.keysBinding.deselectAll.includes(event.key)) {
            haveToDraw = this.actions.deselectionAll.finalize(event);
          }

          if (haveToDraw) {
            this.draw();
          }
        });
    }

    const drag = this.d3.drag()
      .subject((event) => {
        const element = event.sourceEvent.target.closest('.component');

        this.states.resizing = !!event.sourceEvent.target.closest('.resize-button');
        this.states.menuOpening = !!event.sourceEvent.target.closest('.menu-button');

        if (!element) {
          return this.scene;
        }
        const subject = this.viewport.select(Array.from(element.classList)
          .map((value) => `.${value}`)
          .join(''));

        this.states.linking = !!event.sourceEvent.target.closest('.anchor')
          && this.pluginData.canHaveLink(subject.datum().data.definition.type);

        return subject;
      })
      .on('drag', (event) => {
        this.states.moving = true;

        const isScene = event.subject.datum().data.id === 'scene';
        let haveToDraw = false;

        if (this.readOnly) {
          this.actions.dragScene.execute(event);

          return;
        }

        if (isScene) {
          haveToDraw = this.actions.dragScene.execute(event);
        } else if (this.states.linking) {
          haveToDraw = this.actions.link.execute(event);
          this.linkRenderer.render();
        } else if (this.states.resizing) {
          haveToDraw = this.actions.resizeComponent.execute(event);
          this.linkRenderer.render();
        } else {
          haveToDraw = this.actions.dragComponent.execute(event);
          this.linkRenderer.render();
        }

        if (haveToDraw) {
          this.draw();
        }
      })
      .on('end', async (event) => {
        const hasMoved = this.states.moving;
        const isSelected = this.states.selection;
        const isMenuOpening = this.states.menuOpening;
        const isResizing = this.states.resizing;
        const isLinking = this.states.linking;
        const isScene = event.subject.datum().data.id === 'scene';
        let haveToDraw = false;

        if (this.readOnly) {
          if (isScene && hasMoved) {
            this.actions.dragScene.finalize(event);
          }

          return;
        }

        if (isLinking) {
          // LINKING PARK - in the end!!!!
          haveToDraw = this.actions.link.finalize(event);
        } else if (hasMoved && isScene) {
          haveToDraw = this.actions.dragScene.finalize(event);
        } else if (isResizing) {
          haveToDraw = this.actions.resizeComponent.finalize(event);
        } else if (hasMoved && !isScene) {
          haveToDraw = this.actions.dragComponent.finalize(event);
        } else if (!hasMoved && isMenuOpening) {
          haveToDraw = this.actions.menuAction.finalize(event);
        } else if (!hasMoved && !isScene && isSelected) {
          haveToDraw = this.actions.toggleSelection.finalize(event);
        }

        if (haveToDraw) {
          this.draw();
        }

        this.states.moving = false;
      });

    this.viewport.call(drag);
  }

  /**
   * Get scene width data.
   * @returns {object} D3 selection of scene.
   */
  getScene() {
    return this.viewport
      .selectAll('.scene')
      .data(this.getSceneData())
      .join('svg')
      .attr('class', 'scene')
      .attr('width', '100%')
      .attr('height', '100%');
  }

  /**
   * Initialize the scene, set all markers component and link groups.
   */
  initScene() {
    this.scene = this.getScene();
    this.scene.attr('version', '1.1');
    this.scene.attr('xmlns', 'http://www.w3.org/2000/svg');

    this.scene.append('defs').html(
      Object.keys(this.pluginData.resources.markers)
        .map((key) => this.pluginData.resources.markers[key])
        .join(''),
    );
    const { x, y, zoom } = this.pluginData.scene;
    const transform = `translate(${x} ${y}) scale(${zoom})`;

    this.scene.append('g')
      .attr('class', 'components')
      .attr('transform', transform);
    this.scene.append('g')
      .attr('class', 'links')
      .attr('transform', transform);
  }

  /**
   * Components driven drawing.
   */
  draw() {
    this.scene = this.getScene();

    this.componentRenderer.render('scene');
    this.linkRenderer.render('scene');

    if (this.readOnly) {
      const { width: vWidth, height: vHeight } = this.viewport.node().getBoundingClientRect();
      const {
        width,
        height,
        x,
        y,
      } = this.viewport.select('.scene .components').node().getBBox();
      const ratio = vWidth / width < vHeight / height ? vWidth / width : vHeight / height;
      let zoom = 1;

      while (zoom > ratio) {
        zoom *= 0.9;
      }

      this.scene.attr('viewBox', `${x - 15} ${y - 15} ${width + x + 15} ${height + y + 15}`);
      this.pluginData.scene.zoom = zoom;
    }
  }

  /**
   * Reorganize position and size of all components.
   * This method does not refresh the view. You have to await it and trigger a redraw.
   * @param {string} id - The container within which we need to organize the children,
   * and if not specified, all components will be reorganized.
   * @param {boolean} keepPosition -  If true only component without position will be reorganized.
   */
  arrangeComponentsPosition(id, keepPosition) {
    this.layout.generateComponentsLayout(id, keepPosition);
  }

  /**
   * Resize the container to its minimum size.
   * @param {string} id - Container id.
   */
  resize(id) {
    this.layout.resize(id);
  }

  /**
   * Format component dataset to d3 hierarchy.
   * @returns {object} - Formated component dataset.
   */
  getSceneData() {
    return [
      this.d3.hierarchy(
        {
          id: 'scene',
          name: '',
          children: [
            ...this.pluginData.components
              .filter((component) => component.getContainerId() === null),
          ],
          ...this.pluginData.scene,
        },
        (data) => {
          if (data.id === 'scene') {
            return data.children;
          }

          return this.pluginData.getChildren(data.id);
        },
      ),
    ];
  }

  /**
   * Drop component on scene.
   * @param {Component} component - Component to drop.
   * @param {object} event - Mouse event.
   */
  dropComponent(component, event) {
    const target = event.target.closest('.component');

    component.drawOption.width = component.definition.width;
    component.drawOption.height = component.definition.height;

    if (!target) {
      const { x: sceneX, y: sceneY } = this.viewport.select('.scene')
        .node().getBoundingClientRect();

      component.drawOption.x = (event.clientX - sceneX - this.pluginData.scene.x)
        / this.pluginData.scene.zoom - component.definition.defaultWidth / 2;
      component.drawOption.y = (event.clientY - sceneY - this.pluginData.scene.y)
        / this.pluginData.scene.zoom - component.definition.defaultHeight / 2;

      return;
    }

    if (target.canContain(component.definition.type)) {
      const { x: containerX, y: containerY } = this.viewport
        .select(`.${component.id}.container`).node().getBoundingClientRect();

      component.drawOption.x = (event.clientX - containerX - this.pluginData.scene.x)
        / this.pluginData.scene.zoom - component.definition.defaultWidth / 2;
      component.drawOption.y = (event.clientY - containerY - this.pluginData.scene.y)
        / this.pluginData.scene.zoom - component.definition.defaultHeight / 2;
    }
  }

  /**
   * Export viewport as svg.
   * @returns {string} Svg content.
   */
  exportSvg() {
    this.viewport.selectAll('.scene > g').attr('transform', '');

    return document.querySelector('#view-port .scene').outerHTML;
  }
}

export default DefaultDrawer;
