import {inject} from 'mobx-react';
import * as React from 'react';
import {withRouter} from 'react-router';
import {RootStoreProps} from '../../../App';

import './style.css';

export const Subscribe = ({labels}: any) => (
  <div className="block_subscribe">
    <h5 className="block_subscribe__title">{labels.Title}</h5>
    <p className="hint">{labels.Details}</p>

    <form className="form">
      <div className="form-group">
        <div className="input-group">
          <i className="icon icon--email" />
          <input
            type="email"
            placeholder={labels.EmailAddress}
            className="form-control"
          />
        </div>
        <button className="btn btn-sm btn--primary btn--circle" type="button">
          <i className="icon icon--arrow-right-alt" />
        </button>
      </div>
    </form>
  </div>
);

export default withRouter(
  inject(({rootStore}: RootStoreProps) => ({
    labels: rootStore!.localizationStore.i18nSubscribe
  }))(Subscribe)
);
