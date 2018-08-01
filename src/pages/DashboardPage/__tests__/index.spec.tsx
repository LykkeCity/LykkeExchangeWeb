import {shallow} from 'enzyme';
import React from 'react';
import {DashboardPage} from '../index';

describe('Dashboard page', () => {
  const match: any = {};
  const location: any = {};
  const history: any = {};

  const getTestPages = () => {
    return (
      <DashboardPage match={match} location={location} history={history} />
    );
  };

  describe('method render', () => {
    it('should render profile section', () => {
      const wrapper = shallow(getTestPages());
      expect(wrapper.find('inject-ProfileSection-with-rootStore')).toHaveLength(
        1
      );
    });

    it('should render balance section', () => {
      const wrapper = shallow(getTestPages());
      expect(wrapper.find('inject-BalanceSection-with-rootStore')).toHaveLength(
        1
      );
    });
  });
});
