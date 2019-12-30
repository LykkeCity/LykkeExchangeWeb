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
          {activeSide === 'FRONT' ? 'front' : 'back'} side of your National Id
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
              this.setState({activeSide: 'FRONT'});
            }}
          >
            <span className="number">1</span>
            <span className="text">Frontside of ID card</span>
          </div>
          <div
            className={classnames({
              active: activeSide === 'BACK',
              'tab-button': true
            })}
            onClick={() => {
              this.setState({activeSide: 'BACK'});
            }}
          >
            <span className="number">2</span>
            <span className="text">Backside of ID card</span>
          </div>
        </div>
        <div className="mt-30">
          <div style={{display: activeSide === 'FRONT' ? 'block' : 'none'}}>
            <DocumentSelector
              fromCamera={true}
              maxFileSize={3}
              rejectedImage={rejectedPoiCardImage}
              accept={[]}
              onPictureTaken={pictureBase64 => {
                this.kycStore.setPicture(
                  'IDENTITY_NATIONAL_FRONT',
                  pictureBase64
                );
              }}
              onPictureClear={() => {
                this.kycStore.clearPicture('IDENTITY_NATIONAL_FRONT');
              }}
              rules={rules}
            />
          </div>
          <div style={{display: activeSide === 'BACK' ? 'block' : 'none'}}>
            <DocumentSelector
              fromCamera={true}
              maxFileSize={3}
              accept={[]}
              onPictureTaken={pictureBase64 => {
                this.kycStore.setPicture(
                  'IDENTITY_NATIONAL_BACK',
                  pictureBase64
                );
              }}
              onPictureClear={() => {
                this.kycStore.clearPicture('IDENTITY_NATIONAL_BACK');
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
