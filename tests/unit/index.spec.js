import * as Plugin from 'src/index';

describe('Test library index', () => {
  it('Check export', () => {
    expect(Object.keys(Plugin).length).toEqual(19);
    expect(Plugin.Component).not.toBeNull();
    expect(Plugin.ComponentAttribute).not.toBeNull();
    expect(Plugin.ComponentAttributeDefinition).not.toBeNull();
    expect(Plugin.ComponentDefinition).not.toBeNull();
    expect(Plugin.ComponentDrawOption).not.toBeNull();
    expect(Plugin.ComponentLink).not.toBeNull();
    expect(Plugin.ComponentLinkDefinition).not.toBeNull();
    expect(Plugin.DefaultDrawer).not.toBeNull();
    expect(Plugin.DefaultMetadata).not.toBeNull();
    expect(Plugin.DefaultParser).not.toBeNull();
    expect(Plugin.DefaultRender).not.toBeNull();
    expect(Plugin.FileInformation).not.toBeNull();
    expect(Plugin.FileInput).not.toBeNull();
    expect(Plugin.ParseError).not.toBeNull();
    expect(Plugin.DefaultPlugin).not.toBeNull();
    expect(Plugin.DefaultData).not.toBeNull();
    expect(Plugin.DefaultConfiguration).not.toBeNull();
    expect(Plugin.Tag).not.toBeNull();
    expect(Plugin.Variable).not.toBeNull();
  });
});
