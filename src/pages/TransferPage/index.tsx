import 'antd/lib/modal/style';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {RouteComponentProps} from 'react-router-dom';
import {RootStoreProps} from '../../App';
import {NumberFormat} from '../../components/NumberFormat';
import TransferForm from '../../components/TransferForm/index';
import TransferQrWindow from '../../components/TransferQrWindow';
import {config} from '../../config';
import {
  ROUTE_TRANSFER_FAIL,
  ROUTE_TRANSFER_SUCCESS
} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';
import {OpStatus, TransferModel} from '../../models';
import './style.css';

interface TransferPageProps extends RootStoreProps, RouteComponentProps<any> {}

export class TransferPage extends React.Component<TransferPageProps> {
  readonly walletStore = this.props.rootStore!.walletStore;
  readonly transferStore = this.props.rootStore!.transferStore;
  readonly uiStore = this.props.rootStore!.uiStore;

  componentDidMount() {
    const {walletId, dest} = this.props.match.params;
    const wallet = this.walletStore.findWalletById(walletId);

    if (!!wallet) {
      if (dest === 'from') {
        this.transferStore.newTransfer.setWallet(wallet, dest);
        this.transferStore.newTransfer.setWallet(
          this.walletStore.createWallet(),
          'to'
        );
      } else {
        this.transferStore.newTransfer.setWallet(wallet, dest);
        this.transferStore.newTransfer.setWallet(
          this.walletStore.createWallet(),
          'from'
        );
      }
    } else {
      this.transferStore.resetCurrentTransfer();
    }

    window.scrollTo(0, 0);
  }

  // componentWillUnmount() {}

  render() {
    const {newTransfer} = this.transferStore;
    return (
      <div className="container">
        <div className="transfer">
          <h1>Transfer</h1>
          <h2>
            <NumberFormat value={newTransfer.amount} /> {newTransfer.asset}
          </h2>
          <p className="transfer__text">
            To transfer any asset to other wallet please fill in the form.
          </p>
          <TransferForm onTransfer={this.handleTransfer} />
          <div className="transfer__text transfer__text--center">
            If you have any other problem contact{' '}
            <a href="mailto:support@lykke.com">our support</a>
          </div>
          <TransferQrWindow />
        </div>
      </div>
    );
  }

  private readonly handleTransfer = async (transfer: TransferModel) => {
    let k = 0;
    let j = 0;
    const timeout = 1000;
    const poll = () => {
      if (this.transferStore.newTransfer.amount === 0) {
        return;
      }
      k = k + 1;
      const operationIsTooLong = k > 30;
      const fromConfirmedToCompletedIsTooLong =
        j * timeout > (config.operationIdleTime || 5 * timeout);
      setTimeout(async () => {
        const op = await this.transferStore.fetchOperationDetails(transfer);
        const {amount, asset} = transfer;
        switch (op.Status) {
          case OpStatus.Completed:
            this.transferStore.finishTransfer(transfer);
            await this.walletStore.fetchWallets();
            this.uiStore.closeQrWindow();
            this.props.history.replace(ROUTE_TRANSFER_SUCCESS, {amount, asset});
            break;
          case OpStatus.Canceled:
            if (this.transferStore.newTransfer.amount > 0) {
              this.transferStore.resetCurrentTransfer();
              this.uiStore.closeQrWindow();
              this.props.history.replace(ROUTE_TRANSFER_FAIL, {
                reason: 'canceled'
              });
            }
            break;
          case OpStatus.Confirmed:
            j = j + 1;
            if (fromConfirmedToCompletedIsTooLong) {
              this.resetAndFail('idled', false);
            } else {
              poll();
            }
          default:
            if (operationIsTooLong) {
              this.resetAndFail('failed');
            } else {
              poll();
            }
            break;
        }
      }, timeout);
    };
    poll();
  };

  private resetAndFail = (reason: string, shouldCancel: boolean = true) => {
    if (shouldCancel) {
      this.transferStore.newTransfer.cancel();
    }
    this.transferStore.resetCurrentTransfer();
    this.uiStore.closeQrWindow();
    this.props.history.replace(ROUTE_TRANSFER_FAIL, {
      reason
    });
  };
}

export default inject(STORE_ROOT)(observer(TransferPage));
