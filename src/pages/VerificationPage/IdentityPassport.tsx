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
