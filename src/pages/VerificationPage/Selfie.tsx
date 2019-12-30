import {inject, observer} from 'mobx-react';
import React from 'react';
import {RootStoreProps} from '../../App';
import DocumentSelector from '../../components/DocumentSelector';
import Spinner from '../../components/Spinner';
import {RejectionWidget} from '../../components/Verification';
import {STORE_ROOT} from '../../constants/stores';

export class Selfie extends React.Component<RootStoreProps> {
  private readonly kycStore = this.props.rootStore!.kycStore;

  render() {
    const rejectReason = this.kycStore.getSelfieRejectReason;
    const rejectedSelfieImage = this.kycStore.rejectedDocuments.SELFIE;
    const fileUploadLoading = this.kycStore.fileUploadLoading;
    return (
      <div>
        <div className="verification-page__big-title">Selfie verification</div>
        <div className="verification-page__content">
          Your selfie should be well lit and in focus
          {rejectReason && (
            <div className="mt-30">
              <RejectionWidget text={rejectReason} />
            </div>
          )}
          <div className="mt-30">
            <DocumentSelector
              fromCamera={true}
              maxFileSize={3}
              accept={[]}
              rejectedImage={rejectedSelfieImage}
              onDocumentTaken={document => {
                this.kycStore.setDocument('SELFIE', document);
              }}
              onDocumentClear={() => {
                this.kycStore.clearDocument('SELFIE');
              }}
              rules={
                <ul>
                  <li>
                    Use your mobile camera to shoot a live selfie photograph of
                    yourself
                  </li>
                  <li>• Selfie image should be well lit and sharp</li>
                  <li>
                    Photograph of a photograph or computer screen is not
                    suitable
                  </li>
                  <li>
                    Take off your glasses if your ID photograph is without
                    glasses
                  </li>
                </ul>
              }
            />
            <div className="mt-30">
              <input
                type="submit"
                className="btn btn--primary"
                value="Submit"
                disabled={this.kycStore.shouldDisableSelfieSubmitButton}
                onClick={async () => await this.kycStore.uploadSelfie()}
              />
              {fileUploadLoading && <Spinner />}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default inject(STORE_ROOT)(observer(Selfie));
