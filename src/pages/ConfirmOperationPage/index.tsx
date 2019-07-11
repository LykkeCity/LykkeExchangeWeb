import classnames from 'classnames';
import {observable} from 'mobx';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {RouteComponentProps} from 'react-router-dom';
import {RootStoreProps} from '../../App';
import Spinner from '../../components/Spinner';
import {
  ROUTE_CONFIRM_OPERATION_ID,
  ROUTE_WITHDRAW_CRYPTO_FAIL,
  ROUTE_WITHDRAW_CRYPTO_SUCCESS
} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';
import {OpStatus} from '../../models';
import {moneyRound} from '../../utils';

// tslint:disable-next-line:no-var-requires
const TextMask = require('react-text-mask').default;

import './style.css';

interface ConfirmOperationPageProps
  extends RootStoreProps,
    RouteComponentProps<any> {}

export class ConfirmOperationPage extends React.Component<
  ConfirmOperationPageProps
> {
  readonly withdrawStore = this.props.rootStore!.withdrawStore;
  readonly assetStore = this.props.rootStore!.assetStore;
  readonly socketStore = this.props.rootStore!.socketStore;

  @observable socketSubscriptionId: string = '';

  readonly actions = {
    [OpStatus.Accepted]: () => {
      // TODO: Change when BE statuses fixed
      this.error = 'Code is not valid';
      this.isLoading = false;
    },
    [OpStatus.ConfirmationRequested]: () => {
      this.error = 'Code is not valid';
      this.isLoading = false;
    },
    [OpStatus.Completed]: () => {
      this.props.history.replace(ROUTE_WITHDRAW_CRYPTO_SUCCESS);
    },
    [OpStatus.Confirmed]: () => {
      this.props.history.replace(ROUTE_WITHDRAW_CRYPTO_SUCCESS);
    },
    [OpStatus.Failed]: () => {
      this.props.history.replace(ROUTE_WITHDRAW_CRYPTO_FAIL);
    }
  };

  @observable code: string = '';
  @observable isLoading: boolean = false;
  @observable isTimeout: boolean = false;
  @observable error: string = '';

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    const assetId = this.withdrawStore.withdrawCrypto.assetId;
    const asset = this.assetStore.getById(assetId);

    return (
      <div>
        <div className="container">
          <div className="confirm-operation">
            <div className="confirm-operation__title">
              Two-Factor Authentication (2FA)
            </div>
            <div className="confirm-operation__subtitle">
              {`${this.getTotalAmount(
                this.withdrawStore.withdrawCrypto.amount
              )} ${asset && asset.name}
                (including fee ${this.getFeeSize(
                  this.withdrawStore.withdrawCrypto.amount
                )}
                ${asset && asset.name})`}
            </div>
            <div className="confirm-operation__description">
              Please enter 2FA code to confirm withdraw of{' '}
              {this.withdrawStore.withdrawCrypto.amount} {asset && asset.name}:
            </div>
            <div className="confirm-operation-form">
              <div
                className={classnames('form-group', {
                  'has-error': !!this.error || this.isTimeout
                })}
              >
                <label htmlFor="code" className="control-label">
                  2FA Code
                </label>
                <div className="error-bar" />
                <TextMask
                  className="form-control"
                  mask={[/\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/]}
                  name="code"
                  id="code"
                  guide={false}
                  // tslint:disable-next-line:jsx-no-lambda
                  onChange={(e: any) =>
                    (this.code = e.currentTarget.value.replace(' ', ''))}
                  value={this.code}
                />
                {this.error && <span className="help-block">{this.error}</span>}
                {this.isTimeout && (
                  <span className="help-block">
                    Operation timeout.{' '}
                    <a href="#" onClick={this.handleTryAgain}>
                      Try again
                    </a>
                  </span>
                )}
              </div>
              <div className="confirm-operation-form__actions">
                <input
                  type="submit"
                  value="Confirm"
                  className="btn btn--primary"
                  onClick={this.handleSubmit}
                  disabled={this.isLoading || this.isTimeout || !this.code}
                />
                {this.isLoading && <Spinner />}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  private handleTryAgain = async (e: any) => {
    e.preventDefault();
    const operationId = await this.withdrawStore.sendWithdrawCryptoRequest(
      this.withdrawStore.withdrawCrypto.assetId,
      this.withdrawStore.withdrawCrypto
    );
    this.props.history.replace(ROUTE_CONFIRM_OPERATION_ID(operationId));
  };

  private listenSocket = async () => {
    const {operationId} = this.props.match.params;

    const TIMEOUT_LIMIT = 10000;
    const socketTimeout = window.setTimeout(
      this.handleSocketTimeout,
      TIMEOUT_LIMIT
    );

    const OPERATIONS_TOPIC = 'operations';
    const subscription = await this.socketStore.subscribe(
      OPERATIONS_TOPIC,
      (res: [{OperationId: string; Status: string}]) => {
        const {OperationId: id, Status: status} = res[0];

        if (id === operationId) {
          window.clearTimeout(socketTimeout);
          this.actions[status]();
        }
      }
    );
    this.socketSubscriptionId = subscription.id;
  };

  private handleSocketTimeout = async () => {
    const OPERATIONS_TOPIC = 'operations';
    const {operationId} = this.props.match.params;
    this.socketStore.unsubscribe(OPERATIONS_TOPIC, this.socketSubscriptionId);
    const operation = await this.withdrawStore.fetchWithdrawOperation(
      operationId
    );
    if (operation && operation.Status && this.actions[operation.Status]) {
      this.actions[operation.Status]();
    } else {
      this.props.history.replace(ROUTE_WITHDRAW_CRYPTO_FAIL);
    }
  };

  private handleSubmit = async () => {
    const {operationId} = this.props.match.params;
    this.isLoading = true;
    this.error = '';

    this.listenSocket();

    this.withdrawStore.confirmWithdrawCryptoRequest(operationId, this.code);
  };

  private getFeeSize(amount: number) {
    const assetId = this.withdrawStore.withdrawCrypto.assetId;
    const asset = this.assetStore.getById(assetId);
    let fee = 0;

    if (this.withdrawStore.absoluteFee) {
      fee = this.withdrawStore.absoluteFee;
    }

    if (this.withdrawStore.relativeFee) {
      fee = this.withdrawStore.relativeFee * amount;
    }

    return moneyRound(fee, asset && asset.accuracy);
  }

  private getTotalAmount(amount: number) {
    const assetId = this.withdrawStore.withdrawCrypto.assetId;
    const asset = this.assetStore.getById(assetId);
    return moneyRound(
      Number(amount) + this.getFeeSize(amount),
      asset && asset.accuracy
    );
  }
}

export default inject(STORE_ROOT)(observer(ConfirmOperationPage));
