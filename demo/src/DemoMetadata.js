import {
  ComponentAttributeDefinition,
  ComponentDefinition,
  DefaultMetadata,
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
      linkModel: 'laptopLink',
    });

    this.pluginData.__laptopLinkObjectAttributeDefinition = new ComponentAttributeDefinition({
      name: 'laptop_object',
      type: 'Object',
      definedAttributes: [this.pluginData.__laptopLinkAttributeDefinition],
    });

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
      linkModel: 'networkLink',
    });

    // Component Definitions
    this.pluginData.__networkDefinition = new ComponentDefinition({
      type: 'network',
      icon: 'network',
      model: 'DefaultModel',
      parentTypes: ['network'],
      childrenTypes: ['server', 'network', 'workflow'],
      definedAttributes: [
        this.pluginData.__nameAttributeDefinition,
        this.pluginData.__networkAttributeDefinition,
      ],
      isContainer: true,
      defaultWidth: 230,
      defaultHeight: 50,
      minWidth: 230,
      minHeight: 72,
      reservedWidth: 12,
      reservedHeight: 56,
      margin: 15,
      gap: 50,
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
        this.pluginData.__laptopLinkObjectAttributeDefinition,
        this.pluginData.__networkLinkAttributeDefinition,
      ],
      isContainer: false,
      defaultWidth: 230,
      defaultHeight: 50,
      minWidth: 230,
      minHeight: 50,
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
      defaultWidth: 230,
      defaultHeight: 50,
      minWidth: 230,
      minHeight: 50,
    });

    this.pluginData.__verticalWorkflowDefinition = new ComponentDefinition({
      type: 'workflow',
      linkModel: 'workflowLink',
      icon: 'network',
      model: 'DefaultModel',
      parentTypes: ['network', 'workflow'],
      childrenTypes: ['workflowStep', 'workflow'],
      definedAttributes: [
        this.pluginData.__nameAttributeDefinition,
        this.pluginData.__networkAttributeDefinition,
        this.pluginData.__workflowAttributeDefinition,
      ],
      isContainer: true,
      displayType: 'workflow',
      workflowDirection: 'vertical',
      defaultWidth: 230,
      defaultHeight: 50,
      minWidth: 230,
      minHeight: 72,
      reservedWidth: 12,
      reservedHeight: 56,
      margin: 15,
      gap: 50,
    });

    this.pluginData.__horizontalWorkflowDefinition = new ComponentDefinition({
      type: 'workflow',
      linkModel: 'workflowLink',
      icon: 'network',
      model: 'DefaultModel',
      parentTypes: ['network', 'workflow'],
      childrenTypes: ['workflowStep', 'workflow'],
      definedAttributes: [
        this.pluginData.__nameAttributeDefinition,
        this.pluginData.__networkAttributeDefinition,
        this.pluginData.__workflowAttributeDefinition,
      ],
      isContainer: true,
      displayType: 'workflow',
      workflowDirection: 'horizontal',
      defaultWidth: 230,
      defaultHeight: 50,
      minWidth: 230,
      minHeight: 50,
      reservedWidth: 12,
      reservedHeight: 56,
      margin: 15,
      gap: 50,
    });

    this.pluginData.__workflowStepDefinition = new ComponentDefinition({
      type: 'workflowStep',
      icon: 'network',
      model: 'DefaultModel',
      parentTypes: ['workflow'],
      definedAttributes: [
        this.pluginData.__nameAttributeDefinition,
        this.pluginData.__workflowAttributeDefinition,
      ],
      isContainer: false,
      defaultWidth: 230,
      defaultHeight: 50,
      minWidth: 230,
      minHeight: 50,
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
