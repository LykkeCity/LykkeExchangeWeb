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
            onPictureTaken={pictureBase64 => {
              this.kycStore.setPicture('IDENTITY_PASSPORT', pictureBase64);
            }}
            onPictureClear={() => {
              this.kycStore.clearPicture('IDENTITY_PASSPORT');
            }}
            rules={
              <div>
                <div>
                  • Both sides of driving license should display a photograph,
                  full name and date of birth
                </div>
                <div>
                  • Image should cover the entire document, be well lit and in
                  focus
                </div>
                <div>
                  • Driving license and Proof of Address should be separate
                  documents
                </div>
              </div>
            }
          />
        </div>
      </div>
    );
  }
}

export default inject(STORE_ROOT)(observer(IdentityPassport));
