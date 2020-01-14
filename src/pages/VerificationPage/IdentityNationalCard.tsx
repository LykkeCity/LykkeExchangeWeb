import classnames from 'classnames';
import {inject, observer} from 'mobx-react';
import React from 'react';
import {RootStoreProps} from '../../App';
import DocumentSelector from '../../components/DocumentSelector';

import {STORE_ROOT} from '../../constants/stores';

interface IdentityNationalCardState {
  activeSide: 'FRONT' | 'BACK';
}

export class IdentityNationalCard extends React.Component<
  RootStoreProps,
  IdentityNationalCardState
> {
  frontSideSelector: any;
  backSideSelector: any;
  state = {activeSide: 'FRONT'} as IdentityNationalCardState;
  private readonly kycStore = this.props.rootStore!.kycStore;

  render() {
    const activeSide = this.state.activeSide;
    const rejectedPoiCardImage = this.kycStore.rejectedDocuments
      .IDENTITY_NATIONAL_CARD;
    const rules = (
      <ul>
        <li>
          Upload a clear and legible picture of{' '}
          {activeSide === 'FRONT' ? 'front' : 'back'} side of your National ID
        </li>
      </ul>
    );
    return (
      <div className="identity-form">
        <div className="tab-buttons">
          <div
            className={classnames({
              active: activeSide === 'FRONT',
              'tab-button': true
            })}
            onClick={() => {
              if (!this.kycStore.verificationDocuments.IDENTITY_NATIONAL_BACK) {
                this.backSideSelector.turnOffCamera();
              }
              this.setState({activeSide: 'FRONT'});
            }}
          >
            <span className="number">1</span>
            <span className="text">Front side</span>
          </div>
          <div
            className={classnames({
              active: activeSide === 'BACK',
              'tab-button': true
            })}
            onClick={() => {
              if (
                !this.kycStore.verificationDocuments.IDENTITY_NATIONAL_FRONT
              ) {
                this.frontSideSelector.turnOffCamera();
              }
              this.setState({activeSide: 'BACK'});
            }}
          >
            <span className="number">2</span>
            <span className="text">Back side</span>
          </div>
        </div>
        <div className="mt-30">
          <div style={{display: activeSide === 'FRONT' ? 'block' : 'none'}}>
            <DocumentSelector
              ref={ref => (this.frontSideSelector = ref)}
              fromCamera={true}
              maxFileSize={3}
              rejectedImage={rejectedPoiCardImage}
              accept={[]}
              onDocumentTaken={document => {
                this.kycStore.setDocument('IDENTITY_NATIONAL_FRONT', document);
              }}
              onDocumentClear={() => {
                this.kycStore.clearDocument('IDENTITY_NATIONAL_FRONT');
              }}
              rules={rules}
            />
          </div>
          <div style={{display: activeSide === 'BACK' ? 'block' : 'none'}}>
            <DocumentSelector
              ref={ref => (this.backSideSelector = ref)}
              fromCamera={true}
              maxFileSize={3}
              accept={[]}
              onDocumentTaken={document => {
                this.kycStore.setDocument('IDENTITY_NATIONAL_BACK', document);
              }}
              onDocumentClear={() => {
                this.kycStore.clearDocument('IDENTITY_NATIONAL_BACK');
              }}
              rules={rules}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default inject(STORE_ROOT)(observer(IdentityNationalCard));
