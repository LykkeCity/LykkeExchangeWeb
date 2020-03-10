import {inject, observer} from 'mobx-react';
import React from 'react';
import {RootStoreProps} from '../../App';
import DocumentSelector from '../../components/DocumentSelector';
import {RejectionWidget, Wrapper} from '../../components/Verification';
import {AnalyticsEvent} from '../../constants/analyticsEvents';
import {STORE_ROOT} from '../../constants/stores';

export class Selfie extends React.Component<RootStoreProps> {
  private readonly kycStore = this.props.rootStore!.kycStore;
  private readonly analyticsService = this.props.rootStore!.analyticsService;

  render() {
    const rejectReason = this.kycStore.getSelfieRejectReason;
    const rejectedSelfieImage = this.kycStore.rejectedDocuments.SELFIE;
    const fileUploadLoading = this.kycStore.fileUploadLoading;
    return (
      <Wrapper loading={fileUploadLoading}>
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
              analyticsService={this.analyticsService}
              fromCamera={true}
              maxFileSize={3}
              accept={[]}
              rejectedImage={rejectedSelfieImage}
              onDocumentTaken={document => {
                this.kycStore.setDocument('SELFIE', document);
              }}
              onDocumentClear={() => {
                this.kycStore.clearDocument('SELFIE');
                this.analyticsService.track(
                  AnalyticsEvent.Kyc.RetakePhoto('Selfie')
                );
              }}
              rules={
                <ul>
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
                onClick={async () => {
                  this.analyticsService.track(
                    AnalyticsEvent.Kyc.SubmitPhoto('Selfie')
                  );
                  await this.kycStore.uploadSelfie();
                }}
              />
            </div>
          </div>
        </div>
      </Wrapper>
    );
  }
}

export default inject(STORE_ROOT)(observer(Selfie));
