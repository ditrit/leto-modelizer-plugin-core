import DefaultConfiguration from "./DefaultConfiguration";

/**
 * Class that contains the default plugin for Monaco Editor.
 */
class DefaultPlugin {
  /**
   * Default constructor.
   */
  constructor() {
    /**
     * Default config.
     */
    this.configuration = new DefaultConfiguration;
  }

  /**
   * Register the language in Monaco.
   * @param {object} container
   */
  registerEditor(container) {
    monaco.languages.register(this.configuration.register);
    monaco.languages.setLanguageConfiguration(this.configuration.name, this.configuration.config);
    monaco.languages.setMonarchTokensProvider(this.configuration.name, this.configuration.provider);
    this.configuration.editor = monaco.editor.create(container.value, {
      value,
      language: this.configuration.name,
    });
    editor.onDidChangeModelContent(updateFile);
  }
}

export default DefaultPlugin;
