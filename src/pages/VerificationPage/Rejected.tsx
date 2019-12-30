import {inject, observer} from 'mobx-react';
import React from 'react';
import {Link} from 'react-router-dom';
import {RootStoreProps} from '../../App';
import {STORE_ROOT} from '../../constants/stores';

export const Rejected: React.SFC<RootStoreProps> = ({rootStore}) => {
  return (
    <div>
      <div className="verification-page__big-title">
        <div className="mt-30">Account not approved</div>
      </div>
      <div className="verification-page__content">
        We are terribly sorry, but we cannot approve your account based on the
        data you provided.
        <div className="mt-30 mb-30">
          <Link to="/" className="btn">
            OK
          </Link>
        </div>
      </div>
    </div>
  );
};

export default inject(STORE_ROOT)(observer(Rejected));
