import classnames from 'classnames';
import {inject, observer} from 'mobx-react';
import React from 'react';
import {RootStoreProps} from '../../App';
import DocumentSelector from '../../components/DocumentSelector';
import {AnalyticsEvent} from '../../constants/analyticsEvents';
import {STORE_ROOT} from '../../constants/stores';

interface IdentityDrivingLicenseState {
  activeSide: 'FRONT' | 'BACK';
}

export class IdentityDrivingLicense extends React.Component<
  RootStoreProps,
  IdentityDrivingLicenseState
> {
  frontSideSelector: any;
  backSideSelector: any;
  state = {activeSide: 'FRONT'} as IdentityDrivingLicenseState;
  private readonly kycStore = this.props.rootStore!.kycStore;
  private readonly analyticsService = this.props.rootStore!.analyticsService;

  render() {
    const activeSide = this.state.activeSide;
    const rejectedPoiDrivingLicenseImage = this.kycStore.rejectedDocuments
      .IDENTITY_DRIVER_LICENSE;
    const rules = (
      <ul>
        <li>
          Upload a clear and legible picture of{' '}
          {activeSide === 'FRONT' ? 'front' : 'back'} side of your Driving
          License
        </li>
      </ul>
    );
    return (
      <div className="identity-form">
        <div className="tab-buttons">
          <div
            className={classnames({
              active: activeSide === 'FRONT',
              'tab-button': true
            })}
            onClick={() => {
              if (
                !this.kycStore.verificationDocuments
                  .IDENTITY_DRIVER_LICENSE_BACK
              ) {
                this.backSideSelector.turnOffCamera();
              }
              this.setState({activeSide: 'FRONT'});
            }}
          >
            <span className="number">1</span>
            <span className="text">Front side</span>
          </div>
          <div
            className={classnames({
              active: activeSide === 'BACK',
              'tab-button': true
            })}
            onClick={() => {
              if (
                !this.kycStore.verificationDocuments
                  .IDENTITY_DRIVER_LICENSE_FRONT
              ) {
                this.frontSideSelector.turnOffCamera();
              }
              this.setState({activeSide: 'BACK'});
            }}
          >
            <span className="number">2</span>
            <span className="text">Back side</span>
          </div>
        </div>
        <div className="mt-30">
          <div style={{display: activeSide === 'FRONT' ? 'block' : 'none'}}>
            <DocumentSelector
              analyticsService={this.analyticsService}
              ref={ref => (this.frontSideSelector = ref)}
              fromCamera={true}
              maxFileSize={3}
              accept={[]}
              rejectedImage={rejectedPoiDrivingLicenseImage}
              onDocumentTaken={document => {
                this.kycStore.setDocument(
                  'IDENTITY_DRIVER_LICENSE_FRONT',
                  document
                );
              }}
              onDocumentClear={() => {
                this.kycStore.clearDocument('IDENTITY_DRIVER_LICENSE_FRONT');
                this.analyticsService.track(
                  AnalyticsEvent.Kyc.RetakePhoto('ID')
                );
              }}
              rules={rules}
            />
          </div>
          <div style={{display: activeSide === 'BACK' ? 'block' : 'none'}}>
            <DocumentSelector
              analyticsService={this.analyticsService}
              ref={ref => (this.backSideSelector = ref)}
              fromCamera={true}
              maxFileSize={3}
              accept={[]}
              onDocumentTaken={document => {
                this.kycStore.setDocument(
                  'IDENTITY_DRIVER_LICENSE_BACK',
                  document
                );
              }}
              onDocumentClear={() => {
                this.kycStore.clearDocument('IDENTITY_DRIVER_LICENSE_BACK');
                this.analyticsService.track(
                  AnalyticsEvent.Kyc.RetakePhoto('ID')
                );
              }}
              rules={rules}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default inject(STORE_ROOT)(observer(IdentityDrivingLicense));
