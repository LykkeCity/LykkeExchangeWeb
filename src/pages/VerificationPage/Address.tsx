import {inject, observer} from 'mobx-react';
import React from 'react';
import {RootStoreProps} from '../../App';
import DocumentSelector from '../../components/DocumentSelector';
import {RejectionWidget, Wrapper} from '../../components/Verification';
import {STORE_ROOT} from '../../constants/stores';

export class Address extends React.Component<RootStoreProps> {
  private readonly kycStore = this.props.rootStore!.kycStore;

  render() {
    const rejectReason = this.kycStore.getPoaRejectReason;
    const rejectedPoaImage = this.kycStore.rejectedDocuments.ADDRESS;
    const fileUploadLoading = this.kycStore.fileUploadLoading;
    return (
      <Wrapper loading={fileUploadLoading}>
        <div className="verification-page__big-title">
          Proof of address verification
        </div>
        <div className="verification-page__content">
          Upload a clear and legible picture of your document
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
              accept={['.png', '.jpg', '.pdf', '.jpeg']}
              onDocumentTaken={document => {
                this.kycStore.setDocument('ADDRESS', document);
              }}
              onDocumentClear={() => {
                this.kycStore.clearDocument('ADDRESS');
              }}
              rules={
                <ul>
                  <li>
                    Please use: Bank/Card Statement or Gas/Electricity/Water
                    Bill or Official Governmental Documents
                  </li>
                  <li>
                    The document should display Name, Surname, Street address
                    (Non-P.O Box), Date, Issuer name
                  </li>
                  <li>
                    The document you provide should not be older than 3 months
                    and should be different from your ID document
                  </li>
                  <li>Please note that review might take up to 48 hours</li>
                </ul>
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
            </div>
          </div>
        </div>
      </Wrapper>
    );
  }
}

export default inject(STORE_ROOT)(observer(Address));
