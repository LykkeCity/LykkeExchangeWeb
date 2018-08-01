import {shallow} from 'enzyme';
import React from 'react';
import {RootStore} from '../../../stores';
import {ProfileSection} from '../index';

describe('<ProfileSection>', () => {
  const rootStore = new RootStore();
  const getTestProfileSection = () => {
    return <ProfileSection rootStore={rootStore} />;
  };

  beforeEach(() => {
    rootStore.profileStore.isKycPassed = false;
  });

  describe('method render', () => {
    it('should render section with Profile title', () => {
      const wrapper = shallow(getTestProfileSection());
      expect((wrapper.props() as any).title).toBe('Profile');
    });

    it('should render user details', () => {
      const wrapper = shallow(getTestProfileSection());
      expect(wrapper.find('inject-UserDetails-with-rootStore')).toHaveLength(1);
    });

    it('should not render Go to KYC button if KYC already passed', () => {
      rootStore.profileStore.isKycPassed = true;

      const wrapper = shallow(getTestProfileSection());
      expect(wrapper.find('Button')).toHaveLength(0);
    });
  });

  describe('method goToKYC', () => {
    it('should open new page on Go to KYC button', () => {
      window.open = jest.fn();

      const wrapper = shallow(getTestProfileSection());
      const goToKYCButtonProps = wrapper.find('.action-button').props() as any;
      goToKYCButtonProps.onClick();
      expect(window.open).toBeCalled();
    });
  });
});
