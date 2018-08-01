import {shallow} from 'enzyme';
import React from 'react';
import {RootStore} from '../../../stores';
import {StartPage} from '../index';

describe('Start page', () => {
  const match: any = {};
  const location: any = {};
  const history: any = {};
  const rootStore = new RootStore();

  const getTestPage = () => {
    return (
      <StartPage
        rootStore={rootStore}
        match={match}
        location={location}
        history={history}
      />
    );
  };

  describe('method componentDidMount', () => {
    it('should scroll page to the start at loading', () => {
      window.scrollTo = jest.fn();

      shallow(getTestPage());
      expect(window.scrollTo).toHaveBeenCalled();
    });
  });

  describe('method openSignInPage', () => {
    it('should open sign in page on "Get started" button click', () => {
      const onSignIn = jest.fn();
      rootStore.authStore.signIn = onSignIn;

      const wrapper = shallow(getTestPage());
      wrapper.find('.sign-in-button').simulate('click');
      expect(onSignIn).toHaveBeenCalled();
    });
  });

  describe('method render', () => {
    it('should render info about Lykke Account', () => {
      const wrapper = shallow(getTestPage());
      expect(wrapper.find('LykkeAccountsSection')).toHaveLength(1);
    });

    it('should render info about Lykke Trade', () => {
      const wrapper = shallow(getTestPage());
      expect(wrapper.find('LykkeTradeSection')).toHaveLength(1);
    });
  });
});
