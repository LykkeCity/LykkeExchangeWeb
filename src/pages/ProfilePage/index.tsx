import {MenuItem, Select} from '@lykkecity/react-components';
import {inject, observer} from 'mobx-react';
import React from 'react';
import {RootStoreProps} from '../../App';
import VerificationInReviewWidget from '../../components/VerificationInReviewWidget';
import {AnalyticsEvent} from '../../constants/analyticsEvents';
import {STORE_ROOT} from '../../constants/stores';
import AccountLevel from './AccountLevel';
import DepositLimits from './DepositLimits';

import './style.css';

export class ProfilePage extends React.Component<RootStoreProps> {
  private readonly assetStore = this.props.rootStore!.assetStore;
  private readonly profileStore = this.props.rootStore!.profileStore;
  private readonly uiStore = this.props.rootStore!.uiStore;
  private readonly analyticsService = this.props.rootStore!.analyticsService;

  async componentDidMount() {
    this.uiStore.activeHeaderMenuItem = MenuItem.Profile;
    window.scrollTo(0, 0);

    if (this.assetStore.assets.length === 0) {
      await this.assetStore.fetchAssets();
    }

    if (this.assetStore.baseAssets.length === 0) {
      await this.assetStore.fetchAvailableAssets();
    }
  }

  render() {
    return (
      <div className="profile-page">
        <div className="container">
          <VerificationInReviewWidget />
          <AccountLevel />
          <DepositLimits />
          <h2 className="profile-page__title">Personal Data</h2>
          <div className="col-sm-6">
            <div className="form-group">
              <label htmlFor="firstName" className="control-label">
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                className="form-control"
                value={this.profileStore.firstName}
                disabled
              />
            </div>
          </div>
          <div className="col-sm-6">
            <div className="form-group">
              <label htmlFor="lastName" className="control-label">
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                className="form-control"
                value={this.profileStore.lastName}
                disabled
              />
            </div>
          </div>
          <div className="col-sm-12">
            <div className="form-group">
              <label htmlFor="email" className="control-label">
                Email
              </label>
              <input
                id="email"
                type="text"
                className="form-control"
                value={this.profileStore.email}
                disabled
              />
            </div>
          </div>
          <div className="col-sm-12">
            <div className="form-group">
              <label htmlFor="baseAsset" className="control-label">
                Base Asset
              </label>
              <Select
                options={this.assetStore.baseAssets.sort((a: any, b: any) =>
                  a.name.localeCompare(b.name)
                )}
                labelKey="name"
                valueKey="id"
                onChange={this.handleChangeBaseAsset}
                value={this.profileStore.baseAsset}
                placeholder="Select..."
                searchPlaceholder="Enter asset name or select from list..."
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  private handleChangeBaseAsset = (asset: any) => {
    this.analyticsService.track(AnalyticsEvent.ChangeBaseAsset(asset.id));
    this.profileStore.setBaseAsset(asset);
  };
}

export default inject(STORE_ROOT)(observer(ProfilePage));
