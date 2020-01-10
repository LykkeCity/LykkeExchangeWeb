import {inject, observer} from 'mobx-react';
import React from 'react';
import {Link} from 'react-router-dom';
import {RootStoreProps} from '../../App';
import {Wrapper} from '../../components/Verification';
import {STORE_ROOT} from '../../constants/stores';

export const NeedToFillData: React.SFC<RootStoreProps> = ({rootStore}) => {
  const kycStore = rootStore!.kycStore;
  const tierInfo = kycStore.tierInfo;
  if (!tierInfo) {
    return null;
  }
  const requestUpgradeLimitLoading = kycStore.requestUpgradeLimitLoading;
  const getRejectedDocumentList = kycStore.getRejectedDocumentList;
  return (
    <Wrapper>
      <div className="verification-page__big-title">Almost there!</div>
      <div className="verification-page__content mt-30">
        We just need clarification on the following before taking the next
        steps:
        <div className="mt-30">
          {getRejectedDocumentList.map(document => (
            <div key={document}>{document}</div>
          ))}
        </div>
        <div className="mt-30 mb-30">
          <Link className="btn btn--stroke" to="/profile">
            Maybe later
          </Link>
          <button
            className="btn"
            style={{marginLeft: 20}}
            onClick={() => {
              kycStore.setShowForm(true);
            }}
            disabled={requestUpgradeLimitLoading}
          >
            Update Now
          </button>
        </div>
      </div>
    </Wrapper>
  );
};

export default inject(STORE_ROOT)(observer(NeedToFillData));
