(window as any).requestAnimationFrame = callback => setTimeout(callback, 0);

const localStorageMock = {
  clear: jest.fn(),
  getItem: jest.fn(),
  setItem: jest.fn()
};

const sessionStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  // tslint:disable-next-line:object-literal-sort-keys
  removeItem: jest.fn()
};

jest.mock('oidc-client', () => {
  return {
    UserManager() {
      return {
        events: {
          addSilentRenewError: jest.fn(),
          addUserLoaded: jest.fn()
        },
        signinRedirect: jest.fn(),
        signinRedirectCallback: jest.fn(),
        signoutRedirect: jest.fn()
      };
    }
  };
});

(window as any).localStorage = localStorageMock;
(window as any).sessionStorage = sessionStorage;
