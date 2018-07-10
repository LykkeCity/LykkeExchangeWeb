import Enzyme, {mount, render, shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

(window as any).requestAnimationFrame = callback => setTimeout(callback, 0);

// React 16 Enzyme adapter
Enzyme.configure({adapter: new Adapter()});

// Make Enzyme functions available in all test files without importing
(window as any).shallow = shallow;
(window as any).render = render;
(window as any).mount = mount;

const localStorageMock = {
  clear: jest.fn(),
  getItem: jest.fn(),
  setItem: jest.fn()
};

(window as any).localStorage = localStorageMock;
