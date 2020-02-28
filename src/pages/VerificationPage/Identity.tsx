import classnames from 'classnames';
import {inject, observer} from 'mobx-react';
import React from 'react';
import {RootStoreProps} from '../../App';
import {Icons, RejectionWidget, Wrapper} from '../../components/Verification';
import {AnalyticsEvent} from '../../constants/analyticsEvents';
import {STORE_ROOT} from '../../constants/stores';
import IdentityDrivingLicense from './IdentityDrivingLicense';
import IdentityNationalCard from './IdentityNationalCard';
import IdentityPassport from './IdentityPassport';

export class Identity extends React.Component<RootStoreProps> {
  private readonly kycStore = this.props.rootStore!.kycStore;
  private readonly analyticsService = this.props.rootStore!.analyticsService;

  render() {
    const selectedIdCardType = this.kycStore.selectedIdCardType;
    const rejectReason = this.kycStore.getPoiRejectReason;
    const fileUploadLoading = this.kycStore.fileUploadLoading;
    const hasIdentityDocumentSelected = this.kycStore
      .hasIdentityDocumentSelected;

    return (
      <Wrapper loading={fileUploadLoading}>
        <div className="verify-identity">
          <div className="verification-page__big-title">
            Identity Documents Verification
          </div>
          <div className="verification-page__content">
            Please select the type of identity document
            {rejectReason && (
              <div className="mt-30">
                <RejectionWidget text={rejectReason} />
              </div>
            )}
            <div className="document-types">
              <DocumentTypeButton
                name="Passport"
                icon={<Icons.Passport />}
                active={selectedIdCardType === 'Passport'}
                onClick={() => {
                  if (
                    selectedIdCardType !== 'Passport' &&
                    hasIdentityDocumentSelected
                  ) {
                    if (!confirm('Are you sure to change document type?')) {
                      return;
                    }
                  }
                  this.kycStore.setSelectedIdCardType('Passport');
                  this.analyticsService.track(
                    AnalyticsEvent.Kyc.SelectedIdType('Passport')
                  );
                }}
              />
              <DocumentTypeButton
                name="National ID Card"
                icon={<Icons.Id />}
                active={selectedIdCardType === 'Id'}
                onClick={() => {
                  if (
                    selectedIdCardType !== 'Id' &&
                    hasIdentityDocumentSelected
                  ) {
                    if (!confirm('Are you sure to change document type?')) {
                      return;
                    }
                  }
                  this.kycStore.setSelectedIdCardType('Id');
                  this.analyticsService.track(
                    AnalyticsEvent.Kyc.SelectedIdType('ID')
                  );
                }}
              />
              <DocumentTypeButton
                name="Driving License"
                icon={<Icons.DriverLicense />}
                active={selectedIdCardType === 'DrivingLicense'}
                onClick={() => {
                  if (
                    selectedIdCardType !== 'DrivingLicense' &&
                    hasIdentityDocumentSelected
                  ) {
                    if (!confirm('Are you sure to change document type?')) {
                      return;
                    }
                  }
                  this.kycStore.setSelectedIdCardType('DrivingLicense');
                  this.analyticsService.track(
                    AnalyticsEvent.Kyc.SelectedIdType('DL')
                  );
                }}
              />
            </div>
            {selectedIdCardType === 'Passport' && <IdentityPassport />}
            {selectedIdCardType === 'Id' && <IdentityNationalCard />}
            {selectedIdCardType === 'DrivingLicense' && (
              <IdentityDrivingLicense />
            )}
            <div>
              <input
                type="submit"
                className="btn btn--primary"
                value="Submit"
                disabled={this.kycStore.shouldDisableIdentitySubmitButton}
                onClick={async () => {
                  this.analyticsService.track(
                    AnalyticsEvent.Kyc.SubmitPhoto('ID')
                  );
                  await this.kycStore.uploadIdentity();
                }}
              />
            </div>
          </div>
        </div>
      </Wrapper>
    );
  }
}

const DocumentTypeButton: React.SFC<any> = ({name, icon, active, onClick}) => (
  <div
    onClick={onClick}
    className={classnames('document-type-button', {
      active
    })}
  >
    {icon}
    <div className="text">{name}</div>
  </div>
);

export default inject(STORE_ROOT)(observer(Identity));
