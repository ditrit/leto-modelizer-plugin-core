import {
  Component,
  ComponentAttribute,
  DefaultParser
} from 'leto-modelizer-plugin-core';

class DemoParser extends DefaultParser {
  parse() {
    const internalLaptop = new Component({
      id: 'internal1',
      name: 'laptop1',
      definition: this.pluginData.__laptopDefinition,
      attributes: [
        new ComponentAttribute({
          name: 'name',
          value: 'Internal',
          type: 'String',
          definition: this.pluginData.__nameAttributeDefinition,
        }),
        new ComponentAttribute({
          name: 'ip',
          value: '182.18.29',
          type: 'String',
          definition: this.pluginData.__ipAttributeDefinition,
        }),
        new ComponentAttribute({
          name: 'fullname',
          value: 'Jean Pierre',
          type: 'String',
          definition: this.pluginData.__userAttributeDefinition,
        }),
        new ComponentAttribute({
          name: 'network_link',
          value: ['network1'],
          type: 'Array',
          definition: this.pluginData.__networkLinkAttributeDefinition,
        }),
      ],
    });

    const externalLaptop = new Component({
      id: 'external1',
      name: 'laptop2',
      definition: this.pluginData.__laptopDefinition,
      attributes: [
        new ComponentAttribute({
          name: 'name',
          value: 'Laptop',
          type: 'String',
          definition: this.pluginData.__nameAttributeDefinition,
        }),
        new ComponentAttribute({
          name: 'ip',
          value: '182.18.29.12',
          type: 'String',
          definition: this.pluginData.__ipAttributeDefinition,
        }),
        new ComponentAttribute({
          name: 'fullname',
          value: 'Marcel Denis',
          type: 'String',
          definition: this.pluginData.__userAttributeDefinition,
        }),
      ],
    });

    const mailServer = new Component({
      id: 'server1',
      name: 'Mail',
      definition: this.pluginData.__serverDefinition,
      attributes: [
        new ComponentAttribute({
          name: 'name',
          value: 'Mail',
          type: 'String',
          definition: this.pluginData.__nameAttributeDefinition,
        }),
        new ComponentAttribute({
          name: 'ip',
          value: '1.26.100.1',
          type: 'String',
          definition: this.pluginData.__ipAttributeDefinition,
        }),
        new ComponentAttribute({
          name: 'network',
          value: 'network1',
          type: 'String',
          definition: this.pluginData.__networkAttributeDefinition,
        }),
        new ComponentAttribute({
          name: 'laptop_link',
          value: ['external1'],
          type: 'Array',
          definition: this.pluginData.__laptopLinkAttributeDefinition,
        }),
      ],
    });

    const httpServer = new Component({
      id: 'server2',
      name: 'HTTP',
      definition: this.pluginData.__serverDefinition,
      attributes: [
        new ComponentAttribute({
          name: 'name',
          value: 'Http',
          type: 'String',
          definition: this.pluginData.__nameAttributeDefinition,
        }),
        new ComponentAttribute({
          name: 'ip',
          value: '1.26.100.2',
          type: 'String',
          definition: this.pluginData.__ipAttributeDefinition,
        }),
        new ComponentAttribute({
          name: 'network',
          value: 'network1',
          type: 'String',
          definition: this.pluginData.__networkAttributeDefinition,
        }),
      ],
    });

    const dmz1 = new Component({
      id: 'network1',
      name: 'DMZ_1',
      definition: this.pluginData.__networkDefinition,
      attributes: [
        new ComponentAttribute({
          name: 'name',
          value: 'Dmz',
          type: 'String',
          definition: this.pluginData.__nameAttributeDefinition,
        }),
      ],
    });

    const dmz2 = new Component({
      id: 'network2',
      name: 'DMZ_2',
      definition: this.pluginData.__networkDefinition,
      attributes: [
        new ComponentAttribute({
          name: 'name',
          value: 'Dmz',
          type: 'String',
          definition: this.pluginData.__nameAttributeDefinition,
        }),
      ],
    });

    this.pluginData.components = [internalLaptop, dmz1, dmz2, externalLaptop, mailServer, httpServer];
    this.pluginData.parseErrors = [];
  }
}

export default DemoParser;
