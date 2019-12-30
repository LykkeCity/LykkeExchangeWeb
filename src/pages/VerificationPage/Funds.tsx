import {inject, observer} from 'mobx-react';
import React from 'react';
import {RootStoreProps} from '../../App';
import DocumentSelector from '../../components/DocumentSelector';
import Spinner from '../../components/Spinner';
import {RejectionWidget} from '../../components/Verification';
import {STORE_ROOT} from '../../constants/stores';

export class Funds extends React.Component<RootStoreProps> {
  private readonly kycStore = this.props.rootStore!.kycStore;

  render() {
    const rejectReason = this.kycStore.getPofRejectReason;
    const rejectedPofImage = this.kycStore.rejectedDocuments.FUNDS;
    const fileUploadLoading = this.kycStore.fileUploadLoading;
    return (
      <div>
        <div className="verification-page__big-title">
          Proof of funds verification
        </div>
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
              rejectedImage={rejectedPofImage}
              accept={['.png', '.jpg', '.pdf']}
              onPictureTaken={pictureBase64 => {
                this.kycStore.setPicture('FUNDS', pictureBase64);
              }}
              onPictureClear={() => {
                this.kycStore.clearPicture('FUNDS');
              }}
              rules={
                <ul>
                  <li>
                    Upload a clear and legible picture or scan of your signed
                    source of funds document
                  </li>
                  <li>
                    Check the examples of{' '}
                    <a href="/" target="_blank">
                      acceptable documents
                    </a>{' '}
                    here
                  </li>
                  <li>Please not that review might take up to 48 hours</li>
                </ul>
              }
            />
            <div className="mt-30">
              <input
                type="submit"
                className="btn btn--primary"
                value="Submit"
                disabled={this.kycStore.shouldDisableFundsSubmitButton}
                onClick={async () => await this.kycStore.uploadProofOfFunds()}
              />
              {fileUploadLoading && <Spinner />}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default inject(STORE_ROOT)(observer(Funds));
