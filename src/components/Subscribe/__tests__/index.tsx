import {shallow} from 'enzyme';
import React from 'react';
import Subscribe from '../index';

describe('<Subscribe>', () => {
  const getTestSubscribe = () => {
    return <Subscribe />;
  };

  describe('method render', () => {
    it('should render input for email', () => {
      const wrapper = shallow(getTestSubscribe());
      expect(wrapper.find('input[type="email"]')).toHaveLength(1);
    });
  });
});
