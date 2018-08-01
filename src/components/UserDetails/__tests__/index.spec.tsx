import {shallow} from 'enzyme';
import React from 'react';
import {UserDetails} from '..';
import {RootStore} from '../../../stores';

describe('<UserDetails>', () => {
  const rootStore = new RootStore();

  const getTestUserDetails = () => {
    return <UserDetails rootStore={rootStore} />;
  };

  describe('method render', () => {
    it('should render user profile image', () => {
      const wrapper = shallow(getTestUserDetails());
      expect(wrapper.find('.profile-image')).toHaveLength(1);
    });

    it('should render user name', () => {
      rootStore.profileStore.firstName = 'First';
      rootStore.profileStore.lastName = 'Last';

      const wrapper = shallow(getTestUserDetails());
      const name = wrapper.find('.profile-details__name');
      expect(name).toHaveLength(1);
      expect(name.text()).toBe('First Last');
    });

    it('should render user email', () => {
      rootStore.profileStore.email = 'test@test.com';

      const wrapper = shallow(getTestUserDetails());
      const email = wrapper.find('.profile-details__email');
      expect(email).toHaveLength(1);
      expect(email.text()).toBe('test@test.com');
    });

    it('should render verified status if KYC passed', () => {
      rootStore.profileStore.isKycPassed = true;
      const wrapper = shallow(getTestUserDetails());
      const status = wrapper.find('.profile-details__status');
      expect(status).toHaveLength(1);
      expect(status.text()).toBe('Verified');
    });

    it('should render not verified status if KYC not passed', () => {
      rootStore.profileStore.isKycPassed = false;
      const wrapper = shallow(getTestUserDetails());
      const status = wrapper.find('.profile-details__status');
      expect(status).toHaveLength(1);
      expect(status.text()).toBe('Not verified');
    });
  });
});
