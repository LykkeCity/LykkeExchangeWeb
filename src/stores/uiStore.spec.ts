import {RootStore} from './index';

describe('ui store', () => {
  const rootStore = new RootStore();
  const {uiStore} = rootStore;
  describe('start requests', () => {
    beforeEach(() => {
      uiStore.clearPendingRequests();
    });

    it('should inc pending requests if no param passed', () => {
      uiStore.startRequest();
      expect(uiStore.pendingRequestsCount).toBe(1);
    });

    it('should inc pending requests by value passed as a param', () => {
      uiStore.startRequest(12);
      expect(uiStore.pendingRequestsCount).toBe(12);
    });

    it('should work well consequently', () => {
      uiStore.startRequest();
      uiStore.startRequest(8);
      uiStore.startRequest();

      expect(uiStore.pendingRequestsCount).toBe(10);
    });
  });

  describe('finish requests', () => {
    beforeEach(() => {
      uiStore.pendingRequestsCount = 10;
    });

    it('should not decrease to negative value', () => {
      uiStore.pendingRequestsCount = 0;
      uiStore.finishRequest();
      expect(uiStore.pendingRequestsCount).toBe(0);
      expect(uiStore.pendingRequestsCount).toBeGreaterThan(-1);
    });

    it('should decrease by 1 if no param passed', () => {
      uiStore.finishRequest();
      expect(uiStore.pendingRequestsCount).toBe(9);
    });

    it('should decrease by value passed as a param', () => {
      uiStore.finishRequest(9);
      expect(uiStore.pendingRequestsCount).toBe(1);
    });

    it('should not decrease to negative value when big num passed', () => {
      uiStore.finishRequest(99);
      expect(uiStore.pendingRequestsCount).toBe(0);
    });

    it('should work well consequently', () => {
      uiStore.finishRequest();
      uiStore.finishRequest(8);
      uiStore.finishRequest();

      expect(uiStore.pendingRequestsCount).toBe(0);
    });
  });
});
