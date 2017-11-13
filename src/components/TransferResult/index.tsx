import {Icon} from 'antd';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {Link, RouteComponentProps} from 'react-router-dom';
import {ROUTE_WALLETS} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';
import './style.css';

export const TransferResult: React.SFC<RouteComponentProps<any>> = props => {
  const {amount, asset} = props.location.state;
  return (
    <div className="transfer-result">
      <Icon
        type="check-circle"
        style={{color: 'limegreen', fontSize: '64px'}}
      />
      <div className="transfer-result__desc">
        Your transfer transaction has been successfully broadcasted. We will
        notify you when it will be confirmed.
      </div>
      <div className="transfer-result__amount">
        {amount} {asset}
      </div>
      {
        // TODO
      }
      {/* <div className="transfer-result__actions">
        <div className="actions_list">
          <div className="actions_list__item">
            <button type="button" className="action_link">
              <i className="icon icon--details" />
              View details
            </button>
          </div>
          <div className="actions_list__item">
            <button type="button" className="action_link">
              <i className="icon icon--repeat" />
              Repeat operation
            </button>
          </div>
          <div className="actions_list__item">
            <button type="button" className="action_link">
              <i className="icon icon--save_template" />
              Save to templates
            </button>
          </div>
        </div>
      </div> */}
      <div className="transfer-result__button">
        <Link to={ROUTE_WALLETS} className="btn btn--primary">
          Go back to wallets
        </Link>
      </div>
    </div>
  );
};

export const TransferFail: React.SFC<RouteComponentProps<any>> = ({
  location: {state: {reason}}
}) => {
  return (
    <div className="transfer-result">
      <Icon type="close-circle" style={{color: 'red', fontSize: '64px'}} />
      <div className="transfer-result__desc">
        Your transfer transaction has been {reason}.
      </div>
      <div className="transfer-result__button">
        <Link to={ROUTE_WALLETS} className="btn btn--primary">
          Go back to wallets
        </Link>
      </div>
    </div>
  );
};

export default inject(STORE_ROOT)(observer(TransferResult));
