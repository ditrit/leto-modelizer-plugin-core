import {
  Component,
  ComponentAttribute,
  ComponentAttributeDefinition,
  ComponentDefinition,
  ComponentLink,
} from 'leto-modelizer-plugin-core';

// Component attribute Definitions
const nameAttributeDefinition = new ComponentAttributeDefinition({
  name: 'name',
  type: 'String',
  required: true,
  rules: {
    min: 5,
    max: 100,
    regex: '/[A-Z]{1}[a-z]+(-[A-Z]{1}[a-z]+)*/',
  },
});

const networkAttributeDefinition = new ComponentAttributeDefinition({
  name: 'network',
  type: 'Reference',
  containerRef: 'network',
});
const ipAttributeDefinition = new ComponentAttributeDefinition({
  name: 'ip',
  type: 'String',
  rules: {
    regex: '/[0-9]{1-3}\\.[0-9]{1-3}\\.[0-9]{1-3}\\.[0-9]{1-3}',
  },
});
const userAttributeDefinition = new ComponentAttributeDefinition({
  name: 'fullname',
  type: 'String',
});

// Component Definitions
const networkDefinition = new ComponentDefinition({
  type: 'network',
  icon: 'network',
  model: 'DefaultContainer',
  parentTypes: ['network'],
  childrenTypes: ['server', 'network'],
  definedAttributes: [nameAttributeDefinition],
  isContainer: true,
});

const serverDefinition = new ComponentDefinition({
  type: 'server',
  icon: 'server',
  model: 'DefaultModel',
  parentTypes: ['network'],
  definedAttributes: [nameAttributeDefinition, networkAttributeDefinition, ipAttributeDefinition],
  isContainer: false,
});

const laptopDefinition = new ComponentDefinition({
  type: 'laptop',
  icon: 'laptop',
  model: 'DefaultModel',
  parentTypes: [],
  definedAttributes: [nameAttributeDefinition, ipAttributeDefinition, userAttributeDefinition],
  isContainer: false,
});

// Components
const internalLaptop = new Component({
  id: 'internal1',
  name: 'laptop1',
  definition: laptopDefinition,
  attributes: [
    new ComponentAttribute({
      name: 'name',
      value: 'laptop1',
      type: 'String',
      definition: nameAttributeDefinition,
    }),
    new ComponentAttribute({
      name: 'ip',
      value: '182.18.29.11',
      type: 'String',
      definition: ipAttributeDefinition,
    }),
    new ComponentAttribute({
      name: 'fullname',
      value: 'Jean Pierre',
      type: 'String',
      definition: userAttributeDefinition,
    }),
  ],
  children: [],
});

const externalLaptop = new Component({
  id: 'external1',
  name: 'laptop2',
  definition: laptopDefinition,
  attributes: [
    new ComponentAttribute({
      name: 'name',
      value: 'laptop2',
      type: 'String',
      definition: nameAttributeDefinition,
    }),
    new ComponentAttribute({
      name: 'ip',
      value: '182.18.29.12',
      type: 'String',
      definition: ipAttributeDefinition,
    }),
    new ComponentAttribute({
      name: 'fullname',
      value: 'Marcel Denis',
      type: 'String',
      definition: userAttributeDefinition,
    }),
  ],
  children: [],
});

const mailServer = new Component({
  id: 'server1',
  name: 'Mail',
  definition: serverDefinition,
  attributes: [
    new ComponentAttribute({
      name: 'name',
      value: 'Mail',
      type: 'String',
      definition: nameAttributeDefinition,
    }),
    new ComponentAttribute({
      name: 'ip',
      value: '1.26.100.1',
      type: 'String',
      definition: ipAttributeDefinition,
    }),
    new ComponentAttribute({
      name: 'network',
      value: 'network1',
      type: 'String',
      definition: networkAttributeDefinition,
    }),
  ],
  children: [],
});

const httpServer = new Component({
  id: 'server2',
  name: 'HTTP',
  definition: serverDefinition,
  attributes: [
    new ComponentAttribute({
      name: 'name',
      value: 'Http',
      type: 'String',
      definition: nameAttributeDefinition,
    }),
    new ComponentAttribute({
      name: 'ip',
      value: '1.26.100.2',
      type: 'String',
      definition: ipAttributeDefinition,
    }),
    new ComponentAttribute({
      name: 'network',
      value: 'network1',
      type: 'String',
      definition: networkAttributeDefinition,
    }),
  ],
  children: [],
});

const dmz1 = new Component({
  id: 'network1',
  name: 'DMZ_1',
  definition: networkDefinition,
  attributes: [
    new ComponentAttribute({
      name: 'name',
      value: 'DMZ',
      type: 'String',
      definition: nameAttributeDefinition,
    }),
  ],
  children: [mailServer, httpServer],
});

const dmz2 = new Component({
  id: 'network2',
  name: 'DMZ_2',
  definition: networkDefinition,
  attributes: [
    new ComponentAttribute({
      name: 'name',
      value: 'DMZ',
      type: 'String',
      definition: nameAttributeDefinition,
    }),
  ],
  children: [],
});

const link1 = new ComponentLink({
  source: 'network1',
  target: 'internal1',
});

const link2 = new ComponentLink({
  source: 'server1',
  target: 'external1',
});

export default {
  definitions: {
    components: [networkDefinition, serverDefinition, laptopDefinition],
    links: [],
  },
  components: [internalLaptop, dmz1, dmz2, externalLaptop],
  links: [link1, link2]
};
