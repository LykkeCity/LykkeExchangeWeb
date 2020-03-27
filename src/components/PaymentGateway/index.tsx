import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {RouteComponentProps} from 'react-router-dom';
import {RootStoreProps} from '../../App';
import {
  ROUTE_DEPOSIT_CREDIT_CARD_FAIL,
  ROUTE_DEPOSIT_CREDIT_CARD_SUCCESS,
  ROUTE_WALLETS_TRADING
} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';

import './style.css';

export interface PaymentGatewayProps
  extends RootStoreProps,
    RouteComponentProps<any> {}

export class PaymentGateway extends React.Component<PaymentGatewayProps> {
  readonly depositStore = this.props.rootStore!.depositStore;

  componentDidMount() {
    if (!this.depositStore.gatewayUrls.paymentUrl) {
      this.props.history.goBack();
    }

    window.scrollTo(0, 0);
  }

  render() {
    return (
      <div className="payment-gateway">
        <iframe
          sandbox="allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts allow-top-navigation allow-top-navigation-by-user-activation"
          onLoad={this.handleIframeLoaded}
          src={this.depositStore.gatewayUrls.paymentUrl}
        />
      </div>
    );
  }

  private handleIframeLoaded = (e: React.SyntheticEvent<HTMLIFrameElement>) => {
    try {
      const currentUrl = e.currentTarget.contentWindow.location.href;
      const redirectUrls = {
        [this.depositStore.gatewayUrls
          .okUrl]: ROUTE_DEPOSIT_CREDIT_CARD_SUCCESS,
        [this.depositStore.gatewayUrls.failUrl]: ROUTE_DEPOSIT_CREDIT_CARD_FAIL,
        [this.depositStore.gatewayUrls.cancelUrl]: ROUTE_WALLETS_TRADING
      };
      const redirectUrl = redirectUrls[currentUrl];

      if (redirectUrl) {
        this.props.history.replace(redirectUrl);
      }
    } catch (err) {
      // Can't access iframe URL
    }
  };
}

export default inject(STORE_ROOT)(observer(PaymentGateway));
