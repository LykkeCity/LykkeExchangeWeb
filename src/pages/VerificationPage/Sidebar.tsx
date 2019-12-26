import React from 'react';
import {
  AccountCurrentTierWidget,
  UpgradeToNextTierWidget
} from '../../components/Verification';

export const Sidebar: React.SFC = () => (
  <div className="verification-page__sidebar">
    <div className="verification-page__sidebar-inner">
      <AccountCurrentTierWidget />
      <UpgradeToNextTierWidget />
    </div>
  </div>
);

export default Sidebar;
