(window as any).requestAnimationFrame = callback => setTimeout(callback, 0);

const localStorageMock = {
  clear: jest.fn(),
  getItem: jest.fn(),
  setItem: jest.fn()
};

(window as any).localStorage = localStorageMock;
