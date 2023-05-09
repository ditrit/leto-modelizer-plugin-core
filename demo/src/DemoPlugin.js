import { DefaultConfiguration, DefaultData, DefaultPlugin } from 'leto-modelizer-plugin-core';
import DemoMetadata from './DemoMetadata';
import DemoParser from './DemoParser';

class DemoPlugin extends DefaultPlugin {
  constructor(next) {
    const configuration = new DefaultConfiguration();
    const data = new DefaultData(configuration, { name: 'demo' }, { next });
    super({
      configuration,
      pluginData: data,
      pluginMetadata: new DemoMetadata(data),
      pluginParser: new DemoParser(data),
    });
  }
}

export default DemoPlugin;
