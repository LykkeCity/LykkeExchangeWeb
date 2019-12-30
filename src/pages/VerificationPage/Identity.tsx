import classnames from 'classnames';
import {inject, observer} from 'mobx-react';
import React from 'react';
import {RootStoreProps} from '../../App';
import Spinner from '../../components/Spinner';
import {Icons, RejectionWidget} from '../../components/Verification';
import {STORE_ROOT} from '../../constants/stores';
import IdentityDrivingLicense from './IdentityDrivingLicense';
import IdentityNationalCard from './IdentityNationalCard';
import IdentityPassport from './IdentityPassport';

export class Identity extends React.Component<RootStoreProps> {
  private readonly kycStore = this.props.rootStore!.kycStore;

  render() {
    const selectedIdCardType = this.kycStore.selectedIdCardType;
    const rejectReason = this.kycStore.getPoiRejectReason;
    const fileUploadLoading = this.kycStore.fileUploadLoading;
    const hasIdentityDocumentSelected = this.kycStore
      .hasIdentityDocumentSelected;

    return (
      <div className="verify-identity">
        <div className="verification-page__big-title">
          Document Verification
        </div>
        <div className="verification-page__content">
          Please choose a type of document you’d like to use for your ID
          verification
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
              }}
            />
            <DocumentTypeButton
              name="Driver License"
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
              onClick={async () => await this.kycStore.uploadIdentity()}
            />
            {fileUploadLoading && <Spinner />}
          </div>
        </div>
      </div>
    );
  }
}

const DocumentTypeButton: React.SFC<any> = ({name, icon, active, onClick}) => (
  <div
    onClick={onClick}
    className={classnames({
      active,
      'document-type-button': true
    })}
  >
    {icon}
    <div className="text">{name}</div>
  </div>
);

export default inject(STORE_ROOT)(observer(Identity));
