import classnames from 'classnames';
import {inject, observer} from 'mobx-react';
import React from 'react';
import {RootStoreProps} from '../../App';
import DocumentSelector from '../../components/DocumentSelector';
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

  render() {
    const activeSide = this.state.activeSide;
    const rejectedPoiDrivingLicenseImage = this.kycStore.rejectedDocuments
      .IDENTITY_DRIVER_LICENSE;
    const rules = (
      <ul>
        <li>
          Both sides of driving license should display a photograph, full name
          and date of birth
        </li>
        <li>
          Image should cover the entire document, be well lit and in focus
        </li>
        <li>
          Driving license and Proof of Address should be separate documents
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
            <span className="text">Frontside of Driver License</span>
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
            <span className="text">Backside of Driver License</span>
          </div>
        </div>
        <div className="mt-30">
          <div style={{display: activeSide === 'FRONT' ? 'block' : 'none'}}>
            <DocumentSelector
              ref={ref => (this.frontSideSelector = ref)}
              fromCamera={true}
              maxFileSize={3}
              accept={[]}
              rejectedImage={rejectedPoiDrivingLicenseImage}
              onPictureTaken={pictureBase64 => {
                this.kycStore.setDocument(
                  'IDENTITY_DRIVER_LICENSE_FRONT',
                  pictureBase64
                );
              }}
              onPictureClear={() => {
                this.kycStore.clearDocument('IDENTITY_DRIVER_LICENSE_FRONT');
              }}
              rules={rules}
            />
          </div>
          <div style={{display: activeSide === 'BACK' ? 'block' : 'none'}}>
            <DocumentSelector
              ref={ref => (this.backSideSelector = ref)}
              fromCamera={true}
              maxFileSize={3}
              accept={[]}
              onPictureTaken={pictureBase64 => {
                this.kycStore.setDocument(
                  'IDENTITY_DRIVER_LICENSE_BACK',
                  pictureBase64
                );
              }}
              onPictureClear={() => {
                this.kycStore.clearDocument('IDENTITY_DRIVER_LICENSE_BACK');
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
