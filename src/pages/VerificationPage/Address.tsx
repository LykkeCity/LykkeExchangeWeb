import {inject, observer} from 'mobx-react';
import React from 'react';
import {RootStoreProps} from '../../App';
import DocumentSelector from '../../components/DocumentSelector';
import Spinner from '../../components/Spinner';
import {RejectionWidget} from '../../components/Verification';
import {STORE_ROOT} from '../../constants/stores';

export class Address extends React.Component<RootStoreProps> {
  private readonly kycStore = this.props.rootStore!.kycStore;

  render() {
    const rejectReason = this.kycStore.getPoaRejectReason;
    const rejectedPoaImage = this.kycStore.rejectedDocuments.ADDRESS;
    const fileUploadLoading = this.kycStore.fileUploadLoading;
    return (
      <div>
        <div className="verification-page__big-title">Proof of address</div>
        <div className="verification-page__content">
          Please upload a document that states your address
          {rejectReason && (
            <div className="mt-30">
              <RejectionWidget text={rejectReason} />
            </div>
          )}
          <div className="mt-30">
            <DocumentSelector
              fromCamera={true}
              fromLibrary={true}
              maxFileSize={3}
              rejectedImage={rejectedPoaImage}
              accept={['.png', '.jpg', '.pdf']}
              onPictureTaken={pictureBase64 => {
                this.kycStore.setPicture('ADDRESS', pictureBase64);
              }}
              onPictureClear={() => {
                this.kycStore.clearPicture('ADDRESS');
              }}
              rules={
                <div>
                  <div>
                    • Please use: Bank/Card Statement or Gas/Electricity/Water
                    Bill or Official Governmental Documents
                  </div>
                  <div>
                    • The document should display Name, Surname, Street address
                    (Non-P.O Box), Date, Issuer name
                  </div>
                  <div>
                    • The document you provide should not be older than 3 months
                    and should be different from your ID document
                  </div>
                  <div>• Please note that review might take up to 48 hours</div>
                </div>
              }
            />
            <div className="mt-30">
              <input
                type="submit"
                className="btn btn--primary"
                value="Submit"
                disabled={this.kycStore.shouldDisableAddressSubmitButton}
                onClick={async () => this.kycStore.uploadProofOfAddress()}
              />
              {fileUploadLoading && <Spinner />}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default inject(STORE_ROOT)(observer(Address));
