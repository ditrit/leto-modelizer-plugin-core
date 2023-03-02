import EventLog from 'src/models/EventLog';

describe('Test class: EventLog', () => {
  describe('Test constructor', () => {
    it('Check variable instantiation', () => {
      const log = new EventLog();

      expect(log.id).toBeNull();
      expect(log.parentId).toBeNull();
      expect(log.type).toBeNull();
      expect(log.action).toBeNull();
      expect(log.status).toBeNull();
      expect(log.data).toBeNull();
      expect(log.files).toBeNull();
      expect(log.components).toBeNull();
      expect(log.links).toBeNull();
      expect(log.startDate).toBeNull();
      expect(log.endDate).toBeNull();
    });

    it('Check passing undefined variables to constructor', () => {
      const log = new EventLog({});

      expect(log.id).toBeNull();
      expect(log.parentId).toBeNull();
      expect(log.type).toBeNull();
      expect(log.action).toBeNull();
      expect(log.status).toBeNull();
      expect(log.data).toBeNull();
      expect(log.files).toBeNull();
      expect(log.components).toBeNull();
      expect(log.links).toBeNull();
      expect(log.startDate).toBeNull();
      expect(log.endDate).toBeNull();
    });

    it('Check passing all variables to constructor', () => {
      const log = new EventLog({
        id: 1,
        parentId: 2,
        files: ['files'],
        components: ['components'],
        links: ['links'],
        type: 'type',
        action: 'action',
        status: 'status',
        data: 'data',
      });

      expect(log.id).toEqual(1);
      expect(log.parentId).toEqual(2);
      expect(log.type).toEqual('type');
      expect(log.action).toEqual('action');
      expect(log.status).toEqual('status');
      expect(log.data).toEqual('data');
      expect(log.files).toEqual(['files']);
      expect(log.components).toEqual(['components']);
      expect(log.links).toEqual(['links']);
      expect(log.startDate).toBeNull();
      expect(log.endDate).toBeNull();
    });
  });
});
