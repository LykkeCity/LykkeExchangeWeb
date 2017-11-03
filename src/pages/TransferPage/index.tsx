import 'antd/lib/modal/style';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {RouteComponentProps} from 'react-router-dom';
import {RootStoreProps} from '../../App';
import {NumberFormat} from '../../components/NumberFormat';
import TransferBar from '../../components/TransferBar';
import TransferForm from '../../components/TransferForm/index';
import TransferQrWindow from '../../components/TransferQrWindow';
import {STORE_ROOT} from '../../constants/stores';
import {TransferModel} from '../../models';
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
      this.transferStore.newTransfer.setWallet(wallet, dest);
    }
  }

  render() {
    const {newTransfer} = this.transferStore;
    return (
      <div className="transfer">
        <h1>Transfer</h1>
        <h2>
          <NumberFormat value={newTransfer.amount} /> {newTransfer.asset}
        </h2>
        <p className="transfer__text">
          To transfer any asset to other wallet please fill in the form.
        </p>
        <TransferBar />
        <TransferForm onTransfer={this.handleTransfer} />
        <div className="transfer__text transfer__text--center">
          If you have any other problem contact{' '}
          <a href="mailto:support@lykke.com">our support</a>
        </div>
        <TransferQrWindow />
      </div>
    );
  }

  private readonly handleTransfer = async (transfer: TransferModel) => {
    this.uiStore.toggleQrWindow();
  };

  // private readonly handleOkTransfer = (transfer: TransferModel) => {
  //   this.props.history.replace(`${ROUTE_TRANSFER}/success`, {
  //     amount: transfer.amount // TODO: replace with transferStore
  //   });
  // };
}

export default inject(STORE_ROOT)(observer(TransferPage));
