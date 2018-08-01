import {shallow} from 'enzyme';
import React from 'react';
import {RootStore} from '../../../stores';
import {VerificationStatus} from '../index';

describe('<VerificationStatus>', () => {
  const rootStore = new RootStore();
  const getTestVerificationStatus = () => {
    return <VerificationStatus rootStore={rootStore} />;
  };

  describe('method render', () => {
    it('should render verified icon for verified profile', () => {
      rootStore.profileStore.isKycPassed = true;

      const wrapper = shallow(getTestVerificationStatus());
      const iconProps = wrapper.find('.kyc-status__icon img').props();
      expect(iconProps.src).toContain('done');
    });

    it('should render not verified icon for not verified profile', () => {
      rootStore.profileStore.isKycPassed = false;

      const wrapper = shallow(getTestVerificationStatus());
      const iconProps = wrapper.find('.kyc-status__icon img').props();
      expect(iconProps.src).toContain('wait');
    });

    it('should render verified text for verified profile', () => {
      rootStore.profileStore.isKycPassed = true;

      const wrapper = shallow(getTestVerificationStatus());
      expect(wrapper.find('.kyc-status__text').text()).toBe('You are verified');
    });

    it('should render not verified text for not verified profile', () => {
      rootStore.profileStore.isKycPassed = false;

      const wrapper = shallow(getTestVerificationStatus());
      expect(wrapper.find('.kyc-status__text').text()).toBe(
        'You are not verified'
      );
    });
  });
});
