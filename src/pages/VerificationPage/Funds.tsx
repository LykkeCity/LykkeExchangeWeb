import {inject, observer} from 'mobx-react';
import React from 'react';
import {RootStoreProps} from '../../App';
import DocumentSelector, {
  SelectorMode
} from '../../components/DocumentSelector';
import {RejectionWidget, Wrapper} from '../../components/Verification';
import {AnalyticsEvent} from '../../constants/analyticsEvents';
import {STORE_ROOT} from '../../constants/stores';

export class Funds extends React.Component<RootStoreProps> {
  private readonly kycStore = this.props.rootStore!.kycStore;
  private readonly analyticsService = this.props.rootStore!.analyticsService;

  render() {
    const rejectReason = this.kycStore.getPofRejectReason;
    const rejectedPofImage = this.kycStore.rejectedDocuments.FUNDS;
    const fileUploadLoading = this.kycStore.fileUploadLoading;
    return (
      <Wrapper loading={fileUploadLoading}>
        <div className="verification-page__big-title">
          Proof of funds verification
        </div>
        <div className="verification-page__content">
          Upload a clear and legible picture of your documents
          {rejectReason && (
            <div className="mt-30">
              <RejectionWidget text={rejectReason} />
            </div>
          )}
          <div className="mt-30">
            <DocumentSelector
              analyticsService={this.analyticsService}
              fromCamera={true}
              fromLibrary={true}
              maxFileSize={3}
              rejectedImage={rejectedPofImage}
              accept={['.png', '.jpg', '.pdf', '.jpeg']}
              onDocumentTaken={(document: File, from: SelectorMode) => {
                this.kycStore.setDocument('FUNDS', document);

                if (from === 'LIBRARY') {
                  this.analyticsService.track(
                    AnalyticsEvent.Kyc.UploadFromGallery('POF')
                  );
                }
              }}
              onDocumentClear={() => {
                this.kycStore.clearDocument('FUNDS');
                this.analyticsService.track(
                  AnalyticsEvent.Kyc.RetakePhoto('POF')
                );
              }}
              rules={
                <ul>
                  <li>
                    Upload a clear and legible picture or scan of your signed
                    source of funds document
                  </li>
                  <li>
                    Check the examples of{' '}
                    <a
                      href="https://support.lykke.com/attachments/token/sB7uFvoJLXycPZBUkJnuC7rKk/?name=Source_of_wealth_guidelines.pdf"
                      target="_blank"
                      onClick={() => {
                        this.analyticsService.track(
                          AnalyticsEvent.Kyc.ViewAcceptableDocs
                        );
                      }}
                    >
                      acceptable documents
                    </a>{' '}
                    here
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
                disabled={this.kycStore.shouldDisableFundsSubmitButton}
                onClick={async () => {
                  this.analyticsService.track(
                    AnalyticsEvent.Kyc.SubmitPhoto('POF')
                  );
                  await this.kycStore.uploadProofOfFunds();
                }}
              />
            </div>
          </div>
        </div>
      </Wrapper>
    );
  }
}

export default inject(STORE_ROOT)(observer(Funds));
