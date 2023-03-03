import { DefaultData, DefaultPlugin } from 'leto-modelizer-plugin-core';
import DemoMetadata from './DemoMetadata';
import DemoParser from './DemoParser';

class DemoPlugin extends DefaultPlugin {
  constructor(next) {
    const data = new DefaultData({ name: 'demo' }, { next });
    super({
      pluginData: data,
      pluginMetadata: new DemoMetadata(data),
      pluginParser: new DemoParser(data),
    });
  }
}

export default DemoPlugin;
