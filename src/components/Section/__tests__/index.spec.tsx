import {shallow} from 'enzyme';
import React from 'react';
import {Section} from '../index';

describe('<Section>', () => {
  const getTestSection = () => {
    return <Section title="Title">Some content</Section>;
  };

  describe('method render', () => {
    it('should render title', () => {
      const wrapper = shallow(getTestSection());
      const title = wrapper.find('.section__title');
      expect(title).toHaveLength(1);
      expect(title.text()).toBe('Title');
    });

    it('should render separator', () => {
      const wrapper = shallow(getTestSection());
      expect(wrapper.find('.separator')).toHaveLength(1);
    });
  });
});
