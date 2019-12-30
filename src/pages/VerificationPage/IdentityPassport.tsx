import {inject, observer} from 'mobx-react';
import React from 'react';
import {RootStoreProps} from '../../App';
import DocumentSelector from '../../components/DocumentSelector';
import {STORE_ROOT} from '../../constants/stores';

export class IdentityPassport extends React.Component<RootStoreProps> {
  private readonly kycStore = this.props.rootStore!.kycStore;
  render() {
    const rejectedPoiPassportImage = this.kycStore.rejectedDocuments
      .IDENTITY_PASSPORT;
    return (
      <div className="identity-form">
        <div className="tab-buttons">
          <div className="tab-button active">
            <span className="text">Frontside of Passport</span>
          </div>
        </div>
        <div className="mt-30">
          <DocumentSelector
            fromCamera={true}
            maxFileSize={3}
            accept={[]}
            rejectedImage={rejectedPoiPassportImage}
            onDocumentTaken={document => {
              this.kycStore.setDocument('IDENTITY_PASSPORT', document);
            }}
            onDocumentClear={() => {
              this.kycStore.clearDocument('IDENTITY_PASSPORT');
            }}
            rules={
              <ul>
                <li>
                  Both sides of driving license should display a photograph,
                  full name and date of birth
                </li>
                <li>
                  Image should cover the entire document, be well lit and in
                  focus
                </li>
                <li>
                  Driving license and Proof of Address should be separate
                  documents
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
