import {shallow} from 'enzyme';
import React from 'react';
import LykkeAccounts from '../LykkeAccounts';

describe('<LykkeAccounts>', () => {
  const getTestLykkeAccounts = () => {
    return <LykkeAccounts />;
  };

  describe('method render', () => {
    it('should render product logo', () => {
      const wrapper = shallow(getTestLykkeAccounts());
      expect(wrapper.find('.product-logo')).toHaveLength(1);
    });

    it('should render product details', () => {
      const wrapper = shallow(getTestLykkeAccounts());
      expect(wrapper.find('.product-details')).toHaveLength(1);
    });

    it('should render product description', () => {
      const wrapper = shallow(getTestLykkeAccounts());
      expect(wrapper.find('.product-description')).toHaveLength(1);
    });

    it('should render product links', () => {
      const wrapper = shallow(getTestLykkeAccounts());
      expect(wrapper.find('.product-links')).toHaveLength(1);
    });

    it('should render product image', () => {
      const wrapper = shallow(getTestLykkeAccounts());
      expect(wrapper.find('.product-image')).toHaveLength(1);
    });
  });
});
