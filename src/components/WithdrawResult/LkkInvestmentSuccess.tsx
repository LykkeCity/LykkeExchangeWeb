import {Icon} from '@lykkex/react-components';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {Link, RouteComponentProps} from 'react-router-dom';
import {RootStoreProps} from '../../App';
import {ROUTE_LKK_INVESTMENT} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';

import './style.css';

export class LkkInvestmentSuccess extends React.Component<
  RootStoreProps & RouteComponentProps<any>
> {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    return (
      <div className="withdraw-result">
        <Icon
          className="withdraw-result__icon withdraw-result__icon_success"
          type="check_circle"
        />
        <div className="withdraw-result__desc">
          Your request is now being processed by our team. They will be in touch
          shortly.
        </div>
        <div className="withdraw-result__button">
          <Link to={ROUTE_LKK_INVESTMENT} className="btn btn--primary">
            Go back
          </Link>
        </div>
      </div>
    );
  }
}

export default inject(STORE_ROOT)(observer(LkkInvestmentSuccess));
