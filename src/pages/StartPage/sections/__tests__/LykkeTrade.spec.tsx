import {shallow} from 'enzyme';
import React from 'react';
import LykkeTrade from '../LykkeTrade';

describe('<LykkeTrade>', () => {
  const getTestLykkeTrade = () => {
    return <LykkeTrade />;
  };

  describe('method render', () => {
    it('should render product logo', () => {
      const wrapper = shallow(getTestLykkeTrade());
      expect(wrapper.find('.product-logo')).toHaveLength(1);
    });

    it('should render product details', () => {
      const wrapper = shallow(getTestLykkeTrade());
      expect(wrapper.find('.product-details')).toHaveLength(1);
    });

    it('should render product description', () => {
      const wrapper = shallow(getTestLykkeTrade());
      expect(wrapper.find('.product-description')).toHaveLength(1);
    });

    it('should render product links', () => {
      const wrapper = shallow(getTestLykkeTrade());
      expect(wrapper.find('.product-links')).toHaveLength(1);
    });

    it('should render product image', () => {
      const wrapper = shallow(getTestLykkeTrade());
      expect(wrapper.find('.product-image')).toHaveLength(1);
    });
  });
});
