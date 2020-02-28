import {inject, observer} from 'mobx-react';
import React from 'react';
import {RootStoreProps} from '../../App';
import DocumentSelector from '../../components/DocumentSelector';
import {AnalyticsEvent} from '../../constants/analyticsEvents';
import {STORE_ROOT} from '../../constants/stores';

export class IdentityPassport extends React.Component<RootStoreProps> {
  private readonly kycStore = this.props.rootStore!.kycStore;
  private readonly analyticsService = this.props.rootStore!.analyticsService;

  render() {
    const rejectedPoiPassportImage = this.kycStore.rejectedDocuments
      .IDENTITY_PASSPORT;
    return (
      <div className="identity-form">
        <div className="mt-30">
          <DocumentSelector
            analyticsService={this.analyticsService}
            fromCamera={true}
            maxFileSize={3}
            accept={[]}
            rejectedImage={rejectedPoiPassportImage}
            onDocumentTaken={document => {
              this.kycStore.setDocument('IDENTITY_PASSPORT', document);
            }}
            onDocumentClear={() => {
              this.kycStore.clearDocument('IDENTITY_PASSPORT');
              this.analyticsService.track(AnalyticsEvent.Kyc.RetakePhoto('ID'));
            }}
            rules={
              <ul>
                <li>
                  Upload a clear and legible picture of the main page of your
                  Passport
                </li>
              </ul>
            }
          />
        </div>
      </div>
    );
  }
}

export default inject(STORE_ROOT)(observer(IdentityPassport));
