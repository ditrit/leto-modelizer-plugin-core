import {
  ComponentAttributeDefinition,
  ComponentDefinition,
  DefaultMetadata
} from 'leto-modelizer-plugin-core';

class DemoMetadata extends DefaultMetadata {
  parse() {
    // Component attribute Definitions
    this.pluginData.__nameAttributeDefinition = new ComponentAttributeDefinition({
      name: 'name',
      type: 'String',
      required: true,
      rules: {
        min: 3,
        max: 100,
        regex: /[A-Z]{1}[a-z]+(-[A-Z]{1}[a-z]+)*/,
      },
    });

    this.pluginData.__networkAttributeDefinition = new ComponentAttributeDefinition({
      name: 'network',
      type: 'Reference',
      containerRef: 'network',
    });

    this.pluginData.__ipAttributeDefinition = new ComponentAttributeDefinition({
      name: 'ip',
      type: 'String',
      rules: {
        regex: /[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/,
      },
    });

    this.pluginData.__userAttributeDefinition = new ComponentAttributeDefinition({
      name: 'fullname',
      type: 'String',
    });

    this.pluginData.__laptopLinkAttributeDefinition = new ComponentAttributeDefinition({
      name: 'laptop_link',
      type: 'Link',
      linkRef: 'laptop',
    })
    this.pluginData.__workflowAttributeDefinition = new ComponentAttributeDefinition({
      name: 'workflow',
      type: 'Reference',
      containerRef: 'workflow',
    });

    this.pluginData.__networkLinkAttributeDefinition = new ComponentAttributeDefinition({
      name: 'network_link',
      type: 'Link',
      linkRef: 'network',
      linkType: 'Reverse',
      linkColor: '#ff0000',
      linkWidth: 5,
      linkDashStyle: [25, 5],
    })

    // Component Definitions
    this.pluginData.__networkDefinition = new ComponentDefinition({
      type: 'network',
      icon: 'network',
      model: 'DefaultContainer',
      parentTypes: ['network'],
      childrenTypes: ['server', 'network', 'workflow'],
      definedAttributes: [this.pluginData.__nameAttributeDefinition, this.pluginData.__networkAttributeDefinition],
      isContainer: true,
    });

    this.pluginData.__serverDefinition = new ComponentDefinition({
      type: 'server',
      icon: 'server',
      model: 'DefaultModel',
      parentTypes: ['network'],
      definedAttributes: [
        this.pluginData.__nameAttributeDefinition,
        this.pluginData.__networkAttributeDefinition,
        this.pluginData.__ipAttributeDefinition,
        this.pluginData.__laptopLinkAttributeDefinition,
        this.pluginData.__networkLinkAttributeDefinition,
      ],
      isContainer: false,
    });

    this.pluginData.__laptopDefinition = new ComponentDefinition({
      type: 'laptop',
      icon: 'laptop',
      model: 'DefaultModel',
      parentTypes: [],
      definedAttributes: [
        this.pluginData.__nameAttributeDefinition,
        this.pluginData.__ipAttributeDefinition,
        this.pluginData.__userAttributeDefinition,
        this.pluginData.__networkLinkAttributeDefinition,
      ],
      isContainer: false,
    });

    this.pluginData.__verticalWorkflowDefinition = new ComponentDefinition({
      type: 'workflow',
      icon: 'network',
      model: 'DefaultContainer',
      parentTypes: ['network', 'workflow'],
      childrenTypes: ['workflowStep', 'workflow'],
      definedAttributes: [
        this.pluginData.__nameAttributeDefinition,
        this.pluginData.__networkAttributeDefinition,
        this.pluginData.__workflowAttributeDefinition,
      ],
      isContainer: true,
      displayType: 'workflow',
      preventChildrenMovement: true,
      childrenPerLine: 1
    });

    this.pluginData.__horizontalWorkflowDefinition = new ComponentDefinition({
      type: 'workflow',
      icon: 'network',
      model: 'DefaultContainer',
      parentTypes: ['network', 'workflow'],
      childrenTypes: ['workflowStep', 'workflow'],
      definedAttributes: [
        this.pluginData.__nameAttributeDefinition,
        this.pluginData.__networkAttributeDefinition,
        this.pluginData.__workflowAttributeDefinition,
      ],
      isContainer: true,
      displayType: 'workflow',
      preventChildrenMovement: true,
      childrenPerLine: 5,
    });

    this.pluginData.__workflowStepDefinition = new ComponentDefinition({
      type: 'workflowStep',
      icon: 'network',
      model: 'DefaultModel',
      parentTypes: ['workflow'],
      definedAttributes: [
        this.pluginData.__nameAttributeDefinition
        ,this.pluginData.__workflowAttributeDefinition
      ],
      isContainer: false,
    });

    this.pluginData.definitions = {
      components: [
        this.pluginData.__networkDefinition,
        this.pluginData.__serverDefinition,
        this.pluginData.__laptopDefinition,
        this.pluginData.__verticalWorkflowDefinition,
        this.pluginData.__horizontalWorkflowDefinition,
        this.pluginData.__workflowStepDefinition,
      ],
    };
    this.pluginData.initLinkDefinitions();
  }
}

export default DemoMetadata;
